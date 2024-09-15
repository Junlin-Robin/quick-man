export enum CALCULATION_SERVICE {
    /**同位素分馏 */
    ISOTOPE_FRACTIONATION = 1,
    /**激化频率 */
    E_FIELD = 11,
    /**声子频率 */
    PHONON = 12,
    /**力常数 */
    FORCE_CONSTANT = 2,
    /**红外光谱 */
    IR = 3,
    /**拉曼光谱 */
    RAMAN = 4,
}

export const CalculationServiceMap = Object.freeze({
    [CALCULATION_SERVICE.E_FIELD]: '外电场',
    [CALCULATION_SERVICE.PHONON]: '声子频率',
    [CALCULATION_SERVICE.ISOTOPE_FRACTIONATION]: '同位素分馏',
    [CALCULATION_SERVICE.FORCE_CONSTANT]: '力常数',
    [CALCULATION_SERVICE.IR]: '红外光谱',
    [CALCULATION_SERVICE.RAMAN]: '拉曼光谱',
});

export const CalculationServiesOptions = [
    {
        label: CalculationServiceMap[CALCULATION_SERVICE.ISOTOPE_FRACTIONATION],
        value: CALCULATION_SERVICE.ISOTOPE_FRACTIONATION,
        children: [
            {
                label: CalculationServiceMap[CALCULATION_SERVICE.E_FIELD],
                value: CALCULATION_SERVICE.E_FIELD,
            },
            {
                label: CalculationServiceMap[CALCULATION_SERVICE.PHONON],
                value: CALCULATION_SERVICE.PHONON,
            },
        ],
    },
    {
        label: CalculationServiceMap[CALCULATION_SERVICE.FORCE_CONSTANT],
        value: CALCULATION_SERVICE.FORCE_CONSTANT,
    },
    {
        label: CalculationServiceMap[CALCULATION_SERVICE.IR],
        value: CALCULATION_SERVICE.IR,
        disabled: true
    },
    {
        label: CalculationServiceMap[CALCULATION_SERVICE.RAMAN],
        value: CALCULATION_SERVICE.RAMAN,
        disabled: true
    },
];

/**
 * 储存频率计算工程的key
 */
export const PROJECT_INFO_KEY = "PROJECT_ID_KEY_LIST";

export enum SOFTERWARE_TYPE {
    CASTEP = 'CASTEP',
    GAUSSIAN = 'GAUSSIAN',
    VASP = 'VASP',
}

export enum CASTEP_FILETYPE {
    CELL = '.cell',
    CASTEP = '.castep',
}

export enum GAUSSIAN_FILETYPE {
    CHK = '.chk',
}

export enum TASK_CALCULATION_STATUS {
    WAITING = 0,
    RUNNING = 1,
    SUCCESS = 2,
    FAILED = 3,
}

export enum FILE_UPLOAD_STATUS {
    DONE = 'done',
    ERROR = 'error',
}

/**
 * 数据库名称
 */
export const DATA_BASE_NAME = 'frequency_data_base';

/**
 * 数据库版本
 */
export const INITIAL_DATA_BASE_VERSION = 1;

/**
 * 数据表基础字段
 */
// export const DATA_BASE_INDEX = 'id, name, file_info, calculation_status, create_time, update_time, is_fixed, soft_ware, is_phonon, heavy_freq_info, light_freq_info, cell_info, isotope_setting, force_constant_result, isotope_fractionation_result';

export const DATA_BASE_INDEX = 'id, name, fileInfoList, calculationStatus, createTime, updateTime, isFixed, softWare, isPhonon, heavyFreqInfo, lightFreqInfo, cellInfo, isotopeSetting, forceConstant, isotopeFractionation, fractionationFittingLine';

export const DATABASEINDEXMAP = {
    id: 'id',
    name: 'name',
    file_info: 'fileInfoList',
    calculation_status: 'calculationStatus',
    create_time: 'createTime',
    update_time: 'updateTime',
    is_fixed: 'isFixed',
    soft_ware: 'softWare',
    is_phonon: 'isPhonon',
    heavy_freq_info: 'heavyFreqInfo',
    light_freq_info: 'lightFreqInfo',
    cell_info: 'cellInfo',
    isotope_setting: 'isotopeSetting',
    force_constant_result: 'forceConstant',
    isotope_fractionation_result: 'isotopeFractionation',
}
