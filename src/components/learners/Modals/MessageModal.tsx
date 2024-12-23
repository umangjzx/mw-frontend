import { endpoints } from "@/api/constants";
import { GET_API, POST_API } from "@/api/request";
import Button from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import CenterModal from "@/components/common/Modals/CenterModal";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Cookies from "js-cookie";
import { formatDateSuffix, formatTime } from "@/utils/calender";

type MessageModalProps = {
    receiverId?: string | null;
    isOpen: boolean;
    onClose: () => void;
};

type MessageProps = {
    message?: string,
    created_at?: any,
    created_by?: string,
    learner_id?: string,
    volunteer_id?: string,
    message_id?: string,
}

const MessageModal = ({ receiverId, isOpen, onClose }: MessageModalProps) => {
    if (!receiverId) return;
    const [messages, setMessages] = useState<MessageProps[]>([]);
    const [message, setMessage] = useState<string>("");

    const userRole = Cookies.get("role");
    const senderId = userRole === "learner" ? Cookies.get("learner_id") : Cookies.get("volunteer_id");

    console.log("Role: ", userRole);
    console.log("Message Modal: Sender Id - ", senderId);
    console.log("Message Modal: Receiver Id - ", receiverId);

    // Role Based endpoints
    const endpoint = userRole === "learner" ? {
        sendMessage: endpoints.learner_chat.sendMessage(receiverId),
        getMessages: endpoints.learner_chat.getMessages(receiverId || ""),
        getReceiverData: endpoints.volunteer.getIndividualVolunteer(receiverId)
    } : {
        sendMessage: endpoints.volunteer_chat.sendMessage(receiverId),
        getMessages: endpoints.volunteer_chat.getMessages(receiverId || ""),
        getReceiverData: endpoints.learner.getIndividualLearner(receiverId)
    }

    const getUserData = async () => {
        const { data } = await GET_API(endpoint.getReceiverData);

        const profileData = userRole === "volunteer" ? {
            profile_picture: data?.profile_picture?.image_url,
            fullName: `${data?.learner_personal_info?.learner_first_name} ${data?.learner_personal_info?.learner_last_name}`
        } : {
            profile_picture: data?.profile_picture?.image_url,
            fullName: `${data?.volunteer_first_name} ${data?.volunteer_last_name}`
        }
        return profileData;
    }
    const { data: userData } = useQuery({ queryKey: [userRole, "profile_data"], queryFn: getUserData })

    
    const getUserMessages = async() => {
        const { data } = await GET_API(endpoint.getMessages);
        console.log("Messages: ", data);
        
        setMessages(data?.items)
        return data;
    }
    const { data: userMessages } = useQuery({  queryKey: [userRole, "messages"], queryFn: getUserMessages })

    const handleSubmit = async () => {
        if (!message) return;
        setMessages(prev => [...prev, { message: message, created_at: new Date(), created_by: userRole, learner_id: senderId, volunteer_id: senderId }])
        setMessage('');
        const response = await POST_API(endpoint.sendMessage, { message });
        console.log("Message Send: ", response);
    };

    const handleClose = () => {
        setMessage('');
        setMessages([]);
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
                disabled={!message}
                btnVariant="secondary"
                title="Send Message"
                customClassName="!rounded-xl !text-white !bg-black hover:!bg-black text-sm hover:!text-white"
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
            <div className="flex flex-col gap-3 min-h-[40vh]">
                { messages.length === 0 &&
                    <div className="flex-center !h-[40vh] !w-full">No Message Found</div>
                }
                { Array.isArray(messages) &&
                 messages.map((message: MessageProps, index: number) => (
                    <div key={index} className={`!max-w-[80%] !min-w-[40%] rounded-xl text-base !bg-background-input p-3 ${message?.created_by === userRole ? 'ml-auto' : 'mr-auto'}`}>
                        <p className="!text-black mb-3">{message?.message}</p>
                        <div className={`${message?.created_by === userRole && 'flex flex-end'}`}>
                            <p className="flex items-center gap-1 text-sm text-gray-light ml-auto">
                                {formatTime(message?.created_at)} <span className="text-xl text- !font-black">•</span> {formatDateSuffix(message?.created_at)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

        </CenterModal>
    );
};

export default MessageModal;
