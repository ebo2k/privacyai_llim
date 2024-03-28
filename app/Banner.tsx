"use client"

import Image from 'next/image';
import Link from 'next/link';
import { TypeAnimation } from 'react-type-animation';
import homePic from "../public/image35.png"
import TransitionEffect from './TransitionEffect';
import AnimatedText from 'all/components/AnimatedText';
import Head from 'next/head';
import Footer from './Footer';


const Banner = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-y-auto">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap"
          rel="stylesheet"
        />
      </Head>
      <TransitionEffect />

      <main className="flex items-center text-dark w-full  sm:items-start">
        <div className='w-full h-full inline-block z-0 bg-light pt-0 '>
          <div className="pt-0 w-full h-full inline-block z-0 bg-light  xl:p-6 lg:p-6 md:p-6 sm:p-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full">
            <div className="w-full lg:w-1/2">
              <Image
                src={homePic}
                alt="PrivacyAI"
                className="w-full h-auto md:inline-block"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
              />
            </div>
            <div className="w-1/2  lg:w-1/2 flex flex-col  items-center self-center  lg:items-end lg:text-right mx-0">
              <AnimatedText
                text="AI assisted privacy assessments and risk mitigation"
                className="text-left 
                xl:text-7xl lg:text-8xl md:text-5xl sm:text-5xl font-semibold"
              />
              <p className="my-10  text-left font-large text-lg md:text-md sm:text-sm">
                Transforming Privacy Risk Assessment with AI: Seamlessly analyze regulatory requirements and customer expectations to ensure product quality and speed.
              </p>
              <div className="flex items-center self-start mt-2 lg:self-center">
                <TypeAnimation
                  sequence={[
                    // Same String at the start will only be typed once, initially
                    ' Privacy Advice',
                    1000,
                    ' Risk Assessment',
                    1000,
                    ' Data Protection Impact Assessment',
                    1000,
                  ]}
                  speed={50}
                  repeat={Infinity}
                />
              </div>
              <div className="flex items-center self-start mt-4 lg:self-center"> {/* Added margin-top of 4 */}
                <Link
                 href="/protected/client"
                  className="flex items-center bg-dark text-light p-2.5 px-6 rounded-lg text-lg font-semibold hover:bg-light hover:text-dark border-2 border-solid border-transparent hover:border-dark dark:bg-light dark:text-dark hover:dark:bg-dark hover:dark:text-light md:p-2 md:px-4 md:text-base"
                 
                >
                  Ask AI
                </Link>
                
              </div>
            </div>
          </div>
          
        </div>
        
        </div>
      </main>
      <Footer className="flex-none"/>  
    </div>
  );
};

export default Banner;
