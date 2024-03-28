"use client"


import { useProductContext } from "all/app/ProductContext";
import { useEffect } from 'react';
import { PlusIcon, EyeIcon, MagnifyingGlassIcon, ShieldExclamationIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Footer from 'all/app/Footer';

async function Productpage() {
  
  const { selectedProduct } = useProductContext();
  const router = useRouter();

  useEffect(() => {
    if (selectedProduct) {
      console.log("Selected Product:", selectedProduct);
    }
  }, [selectedProduct]);


  const createNewDpia = async (productId: string) => {
   
        router.push(`/dpiapref/${productId}`);
       
  };

  const viewDpia = async (productId: string) => {
    router.push(`/dpia/${productId}`);
    
  };

  const viewEvidence = async (productId: string) => {
    router.push(`/evidence/${productId}`);
    
  };

  const analyzeRisk = async (productId: string) => {
    router.push(`/riskanalysis/${productId}`);
    
  };

  return (
    <div className="bg-white h-screen flex flex-col">
    <div className= "flex-grow bg-white overflow-y-auto">
    <div className="p-6 bg-white">
    
    {selectedProduct ? (
      <div>
        <h1 className="text-3xl  font-bold mb-4">{selectedProduct.name}</h1>
        <div className="flex">
            <motion.div
              className="flex items-center justify-center bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-md mr-2 overflow-y-auto"
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
              onClick={() => createNewDpia(selectedProduct.id)} // 
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              <p>Create DPIA</p>
            </motion.div>

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
              onClick={() => viewDpia(selectedProduct.id)} // Call the viewDpia function on button click
            >
              <EyeIcon className="w-5 h-5 mr-2" />
              <p>View DPIA</p>
            </motion.div>
            
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
            onClick={() => viewEvidence(selectedProduct.id)} // Call the viewEvidence function on button click
          >
            <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
            <p>Evidence Analysis</p>
          </motion.div>
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
            onClick={() => analyzeRisk(selectedProduct.id)} // Call the analyzeRisk function on button click
          >
            <ShieldExclamationIcon className="w-5 h-5 mr-2" />
            <p>Risk Analysis</p>
          </motion.div>
          
          </div>
        <p>{selectedProduct.desc}</p>
        <div className="flex justify-center">
          <img src={selectedProduct.image} alt="" className="h-26 w-26 align-middle" />
        </div>
        <p className="mb-2 font-semibold">Features</p>
        <ul>
  {selectedProduct.requirements.map((feature, index: number) => (
    <li key={index} className="mb-1 text-xs">
      {`${index + 1}. ${feature.requirement}`}
    </li>
  ))}
</ul>


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

export default Productpage;
