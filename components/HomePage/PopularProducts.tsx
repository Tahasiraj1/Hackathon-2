import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'

const PopularProducts = () => {
  return (
    <div className='flex flex-col w-full py-10 items-center justify-center bg-white text-black px-0 lg:px-10 pl-4 font-clashDisplay'>
      <div className='w-full'>
        <h2 className='text-2xl text-start mb-10'>Our popular products</h2>
        <div className='flex gap-4'>
          <div className='w-[630px] h-[462px] flex-col md:flex hidden '>
            <Image
              src="/Images/Large.jpg"
              alt='The dandy chair'
              width={1000}
              height={1000}
              className='mb-4 w-[630px] h-[375px] '
            />
            <h3>The Popular suede sofa</h3>
            <span>£980</span>
          </div>
          <div className='w-[305px] h-[462px] flex-col md:flex hidden '>
            <Image
              src="/Images/Photo.png"
              alt='Rustic Vase Set'
              width={1000}
              height={1000}
              className='mb-4 w-[305px] h-[375px] '
            />
            <h3>The Dandy chair</h3>
            <span>£250</span>
          </div>
          <div className='w-[305px] h-[462px] flex-col md:flex hidden '>
            <Image
              src="/Images/Photo (4).png"
              alt='The Silky Vase'
              width={1000}
              height={1000}
              className='mb-4 w-[305px] h-[375px] '
            />
            <h3>The Dandy chair</h3>
            <span>£250</span>
          </div>
          {/* Small screen products */}
          <div className='w-[305px] h-[462px] flex-col md:hidden '>
            <Image
              src="/Images/Photo (3).png"
              alt='The Silky Vase'
              width={1000}
              height={1000}
              className='mb-4 w-[305px] h-[375px] '
            />
            <h3>The Dandy chair</h3>
            <span>£250</span>
          </div>
          <div className='w-[305px] h-[462px] flex-col md:hidden overflow-x-hidden '>
            <Image
              src="/Images/Photo (1).png"
              alt='The Silky Vase'
              width={1000}
              height={1000}
              className='mb-4 w-[305px] h-[375px] '
            />
            <h3>The Dandy chair</h3>
            <span>£250</span>
          </div>
        </div>
      </div>
      <div className='flex justify-center items-center mt-8'>
        <Button className='bg-gray-200 rounded-none px-6 py-6 hover:bg-gray-300 text-black w-fit'>
          View collection
        </Button>
      </div>
    </div>
  )
}

export default PopularProducts