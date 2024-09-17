import { Tag } from "antd";

interface IProps {
    isotopeName: string;
    isotopeMass: number;
}

export default function IsotopeTag(props: IProps) {
    const { isotopeName, isotopeMass } = props;

    return (
        <Tag color="cyan">
            <span>
                <sup style={{ fontSize: '8px', lineHeight: '8px' }}>{isotopeMass}</sup>
                {isotopeName}
            </span>
        </Tag>
    );

}   