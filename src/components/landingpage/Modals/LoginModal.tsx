import ModalCloseIcon from "@/assets/icons/ModalCloseIcon"
import Button from "@/components/common/Button"
import { Modal } from "antd"
import { FcGoogle } from "react-icons/fc"
import LandingPageButton from "../components/Button"
import { useQueryState } from "nuqs"
import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react"
import { apiGoogleLogin } from "@/api/auth"
import { useRouter } from "next/navigation"
import { getCookie } from "@/utils/auth"
import { showToast } from "@/components/common/Toast"

export const LoginModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const router = useRouter();
    const [_, setParamMode] = useQueryState("signup_as");
    const [isLoginLoading, setIsLoginLoading] = useState(false);

    const handleTriggerSignUp = (role: UserType) => {
        setParamMode(role);
        onClose();
    }

    const SIGN_IN = async (access_token: any) => {
        setIsLoginLoading(true);
        await apiGoogleLogin(access_token)
            .then((response: any) => {
                const { onboarded_status } = response;
                const role = getCookie("role");
                const routes: Record<string, string> = {
                    verification_pending: "/onboarding/verification",
                    details_pending: "/onboarding",
                    verification_completed: `/${role}/schedule`,
                };
            
                if (routes[onboarded_status]) router.replace(routes[onboarded_status]);
                router.refresh();
            })
            .catch(err => {
                console.log("Login Error", err);
                setIsLoginLoading(false)
                if (err?.status === 404) return showToast({ type: "error", message: "User not found, please signup." });
            })
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (response) => SIGN_IN(response?.access_token),
    });

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            className='!w-auto max-w-[90%] absolute right-10 top-20'
            classNames={{ content: '!rounded-3xl !p-5' }}
            closable={false}
            footer={false}
        >
            <div className='w-full md:w-[430px]'>
                <div className='flex justify-between items-center'>
                    <span className='text-xl font-medium'>Existing User?</span>
                    <ModalCloseIcon onClick={onClose} width={35} height={35} className='cursor-pointer rounded-full hover:shadow-lg' />
                </div>
                <div className='mt-3 flex flex-col gap-5 divide-y'>
                    <Button
                        title='Sign In With Google'
                        className='!bg-black w-full !px-3 !py-2 text-white hover:!bg-black hover:!text-white text-sm !rounded-xl'
                        icon={<FcGoogle className='text-xl' />}
                        loading={isLoginLoading}
                        onClick={handleGoogleLogin}
                    />
                    <div className="pt-4">
                        <span className='text-xl font-medium'>New User?</span>
                        <div className="flex flex-col md:flex-row gap-3 mt-3">
                            <LandingPageButton
                                // loading={buttonLoading === "learner"}
                                onClick={() => handleTriggerSignUp("learner")}
                                title="Enroll as Learner"
                                type="learner"
                                buttonClassName="!w-full"
                                rootClassName="!w-full !text-start"
                            />
                            <LandingPageButton
                                // loading={buttonLoading === "volunteer"}
                                onClick={() => handleTriggerSignUp("volunteer")}
                                title="Become a Volunteer"
                                type="volunteer"
                                buttonClassName="!w-full"
                                rootClassName="!w-full !text-start"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )

}
