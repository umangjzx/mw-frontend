import { ButtonProps as AntButtonProps } from "antd";

type ButtonProps = AntButtonProps & {
    customClassName?: string;
    btnVariant?: "primary" | "secondary";
    title?: string;
};
