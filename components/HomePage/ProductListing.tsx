import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Checkbox } from '../ui/checkbox'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { ChevronDown } from 'lucide-react';
import { Products } from '@/lib/products'

const ProductListing = () => {
  const productTypes = ["Furniture", "Homeware", "Sofas", "Light fittings", "Accessories"]
  const price = ["0 - 100", "101 - 250", "250+"]
  const Designer = ["Robert Smith", "Liam Gallagher", "Biggie Smalls", "Thom Yorke"]

  return (
    <div className='w-full flex flex-col items-center justify-center pb-10'>
      <Image
        src="/Images/Page Headers.png"
        alt='Page Header Image'
        width={1000}
        height={100}
        className='w-full hidden md:flex'
      />
      <Image
        src="/Images/Page Headers (1).png"
        alt='Page Header Image'
        width={1000}
        height={100}
        className='w-full md:hidden'
      />
      <div className='flex w-full px-4 md:px-6 lg:px-8 mt-8 gap-8'>
        <div className='md:flex flex-col w-1/4 hidden'>
          <h2 className='text-2xl font-semibold mb-4'>Product type</h2>
          <div className='space-y-2'>
            {productTypes.map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox id={item} />
                <Label
                  htmlFor={item}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {item}
                </Label>
              </div>
            ))}
          </div>
          <h2 className='text-2xl font-semibold my-4'>Price</h2>
          <div className='space-y-2'>
            {price.map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox id={item} />
                <Label
                  htmlFor={item}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {item}
                </Label>
              </div>
            ))}
          </div>
          <h2 className='text-2xl font-semibold my-4'>Designer</h2>
          <div className='space-y-2'>
            {Designer.map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox id={item} />
                <Label
                  htmlFor={item}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {item}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-5'>
          <Button className='md:hidden bg-gray-100 hover:bg-gray-200 text-black'>
              Filters <ChevronDown />
          </Button>
          <Button className='md:hidden bg-gray-100 hover:bg-gray-200 text-black'>
              Sorting <ChevronDown />
          </Button>
            {Products.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id} className="block">
                <div className="overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-96"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-gray-600">{product.price}</p>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
      <Button className='bg-gray-200 rounded-none px-6 py-3 sm:py-4 hover:bg-gray-300 text-black w-full md:w-fit md:translate-x-32 mt-5 text-sm sm:text-base items-center justify-center'>
          Load more
       </Button>
    </div>
  )
}

export default ProductListing


