import { LogoIcon } from "@/assets/icons";
import { cn } from "@/utils/merge-class";

type LogoProps = {
    className?: string;
};

const Logo = ({ className }: LogoProps) => {
    return (
        <div className={cn("flex items-center gap-2  rounded-lg", className)}>
            <span className="max-md:hidden">
                <LogoIcon />
            </span>
            <span className="md:hidden">
                <LogoIcon width={35} height={24} />
            </span>
            <h3 className="md:text-xl text-base font-medium">Melody Wings</h3>
        </div>
    );
};

export default Logo;
