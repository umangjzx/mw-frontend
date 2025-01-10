import React from 'react'
import TeamCard from './TeamCard';
import { meetOurTeamCardData } from '@/constants/landingPage';
import TitleSection from '@/components/onboarding/TitleSection';

function MeetOurTeam() {
  return (
    <div className="flex flex-col gap-5">
      <TitleSection
        titleStyle="!text-2xl lg:!text-[40px] max-md:!mb-3 !font-medium"
        descriptionStyle="!text-sm md:!text-sm lg:!text-xl !font-normal !text-black"
        title="Meet our team"
        description="Together with a dedicated team, Chitra and Nithila created MelodyWings to honor their belief in the potential of every child. This platform stands as a testament to the power of empathy, individualized attention, and the joy of learning. We invite you to join us in the mission to empower and uplift the differently abled."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
        {meetOurTeamCardData.map((team, index) => (
          <TeamCard key={index} {...team} />
        ))}
      </div>
    </div>
  )
}

export default MeetOurTeam;