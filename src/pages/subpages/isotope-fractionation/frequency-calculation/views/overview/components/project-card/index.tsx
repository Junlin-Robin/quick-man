import { useMemo, useState } from 'react';
import { Card, Button, Space, Tag, Row, Col, Drawer, Popconfirm } from 'antd';
import { SettingOutlined, EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { Moment } from 'moment';
import { isArray } from 'lodash';


interface Props {
    key?: string;
    title?: string;
    description?: {
        createTime: string | number | Moment;
        author: string | number;
        elements: string[] | string;
        details: string;
    };
    deleteProject: (id: number) => void;
    editProject: ({ }) => void;
}

const ProjectCard = (props: Props) => {
    const { key, description, title } = props;

    const [open, setOpen] = useState(false);

    const memoDescription = useMemo(() => {
        const { createTime, elements, author, details } = description || {};
        return (
            <>
                <Row wrap={false}>
                    <Col style={{ minWidth: '80px' }}>计算元素：</Col>
                    <Col style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} flex={1}>
                        {
                            isArray(elements) ? elements.map((item) => <Tag color='cyan'>{item}</Tag>) : (<Tag>{elements}</Tag>)
                        }
                    </Col>
                </Row>
                <Row wrap={false}>
                    <Col style={{ minWidth: '80px' }}>创建人：</Col>
                    <Col style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} flex={1}>{author || '-'}</Col>
                </Row>
                <Row wrap={false}>
                    <Col style={{ minWidth: '80px' }}>创建时间：</Col>
                    <Col style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} flex={1}>{moment(createTime).format("YYYY-MM-DD HH:mm:ss") || '-'}</Col>
                </Row>
                <Row wrap={false}>
                    <Col style={{ minWidth: '80px' }}>详细信息：</Col>
                    <Col style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} flex={1}>{details || '-'}</Col>
                </Row>
            </>
        )
    }, [description]);

    return (
        <Card
            hoverable
            key={key}
            cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
            actions={[
                <SettingOutlined key="setting" onClick={() => setOpen(true)} />,
                <EditOutlined key="edit" />,
                <Popconfirm
                    title="删除工程"
                    description="计算任务会一并删除，不可恢复，是否继续删除"
                    // onConfirm={confirm}
                    // onCancel={() => setOpen(false)}
                    okText="确定"
                    cancelText="取消"
                    style={{width: '60px'}}
                    icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                    // placement="topRight"
                >
                    <DeleteOutlined key="delete" />
                </Popconfirm>
            ]}
            style={{ overflow: 'hidden' }}
        >
            <Card.Meta title={title} description={memoDescription} />
            <Drawer
                getContainer={false}
                title="Basic Drawer"
                placement="top"
                onClose={() => setOpen(false)}
                open={open}
                // size="large"
                height="70%"
                // width="calc(100% + 2px)"
                // style={{border: 'none'}}
                footer={(
                    <Row justify="end">
                        <Space>
                            <Button onClick={() => setOpen(false)}>取消</Button>
                            <Popconfirm
                                title="取消修改"
                                description="取消后不会保存任何修改"
                                // onConfirm={confirm}
                                // onCancel={() => setOpen(false)}
                                okText="Yes"
                                cancelText="No"
                                placement="topRight"
                            >
                                <Button type="primary">保存</Button>
                            </Popconfirm>
                        </Space>
                    </Row>
                )}
            />
        </Card>
    )
}

export default ProjectCard;
