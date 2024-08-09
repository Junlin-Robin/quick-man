/**
 * 图和表共用的计算结果
 */
export interface CalculationResultItem {
    /**任务id */
    taskId: string;
    taskName: string;
    frequencyInfo?: {
        /**对应1000lnBeta */
        fractionation: string;
        beta: string;
        /**未进行归一化值 */
        RPFR: string;
        /**用于数据归类 */
        category: string;
        name: string;
        T: {
            /**摄氏度 */
            celsius: string;
            /**开尔文温度 */
            kelvin: string;
        }
    }[];
    forceConstant?: string;
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
