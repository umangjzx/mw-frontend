import LoginPage from "@/components/auth/Login";
import WhyWeBuild from "@/components/landingpage/WhyWeBuild";
import Impact from "@/components/landingpage/Impact";
import ForVolunteer from "@/components/landingpage/ForVolunteer";
import ForLearner from "@/components/landingpage/ForLearner";
import Celebrate from "@/components/landingpage/Celebrate";
import Community from "@/components/landingpage/Community";
export default function Page() {
    return (
        <div className="w-screen  bg-background-input px-[9%]">
            {/* <LoginPage /> */}
            <div className="flex flex-col gap-[7rem] py-[7rem]">
                <WhyWeBuild />
                <Impact />
                <ForLearner />
                <ForVolunteer />
                <Community />
                <Celebrate />
            </div>
        </div>
    );
}
