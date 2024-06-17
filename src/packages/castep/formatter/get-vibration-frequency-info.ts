import {
    IR_OR_RAMAN_ACTIVE,
    regexVibrationFrequencyMatrix,
    VIBRATION_FREQUENCY_TABLE_HEADERS,
    VIBRATION_FREQUENCY_TABLE_HEADERS_ENUM,
} from './constants';

import { judgeIsSupport, judgeIsCalculateRaman } from './judgement';

interface ReturnInfo {
    frequency: string[];
    ir: string[];
    irActive: boolean[];
    raman: string[];
    ramanActive: boolean[];
}

/**
 * 获取castep文件中频率矩阵信息
 * @param text castep文件|文件列表
 * @returns {Array} frequency-振动频率；ir-红外强度；irActive-是否有红外活性；raman-拉曼强度；ramanActive-是否有拉曼活性
 */
export default function getVibrationFrequencyInfo(text: string): Promise<ReturnInfo>;
export default function getVibrationFrequencyInfo(text: string[]): Promise<ReturnInfo[]>;
export default function getVibrationFrequencyInfo(text: string | string[]) {
    if (Array.isArray(text)) return Promise.all(text.map((textItem) => getVibrationFrequencyInfo(textItem))) //判断如果是文件列表，则依次处理返回

    return new Promise((res, rej) => {
        //判断是否支持版本信息
        const { isSupport, message } = judgeIsSupport(text);
        if (!isSupport) rej(new Error(message));


        //获取频率矩阵信息
        const vibrationFrequencyMatchMatrix = text.match(regexVibrationFrequencyMatrix) || []; //匹配数组
        const isCalculateRaman = judgeIsCalculateRaman(text); //判断是否计算了拉曼频率
        const FILTER_VIBRATION_FREQUENCY_TABLE_HEADERS = isCalculateRaman ?
            VIBRATION_FREQUENCY_TABLE_HEADERS :
            VIBRATION_FREQUENCY_TABLE_HEADERS.filter((header) => header !== VIBRATION_FREQUENCY_TABLE_HEADERS_ENUM.RAMAN);
        const vibrationFrequencyMatrixMap: Map<string, string[]> = new Map(FILTER_VIBRATION_FREQUENCY_TABLE_HEADERS.map((key) => [key, []])); //
        vibrationFrequencyMatchMatrix.forEach((item) => {
            const itemInfo = item.split(/\s+/).filter((v) => v !== '+');
            FILTER_VIBRATION_FREQUENCY_TABLE_HEADERS.forEach((key, index) => {
                const keyValue = vibrationFrequencyMatrixMap.get(key) || [];
                vibrationFrequencyMatrixMap.set(key, [...keyValue, itemInfo[index]]);
            });
        })

        const FREQUENCY = vibrationFrequencyMatrixMap.get(VIBRATION_FREQUENCY_TABLE_HEADERS_ENUM.FREQUENCY) || [];
        const IR = vibrationFrequencyMatrixMap.get(VIBRATION_FREQUENCY_TABLE_HEADERS_ENUM.IR) || [];
        const IR_ACTIVE = vibrationFrequencyMatrixMap.get(VIBRATION_FREQUENCY_TABLE_HEADERS_ENUM.IR_ACTIVE) || [];
        const RAMAN = vibrationFrequencyMatrixMap.get(VIBRATION_FREQUENCY_TABLE_HEADERS_ENUM.RAMAN) || [];
        const RAMAN_ACTIVE = vibrationFrequencyMatrixMap.get(VIBRATION_FREQUENCY_TABLE_HEADERS_ENUM.RAMAN_ACTIVE) || [];

        res({
            frequency: FREQUENCY,
            ir: IR,
            irActive: IR_ACTIVE.map((item) => IR_OR_RAMAN_ACTIVE[item as ('N' | 'Y')]), //转化为布尔值
            raman: RAMAN,
            ramanActive: RAMAN_ACTIVE.map((item) => IR_OR_RAMAN_ACTIVE[item as ('N' | 'Y')]), //转化为布尔值
        })
    });

}
