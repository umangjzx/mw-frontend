import Image, { StaticImageData } from 'next/image'
import React from 'react'

export interface MeetOurTeamProps {
    image: string | StaticImageData | null;
    name: string;
    role: string;
}

function TeamCard({ name, image, role }: MeetOurTeamProps) {
  return (
    <div className='h-full w-full bg-white rounded-3xl p-6'>
        <Image src={image || ""} className='rounded-full mb-3 w-[80px] h-[80px] object-cover' alt={name} />
        <p className='text-black font-semibold'>{name}</p>
        <p className='text-sm'>{role}</p>
    </div>
  )
}

export default TeamCard