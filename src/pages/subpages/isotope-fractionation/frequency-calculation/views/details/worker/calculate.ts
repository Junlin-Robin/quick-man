import { isEmpty } from "lodash";

import { calculateISOFractionationFromFrequencyByCASTEP } from "@/packages/castep/calculation/isotope-fractionation";
import { calculateForceConstantFromFrequency } from "@/packages/castep/calculation/force-constant";

import { CALCULATION_SERVICE, TASK_CALCULATION_STATUS } from '../../../constants';

import type { TaskDataType } from '../../../models';

interface CalculateWorkerEvent {
    data: {
        waitToCalculateList: TaskDataType;
        calculateType: CALCULATION_SERVICE;
    }
}

function formatParams(waitToCalculateTasks: TaskDataType, type: CALCULATION_SERVICE) {
    if (!waitToCalculateTasks || isEmpty(waitToCalculateTasks)) {
        return [];
    }
    if (type === CALCULATION_SERVICE.ISOTOPE_FRACTIONATION || type === CALCULATION_SERVICE.FORCE_CONSTANT) {
        const calculateParamList = waitToCalculateTasks.map((task) => {
            const frequencyInfo = task.taskDetail?.calculationParams?.frequencyInfo;
            const isotopeSetting = task.taskDetail?.calculationParams?.cellInfo?.isotopeSetting;
            return {
                freq: {
                    heavy: frequencyInfo?.heavy?.frequency as string[],
                    light: frequencyInfo?.light?.frequency as string[],
                },
                cell: {
                    isotopeNumber: isotopeSetting?.isotopeNumber as number,
                    massSetting: isotopeSetting?.massSetting,
                }
            }
        });
        return calculateParamList || [];
    }
    return [];
}

interface CalculatParams {
    freq: {
        heavy: string[];
        light: string[];
    };
    cell: {
        isotopeNumber: number;
        massSetting: {
            heavy: string;
            light: string;
        };
    };
}
async function doFractionationCalculate(params: { calculateParamList: CalculatParams[], waitToCalculateTasks: TaskDataType }) {
    const { calculateParamList, waitToCalculateTasks } = params || {};
    let calculatedTasks: TaskDataType = [];
    /**判断计算是否成功 */
    let isSuccess = true;
    try {
        const calculateResults = await calculateISOFractionationFromFrequencyByCASTEP(calculateParamList);
        calculatedTasks = waitToCalculateTasks.map((task, index) => ({
            ...task || {},
            taskDetail: {
                ...task.taskDetail,
                updateTime: Date.now(),
                calculationStatus: TASK_CALCULATION_STATUS.SUCCESS,
            },
            taskResult: {
                ...task.taskResult || {},
                isotopeFractionation: calculateResults[index],
            },
        }));
    } catch (error) {
        calculatedTasks = waitToCalculateTasks.map((task) => ({
            ...task,
            taskDetail: {
                ...task.taskDetail || {},
                updateTime: Date.now(),
                calculationStatus: TASK_CALCULATION_STATUS.FAILED,
            },
        }));
        isSuccess = false;
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
            taskDetail: {
                ...task.taskDetail,
                updateTime: Date.now(),
                calculationStatus: TASK_CALCULATION_STATUS.SUCCESS,
            },
            taskResult: {
                ...task.taskResult || {},
                forceConstants: calculateResults[index]?.forceConstant,
            },
        }));
    } catch (error) {
        calculatedTasks = waitToCalculateTasks.map((task) => ({
            ...task,
            taskDetail: {
                ...task.taskDetail || {},
                updateTime: Date.now(),
                calculationStatus: TASK_CALCULATION_STATUS.FAILED,
            },
        }));
        isSuccess = false;
    }
    return {
        calculatedTasks,
        isSuccess,
    };
}

self.onmessage = async (event: CalculateWorkerEvent) => {
    const { waitToCalculateList, calculateType } = event.data || {};
    if (!waitToCalculateList || isEmpty(waitToCalculateList)) {
        self.postMessage({
            calculatedTasks: [],
            isSuccess: true,
        });
    }
    const params = formatParams(waitToCalculateList, calculateType);
    if (calculateType === CALCULATION_SERVICE.FORCE_CONSTANT) {
        const { calculatedTasks, isSuccess } = await doForceConstantCalculate({
            calculateParamList: params,
            waitToCalculateTasks: waitToCalculateList
        })
        self.postMessage({
            calculatedTasks,
            isSuccess,
        });
    } else if (calculateType === CALCULATION_SERVICE.ISOTOPE_FRACTIONATION) {
        const { calculatedTasks, isSuccess } = await doFractionationCalculate({
            calculateParamList: params,
            waitToCalculateTasks: waitToCalculateList
        })
        self.postMessage({
            calculatedTasks,
            isSuccess,
        });
    } else {
        self.postMessage({
            calculatedTasks: [],
            isSuccess: true,
        });
    }

};