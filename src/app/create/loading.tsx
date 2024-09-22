import { Loader } from 'lucide-react'
import React from 'react'

export default function loading() {
  return (
    <div className='w-full h-dvh flex justify-center items-center'>
      <Loader className='animate-spin text-white' />
    </div>
  )
}
