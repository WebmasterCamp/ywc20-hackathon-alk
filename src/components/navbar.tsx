import React from 'react'

export default function Navbar() {
  return (
    <div className='bg-white w-full flex items-center fixed top-0 left-0 pl-[145px] pr-[145px] py-2.5 h-20 border-b-[1px] border-b-brown-normal'>
        <div className='w-full'>
            <div className='w-44 h-9'>
                <img className='w-full object-cover' src="/images/logo2.png" alt="logo" />
            </div>
        </div>

        <div className='flex justify-around w-full'>
            <p className='text-brown-normal'>หน้าหลัก</p>
            <p>หน้าหลัก</p>
            <p>หน้าหลัก</p>
            <p>หน้าหลัก</p>
            <p>หน้าหลัก</p>
            <p>หน้าหลัก</p>
        </div>
    </div>
  )
}
