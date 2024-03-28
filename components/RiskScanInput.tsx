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


    
function PrivacyRequirementInput({chatId}: Props) {
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

        const sendMessage = async () => {
            if (!prompt) return;
            const input = prompt.trim();
        
        // Specify the database index to query
        const requestData = {
          prompt: input,
          index_name: "privacyrequirements"
      };
      
      

        // Call the queryEmbeddings function to get the results from the Flask server
        const privacyRequirementText = await queryEmbeddings(requestData);
        console.log('Records:', requestData);

        // Merge the response and develop the query to the OpenAI API
        const baseText = 'You are a Data Protection Officer with expertise in privacy law and also understands HTML coding. Analyze this question regarding privacy requirements for a product: ';

        const privacyRequirementQuestion = '. To help with your analysis, these are the existing privacy requirements related to the question: ';
      
        // Rules for analyzing privacy requirements
        const privacyRequirementRules =
        ' When analyzing these privacy requirements and question, please follow these guidelines: ' +
        '1) If the question is asking about if there existing privacy requirements that could help address a privacy risk, provide only the existing privacy requirements that are relevant. ' +
        '2) If the exising privacy requirements do not satisfy the risks raised by the question, provide suggested new privacy requirements that do. ' +
        '3) If the existing privacy requirements largely or mostly address the privacy risk raised by the question, no new privacy requirement is needed and and recommend which of the existing privacy requirements should be used.' +
        '4) When responding, organize your response and please format it using HTML tags for better readability, such as <header> for headers, <b> for bold text, <br><br> for line breaks, and <ul> and <li> for unordered lists.'
        ;

        const combinedText = baseText + prompt + privacyRequirementQuestion + privacyRequirementText.join(' ') + privacyRequirementRules;

        console.log('Full question:', combinedText);

        setPrompt("");  
        
        const message: Message ={
            text: input,
            createdAt: serverTimestamp(),
            user:{
                _id:session?.user?.email!,
                name: session?.user?.name!,
                avatar: session?.user?.image! || `https://ui-avatars.com/api/?name="hello"`,
            }
        };
        
        
        await addDoc(collection(db,'users',session?.user?.email!,'chats', chatId, 'messages'), 
        message 
        );

        
        
        // Toast notification to say Loading
        const notification = toast.loading('PrivacyAI is thinking...');

        await fetch("/api/askQuestion", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt: combinedText,
              chatId,
              model,
              session,
              messages: [{ role: "user", content: combinedText }],
              saveToDatabase: true,
            }),
            
        })
            .then(response => response.json())
            .then(data => {
            
            //Toast notification to say successful
            console.log('prompt: hello world', prompt);
            console.log('session:', session);
            toast.success('PrivacyAI has responded',{id:notification});
            console.log('after prompt*************');
        });
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

export default PrivacyRequirementInput;

