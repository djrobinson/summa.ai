const OpenAI = require("openai");
const fail = {
  statusCode: 200,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    message: "Search failed.",
  }),
};

const chat = async (evt) => {
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


  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
        choices
    }),
  };
};

exports.chat = chat;
