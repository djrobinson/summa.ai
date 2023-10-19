import { atom, atomFamily, selectorFamily, selector } from "recoil";
import { getTokenCount } from "../utils/tokenHelpers";
import { getUnixNow } from "../utils/timeUtils";
import { createObject, createRelationship } from "../utils/weaviateServices";

export const apiKeyState = atom({
  key: 'apiKeyState', 
  default: '',
});



export const showRequestManagerState = atom({
  key: 'showRequestManagerState', 
  default: false,
});

export const runningTokenCountState = atom({
  key: 'runningTokenCountState',
  default: 0
})

const introspect = async (prompt, phaseID, sourceContextID) => {
  try {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
      }),
    };

    const response1 = await fetch(
      "https://f5k974500j.execute-api.us-west-2.amazonaws.com/dev/introspect",
      requestOptions
    );
    const res = await response1.json();
    console.log("What is introspect res: ", res);
  } catch (e) {
    console.error("COULD NOT SEARCH: ", e);
  }
}

const runPromptForReport = async (prompt, workflowID, phaseID) => {
  try {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
      }),
    };

    const response1 = await fetch(
      "https://f5k974500j.execute-api.us-west-2.amazonaws.com/dev/report",
      requestOptions
    );
    const res = await response1.json();
    console.log("What is res: ", res);
    if (!res.sentences) {
      return "";
    }
    // TODO: ALL OF THIS MOVES TO LAMBDA
    const objRes = await createObject("Report", {
      title: 'Report 10',
      text: res.sentences.join('\n\n'),
    });
    console.log('CREATED REPORT: ', workflowID, phaseID, objRes)
    await createRelationship(
      "Phase",
      phaseID,
      "reports",
      "Report",
      objRes.id,
      "phase"
    );

    await createRelationship(
      "Workflow",
      workflowID,
      "reports",
      "Report",
      objRes.id,
      "workflow"
    );

    console.log("created rel for AI result");
    return { res: res.sentences.join('\n\n'), reportID: objRes.id };
  } catch (e) {
    console.error("COULD NOT SEARCH: ", e);
  }
}

const runPrompt = async (prompt, phaseID, sourceContextID) => {
  try {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
      }),
    };
    const response1 = await fetch(
      "https://kdcwpoii3h.execute-api.us-west-2.amazonaws.com/dev/chat",
      requestOptions
    );
    const res = await response1.json();
    console.log("What is res: ", res);
    if (!res.choices) {
      return "";
    }
    const objRes = await createObject("Intermediate", {
      text: res.choices[0].message.content,
    });
    await createRelationship(
      "Phase",
      phaseID,
      "intermediates",
      "Intermediate",
      objRes.id,
      "phase"
    );
    if (sourceContextID) {
      await createRelationship(
        "Intermediate",
        sourceContextID,
        "sourceFor",
        "Intermediate",
        objRes.id,
        "source"
      );
    }
    console.log("created rel for AI result");
    return res.choices[0].message.content;
  } catch (e) {
    console.error("COULD NOT SEARCH: ", e);
  }
};

// Requests will maintain a list of prompts to run, but not their current status
// Current status will be maintained in the requestState atom along with the result
// Sample:
// {
//   title: 'Request 1',
//   prompt: 'This is a message',
//   id: '1',
// }
export const requestsState = atom({
  key: 'requestsState', 
  default: [],
});

export const pendingRequestsState = selector({
  key: 'pendingRequestsState',
  get: ({get}) => {
    const requests = get(requestsState);
    return requests.filter(r => get(requestState(r.id)).status === 'PENDING').map(r =>  get(requestState(r.id)))
  },
  default: [],
});

export const runningRequestsState = selector({
  key: 'runningRequestsState',
  get: ({get}) => {
    const requests = get(requestsState);
    return requests.filter(r => get(requestState(r.id)).status === 'RUNNING').map(r =>  get(requestState(r.id)))
  },
  default: [],
});

export const doneRequestsState = selector({
  key: 'doneRequestsState',
  get: ({get}) => {
    const requests = get(requestsState);
    return requests.filter(r => get(requestState(r.id)).status === 'DONE').map(r =>  get(requestState(r.id)))
  },
  default: [],
});

export const erroredRequestsState = selector({
  key: 'erroredRequestsState',
  get: ({get}) => {
    const requests = get(requestsState);
    return requests.filter(r => get(requestState(r.id)).status === 'ERROR').map(r =>  get(requestState(r.id)))
  },
  default: [],
});

export const allRequestStatuses = selector({
  key: 'allRequestStatuses',
  get: ({get}) => {
    const requests = get(requestsState);
    const all = requests.map(r => get(requestState(r.id)))
    return all
  },
  default: []
})


export const rateLimitState = atom({
  key: 'rateLimitState',
  default: 10000,
})


