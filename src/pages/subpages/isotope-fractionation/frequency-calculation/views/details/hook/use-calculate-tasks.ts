import { useState } from "react";
import { message } from 'antd';
import { isEmpty, isNil } from "lodash";
import type { CalculationResults } from '../models';
import type { TaskDataType } from '../../../models';
import { CALCULATION_SERVICE, TASK_CALCULATION_STATUS } from '../../../constants';

import {
    judgeLocalStorageisAvailable,
    getAndParseValueInLoaclStorage,
    stringifyAndSetValueInLocalStorage,
} from "@/utils/operate-storage";

// import { calculateISOFractionationFromFrequencyByCASTEP } from "@/packages/castep/calculation/isotope-fractionation";
// import { calculateForceConstantFromFrequency } from "@/packages/castep/calculation/force-constant";


export default function useCalculateTasks(key: string) {
    const [loading, setLoading] = useState(false);
    const [calculationResults, setCalculationResults] = useState<CalculationResults>([]);

    const calculateWorker = new Worker(new URL('../worker/calculate.ts', import.meta.url), { type: 'module' });

    async function calculateAndSaveFrequency(taskIdList: string[], isSetCalculationResults: boolean = true): Promise<boolean> {
        console.log('done节点上了')
        /**没有传计算任务id，则直接设置空数组 */
        if (isNil(taskIdList) || isEmpty(taskIdList)) {
            setCalculationResults([]);
            return true;
        }

        if (!key) {
            message.error('系统错误，未设置工程id，请联系管理员！');
            return false;
        }

        //首先判断浏览器是否支持localStorage
        try {
            judgeLocalStorageisAvailable();
        } catch (error) {
            message.error((error as Error).message)
            return false;
            // rej(error);
        }

        setLoading(true);


        let storageAllTasksInfo: TaskDataType = [];

        try {
            storageAllTasksInfo = getAndParseValueInLoaclStorage<TaskDataType>(key);
        } catch (error) {
            message.error((error as Error).message);
            return false;
            // rej(error);
        }

        const waitToCalculateTasks: TaskDataType = [];
        const alreadyCalculatedTasks: TaskDataType = [];


        taskIdList?.forEach((taskId) => {
            const taskInfo = storageAllTasksInfo.find((item) => item.id === taskId);
            if (isNil(taskInfo)) return;
            const existIsotopeFractionation = taskInfo.taskResult?.isotopeFractionation;
            const taskStatus = taskInfo?.taskDetail?.calculationStatus;
            /**待计算、或者频率存储值为空重新计算 */
            const isNeedCalculate = isNil(existIsotopeFractionation) || isEmpty(existIsotopeFractionation);
            const isTaskError = taskStatus === TASK_CALCULATION_STATUS.FAILED;
            /**计算失败的不再进行计算 */
            if (isNeedCalculate && !isTaskError) waitToCalculateTasks.push(taskInfo);
            else alreadyCalculatedTasks.push(taskInfo);
        });

        calculateWorker.postMessage({
            waitToCalculateList: waitToCalculateTasks,
            calculateType: CALCULATION_SERVICE.ISOTOPE_FRACTIONATION,
        });

        const { calculatedTasks, isSuccess } = await new Promise<{
            calculatedTasks: TaskDataType, isSuccess: boolean
        }>((res) => {
            calculateWorker.onmessage = (e) => {
                res(e.data);
            }
        });


        const newAllTasksInfo = storageAllTasksInfo.map((task) => {
            const newCalculateTask = calculatedTasks.find((i) => i.id === task.id);
            if (isNil(newCalculateTask)) return task;
            else return newCalculateTask;
        });

        try {
            stringifyAndSetValueInLocalStorage(newAllTasksInfo, key)
        } catch (error) {
            message.error((error as Error).message);
            return false;
        }

        isSetCalculationResults && setCalculationResults(calculatedTasks.concat(alreadyCalculatedTasks).map((task) => {
            const taskId = task.id;
            const taskName = task.name;
            const frequencyInfo = task.taskResult?.isotopeFractionation?.map((item) => ({
                fractionation: item.fractionation,
                beta: item.beta,
                /**未进行归一化值 */
                RPFR: item.RPFR,
                /**用于数据归类 */
                category: task.id,
                name: task.name,
                T: item.T,
            }));
            const forceConstant = task.taskResult?.forceConstants;
            const isPhonon = task.taskDetail.calculationParams.isPhonon;
            const isotopeDetailSetting = task.taskDetail.calculationParams.cellInfo.isotopeSetting;
            return {
                taskId,
                taskName,
                frequencyInfo,
                forceConstant,
                isotopeSetting: {
                    isotope: isotopeDetailSetting.isotope,
                    isFixed: isotopeDetailSetting.fixedIsotopeNumber !== 0,
                    isotopeNumber: isotopeDetailSetting.isotopeNumber,
                    fixedIsotopeNumber: isotopeDetailSetting.fixedIsotopeNumber,
                    massSetting: isotopeDetailSetting.massSetting,
                    isPhonon,
                },
            }
        }));

        // setTimeout(() => {
        //     setLoading(false);
        //     res(isSuccess);
        // }, Math.random() * 2000);

        setLoading(false);
        return isSuccess;



    }

    async function calculateAndSaveForceConstant(taskIdList: string[]): Promise<boolean> {

        /**没有传计算任务id，则直接设置空数组 */
        if (isNil(taskIdList) || isEmpty(taskIdList)) {
            setCalculationResults([]);
            return true;
        }

        if (!key) {
            message.error('系统错误，未设置工程id，请联系管理员！');
            return false;
        }

        //首先判断浏览器是否支持localStorage
        try {
            judgeLocalStorageisAvailable();
        } catch (error) {
            message.error((error as Error).message)
            return false;
        }
        setLoading(true);

        let storageAllTasksInfo: TaskDataType = [];

        try {
            storageAllTasksInfo = getAndParseValueInLoaclStorage<TaskDataType>(key);
        } catch (error) {
            message.error((error as Error).message);
            return false;
        }

        const waitToCalculateForceConstantTasks: TaskDataType = [];
        const waitToCalculateIsotopeFractionationTasks: TaskDataType = [];
        const alreadyCalculatedTasks: TaskDataType = [];


        taskIdList?.forEach((taskId) => {
            const taskInfo = storageAllTasksInfo.find((item) => item.id === taskId);
            if (isNil(taskInfo)) return;
            const existIsotopeFractionation = taskInfo.taskResult?.isotopeFractionation;
            const existForceConstant = taskInfo.taskResult?.forceConstants;
            const taskStatus = taskInfo?.taskDetail?.calculationStatus;
            /**待计算、分馏、力常数为空都需要重新计算 */
            const isNeedCalculateFractionation = isEmpty(existIsotopeFractionation) || isNil(existIsotopeFractionation);
            const isNeedCalculateForceConstant = isNil(existForceConstant);
            const isTaskError = taskStatus === TASK_CALCULATION_STATUS.FAILED;
            if (!isTaskError) {
                // 同位素分馏未计算的单独处理，会先执行计算分馏后再计算力常数
                if (isNeedCalculateFractionation) {
                    waitToCalculateIsotopeFractionationTasks.push(taskInfo);
                } else if (isNeedCalculateForceConstant) {
                    waitToCalculateForceConstantTasks.push(taskInfo);
                } else {
                    alreadyCalculatedTasks.push(taskInfo);
                }
            } else {
                alreadyCalculatedTasks.push(taskInfo);
            }
        });

        if (!isEmpty(waitToCalculateIsotopeFractionationTasks)) {
            const isSuccess = await calculateAndSaveFrequency(waitToCalculateIsotopeFractionationTasks.map((item) => item.id), false);
            if (isSuccess) return calculateAndSaveForceConstant(taskIdList);
            else {
                setCalculationResults([]);
                return false;
            }
        }


        // const calculateParamList = waitToCalculateTasks.map((task) => {
        //     const frequencyInfo = task.taskDetail?.calculationParams?.frequencyInfo;
        //     const isotopeSetting = task.taskDetail?.calculationParams?.cellInfo?.isotopeSetting;
        //     return {
        //         freq: {
        //             heavy: frequencyInfo?.heavy?.frequency as string[],
        //             light: frequencyInfo?.light?.frequency as string[],
        //         },
        //         cell: {
        //             isotopeNumber: isotopeSetting?.isotopeNumber as number,
        //             massSetting: isotopeSetting?.massSetting,
        //         }
        //     }
        // });

        // let calculatedTasks: TaskDataType = [];
        // /**判断计算是否成功 */
        // let isSuccess = true;
        // try {
        //     const calculateResults = await calculateForceConstantFromFrequency(calculateParamList);
        //     calculatedTasks = waitToCalculateTasks.map((task, index) => ({
        //         ...task || {},
        //         taskDetail: {
        //             ...task.taskDetail,
        //             updateTime: Date.now(),
        //             calculationStatus: TASK_CALCULATION_STATUS.SUCCESS,
        //         },
        //         taskResult: {
        //             ...task.taskResult || {},
        //             forceConstants: calculateResults[index]?.forceConstant,
        //         },
        //     }));
        // } catch (error) {
        //     message.error('同位素分馏计算失败，轻检查上传文件后重新计算！');
        //     calculatedTasks = waitToCalculateTasks.map((task) => ({
        //         ...task,
        //         taskDetail: {
        //             ...task.taskDetail || {},
        //             updateTime: Date.now(),
        //             calculationStatus: TASK_CALCULATION_STATUS.FAILED,
        //         },
        //     }));
        //     isSuccess = false;
        // }

        calculateWorker.postMessage({
            waitToCalculateList: waitToCalculateForceConstantTasks,
            calculateType: CALCULATION_SERVICE.FORCE_CONSTANT,
        });

        const { calculatedTasks, isSuccess } = await new Promise<{
            calculatedTasks: TaskDataType, isSuccess: boolean
        }>((res) => {
            calculateWorker.onmessage = (e) => {
                res(e.data);
            }
        });


        const newAllTasksInfo = storageAllTasksInfo.map((task) => {
            const newCalculateTask = calculatedTasks.find((i) => i.id === task.id);
            if (!isNil(newCalculateTask)) return newCalculateTask;
            return task;
        });

        try {
            stringifyAndSetValueInLocalStorage(newAllTasksInfo, key)
        } catch (error) {
            message.error((error as Error).message);
            return false;
        }

        setCalculationResults(calculatedTasks.concat(alreadyCalculatedTasks).map((task) => {
            const taskId = task.id;
            const taskName = task.name;
            const frequencyInfo = task.taskResult?.isotopeFractionation?.map((item) => ({
                fractionation: item.fractionation,
                beta: item.beta,
                /**未进行归一化值 */
                RPFR: item.RPFR,
                /**用于数据归类 */
                category: task.id,
                name: task.name,
                T: item.T,
            }));
            const forceConstant = task.taskResult?.forceConstants;
            const isPhonon = task.taskDetail.calculationParams.isPhonon;
            const isotopeDetailSetting = task.taskDetail.calculationParams.cellInfo.isotopeSetting;
            return {
                taskId,
                taskName,
                frequencyInfo,
                forceConstant,
                isotopeSetting: {
                    isotope: isotopeDetailSetting.isotope,
                    isFixed: isotopeDetailSetting.fixedIsotopeNumber !== 0,
                    isotopeNumber: isotopeDetailSetting.isotopeNumber,
                    fixedIsotopeNumber: isotopeDetailSetting.fixedIsotopeNumber,
                    massSetting: isotopeDetailSetting.massSetting,
                    isPhonon,
                },
            }
        }));

        // setLoading(false);


        return new Promise((res) => {
            setTimeout(() => {
                setLoading(false);
                res(isSuccess);
            }, Math.random() * 2000);
        })

    }

    return {
        loading,
        calculationResults,
        setCalculationResults,
        calculateAndSaveFrequency,
        calculateAndSaveForceConstant,
    }
}