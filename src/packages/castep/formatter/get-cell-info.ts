import decimal from 'decimal.js';

import {
    regexAtomNumber,
    regexAtomMassInfo,
    regexFixedAtomInfo,
    regexAtomTypeNumber,
    regexAtomPositionMatrix,
} from './constants';

import { judgeIsSupport, judgeIsCalculatePhonon } from './judgement';

/**
 * 获取晶胞固定的原子信息
 * @param text cell文件
 * @returns {Array} atom-原子名；index-对应原子序号，与坐标矩阵对应；fixedSetting-固定信息
 */
export function getFixedAtomPosition(text: string) {
    const fixedAtomMatchArray = text.match(regexFixedAtomInfo);
    //固定原子信息
    const fixedAtomInfo = fixedAtomMatchArray?.map((infoItem) => {
        const fixedAtomInfoArray = infoItem.split(/\s+/);
        const atom = fixedAtomInfoArray?.[1]; //原子名
        const index = fixedAtomInfoArray?.[2]; //对应固定原子序号
        const fixedSetting = [fixedAtomInfoArray?.[3], fixedAtomInfoArray?.[4], fixedAtomInfoArray?.[5]];

        return {
            atom,
            index: Number(index),
            fixedSetting
        }
    });

    return fixedAtomInfo || [];
}

/**
 * 获取设置的计算同位素质量信息
 */
function getIsotopeMassInfo(params: {
    castepText_Heavy: string;
    castepText_Light: string
}) {
    const { castepText_Heavy, castepText_Light } = params;

    const atomMassInfo_heavy = castepText_Heavy.match(regexAtomMassInfo)?.[1]?.
        split(/\r?\n/).map((item) => item.trim()).filter(Boolean).map((item) => {
            const [name, mass] = item.split(/\s+/);
            return {
                name,
                mass,
            }
        }) || [];
    const atomMassInfo_light = castepText_Light.match(regexAtomMassInfo)?.[1]?.
        split(/\r?\n/).map((item) => item.trim()).filter(Boolean).map((item) => {
            const [name, mass] = item.split(/\s+/);
            return {
                name,
                mass,
            }
        }) || [];

    const isotopeInfo = [];

    for (let i = 0; i < atomMassInfo_heavy.length; i++) {
        const { name: atomName_heavy, mass: mass_heavy } = atomMassInfo_heavy[i];
        const { name: atomName_light, mass: mass_light } = atomMassInfo_light[i];

        if (atomName_light === atomName_heavy && mass_heavy !== mass_light) {
            if (new decimal(mass_light).greaterThanOrEqualTo(mass_heavy)) throw new Error('轻、重同位素质量设置相反，检查上传文件是否对应！');
            isotopeInfo.push({ isotope: atomName_heavy, massSetting: { heavy: mass_heavy, light: mass_light } });
        }
    }

    if (isotopeInfo.length !== 1) throw new Error('同位素质量设置错误！');

    return isotopeInfo[0];
}

export interface ReturnCellInfo {
    atomNumbers: number;
    atomTypeNumbers: number;
    atomPositionMatrix: {
        atom: string;
        index: number;
        position: string[];
        fixed: boolean;
    }[];
    isotopeSetting: {
        isotope: string;
        massSetting: {
            heavy: string;
            light: string;
        };
        fixedIsotopeNumber: number;
        isotopeNumber: number;
    }
}

/**
 * 获取晶胞信息
 * @param text castep文件|文件列表
 * @returns {Array} atomNumbers-原子数；fixedAtomNumbers-固定原子数；atomTypeNumbers-原子类型数；atomPositionMatrix-原子位置信息
 */
