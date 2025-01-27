import { useEffect, useState } from "react";

const InnerWidth = () => {
    const [innerWidth, setInnerWidth] = useState(0);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setInnerWidth(window.innerWidth);
        }
    }, []);

    return innerWidth;
};

export default InnerWidth;