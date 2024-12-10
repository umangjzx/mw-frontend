"use client";

import Link from "next/link";
import { FaLinkedin, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { IconType } from "react-icons";
import Logo from "@/components/common/Logo";

type Props = {};

type PolicyLink = {
    href: string;
    label: string;
};

type SocialLink = {
    href: string;
    icon: IconType;
    label: string;
};

const policyLinks: PolicyLink[] = [
    { href: "/policy", label: "Policy" },
    { href: "/terms", label: "Terms" },
];

const socialLinks: SocialLink[] = [
    { href: "https://linkedin.com", icon: FaLinkedin, label: "LinkedIn" },
    { href: "https://instagram.com", icon: FaInstagram, label: "Instagram" },
    { href: "https://whatsapp.com", icon: FaWhatsapp, label: "WhatsApp" },
];

const Footer = (props: Props) => {
    return (
        <footer className='w-full border-t min-h-[40dvh] flex items-center justify-center border-gray-200'>
            <div className='max-w-7xl w-full mx-auto px-8 py-6'>
                <div className='flex w-full flex-col md:flex-row justify-between items-center gap-4'>
                    {/* Left side - Policy and Terms links */}
                    <div className='flex items-center gap-6'>
                        {policyLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className='text-gray-600 hover:text-gray-900 transition-colors'
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className='flex flex-col items-center gap-6'>
                        <Logo className="flex !flex-col"/>
                        {/* Center - Terms of Use and Privacy Policy text */}
                        <p className='text-gray-500 text-center text-sm'>
                            Be sure to take a look at our Terms of Use
                            <br />
                            and Privacy Policy
                        </p>
                    </div>

                    {/* Right side - Social media icons */}
                    <div className='flex items-center gap-6'>
                        {socialLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                target='_blank'
                                className='text-gray-600 hover:text-gray-900 transition-colors'
                                aria-label={link.label}
                            >
                                <link.icon size={20} />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
