import React from 'react'

export default function Hero() {
  return (
    <div className="mt-20 pl-[145px]">
        <div className='flex items-center'>
            <div>
                <h1 className='text-brown-normal font-bold text-4xl'>อนุโมทนา</h1>
                <h1 className='text-brown-normal font-bold text-6xl mt-5'>บุญครบถ้วน รับรองอิ่มใจ</h1>
            </div>
            <div className='w-full overflow-hidden flex-1'>
                <img className='w-full object-cover' src="/monk.svg" alt="monk" />
            </div>
        </div>
    </div>
  )
}
