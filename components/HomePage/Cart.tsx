import React from 'react'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '../ui/table'
import Image from 'next/image'
import { Button } from '../ui/button'

const Cart = () => {
  return (
    <div className='flex flex-col text-start px-10 font-clashDisplay'>
      <h1 className='text-3xl mb-10'>Your shoping cart</h1>
      <Table>
        <TableHeader className='flex-col '>
            <TableRow>
                <TableHead>
                    Product
                </TableHead>
                <TableHead>
                    Quantity
                </TableHead>
                <TableHead>
                    Total
                </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow>
                <TableCell className='flex gap-x-4'>
                    <Image
                    src='/Images/Product Image.png'
                    alt=''
                    width={200}
                    height={200}
                    />
                    <div className='flex flex-col gap-4 justify-center'>
                        <h2 className='text-3xl'>Graystone vase</h2>
                        <p>A timeless ceramic vase with<br /> 
                        a tri color grey glaze</p>
                        <span>£85</span>
                    </div>
                </TableCell>
                <TableCell>
                    -{" "}{" "}1{" "}{" "}+
                </TableCell>
                <TableCell className='hidden md:flex'>
                    £85
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell className='flex gap-x-4'>
                    <Image
                    src='/Images/Product Image (1).png'
                    alt=''
                    width={200}
                    height={200}
                    />
                    <div className='flex flex-col gap-4 justify-center'>
                        <h2 className='text-3xl'>Basic white vase</h2>
                        <p>Beautifull and simple this is<br /> 
                        one for the classic</p>
                        <span>£85</span>
                    </div>
                </TableCell>
                <TableCell>
                    -{" "}{" "}1{" "}{" "}+
                </TableCell>
                <TableCell className='hidden md:flex'>
                    £85
                </TableCell>
            </TableRow>
        </TableBody>
        <TableFooter>
            <TableRow>
                <TableCell colSpan={3} className="flex flex-col items-end justify-end space-y-4 w-full text-right">
                <div className="w-full flex justify-between px-4">
                    <span>Subtotal:</span>
                    <strong>£210</strong>
                </div>
                <div className="w-full text-right px-4">
                    <span>Taxes and shipping are calculated at checkout</span>
                </div>
                <div className="w-full flex justify-end px-4">
                    <Button className="bg-[#2A254B] text-white rounded-none px-6 py-4">
                    Go to Checkout
                    </Button>
                </div>
                </TableCell>
            </TableRow>
        </TableFooter>

      </Table>
    </div>
  )
}

export default Cart
