import { useState } from 'react';
import { Avatar, Space, Row, Col, Typography, Dropdown, Button, message } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    LoginOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import LogoSrc from 'public/square-pants-logo.svg';
// import Logo from './components/logo';


const items = [
    {
        key: 'exit',
        label: (
            <a href="#" onClick={(e) => {
                e.preventDefault();
                message.warning('功能开发中，敬请期待～')
            }}>
                <Space>
                    <LoginOutlined />
                    <span>退出登录</span>
                </Space>
            </a>
        ),
    },
    {
        key: 'change',
        label: (
            <a href="#"  onClick={(e) => {
                e.preventDefault();
                message.warning('功能开发中，敬请期待～')
            }}>
                <Space>
                    <SyncOutlined />
                    <span>切换账号</span>
                </Space>
            </a>
        ),
    },
];

interface IProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
    isLargerThanMinWidth?: boolean;
}

export default function Header(props: IProps) {
    const { collapsed, setCollapsed, isLargerThanMinWidth } = props;
    const [isHovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <>
            <Row justify="space-between" wrap={false} align="middle">
                <Col>
                    <Space align="center">
                        {
                            !isLargerThanMinWidth && (
                                <Col style={{ height: '64px' }}>
                                    <Button
                                        type="text"
                                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                        onClick={() => setCollapsed(!collapsed)}
                                        size='large'
                                    />
                                </Col>
                            )
                        }
                        <Col style={{ height: '64px' }}>
                            <Avatar size={45} src={<img src={LogoSrc} alt="Logo" />} style={{ marginTop: '-8px' }} />
                        </Col>
                        <Col style={{ height: '64px' }}>
                            <Typography.Title level={3} style={{ lineHeight: '64px', padding: 0, margin: 0, display: 'inline-block' }} ellipsis>Sponge</Typography.Title>
                        </Col>
                    </Space>
                </Col>
                <Col style={{ height: '64px' }}>
                    <Space>
                        {/* 补充多页面链接 */}
                        <Dropdown menu={{ items }}>
                            <Space onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ height: '45px', borderRadius: '8px', padding: '0 8px', backgroundColor: isHovered ? '#F5F5F5' : '#fff' }}>
                                <Avatar size={30}>
                                    <UserOutlined />
                                </Avatar>
                                <Typography.Text type='secondary' ellipsis style={{ fontSize: 15,lineHeight: '60px', fontWeight: 400 }}>admin</Typography.Text>
                            </Space>
                        </Dropdown>
                    </Space>
                </Col>
            </Row>
        </>
    );
}
