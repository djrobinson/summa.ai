import axios from "axios";
import { atom, atomFamily, selector, selectorFamily } from "recoil";
import { buildSimpleGraphQLQuery } from "../utils/graphqlBuilder";
import { getUnixNow } from "../utils/timeUtils";
import { getTokenCount, isValidLength } from "../utils/tokenHelpers";
import {
  batchCreate,
  createObject,
  createOneToMany,
  createRelationship,
  getBatchByID,
} from "../utils/weaviateServices";

export const showBatchManagerState = atom({
  key: "showBatchManagerState",
  default: false,
});

const runBatch = async (phaseID, intermediates) => {
  try {
    console.log("created rel for batch");
  } catch (e) {
    console.error("COULD NOT BATCH: ", e);
  }
};

// Batchs will maintain a list of prompts to run, but not their current status
// Current status will be maintained in the batchState atom along with the result
// Sample:
// {
//   phaseid: 'This is a message',
//   type: 'FILTER_SORT
//   id: '1123-123',
// }
export const batchesState = atom({
  key: "batchesState",
  default: [],
});

export const pendingBatchesState = selector({
  key: "pendingBatchesState",
  get: ({ get }) => {
    const batches = get(batchesState);
    return batches
      .filter((r) => get(batchState(r.id)).status === "PENDING")
      .map((r) => get(batchState(r.id)));
  },
  default: [],
});

export const runningBatchesState = selector({
  key: "runningBatchesState",
  get: ({ get }) => {
    const batches = get(batchesState);
    return batches
      .filter((r) => get(batchState(r.id)).status === "RUNNING")
      .map((r) => get(batchState(r.id)));
  },
  default: [],
});

export const doneBatchesState = selector({
  key: "doneBatchesState",
  get: ({ get }) => {
    const batches = get(batchesState);
    return batches
      .filter((r) => get(batchState(r.id)).status === "DONE")
      .map((r) => get(batchState(r.id)));
  },
  default: [],
});

export const erroredBatchesState = selector({
  key: "erroredBatchesState",
  get: ({ get }) => {
    const batches = get(batchesState);
    return batches
      .filter((r) => get(batchState(r.id)).status === "ERROR")
      .map((r) => get(batchState(r.id)));
  },
  default: [],
});

export const allBatchStatuses = selector({
  key: "allBatchStatuses",
  get: ({ get }) => {
    const batches = get(batchesState);
    const all = batches.map((r) => get(batchState(r.id)));
    return all;
  },
  default: [],
});

// Batchstate will copy all batchesState, adding in PENDING for new batches
// This will actually run the prompt and update the status to DONE/ERROR
export const batchState = atomFamily({
  key: "batchState",
  default: selectorFamily({
    key: "batchStateDefault",
    get:
      (batchId) =>
      ({ get }) => {
        console.log("Running in batchStateDefault in atom!!!");
        const batches = get(batchesState);
        const batch = batches.find((r) => r.id === batchId);
        if (!batch) {
          return {};
        }
        return {
          id: batch.id,
          status: "PENDING",
          intermediates: batch.intermediates,
          phaseID: batch.phaseID,
          workflowID: batch.workflowID,
          type: batch.type,
          start: null,
          end: null,
        };
      },
  }),
  effects: (batchId) => [
    ({ setSelf, onSet }) => {
      onSet((newValue, oldValue) => {
        if (newValue.status === "RUNNING" && oldValue.status !== "RUNNING") {
          console.log("WE GOING!", newValue);
          const go = async () => {
            try {
              // GET FULL PHASES CONFIG FROM WEAVIATE
              const phaseData = (await getBatchByID("Phase", newValue.phaseID))
                .data.Get.Phase[0];
              let res = [];
              if (newValue.type === "FILTER_SORT") {
                res = handleFilterSortPhase(phaseData, newValue.phaseID);
              }
              if (newValue.type === "COMBINE") {
                res = handleCombinePhase(phaseData, newValue.phaseID);
              }
              if (newValue.type === "SPLIT") {
                res = handleSplitPhase(phaseData, newValue.phaseID);
              }
              setSelf((prevR) => ({
                ...prevR,
                status: "DONE",
                end: getUnixNow(),
                intermediates: res.data.data.Get.Intermediate,
              }));
            } catch (e) {
              console.log("DIDNT WORK: ", e);
            }
          };
          go();
        }
      });
    },
  ],
});

