"use client"

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import TransitionEffect from 'all/app/TransitionEffect';
import { useProductContext, ProductData } from 'all/app/ProductContext';
import { motion } from 'framer-motion';
import Footer from 'all/app/Footer';
import { doc, updateDoc } from "firebase/firestore";
import { db } from 'all/firebase';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import axios from "axios";



function RiskAnalysisPage() {
  
  const {data: session} = useSession();
  const { selectedProduct, setSelectedProduct } = useProductContext();
  const [isEvidenceOpen, setEvidenceOpen] = useState<boolean[]>([]);
  const model = 'gpt-4';

  const queryEmbeddings = async (data: { prompt: string, index_name: string, type: string }) => {
    try {
      console.log('Sending data to Flask server:', data);
  
      const requestData = {
        ...data,
        filter: {
          type: { $eq: data.type }
        }
      }
  
      const response = await axios.post('http://localhost:5001/api/query_embeddings', requestData);
      const matches = response.data;
      console.log('Received response from Flask server:', matches);
      return matches;
    } catch (error) {
      console.error('Error fetching query embeddings:', error);
      return [];
    }
  };
  
 
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

  async function analyzePrivacyLaws() {
    if (!selectedProduct) {
      console.error("No product selected.");
      return;
    }
  
    // Toast notification to say Loading
    const notification = toast.loading('PrivacyAI is thinking...');
  
    let updatedRequirements = [...selectedProduct.requirements];  // Create a copy of the current requirements
  
    for (let i = 0; i < updatedRequirements.length; i++) {
      const risk = updatedRequirements[i].risk;
      const requirement = updatedRequirements[i].requirement;
  
      // Send risk to Flask server and get response
      const requestData = {
        prompt: risk,
        index_name: "privacylaws",
        type: "article"
      };
  
      const privacyLawSections = await queryEmbeddings(requestData);
  
      // Create the prompt for OpenAI API
      const baseText = 'You are a Data Protection Officer with expertise in data privacy laws. You need to analyze how well product risks are addressed through privacy requirements. This is the risks identified for the product: ';
  
      const requirementPrompt = ' This is the existing privacy requirement used to mitigate this risk: '

      const riskPrompt = ' To help with your analysis, these are privacy law sections related to the risks: ';
      
      // Define rules for analyzing privacy requirements
      const privacyAnalysisRules = 'Assess how well the privacy requirements address the risks and associated privacy law sections. Follow these rules in your analysis: ' +
      
      '1) Provide a score of 1 to 5 for how well it address the risk. This should be at the top in the format of "Score: X" followed by <br><br>. Include an overall concise summary on the level of risk and why that exists on a new line with the format of "Summary Analysis: X" followed by <br><br>. ' +
      '2) Only focus on the most relevant laws specific to the risk and privacy requirement and ignore the ones that are not the most relevant. Remember, you are only analyzing one of a number of privacy requirements and assume that other secondary and tertiary risks are addressed in othe privacy requirements. ' +
      '3) Do not consider technical implementation details in your analysis, assume that the corresponding technical implementation details exist. ' +
      '4) Include a brief and concise analysis of your reasoning in less than 100 words only for law sections where signficiant risks under the heading of "Analysis" followed by <br><br>. Seperate the analysis for each new law section line using <br><br> and refernce the law section in a bullet point list form in the format of "Relevant Law: X". Do not include analysis for law sections which are adequately addressed through the privacy requirement. ' + 
      '5) When formatting your response, include HTML tags to improve readability.'
  
      const combinedText = baseText + risk + requirementPrompt + requirement + riskPrompt + privacyLawSections.join(' ') + privacyAnalysisRules;
  
      console.log(`Sending combinedText: ${combinedText}`);
  
      // Send the combinedText to the OpenAI API
      const response = await fetch("/api/analyzeEvidence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: combinedText,
          model,
          messages: [{ role: "user", content: combinedText }],
          saveToDatabase: true,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
  
        // Log the entire API response
        console.log(`API response: ${JSON.stringify(data)}`);
  
        // Update the riskanalysis field with the answer from the API
        updatedRequirements[i].riskanalysis = data.answer;
        console.log(`Analysis received: ${data.answer}`);
    
        // Update the riskanalysis value in Firestore
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
  
    // Toast notification to say successful
    toast.success('PrivacyAI has responded', {id: notification});
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
                  onClick={() => analyzePrivacyLaws()}
                >
                  <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                  <p>Risk Analysis</p>
                  <br />
                </motion.div>
              </div>
              <br />
  
              {selectedProduct.requirements.map((requirements, index) => (
                <div
                  key={index}
                  className="p-6 bg-white rounded-lg shadow-lg mb-4"
                >
                  <div className="flex items-left justify-between mb-4">
                    <h2 className="text-2xl font-bold">{requirements.requirement}</h2>
                  </div>
                  <div className="text-gray-900 font-medium">
        
  
                    <h3 className="text-xl font-bold">Privacy Risk Analysis</h3>
                    <div dangerouslySetInnerHTML={{ __html: requirements.riskanalysis.replace(/\\n/g, '\n') }} />
                  </div>
                </div>
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

export default RiskAnalysisPage;
