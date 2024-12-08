import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'

const BriefAbout = () => {
  return (
    <div className='flex flex-col md:flex-row items-center justify-between bg-white text-black w-full font-satoshi'>
      <div className='flex flex-col gap-8 md:pl-10 px-4 md:px-0 pt-20 pb-10 md:pb-0'>
        <h2>
            From a studio in London to a global brand with<br />
            over 400 outlets
        </h2>
        <p>
        When we started Avion, the idea was simple. Make high quality furniture<br /> 
        affordable and available for the mass market. 
        <br />
        <br />
        Handmade, and lovingly crafted furniture and homeware is what we live,<br /> 
        breathe and design so our Chelsea boutique become the hotbed for the<br /> London interior design community.
        </p>
        <Button
        className='bg-gray-100 hover:bg-gray-200 py-6 px-6 rounded-none text-black md:w-[150px] h-[56px] md:mt-20 w-full  '
        >
            Get in touch
        </Button>
      </div>
      <Image
      src='/Images/Image.png'
      alt='Hello'
      width={1000}
      height={1000}
      className='lg:w-[720px] lg:h-[603px] md:w-[320px] h-[475px] aspect-square'
      />
    </div>
  )
}

export default BriefAbout