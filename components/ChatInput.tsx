"use client";

import toast  from "react-hot-toast";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import ModelSelection from "./ModelSelection";
import useSWR from "swr";


type Props= {
        chatId: string;
    };

function ChatInput({chatId}: Props) {
    const [prompt, setPrompt] = useState("");
    const {data: session} = useSession();

    const { data: model} = useSWR('model',{
        fallbackData:'gpt-3.5-turbo'
    })

    const sendMessage = async (e: FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        if(!prompt) return;

        const input = prompt.trim();
        const baseText = 'You are a Data Protection Officer analyzing privacy laws. This is what you are asked to analyze: ';
        const legalTextPart =  ' As part of your response, include any analysis that is relevant to these new legal decisions: GDPR, DMA, DSA' ;
        const formatText = 'Please use formatting in your response such as bullet points, headers, and subheaders if necessary to improve readability. ';

       const combinedText = baseText + prompt + legalTextPart + formatText;
    
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
        const notification = toast.loading('AI is thinking...');

        await fetch("/api/askQuestion", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
            },
            body: JSON.stringify({
                prompt: combinedText, 
                chatId, 
                model, 
                session,
                messages: [{ role: "user", content: combinedText }],
            }),
        }).then(() => {
            //Toast notification to say successful
            console.log('prompt: hello world', prompt);
            console.log('session:', session);
            toast.success('AI has responded',{id:notification});
            console.log('after prompt*************');
        });
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

export default ChatInput;

