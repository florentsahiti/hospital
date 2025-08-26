import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            {/* Left Seciton */}
            <div>
                <img className='mb-5 w-40' src={assets.logo} alt="" />
                <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus, maiores animi, itaque quos ab quasi porro velit magni reprehenderit nesciunt hic debitis accusantium assumenda sint! Enim consequatur maiores corrupti excepturi!</p>

            </div>

            {/* Center Seciton */}
            <div>
                <p className='text-xl font-medium mb-5'>Company</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Contact us</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>

            {/* Right Seciton */}
            <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Phone: +123456789</li>
                    <li>Email: info@example.com</li>
                </ul>
            </div>
        </div>
        <div>
            {/* Copyright Text */}
            <hr />
            <p className='py-5 text-sm text-center'>© 2025 Hospital Management System. All rights reserved.</p>
        </div>
    </div>
  )
}

export default Footer