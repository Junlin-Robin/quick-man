import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge, Space, Row, Col, Modal, Tooltip } from 'antd';
import { SettingOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { FormType } from '../project-form/type';
import Cover from './cover';
import IsotopeTag from './isotope-tag';
import { CalculationServiesOptions } from '../../../../constants';
import { findNode } from './utils';


interface Props {
    project: FormType & { id: string; createTime: number; updateTime?: number }
    deleteProject: (id: string) => void
    editProject: (id: string) => void
}

const ProjectCard = (props: Props) => {
    const { project, deleteProject, editProject } = props || {};

    const { id, isotopeMass, calculationElement, createTime, projectDescription, updateTime, calculationService } = project || {};

    const navigate = useNavigate();

    const serviceText = useMemo(() => {
        const nodeNameList = calculationService?.map((item) => {
            console.log({ item });
            console.log({ findNode: findNode(item, CalculationServiesOptions) });
            return findNode(item, CalculationServiesOptions)?.label
        }) || [];
        return nodeNameList?.join('、');
    }, [calculationService]);

    const confirmDeleteProject = () => {
        Modal.confirm({
            title: '删除工程',
            content: '工程删除后，该工程中包含的计算任务也会被一并删除，是否确认删除？',
            cancelText: '取消',
            onCancel: (close) => { close() },
            onOk: (close) => {
                deleteProject(id);
                close();
            },
            centered: true,
            style: { maxWidth: '80vw' }
        });
    }


    const memoDescription = useMemo(() => {
        return (
            <Space direction="vertical" size={2} style={{ width: '100%' }}>
                <Row wrap={false}>
                    <Col style={{ minWidth: '80px' }}>同位素：</Col>
                    <Col style={{ overflow: 'hidden', whiteSpace: 'snowrap', textOverflow: 'ellipsis' }} flex={1}>
                        <IsotopeTag isotopeMass={isotopeMass.light?.round as number} isotopeName={calculationElement as string} />
                        <IsotopeTag isotopeMass={isotopeMass.heavy?.round as number} isotopeName={calculationElement as string} />
                    </Col>
                </Row>
                <Row wrap={false}>
                    <Col style={{ minWidth: '80px' }}>计算服务：</Col>
                    <Col style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} flex={1}>
                        <Tooltip title={serviceText}> {serviceText}</Tooltip>
                    </Col>
                </Row>
                <Row wrap={false}>
                    <Col style={{ minWidth: '80px' }}>创建时间：</Col>
                    <Col style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} flex={1}>{moment(createTime).format("YYYY-MM-DD HH:mm:ss") || '-'}</Col>
                </Row>
                <Row wrap={false}>
                    <Col style={{ minWidth: '80px' }}>更新时间：</Col>
                    <Col style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} flex={1}>{updateTime ? moment(updateTime).format("YYYY-MM-DD HH:mm:ss") : '-'}</Col>
                </Row>
                <Row wrap={false}>
                    <Col style={{ minWidth: '80px' }}>详细信息：</Col>
                    <Tooltip title={projectDescription || ''}>
                        <Col style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} flex={1}>{projectDescription || '-'}</Col>
                    </Tooltip>
                </Row>
            </Space>
        )
    }, [calculationElement, createTime, isotopeMass.heavy?.round, isotopeMass.light?.round, projectDescription, serviceText, updateTime]);

    return (
        <Badge.Ribbon text="仅本人" color='green'>
            <Card
                hoverable
                cover={<Cover element={project.calculationElement as string} />}
                actions={[
                    (
                        <Tooltip title="进入工程">
                            <SettingOutlined key="setting" onClick={() => navigate(`/calculation/qm/isotope-fractionation/frequency/detail?id=${project.id}`)} />
                        </Tooltip>
                    ),
                    (
                        <Tooltip title="修改工程">
                            <EditOutlined key="edit" onClick={() => editProject(id)} />
                        </Tooltip>
                    ),
                    (
                        <Tooltip title="删除工程">
                            <DeleteOutlined key="delete" onClick={confirmDeleteProject} />
                        </Tooltip>
                    )
                ]}
                style={{ overflow: 'hidden' }}
            >
                <Card.Meta title={project.projectName} description={memoDescription} />
            </Card>
        </Badge.Ribbon>
    )
}

export default ProjectCard;
