"use client"
import TransitionEffect from "all/app/TransitionEffect";
import Dpia2 from "all/components/Dpia2";
import Footer from 'all/app/Footer';

type Props= {
  params: {
      id: string;
  }
}

function DpiaPage({params: {id}}: Props) {
return (
  <div className="bg-white h-screen flex flex-col">
    <div className="flex-grow bg-white overflow-y-auto">
     <TransitionEffect />
     <Dpia2 dpiaId ={id}/>
     <Footer className="flex-none"/>   
  </div>
  </div>
);
}

export default DpiaPage;