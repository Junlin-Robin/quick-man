/**
 * 匹配计算频率信息
 * 全局匹配-开头会携带匹配标志位+
 */
export const regexVibrationFrequencyMatrix = /\+\s+\d+\s+-?\d+\.?\d+\s+[a-d]\s+\d+\.?\d+\s+(?:N|Y)\s+(?:\d+\.?\d+)?\s+(?:N|Y)(?=\s+\+)/g;

/**
 * 匹配CASTEP版本信息
 * 版本，提取第二个匹配内容
 */
export const regexCastepVersion = /Materials Studio CASTEP version (\d)+/;

/**
 * 匹配计算类型
 * 计算type，提取第二个匹配内容
 */
export const regexCalculationType = /type of calculation\s+:\s+(\w(?:\w|\s|-)*)(?=\r?\n)/;

/**
 * 匹配原子数目
 * 原子数，提取第二个匹配内容
 */
export const regexAtomNumber = /Total number of ions in cell\s+=\s+(\d)+/;

/**
 * 匹配原子种类数目
 * 原子种类数目，提取第二个匹配内容
 */
export const regexAtomTypeNumber = /Total number of species in cell\s+=\s+(\d)+/;

/**
 * 匹配原子信息位置矩阵
 * 全局匹配-开头会携带匹配标志位x
 */
export const regexAtomPositionMatrix = /x\s+\w+\s+\d+\s+(?:-?\d+\.?\d+\s+)+(?:-?\d+\.?\d+)(?=\s+x)/g;

/**
 * 匹配是否计算拉曼光谱
 * 计算设置，提取第二个匹配内容
 */
export const regexIsCalculatedRaman = /Raman intensities\s+:\s+((?:\w)+\s?(?:\w)*)/;

/**
 * 匹配计算频率信息
 * 全局匹配
 */
export const regexFixedAtomInfo = /\d+\s+\w+\s+\d+(?:\s+\d\.?\d+)+(?=\r?\n)/g;

/**
 * 匹配计算的原子质量信息
 * 计算的原子质量，提取第二个匹配内容，注意有空行处理
 */
export const regexAtomMassInfo = /Mass of species in AMU\s+((?:\w+\s+\d+\.?\d+\s+)+)(?=Electric Quadrupole Moment)/;