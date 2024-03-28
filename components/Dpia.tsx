'use client';

import { db } from "../firebase";
import { collection, orderBy, query } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { motion, useMotionValue } from "framer-motion";



type Props= {
    dpiaId: string;
};

function Dpia({ dpiaId }: Props) {
  
  
  const {data:session } = useSession();

  const [messages] = useCollection(
    session && 
      query(
        collection(
          db, 
          "users", 
          session?.user?.email!, 
          "chats", 
          dpiaId, 
          "messages"
        ),
      orderBy("createdAt", "asc")
    )
  )

  
  return (
  
    <div className="flex-1 overflow-y-:scroll overflow-x-hidden">
      {messages?.docs.map((message) => ( 
        <div className ="p-10 bg-yellow-200 border-2 m-2 shadow-lg">
          <p>{message?.data().text}</p>
      </div>
      ))}
    </div>
    );
};

export default Dpia;