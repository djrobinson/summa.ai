import { atom, atomFamily, selectorFamily } from "recoil";

export const apiKeyState = atom({
  key: 'apiKeyState', // unique ID (with respect to other atoms/selectors)
  default: '', // default value (aka initial value)
});

export const requestsState = atom({
  key: 'requestsState', // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});

export const showRequestManagerState = atom({
  key: 'showRequestManagerState', // unique ID (with respect to other atoms/selectors)
  default: true, // default value (aka initial value)
});

const runPrompt = async (prompt) => {
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
    // const objRes = await createObject("Intermediate", {
    //   text: res.choices[0].message.content,
    // });
    // await createRelationship(
    //   "Phase",
    //   phaseID,
    //   "intermediates",
    //   "Intermediate",
    //   objRes.id,
    //   "phase"
    // );
    // await createRelationship(
    //   "Intermediate",
    //   contextID,
    //   "sourceFor",
    //   "Intermediate",
    //   objRes.id,
    //   "source"
    // );
    // console.log("created rel for AI result");
    return res.choices[0].message.content;
  } catch (e) {
    console.error("COULD NOT SEARCH: ", e);
  }
};

export const requestState = atomFamily({
  key: 'requestState', // unique ID (with respect to other atoms/selectors)
  default: selectorFamily({
    key: 'requestStateDefault',
    get: (requestId) => ({ get }) => {
      console.log("Running in requestStateDefault in atom!!!")
      const requests = get(requestsState)
      const request = requests.find(r => r.id === requestId);
      if (!request) {
        return {};
      }
      return { id: request.id, status: 'PENDING', data: request.prompt, result: null };
    },
  }),
  effects: (requestId) => [
    ({ setSelf, onSet }) => {
      onSet((newValue, oldValue) => {
        console.log("Running in onset in atom!!!", newValue, oldValue)
        if (newValue.status === 'RUNNING' && oldValue.status !== 'RUNNING') {
          console.log('WE GOING!')
          const go = async () => {
            try {
              const res = await runPrompt(newValue.data);
              console.log("RES: ", res);
              setSelf(prevR => ({...prevR, status: 'DONE', result: res}));
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