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
