import React, { useState } from "react";
import { IoMdCopy } from "react-icons/io";
import { TiTickOutline } from "react-icons/ti";

const ContactDetails = ({ tags = [] }: any) => {

    const renderElement = (tag: any) => {
        const [isTextCopied, setIsTextCopied] = useState(false);

        const copyContact = async (text: string) => {
            await navigator.clipboard.writeText(text)
            setIsTextCopied(true)
            setTimeout(() => setIsTextCopied(false), 2000)
        }
        return <div>
            <p className="text-sm flex gap-1 items-center">{tag?.icon} {tag?.title}</p>
            <p className="font-medium flex items-center gap-1">
                {tag?.value}
                {isTextCopied ? <TiTickOutline size={23} /> : <IoMdCopy onClick={() => copyContact(tag?.value)} className="!text-red-500 cursor-pointer" size={23} />}
            </p>
        </div>
    }

    return (
        <div className="px-5 flex flex-col gap-3">
            <p className="font-medium ">Contact Information</p>
            <div className="flex gap-1 flex-wrap justify-between px-2">
                {tags?.map((tag: any) => 
                    renderElement(tag)
                )}
            </div>
        </div>
    );
};

export default ContactDetails;
