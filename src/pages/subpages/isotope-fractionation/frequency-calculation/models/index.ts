import { SOFTERWARE_TYPE, TASK_CALCULATION_STATUS, FILE_UPLOAD_STATUS } from '../constants';
import type { ReturnInfo, ReturnCellInfo } from '@/packages/castep/formatter';
import type { IsotopeFractionationReturn } from '@/packages/castep/calculation/isotope-fractionation/models'

// export interface TaskDetail {
//     name: string;
//     id: string;
//     createTime: number;
//     updateTime: number;
//     calculationStatus: TASK_CALCULATION_STATUS;
//     isFixed: boolean;
//     calculationParams: {
//         softWare: SOFTERWARE_TYPE;
//         /**是否计算的声子频率 */
//         isPhonon: boolean;
//         frequencyInfo: {
//             heavy: ReturnInfo;
//             light: ReturnInfo;
//         };
//         cellInfo: ReturnCellInfo;
//     };
// }

// export interface TaskResult {
//     isotopeFractionation?: IsotopeFractionationReturn;
//     forceConstants?: string;
// }

export interface FileInfoType {
    name: string;
    uid: string;
    status: FILE_UPLOAD_STATUS
}

export type TaskDataType = Array<{
    name: string;
    id: string;
    createTime: number;
    updateTime: number;
    calculationStatus: TASK_CALCULATION_STATUS;
    isFixed: boolean;
    softWare: SOFTERWARE_TYPE;
    /**是否计算的声子频率 */
    isPhonon: boolean;
    heavyFreqInfo: ReturnInfo;
    lightFreqInfo: ReturnInfo;
    cellInfo: Omit<ReturnCellInfo, 'isotopeSetting'>;
    fileInfoList: {
        light: FileInfoType[];
        heavy: FileInfoType[];
        cell: FileInfoType[];
    };
    isotopeSetting: ReturnCellInfo['isotopeSetting'];
    forceConstant?: string;
    isotopeFractionation?: IsotopeFractionationReturn;
    fractionationFittingLine?: {
        /**斜率 */
        k: string;
        /**截距 */
        b: string;
        /**置信度 */
        r2: string;
    }
}>