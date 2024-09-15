/**
 * 图和表共用的计算结果
 */
export interface CalculationResultItem {
    /**任务id */
    taskId: string;
    taskName: string;
    frequencyInfo?: {
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
        /**----------------- */
        /**对应1000lnBeta */
        // fractionation: string;
        // beta: string;
        // /**未进行归一化值 */
        // RPFR: string;
        // /**用于数据归类 */
        // category: string;
        // name: string;
        // T: {
        //     /**摄氏度 */
        //     celsius: string;
        //     /**开尔文温度 */
        //     kelvin: string;
        // }
    }[];
    forceConstant?: string;
    fractionationFittingLine?: {
        k: string;
        b: string;
        r2: string;
    };
    isotopeSetting: {
        isotope: string;
        isFixed: boolean;
        isotopeNumber: number;
        isPhonon: boolean;
        fixedIsotopeNumber: number;
        massSetting: {
            heavy: string;
            light: string;
        }
    }
}

export type CalculationResults = Array<CalculationResultItem>
