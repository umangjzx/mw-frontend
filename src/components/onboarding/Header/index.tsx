"use client";

import Logo from "@/components/common/Logo";
import Link from "next/link";

type Props = {
    className?: string;
};

const Header = (props: Props) => {
    return (
        <header className={`w-full z-50 border-b bg-white sticky top-0 border-gray-200 ${props.className}`}>
            <div className='w-full p-8'>
                <Link href='/login' className='flex items-center gap-2'>
                    <Logo />
                </Link>
            </div>
        </header>
    );
};

export default Header;
