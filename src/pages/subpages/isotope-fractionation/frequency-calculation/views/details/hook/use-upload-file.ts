import { useEffect } from "react";
import { message } from 'antd';
import { useSetRecoilState, useRecoilState } from 'recoil';
import {
    judgeLocalStorageisAvailable,
    getAndParseValueInLoaclStorage,
    stringifyAndSetValueInLocalStorage,
} from "@/utils/operate-storage";

import {
    getDataState,
    taskDataState,
    taskDataLoading,
    triggerGetDataState,
    deleteDataState,
    createOrModifiedDataState,
} from '../constants/atoms';


import type { TaskDataType } from '../../../models'
import { useMemoizedFn } from "ahooks";

/**
 * 上传文件设置计算任务、获取存储的计算任务的代码
 * 待更改点：
 * 1. 新增一个变量存储所有的任务，所有需要全量数据的都去这里读取。
 * 2. 待观察，如果没有性能问题后期可以改成同步代码；使用requestAnimationFrame优化性能。
 */
export function useDealFileUpload(key: string) {

    const [loading, setLoading] = useRecoilState(taskDataLoading);
    const [data, setData] = useRecoilState<TaskDataType>(taskDataState);
    const setTriggerGetData = useSetRecoilState(triggerGetDataState); // 使用 Recoil 的 set 函数
    const setDeleteData = useSetRecoilState(deleteDataState); // 使用 Recoil 的 set 函数
    const setCreateOrModifiedData = useSetRecoilState(createOrModifiedDataState); // 使用 Recoil 的 set 函数
    const setGetData = useSetRecoilState(getDataState); // 使用 Recoil 的 set 函数

    //获取工程信息,直接得到所有任务列表
    const getData = useMemoizedFn((search?: string): Promise<TaskDataType> => {
        return new Promise((res, rej) => {
            if (!key) {
                return rej(new Error('系统错误，未设置工程id，请联系管理员！'));
            }

            //首先判断浏览器是否支持localStorage
            try {
                judgeLocalStorageisAvailable();
            } catch (error) {
                return rej(error);
            }

            setLoading(true);

            //所有的项目列表
            let allProjectList: TaskDataType = [];
            //过滤出来的项目列表
            let filterProjectList: TaskDataType = [];

            try {
                allProjectList = getAndParseValueInLoaclStorage(key);
            } catch (error) {
                // message.error((error as Error).message);
                return rej(error);
            }

            if (!search) {
                filterProjectList = allProjectList
            } else {
                const searchProjectIdList = allProjectList.filter((item) => item?.taskDetail?.name.includes(search));
                filterProjectList = searchProjectIdList;
            }

            //暂时设置随机不超过1s的延时，模拟等待
            setTimeout(() => {
                setLoading(false);
                res(filterProjectList);
            }, Math.random() * 1000);
        });
    });
    
    //
    const triggerGetData = useMemoizedFn(async (search?: string): Promise<void> => {

        if (!key) {
            message.error('系统错误，未设置工程id，请联系管理员！');
            return;
        }

        try {
            const dataList = await getData(search);
            setData(dataList);
        } catch (error) {
            message.error((error as Error)?.message || '获取任务失败！');
            setData([]);
        }

        return;
    });

    const deleteData = useMemoizedFn((id: string | string[]): boolean => {
        if (!key) {
            message.error('系统错误，未设置工程id，请联系管理员！');
            return false;
        }
        //首先判断浏览器是否支持localStorage
        try {
            judgeLocalStorageisAvailable()
        } catch (error) {
            message.error((error as Error).message)
            return false;
        }

        if (!id) {
            message.error('系统错误，未设置id，请联系管理员！');
            return false;
        }

        let projectIdList: TaskDataType = [];

        try {
            projectIdList = getAndParseValueInLoaclStorage(key);
        } catch (error) {
            message.error((error as Error).message);
            return false;
        }

        //过滤掉当前删除的id
        const filterProjectList = projectIdList.filter((item) => {
            if (Array.isArray(id)) {
                return !id.includes(item?.taskDetail?.id)
            } else {
                return item?.taskDetail?.id !== id
            }
        });

        try {
            stringifyAndSetValueInLocalStorage(filterProjectList, key);
            // triggerGetData();
        } catch (error) {
            message.error((error as Error).message);
            return false;
        }

        // localStorage.removeItem(id);

        return true;

    });

    const createOrModifiedData = useMemoizedFn((
        newValue: TaskDataType[number],
        id: string,
    ) => new Promise<boolean>((res, rej) => {
        if (!key) return rej(new Error('系统错误，未设置工程id，请联系管理员！'));

        //首先判断浏览器是否支持localStorage
        try {
            judgeLocalStorageisAvailable()
        } catch (error) {
            return rej(error);
        }

        if (!id) {
            return rej(new Error('系统错误，未设置计算任务id，请联系管理员！'));
        }

        setLoading(true);

        let historyProjectIdList: TaskDataType = [];

        try {
            historyProjectIdList = getAndParseValueInLoaclStorage(key);
        } catch (error) {
            return rej(error);
        }

        const name = newValue?.name;
        const isExistSameName = historyProjectIdList.some((item) => item?.name === name && item?.taskDetail?.id !== id);

        if (isExistSameName) {
            return rej(new Error('计算任务名称重复，请重新命名！'));
        }

        const existIdIndex = historyProjectIdList.findIndex((item) => item?.taskDetail?.id === id);

        let newProjectIdList = [];

        if (existIdIndex !== -1) {
            historyProjectIdList[existIdIndex] = {
                ...newValue,
            };
            newProjectIdList = [...historyProjectIdList];
        } else {
            newProjectIdList = [...historyProjectIdList, {
                ...newValue,
            }]
        }

        try {
            stringifyAndSetValueInLocalStorage(newProjectIdList, key)
        } catch (error) {
            return rej(error);
        }

        // localStorage.setItem(id, JSON.stringify({}));

        //暂时设置随机不超过1s的延时，模拟等待
        setTimeout(() => {
            setLoading(false);
            // triggerGetData();
            return res(true);
        }, Math.random() * 1000);

    }));

    // 在组件挂载时将函数存储到 Recoil 状态中
    useEffect(() => {
        setTriggerGetData(() => triggerGetData);
        setDeleteData(() => deleteData);
        setCreateOrModifiedData(() => createOrModifiedData);
        setGetData(() => getData)
    }, [
        triggerGetData,
        deleteData,
        createOrModifiedData,
        setTriggerGetData,
        setDeleteData,
        setCreateOrModifiedData,
        setGetData,
        getData,
    ]);



    return {
        triggerGetData,
        deleteData,
        createOrModifiedData,
        data,
        loading,
        getData,
    };



}