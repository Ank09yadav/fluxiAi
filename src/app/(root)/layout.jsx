import React from 'react'
import { onBoardUser } from '@/app/modules/auth/actions'
import Navbar from '@/app/modules/home/components/navbar'
const Layout = async ({children}) => {
  await onBoardUser();
  return (
    <main className='flex flex-col min-h-screen w-full overflow-x-hidden '>
        <Navbar/>
        <div className="fixed inset-0 -z-10 h-full w-full bg-backgroud dark:bg-[radial-gradient(#393e4a_1px,transparent_1px)] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[radial-gradient(#dadde2_1px,transparent_1px)] [backgroud-size:16px_16px]"/>
        <div className='flex-1 w-full mt-20'>
            {children}
        </div>
    </main>
  )
}

export default Layout