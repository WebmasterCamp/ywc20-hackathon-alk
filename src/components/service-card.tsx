import React from 'react'
import { Service } from './services';

interface Prop {
  service: Service;
}

export default function ServiceCard(props: Prop) {
  return (
    <div className='rounded-md mr-2 bg-white flex flex-col items-center'>
      <div className='w-24 h-24 overflow-hidden'>
        <img className='w-full object-cover' src={props.service.image} alt={props.service.name} />        
      </div>
      <h1 className='mt-2 font-semibold text-brown-normal'>{props.service.name}</h1>
    </div>
  )
}
