import openai  from "./chatgpt";
import { Configuration, OpenAIApi } from "openai";

const query = async (
    prompt: string,
    chatId: string,
    model: string,
    messages: Array<any> // Add the messages parameter
  ) => {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
  
    // Build the API request payload based on the selected model
    if (model === "gpt-3.5-turbo" || model === "gpt-4") {
      
      // Use createChatCompletion for gpt-3.5-turbo and gpt-4
      const res = await openai
        .createChatCompletion({
          model: model,
          messages: messages,
        })
        .then((res) => res.data?.choices[0]?.message?.content ?? "")
        .catch((err) =>
          `Error: chatGPT was unable to find an answer for that! (Error: ${err.message} and prompt was ${prompt} and openAPI object was ${openai} and openAPI model was ${model})`
        );
      return res;
    } else {
      // Use createCompletion for other models
      const res = await openai
        .createCompletion({
          model: model,
          prompt: prompt,
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 1000,
          frequency_penalty: 0,
          presence_penalty: 0,
        })
        .then((res) => res.data.choices[0].text)
        .catch((err) =>
          `Error: chatGPT was unable to find an answer for that! (Error: ${err.message} and prompt was ${prompt} and openAPI object was ${openai} and openAPI model was ${model})`
        );
      return res;
    }
  };
  
  console.log("inside queryAPI function. after query");
  
  export default query;