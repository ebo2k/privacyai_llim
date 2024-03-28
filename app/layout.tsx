

import Header from 'all/components/Header'
import Footer from './Footer'
import { Inter } from 'next/font/google'
import '../styles/globals.css';
import { SessionProvider } from 'all/components/SessionProvider';
import ClientProvider from 'all/components/ClientProvider';
import Head from './head';
import {getServerSession} from "next-auth";
import { authOptions } from 'all/pages/api/auth/[...nextauth]';
import { ProductProvider } from './ProductContext';



export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {  
  
  const session = await getServerSession(authOptions)
  
  return (
    <html className= " scroll-smooth">
      <Head/>
      <body>
        <SessionProvider session={session}>
          <Header/>
          <ProductProvider>
            <ClientProvider/>          
            <div >{children}</div>
            </ProductProvider>

        </SessionProvider>
      </body>
    </html>
  )
}