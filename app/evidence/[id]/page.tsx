"use client"

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import Multiselect from 'multiselect-react-dropdown';
import TransitionEffect from 'all/app/TransitionEffect';
import { useProductContext, ProductData } from 'all/app/ProductContext';
import { motion } from 'framer-motion';
import projectConfig from 'all/lib/projectConfig';
import Footer from 'all/app/Footer';
import { Listbox } from '@headlessui/react';
import { doc, updateDoc } from "firebase/firestore";
import { db } from 'all/firebase';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Collapse } from 'react-collapse';
import parse from 'html-react-parser';



function EvidencePage() {
  
  const {data: session} = useSession();
  const { selectedProduct, setSelectedProduct } = useProductContext();
  const [isEvidenceOpen, setEvidenceOpen] = useState<boolean[]>([]);
  const model = 'gpt-4';
 
  useEffect(() => {
    if (selectedProduct) {
      console.log('Selected Product:', selectedProduct);
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (selectedProduct) {
      setEvidenceOpen(new Array(selectedProduct.requirements.length).fill(false));
    }

    // Cleanup function
    return () => {
      setEvidenceOpen([]);
    }
  }, [selectedProduct]);

  async function analyzeRequirements() {
    if (!selectedProduct) {
      console.error("No product selected.");
      return;
    }
  
    

    
    // Toast notification to say Loading
    const notification = toast.loading('PrivacyAI is thinking...');
  
    let updatedRequirements = [...selectedProduct.requirements];  // Create a copy of the current requirements
  
    for (let i = 0; i < updatedRequirements.length; i++) {
      const prompt = `You are an expert in privacy lawls, product management, and engineering. You need to assess whether a product's privacy requirement is being satisfied by its example code evidence. This is the privacy requirement: ${updatedRequirements[i].requirement} This is the corresponding evidence: ${updatedRequirements[i].evidence}. Develop analysis about whether this satisfies the privacy requirement following these rules: 
      1) Provide an overall score of  1 - 5 at the beginning of your response, with 5 representing full satisifaction of the privacy requirement. Inlcude the word Pass if it satisifies privacy requirements with a score of 4 or 5, Conditional Pass if has some minor fixes to make with a score of 3, and Fail if it needs significant changes with a score of 2 or 1. 
      2) After a line break, provice a concise summary of your anaysis in less than 100 words
      3) Use HTML tags to format your response, including for linebreaks, bold, italics, and underline.`;
  
      console.log(`Sending prompt: ${prompt}`);
  
      const response = await fetch("/api/analyzeEvidence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          model,
          messages: [{ role: "user", content: prompt }],
          saveToDatabase: true,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
    
        // Log the entire API response
        console.log(`API response: ${JSON.stringify(data)}`);
  
        // Update the analysis field with the answer from the API
        updatedRequirements[i].analysis = data.answer;
        console.log(`Analysis received: ${data.answer}`);
    
        // Update the analysis value in Firestore
        const productRef = doc(db, 'users', session?.user?.email!, 'products', selectedProduct.id);
        await updateDoc(productRef, {
          requirements: updatedRequirements,
        });
      } else {
        console.error(`Error response: ${response.statusText}`);
      }
    }

   // Update the local product object with the updated requirements
        setSelectedProduct((prevProduct: ProductData | null) => {
          if (!prevProduct) return null;

          return {
            ...prevProduct,
            requirements: updatedRequirements,
          };
        });
    //Toast notification to say successful
    toast.success('PrivacyAI has responded',{id:notification});
  }
  
  
  
  

  return (
    <div className="bg-white h-screen flex flex-col">
      <div className="flex-grow bg-white overflow-y-auto">
      <TransitionEffect />
      <div className="p-6">
      {selectedProduct ? (
        <div className="p-6">
          <h1 className="text-3xl flex font-bold mb-4">{selectedProduct.name}</h1>
          <p>{selectedProduct.desc}</p>
          <div className="flex justify-center">
                  <img src={selectedProduct.image} alt="" className="h-26 w-26 align-middle" />
                  
                  


                </div>
                <p className="mb-2 text-3xl font-bold">Privacy Requirements</p>

                <div className="flex">
  
  <motion.div
      className="flex items-center justify-center bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-md mr-2"
      whileHover={{
        backgroundColor: [
          '#121212',
          'rgba(131,58,180,1)',
          'rgba(253,29,29,1)',
          'rgba(252,176,69,1)',
          'rgba(131,58,180,1)',
          '#121212',
        ],
        transition: { duration: 1, repeat: Infinity },
      }}
      onClick={() => analyzeRequirements()}
  >
      <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
      <p>Analzye Evidence</p>
      <br />
          </motion.div>
        </div>
        <br />

                
                {selectedProduct.requirements.map((requirements, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="p-6 bg-white rounded-lg shadow-lg mb-4"
                  >
                    <div className="flex items-left justify-between mb-4">
                      <h2 className="text-2xl font-bold">{requirements.requirement}</h2>
                      {/* Insert your Listbox code here */}
                    </div>
                    <div className="text-gray-900 font-medium">
                    Analysis: 
                    <br /> {parse(requirements.analysis)} <br /><br />  

    <button onClick={() => {
  const newEvidenceOpenState = [...isEvidenceOpen];
  newEvidenceOpenState[index] = !newEvidenceOpenState[index];
  setEvidenceOpen(newEvidenceOpenState);
      }}>Show/Hide Evidence</button>

      <Collapse isOpened={isEvidenceOpen[index]}>
        <SyntaxHighlighter language="javascript" style={docco}>
            {requirements.evidence.replace(/\\n/g, '\n')}
        </SyntaxHighlighter>
      </Collapse>

      </div>
          </motion.div>
                ))}
        </div>
      ) : (
        <div className="p-6">
          <p>No product selected.</p>
        </div>
      )}
      </div> 
      <Footer className="flex-none"/> 
     </div> 
    </div>
    
  );
}

export default EvidencePage;
