"use client"

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { doc, getDoc, addDoc, collection, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { db } from 'all/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import toast from 'react-hot-toast';
import queryGPT from 'all/lib/queryApi';
import TransitionEffect from 'all/app/TransitionEffect';

import { EyeIcon } from '@heroicons/react/24/outline';
import { PlusIcon, MagnifyingGlassIcon, ShieldExclamationIcon } from '@heroicons/react/24/solid';
import { useEffect } from 'react'; 

import { ProductProvider, useProductContext } from 'all/app/ProductContext';

function NewProduct() {
  const router = useRouter();
  const { data: session } = useSession();

  const [products, loading, error] = useCollection(
    session && query(collection(db, 'users', session?.user?.email!, 'products'), orderBy('createdAt', 'asc'))
  );

  const { setSelectedProduct } = useProductContext();

  const createNewProduct = async () => {
    try {
      const docRef = await addDoc(collection(db, 'users', session?.user?.email!, 'products'), {
        name: 'New Product444',
        desc: 'Product description', 
        requirements: ['req 11', 'req 21', 'req 31'],
        userID: session?.user?.email!,
        createdAt: serverTimestamp(),
        image: 'https://example.com/image.jpg',
      });
      console.log('new product added and the ID is:', docRef.id);
      // router.push(`/product/${docRef.id}`);
    } catch (error) {
      console.log('errorrrrr');
      console.error(error);
    }
  };

  const createNewDpia = async (productId: string) => {
    try {
      const productDocRef = doc(db, 'users', session?.user?.email!, 'products', productId);
      const productDocSnap = await getDoc(productDocRef);
      const productData = productDocSnap.data();

      if (productData) {
        const selectedProductData = {
          id: productId,
          name: productData.name,
          image: productData.image,
          desc: productData.desc,
          requirements: productData.requirements,
        };

        setSelectedProduct(selectedProductData);

        console.log('Selected Product 121212:', setSelectedProduct);
        router.push(`/dpiapref/${productId}`);
        console.log('after routing');
      } else {
        console.log('Product not found');
      }
    } catch (error) {
      console.log('errorrrrr');
      console.error(error);
    }
  };

  const viewDpia = async (productId: string) => {
    try {
      const productDocRef = doc(db, 'users', session?.user?.email!, 'products', productId);
      const productDocSnap = await getDoc(productDocRef);
      const productData = productDocSnap.data();

      if (productData) {
        const selectedProductData = {
          id: productId,
          name: productData.name,
          image: productData.image,
          desc: productData.desc,
          requirements: productData.requirements,
        };

        setSelectedProduct(selectedProductData);

        console.log('Selected Product777:', setSelectedProduct);
        router.push(`/dpia/${productId}`);
        console.log('after routing');
      } else {
        console.log('Product not found');
      }
    } catch (error) {
      console.log('errorrrrr');
      console.error(error);
    }
  };

  const viewEvidence = async (productId: string) => {
    try {
      const productDocRef = doc(db, 'users', session?.user?.email!, 'products', productId);
      const productDocSnap = await getDoc(productDocRef);
      const productData = productDocSnap.data();

      if (productData) {
        const selectedProductData = {
          id: productId,
          name: productData.name,
          image: productData.image,
          desc: productData.desc,
          requirements: productData.requirements,
        };

        setSelectedProduct(selectedProductData);

        console.log('Selected Product777:', setSelectedProduct);
        router.push(`/evidence/${productId}`);
        console.log('after routing');
      } else {
        console.log('Product not found');
      }
    } catch (error) {
      console.log('errorrrrr');
      console.error(error);
    }
  };

  const analyzeRisk = async (productId: string) => {
    try {
      const productDocRef = doc(db, 'users', session?.user?.email!, 'products', productId);
      const productDocSnap = await getDoc(productDocRef);
      const productData = productDocSnap.data();

      if (productData) {
        const selectedProductData = {
          id: productId,
          name: productData.name,
          image: productData.image,
          desc: productData.desc,
          requirements: productData.requirements,
        };

        setSelectedProduct(selectedProductData);

        console.log('Selected Product777:', setSelectedProduct);
        router.push(`/riskanalysis/${productId}`);
        console.log('after routing');
      } else {
        console.log('Product not found');
      }
    } catch (error) {
      console.log('errorrrrr');
      console.error(error);
    }
  };
  

  const viewProduct = async (productId: string) => {
    try {
      const productDocRef = doc(db, 'users', session?.user?.email!, 'products', productId);
      const productDocSnap = await getDoc(productDocRef);
      const productData = productDocSnap.data();

      if (productData) {
        const selectedProductData = {
          id: productId,
          name: productData.name,
          image: productData.image,
          desc: productData.desc,
          requirements: productData.requirements,
        };

        setSelectedProduct(selectedProductData);

        console.log('Selected Product777:', setSelectedProduct);
        router.push(`/product/${productId}`);
        console.log('after routing');
      } else {
        console.log('Product not found');
      }
    } catch (error) {
      console.log('errorrrrr');
      console.error(error);
    }
  };

  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="p-8">
  <TransitionEffect />
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-2xl font-bold">Products</h2>
    

    <p></p>
          <motion.div
            onClick={createNewProduct}
            className="bg-primary hover:bg-fuchsia-950 text-white font-bold py-2 px-4 rounded cursor-pointer"
            whileHover={{
              backgroundColor: ['#121212', 'rgba(131,58,180,1)', 'rgba(253,29,29,1)', 'rgba(252,176,69,1)', 'rgba(131,58,180,1)', '#121212'],
              transition: { duration: 1, repeat: Infinity },
            }}
          >
            Add New Product
          </motion.div>
      
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
    {loading && (
      <div className="animate-pulse text-center text-black">
        <p>Loading Products...</p>
      </div>
    )}
    {products?.docs.map((product) => (
      <motion.div
        key={product.id}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="p-6 bg-white rounded-md hover:bg-black hover:text-white shadow-lg cursor-pointer"
        onClick={() => viewProduct(product.id)}
      >
        <div className="flex items-center justify-between mb-5">
          <p className="text-lg hover:text-white font-semibold">{product.data().name}</p>
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
              onClick={() => createNewDpia(product.id)} // 
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
              onClick={() => viewDpia(product.id)} // Call the viewDpia function on button click
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
            onClick={() => viewEvidence(product.id)} // Call the viewEvidence function on button click
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
            onClick={() => analyzeRisk(product.id)} // Call the analyzeRisk function on button click
          >
            <ShieldExclamationIcon className="w-5 h-5 mr-2" />
            <p>Risk Analysis</p>
          </motion.div>


          </div>
        </div>
        <div className="border-t border-gray-300 mt-4 pt-4">
          <p className="mb-2 from-neutral-500 text-sm align-middle text-justify">
            {product.data().desc}
          </p>
          <div className="flex justify-center">
            <img
              src={product.data().image}
              alt=""
              className="h-64 w-full object-cover"
            />
          </div>
          <p className="mb-2 font-semibold">Features</p>
          <ul>
          {product.data().requirements.map((requirement: {evidence: string, requirement: string}, index: number) => (
            <li key={index} className="mb-1 text-xs">
              {`${index + 1}. ${requirement.requirement}`}
            </li>
          ))}
        </ul>
        </div>
      </motion.div>
      
      
      
    ))}
  </div>
</div>

  );
}

export default NewProduct;

