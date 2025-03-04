"use client";

import Link from "next/link";
import { FaLinkedin, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { IconType } from "react-icons";
import Logo from "@/components/common/Logo";
import { FaSquareXTwitter } from "react-icons/fa6";

type Props = {};

type PolicyLink = {
    href: string;
    label: string;
    target?: string;
};

type SocialLink = {
    href: string;
    icon: IconType;
    label: string;
};

const policyLinks: PolicyLink[] = [
    { href: "/privacy-policy", target: "_blank", label: "Privacy Policy" },
    { href: "/terms-and-conditions", target: "_blank", label: "Terms & Conditions" },
    { href: "mailto:support@melodywings.org", target: "_blank", label: "Contact Us" }
];

const socialLinks: SocialLink[] = [
    { href: "https://linkedin.com", icon: FaLinkedin, label: "LinkedIn" },
    { href: "https://x.com", icon: FaSquareXTwitter, label: "X" },
    { href: "https://instagram.com", icon: FaInstagram, label: "Instagram" },
    { href: "https://whatsapp.com", icon: FaWhatsapp, label: "WhatsApp" },
];

const Footer = (props: Props) => {
    const renderSocialLinks = () => (
        <div className="flex items-center gap-6">
            {socialLinks.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    className="hover:text-gray-600 transition-all duration-300"
                    aria-label={link.label}
                >
                    <link.icon size={22} />
                </Link>
            ))}
        </div>
    );

    return (
        <footer className="w-full bg-white lg:min-h-[40vh] px-[9%] flex items-center justify-center">
            <div className="max-w-[1400px] w-full mx-auto py-6">
                <div className="flex w-full flex-col lg:flex-row justify-between items-center lg:items-start gap-4 py-8 lg:py-0">
                    {/* Left side - Policy and Terms links */}
                    <div className="flex flex-col lg:flex-row items-center mb-5 lg:mb-0 gap-6">
                        {policyLinks.map((link) => (
                            <Link
                                key={link?.href}
                                href={link?.href}
                                target={link?.target}
                                className="text-sm text-gray-600 underline hover:text-gray-900 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex-center flex-col gap-6">
                        <Logo className="flex !flex-col" />
                        <div className="lg:hidden">{renderSocialLinks()}</div>
                        {/* Center - Terms of Use and Privacy Policy text */}
                        <p className="text-gray-500 text-center text-sm">
                            Be sure to take a look at our Terms of Use
                            <br />
                            and Privacy Policy
                        </p>
                    </div>

                    {/* Social media icons */}
                    <div className="hidden lg:block">{renderSocialLinks()}</div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
