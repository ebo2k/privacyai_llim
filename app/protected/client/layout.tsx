'use client'


import '../../../styles/globals.css';
import SideBar from 'all/components/SideBar';
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'


const ClientLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin?callbackUrl=/protected/client')
    }
  })
  return (
  
    <div className='flex'>
      {/*sidebar*/}
        <div className='bg-[#202123] max-w-xs h-screen overflow-y-auto md:min-w-[10rem]'>
          <SideBar/>
        </div>
        <div className=" bg-white flex-1">{children}</div>  
  </div>
 )
}

export default ClientLayout

