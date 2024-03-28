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


    
    function AdviceInput({chatId}: Props) {
      const [prompt, setPrompt] = useState("");
      const {data: session} = useSession();
  
      const { data: model} = useSWR('model',{
          fallbackData:'gpt-3.5-turbo'
      })
  
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
      const modifyResponse = (response: string, additionalText: string) => {
        const modifiedResponse = additionalText + response;
        console.log('Modified response:', modifiedResponse);
        return modifiedResponse;
    }
  
        const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
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
        const baseText = 'You are a Privacy Counsel Researcher with expertise in privacy law. You are preparing analysis that will be sent to a Privacy Counsel Decider. This is the question to analyze: ';

        const adviceQuestion = '. These are specific related privacy law references that you can use to help in your response: ';
      
        // Rules for analyzing privacy laws
        const adviceRules =
        ' When analyzing the privacy law and preparing your respones to the Privacy Counsel Decider, please follow these guidelines: ' +
        '1) Consider all related laws you are aware of. In addition, you can choose which of the privacy law references provided are most relevant to the question. If some are not relevant, do not include them in your analysis and response. ' +
        '2) Provide a summary of your analysis, but also list specific privacy law refenences as needed. ' +
        '3) Format your concise response in bullet points and keep your response under 200 words.'
        ;

        const formatting = 'Please use formatting in your response such as bullet points, headers, and subheaders if necessary to improve readability.'

        const combinedText = baseText + prompt + adviceQuestion + privacyLaws.join(' ') + adviceRules + formatting;

        console.log('Full question:', combinedText);

        
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
        const getAdditionalText = (iteration: number, twoResponsesAgo: string, threeResponsesAgo: string) => {
          switch(iteration) {
            case 0:
              return " You are a Privacy Counsel Decider with and you will have to make a final decision on the privacy analysis. A Privacy Counsel Researcher has conducted in depth privacy law research. This is the question you are tasked with providiing analysis on: \n\n" + prompt + "\n\nThis is what the Privacy Counsel Research has analyzed. Provide concise bullet points of anything that has been missed and should be considered: \n\n"; 
            case 1:
              return " You are a Privacy Counsel Researcher with expertise in privacy law. You sent this analysis to the Privacy Counsel Decide: \n\n" + twoResponsesAgo + "\n\nUpdate your original analysis to incoporate this is the response from the Privacy Counsel Decider into your analysis, ensuring to keep it as concise bullet points: \n\n"; 
            case 2:
              return " You are a Privacy Counsel Decider with and you will have to make a final decision on the privacy analysis. This is the question you have been tasked with answering: \n\n" + prompt + "\n\nProvide final analysis in bullet form, based the analysis from the Privacy Counsel Researcher: \n\n" + threeResponsesAgo + " \n\n";
            default:
              return "" ;
          }
        }
      

        let previousResponse = '';
        let twoResponsesAgo = ""; 
        let threeResponsesAgo = "";
        

        // Loop a desired number of times
        for (let i = 0; i < 4; i++) {
            
          // Toast notification to say Loading
            const notification = toast.loading('ChatGPT is thinking...');

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
                  saveToDatabase: (i === 3),
                }),
            })

            // Extract the response text
            let responseJson = await apiResponse.json();
            let responseText = responseJson.answer;

            // Save the current response for the next loop iteration
            twoResponsesAgo = previousResponse;
            previousResponse = responseText;
            if (i === 0) {
              threeResponsesAgo = responseText;
          }

            console.log(`Iteration ${i + 1} Response:`, responseText);

            // Append the additional text to the responseText
            updatedText = modifyResponse(responseText, getAdditionalText(i, twoResponsesAgo, threeResponsesAgo));
                

            //Toast notification to say successful
            console.log('prompt: hello world', prompt);
            console.log('session:', session);
            toast.success('ChatGPT has responded',{id:notification});
            console.log('after prompt*************');
        }

};

    
  return (
    <div className="h-48" >
        <form onSubmit={sendMessage} 
            className="fixed-buttom-0   z-5 w-full flex px-20 py-20 
            
            space-y-2

            space-x-2  border-t border-gray-100 ">
            <input 
            className=" 
            flex items-center py-2   md:border-2 bg-transparent 
            rounded-lg
            shadow-md md:px-10
            
            flex-1  border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600
            focus:border-transparent px-5  disabled:opacity-50 disabled:cursor-not-allowed
            
            "
            disabled={!session}
            value ={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            type = "text" 
            placeholder = "Type your message here..."/>

            <button 
                disabled={!prompt || !session} 
                type="submit"
                className="bg-[#11A37F] hover:opacity-50 text-white font-bold
                px-4 py-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed">
                <PaperAirplaneIcon className="h-5 w-5 -rotate-45"/>
            </button>


        </form>
        <div className="md:hidden">
            <ModelSelection/>
        </div>
    </div>  
  );
}

export default AdviceInput;

