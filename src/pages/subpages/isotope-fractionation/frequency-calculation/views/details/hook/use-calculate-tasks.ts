import { useState } from "react";
import { message } from 'antd';
import { isEmpty, isEqual, isNil, sortBy } from "lodash";
import type { CalculationResults } from '../models';
import type { TaskDataType } from '../../../models';
import { CALCULATION_SERVICE, TASK_CALCULATION_STATUS } from '../../../constants';

// import {
//     judgeLocalStorageisAvailable,
//     getAndParseValueInLoaclStorage,
//     stringifyAndSetValueInLocalStorage,
// } from "@/utils/operate-storage";

import {
    DATA_BASE_NAME, INITIAL_DATA_BASE_VERSION, DATA_BASE_INDEX,
} from '../../../constants';

import Dexie from 'dexie';

// import { calculateISOFractionationFromFrequencyByCASTEP } from "@/packages/castep/calculation/isotope-fractionation";
// import { calculateForceConstantFromFrequency } from "@/packages/castep/calculation/force-constant";


export default function useCalculateTasks(key: string) {
    const [loading, setLoading] = useState(false);
    const [calculationResults, setCalculationResults] = useState<CalculationResults>([]);

    const calculateWorker = new Worker(new URL('../worker/calculate.ts', import.meta.url), { type: 'module' });

    const db = new Dexie(DATA_BASE_NAME);

    // 获取当前版本号
    const currentVersion = db.verno;

    if (key) {
        // 定义数据库的版本和对象存储
        db.version(currentVersion || INITIAL_DATA_BASE_VERSION).stores({ [key]: DATA_BASE_INDEX });
    } else {
        message.error('系统错误，未设置工程id，请联系管理员！');
    }

    async function calculateAndSaveFrequency(params: {
        taskIdList: string[];
        // onlyCalculateSaveToIndexDB?: boolean;
        TGradient?: { kelvin: string; celsius: string }[];
    }): Promise<boolean> {
        //解构参数
        const { taskIdList, TGradient } = params || {};
        /**没有传计算任务id，则直接设置空数组 */
        if (isNil(taskIdList) || isEmpty(taskIdList)) {
            setCalculationResults([]);
            return true;
        }

        if (!key) {
            message.error('系统错误，未设置工程id，请联系管理员！');
            return false;
        }

        setLoading(true);

        const storageAllTasksInfo: TaskDataType = await db.table(key).toArray();
        const waitToCalculateTasks: TaskDataType = [];
        const alreadyCalculatedTasks: TaskDataType = [];


        taskIdList?.forEach((taskId) => {
            const taskInfo = storageAllTasksInfo.find((item) => item.id === taskId);
            if (isNil(taskInfo)) return;
            const existIsotopeFractionation = taskInfo?.isotopeFractionation;
            const existTemperature = existIsotopeFractionation?.map((item) => item.T.kelvin);
            const TGradientKelvin = TGradient?.map((item) => item.kelvin);
            const taskStatus = taskInfo?.calculationStatus;
            /**待计算、或者频率存储值为空重新计算 */
            const isSameTGradient = isEqual(sortBy(existTemperature), sortBy(TGradientKelvin));
            const isNeedCalculate = isNil(existIsotopeFractionation) || isEmpty(existIsotopeFractionation) || !isSameTGradient;
            console.log({ isSameTGradient, existTemperature, TGradient, isNeedCalculate })
            const isTaskError = taskStatus === TASK_CALCULATION_STATUS.FAILED;
            /**计算失败的不再进行计算 */
            if (!isTaskError && isNeedCalculate) waitToCalculateTasks.push(taskInfo);
            else alreadyCalculatedTasks.push(taskInfo);
        });

        calculateWorker.postMessage([{
            waitToCalculateList: waitToCalculateTasks,
            calculateType: CALCULATION_SERVICE.ISOTOPE_FRACTIONATION,
            TGradient,
        }]);

        const [{ calculatedTasks, isSuccess }] = await new Promise<{
            calculatedTasks: TaskDataType, isSuccess: boolean
        }[]>((res) => {
            // calculateWorker.onmessage = (e) => {
            //     res(e.data);
            // };
            const handleMessage = (e) => {
                console.log('接受同位素计算消息', { info: e.data });
                calculateWorker.removeEventListener('message', handleMessage)
                res(e.data);
            };
            calculateWorker.addEventListener('message', handleMessage);
            // calculateWorker.postMessage({
            //     waitToCalculateList: waitToCalculateIsotopeFractionationTasks,
            //     calculateType: CALCULATION_SERVICE.ISOTOPE_FRACTIONATION,
            //     TGradient: [temperature],
            // });
        });


        const newAllTasksInfo = storageAllTasksInfo.map((task) => {
            const newCalculateTask = calculatedTasks.find((i) => i.id === task.id);
            if (isNil(newCalculateTask)) return task;
            else return newCalculateTask;
        });

        await db.table(key).bulkPut(newAllTasksInfo);

        setCalculationResults(calculatedTasks.concat(alreadyCalculatedTasks).map((task) => {
            const taskId = task.id;
            const taskName = task.name;
            const frequencyInfo = task.isotopeFractionation || [];
            const forceConstant = task.forceConstant;
            const isPhonon = task.isPhonon;
            const isotopeDetailSetting = task.isotopeSetting;
            const fractionationFittingLine = task.fractionationFittingLine;
            return {
                taskId,
                taskName,
                frequencyInfo,
                forceConstant,
                fractionationFittingLine,
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

    async function calculateAndSaveForceConstant(params: {
        taskIdList: string[];
        temperature?: { kelvin: string; celsius: string };
    }): Promise<boolean> {
        const { taskIdList, temperature = { kelvin: '273.15', celsius: '0' } } = params || {};
        console.log({ taskIdList, temperature })
        /**没有传计算任务id，则直接设置空数组 */
        if (isNil(taskIdList) || isEmpty(taskIdList)) {
            setCalculationResults([]);
            return true;
        }

        if (!key) {
            message.error('系统错误，未设置工程id，请联系管理员！');
            return false;
        }

        setLoading(true);

        const storageAllTasksInfo: TaskDataType = await db.table(key).toArray();


        const waitToCalculateForceConstantTasks: TaskDataType = [];
        const waitToCalculateIsotopeFractionationTasks: TaskDataType = [];
        const alreadyCalculatedTasks: TaskDataType = [];


        taskIdList?.forEach((taskId) => {
            const taskInfo = storageAllTasksInfo.find((item) => item.id === taskId);
            console.log({ taskInfo })
            if (isNil(taskInfo)) return;
            const existIsotopeFractionation = taskInfo.isotopeFractionation;
            const existForceConstant = taskInfo.forceConstant;
            const taskStatus = taskInfo?.calculationStatus;
            const existFractionation_temperature = existIsotopeFractionation?.map((item) => item.T.kelvin);
            const hasSameTemperature = temperature && existFractionation_temperature?.includes(String(temperature?.kelvin));
            /**待计算、分馏、力常数为空都需要重新计算 */
            const isNeedCalculateFractionation = isEmpty(existIsotopeFractionation) || isNil(existIsotopeFractionation) || !hasSameTemperature;
            const isNeedCalculateForceConstant = isNil(existForceConstant);
            const isTaskError = taskStatus === TASK_CALCULATION_STATUS.FAILED;
            console.log({ isNeedCalculateForceConstant })
            if (!isTaskError) {
                // 同位素分馏未计算的单独处理，会先执行计算分馏后再计算力常数
                if (isNeedCalculateFractionation) {
                    waitToCalculateIsotopeFractionationTasks.push(taskInfo);
                }
                if (isNeedCalculateForceConstant) {
                    waitToCalculateForceConstantTasks.push(taskInfo);
                } else {
                    alreadyCalculatedTasks.push(taskInfo);
                }
            } else {
                alreadyCalculatedTasks.push(taskInfo);
            }
        });
        console.log(1)

        console.log({ waitToCalculateForceConstantTasks, waitToCalculateIsotopeFractionationTasks, alreadyCalculatedTasks })


        console.log(2)


        const [{ calculatedTasks: ISOFractionationRes, isSuccess }, {calculatedTasks: yym, isSuccess: y}] = await new Promise<{
            calculatedTasks: TaskDataType, isSuccess: boolean
        }[]>((res) => {
            const handleMessage = (e) => {
                console.log('接受同位素计算消息', { info: e.data });
                calculateWorker.removeEventListener('message', handleMessage)
                res(e.data);
            };
            calculateWorker.addEventListener('message', handleMessage);
            calculateWorker.postMessage([{
                waitToCalculateList: waitToCalculateIsotopeFractionationTasks,
                calculateType: CALCULATION_SERVICE.ISOTOPE_FRACTIONATION,
                TGradient: [temperature],
            }, {
                waitToCalculateList: waitToCalculateForceConstantTasks,
                calculateType: CALCULATION_SERVICE.FORCE_CONSTANT,
            }]);
        });
        console.log(3)


        // const allIsotopeFractionation = taskIdList.map((taskId) => {
        //     const temp = ISOFractionationRes.find((item) => item.id === taskId);
        //     if (temp) return temp?.isotopeFractionation?.find((i) => i.T.kelvin === temperature.kelvin);
        //     const exist = storageAllTasksInfo.find((item) => item.id === taskId);
        //     return exist?.isotopeFractionation?.find((i) => i.T.kelvin === temperature.kelvin);
        // });
        console.log(4)

        // console.log({allIsotopeFractionation, ISOFractionationRes})

        // if (!isEmpty(waitToCalculateIsotopeFractionationTasks)) {
        //     const isSuccess = await calculateAndSaveFrequency({
        //         taskIdList: waitToCalculateIsotopeFractionationTasks.map((item) => item.id),
        //         // onlyCalculateSaveToIndexDB: false,
        //     });
        //     if (isSuccess) return calculateAndSaveForceConstant({ taskIdList });
        //     else {
        //         setCalculationResults([]);
        //         return false;
        //     }
        // }


        console.log(5)


        // const { calculatedTasks: yym, isSuccess } = await new Promise<{
        //     calculatedTasks: TaskDataType, isSuccess: boolean
        // }>((res) => {
        //     const handleMessage = (e) => {
        //         console.log('接受力常数计算消息', {yym: e.data})
        //         calculateWorker.removeEventListener('message', handleMessage)
        //         res(e.data);
        //     };
        //     calculateWorker.addEventListener('message', handleMessage);
        //     calculateWorker.onmessage = (e) => {
        //         console.log('接受力常数计算消息', {yym: e.data})
        //         res(e.data);
        //     }
        //     calculateWorker.postMessage({
        //         waitToCalculateList: waitToCalculateForceConstantTasks,
        //         calculateType: CALCULATION_SERVICE.FORCE_CONSTANT,
        //     });
        // });

        console.log(6)

        console.log({ yym, alreadyCalculatedTasks })


        const newAllTasksInfo = storageAllTasksInfo.map((task) => {
            const newCalculateTask = yym.find((i) => i.id === task.id);
            if (!isNil(newCalculateTask)) return newCalculateTask;
            return task;
        });

        await db.table(key).bulkPut(newAllTasksInfo);



        setCalculationResults(yym.concat(alreadyCalculatedTasks).map((task) => {
            const taskId = task.id;
            const taskName = task.name;
            const temp = ISOFractionationRes.find((item) => item.id === taskId);
            const exist = storageAllTasksInfo.find((item) => item.id === taskId);
            const frequencyInfo = temp ? temp?.isotopeFractionation?.find((c) => c.T.kelvin === temperature.kelvin) : exist?.isotopeFractionation?.find((c) => c.T.kelvin === temperature.kelvin);
            const forceConstant = task.forceConstant;
            const isPhonon = task.isPhonon;
            const isotopeDetailSetting = task.isotopeSetting;
            const fractionationFittingLine = task.fractionationFittingLine;
            console.log({ frequencyInfo })
            return {
                taskId,
                taskName,
                frequencyInfo: [frequencyInfo!],
                forceConstant,
                fractionationFittingLine,
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

        setLoading(false);
        return isSuccess && y;


        // return new Promise((res) => {
        //     setTimeout(() => {
        //         setLoading(false);
        //         res(isSuccess);
        //     }, Math.random() * 2000);
        // })

    }

    return {
        loading,
        calculationResults,
        setCalculationResults,
        calculateAndSaveFrequency,
        calculateAndSaveForceConstant,
    }
}