const handleCombinePhase = async (phaseData, phaseID) => {
  const intermediates = phaseData.intermediates;
  const joinChar = phaseData.joinCharacter;
  const joinedText = intermediates.reduce((acc, int) => {
    if (acc === "") return int.text;
    const yo = joinChar.replaceAll("\\n", "\n");
    console.log("YO ", yo);
    return acc + yo + int.text;
  }, "");
  console.log("handle Combine Split Request");
  console.log("JOINEDTEXT ", joinedText);
  const isSmall = isValidLength(joinedText);
  const size = getTokenCount(joinedText);
  console.log("IS IT SMALL?", size);
  if (isSmall) {
    const objRes = await createObject("Intermediate", {
      text: joinedText,
      order: 0,
    });
    await createRelationship(
      "Phase",
      phaseID,
      "intermediates",
      "Intermediate",
      objRes.id,
      "phase"
    );
    console.log("CREATED INTERMEDIATE FOR SMALL ONE!", objRes);
  } else {
    const res = await axios.post(
      "https://f5k974500j.execute-api.us-west-2.amazonaws.com/dev/fileupload",
      {
        identifier: phaseID,
        data: joinedText,
      },
      {
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );
    console.log("big res", res);
  }
  return [];
};

const handleSplitPhase = async (phaseData, phaseID) => {
  console.log("handle  Split Request");
  const res = await axios.post(
    "https://f5k974500j.execute-api.us-west-2.amazonaws.com/dev/readfile",
    {
      identifier: phaseData.source_id,
    },
    {
      headers: {
        "Content-Type": "text/plain",
      },
    }
  );
  const splitChar = phaseData.splitChar;
  const groupCount = phaseData.groupCount;
  const inputText = res.data.data;
  const splitText = inputText.split(phaseData.splitChar);
  const grouped = [];
  let currString = "";
  let currCount = 0;
  // console.log("Running htis", splitText);
  splitText.forEach((st) => {
    currCount++;
    currString += splitChar + st;
    if (currCount >= groupCount) {
      grouped.push(currString);
      currString = "";
      currCount = 0;
    }
  });
  const intermediates = grouped.map((s, i) => {
    return {
      text: s,
      order: i + 1,
    };
  });
  const batches = [];
  for (let i = 0; i < intermediates.length; i += 100) {
    batches.push(intermediates.slice(i, i + 100));
  }

  console.log("INTERMEDIATES: ", intermediates);
  for (let i = 0; i < batches.length; i++) {
    const res = await batchCreate("Intermediate", batches[i]);
    console.log("RES: ", i, res);
    const intermediateIDs = res.map((r) => r.id);
    await createOneToMany(
      "Phase",
      "Intermediate",
      phaseID,
      intermediateIDs,
      "intermediates",
      "dataSource"
    );
  }
  return [];
};

const handleFilterSortPhase = async (phaseData, phaseID) => {
  const pds = phaseData.searches || [];
  const searches = pds.map((dsr) => ({
    nearText: {
      path: dsr.objectPath,
      concept: dsr.value,
    },
  }));
  const search = searches.length ? searches[0] : {};
  const realQueryString = buildSimpleGraphQLQuery(
    {
      Intermediate: {
        type: "Intermediate",
        properties: ["text", "order", "phase"],
      },
      "Intermediate.phase": {
        type: "Phase",
        properties: ["title"],
      },
    },
    phaseData.filters,
    search,
    phaseData.sorts,
    phaseData.limit
  );
  const res = await axios.post(
    "http://localhost:8080/v1/graphql",
    {
      query: realQueryString,
    },
    {
      headers: {
        "X-Openai-Api-Key": localStorage.getItem("OPENAI_API_KEY"),
      },
    }
  );
  // CONSTRUCT THE APPROPRIATE INTERMEDIATES BASED ON TYPE
  // just gonna use weaviate svcs for the time being.
  console.log("we're doing batchstate thing!", realQueryString, res);
  //   Finally, batch create the intermediates for the current phase.

  // if (!isEmpty(data) && !combine) {
  // localStorage.setItem(phase._additional.id, finalString);
  const inters = res.data.data.Get.Intermediate;
  const restructured = inters.map((c, i) => ({
    text: c.text,
    order: i + 1,
  }));
  const batchres = await batchCreate("Intermediate", restructured);
  console.log("batch res ", batchres);
  const intermediateIDs = batchres.map((r) => r.id);
  await createOneToMany(
    "Phase",
    "Intermediate",
    phaseID,
    intermediateIDs,
    "intermediates",
    "phase"
  );
  return res.data.data.Get.Intermediate || [];
};
