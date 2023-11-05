import axios from "axios";
import { atom, atomFamily, selector, selectorFamily } from "recoil";
import { buildSimpleGraphQLQuery } from "../utils/graphqlBuilder";
import { getUnixNow } from "../utils/timeUtils";
import {
  batchCreate,
  createOneToMany,
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
                res = handleCombineSplit(phaseData, newValue.phaseID);
              }
              if (newValue.type === "SPLIT") {
                res = handleCombineSplit(phaseData, newValue.phaseID);
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

const handleCombineSplit = async (phaseData, phaseID) => {
  console.log("handle Combine Split Request");
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
