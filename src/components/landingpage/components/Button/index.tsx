import { Button } from "antd";

type ButtonProps = {
    title: string;
    className?: string;
    onClick?: () => void;
    type?: "learner" | "volunteer";
};

const LandingPageButton = ({ title, type }: ButtonProps) => {
    const typeClass =
        type === "learner"
            ? "!bg-[#68DBFF] hover:!bg-[#68DBFF] border-0 border-r-2 border-b-2 border-[#009BCC] hover:!border-[#009BCC] text-sm !text-black rounded-[10px] shadow-sm  "
            : "!bg-[#FFAC71] hover:!bg-[#FFAC71] border-0 border-r-2 border-b-2 border-[#CC5600] hover:!border-[#CC5600] text-sm !text-black rounded-[10px] shadow-sm  ";
    return (
        <div>
            <Button
                size="small"
                className={`${typeClass} !text-sm !text-black font-medium !py-4 px-3`}
            >
                {title}
            </Button>
        </div>
    );
};

export default LandingPageButton;
