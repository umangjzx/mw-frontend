import { motion } from "framer-motion";

const UnlikeHeartIcon = ({ className }: { className?: string }) => {
    return (
        <motion.svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="transparent"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            initial={{ fill: "transparent" }}
            animate={{ fill: "transparent" }}
            whileHover={{ fill: "rgba(239, 68, 68, 0.2)" }}
            transition={{ duration: 0.2 }}
        >
            <motion.path
                d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.69001C2 5.60001 4.49 3.10001 7.56 3.10001C9.38 3.10001 10.99 3.98001 12 5.34001C13.01 3.98001 14.63 3.10001 16.44 3.10001C19.51 3.10001 22 5.60001 22 8.69001C22 15.69 15.52 19.82 12.62 20.81Z"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ stroke: "#292D32" }}
                animate={{ stroke: "#292D32" }}
                whileHover={{ stroke: "#EF4444" }}
                transition={{ duration: 0.2 }}
            />
        </motion.svg>
    );
};

export default UnlikeHeartIcon;
