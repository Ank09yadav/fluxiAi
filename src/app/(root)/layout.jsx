import React from 'react'
import { onBoardUser } from '@/modules/auth/actions'
import Navbar from '@/modules/home/components/navbar'
import Footer from '@/modules/home/components/footer'

const Layout = async ({ children }) => {
  await onBoardUser();
  return (
    <main className='flex flex-col min-h-screen w-full overflow-x-hidden'>
      <div className="fixed top-0 left-0 right-0 z-[60] bg-background/50 backdrop-blur-xl border-b border-border/40">
        <Navbar />
      </div>
      <div className="fixed inset-0 -z-10 h-full w-full bg-background dark:bg-[radial-gradient(#393e4a_1px,transparent_1px)] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className='flex-1 w-full mt-24 mb-12'>
        {children}
      </div>
      <Footer />
    </main>
  )
}

export default Layout