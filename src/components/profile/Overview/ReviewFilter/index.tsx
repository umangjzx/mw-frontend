import React, { useState } from "react";
import { Input } from "@/components/common/Input";

const ReviewFilter = () => {
    const [sort, setSort] = useState("Most Recent");
    const options = ["Most Recent", "Most Helpful", "Highest Rating", "Lowest Rating"];

    return (
        <div className="flex items-center justify-between w-full">
            <p className="text-xl font-medium">Reviews</p>
            <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-light whitespace-nowrap">Sort By:</p>
                <Input
                    className="w-[14rem] !mb-0 !rounded-2xl"
                    inputType="select"
                    name="sort"
                    options={options.map((option) => ({ label: option, value: option }))}
                    value={sort}
                    onChange={(e) => setSort(e as string)}
                />
            </div>
        </div>
    );
};

export default ReviewFilter;
