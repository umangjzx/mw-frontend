import { useEffect, useState } from "react";

const useInnerWidth = () => {
    const [innerWidth, setInnerWidth] = useState(0);

    useEffect(() => {
        setInnerWidth(window.innerWidth);
    }, []);

    return innerWidth;
};

export default useInnerWidth;
