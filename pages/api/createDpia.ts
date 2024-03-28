// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { adminDb } from 'all/firebaseAdmin';
import query from '../../lib/queryApi';
import type { NextApiRequest, NextApiResponse } from 'next'
import admin from "firebase-admin";
import DOMPurify from 'isomorphic-dompurify';


type Data = {
  answer: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    console.log("inside createDPIA api");
    const {prompt, productId, model, session, domain} = req.body;
    const messages = [
      { role: 'user', content: prompt }
  ];
   
    console.log("prompt :: "+ prompt);
    console.log("chatId :: "+ productId);
    console.log("model  :: "+ model);
    console.log("domain  :: "+ domain);

    if(!prompt){
        res.status(400).json({answer: "Please provide a prompt!"});
        return;
    }

    if(!model){
        res.status(400).json({answer: "Please provide a valid model!"});
        return;
    }

    // ChatGPT Query 

    const htmlResponse = await query(prompt, productId, model, messages);
    const DOMPurify = require('isomorphic-dompurify');
    let sanitizedHtml;

      if (htmlResponse) {
        sanitizedHtml = DOMPurify.sanitize(htmlResponse, { USE_PROFILES: { html: false } });
      } else {
        sanitizedHtml = 'AI was unable to find the answer of that!';
      }

      // Replace line breaks and carriage returns with HTML entities
    const formattedHtml = sanitizedHtml.replace(/\n/g, '&#10;').replace(/\r/g, '&#13;');

  
    const message: Message = {
        text: formattedHtml || "AI was unable to find the answer of that!",
        createdAt: admin.firestore.Timestamp.now(),
        user:{
            _id:"AI",
            name: "AI",
            avatar: "https://brandlogovector.com/wp-content/uploads/2023/01/ChatGPT-Icon-Logo-PNG.png"
        },
    };

    if (!formattedHtml.startsWith('error:')) {
      console.log("hehehehheeh123"+formattedHtml);
        await adminDb
        .collection('users')
        .doc(session?.user?.email)
        .collection("products")
        .doc(productId)
        .collection(domain)
        .add(message)
        .then(() => {
          console.log("DPIA version added to the database successfully");
        })
        .catch((error) => {
          console.error("Error adding DPIA version: ", error);
        });    
    }


    console.log("inside ask question api. resoonse" + message.text );
    res.status(200).json({ answer: message.text })
    
    }


    