export function getCellInfo(params: { castep: { heavy: string, light: string }, cell?: string, isFixed?: boolean }): Promise<ReturnCellInfo>;
export function getCellInfo(params: { castep: { heavy: string, light: string }, cell?: string, isFixed?: boolean }[]): Promise<ReturnCellInfo[]>;
export function getCellInfo(
    params: { castep: { heavy: string, light: string }, cell?: string, isFixed?: boolean } | { castep: { heavy: string, light: string }, cell?: string, isFixed?: boolean }[]
) {
    if (Array.isArray(params)) return Promise.all(params.map((item) => getCellInfo(item)));

    return new Promise((res, rej) => {
        const cellText = params.cell || '';
        const { heavy: castepText_Heavy, light: castepText_Light } = params.castep;
        const isFixed = params.isFixed;
        //判断是否支持版本信息
        const { isSupport, message } = judgeIsSupport(castepText_Heavy);
        if (!isSupport) return rej(new Error(message));

        if (isFixed && !cellText) return rej(new Error('未上传 .cell 文件！')); //如果固定原子，但是没有cell文件，则报错
        if (cellText && !isFixed) return rej(new Error('.cell 文件解析显示计算同位素原子有被固定，请检查选择固定原子选项是否勾选正确！')); //如果cell文件，但是没有指定固定原子，则报错

        //判断是否计算的是声子频率
        const isPhonon_heavy = judgeIsCalculatePhonon(castepText_Heavy);
        const isPhonon_light = judgeIsCalculatePhonon(castepText_Light);
        if (isPhonon_heavy !== isPhonon_light) return rej(new Error('轻、重同位素计算文件设置的计算类型不一致，请检查后重新计算！'));
        //判断计算类型是否是声子频率
        const isPhonon = isPhonon_heavy;


        /**
         * 声子频率处理方式，待补充！！！！！！！！
         * ！！！！！！！1
         * ！！！！！！！
         */
        if (isPhonon) {
            return;
        }

        //固定原子信息
        let fixedAtomInfos: {
            atom: string;
            index: number;
            fixedSetting: string[];
        }[] = [];
        //如果设定了固定原子
        if (isFixed) fixedAtomInfos = getFixedAtomPosition(cellText);

        const atomNumbers = castepText_Heavy.match(regexAtomNumber)?.[1]; //计算原子数目
        const atomTypeNumbers = castepText_Heavy.match(regexAtomTypeNumber)?.[1]; //计算原子类型
        const fixedAtomNumbers = fixedAtomInfos.length / 3; //固定原子数目，从cell正则匹配每个原子遵循笛卡尔坐标系有三组数据
        const atomPositionMatchArray = castepText_Heavy.match(regexAtomPositionMatrix);
        const atomPositionMatrix = atomPositionMatchArray?.map((atomItem) => {
            const atomInfoArray = atomItem?.split(/\s+/);
            const atom = atomInfoArray?.[1]; //第一个是标志位
            const index = atomInfoArray?.[2];
            const positionArray = [atomInfoArray?.[3], atomInfoArray?.[4], atomInfoArray?.[5]];
            let fixed = false;

            if (isFixed && fixedAtomInfos.length) {
                const infoItem = fixedAtomInfos.some((infoItem) => infoItem.atom === atom && infoItem.index === Number(index));
                fixed = infoItem ? true : false;
            }

            return {
                atom,
                index: Number(index),
                position: positionArray,
                fixed,
            }
        }) || [];//原子数目

        const isotopeInfo = getIsotopeMassInfo({
            castepText_Heavy,
            castepText_Light,
        }); //匹配的同位素信息

        //固定的同位素原子数目
        const fixedIsotopeNumber = fixedAtomInfos.some((fixedInfoItem) => fixedInfoItem.atom === isotopeInfo.isotope) ? (fixedAtomInfos.filter((fixedInfoItem) => fixedInfoItem.atom === isotopeInfo.isotope).length / 3) : 0;
        //同位素原子数目
        const isotopeNumber = atomPositionMatrix.filter((atomPositionItem) => atomPositionItem.atom === isotopeInfo.isotope).length - fixedIsotopeNumber;

        const isotopeSetting = {
            isotope: isotopeInfo.isotope,
            massSetting: isotopeInfo.massSetting,
            fixedIsotopeNumber,
            isotopeNumber,
        };

        return res({
            atomNumbers: Number(atomNumbers),
            atomTypeNumbers: Number(atomTypeNumbers),
            fixedAtomNumbers,
            atomPositionMatrix,
            isotopeSetting,
        })
    });
}