'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import RadioInput from '@/components/common/Input/RadioButton';

const JoinUsStep3Page = () => {
    const router = useRouter();

    // Simple local state for radios/checkbox; no submission wiring yet
    const [isInternship, setIsInternship] = useState<'yes' | 'no' | ''>('');
    const [hoursAvailable, setHoursAvailable] = useState('');
    const [startDate, setStartDate] = useState('');

    const [criminalCheck1, setCriminalCheck1] = useState<'yes' | 'no' | ''>('');
    const [criminalCheck2, setCriminalCheck2] = useState<'yes' | 'no' | ''>('');
    const [criminalCheck3, setCriminalCheck3] = useState<'yes' | 'no' | ''>('');

    const [sexOffenderCheck, setSexOffenderCheck] = useState<'yes' | 'no' | ''>('');

    const [disciplinary1, setDisciplinary1] = useState<'yes' | 'no' | ''>('');
    const [disciplinary2, setDisciplinary2] = useState<'yes' | 'no' | ''>('');
    const [disciplinary3, setDisciplinary3] = useState<'yes' | 'no' | ''>('');

    const [healthCheck, setHealthCheck] = useState<'yes' | 'no' | ''>('');

    const [consent1, setConsent1] = useState<'yes' | 'no' | ''>('');
    const [consent2, setConsent2] = useState<'yes' | 'no' | ''>('');
    const [consent3, setConsent3] = useState<'yes' | 'no' | ''>('');

    const [previousVolunteer, setPreviousVolunteer] = useState<'yes' | 'no' | ''>('');
    const [photoConsent, setPhotoConsent] = useState<'yes' | 'no' | ''>('');
    const [termsAccepted, setTermsAccepted] = useState(false);

    return (
        <div className="min-h-screen bg-background-input flex flex-col items-center">
            {/* Title section */}
            <section className="w-full flex flex-col items-center justify-center pt-10 md:pt-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-2xl md:text-4xl lg:text-[40px] font-semibold tracking-tight text-gray-900 mb-3">
                        We&apos;re excited that you want to join us! 😊
                    </h1>
                    <p className="text-sm md:text-base lg:text-lg text-black lg:text-gray-600 italic">
                        Fill in the details below so we can get to know you better. Once submitted, our team will
                        review your information and get in touch with you soon.
                    </p>
                </div>
            </section>

            {/* Form card */}
            <main className="w-full flex-1 flex justify-center py-8 md:py-12 lg:py-16">
                <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <form
                        className="bg-white rounded-[24px] shadow-sm px-4 sm:px-6 md:px-10 lg:px-12 py-6 md:py-8 lg:py-10 space-y-10"
                        onSubmit={(e) => {
                            e.preventDefault();
                            router.push('/join-us/success');
                        }}
                    >
                        {/* Application Questions */}
                        <section className="space-y-5">
                            <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900">
                                Application Questions
                            </h2>

                            {/* Are you looking for an internship */}
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-800">
                                    Are you looking for an internship opportunity
                                </p>
                                <RadioInput
                                    inputType="radio"
                                    name="internship_opportunity"
                                    value={isInternship}
                                    onChange={(value) =>
                                        setIsInternship(value as '' | 'yes' | 'no')
                                    }
                                    options={[
                                        { value: 'yes', label: 'Yes' },
                                        { value: 'no', label: 'No' },
                                    ]}
                                    inputClassName="mt-1"
                                />
                            </div>

                            {/* Long text questions */}
                            <div className="space-y-4 md:space-y-5">
                                {[
                                    'Why are you interested in this opportunity with MelodyWings?',
                                    'Why are you interested in the role you selected?',
                                    'What relevant experience do you have for this role?',
                                    'What skills would you bring to this role?',
                                ].map((label) => (
                                    <div key={label} className="space-y-2">
                                        <label className="text-sm font-medium text-gray-800">
                                            {label}
                                        </label>
                                        <textarea
                                            rows={4}
                                            className="w-full rounded-2xl border border-gray-200 bg-background-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                            placeholder={
                                                label ===
                                                'What relevant experience do you have for this role?'
                                                    ? 'Clubs, volunteer work, internships, school projects, etc.'
                                                    : 'Describe here'
                                            }
                                        />
                                    </div>
                                ))}

                                {/* Hours available / when start */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-800">
                                            How many hours per week are you available?
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full rounded-xl border border-gray-200 bg-background-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                            placeholder="Enter here"
                                            value={hoursAvailable}
                                            onChange={(e) => setHoursAvailable(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-800">
                                            When would you be available to start?
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full rounded-xl border border-gray-200 bg-background-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                            placeholder="Enter here"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-800">
                                        Have you previously volunteered or worked with children or neurodivergent
                                        learners? If yes, please describe.
                                    </label>
                                    <textarea
                                        rows={4}
                                        className="w-full rounded-2xl border border-gray-200 bg-background-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="Describe here"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-800">
                                        Is there anything else you would like us to know about you?
                                    </label>
                                    <textarea
                                        rows={4}
                                        className="w-full rounded-2xl border border-gray-200 bg-background-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="Describe here"
                                    />
                                </div>
                            </div>
                        </section>

                        <hr className="border-gray-200" />

                        {/* Legal and Safety Information */}
                        <section className="space-y-6">
                            <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900">
                                Legal and Safety Information
                            </h2>

                            {/* 1. Criminal Background Check */}
                            <div className="rounded-3xl border border-gray-200 px-4 sm:px-5 md:px-6 py-4 md:py-5 space-y-4">
                                <p className="text-sm font-semibold text-gray-900">
                                    1. Criminal Background Check
                                </p>
                                {[
                                    'Have you ever been convicted of a felony or misdemeanor?',
                                    'Have you ever been involved in any criminal activity or legal proceedings, including pending charges or arrests?',
                                    'Have you been convicted of any crimes involving minors, abuse, or neglect?',
                                ].map((question, index) => (
                                    <div key={question} className="space-y-2">
                                        <p className="text-sm text-gray-800">{question}</p>
                                        <RadioInput
                                            inputType="radio"
                                            name={`criminal_${index}`}
                                            value={
                                                index === 0
                                                    ? criminalCheck1
                                                    : index === 1
                                                    ? criminalCheck2
                                                    : criminalCheck3
                                            }
                                            onChange={(value) => {
                                                const v = value as '' | 'yes' | 'no';
                                                if (index === 0) setCriminalCheck1(v);
                                                else if (index === 1) setCriminalCheck2(v);
                                                else setCriminalCheck3(v);
                                            }}
                                            options={[
                                                { value: 'yes', label: 'Yes' },
                                                { value: 'no', label: 'No' },
                                            ]}
                                            inputClassName="mt-1"
                                        />
                                    </div>
                                ))}
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-800">
                                        Please describe the circumstance behind the &quot;yes&quot; answer above.
                                    </p>
                                    <textarea
                                        rows={3}
                                        className="w-full rounded-2xl border border-gray-200 bg-background-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="Describe here"
                                    />
                                </div>
                            </div>

                            {/* 2. Sex Offender Registry Check */}
                            <div className="rounded-3xl border border-gray-200 px-4 sm:px-5 md:px-6 py-4 md:py-5 space-y-4">
                                <p className="text-sm font-semibold text-gray-900">
                                    2. Sex Offender Registry Check
                                </p>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-800">
                                        Are you listed on any state or national sex offender registries?
                                    </p>
                                    <RadioInput
                                        inputType="radio"
                                        name="sex_offender"
                                        value={sexOffenderCheck}
                                        onChange={(value) =>
                                            setSexOffenderCheck(value as '' | 'yes' | 'no')
                                        }
                                        options={[
                                            { value: 'yes', label: 'Yes' },
                                            { value: 'no', label: 'No' },
                                        ]}
                                        inputClassName="mt-1"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-800">
                                        Please describe the circumstance behind the &quot;yes&quot; answer above.
                                    </p>
                                    <textarea
                                        rows={3}
                                        className="w-full rounded-2xl border border-gray-200 bg-background-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="Describe here"
                                    />
                                </div>
                            </div>

                            {/* 3. Disciplinary History */}
                            <div className="rounded-3xl border border-gray-200 px-4 sm:px-5 md:px-6 py-4 md:py-5 space-y-4">
                                <p className="text-sm font-semibold text-gray-900">
                                    3. Disciplinary History
                                </p>
                                {[
                                    'Have you ever been terminated or asked to resign from a volunteer or employment position for reasons related to misconduct or inappropriate behavior?',
                                    'Have you ever been involved in any disputes with employers or organizations related to safety or ethical issues?',
                                    'Have you ever faced dismissal, suspension, probation, or any other disciplinary or academic action from a college, university, or professional school?',
                                ].map((question, index) => (
                                    <div key={question} className="space-y-2">
                                        <p className="text-sm text-gray-800">{question}</p>
                                        <RadioInput
                                            inputType="radio"
                                            name={`disciplinary_${index}`}
                                            value={
                                                index === 0
                                                    ? disciplinary1
                                                    : index === 1
                                                    ? disciplinary2
                                                    : disciplinary3
                                            }
                                            onChange={(value) => {
                                                const v = value as '' | 'yes' | 'no';
                                                if (index === 0) setDisciplinary1(v);
                                                else if (index === 1) setDisciplinary2(v);
                                                else setDisciplinary3(v);
                                            }}
                                            options={[
                                                { value: 'yes', label: 'Yes' },
                                                { value: 'no', label: 'No' },
                                            ]}
                                            inputClassName="mt-1"
                                        />
                                    </div>
                                ))}
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-800">
                                        Please describe the circumstance behind the &quot;yes&quot; answer above.
                                    </p>
                                    <textarea
                                        rows={3}
                                        className="w-full rounded-2xl border border-gray-200 bg-background-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="Describe here"
                                    />
                                </div>
                            </div>

                            {/* 4. Health and Safety Information */}
                            <div className="rounded-3xl border border-gray-200 px-4 sm:px-5 md:px-6 py-4 md:py-5 space-y-4">
                                <p className="text-sm font-semibold text-gray-900">
                                    4. Health and Safety Information
                                </p>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-800">
                                        Do you have any physical or mental health conditions that may affect your
                                        ability to perform volunteer duties?
                                    </p>
                                    <RadioInput
                                        inputType="radio"
                                        name="health_safety"
                                        value={healthCheck}
                                        onChange={(value) =>
                                            setHealthCheck(value as '' | 'yes' | 'no')
                                        }
                                        options={[
                                            { value: 'yes', label: 'Yes' },
                                            { value: 'no', label: 'No' },
                                        ]}
                                        inputClassName="mt-1"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-800">
                                        Please describe the circumstance behind the &quot;yes&quot; answer above.
                                    </p>
                                    <textarea
                                        rows={3}
                                        className="w-full rounded-2xl border border-gray-200 bg-background-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="Describe here"
                                    />
                                </div>
                            </div>

                            {/* 5. Consents */}
                            <div className="rounded-3xl border border-gray-200 px-4 sm:px-5 md:px-6 py-4 md:py-5 space-y-4">
                                <p className="text-sm font-semibold text-gray-900">5. Consents</p>
                                {[
                                    'Do you consent to do child abuse registry and sex offender checks if needed? *',
                                    "Do you agree to follow the organization's policies on confidentiality, behavior, and safeguarding procedures? *",
                                    "Do you understand that your volunteer role may be terminated based on any criminal activity or failure to adhere to the organization's policies? *",
                                ].map((question, index) => (
                                    <div key={question} className="space-y-2">
                                        <p className="text-sm text-gray-800">{question}</p>
                                        <RadioInput
                                            inputType="radio"
                                            name={`consent_${index}`}
                                            value={
                                                index === 0
                                                    ? consent1
                                                    : index === 1
                                                    ? consent2
                                                    : consent3
                                            }
                                            onChange={(value) => {
                                                const v = value as '' | 'yes' | 'no';
                                                if (index === 0) setConsent1(v);
                                                else if (index === 1) setConsent2(v);
                                                else setConsent3(v);
                                            }}
                                            options={[
                                                { value: 'yes', label: 'Yes' },
                                                { value: 'no', label: 'No' },
                                            ]}
                                            inputClassName="mt-1"
                                        />
                                    </div>
                                ))}
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-800">
                                        Please describe the circumstance behind the &quot;No&quot; answer above.
                                    </p>
                                    <textarea
                                        rows={3}
                                        className="w-full rounded-2xl border border-gray-200 bg-background-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="Describe here"
                                    />
                                </div>
                            </div>

                            {/* 6. Previous Volunteer Experience */}
                            <div className="rounded-3xl border border-gray-200 px-4 sm:px-5 md:px-6 py-4 md:py-5 space-y-4">
                                <p className="text-sm font-semibold text-gray-900">
                                    6. Previous Volunteer Experience
                                </p>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-800">
                                        Have you ever been involved in any incidents or complaints during previous
                                        volunteer roles? *
                                    </p>
                                    <RadioInput
                                        inputType="radio"
                                        name="previous_volunteer"
                                        value={previousVolunteer}
                                        onChange={(value) =>
                                            setPreviousVolunteer(value as '' | 'yes' | 'no')
                                        }
                                        options={[
                                            { value: 'yes', label: 'Yes' },
                                            { value: 'no', label: 'No' },
                                        ]}
                                        inputClassName="mt-1"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-800">
                                        Please describe the circumstance behind the &quot;yes&quot; answer above.
                                    </p>
                                    <textarea
                                        rows={3}
                                        className="w-full rounded-2xl border border-gray-200 bg-background-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="Mention here"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Consent and permissions */}
                        <section className="space-y-4">
                            <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900">
                                Consent and Permissions
                            </h2>

                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-800">Photo/Video Consent</p>
                                <p className="text-xs md:text-sm text-gray-600">
                                    (for use in program materials or promotional content)
                                </p>
                                <RadioInput
                                    inputType="radio"
                                    name="photo_consent"
                                    value={photoConsent}
                                    onChange={(value) =>
                                        setPhotoConsent(value as '' | 'yes' | 'no')
                                    }
                                    options={[
                                        { value: 'yes', label: 'Yes' },
                                        { value: 'no', label: 'No' },
                                    ]}
                                    inputClassName="mt-1"
                                />
                            </div>

                            <div className="mt-4 flex items-start gap-2">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                    className="mt-1 h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                                />
                                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                                    I consent to MW collecting, using and/or sharing my personal information as
                                    mentioned in the <span className="underline">Privacy Policy</span>. By accepting
                                    the <span className="underline">Terms of Service</span>, either by clicking a box
                                    indicating your acceptance or by using and navigating through our platform through
                                    our website, you agree that (a) you have read and understood the agreement; (b) you
                                    represent that you are at least 18 years old; (c) you can form a binding contract;
                                    and (d) you accept this agreement and agree that you are legally bound by its
                                    terms. Individuals under the age of 18 or those with mental developmental
                                    disabilities of any age may access the services only when accompanied by a parent
                                    or legal guardian. Parents or guardians accompanying such users, by accepting the{' '}
                                    <span className="underline">Terms of Service</span>, either by clicking a box
                                    indicating your acceptance or by using and navigating through our platform through
                                    our website, (a) you have read and understood the agreement; (b) you represent that
                                    you are the parent or legal guardian of such individual (c) your acceptance of
                                    these terms on behalf of the individual will form a binding contract; and (d) you
                                    accept this agreement on behalf of the individual and agree that the individual is
                                    legally bound by its terms&quot;
                                </p>
                            </div>
                        </section>

                        {/* Navigation buttons */}
                        <div className="mt-4 flex justify-between items-center">
                            <Button
                                type="button"
                                title="Previous"
                                btnVariant="tertiary"
                                customClassName="!px-6 !py-2 !h-10 md:!h-11 border border-gray-300 !text-gray-700"
                                onClick={() => router.push('/join-us/step-2')}
                            />
                            <Button
                                type="submit"
                                title="Submit Application"
                                btnVariant="secondary"
                                customClassName="!px-6 !py-2 !h-10 md:!h-11"
                            />
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default JoinUsStep3Page;