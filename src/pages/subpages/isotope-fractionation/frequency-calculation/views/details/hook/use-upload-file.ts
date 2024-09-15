import { useEffect } from "react";
import { message } from 'antd';
import { useSetRecoilState, useRecoilState } from 'recoil';

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

import {
    DATA_BASE_NAME, INITIAL_DATA_BASE_VERSION, DATA_BASE_INDEX,
} from '../../../constants';

import Dexie from 'dexie';
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

    const db = new Dexie(DATA_BASE_NAME);

    // 获取当前版本号
    const currentVersion = db.verno;

    if (key) {
        // 定义数据库的版本和对象存储
        db.version(currentVersion || INITIAL_DATA_BASE_VERSION).stores({ [key]: DATA_BASE_INDEX });
    } else {
        message.error('系统错误，未设置工程id，请联系管理员！');
    }


    //获取工程信息,直接得到所有任务列表
    const getData = useMemoizedFn((search?: string): Promise<TaskDataType> => {
        return new Promise((res, rej) => {
            if (!key) {
                return rej(new Error('系统错误，未设置工程id，请联系管理员！'));
            }

            setLoading(true);

            db.table(key)?.filter((dataItem) => {
                if (search) return dataItem?.taskDetail?.name.includes(search);
                return true;
            })?.toArray().then((result) => {
                //暂时设置随机不超过1s的延时，模拟等待
                setTimeout(() => {
                    setLoading(false);
                    res(result);
                }, Math.random() * 1000);
            }).catch((error) => {
                setLoading(false);
                rej(error || new Error('查询计算任务失败！'));
            });

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
            setData(dataList || []);
        } catch (error) {
            message.error((error as Error)?.message || '获取任务失败！');
            setData([]);
        }

        return;
    });

    const deleteData = useMemoizedFn(async (id: string | string[]): Promise<boolean> => {
        if (!key) {
            message.error('系统错误，未设置工程id，请联系管理员！');
            return false;
        }

        if (!id) {
            message.error('系统错误，未设置计算任务id，请联系管理员！');
            return false;
        }

        try {
            await db.table(key)?.bulkDelete(Array.isArray(id) ? id : [id]);
            return true;
        } catch (error) {
            return false;
        }

    });

    const createOrModifiedData = useMemoizedFn((
        newValue: TaskDataType[number],
        id: string,
    ) => new Promise<boolean>((res, rej) => {
        if (!key) return rej(new Error('系统错误，未设置工程id，请联系管理员！'));


        if (!id) {
            return rej(new Error('系统错误，未设置计算任务id，请联系管理员！'));
        }

        setLoading(true);


        db.table(key).get(id).then((result) => {
            if (result) {
                db.table(key).update(id, newValue);
            } else {
                db.table(key).add(newValue);
            }
            //暂时设置随机不超过1s的延时，模拟等待
            setTimeout(() => {
                setLoading(false);
                return res(true);
            }, Math.random() * 1000);
        }).catch((error) => {
            setLoading(false);
            return rej(error || new Error('系统错误，请联系管理员'));
        });


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