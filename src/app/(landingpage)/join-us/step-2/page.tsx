'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import RadioInput from '@/components/common/Input/RadioButton';

const POSITION_OPTIONS = [
    {
        value: 'social_media_intern',
        label: 'Social Media Intern',
        description:
            "Help grow MelodyWings' online presence by creating engaging content and sharing stories from our community.",
        responsibilities: [
            'Creating posts for Instagram, TikTok, and other platforms',
            'Designing simple graphics or short videos',
            'Highlighting volunteer stories and learner experiences',
            'Assisting with campaigns that promote MelodyWings sessions and events',
        ],
    },
    {
        value: 'volunteer_outreach_intern',
        label: 'Volunteer Outreach Intern',
        description:
            'Support the growth of our volunteer community by helping recruit and communicate with new mentors.',
        responsibilities: [
            'Reaching out to potential volunteers through schools, clubs, and organizations',
            'Helping onboard new volunteers to the platform',
            'Assisting with volunteer communication and engagement',
        ],
    },
    {
        value: 'learner_outreach_intern',
        label: 'Learner Outreach Intern',
        description:
            'Help connect more learners and families to MelodyWings so they can benefit from our sessions.',
        responsibilities: [
            'Supporting outreach to schools, NGOs, and support communities',
            'Helping parents and learners sign up and stay engaged with sessions',
            'Assisting with communication for new program launches and community programs',
        ],
    },
    {
        value: 'operations_intern',
        label: 'Operations Intern',
        description:
            'Help support the behind the scenes systems that keep MelodyWings running smoothly.',
        responsibilities: [
            'Assisting with organizational processes',
            'Helping track sessions, volunteers, and program metrics',
            'Supporting administrative tasks',
            'Helping ensure programs and testing the platform when new updates are pushed out',
        ],
    },
    {
        value: 'partnerships_intern',
        label: 'Partnerships & Community Relations Intern',
        description:
            'Help MelodyWings build relationships with organizations that share our mission.',
        responsibilities: [
            'Reaching out to potential nonprofit and community partners',
            'Helping coordinate collaborative events or initiatives',
            'Supporting communication with partner organizations',
            'Researching new partnership opportunities',
        ],
    },
];

const JoinUsStep2Page = () => {
    const router = useRouter();
    const [selectedPosition, setSelectedPosition] = useState<string>('');
    const [customRole, setCustomRole] = useState('');

    const handleNext = () => {
        // In the future, validate selection before navigation
        router.push('/join-us/step-3');
    };

    return (
        <div className="min-h-screen bg-background-input flex flex-col items-center">
            {/* Title section (consistent with step 1) */}
            <section className="w-full flex flex-col items-center justify-center pt-10 md:pt-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-2xl md:text-[32px] font-medium tracking-tight text-gray-900 mb-3">
                        We&apos;re excited that you want to join us! 😊
                    </h1>
                    <p className="text-sm md:text-[20px]  italic">
                        Fill in the details below so we can get to know you better. Once submitted, our team
                        will review your information and get in touch with you soon.
                    </p>
                </div>
            </section>

            {/* Form card */}
            <main className="w-full flex-1 flex justify-center py-8 md:py-12 lg:py-16">
                <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-[24px] shadow-sm px-4 sm:px-6 md:px-10 lg:px-12 py-6 md:py-8 lg:py-10">
                        {/* Question heading */}
                        <div className="mb-6 md:mb-8">
                            <h2 className="text-lg md:text-[24px] font-medium text-gray-900">
                                Which position are you most interested in?
                            </h2>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleNext();
                            }}
                        >
                            {/* Position radio cards */}
                            <div className="space-y-4 md:space-y-5">
                                {POSITION_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setSelectedPosition(option.value)}
                                        className={`w-full text-left rounded-3xl border px-4 sm:px-5 md:px-6 py-4 md:py-5 lg:py-6 bg-white transition-colors ${
                                            selectedPosition === option.value
                                                ? 'border-gray-900 shadow-sm bg-gray-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3 md:gap-4">
                                            <span className="mt-1">
                                                <span
                                                    className={`inline-flex items-center justify-center h-5 w-5 rounded-full border ${
                                                        selectedPosition === option.value
                                                            ? 'border-gray-900'
                                                            : 'border-gray-300'
                                                    }`}
                                                >
                                                    {selectedPosition === option.value && (
                                                        <span className="h-2.5 w-2.5 rounded-full bg-gray-900" />
                                                    )}
                                                </span>
                                            </span>

                                            <div className="flex-1 space-y-2">
                                                <div>
                                                    <p className="text-sm md:text[20px] font-medium text-gray-900">
                                                        {option.label}
                                                    </p>
                                                    <p className="mt-1 text-xs md:text-[16px] font-medium text-[#4F4F4F]">
                                                        {option.description}
                                                    </p>
                                                </div>

                                                <div className="mt-2">
                                                    <p className="text-xs md:text-sm font-medium text-gray-900 mb-1">
                                                        Responsibilities may include:
                                                    </p>
                                                    <ul className="list-disc pl-5 space-y-1 text-xs md:text-sm text-gray-700">
                                                        {option.responsibilities.map((item) => (
                                                            <li key={item}>{item}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}

                                {/* Other / custom role */}
                                <div className="mt-2 rounded-3xl border border-gray-200 px-4 sm:px-5 md:px-6 py-4 md:py-5 lg:py-6 bg-white">
                                    <div className="flex items-start gap-3 md:gap-4 mb-3">
                                        <span className="mt-1">
                                            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full border border-gray-300" />
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-sm md:text-base font-semibold text-gray-900">
                                                Other (Custom Role)
                                            </p>
                                            <p className="mt-1 text-xs md:text-sm text-gray-700">
                                                If none of these roles exactly match your interests but you believe you
                                                can contribute in another way, please describe the skills or ideas you
                                                would like to bring to MelodyWings.
                                            </p>
                                        </div>
                                    </div>

                                    <textarea
                                        className="mt-2 w-full rounded-2xl border border-gray-200 bg-background-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                        rows={4}
                                        placeholder="Describe here"
                                        value={customRole}
                                        onChange={(e) => setCustomRole(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Navigation buttons */}
                            <div className="mt-8 flex justify-between items-center">
                                <Button
                                    title="Previous"
                                    btnVariant="tertiary"
                                    customClassName="!px-6 !py-2 !h-10 md:!h-11 border border-gray-300 !text-gray-700"
                                    onClick={() => router.push('/join-us/step-1')}
                                />
                                <Button
                                    type="submit"
                                    title="Next Step"
                                    btnVariant="secondary"
                                    onClick={()=>{router.push('/join-us/step-3')}}
                                    customClassName="!px-6 !py-2 !h-10 md:!h-11"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default JoinUsStep2Page;