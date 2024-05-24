import { Avatar, Space, Col, Typography, Button } from 'antd';
import LogoSrc from 'public/square-pants-logo.svg';
// import Logo from './components/logo';

export default function Header(props) {

    return (
        <>
            <Space>
                <Col>
                    <Avatar size={56} src={<img src={LogoSrc} alt="Logo" />} style={{marginTop: '-5px'}} />
                </Col>
                <Col>
                    <Typography.Title level={2} style={{lineHeight: '64px', padding: 0, margin: 0}}>Sponge</Typography.Title>
                </Col>
                <Col>
                    <Button>测试1</Button>
                </Col>
                {/* <Col>
                <Button type="primary">测试2</Button>
                </Col> */}
            </Space>
        </>
    );
}
