import {
    regexCastepVersion,
    regexCalculationType,
    regexIsCalculatedRaman,
    CALCULATION_TYPE_ENUM,
    CALCULATE_RAMAN as SUPPORT_CALCULATE_RAMAN_SETTING,
    VERSION as SUPPORT_VERSION,
    CALCULATION_TYPES as SUPPORT_CALCULATION_TYPES,
} from './constants';

/**判断计算文件设置版本等信息是否支持 */
export function judgeIsSupport(text: string): { message: string, isSupport: boolean } {
    const currentVersion = text.match(regexCastepVersion)?.[1];
    const currentCalculationType = text.match(regexCalculationType)?.[1] || '';
    if (currentVersion !== SUPPORT_VERSION) {
        return { message: 'CASTEP版本不支持！', isSupport: false }
    } else if (!SUPPORT_CALCULATION_TYPES.includes(currentCalculationType as CALCULATION_TYPE_ENUM)) {
        return { message: '计算类型设置不支持！', isSupport: false }
    } else {
        return { message: '', isSupport: true }
    }
}

/**判断是否计算了拉曼频率 */
export function judgeIsCalculateRaman(text: string): boolean {
    const currentCalculateRamanSetting = text.match(regexIsCalculatedRaman)?.[1];
    return SUPPORT_CALCULATE_RAMAN_SETTING[currentCalculateRamanSetting as keyof typeof SUPPORT_CALCULATE_RAMAN_SETTING] || false;
}

/**判断是否计算类型设置计算声子频率 */
export function judgeIsCalculatePhonon(text: string): boolean {
    const currentCalculationType = text.match(regexCalculationType)?.[1] || '';
    return currentCalculationType === CALCULATION_TYPE_ENUM.PHONON;
}
