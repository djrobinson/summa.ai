const OpenAI = require("openai");
const natural = require('natural');
const fail = {
  statusCode: 200,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    message: "Search failed.",
  }),
};

const report = async (evt) => {
  console.log("SAMPLE CHAT");
  let body = {};
  try {
    body = JSON.parse(evt.body);
    console.log("What is body: ", body);
  } catch (e) {
    console.log("Couldn't parse body: ", e);
    return fail;
  }
  const prompt = body.prompt;

  let openai = null;
  let choices = [];
  console.log("------------------ OPENAI ------------------");
  try {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
    });
    const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-4',
      });
      console.log(completion.choices);
      choices = completion.choices;

  } catch (e) {
    console.log("WhatS UP WITH OPENAI: ", e);
    return fail;
  }

  const tokenizer = new natural.SentenceTokenizer();
  const sentences = tokenizer.tokenize(choices[0].message.content)
  console.log("WHAT DIS: ", sentences)

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
        sentences
    }),
  };
};

exports.report = report;