// Requeststate will copy all requestsState, adding in PENDING for new requests
// This will actually run the prompt and update the status to DONE/ERROR
export const requestState = atomFamily({
  key: 'requestState', 
  default: selectorFamily({
    key: 'requestStateDefault',
    get: (requestId) => ({ get }) => {
      console.log("Running in requestStateDefault in atom!!!")
      const requests = get(requestsState)
      const request = requests.find(r => r.id === requestId);
      if (!request) {
        return {};
      }
      return { id: request.id, status: 'PENDING', prompt: request.prompt, context: request.context, phaseID: request.phaseID, workflowID: request.workflowID, sourceContextID: request.id, type: request.type, result: null, start: null, end: null };
    },
  }),
  effects: (requestId) => [
    ({ setSelf, onSet }) => {
      onSet((newValue, oldValue) => {
        if (newValue.status === 'RUNNING' && oldValue.status !== 'RUNNING') {
          console.log('WE GOING!', newValue.type)
          const go = async () => {
            try {
              if (newValue.type === 'REPORT') {
                const { reportID, res } = await runPromptForReport(newValue.prompt + ' ' + newValue.context, newValue.workflowID, newValue.phaseID);
                console.log("RES: ", res);
                setSelf(prevR => ({...prevR, status: 'DONE', end: getUnixNow(), result: res, reportID}));
                return
              }
              if (newValue.type === 'INTROSPECT') {
                const { reportID, res } = await introspect(newValue.prompt + ' ' + newValue.context, newValue.phaseID, newValue.sourceContextID);
                console.log("RES: ", res);
                setSelf(prevR => ({...prevR, status: 'DONE', end: getUnixNow(), result: res, reportID}));
                return
              }
              const res = await runPrompt(newValue.prompt + ' ' + newValue.context, newValue.phaseID, newValue.sourceContextID);
              console.log("RES: ", res);
              setSelf(prevR => ({...prevR, status: 'DONE', end: getUnixNow(), result: res}));
            } catch (e) {
              console.log("DIDNT WORK: ", e);
            }
          };
          go();
        }
      })
    }
  ],
});


const clockEffect =
  (interval) => ({setSelf, trigger}) => {
    if (trigger === 'get') {
      setSelf(getUnixNow());
    }
    const timer = setInterval(() => setSelf(getUnixNow()), interval);
    return () => clearInterval(timer);
  };

/**
 * Atom that contains the current unix timestamp
 * Updates at the provided interval
 */
export const clockState = atomFamily({
  key: 'clockState',
  default: getUnixNow(),
  effects: (interval) => [clockEffect(interval)],
});



export const alertsState = selector({
  key: 'alertsState ',
  get: ({get}) => {
    const requests = get(requestsState);
    let allAlerts = []
    // Note, RUNNING is for testing only. Alerts should only apply to done or err
    const clearedAlerts = get(clearedAlertsState);
    for (const request of requests) {
      const r = get(requestState(request.id));
      if (r.status === 'RUNNING') {
        allAlerts.push({
          title: `Request ${r.id} is running`,
          message: 'This is a message',
          type: 'info',
          id: request.id,
        })
      }
      if (r.status === 'DONE' && clearedAlerts.indexOf(request.id) === -1) {
        const r = get(requestState(request.id));
        const removedAlerts = allAlerts.filter(a => a.id !== request.id)
        removedAlerts.push({
          title: `Request ${r.id} is done`,
          message: 'This is a message',
          type: 'success',
          id: request.id,
        })
        allAlerts = removedAlerts
      }
    }
    return allAlerts
  },
  default: [],
});

export const clearedAlertsState = atom({
  key: 'clearedAlertsState', 
  default: [],
});

export const enhanceRequestsState = atom({
  key: 'enhanceRequestsState', 
  default: {}
})

export const enhanceRequestState = selector({
  key: 'enhanceRequestResultsState',
  default: null,
  get: ({get}) => {
    const enhanceRequests = get(enhanceRequestsState);
    if (!enhanceRequests) {
      return null
    }
    return enhanceRequests
  }
})

export const enhanceRequestResultsState = selectorFamily({
  key: 'enhanceRequestResultsState',
  get: (sentenceHash) => ({get}) => {
    const enhanceRequests = get(enhanceRequestsState);
    if (!enhanceRequests) {
      return null
    }
    const enhanceRequestIDs = enhanceRequests[sentenceHash]
    if (!enhanceRequestIDs) {
      return null
    }
    const results = enhanceRequestIDs.reduce((acc, id) => {
      const res = get(requestState(id)).result
      if (!res) {
        return {
          ...acc,
          [id]: null
        }
      }
      return {
        ...acc,
        [id]: JSON.parse(res)
      }
    }, {})
    return results
  },
});