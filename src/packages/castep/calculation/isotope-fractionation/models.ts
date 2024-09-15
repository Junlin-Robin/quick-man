/**
 * 同位素分馏计算的入参
 */
export interface IsotopeFractionationParams {
    /**同位素波数数据 */
    freq: {
        heavy: string[][];
        light: string[][];
    };
    /**用于计算的同位素的原子数，用于归一化计算 */
    isotopeNumber: number;
    /**每一套波数的比例 */
    proportions: string[];
    /**
     * 需要计算温度梯度设置
     */
    TGradient?: { kelvin: string; celsius: string }[];
}

/**
 * 同位素分馏计算的返回结果
 */
export type IsotopeFractionationReturn = Array<{
    /**温度 */
    T: {
        celsius: string;
        kelvin: string;
    };
    /**配分函数 */
    PFR: string[][];
    /**约化配分函数 */
    RPFR: string[];
    /**β值 */
    beta: string[];
    /**
     * 原始分馏值：1000lnβ
     * 未乘以比例
     */
    fractionation_raw: string[];
    /**每套波数的比例 */
    proportions: string[];
    /**
     * 实际使用的Beta值：β
     * 用 β 乘以 proportions 累加得到，业务中直接可以使用此值
     */
    normalizedBeta: string;
    /**
     * 实际使用的分馏值：1000lnβ
     * 用 normalizedBeta 得到，业务中直接可以使用此值
     */
    fractionation: string;
    /**
     * 实际使用的分馏值：1000(β-1)
     * 用 normalizedBeta 得到，业务中直接可以使用此值
     */
    thousand_BetaMinor: string;
}>

/**
 * 同位素分馏最小粒度实现函数入参
 */
export interface MinimizationImplParamsType {
    /**
     * 重同位素波数数组
     */
    waveNumber_heavy: string[];
    /**
     * 轻同位素波数数组
     */
    waveNumber_light: string[];
    /**
     * 同位素原子数量
     */
    isotopeNumber: number;
    /**
     * 开尔文温度
     */
    kelvin: string;
}