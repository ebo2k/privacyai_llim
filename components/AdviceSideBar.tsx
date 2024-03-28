'use client';

import { collection,orderBy,query } from 'firebase/firestore';
import {useSession, signOut } from 'next-auth/react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from 'all/firebase';
import ChatRow from './ChatRow';
import NewAdviceChat from './NewAdviceChat';
import ModelSelection from './ModelSelection';


function AdviceSideBar() {
    const { data:session} = useSession();
    const [chats, loading, error] = useCollection(
      session && query(collection (db, "users", session.user?.email!,"chats"),
      orderBy('createdAt','asc'))
     
    );

  return (
     <div className="p-2 flex flex-col h-screen">
        <div className="flex-1">
            <div> 
                <NewAdviceChat/>

                
                <div className="hidden sm:inline">
                  <ModelSelection/>
                </div>

                <div className="flex flex-col space-y-2 my-2 text-white">

                  {loading && (
                    <div className='animate-pulse text-center text-white'>
                      <p>Loading Chats...</p>
                    </div>
                  )}

                  {/*Map through the chatRows] */}
                  {
                    chats?.docs.map(chat=>(
                    <ChatRow id={chat.id} filterRiskAssessment={true} />

                  ))}

                </div>

               
            </div>
        </div>

        
        
    </div>
  );
}

export default AdviceSideBar;