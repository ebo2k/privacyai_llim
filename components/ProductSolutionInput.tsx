"use client";

import toast  from "react-hot-toast";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import ModelSelection from "./ModelSelection";
import useSWR from "swr";
import axios from "axios";

type Props= {
        chatId: string;
    };


    
    function ProductSolutionInput({chatId}: Props) {
      const [prompt, setPrompt] = useState("");
      const {data: session} = useSession();
  
      const { data: model} = useSWR('model',{
          fallbackData:'gpt-3.5-turbo'
      })

      const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          sendMessage();
        }
      };
  
      // Send query to the Flask server
      const queryEmbeddings = async (data: { prompt: string, index_name: string }) => {
        try {
            console.log('Sending data to Flask server:', data);
            const response = await axios.post('http://localhost:5001/api/query_embeddings', data);
            const matches = response.data;
            console.log('Received response from Flask server:', matches);
            return matches;
        } catch (error) {
            console.error('Error fetching query embeddings:', error);
            return [];
        }
    };  
    const modifyResponse = (response: string, additionalText: string, shouldAppend: boolean, customText: string) => {
      if (shouldAppend) {
        return additionalText + response + customText;
      } else {
        return additionalText;
      }
    }
  
     const sendMessage = async () => {
      if (!prompt) return;
      const input = prompt.trim();
          
          // Specify the database index to query
          const requestData = {
            prompt: input,
            index_name: "privacylaws"
        };
        
          // Call the queryEmbeddings function to get the results from the Flask server
          const privacyLaws = await queryEmbeddings(requestData);

        // Merge the response and develop the query to the OpenAI API
        const baseText = 'You are a Privacy Counsel with expertise in privacy law. You are going to collaborate with a Product Manager and Product Decider to identify a product solution based on a question. This is the question to analyze: ';

        const adviceQuestion = '. Your role is to first assess any privacy risks that you see. These are specific related privacy law references that you can use to help in your response: ';
      
        // Rules for analyzing privacy laws
        const adviceRules =
        ' When analyzing the privacy law and preparing your respone to the Product Mangager and Product Decider, please follow these guidelines: ' +
        '1) Consider all related laws you are aware of not just the ones provided to you. In addition, you can choose which of the privacy law references provided are most relevant to the question. If some are not relevant, do not include them in your analysis and response. ' +
        '2) Provide a summary of your analysis, but also list specific privacy law refenences as needed. ' +
        '3) Provide your concise analysis in bullet form in under 200 words, do not include an introduction or conclusion. '
        ;

        const formatting = 'Please use formatting in your response such as bullet points, headers, and subheaders if necessary to improve readability.'

        const combinedText = baseText + prompt + adviceQuestion + privacyLaws.join(' ') + adviceRules + formatting;
        
        setPrompt("");

        // Create the base message outside the loop
        const baseMessage: Message = {
            text: input,
            createdAt: serverTimestamp(),
            user:{
                _id:session?.user?.email!,
                name: session?.user?.name!,
                avatar: session?.user?.image! || `https://ui-avatars.com/api/?name="hello"`,
            }
        };

        const initialMessage: Message = { ...baseMessage, text: input };
        await addDoc(collection(db,'users',session?.user?.email!,'chats', chatId, 'messages'), initialMessage);

        // Initialize finalApiReponse and updatedText with the combinedText
        let updatedText = combinedText;

        // Array of additional texts
        const getAdditionalText = (iteration: number, previousResponse: string, twoResponsesAgo: string) => {
          switch(iteration) {
            case 0:
              return {
                additionalText: " You are a Product Manager working with a Privacy Counsel and Product Decider to identify a product solution. This is the question you are tasked with developing a solution for: \n\n" + prompt + " Articulate the business goals for your product and how this new change can provide business and product benefits. Provide your concise analysis in bullet form in under 200 words and do not include an introduction or conclusion.\n\n",
                shouldAppend: false,
                customText: ""
              };
            case 1:
              return {
                additionalText: " You are a Product Decider working with a Privacy Counsel and Product Manager to find a product solution. Your job is to use the Privacy Counsel and Product Manager input to find the best possible solution that balances product and privacy needs. This is the analysis from the Privacy Counsel:\n\n" + twoResponsesAgo + "\n\nAnd this is the analysis from the Product Manager:\n\n",
                shouldAppend: true,
                customText: "\n\nFollow these rules to develop you analysis:  1) Include HTML tags for headers and bullet points to improve readability such as <header> for headers, <b> for bold text, <br><br> for line breaks, and <ul> and <li> for unordered lists. 2) Outline the privacy risks and product benefits under seperate bolded headings for each seperated by line breaks. 3) Develop specific feature and privacy mitigation recommendations to find a mutally beneficial solution and feature design under a bolded header seperated by line breaks, including which privacy risks and product needs should be prioritized. 4) Provide your anaysis about why this satsifies the privacy, product, and business needs without referencing the Privacy Counsel and Product Manager by name under a bolded header seperated by line breaks."
              }; 
            default:
              return { 
                additionalText: "",
                shouldAppend: false,
                customText: ""
              };
          }
        }
      

        let previousResponse = '';
        let twoResponsesAgo = ""; 
        

        // Loop a desired number of times
        for (let i = 0; i < 3; i++) {
            
          // Toast notification to say Loading
            const notification = toast.loading('PriacyAI is thinking...');
            console.log(`Iteration ${i + 1} Prompt:`, updatedText);
            // Fetch response from the OpenAI API
            let apiResponse = await fetch("/api/askQuestion", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  prompt: updatedText,
                  chatId,
                  model,
                  session,
                  messages: [{ role: "user", content: updatedText }],
                  saveToDatabase: (i === 2),
                }),
            })

            // Extract the response text
            let responseJson = await apiResponse.json();
            let responseText = responseJson.answer;

            console.log(`Iteration ${i + 1} Response:`, responseText);

            // Save the current response for the next loop iteration
            twoResponsesAgo = previousResponse;
            previousResponse = responseText;

            // Append the additional text to the responseText
            const { additionalText, shouldAppend, customText } = getAdditionalText(i, previousResponse, twoResponsesAgo);
            updatedText = modifyResponse(responseText, additionalText, shouldAppend, customText);

                

            //Toast notification to say successful
            toast.success('PrivacyAI has responded',{id:notification});
            console.log('after prompt*************');
        }
        

};

    
  return (
    <div className="h-48">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full flex justify-center pb-10"
        >
          <div className="relative w-[800px] mx-auto">
            <textarea
              className="w-full py-2 bg-white border-gray rounded-lg 
                    shadow-md md:px-10 border-gray-100 focus:outline-gray-100 focus:ring-0
                    focus:border-transparent pt-2 disabled:opacity-50
                    disabled:cursor-not-allowed resize-none"
              disabled={!session}
              value={prompt}
              onKeyDown={handleKeyDown}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your message here..."
            />
            <button
              disabled={!prompt || !session}
              onClick={sendMessage}
              type="button"
              className="absolute right-4 bottom-4 bg-[#11A37F] hover:opacity-50 text-white font-bold
                    px-4 py-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="h-5 w-5 -rotate-45" />
            </button>
          </div>
        </form>
        <div className="md:hidden">
          <ModelSelection />
        </div>
      </div>
    );
}

export default ProductSolutionInput;

