import { endpoints } from "@/api/constants";
import { GET_API } from "@/api/request";
import Button from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import CenterModal from "@/components/common/Modals/CenterModal";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

type MessageModalProps = {
    learnerId?: string | null;
    volunteerId?: string | null;
    isOpen: boolean;
    onClose: () => void;
};

type MessageProps = {
    message: string,
    date: string,
    time: string,
    type: string,
}

const initialMessages: MessageProps[] = [
    {
        message: "Hi Walter!",
        date: "20th Dec",
        time: "1:50 PM",
        type: "receive",
    },
    {
        message: "Hi Jesse Pinkman!",
        date: "20th Dec",
        time: "1:54 PM",
        type: "sent",
    },
    {
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        date: "20th Dec",
        time: "1:55 PM",
        type: "receive",
    },
    {
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.",
        date: "20th Dec",
        time: "1:58 PM",
        type: "sent",
    },
    {
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.",
        date: "20th Dec",
        time: "1:58 PM",
        type: "sent",
    },
    {
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        date: "20th Dec",
        time: "2:25 PM",
        type: "receive",
    },
]

const MessageModal = ({ learnerId, volunteerId, isOpen, onClose }: MessageModalProps) => {
    const [messages, setMessages] = useState<MessageProps[]>(initialMessages);
    const [message, setMessage] = useState<string>("");

    const userRole = learnerId ? "learner" : "volunteer";

    const getUserData = async() => {
        const endpoint = learnerId ? endpoints.learner.getIndividualLearner(learnerId || "") : endpoints.volunteer.getIndividualVolunteer(volunteerId || "")
        const { data } = await GET_API(endpoint);
        const profileData = learnerId ? {
            profile_picture: data?.profile_picture?.image_url,
            fullName: `${data?.learner_personal_info?.learner_first_name} ${data?.learner_personal_info?.learner_last_name}`
        } : {
            profile_picture: data?.profile_picture?.image_url,
            fullName: `${data?.volunteer_first_name} ${data?.volunteer_last_name}`
        }
        return profileData;
    }

    const { data: userData } = useQuery({
        queryKey: [userRole],
        queryFn: () => getUserData()
    })

    const handleSubmit = () => {
        if (!message) return;
        setMessages(prev => [...prev, { message: message, date: "30th Dec", time: "4:00", type: "sent" }])
        console.log("Proceed: ", message);
        setMessage('');
    };

    const handleClose = () => {
        setMessage('');
        setMessages(initialMessages);
        onClose()
    };

    const headerComponent = <>
        <div className="flex gap-2 w-full border-b border-stroke items-center mb-4 pb-4">
            <img src={userData?.profile_picture} alt="" className="h-[50px] w-[50px] object-cover border rounded-full" />
            <div>
                <h5 className="font-medium !text-xl">{userData?.fullName}</h5>
                <p className="!text-sm">From New Mexico</p>
            </div>
        </div>
    </>

    const footerComponent = <>
        <div className="flex gap-2 w-full border-t border-stroke items-center mt-4 pt-4">
            <Input name="message" className="!mb-0" inputType="text" placeholder="Type message here" onChange={(e) => setMessage(e.toString())} value={message || ""} />
            <Button
                onClick={handleSubmit}
                btnVariant="secondary"
                title="Send Message"
                customClassName="!rounded-xl hover:!bg-black text-sm hover:!text-white"
            />
        </div>
    </>

    return (
        <CenterModal
            title={"Send a Message"}
            isOpen={isOpen}
            onClose={handleClose}
            width='40%'
            customClassName='!max-h-[95vh] !w-[1080px] !max-w-[90%] !rounded-2xl overflow-hidden'
            headerComponent={headerComponent}
            footerComponent={footerComponent}
            secondaryActionProps={{
                onClick: handleSubmit,
                title: "Send Email",
                customClassName: "!rounded-xl hover:!bg-black text-sm hover:!text-white",
            }}
            primaryActionProps={{
                onClick: onClose,
                title: "Cancel",
                btnVariant: "secondary",
                customClassName: "!bg-transparent !text-black text-sm !rounded-xl",
            }}
        >
            <div className="flex flex-col gap-3">
                {messages.map((message: MessageProps, index: number) => (
                    <div key={index} className={`!max-w-[80%] !min-w-[40%] rounded-xl text-base !bg-background-input p-3 ${message?.type === 'sent' ? 'ml-auto' : 'mr-auto'}`}>
                        <p className="!text-black mb-3">{message?.message}</p>
                        <div className={`${message?.type === 'sent' && 'flex flex-end'}`}>
                            <p className="flex items-center gap-1 text-sm text-gray-light ml-auto">
                                {message?.time} <span className="text-xl text- !font-black">•</span> {message?.date}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

        </CenterModal>
    );
};

export default MessageModal;
