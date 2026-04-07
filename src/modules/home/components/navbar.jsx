import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

const Navbar = () => {
    return (
        <nav className='p-4 bg-transparent fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b border-transparent'>
            <div className='max-w-5xl mx-auto w-full flex justify-between items-center'>
                <Link href={"/"} className='flex items-center gap-2' >
                    <Image src={'/favicon.ico'} alt='logo' width={100} height={100} className='w-10 h-10 rounded-full border-2 border-primary shrink-0' />
                </Link>

                <div className='flex-1 hidden md:flex items-center ml-8 gap-6'>
                    <Link href={"/templates"} className='text-sm font-medium text-muted-foreground hover:text-primary transition-colors'>Templates</Link>
                    <Link href={"/pricing"} className='text-sm font-medium text-muted-foreground hover:text-primary transition-colors'>Pricing</Link>
                    <Link href={"/docs"} className='text-sm font-medium text-muted-foreground hover:text-primary transition-colors'>Docs</Link>
                </div>

                <SignedOut>
                    <div className='flex gap-2'>
                        <Link href={"/templates"} className='md:hidden block mr-2 mt-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors'>Templates</Link>
                        <SignInButton>
                            <Button variant={"outline"} size='sm' className="rounded-full">Sign In</Button>
                        </SignInButton>
                        <SignUpButton>
                            <Button variant={"outline"} size='sm' className="rounded-full">Sign Up</Button>
                        </SignUpButton>
                    </div>
                </SignedOut>
                <SignedIn>
                    <div className='flex items-center gap-4'>
                        <Link href={"/templates"} className='hidden md:block text-sm font-medium text-muted-foreground hover:text-primary transition-colors'>Explore Templates</Link>
                        <UserButton />
                    </div>
                </SignedIn>
            </div>

        </nav>
    )
}

export default Navbar