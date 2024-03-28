"use client";

import { PlusIcon } from '@heroicons/react/24/solid'
import { addDoc, collection, getDoc, serverTimestamp } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { db } from 'all/firebase';


function NewAdviceChat() {
  const router = useRouter();
  const {data: session } = useSession();
  const creteNewChat = async() => {
  try{

  const doc = await addDoc (
    collection(db,"users", session?.user?.email!, "chats"),{
      messages:[],
      userID:session?.user?.email!,
      isAdvice: true,
      createdAt: serverTimestamp()
    }
    );
    console.log("before routing");
    router.push(`/protected/client/advicechat/${doc.id}`);
    console.log("after routing");
  }
  catch(error){
    console.log("errorrrrr")
     console.error(error);
  } 
  };
  
  return (
    <div onClick ={creteNewChat} className='border-gray-700 border chatRow' >
       <PlusIcon className='h-4 w-4'/>
        <p> New Analysis Chat</p>
    </div>
  );
}

export default NewAdviceChat;