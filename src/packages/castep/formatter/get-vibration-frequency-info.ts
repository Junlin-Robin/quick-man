import {
    IR_OR_RAMAN_ACTIVE,
    regexGammaVibrationFrequencyMatrix,
    regexVibrationFrequencyProportions,
    regexPhononVibrationFrequencyMatrix,
    VIBRATION_FREQUENCY_TABLE_HEADERS,
    VIBRATION_FREQUENCY_TABLE_HEADERS_ENUM,
} from './constants';

import { judgeIsSupport, judgeIsCalculateRaman, judgeIsCalculatePhonon } from './judgement';

import { isNil, last } from 'lodash';

export interface ReturnInfo {
    frequency: string[][];
    ir: string[];
    irActive: boolean[];
    raman: string[];
    ramanActive: boolean[];
    proportions: string[];
}

/**
 * 
 * @param text 
 * @returns 
 */
function formatterFrequencyInfo(text: string, isPhonon: boolean) {
    const regexProportionInfo = text.match(regexVibrationFrequencyProportions) || [];

    // const q_pt_indexList = regexProportionInfo.map((infoItem) => infoItem.split(/\s+/)?.[2]);
    let q_pt_head = '0';
    //获取频率的比例信息
    /**
     * 这里取平均值，继续改
     */
    const proportions = regexProportionInfo.map((infoItem) => {
        const q_pt_index = infoItem.split(/\s+/)?.[2];
        if (q_pt_index && q_pt_index !== q_pt_head) {
            const proportion = last(infoItem.split(/\s+/));
            q_pt_head = q_pt_index;
            return proportion;
        }
        const proportion = '0';
        return proportion;
    }); 
    //获取所有的频率矩阵信息
    const vibrationFrequencyMatchMatrix_All = text.match(isPhonon ? regexPhononVibrationFrequencyMatrix : regexGammaVibrationFrequencyMatrix) || []; //匹配数组

    if (vibrationFrequencyMatchMatrix_All.length % proportions.length !== 0) throw new Error('频率比例信息正则匹配出错，轻检查文件或者联系管理员～');

    //每一套频率的数量
    const vibrationFrequencyMatrix_EachLength = vibrationFrequencyMatchMatrix_All.length / proportions.length;

    const isCalculateRaman = judgeIsCalculateRaman(text); //判断是否计算了拉曼频率
    const FILTER_VIBRATION_FREQUENCY_TABLE_HEADERS = isCalculateRaman ?
        VIBRATION_FREQUENCY_TABLE_HEADERS :
        VIBRATION_FREQUENCY_TABLE_HEADERS.filter((header) => header !== VIBRATION_FREQUENCY_TABLE_HEADERS_ENUM.RAMAN);
    const vibrationFrequencyMatrixMap: Map<string, string[]> = new Map(FILTER_VIBRATION_FREQUENCY_TABLE_HEADERS.map((key) => [key, []]));
    vibrationFrequencyMatchMatrix_All.forEach((item) => {
        const itemInfo = item.split(/\s+/).filter((v) => v !== '+');
        FILTER_VIBRATION_FREQUENCY_TABLE_HEADERS.forEach((key, index) => {
            if (isNil(itemInfo[index])) return;
            const keyValue = vibrationFrequencyMatrixMap.get(key) || [];
            vibrationFrequencyMatrixMap.set(key, [...keyValue, itemInfo[index]]);
        });
    });

    const frequency: string[][] = [];
    const frequencyMatrix_All: string[] = vibrationFrequencyMatrixMap.get(VIBRATION_FREQUENCY_TABLE_HEADERS_ENUM.FREQUENCY) || [];

    proportions.forEach((_, index) => {
        const startIndex = index * vibrationFrequencyMatrix_EachLength;
        const endIndex = (index + 1) * vibrationFrequencyMatrix_EachLength;
        frequency.push(frequencyMatrix_All.slice(startIndex, endIndex));
    });

    const FREQUENCY = frequency;
    const IR = vibrationFrequencyMatrixMap.get(VIBRATION_FREQUENCY_TABLE_HEADERS_ENUM.IR) || [];
    const IR_ACTIVE = vibrationFrequencyMatrixMap.get(VIBRATION_FREQUENCY_TABLE_HEADERS_ENUM.IR_ACTIVE) || [];
    const RAMAN = vibrationFrequencyMatrixMap.get(VIBRATION_FREQUENCY_TABLE_HEADERS_ENUM.RAMAN) || [];
    const RAMAN_ACTIVE = vibrationFrequencyMatrixMap.get(VIBRATION_FREQUENCY_TABLE_HEADERS_ENUM.RAMAN_ACTIVE) || [];

    return ({
        frequency: FREQUENCY,
        ir: IR,
        irActve: IR_ACTIVE,
        raman: RAMAN,
        ramanActive: RAMAN_ACTIVE,
        proportions,
    })
}

