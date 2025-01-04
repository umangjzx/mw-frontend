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
    target: string;
};

type SocialLink = {
    href: string;
    icon: IconType;
    label: string;
};

const policyLinks: PolicyLink[] = [
    { href: "https://glib-chiller-6dc.notion.site/Privacy-Policy-1702f1842d7a80f1b2ecc65ec0ef459e", target: "_black", label: "Policy" },
    { href: "https://glib-chiller-6dc.notion.site/Terms-Conditions-1702f1842d7a80dea739d037e7b7133e", target: "_black", label: "Terms" },
    { href: "/careers", target: "_black", label: "Careers" },
];

const socialLinks: SocialLink[] = [
    { href: "https://linkedin.com", icon: FaLinkedin, label: "LinkedIn" },
    { href: "https://x.com", icon: FaSquareXTwitter, label: "X" },
    { href: "https://instagram.com", icon: FaInstagram, label: "Instagram" },
    { href: "https://whatsapp.com", icon: FaWhatsapp, label: "WhatsApp" },
];

const Footer = (props: Props) => {
    return (
        <footer className="w-full bg-white min-h-[40dvh] px-[9%] flex items-center justify-center ">
            <div className="max-w-[1400px] w-full  mx-auto py-6">
                <div className="flex w-full flex-col md:flex-row justify-between items-start gap-4">
                    {/* Left side - Policy and Terms links */}
                    <div className="flex items-center gap-6">
                        {policyLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                target={link.target}
                                className="text-gray-600 underline hover:text-gray-900 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex flex-col items-center gap-6">
                        <Logo className="flex !flex-col" />
                        {/* Center - Terms of Use and Privacy Policy text */}
                        <p className="text-gray-500 text-center text-sm">
                            Be sure to take a look at our Terms of Use
                            <br />
                            and Privacy Policy
                        </p>
                    </div>

                    {/* Right side - Social media icons */}
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
                </div>
            </div>
        </footer>
    );
};

export default Footer;
