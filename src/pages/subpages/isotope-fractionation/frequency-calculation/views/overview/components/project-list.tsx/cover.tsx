import { Elements } from "@/constants/element";
import { Space } from "antd";

export default function Cover(props: { element: string }) {
    const { element } = props;

    const { overview, index } = Elements.find((ele) => ele.key === element) || {};

    const { EN_name, ZhCN_name, picture_url, relative_mass } = overview!;

    return (
        <div style={{
            backgroundImage: `url(${picture_url})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            position: 'relative',
            height: '220px',
        }}>
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '150px',
                background: 'linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(255, 255, 255, 0))',
                backdropFilter: 'blur(.4px)',
            }}
            />
            <div style={{ position: 'absolute', bottom: '10px', left: '20px' }}>
                <div style={{ color: '#fff', fontWeight: 400, fontSize: 20 }}>
                    <Space align="end">
                        <span>{ZhCN_name}</span>
                        <sub style={{ fontSize: 16 }}>{index}</sub>
                    </Space>
                </div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 26 }}>{EN_name}</div>
                <div style={{ color: '#fff', fontWeight: 500, fontSize: 16 }}>{relative_mass} (g/mol)</div>
            </div>
        </div>
    )

}