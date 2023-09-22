import { atom, atomFamily } from "recoil";

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

export const requestState = atomFamily({
  key: 'requestState', // unique ID (with respect to other atoms/selectors)
  default: (i, defaultValue) => defaultValue ?? {
    id: null,
    type: '',
    data: '',
    status: null
  },
});