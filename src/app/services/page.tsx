import ServiceCard from '@/components/service-card'
import React from 'react'

export default function Servicepage() {
  return (
    <div className='w-screen h-screen flex items-center justify-center'>
        {[1,2,3,4,5].map(num => (
            <div key={num}>
                <ServiceCard />
            </div>
        ))}
    </div>
  )
}
