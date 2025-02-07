import { Input } from "../Input";
import { useQueryState } from "nuqs";
import Button from "@/components/common/Button";
import { cn, formatString } from "@/utils/merge-class";
import { useComponentStore } from "@/store/useComponenetStore";
import InnerWidth from "@/utils/innerWidth";
import { FeedModalCloseIcon, SideMenuIcon } from "@/assets/icons";
import SideModal from "@/components/common/Modals/MobileSideModal";
import Sidebar from "@/components/common/Sidebar";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { IoIosSearch } from "react-icons/io";

const CommonHeader: React.FC = () => {
    const pathname = usePathname();
    const { headerOptions } = useComponentStore();
    const [searchQuery, setSearchQuery] = useQueryState("query");
    const {
        searchPlaceholder,
        actionButtonOnClick,
        actionButtonClassName,
        actionButtonIcon,
        actionButtonPlacement,
        actionButtonTitle,
        actionButtonVariant,
        showTitleButton,
        showButton,
        leftButton,
        titleIcon,
        title,
        titleIconClick,
        actionButtons = [],
        hideSearch
    } = headerOptions || {};

    const isMobileOrTabScreen = InnerWidth() < 1024;
    const [isSideNavBarOpen, setIsSideNavBarOpen] = useState<boolean>(false);
    const [isSearchInputOpen, setIsSearchInputOpen] = useState<boolean>(false);

    useEffect(() => {
        setIsSideNavBarOpen(false);
    }, [pathname])

    const handleSearch = (value: string) => {
        setSearchQuery(value === "" ? "" : value);
    };

    return (
        <div className="w-full h-full relative">
            <div className="w-full h-auto lg:h-full p-2 px-3 flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <div className="flex capitalize items-center">
                        {
                            showTitleButton ||
                            <div className="lg:hidden cursor-pointer mr-2" onClick={() => setIsSideNavBarOpen(true)}>
                                <SideMenuIcon height="22px" width="22px" />
                            </div>
                        }
                        {
                            (showTitleButton || !isMobileOrTabScreen) &&
                            <Button
                                icon={titleIcon}
                                rootClassName={cn(
                                    "flex items-center justify-center !w-10 !h-10 rounded-full hover:bg-gray-100",
                                    titleIconClick ? "cursor-pointer border-stroke mr-2" : "!border-none"
                                )}
                                onClick={titleIconClick}
                            />
                        }
                        <h1 className="text-lg font-medium">{formatString(title ?? "")}</h1>
                    </div>
                    {!isMobileOrTabScreen && leftButton?.showButton && (
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
                        hideSearch || (isMobileOrTabScreen ?
                            <Button
                                icon={<IoIosSearch className="!text-xl" />}
                                onClick={() => setIsSearchInputOpen(true)}
                                customClassName="!rounded-full !p-2 !h-fit"
                                btnVariant="tertiary"
                            />
                            :
                            <Input
                                value={searchQuery ?? ""}
                                inputType="search"
                                name="search"
                                inputClassName="!bg-transparent !rounded-xl gap-1 items-center max-md:w-[180px]"
                                className="!bg-transparent !w-fit !mb-0"
                                onChange={handleSearch}
                                placeholder={searchPlaceholder ?? "Search"}
                            />)
                    }
                    {showButton && (
                        <Button
                            title={actionButtonTitle}
                            onClick={actionButtonOnClick}
                            rootClassName={actionButtonClassName}
                            size="small"
                            btnVariant={actionButtonVariant || ""}
                            icon={actionButtonIcon}
                        />
                    )}
                    {!isMobileOrTabScreen && actionButtons?.map((button: ActionButtons) => (
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
            {
                (leftButton?.showButton || actionButtons?.length > 0) && (
                    <div className="lg:hidden w-full flex gap-2 px-3 pb-2">
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
                )
            }
            {isMobileOrTabScreen &&
                <div className={`absolute z-100 w-full h-full bg-white flex-center gap-2 px-5 transform transition-all duration-500 ${isSearchInputOpen ? "top-0 right-0" : "top-0 -right-full"}`}>
                    <Input
                        value={searchQuery ?? ""}
                        inputType="search"
                        name="search"
                        inputClassName="bg-background-input rounded-xl gap-1 items-center w-full"
                        className="!w-full !mb-0"
                        onChange={handleSearch}
                        placeholder={searchPlaceholder ?? "Search"}
                    />
                    <span onClick={() => setIsSearchInputOpen(false)} className="cursor-pointer">
                        <FeedModalCloseIcon width="25" height="25" />
                    </span>
                </div>
            }
            {
                isMobileOrTabScreen &&
                <SideModal isOpen={isSideNavBarOpen}>
                    <Sidebar onClose={() => setIsSideNavBarOpen(!isSideNavBarOpen)} />
                </SideModal>
            }
        </div>
    );
};

export default CommonHeader;
