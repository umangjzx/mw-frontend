import { Input } from "../Input";
import { useQueryState } from "nuqs";
import Button from "@/components/common/Button";
import { cn, formatString } from "@/utils/merge-class";
import { useComponentStore } from "@/store/useComponenetStore";
import InnerWidth from "@/utils/innerWidth";
import { SideMenuIcon } from "@/assets/icons";
import SideModal from "@/components/common/Modals/MobileSideModal";
import Sidebar from "@/components/common/Sidebar";
import { useEffect, useState } from "react";

const CommonHeader: React.FC = () => {
    const { headerOptions } = useComponentStore();
    const [searchQuery, setSearchQuery] = useQueryState("query");
    const {
        searchPlaceholder,
        actionButtonOnClick,
        actionButtonClassName,
        actionButtonIcon,
        actionButtonPlacement,
        actionButtonTitle,
        showButton,
        leftButton,
        titleIcon,
        title,
        titleIconClick,
        actionButtons,
        hideSearch
    } = headerOptions || {};

    const isMobileScreen = InnerWidth() < 768;
    const [isSideNavBarOpen, setIsSideNavBarOpen] = useState<boolean>(false);

    
    useEffect(() => {
        setIsSideNavBarOpen(false);
    }, [])

    const handleSearch = (value: string) => {
        setSearchQuery(value === "" ? "" : value);
    };

    return (
        <div className="w-full h-full">
            <div className="w-full h-full p-2 px-3 flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <div className="flex capitalize items-center">
                        <div className="md:hidden cursor-pointer mr-2" onClick={() => setIsSideNavBarOpen(true)}>
                            <SideMenuIcon height="22px" width="22px" />
                        </div>
                        <Button
                            icon={isMobileScreen ? "" : titleIcon}
                            rootClassName={cn(
                                "flex items-center justify-center lg:!w-10 lg:h-10 rounded-full hover:bg-gray-100 max-md:!p-0",
                                titleIconClick ? "cursor-pointer lg:border-stroke lg:mr-2" : "!border-none"
                            )}
                            onClick={titleIconClick}
                        />
                        <h1 className="text-lg font-medium">{formatString(title ?? "")}</h1>
                    </div>
                    {!isMobileScreen && leftButton?.showButton && (
                        <Button
                            title={leftButton?.buttonTitle}
                            onClick={leftButton?.buttonOnClick}
                            rootClassName={leftButton?.buttonClassName}
                            size="small"
                            icon={leftButton?.buttonIcon}
                        />
                    )}
                </div>
                <div
                    className={cn(
                        actionButtonPlacement === "left" ? "flex-row-reverse" : "flex",
                        "flex items-center justify-center gap-2"
                    )}
                >
                    {
                        hideSearch ||
                        <Input
                            value={searchQuery ?? ""}
                            inputType="search"
                            name="search"
                            inputClassName="!bg-transparent !rounded-xl gap-1 items-center max-md:w-[180px]"
                            className="!bg-transparent !w-fit !mb-0"
                            onChange={handleSearch}
                            placeholder={searchPlaceholder ?? "Search"}
                        />
                    }
                    {!isMobileScreen && showButton && (
                        <Button
                            title={actionButtonTitle}
                            onClick={actionButtonOnClick}
                            rootClassName={actionButtonClassName}
                            size="small"
                            icon={actionButtonIcon}
                        />
                    )}
                    {!isMobileScreen && actionButtons?.map((button: ActionButtons) => (
                        <Button
                            title={button?.buttonTitle}
                            onClick={button?.buttonOnClick}
                            rootClassName={button?.buttonClassName}
                            size="small"
                            icon={button?.buttonIcon}
                        />
                    ))}
                </div>
            </div>
            <div className="md:hidden w-full flex gap-2 px-3 pb-2">
                {leftButton?.showButton && (
                    <Button
                        title={leftButton?.buttonTitle}
                        onClick={leftButton?.buttonOnClick}
                        rootClassName={leftButton?.buttonClassName}
                        size="small"
                        icon={leftButton?.buttonIcon}
                    />
                )}
                {actionButtons?.map((button: ActionButtons) => (
                    <Button
                        title={button?.buttonTitle}
                        onClick={button?.buttonOnClick}
                        rootClassName={button?.buttonClassName}
                        size="small"
                        icon={button?.buttonIcon}
                    />
                ))}
            </div>
            {
                isMobileScreen &&
                <SideModal isOpen={isSideNavBarOpen}>
                    <Sidebar onClose={() => setIsSideNavBarOpen(!isSideNavBarOpen)} />
                </SideModal>
            }
        </div>
    );
};

export default CommonHeader;
