import { useEffect, useMemo } from 'react';
import { StringParam, useQueryParams } from 'use-query-params';
import { RecoilRoot } from 'recoil';
import { message } from 'antd';

import ProjectDetail from './project-detail';


export default function DetailRoot() {

    const [query] = useQueryParams({ id: StringParam });

    const id = useMemo(() => query.id, [query.id]);

    useEffect(() => {
        if (!id) message.error('系统错误，未设置工程id！')
    }, [id]);

    return (
        <RecoilRoot>
            <ProjectDetail id={id!} />
        </RecoilRoot>
    )
}