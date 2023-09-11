import { getEncoding, encodingForModel } from "js-tiktoken";

const enc = getEncoding("cl100k_base");

export const getTokenCount = (value) => {
    const tokenCount = enc.encode(value).length;
    return tokenCount;
}

export const isValidLength = (value) => {
    const tokenCount = getTokenCount(value);
    if (tokenCount < 8192) return true;
    return false;
}