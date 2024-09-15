import { Empty, Row, Col } from "antd";
import { isEmpty } from "lodash";
import ProjectCard from "./project-card";
import type { FormType } from '../project-form/type';

import QueueAnim from 'rc-queue-anim';

interface Props {
    projectList: (FormType & { id: string; createTime: number; updateTime?: number })[];
    deleteProject: (id: string) => void
    editProject: (id: string) => void
}

const ProjectCardList = (props: Props) => {
    const { projectList, deleteProject, editProject } = props;

    return (
        isEmpty(projectList) ? (<Empty imageStyle={{ height: '120px', marginTop: '180px' }} description="未搜索到结果～" />) : (
            <Row gutter={[12, 12]}>
                    {
                        projectList.map((project) => (
                            <Col xs={24} sm={24} md={12} lg={8} xxl={6} key={project.id}>
                                <ProjectCard key={project.id} project={project} deleteProject={() => deleteProject(project.id)} editProject={editProject} />
                            </Col>
                        ))
                    }
            </Row>
        )
    )
}

export default ProjectCardList;
