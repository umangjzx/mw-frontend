'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import RadioInput from '@/components/common/Input/RadioButton';

const JoinUsStep1Page = () => {
    const router = useRouter();
    const [compensationPreference, setCompensationPreference] = useState<'unpaid_ok' | 'paid_only' | ''>('');

    return (
        <div className="min-h-screen bg-background-input flex flex-col items-center">
            {/* Title section (similar style to onboarding) */}
            <section className="w-full flex flex-col items-center justify-center pt-10 md:pt-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-2xl md:text-[32px] font-medium tracking-tight text-gray-900 mb-3">
                        We&apos;re excited that you want to join us! 😊
                    </h1>
                    <p className="text-sm md:text-[20px]  text-[#121212] italic">
                        Fill in the details below so we can get to know you better. Once submitted, our team
                        will review your information and get in touch with you soon.
                    </p>
                </div>
            </section>

            {/* Form card */}
            <main className="w-full flex-1 flex justify-center py-8 md:py-12 lg:py-16">
                <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-[24px] shadow-sm px-4 sm:px-6 md:px-10 lg:px-12 py-6 md:py-8 lg:py-10">
                        {/* Basic information heading */}
                        <div className="mb-6 md:mb-8">
                            <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900">
                                Basic Information
                            </h2>
                        </div>

                        {/* Form fields */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                router.push('/join-us/step-2');
                            }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                {/* Full name */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-800">
                                        Full Name<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full rounded-xl border border-gray-200 bg-background-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="Eg. John Doe"
                                    />
                                </div>

                                {/* Email */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-800">
                                        Email Address<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        className="w-full rounded-xl border border-gray-200 bg-background-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="Enter Email Address"
                                    />
                                </div>

                                {/* Phone */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-800">
                                        Phone No<span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <select className="w-20 md:w-24 rounded-xl border border-gray-200 bg-background-input px-2 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                                            <option>+1</option>
                                            <option>+91</option>
                                        </select>
                                        <input
                                            type="tel"
                                            className="flex-1 rounded-xl border border-gray-200 bg-background-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                            placeholder="Enter Phone number"
                                        />
                                    </div>
                                </div>

                                {/* Date of birth */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-800">
                                        Date of Birth<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full rounded-xl border border-gray-200 bg-background-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="dd/mm/yyyy"
                                    />
                                </div>

                                {/* Country */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-800">
                                        Country of Residence<span className="text-red-500">*</span>
                                    </label>
                                    <select className="w-full rounded-xl border border-gray-200 bg-background-input px-3 py-2.5 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                                        <option value="">Select Country</option>
                                    </select>
                                </div>

                                {/* State */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-800">
                                        State<span className="text-red-500">*</span>
                                    </label>
                                    <select className="w-full rounded-xl border border-gray-200 bg-background-input px-3 py-2.5 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                                        <option value="">Select State</option>
                                    </select>
                                </div>

                                {/* LinkedIn */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-800">
                                        LinkedIn or Portfolio
                                    </label>
                                    <input
                                        type="url"
                                        className="w-full rounded-xl border border-gray-200 bg-background-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="Paste link here"
                                    />
                                </div>

                                {/* School / University */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-800">
                                        School / University
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full rounded-xl border border-gray-200 bg-background-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="Enter School/University"
                                    />
                                </div>

                                {/* Grade level */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-800">
                                        Grade Level / Year
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full rounded-xl border border-gray-200 bg-background-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="Enter level/year"
                                    />
                                </div>

                                {/* Current employment */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-800">
                                        Current Employment Details
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full rounded-xl border border-gray-200 bg-background-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="Enter details"
                                    />
                                </div>

                                {/* Compensation */}
                                <div className="flex flex-col gap-1 md:col-span-2">
                                    <label className="text-sm font-medium text-gray-800">
                                        Compensation / Stipend Expectation
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full rounded-xl border border-gray-200 bg-background-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="Enter here"
                                    />
                                </div>
                            </div>

                            {/* Info text */}
                            <div className="mt-6 text-xs md:text-[14px]  text-[#4F4F4F] leading-relaxed">
                                This internship is currently unpaid and designed as a volunteer or learning
                                opportunity. MelodyWings is a nonprofit organization, and while compensation
                                cannot be guaranteed at this time, stipends or honorariums may be offered in the
                                future if donations or funding become available.
                            </div>

                            {/* Radio confirmation */}
                            <div className="mt-4 space-y-3">
                                <p className="text-xs md:text-[14px]     text-[#4F4F4F]">
                                    Please confirm that you understand and are comfortable with this arrangement.
                                </p>

                                <RadioInput
                                    inputType="radio"
                                    name="compensation_preference"
                                    value={compensationPreference}
                                    onChange={(value) =>
                                        setCompensationPreference(
                                            value as '' | 'unpaid_ok' | 'paid_only'
                                        )
                                    }
                                    options={[
                                        {
                                            value: 'unpaid_ok',
                                            label: 'Yes, I understand and am willing to participate under these conditions',
                                        },
                                        {
                                            value: 'paid_only',
                                            label: 'I would prefer only paid opportunities',
                                        },
                                    ]}
                                    inputClassName="mt-1"
                                />
                            </div>

                            {/* Navigation buttons */}
                            <div className="mt-8 flex justify-between items-center">
                                <Button
                                    title="Previous"
                                    btnVariant="tertiary"
                                    customClassName="!px-6 !py-2  !rounded-[10px] !h-10 md:!h-11 border border-gray-300 !text-gray-700"
                                    onClick={() => router.push('/join-us')}
                                />
                                <Button
                                    type="submit"
                                    title="Next Step"
                                    btnVariant="secondary"
                                    onClick={()=>{router.push('/join-us/step-2')}}
                                    customClassName="!px-6 !rounded-[10px] !py-2 !h-10 md:!h-11"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default JoinUsStep1Page;

