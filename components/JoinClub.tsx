import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'

const JoinClub = () => {
  return (
    <div className='bg-gray-100 flex w-full px-4 md:px-10 py-6 md:py-10 items-center justify-center'>
        <div className='flex flex-col w-full items-center justify-center gap-6 bg-white py-10 px-10'>
            <h2 className='text-3xl font-satoshi'>
                Join the club and get the benefit
            </h2>
            <p className='text-center'>
                Sign up for our newsletter and recieve exclusive offers on new<br /> 
                ranges, sales, pop up stores and more
            </p>
            <div className='flex'>
                <Input
                type='text'
                placeholder='your@email.com'
                className='md:w-[354px] h-[56px] bg-gray-200 rounded-none'
                />
                <Button
                className='md:w-[118px] h-[56px] bg-[#2A254B] text-white rounded-none'
                >
                    Sign up
                </Button>
            </div>
        </div>
    </div>
  )
}

export default JoinClub
