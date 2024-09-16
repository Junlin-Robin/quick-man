import { isEmpty } from "lodash";

import { calculateISOFractionationFromFrequencyByCASTEP } from "@/packages/castep/calculation/isotope-fractionation";
import { calculateForceConstantFromFrequency } from "@/packages/castep/calculation/force-constant";

import { CALCULATION_SERVICE, TASK_CALCULATION_STATUS } from '../../../constants';

import type { TaskDataType } from '../../../models';

import { linearRegression, linearRegressionLine, rSquared } from 'simple-statistics';
import decimal from 'decimal.js';

import { getEnv } from '@/utils/get-env';


//环境参数
const env = getEnv();


interface CalculateWorkerEvent {
    data: {
        waitToCalculateList: TaskDataType;
        calculateType: CALCULATION_SERVICE;
        TGradient?: { kelvin: string; celsius: string }[];
    }[]
}

/**
 * 格式化参数
 * @param waitToCalculateTasks 
 * @param type 
 * @returns 
 */
function formatParams(waitToCalculateTasks: TaskDataType, type: CALCULATION_SERVICE) {
    if (!waitToCalculateTasks || isEmpty(waitToCalculateTasks)) {
        return [];
    }
    //频率和力常数目前入参一致，暂时处理
    //后期迭代注意这里换成 switch 更直观
    if (type === CALCULATION_SERVICE.ISOTOPE_FRACTIONATION || type === CALCULATION_SERVICE.FORCE_CONSTANT) {
        const calculateParamList = waitToCalculateTasks.map((task) => {
            return {
                freq: {
                    heavy: task.heavyFreqInfo?.frequency as string[][],
                    light: task.lightFreqInfo?.frequency as string[][],
                },
                isotopeNumber: task.isotopeSetting?.isotopeNumber as number,
                massSetting: task.isotopeSetting?.massSetting,
                proportions: task.heavyFreqInfo?.proportions,
            }
        });
        return calculateParamList || [];
    }
    return [];
}

interface CalculatParams {
    freq: {
        heavy: string[][];
        light: string[][];
    };
    isotopeNumber: number;
    massSetting: {
        heavy: string;
        light: string;
    };
    proportions: string[];
    TGradient: { kelvin: string; celsius: string }[];
}

// 计算分馏值
async function doFractionationCalculate(params: { calculateParamList: CalculatParams[], waitToCalculateTasks: TaskDataType }) {
    const { calculateParamList, waitToCalculateTasks } = params || {};
    let calculatedTasks: TaskDataType = [];
    /**判断计算是否成功 */
    let isSuccess = false;
    try {
        const calculateResults = await calculateISOFractionationFromFrequencyByCASTEP(calculateParamList);
        calculatedTasks = waitToCalculateTasks.map((task, index) => {
            //计算线性回归方程
            const fractionationInfo = calculateResults[index];
            const fractionationDataList = fractionationInfo.map((item) => [
                parseFloat(decimal.pow(10, 6).div(decimal.pow(item?.T?.kelvin, 2)).toString()), 
                parseFloat(item?.fractionation),
            ]);
            fractionationDataList.unshift([0, 0])
            const { m, b } = linearRegression(fractionationDataList);
            const r2 = rSquared(fractionationDataList, linearRegressionLine({ m, b }));
            return {
                ...task || {},
                updateTime: Date.now(),
                calculationStatus: TASK_CALCULATION_STATUS.SUCCESS,
                isotopeFractionation: calculateResults[index],
                fractionationFittingLine: {
                    k: new decimal(m).toFixed(4),
                    b: new decimal(b).toFixed(4),
                    r2: new decimal(r2).toFixed(4),
                }
            }
        });
        isSuccess = true;
    } catch (error) {
        calculatedTasks = waitToCalculateTasks.map((task) => ({
            ...task,
            taskDetail: {
                ...task || {},
                updateTime: Date.now(),
                calculationStatus: TASK_CALCULATION_STATUS.FAILED,
            },
        }));
    }
    return {
        calculatedTasks,
        isSuccess,
    };
}

async function doForceConstantCalculate(params: { calculateParamList: CalculatParams[], waitToCalculateTasks: TaskDataType }) {
    const { calculateParamList, waitToCalculateTasks } = params || {};
    let calculatedTasks: TaskDataType = [];
    /**判断计算是否成功 */
    let isSuccess = true;
    try {
        const calculateResults = await calculateForceConstantFromFrequency(calculateParamList);
        calculatedTasks = waitToCalculateTasks.map((task, index) => ({
            ...task || {},
            updateTime: Date.now(),
            calculationStatus: TASK_CALCULATION_STATUS.SUCCESS,
            forceConstant: calculateResults[index]?.forceConstant,
        }));
    } catch (error) {
        calculatedTasks = waitToCalculateTasks.map((task) => ({
            ...task,
            updateTime: Date.now(),
            calculationStatus: TASK_CALCULATION_STATUS.FAILED,
        }));
        isSuccess = false;
    }
    return {
        calculatedTasks,
        isSuccess,
    };
}

//单计算任务最小实现
async function singleImpl(data: CalculateWorkerEvent['data'][number]) {
    const { waitToCalculateList, calculateType, TGradient = [] } = data || {};
    if (!waitToCalculateList || isEmpty(waitToCalculateList)) {
       return ({
            calculatedTasks: [],
            isSuccess: true,
        });
    }
    const params = formatParams(waitToCalculateList, calculateType);
    if (calculateType === CALCULATION_SERVICE.FORCE_CONSTANT) {
        const { calculatedTasks, isSuccess } = await doForceConstantCalculate({
            calculateParamList: params.map((item) => ({ ...item, TGradient })),
            waitToCalculateTasks: waitToCalculateList
        });
        return ({
            calculatedTasks,
            isSuccess,
        });
    } else if (calculateType === CALCULATION_SERVICE.ISOTOPE_FRACTIONATION) {
        const { calculatedTasks, isSuccess } = await doFractionationCalculate({
            calculateParamList: params.map((item) => ({ ...item, TGradient })),
            waitToCalculateTasks: waitToCalculateList
        })
        return ({
            calculatedTasks,
            isSuccess,
        });
    } else {
        return ({
            calculatedTasks: [],
            isSuccess: true,
        });
    }
}

self.onmessage = async (event: CalculateWorkerEvent) => {
    const data = event.data;

    //用于打印信息
    if (env === 'development') {
        console.log('开始计算同位素分馏...');
        console.log('计算参数：', data);
        console.time('计算同位素用时：')
    } else if (env === 'production') {
        console.log('开始计算同位素分馏...');
        console.time('计算同位素用时：')
    }

    const resAll = await Promise.all(data.map((item) => singleImpl(item)));

    if (env === 'development' || env === 'production') console.timeEnd('计算同位素用时：');

    self.postMessage(resAll);
};