import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SignedIn,SignedOut, SignInButton, SignUpButton, UserButton} from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

const navbar = () => {
  return (
    <nav className='p-4 bg-transparent fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b border-transparent'>
        <div className='max=5xl mx-auto w-full flex justify-between items-center'>
            <Link href={"/"} className='flex items-center gap-2' >
            <Image src={'/favicon.ico'} alt='logo' width={100} height={100} className='w-10 h-10 rounded-full border-2 border-primary shrink-0' />
            </Link>
            <SignedOut>
                <div className='flex gap-2'>
                    <SignInButton>
                        <Button variant={"outline"} size='sm' className="rounded-full">Sign In</Button>
                    </SignInButton>
                    <SignUpButton>
                        <Button variant={"outline"} size='sm' className="rounded-full">Sign Up</Button>
                    </SignUpButton>


                </div>
            </SignedOut>
            <SignedIn>
                <UserButton/>
            </SignedIn>
        </div>

    </nav>
  )
}

export default navbar