import { Input } from "../Input";
import { useQueryState } from "nuqs";
import Button from "@/components/common/Button";
import { cn, formatString } from "@/utils/merge-class";
import { useComponentStore } from "@/store/useComponenetStore";

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

    const handleSearch = (value: string) => {
        setSearchQuery(value === "" ? "" : value);
    };

    return (
        <div className="w-full h-full p-2 px-3 flex items-center justify-between">
            <div className="flex items-center gap-5">
                <div className="flex capitalize items-center">
                    <Button
                        icon={titleIcon}
                        rootClassName={cn(
                            "flex items-center justify-center  !w-10 h-10 rounded-full hover:bg-gray-100",
                            titleIconClick ? "cursor-pointer border-stroke mr-2" : "border-none"
                        )}
                        onClick={titleIconClick}
                    />
                    <h1 className="text-lg font-medium">{formatString(title ?? "")}</h1>
                </div>
                {leftButton?.showButton && (
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
                        inputClassName="!bg-transparent mt-4 !rounded-xl gap-1 items-center"
                        className="!bg-transparent !w-fit"
                        onChange={handleSearch}
                        placeholder={searchPlaceholder ?? "Search"}
                    />
                }
                {showButton && (
                    <Button
                        title={actionButtonTitle}
                        onClick={actionButtonOnClick}
                        rootClassName={actionButtonClassName}
                        size="small"
                        icon={actionButtonIcon}
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
        </div>
    );
};

export default CommonHeader;
