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
import { usePathname, useSearchParams } from "next/navigation";
import { IoIosSearch } from "react-icons/io";

const CommonHeader: React.FC = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
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
        hideSearch,
        centerButton,
        hideHeader,
    } = headerOptions || {};

    const isMobileOrTabScreen = InnerWidth() < 1024;
    const isMobile = InnerWidth() < 768;
    const isMessagesChatPage =
        (pathname?.includes("/volunteer/messages") || pathname?.includes("/learner/messages")) &&
        searchParams?.get("chatId");
    const hideHeaderOnMobile = isMobile && isMessagesChatPage;

    const [isSideNavBarOpen, setIsSideNavBarOpen] = useState<boolean>(false);
    const [isSearchInputOpen, setIsSearchInputOpen] = useState<boolean>(false);

    useEffect(() => {
        setIsSideNavBarOpen(false);
    }, [pathname]);

    const handleSearch = (value: string) => {
        setSearchQuery(value === "" ? null : value);
    };

    const handleMobileSearchClose = () => {
        setSearchQuery(null);
        setIsSearchInputOpen(false);
    };

    if (hideHeader || hideHeaderOnMobile) return null;

    return (
        <div className="w-full h-full relative">
            <div className="w-full h-[64px] lg:h-full p-2 px-3 flex items-center justify-between relative">
                <div className="flex items-center gap-5">
                    <div className="flex capitalize items-center">
                        {showTitleButton || (
                            <div
                                className="lg:hidden cursor-pointer mr-2"
                                onClick={() => setIsSideNavBarOpen(true)}
                            >
                                <SideMenuIcon height="22px" width="22px" />
                            </div>
                        )}
                        {isMobileOrTabScreen && leftButton?.showButton && !pathname?.includes("/instant-sessions") ? (
                            <Button
                                title={leftButton?.buttonTitle}
                                onClick={leftButton?.buttonOnClick}
                                rootClassName={leftButton?.buttonClassName}
                                size="small"
                                icon={leftButton?.buttonIcon}
                            />
                        ) : (
                            <>
                                {titleIcon &&
                                    (showTitleButton || !isMobileOrTabScreen) &&
                                    (!pathname?.includes("/instant-sessions") || isMobileOrTabScreen) && (
                                    <Button
                                        icon={titleIcon}
                                        rootClassName={cn(
                                            "flex items-center justify-center !w-10 !h-10 rounded-full hover:bg-gray-100",
                                            titleIconClick
                                                ? "cursor-pointer border-stroke mr-2"
                                                : "!border-none"
                                        )}
                                        onClick={titleIconClick}
                                    />
                                )}
                                <h3 className="md:text-lg text-[20px] font-medium">
                                    {formatString(
                                        (!pathname?.includes("/instant-sessions") || isMobileOrTabScreen)
                                            ? (title ?? "")
                                            : ""
                                    )}
                                </h3>
                            </>
                        )}
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
                {/* Center Button */}
                {centerButton?.showButton && !isMobileOrTabScreen && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
                        <Button
                            title={centerButton?.buttonTitle}
                            onClick={centerButton?.buttonOnClick}
                            rootClassName={centerButton?.buttonClassName}
                            size="small"
                            icon={centerButton?.buttonIcon}
                        />
                    </div>
                )}
                <div
                    className={cn(
                        actionButtonPlacement === "left" ? "flex-row-reverse" : "flex",
                        "flex items-center justify-center gap-2"
                    )}
                >
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
                    {hideSearch ||
                        (isMobileOrTabScreen &&
                        (leftButton?.showButton ||
                            centerButton?.showButton ||
                            actionButtons?.length > 0) ? null : isMobileOrTabScreen ? ( // Search moved to mobile row below when that row is shown
                            <Button
                                icon={<IoIosSearch className="!text-xl" />}
                                onClick={() => setIsSearchInputOpen(true)}
                                customClassName="!rounded-full !p-2 !h-fit"
                                btnVariant="tertiary"
                            />
                        ) : (
                            <div className={pathname?.includes("/instant-sessions") ? "!pr-5" : ""}>
                                <Input
                                    value={searchQuery ?? ""}
                                    inputType="search"
                                    name="search"
                                    inputClassName="!bg-transparent !rounded-full gap-1 items-center !w-[280px] !h-10 !pr-3"
                                    className="!bg-transparent !w-fit !mb-0"
                                    onChange={handleSearch}
                                    placeholder={searchPlaceholder ?? "Search"}
                                />
                            </div>
                        ))}
                    {!isMobileOrTabScreen &&
                        actionButtons?.map((button: ActionButtons) => (
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
            {(leftButton?.showButton || centerButton?.showButton || actionButtons?.length > 0) && (
                <div className="lg:hidden w-full flex gap-2 px-3 pb-2 items-center">
                    {centerButton?.showButton && (
                        <div className="flex-1 min-w-0">
                            <Button
                                title={centerButton?.buttonTitle}
                                onClick={centerButton?.buttonOnClick}
                                rootClassName={cn(centerButton?.buttonClassName, "!w-full")}
                                size="small"
                                icon={centerButton?.buttonIcon}
                            />
                        </div>
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
                    {!hideSearch && (
                        <Button
                            icon={<IoIosSearch className="!text-xl" />}
                            onClick={() => setIsSearchInputOpen(true)}
                            customClassName="!rounded-full !p-2 !h-fit"
                            btnVariant="tertiary"
                        />
                    )}
                </div>
            )}
            {isMobileOrTabScreen && (
                <div
                    className={`absolute z-100 w-full h-full bg-white flex-center gap-2 px-5 transform transition-all duration-500 ${
                        isSearchInputOpen ? "top-0 right-0" : "top-0 -right-full"
                    }`}
                >
                    <Input
                        value={searchQuery ?? ""}
                        inputType="search"
                        name="search"
                        inputClassName="bg-background-input rounded-xl gap-1 items-center w-full"
                        className="!w-full !mb-0"
                        onChange={handleSearch}
                        placeholder={searchPlaceholder ?? "Search"}
                    />
                    <span onClick={handleMobileSearchClose} className="cursor-pointer">
                        <FeedModalCloseIcon width="25" height="25" />
                    </span>
                </div>
            )}
            {isMobileOrTabScreen && (
                <SideModal isOpen={isSideNavBarOpen}>
                    <Sidebar onClose={() => setIsSideNavBarOpen(!isSideNavBarOpen)} />
                </SideModal>
            )}
        </div>
    );
};

export default CommonHeader;