/**
 * 获取castep文件中频率矩阵信息
 * @param text castep文件|文件列表
 * @returns {Array} frequency-振动频率；ir-红外强度；irActive-是否有红外活性；raman-拉曼强度；ramanActive-是否有拉曼活性
 */
export function getVibrationFrequencyInfo(text: string): Promise<ReturnInfo>;
export function getVibrationFrequencyInfo(text: string[]): Promise<ReturnInfo[]>;
export function getVibrationFrequencyInfo(text: string | string[]) {
    if (Array.isArray(text)) return Promise.all(text.map((textItem) => getVibrationFrequencyInfo(textItem))) //判断如果是文件列表，则依次处理返回

    return new Promise((res, rej) => {
        //判断是否支持版本信息
        const { isSupport, message } = judgeIsSupport(text);
        if (!isSupport) rej(new Error(message));

        //判断计算类型是否是声子频率
        const isPhonon = judgeIsCalculatePhonon(text);

        // /**
        // * 声子频率处理方式，待补充！！！！！！！！
        // * ！！！！！！！1
        // * ！！！！！！！
        // */
        // if (isPhonon) {
        //     const ress = text.match(regexPhononVibrationFrequencyMatrix);
        //     // for (const res of ress) {
        //     //     console.log('aa', res[1])

        //     // }
        //     console.log({ ress })
        //     // rej(new Error('不支持声子'));
        // }


        // //获取频率矩阵信息
        // const vibrationFrequencyMatchMatrix = text.match(regexGammaVibrationFrequencyMatrix) || []; //匹配数组
        // console.log({ vibrationFrequencyMatchMatrix })
        // const isCalculateRaman = judgeIsCalculateRaman(text); //判断是否计算了拉曼频率
        // const FILTER_VIBRATION_FREQUENCY_TABLE_HEADERS = isCalculateRaman ?
        //     VIBRATION_FREQUENCY_TABLE_HEADERS :
        //     VIBRATION_FREQUENCY_TABLE_HEADERS.filter((header) => header !== VIBRATION_FREQUENCY_TABLE_HEADERS_ENUM.RAMAN);
        // const vibrationFrequencyMatrixMap: Map<string, string[]> = new Map(FILTER_VIBRATION_FREQUENCY_TABLE_HEADERS.map((key) => [key, []]));
        // vibrationFrequencyMatchMatrix.forEach((item) => {
        //     const itemInfo = item.split(/\s+/).filter((v) => v !== '+');
        //     FILTER_VIBRATION_FREQUENCY_TABLE_HEADERS.forEach((key, index) => {
        //         const keyValue = vibrationFrequencyMatrixMap.get(key) || [];
        //         vibrationFrequencyMatrixMap.set(key, [...keyValue, itemInfo[index]]);
        //     });
        // })

        // const FREQUENCY = vibrationFrequencyMatrixMap.get(VIBRATION_FREQUENCY_TABLE_HEADERS_ENUM.FREQUENCY) || [];
        // const IR = vibrationFrequencyMatrixMap.get(VIBRATION_FREQUENCY_TABLE_HEADERS_ENUM.IR) || [];
        // const IR_ACTIVE = vibrationFrequencyMatrixMap.get(VIBRATION_FREQUENCY_TABLE_HEADERS_ENUM.IR_ACTIVE) || [];
        // const RAMAN = vibrationFrequencyMatrixMap.get(VIBRATION_FREQUENCY_TABLE_HEADERS_ENUM.RAMAN) || [];
        // const RAMAN_ACTIVE = vibrationFrequencyMatrixMap.get(VIBRATION_FREQUENCY_TABLE_HEADERS_ENUM.RAMAN_ACTIVE) || [];

        const results = formatterFrequencyInfo(text, isPhonon)

        res({
            ...results,
            irActive: results.irActve.map((item) => IR_OR_RAMAN_ACTIVE[item as ('N' | 'Y')]), //转化为布尔值
            ramanActive: results.ramanActive.map((item) => IR_OR_RAMAN_ACTIVE[item as ('N' | 'Y')]), //转化为布尔值
        })
    });

}
