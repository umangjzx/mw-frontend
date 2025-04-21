import React from "react";

interface FeedHeaderProps {
    title: string;
    onClose: () => void;
    onSave: () => void;
    isSubmitting?: boolean;
    rootClassName?: string;
    saveBtnClassName?: string;
    cancelBtnClassName?: string;
    mode?: string;
}

const FeedHeader = ({ title, mode, onClose, onSave, isSubmitting = false, rootClassName = "", saveBtnClassName = "", cancelBtnClassName = "" }: FeedHeaderProps) => {
    return (
        <div className={`flex justify-between items-center px-3 py-2 ${rootClassName}`}>
            <button
                onClick={onClose}
                disabled={isSubmitting}
                className={`flex items-center justify-center gap-2 bg-[#F4F7FB] border border-[#E0E0E0] rounded-xl text-[14px] px-4 py-2 w-[72px] ${cancelBtnClassName}`}
            >
                Cancel
            </button>
            <h2 className="text-[16px] font-bold">{title}</h2>
            <button
                onClick={onSave}
                disabled={isSubmitting}
                className={`flex items-center justify-center gap-2 bg-[#1E1E1E] border border-black text-white text-[14px] rounded-xl px-4 py-2 w-[72px] ${saveBtnClassName}`}
            >
                {isSubmitting ? (mode === "edit" ? "Saving" : "Adding") : (mode === "edit" ? "Save" : "Add")}
            </button>
        </div>
    );
};

export default FeedHeader;
