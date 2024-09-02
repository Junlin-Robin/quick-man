/**
 * 目前仅支持2017版本的计算输出文件
 */
export const VERSION = '2017';

/**
 * 支持计算类型的枚举值
 */
export enum CALCULATION_TYPE_ENUM {
    E_FIELD = 'Phonon followed by E-field',
    PHONON = 'phonon calculation',
}

/**
 * 支持的计算模式：红外频率和声子频率，用于判断文件计算类型是否符合要求
 */
export const CALCULATION_TYPES = [CALCULATION_TYPE_ENUM.E_FIELD, CALCULATION_TYPE_ENUM.PHONON];

/**
 * 表头枚举值
 */
export enum VIBRATION_FREQUENCY_TABLE_HEADERS_ENUM {
    INDEX = 'N',
    FREQUENCY = 'Frequency',
    IRREP = 'irrep',
    IR = 'ir intensity',
    IR_ACTIVE = 'ir active',
    RAMAN = 'raman activity',
    RAMAN_ACTIVE = 'raman active',
}

/**
 * 振动频率表头字段
 */
export const VIBRATION_FREQUENCY_TABLE_HEADERS = [
    VIBRATION_FREQUENCY_TABLE_HEADERS_ENUM.INDEX, 
    VIBRATION_FREQUENCY_TABLE_HEADERS_ENUM.FREQUENCY,
    VIBRATION_FREQUENCY_TABLE_HEADERS_ENUM.IRREP,
    VIBRATION_FREQUENCY_TABLE_HEADERS_ENUM.IR,
    VIBRATION_FREQUENCY_TABLE_HEADERS_ENUM.IR_ACTIVE,
    VIBRATION_FREQUENCY_TABLE_HEADERS_ENUM.RAMAN,
    VIBRATION_FREQUENCY_TABLE_HEADERS_ENUM.RAMAN_ACTIVE,
];

/**
 * 是否计算拉曼频率-对应字母标志
 */
export const CALCULATE_RAMAN = Object.freeze({
    calculated: true,
    ['not calculated']: false,
});

/**
 * 拉曼活红外活性-对应字母标志
 */
export const IR_OR_RAMAN_ACTIVE= Object.freeze({
    Y: true,
    N: false,
});