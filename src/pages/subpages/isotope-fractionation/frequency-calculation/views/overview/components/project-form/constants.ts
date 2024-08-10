import decimal from 'decimal.js';
import { isEmpty } from 'lodash';

import type { Rule } from "antd/es/form";
import type { IsotopeMassValueType } from './type';

import { Elements, ISOTOPE_TYPE } from '@/constants/element';

/**
 * 暂时人员选择列表，使用的组件暂时设置disabled
 * 后期在登陆功能开通后删除列表人员
 */
export const temporaryPersonList = [
    {
        label: '仅本人',
        value: 1,
    },
    {
        label: '所有人',
        value: 0,
    }
];

/**
 * form实例暂时选中的值
 */
export const InitialSelectedPersonValues = {
    readPermission: 1,
    editPermission: 1,
};

// 同位素质量组件的必须的校验规则
export const IsotopeMassRules: Rule[] = [
    {
        validator(_, value: IsotopeMassValueType) {
            const lightMass = value?.light?.round;
            const heavyMass = value?.heavy?.round;
            if (!lightMass || !heavyMass) {
                return Promise.reject(new Error('必须完整填写同位素质量数'));
            }
            if (lightMass >= heavyMass) return Promise.reject(new Error('轻同位素质量数必须小于重质量同位素'));
            return Promise.resolve();
        },
    },
    {
        required: true,
    },
    ({ getFieldValue }) => ({
        validator(_, value: IsotopeMassValueType) {
            const selectedElement = getFieldValue('calculationElement'); //选中的计算元素
            if (!selectedElement) return Promise.reject(new Error('未选择计算元素'));

            const massArray = Elements.find((ele) => ele.key === selectedElement)?.properties?.isotope?.filter((item) => item.type === ISOTOPE_TYPE.STABLE).map((item) => item.mass) || []; //查找到的元素可选的同位素质量列表
            const roundMassArray = massArray.map((item) => decimal.round(item));
            //常量设置问题，到 Elements 常量中修改。
            if (isEmpty(massArray)) return Promise.reject(new Error('未设置系统质量数，请反馈管理员修改'));

            const minMass = decimal.min(...massArray).round().toNumber(); //同位素质量最小值，四舍五入 到 个位
            const maxMass = decimal.max(...massArray).round().toNumber(); //同位素质量最小值，四舍五入 到 个位
            const lightMass = value?.light?.round;
            const heavyMass = value?.heavy?.round;
            const lightMass_precison = value?.light?.precision;
            const heavyMass_precison = value?.heavy?.precision;

            //校验下边界
            if (lightMass && lightMass < minMass) return Promise.reject(new Error(`${selectedElement} 同位素的最小质量不能小于 ${minMass}`));
            //校验上边界
            if (heavyMass && heavyMass > maxMass) return Promise.reject(new Error(`${selectedElement} 同位素的最大质量不能大于 ${maxMass}`));
            //校验是否设置成可选质量
            if (!lightMass_precison) return Promise.reject(new Error(`轻同位素质量数不在 ${roundMassArray.join('、')} 可选范围内`));
            if (!heavyMass_precison) return Promise.reject(new Error(`重同位素质量数不在 ${roundMassArray.join('、')} 可选范围内`))
            return Promise.resolve();
        },
    }),
];
