import { useState } from 'react';
import { message } from 'antd';
import type { FormType, IsotopeMassValueType } from '../components/project-form/type';
import { PROJECT_INFO_KEY } from '../../../constants'
import moment from 'moment';

export type ProjectListType = (FormType & { id: string; createTime: number; updateTime?: number })[]

/**
 * 判断两次Form传入的同位素质量值是否相等
 * @param historyIsotopeMass 历史值
 * @param newIsotopeMass 新值
 * @returns 布尔值（是否修改）
 */
function isSameIsotopeMass(historyIsotopeMass: IsotopeMassValueType, newIsotopeMass: IsotopeMassValueType) {
    const { light: oldLightMass, heavy: oldHeavyMass } = historyIsotopeMass || {};
    const { light: newLightMass, heavy: newHeavyMass } = newIsotopeMass || {};

    if (!oldLightMass || !oldHeavyMass || !newLightMass || !newHeavyMass) return false;
    //此处仅比较round值
    return oldLightMass.round === newLightMass.round && oldHeavyMass.round === newHeavyMass.round;
}

/**
 * 用于判断浏览器是否支持localStorage，不支持直接刨除异常，需要捕获
 */
function judgeLocalStorageisAvailable() {
    if (!window.localStorage) {
        throw new Error('当前浏览器不支持使用本地存储，清更换Chrome浏览器或者打开localStorage权限！');
    }
    return true;
}

/**
 * 获取localStorage存储的工程列表
 */
function getAndParseProjectListInLoaclStorage() {
    let existProjectIdList: ProjectListType = [];

    try {
        const projectIdListJson = localStorage.getItem(PROJECT_INFO_KEY);
        existProjectIdList = JSON.parse(projectIdListJson || JSON.stringify([]));
    } catch {
        throw new Error('系统错误，解析localStorage中的工程列表出错，请联系管理员！');
    }

    return existProjectIdList;
}

/**
 * 设置工程列表到 localStorage
 */
function stringifyAndSetProjectInLocalStorage(newProjectIdList: ProjectListType) {
    try {
        const newProjectIdListJson = JSON.stringify(newProjectIdList);
        localStorage.setItem(PROJECT_INFO_KEY, newProjectIdListJson);
    } catch {
        throw new Error('系统错误，序列化工程信息出错，请联系管理员！');
    }

    return true;
}

/**
 * 创建/修改工程
 * @returns createOrModifiedProject 创建/修改工程-异步函数
 * @returns loading
 */
export function useCreateOrModifiedProject() {
    const [loading, setLoading] = useState(false);

    const createOrModifiedProject = (formValue: FormType, id: string) => new Promise<boolean>((res, rej) => {
        //首先判断浏览器是否支持localStorage
        try {
            judgeLocalStorageisAvailable()
        } catch (error) {
            return rej(error);
        }

        if (!id) {
            return rej(new Error('系统错误，未设置工程id，请联系管理员！'));
        }

        setLoading(true);

        let historyProjectIdList: ProjectListType = [];

        try {
            historyProjectIdList = getAndParseProjectListInLoaclStorage();
        } catch (error) {
            return rej(error);
        }

        const existIdIndex = historyProjectIdList.findIndex((item) => item?.id === id);

        //新建项目增加储存当前工程详情的数据
        if (existIdIndex === -1) localStorage.setItem(id, JSON.stringify({ taskNumber: 0 }));
        else {
            //编辑场景先判断是否存在已有的计算任务，如果有则检查是否修改了元素、同位素质量等关键信息，有则报错，没有通过
            const { calculationElement: historyElement, isotopeMass: historyIsotopeMass } = historyProjectIdList[existIdIndex];
            const { calculationElement: newElement, isotopeMass: newIsotopeMass } = formValue;
            const taskNumber = JSON.parse(localStorage.getItem(id) || '')?.taskNumber || 0;
            if (taskNumber > 0 && (historyElement !== newElement || !isSameIsotopeMass(historyIsotopeMass, newIsotopeMass))) {
                return rej(new Error('当前工程下已有计算任务，暂不允许修改同位素设置信息！'));
            }
        }

        let newProjectIdList = [];

        if (existIdIndex !== -1) {
            historyProjectIdList[existIdIndex] = {
                ...formValue,
                id,
                createTime: historyProjectIdList[existIdIndex]?.createTime || moment().valueOf(),
                updateTime: moment().valueOf(),
            };
            newProjectIdList = [...historyProjectIdList];
        } else {
            newProjectIdList = [...historyProjectIdList, {
                id,
                ...formValue,
                createTime: moment().valueOf(),
                updateTime: moment().valueOf(),
            }]
        }

        try {
            stringifyAndSetProjectInLocalStorage(newProjectIdList)
        } catch (error) {
            return rej(error);
        }

        //暂时设置随机不超过1s的延时，模拟等待
        setTimeout(() => {
            setLoading(false);
            return res(true);
        }, Math.random() * 1000);

    })


    return {
        createOrModifiedProject,
        loading,
    };

}

/**
 * 删除工程
 * @returns 是否成功
 */
export function deleteProject(id: string): boolean {
    //首先判断浏览器是否支持localStorage
    try {
        judgeLocalStorageisAvailable()
    } catch (error) {
        message.error((error as Error).message)
        return false;
    }

    if (!id) {
        message.error('系统错误，未设置工程id，请联系管理员！');
        return false;
    }

    let projectIdList: ProjectListType = [];

    try {
        projectIdList = getAndParseProjectListInLoaclStorage();
    } catch (error) {
        message.error((error as Error).message);
        return false;
    }

    const filterProjectList = projectIdList.filter((item) => item?.id !== id);

    try {
        stringifyAndSetProjectInLocalStorage(filterProjectList);
    } catch (error) {
        message.error((error as Error).message);
        return false;
    }

    localStorage.removeItem(id);

    return true;

}

/**
 * 获取工程列表
 * @returns triggerGetProjects 获取工程列表-同步函数
 * @returns loading 获取等待loading
 */
export function useGetProjectList() {
    const [loading, setLoading] = useState(false);
    const [projectList, setProjectList] = useState<ProjectListType>([]);

    //获取工程信息
    const triggerGetProjects = (search?: string): void => {

        //首先判断浏览器是否支持localStorage
        try {
            judgeLocalStorageisAvailable()
        } catch (error) {
            message.error((error as Error).message)
            return;
        }

        setLoading(true);

        //所有的项目列表
        let allProjectList: ProjectListType = [];
        //过滤出来的项目列表
        let filterProjectList: ProjectListType = [];

        try {
            allProjectList = getAndParseProjectListInLoaclStorage();
        } catch (error) {
            message.error((error as Error).message);
            return;
        }

        if (!search) {
            filterProjectList = allProjectList
        } else {
            const searchProjectIdList = allProjectList.filter((item) => item?.projectName?.includes(search));
            filterProjectList = searchProjectIdList;
        }
        //暂时设置随机不超过1s的延时，模拟等待
        setTimeout(() => {
            setLoading(false);
            setProjectList(filterProjectList);
        }, Math.random() * 1000);

    }


    return {
        triggerGetProjects,
        projectList,
        loading,
    };

}