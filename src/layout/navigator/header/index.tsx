import {useEffect} from 'react';
import { Avatar, Space, Row, Col, Typography, Menu, Button } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import LogoSrc from 'public/square-pants-logo.svg';
// import Logo from './components/logo';

export default function Header(props) {
    const { collapsed, setCollapsed, md } = props;
    useEffect(() => {
        console.log({collapsed, setCollapsed, md})
    }, [
        collapsed, setCollapsed, md
    ]);

    return (
        <>
            <Row justify="space-between" wrap={false} align="middle">
                <Col>
                    <Space align="center">
                        {
                            !md && (
                                <Col style={{ height: '64px' }}>
                                    <Button
                                        type="text"
                                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                        onClick={() => setCollapsed(!collapsed)}
                                        style={{
                                            fontSize: '16px',
                                            width: 40,
                                            height: 40,
                                        }}
                                    />
                                </Col>
                            )
                        }
                        <Col style={{ height: '64px' }}>
                            <Avatar size={45} src={<img src={LogoSrc} alt="Logo" />} style={{ marginTop: '-5px' }} />
                        </Col>
                        <Col style={{ height: '64px' }}>
                            <Typography.Title level={3} style={{ lineHeight: '64px', padding: 0, margin: 0, display: 'inline-block' }} ellipsis>Sponge</Typography.Title>
                        </Col>
                    </Space>
                </Col>
                <Col style={{ height: '64px' }}>
                    <Space>
                        {/* <Menu
                            theme="light"
                            mode="horizontal"
                            defaultSelectedKeys={['2']}
                            items={new Array(3).fill(null).map((_, index) => ({
                                key: index + 1,
                                label: `nav ${index + 1}`,
                            }))}
                            style={{ flex: 1, minWidth: 0 }}
                        /> */}
                        <Avatar />
                    </Space>
                </Col>
            </Row>
        </>
    );
}
