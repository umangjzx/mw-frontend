"use client";

import DonateCard from "@/components/common/DonateCard";
import React, { useEffect, useRef, useState } from "react";
import { donateCardData } from "@/constants/landingPage";
import RadioInput from "@/components/common/Input/RadioButton";
import { Input } from "@/components/common/Input";
import Button from "@/components/common/Button";
import Accordian from "@/components/landingpage/components/Accordian";
import { getCountries, getStates } from "@/api/common";
import { COUNTRY_CODE_OPTIONS } from "@/utils/countryDialCodes";
import { cn } from "@/utils/merge-class";
import { Input as AntInput } from "antd";
import { HeartDivider, NonProfit, SecureDonation, TaxDeductive } from "@/assets/icons";
const TOP_HIGHLIGHTS = [
    { amount: "$15K", name: "Sarah Johnson" },
    { amount: "$13K", name: "Michael Chen" },
    { amount: "$10K", name: "Emily Rodriguez" },
];

const LEADERBOARD_ROWS = [
    { rank: 4, name: "David Kim", amount: "$8,500" },
    { rank: 5, name: "David Kim", amount: "$8,500" },
    { rank: 6, name: "David Kim", amount: "$8,500" },
    { rank: 7, name: "David Kim", amount: "$8,500" },
];

const DEDICATION_OPTIONS = [
    { label: "No dedication", value: "none" },
    { label: "In honor of someone", value: "honor" },
    { label: "In memory of someone", value: "memory" },
];

const FUND_OPTIONS = [
    { label: "General support", value: "general" },
    { label: "Learning resources", value: "learning" },
    { label: "Volunteer programs", value: "volunteer" },
    { label: "Other", value: "other" },
];

const HEAR_ABOUT_OPTIONS = [
    { label: "Social media", value: "social" },
    { label: "Friend or family", value: "referral" },
    { label: "Search engine", value: "search" },
    { label: "School or organization", value: "org" },
    { label: "Other", value: "other" },
];

const FAQ_ITEMS = [
    {
        key: "1",
        label: "Is this donation tax-deductible?",
        content:
            "Your gift is tax deductible as permitted by law. We are a tax-exempt organization and will email you a donation receipt—please keep it as your official record for claiming a deduction.",
    },
    {
        key: "2",
        label: "Is my donation secure?",
        content:
            "Yes. Payments are processed over encrypted connections using industry-standard security. We never store your full card details on our servers.",
    },
    {
        key: "3",
        label: "How will my donation be used?",
        content:
            "Contributions support learning resources, volunteer training, platform operations, and community programs. You can designate a fund when you donate.",
    },
];

const sectionBox =
    "md:rounded-2xl border-b md:border border-gray-200   py-5 md:px-6 md:py-6 space-y-4";

/** Field labels: 16px, regular weight, #121212 */
const DONATE_LABEL_CLASS =
    "!text-base !font-normal !text-[#121212] [&_.inner-label]:!text-base [&_.inner-label]:!font-normal";

/** Checkbox rows: same fill as other inputs */
const DONATE_CHECKBOX_ROW_CLASS = "rounded-xl border border-gray-200 bg-background-input px-4 py-3";
const PAGE_GUTTER_CLASS = "w-full px-5 md:w-[70%] md:px-0 md:mx-auto";

