"use client"

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Multiselect from 'multiselect-react-dropdown';
import TransitionEffect from 'all/app/TransitionEffect';
import { useProductContext } from 'all/app/ProductContext';
import { motion } from 'framer-motion';
import projectConfig from 'all/lib/projectConfig';
import Footer from 'all/app/Footer';


function DpiaPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [prompts, setPrompts] = useState<string[]>(['']);
  const [regEnfcheckbox, setregEnfcheckbox] = useState(false);
  const [mediaCheckbox, setmediaCheckbox] = useState(false);
  const [euCheckbox, seteuCheckbox] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const { selectedProduct } = useProductContext();
  const context = projectConfig.role+(selectedProduct ? selectedProduct.name : "unknown")+ '.  ' +(selectedProduct ? selectedProduct.desc : "unknown");
  const dpiaInstruction = projectConfig.dpiaInstruction;
  const domainInstruction = projectConfig.domainInstruction;


  useEffect(() => {
    if (selectedProduct) {
      console.log('Selected Product:', selectedProduct);
    }
  }, [selectedProduct]);

  const handleDomainSelection = (domain: string) => {
    setSelectedDomains((prevSelectedDomains: string[]) => {
      if (prevSelectedDomains.includes(domain)) {
        return prevSelectedDomains.filter((selectedDomain) => selectedDomain !== domain);
      } else {
        return [...prevSelectedDomains, domain];
      }
    });
  };

  const handlePromptChange = (index: number, value: string) => {
    setPrompts((prevPrompts: string[]) => {
      const updatedPrompts = [...prevPrompts];
      updatedPrompts[index] = value;
      return updatedPrompts;
    });
  };

  const handleAddPrompt = () => {
    setPrompts((prevPrompts: string[]) => [...prevPrompts, '']);
  };

  const handleRemovePrompt = (index: number) => {
    setPrompts((prevPrompts: string[]) => {
      const updatedPrompts = [...prevPrompts];
      updatedPrompts.splice(index, 1);
      return updatedPrompts;
    });
  };

  const createNewDpia = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const validPrompts = prompts.filter((prompt) => prompt.trim() !== '');
      console.log('Domains:', selectedDomains);
      console.log('Prompts:', validPrompts);
      console.log('Checkbox 1:', regEnfcheckbox);
      console.log('Checkbox 2:', mediaCheckbox);
      console.log('Checkbox 3:', euCheckbox);
      console.log('Selected Options:', selectedOptions.map((option) => option.key));

      const model = 'gpt-4';


      validPrompts.forEach(async (additionalAssessment, index) => {
        console.log(`Prompt ${index + 1}: ${additionalAssessment}`);

        const customPrompt = additionalAssessment + 'the answer should be in context of proudct' +projectConfig.regenfInstruction ;
        const customArea = 'Additional Assessment';
        console.log("additionalAssessment"+additionalAssessment);
        console.log("customArea"+customArea);
        console.log("productID"+selectedProduct?.id);
        const customnotification = toast.loading('AI is thinking about ...' + customArea);
        
      
        await fetch('/api/createDpia', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: customPrompt,
            productId: selectedProduct?.id,
            model,
            session,
            domain: customArea,
          }),
         })
          .then(() => {
            toast.success('AI has responded', { id: customnotification });
          })
          .catch((err) => {
            console.log('Error while calling API:', err);
          });
         

      });
      

      if(regEnfcheckbox){

        const regEnfPrompt = context +  projectConfig.regenfInstruction ;
        const regEnfArea = 'Relavant Regulatory Enforcement';
        console.log("regEnfPrompt"+regEnfPrompt);
        console.log("regEnfArea"+regEnfArea);
        console.log("productID"+selectedProduct?.id);
        const regenfnotification = toast.loading('AI is thinking about ...' + regEnfArea);
        
      
        await fetch('/api/createDpia', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: regEnfPrompt,
            productId: selectedProduct?.id,
            model,
            session,
            domain: regEnfArea,
          }),
         })
          .then(() => {
            toast.success('AI has responded', { id: regenfnotification });
          })
          .catch((err) => {
            console.log('Error while calling API:', err);
          });
         
           
      }

      if(mediaCheckbox){

        const mediaPrompt = context +  projectConfig.mediaInstruction ;
        const mediaArea = "Relavant Media Coverage"
        console.log("mediaPrompt"+mediaPrompt);
        console.log("mediaArea"+mediaArea);
        console.log("productID"+selectedProduct?.id);
        const medianotification = toast.loading('AI is thinking about ...' + mediaArea);
        
      
        await fetch('/api/createDpia', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: mediaPrompt,
            productId: selectedProduct?.id,
            model,
            session,
            domain: mediaArea,
          }),
         })
          .then(() => {
            toast.success('AI has responded', { id: medianotification });
          })
          .catch((err) => {
            console.log('Error while calling API 1:', err);
          });
         
           
      }
     
      if(euCheckbox){

        const euPrompt = context +  projectConfig.euInstruction ;
        const euArea = "Relavant EU Judgement"
        console.log("euPrompt"+euPrompt);
        console.log("euArea"+euArea);
        console.log("productID"+selectedProduct?.id);
        const eunotification = toast.loading('AI is thinking about ...' + euArea);
        
      
        await fetch('/api/createDpia', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: euPrompt,
            productId: selectedProduct?.id,
            model,
            session,
            domain: euArea,
          }),
         })
          .then(() => {
            toast.success('AI has responded', { id: eunotification });
          })
          .catch((err) => {
            console.log('Error while calling API:', err);
          });
         
           
      }


      for (const { domain } of Domains) {
        if (selectedDomains.includes(domain)) {
          const domainPrompt = context + dpiaInstruction + domain + domainInstruction;
          const notification = toast.loading('AI is thinking about ...' + domain);
          console.log(domainPrompt);
           await fetch('/api/createDpia', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt: domainPrompt,
              productId: selectedProduct?.id,
              model,
              session,
              domain,
            }),
           })
            .then(() => {
              toast.success('AI has responded', { id: notification });
            })
            .catch((err) => {
              console.log('Error while calling API:', err);
            });

           

          setSelectedOptions([]); // Reset selected options
        }
      }

      router.push(`/dpia/${selectedProduct?.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const Domains = [
    { domain: 'Transparency' },
    { domain: 'Fairness' },
    { domain: 'Purpose Limitation' },
    { domain: 'Data Subject Rights' },
    { domain: 'Breach' },
    { domain: 'Deletion' },
    { domain: 'Privacy for Security' },
    { domain: 'Privacy By Design and Default' },
  ];

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
                <p className="mb-2 font-semibold">Features</p>
                <ul>
                {selectedProduct.requirements.map((requirements, index: number) => (
    <li key={index} className="mb-1 text-xs">
      {`${index + 1}. ${requirements.requirement}`}
    </li>
  ))}
</ul>
                
        </div>
      ) : (
        <div className="p-6">
          <p>No product selected.</p>
        </div>
      )}

        <h1 className="text-3xl font-bold mb-4"> Configure DPIA preferences </h1>
        <div className="p-8 flex-1 grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {Domains?.map(({ domain }: { domain: string }) => (
            <motion.div
              key={domain}
              className={`flex items-center justify-center p-4 rounded-lg transition-colors duration-300 hover:rgba(131,58,180,1) ${
                selectedDomains.includes(domain) ? 'bg-primary text-white' : 'bg-gray-100 text-black'
              }`}
              style={{ borderColor: selectedDomains.includes(domain) ? 'bg-primary' : 'transparent', borderWidth: '2px' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDomainSelection(domain)}
            >
              <p className={`text-lg font-semibold ${selectedDomains.includes(domain) ? 'text-white' : ''}`}>{domain}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <form onSubmit={createNewDpia} className="flex flex-col px-6 py-4 space-y-6 border-t border-gray-100">
        {/* Rest of the code... */}

        <Multiselect
          displayValue="key"
          onSelect={(selectedList: any[], selectedItem: any) => setSelectedOptions(selectedList)}
          onRemove={(selectedList: any[], removedItem: any) => setSelectedOptions(selectedList)}
          options={[
            { key: 'Option 1' },
            { key: 'Option 2' },
            { key: 'Option 3' },
            { key: 'Option 4' },
            { key: 'Option 5' },
          ]}
        />

        

<div className="flex flex-col space-y-4">
          {prompts.map((prompt, index) => (
            <motion.div
              key={index}
              className="relative flex items-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <input
                className="items-center py-2 border-b-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed h-20 flex-1 p-2 rounded-md resize-none"
                disabled={!session}
                value={prompt}
                onChange={(e) => handlePromptChange(index, e.target.value)}
                type="text"
                placeholder="Type your additional assessment areas here"
              />

              {index > 0 && (
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={() => handleRemovePrompt(index)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
              )}
            </motion.div>
          ))}
          <motion.div
            className="flex items-center space-x-2 "
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: prompts.length * 0.1 }}
          >
            <button
              type="button"
              className="flex items-center justify-center p-2 bg-gray-200 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={handleAddPrompt}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <p className="text-sm text-gray-500">Add prompt</p>
          </motion.div>
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <input
              className="form-checkbox"
              type="checkbox"
              checked={regEnfcheckbox}
              onChange={(e) => setregEnfcheckbox(e.target.checked)}
            />
            <label>Relavant Regulatory Enforcement</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              className="form-checkbox"
              type="checkbox"
              checked={mediaCheckbox}
              onChange={(e) => setmediaCheckbox(e.target.checked)}
            />
            <label>Include Relavant Media Coverage</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              className="form-checkbox"
              type="checkbox"
              checked={euCheckbox}
              onChange={(e) => seteuCheckbox(e.target.checked)}
            />
            <label>Include Relavant EU Judgements</label>
          </div>
        </div>


        <button
          disabled={!session}
          type="submit"
          className="bg-primary hover:rgba(131,58,180,1) text-white font-bold py-3 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Submit
        </button>
        
      </form>
      <Footer className="flex-none"/> 
     </div> 
    </div>
  );
}

export default DpiaPage;