import SideBar from 'all/components/SideBar';
import {getServerSession} from "next-auth";
import '../../styles/globals.css';
import { authOptions } from 'all/pages/api/auth/[...nextauth]';


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex'>
      {/*sidebar*/}
      <div className='bg-[#202123] max-w-xs h-screen overflow-y-auto md:min-w-[20rem]'>
        <SideBar/>
      </div>
      <div className="bg-[#343541] flex-1">{children}</div>  
    </div>
  );
}