'use client';

import Link from 'next/link'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { signIn, signOut, useSession } from 'next-auth/react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Loader } from 'lucide-react';

export default function Header() {

  const { data: session, status: sessionStatus } = useSession();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    await signIn('google');
    setLoading(false);
  };

  const handlSignOut = () => {
    signOut();
  }

  return (
    <div className='fixed z-50 top-0 w-full h-[60px] bg-black border-b border-white/60 p-3 flex justify-between items-center'>
      <Link href={"/"}>
        <h2 className='font-bold text-xl'>AI Generate</h2>
      </Link>
      <Link href={"/create"} className='ml-[1500px] font-bold text-xl hover:text-white/70 transition-all duration-300'>
        Create
      </Link>
      {!session && sessionStatus !== 'loading' ? (
        <div className="__menu">
          <Button onClick={handleSignIn}>
            Login
          </Button>
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild className='flex gap-3 justify-center items-center'>
            <Avatar className='cursor-pointer flex justify-center items-center mr-8'>
              {!session && sessionStatus !== loading ? (
                <Button disabled className='flex justify-center items-center bg-black h-full'>
                  <Loader className="animate-spin flex justify-center items-center text-white" />
                </Button>
              ) : (
                session &&
                session.user &&
                session.user.image ? (
                  <>
                    <AvatarImage src={session.user.image} />
                    <AvatarFallback>LOGO</AvatarFallback>
                  </>
                ) : (
                <Button disabled className='flex justify-center items-center h-full bg-black'>
                  <Loader className="animate-spin flex justify-center items-center text-white" />
                </Button>
                )
              )}
            </Avatar>
          </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className='mt-2'>
              <DropdownMenuItem className='cursor-pointer'>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlSignOut} className='focus:bg-red-500 cursor-pointer'>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent> 
        </DropdownMenu>
      )}
    </div>
  )
}
