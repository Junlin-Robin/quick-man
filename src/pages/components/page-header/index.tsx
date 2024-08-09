import { Typography, Breadcrumb, Row, Col, Tooltip } from 'antd';
import { useMemoizedFn } from 'ahooks';
import { isArray, isEmpty } from 'lodash';
import { QuestionCircleOutlined } from '@ant-design/icons';

interface IProps {
    title: string | (string | React.ReactNode)[];
    description?: string;
    isShowQuestionIcon?: boolean;
    extra?: React.ReactNode;
}

export default function PageHeader(props: IProps) {
    const {
        title,
        description,
        isShowQuestionIcon = false,
        extra,
    } = props;

    const renderTitle = useMemoizedFn((title: string | (string | React.ReactNode)[]) => {
        if (!isArray(title)) return (<Typography.Title level={5} style={{ margin: 0, flexShrink: 0, marginRight: '5px' }}>{title || ''}</Typography.Title>);
        else if (title.length === 1 || isEmpty(title)) return (<Typography.Title level={5} style={{ margin: 0, flexShrink: 0, marginRight: '5px' }}>{title[0] || ''}</Typography.Title>);
        else return (
            <Breadcrumb
                items={
                    title.map((titleItem) => ({ title: titleItem }))
                }
            />
        );
    });

    return (
        <Row gutter={8} align="middle" justify="space-between" wrap={false} style={{marginBottom: '8px'}}>
            <Col style={{maxWidth: '75vw', display: 'flex'}}>
                {
                    renderTitle(title)
                }
                {
                    isShowQuestionIcon ? (
                        <Tooltip title={description || ''}>
                            <QuestionCircleOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }} />
                        </Tooltip>
                    ) : (
                        <Typography.Title level={5} style={{ margin: 0, fontWeight: 300 }} type="secondary" ellipsis>{description || ''}</Typography.Title>
                    )
                }
            </Col>
            <Col style={{float: 'right'}}>
                {extra}
            </Col>
        </Row >
    );
}