const Donate = () => {
    const [donateAmount, setDonateAmount] = useState("");
    const [isCustom, setIsCustom] = useState(false);
    const [customAmount, setCustomAmount] = useState("");

    const [nameVisibility, setNameVisibility] = useState<"" | "full" | "first_only" | "anonymous">(
        ""
    );
    const [donorWall, setDonorWall] = useState(true);
    const [coverFees, setCoverFees] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneCountryCode, setPhoneCountryCode] = useState<string | number>("+1");
    const [phoneNumber, setPhoneNumber] = useState("");

    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [city, setCity] = useState("");
    const [zip, setZip] = useState("");

    const [country, setCountry] = useState<string | number>("");
    const [state, setState] = useState<string | number>("");
    const [countryOptions, setCountryOptions] = useState<{ label: string; value: string }[]>([]);
    const [stateOptions, setStateOptions] = useState<{ label: string; value: string }[]>([]);
    const [countriesLoading, setCountriesLoading] = useState(false);
    const [statesLoading, setStatesLoading] = useState(false);

    const [dedication, setDedication] = useState<string | number>("none");
    const [fundDesignation, setFundDesignation] = useState<string | number>("general");
    const [fundOtherDetail, setFundOtherDetail] = useState("");
    const [message, setMessage] = useState("");
    const [hearAbout, setHearAbout] = useState<string | number>("");

    // Mobile-only carousel state for "How Your Donation Helps" cards.
    const [topCardsIndex, setTopCardsIndex] = useState(0);
    const topCardsCarouselRef = useRef<HTMLDivElement | null>(null);

    const handleTopCardsScroll = () => {
        const el = topCardsCarouselRef.current;
        if (!el) return;

        const children = Array.from(el.children) as HTMLElement[];
        if (children.length === 0) return;

        const firstLeft = children[0].offsetLeft;
        const step =
            children.length > 1 ? children[1].offsetLeft - firstLeft : children[0].offsetWidth;
        if (!step) return;

        const idx = Math.round((el.scrollLeft - firstLeft) / step);
        setTopCardsIndex(Math.max(0, Math.min(idx, children.length - 1)));
    };

    useEffect(() => {
        const fetchCountries = async () => {
            setCountriesLoading(true);
            try {
                const res: unknown = await getCountries();
                const data = (res as { data?: unknown })?.data ?? res;
                if (Array.isArray(data)) {
                    setCountryOptions(
                        (data as { country_name: string; country_code: string }[]).map((c) => ({
                            label: c.country_name,
                            value: c.country_code,
                        }))
                    );
                } else if (
                    data &&
                    typeof data === "object" &&
                    "data" in data &&
                    Array.isArray((data as { data: unknown }).data)
                ) {
                    setCountryOptions(
                        (
                            data as { data: { country_name: string; country_code: string }[] }
                        ).data.map((c) => ({
                            label: c.country_name,
                            value: c.country_code,
                        }))
                    );
                }
            } catch (e) {
                console.error("Failed to fetch countries", e);
            } finally {
                setCountriesLoading(false);
            }
        };
        fetchCountries();
    }, []);

    useEffect(() => {
        const fetchStates = async () => {
            if (!country) {
                setStateOptions([]);
                return;
            }
            setStatesLoading(true);
            try {
                const res: unknown = await getStates(country.toString());
                const data = (res as { data?: unknown })?.data ?? res;
                if (Array.isArray(data)) {
                    setStateOptions(
                        (data as { state_name: string; state_code: string }[]).map((s) => ({
                            label: s.state_name,
                            value: s.state_code,
                        }))
                    );
                } else if (
                    data &&
                    typeof data === "object" &&
                    "data" in data &&
                    Array.isArray((data as { data: unknown }).data)
                ) {
                    setStateOptions(
                        (data as { data: { state_name: string; state_code: string }[] }).data.map(
                            (s) => ({
                                label: s.state_name,
                                value: s.state_code,
                            })
                        )
                    );
                }
            } catch (e) {
                console.error("Failed to fetch states", e);
            } finally {
                setStatesLoading(false);
            }
        };
        fetchStates();
    }, [country]);

    const handleDonateAmount = (value: string | number) => {
        const v = String(value);
        setDonateAmount(v);
        setIsCustom(v === "custom");
    };

    const amountOptions = [
        { label: "$10", value: "10" },
        { label: "$15", value: "15" },
        { label: "$25", value: "25" },
        { label: "$50", value: "50" },
        { label: "$100", value: "100" },
        { label: "Custom", value: "custom" },
    ];

    const handleDonateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Wire to payment API when available
    };

    return (
        <div className="min-h-screen w-full bg-background-input flex flex-col">
            <section className="w-full flex flex-col items-center justify-center pt-10 md:pt-16">
                <div className={`${PAGE_GUTTER_CLASS} flex flex-col gap-[20px] text-center`}>
                    <h1 className="text-[24px] md:text-[40px] font-medium tracking-tight text-gray-900">
                        Support Our Mission
                    </h1>
                    <p className="text-[14px] md:text-[20px] font-regular md:font-medium text-[#4F4F4F] md:w-[60%] leading-relaxed mx-auto">
                        At Melody Wings, we strive to provide opportunities for differently-abled
                        children to learn, grow, and unlock their potential. Your support helps us
                        sustain this mission and expand our reach to more learners in need.
                        Together, we can make a lasting impact.
                    </p>
                </div>
            </section>

            <section className={`${PAGE_GUTTER_CLASS} pt-10 md:pt-12`}>
                {/* Desktop/tablet */}
                <div className="hidden sm:grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {donateCardData.map((item, index) => (
                        <DonateCard key={index} {...item} />
                    ))}
                </div>

                {/* Mobile carousel */}
                <div className="sm:hidden">
                    <div
                        ref={topCardsCarouselRef}
                        onScroll={handleTopCardsScroll}
                        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 no-scrollbar"
                    >
                        {donateCardData.map((item, index) => (
                            <div
                                key={index}
                                className="flex-[0_0_86%] snap-start"
                                aria-label={item.title}
                            >
                                <DonateCard {...item} />
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-center gap-2 mt-4">
                        {donateCardData.map((_, index) => (
                            <span
                                key={index}
                                className={`h-2 rounded-full transition-all ${
                                    index === topCardsIndex ? "w-2 bg-[#4F4F4F]" : "w-2 bg-[#D9D9D9]"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section className={`${PAGE_GUTTER_CLASS} pt-14 md:pt-20 pb-4`}>
                <div className="flex flex-col items-center gap-[16px] text-center mb-6">
                    <HeartDivider />
                    <h2 className="text-[24px] md:text-[30px] font-medium md:font-semibold text-[#121212]">
                        With Gratitude
                    </h2>
                    <p className="text-[14px] md:text-[16px] text-[#4F4F4F]  mx-auto leading-relaxed">
                        Honoring the generosity of our supporters whose contributions continue to
                        transform lives and build brighter futures.
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-10">
                    {TOP_HIGHLIGHTS.map((row) => (
                        <div
                            key={row.name}
                            className="bg-white rounded-2xl border border-[#FECACA]/80 md:px-5 px-2 md:py-6 py-2 text-center shadow-[0_0_14px_rgba(239,68,68,0.22),0_0_28px_rgba(239,68,68,0.1)]"
                        >
                            <p className="text-[14px] md:text-[30px] font-semibold text-[#EF4444]">
                                {row.amount}
                            </p>
                            <div className="h-px bg-[#FECACA]   md:my-4 my-2" />
                            <p className="md:text-[18px] text-[12px] font-medium text-[#0A0A0A]">
                                {row.name}
                            </p>
                        </div>
                    ))}
                </div>

                <ul className="mt-6 md:mt-8 space-y-3">
                    {LEADERBOARD_ROWS.map((row) => (
                        <li
                            key={row.rank}
                            className="flex items-center gap-3 md:gap-4 bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm"
                        >
                            <span className="text-sm text-gray-400 w-6 tabular-nums">
                                {row.rank}
                            </span>
                            <span className="flex-1 text-[12px] md:text-base text-gray-900 font-medium">
                                {row.name}
                            </span>
                            <span className="text-[12px] md:text-base font-semibold text-primary tabular-nums">
                                {row.amount}
                            </span>
                        </li>
                    ))}
                </ul>

                <p className="text-center text-[12px] text-[#4F4F4F] italic mt-8 mx-auto">
                    Every contribution, regardless of size, makes a meaningful difference in the
                    lives we touch.
                </p>
            </section>

            <main className="w-full flex-1 flex justify-center py-8 md:py-12 lg:py-16">
                <div className="w-full md:w-[70%] md:px-0 md:mx-auto">
                    <form
                        onSubmit={handleDonateSubmit}
                        className="bg-white md:rounded-[24px] md:shadow-sm px-5 sm:px-6 md:px-10 lg:px-12 py-6 md:py-8 lg:py-10 space-y-0 md:space-y-10 w-full min-w-0"
                    >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <h2 className="text-[20px] md:text-[24px] font-medium text-gray-900">
                                Make a Difference Today
                            </h2>
                            <div className="flex flex-wrap gap-2 md:gap-3 text-xs md:text-[14px] text-[#4F4F4F]">
                                <span className="inline-flex items-center gap-1.5 md:px-3 py-1">
                                    <SecureDonation className="size-4 shrink-0" aria-hidden />
                                    Secure donation
                                </span>
                                <span className="inline-flex items-center gap-1.5 md:px-3 py-1">
                                    <TaxDeductive className="size-4 shrink-0" aria-hidden />
                                    Tax deductible
                                </span>
                                <span className="inline-flex items-center gap-1.5 md:px-3 py-1">
                                    <NonProfit className="size-4 shrink-0" aria-hidden />
                                    501(c)(3) nonprofit
                                </span>
                            </div>
                        </div>

                        <div className={sectionBox}>
                            <p className="text-base font-normal text-[#121212]">Select amount</p>
                            <div className="flex flex-wrap items-center gap-2 w-full min-w-0">
                                {amountOptions
                                    .filter((o) => o.value !== "custom")
                                    .map((opt) => {
                                        const selected = donateAmount === String(opt.value);
                                        return (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => handleDonateAmount(opt.value)}
                                                className={cn(
                                                    "shrink-0 rounded-xl border px-4 py-2 text-sm font-medium transition-colors min-h-[48px]",
                                                    selected
                                                        ? "bg-[#121212] text-white border-[#121212]"
                                                        : "bg-white text-[#121212] border-gray-200 hover:border-gray-300"
                                                )}
                                            >
                                                {opt.label}
                                            </button>
                                        );
                                    })}
                                <button
                                    type="button"
                                    onClick={() => handleDonateAmount("custom")}
                                    className={cn(
                                        "shrink-0 rounded-xl border px-4 py-2 text-[14px] font-medium transition-colors min-h-[48px]",
                                        isCustom
                                            ? "bg-[#121212] text-white border-[#121212]"
                                            : "bg-white text-[#121212] border-gray-200 hover:border-gray-300"
                                    )}
                                >
                                    Custom
                                </button>
                                {isCustom && (
                                    <AntInput
                                        value={customAmount}
                                        onChange={(e) =>
                                            setCustomAmount(e.target.value.replace(/[^\d.]/g, ""))
                                        }
                                        placeholder="Enter Amount here"
                                        suffix={<span className="text-gray-400">$</span>}
                                        className={cn(
                                            "!rounded-xl !bg-background-input min-w-[160px] !h-[48px] w-[min(100%,280px)] flex-1",
                                            "[&_.ant-input]:!bg-background-input"
                                        )}
                                    />
                                )}
                            </div>
                        </div>

                        <div className={sectionBox}>
                            <h3 className="text-[20px] font-medium text-[#121212]">
                                Personal details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <Input
                                    labelClassName={DONATE_LABEL_CLASS}
                                    inputType="text"
                                    name="first_name"
                                    label="First Name"
                                    required
                                    value={firstName}
                                    onChange={(v) => setFirstName(typeof v === "string" ? v : "")}
                                    placeholder="Eg. John"
                                    rootClassName="w-full"
                                    inputClassName="w-full rounded-xl border-gray-200"
                                />
                                <Input
                                    labelClassName={DONATE_LABEL_CLASS}
                                    inputType="text"
                                    name="last_name"
                                    label="Last Name"
                                    required
                                    value={lastName}
                                    onChange={(v) => setLastName(typeof v === "string" ? v : "")}
                                    placeholder="Eg. Doe"
                                    rootClassName="w-full"
                                    inputClassName="w-full rounded-xl border-gray-200"
                                />
                                <Input
                                    labelClassName={DONATE_LABEL_CLASS}
                                    inputType="text"
                                    name="email"
                                    label="Email Address"
                                    required
                                    value={email}
                                    onChange={(v) => setEmail(typeof v === "string" ? v : "")}
                                    placeholder="Enter email address"
                                    rootClassName="w-full"
                                    inputClassName="w-full rounded-xl border-gray-200"
                                />
                                <div className="flex flex-col gap-2 w-full min-w-0">
                                    <label className="text-base font-normal text-[#121212]">
                                        Phone Number
                                    </label>
                                    <div className="flex gap-2 w-full min-w-0">
                                        <Input
                                            labelClassName={DONATE_LABEL_CLASS}
                                            inputType="select"
                                            name="phone_country_code"
                                            value={phoneCountryCode}
                                            onChange={(v) => setPhoneCountryCode(v ?? "+1")}
                                            options={COUNTRY_CODE_OPTIONS}
                                            rootClassName="!w-20 md:!w-24 !mb-0 shrink-0"
                                            inputClassName="w-full rounded-xl border-gray-200"
                                        />
                                        <Input
                                            labelClassName={DONATE_LABEL_CLASS}
                                            inputType="text"
                                            name="phone_number"
                                            value={phoneNumber}
                                            onChange={(v) =>
                                                setPhoneNumber(
                                                    (typeof v === "string" ? v : "").replace(
                                                        /\D/g,
                                                        ""
                                                    )
                                                )
                                            }
                                            placeholder="Enter phone number"
                                            rootClassName="w-full flex-1 min-w-0 !mb-0"
                                            inputClassName="w-full rounded-xl border-gray-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={sectionBox}>
                            <h3 className="text-[20px] font-medium text-[#121212]">
                                Billing address
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <Input
                                    labelClassName={DONATE_LABEL_CLASS}
                                    inputType="text"
                                    name="address1"
                                    label="Address Line 1"
                                    value={address1}
                                    onChange={(v) => setAddress1(typeof v === "string" ? v : "")}
                                    placeholder="Street address"
                                    rootClassName="w-full md:col-span-2"
                                    inputClassName="w-full rounded-xl border-gray-200"
                                />
                                <Input
                                    labelClassName={DONATE_LABEL_CLASS}
                                    inputType="text"
                                    name="address2"
                                    label="Address Line 2"
                                    value={address2}
                                    onChange={(v) => setAddress2(typeof v === "string" ? v : "")}
                                    placeholder="Apt, suite (optional)"
                                    rootClassName="w-full md:col-span-2"
                                    inputClassName="w-full rounded-xl border-gray-200"
                                />
                                <Input
                                    labelClassName={DONATE_LABEL_CLASS}
                                    inputType="text"
                                    name="city"
                                    label="City"
                                    value={city}
                                    onChange={(v) => setCity(typeof v === "string" ? v : "")}
                                    placeholder="Enter city"
                                    rootClassName="w-full"
                                    inputClassName="w-full rounded-xl border-gray-200"
                                />
                                <Input
                                    labelClassName={DONATE_LABEL_CLASS}
                                    inputType="select"
                                    name="country"
                                    label="Country"
                                    required
                                    showSearch
                                    disabled={countriesLoading}
                                    isLoading={countriesLoading}
                                    value={country}
                                    onChange={(v) => {
                                        setCountry(v ?? "");
                                        setState("");
                                    }}
                                    placeholder={countriesLoading ? "Loading..." : "Select country"}
                                    options={countryOptions}
                                    rootClassName="w-full"
                                    inputClassName="w-full rounded-xl border-gray-200"
                                />
                                <Input
                                    labelClassName={DONATE_LABEL_CLASS}
                                    inputType="select"
                                    name="state"
                                    label="State / Region"
                                    showSearch
                                    disabled={!country || statesLoading}
                                    isLoading={statesLoading}
                                    value={state}
                                    onChange={(v) => setState(v ?? "")}
                                    placeholder={statesLoading ? "Loading..." : "Select state"}
                                    options={stateOptions}
                                    rootClassName="w-full"
                                    inputClassName="w-full rounded-xl border-gray-200"
                                />
                                <Input
                                    labelClassName={DONATE_LABEL_CLASS}
                                    inputType="text"
                                    name="zip"
                                    label="ZIP / Postal Code"
                                    required
                                    value={zip}
                                    onChange={(v) => setZip(typeof v === "string" ? v : "")}
                                    placeholder="Enter ZIP or postal code"
                                    rootClassName="w-full"
                                    inputClassName="w-full rounded-xl border-gray-200"
                                />
                            </div>
                        </div>

                        <div className={sectionBox}>
                            <h3 className="text-[20px] font-medium text-[#121212]">
                                Donation preferences
                            </h3>
                            <div className="space-y-2">
                                <p className="text-base font-normal text-[#121212]">
                                    How should we show your name?
                                </p>
                                <RadioInput
                                    inputType="radio"
                                    name="name_visibility"
                                    value={nameVisibility}
                                    layout="horizontal"
                                    optionLabelClassName="!text-base !font-normal !text-[#121212]"
                                    optionSublabelClassName="!text-[12px] !font-normal !text-[#121212]"
                                    onChange={(value) =>
                                        setNameVisibility(
                                            value as "" | "full" | "first_only" | "anonymous"
                                        )
                                    }
                                    options={[
                                        {
                                            value: "full",
                                            label: "Show full name",
                                            sublabel: "Your name will be visible to the public.",
                                        },
                                        {
                                            value: "first_only",
                                            label: "Show first name only",
                                            sublabel: "Only your first name will be shown.",
                                        },
                                        {
                                            value: "anonymous",
                                            label: "Donate anonymously",
                                            sublabel: "Your donation will remain private.",
                                        },
                                    ]}
                                    radioButtonClassName="!bg-background-input rounded-xl border border-gray-200 md:w-[266px] w-full py-2.5 px-3 shadow-sm"
                                />
                            </div>

                            <div className={DONATE_CHECKBOX_ROW_CLASS}>
                                <Input
                                    labelClassName={DONATE_LABEL_CLASS}
                                    inputType="checkbox"
                                    name="donor_wall"
                                    value={donorWall}
                                    onChange={(checked) => setDonorWall(Boolean(checked))}
                                    placeholder="Show my name on the donor wall"
                                    rootClassName="!mb-0 w-full"
                                    inputClassName="!text-base !font-normal !text-[#121212] !w-full"
                                />
                            </div>

                            <Input
                                labelClassName={DONATE_LABEL_CLASS}
                                inputType="select"
                                name="dedication"
                                label="Dedication (optional)"
                                value={dedication}
                                onChange={(v) => setDedication(v ?? "none")}
                                options={DEDICATION_OPTIONS}
                                rootClassName="w-full"
                                inputClassName="w-full rounded-xl border-gray-200"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <Input
                                    labelClassName={DONATE_LABEL_CLASS}
                                    inputType="select"
                                    name="fund"
                                    label="Campaign / fund designation"
                                    value={fundDesignation}
                                    onChange={(v) => setFundDesignation(v ?? "general")}
                                    options={FUND_OPTIONS}
                                    rootClassName="w-full"
                                    inputClassName="w-full rounded-xl border-gray-200"
                                />
                                <Input
                                    labelClassName={DONATE_LABEL_CLASS}
                                    inputType="text"
                                    name="fund_other"
                                    label="Details (if Other)"
                                    value={fundOtherDetail}
                                    onChange={(v) =>
                                        setFundOtherDetail(typeof v === "string" ? v : "")
                                    }
                                    placeholder="Enter here"
                                    rootClassName="w-full"
                                    inputClassName="w-full rounded-xl border-gray-200"
                                />
                            </div>

                            <div className={`${DONATE_CHECKBOX_ROW_CLASS} space-y-1`}>
                                <Input
                                    labelClassName={DONATE_LABEL_CLASS}
                                    inputType="checkbox"
                                    name="cover_fees"
                                    value={coverFees}
                                    onChange={(checked) => setCoverFees(Boolean(checked))}
                                    placeholder="Cover processing fees"
                                    rootClassName="!mb-0 w-full"
                                    inputClassName="!text-base !font-normal !text-[#121212] !w-full"
                                />
                                <p className="text-[12px] text-[#121212] pl-6 -mt-1">
                                    100% of your donation will go directly to Melody Wings when you
                                    cover fees.
                                </p>
                            </div>

                            <Input
                                labelClassName={DONATE_LABEL_CLASS}
                                inputType="textarea"
                                name="message"
                                label="Leave a message (optional)"
                                value={message}
                                onChange={(v) => setMessage(typeof v === "string" ? v : "")}
                                placeholder="Share why you are supporting Melody Wings."
                                rows={4}
                                rootClassName="w-full"
                                inputClassName="w-full rounded-xl border-gray-200 !bg-background-input"
                            />

                            <Input
                                labelClassName={DONATE_LABEL_CLASS}
                                inputType="select"
                                name="hear_about"
                                label="How did you hear about us? (optional)"
                                value={hearAbout}
                                onChange={(v) => setHearAbout(v ?? "")}
                                placeholder="Select an option"
                                options={HEAR_ABOUT_OPTIONS}
                                rootClassName="w-full"
                                inputClassName="w-full rounded-xl border-gray-200"
                            />
                        </div>

                        <Button
                            htmlType="submit"
                            title="Donate Now"
                            btnVariant="secondary"
                            customClassName="!w-full !rounded-[10px] !py-3 !h-12 !text-base !font-medium !text-white !bg-black hover:!bg-black"
                        />
                    </form>
                </div>
            </main>

            <section className={`${PAGE_GUTTER_CLASS} pb-16 md:pb-24`}>
                <h2 className="text-[20px] md:text-[32px] font-medium text-gray-900 text-left mb-6 md:mb-8">
                    Frequently Asked Questions
                </h2>
                <div className="w-full divide-y divide-gray-200">
                    {FAQ_ITEMS.map((item, index) => (
                        <Accordian key={item.key} items={item} defaultExpanded={index === 0} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Donate;
