import type { CascaderProps } from "antd";

export interface Options {
    label: string;
    value: string | number;
    disabled?: boolean;
    children?: Options[];
}

export type CascaderProProps = {
    value?: (string | number | null)[];
    onChange?: (value: (string | number | null)[]) => void;
    options: Options[];
} & Omit<CascaderProps, 'multiple' | 'value' | 'onChange' | 'options'>