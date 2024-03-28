'use client';

import { db } from "../firebase";
import { collection, orderBy, query } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";

import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";
import Message from "./message";

type Props= {
    chatId: string;
};

function Chat({ chatId }: Props) { 
  const {data:session } = useSession();

  const [messages] = useCollection(
    session && 
      query(
        collection(
          db, 
          "users", 
          session?.user?.email!, 
          "chats", 
          chatId, 
          "messages"
        ),
      orderBy("createdAt", "asc")
    )
  )

  

  return (
  
    <div className="flex flex-col h-[85vh] overflow-y-auto">
      {messages?.empty && (
        <>
          <p style={{ textAlign: "center" }}   className="mt-10 text-cnter text-white">
            Type a prompt in below to get started!  
          </p>  
          <ArrowDownCircleIcon className="h-10 w-10 mx-auto mt-5
          text-white animate-bounce"/>
        </>
      )}
      {messages?.docs.map((message) => (
        <Message key ={message.id} message ={message?.data()}/>
      ))}
    </div>
    );
};

export default Chat;