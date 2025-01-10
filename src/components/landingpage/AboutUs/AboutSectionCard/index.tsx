import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AboutUsImg1 from '@/assets/images/AboutUsImg1.png';
import AboutUsImg2 from '@/assets/images/AboutUsImg2.png';

function AboutSectionCard() {
  const aboutSections = [
    {
      text: (
        <p className="text-sm md:text-base lg:text-xl font-normal leading-8 max-md:!leading-6">
          The idea for MelodyWings was born from the shared experiences of a mother-daughter duo, Chitra and Nithila, during their time volunteering with His Mountain Top Ministries <Link href="https://hismountaintopministries.com" target="_blank" className="font-semibold">(HMM)</Link> through National Charity League Inc (NCL).
          <Link href="https://www.nationalcharityleague.org/chapter/granitebayarea" target="_blank" className="font-semibold"> NCL, Granite Bay Area Chapter</Link> is a group of mothers and daughters who have come together in a commitment to community service for more than 35 non-profits, and HMM is one among them.
          HMM offers horse therapy for children with special needs.
          As "sidewalkers," Chitra and Nithila walked alongside the horses, ensuring the children's safety as they participated in therapeutic activities.
        </p>
      ),
      image: AboutUsImg1,
      reverse: false,
    },
    {
      text: (
        <p className="text-sm md:text-base lg:text-xl font-normal leading-8 max-md:!leading-6 lg:text-end">
          They observed that one kid, despite struggling with stress and self-regulation, loved singing and had an exceptional voice.
          A few other children, despite having a limited attention span, enjoyed singing full rhymes with enthusiasm.
          Inspired by these moments and also their love for music, Chitra and Nithila created MelodyWings—a platform for children to explore their passion for music with support from dedicated volunteers.
          Over time, MelodyWings grew to offer a diverse range of subjects and skills tailored to children with special needs and developmental disabilities.
        </p>
      ),
      image: AboutUsImg2,
      reverse: true,
    },
  ];

  return (
    <div className="bg-white rounded-3xl w-full flex flex-col gap-10 p-5 md:p-10 mt-5">
      {aboutSections.map(({ text, image, reverse }, index) => (
        <div
          key={index}
          className={`w-full flex gap-10 ${reverse ? 'flex-row-reverse' : ''} max-lg:flex-col ${aboutSections.length - 1 !== index && 'max-md:border-b max-md:pb-8' }`}
        >
          <div className="lg:w-[50%] flex justify-center items-center">
            <Image src={image} alt="About Us" />
          </div>
          <div className="lg:w-[50%] flex items-center">{text}</div>
        </div>
      ))}
    </div>
  );
}

export default AboutSectionCard;