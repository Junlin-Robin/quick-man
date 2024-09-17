import { useEffect, useMemo, useState } from 'react';
import { Cascader as AntdCascader, Checkbox, Divider } from 'antd';
import type { CheckboxProps } from 'antd';
import { omitBy, orderBy, isEqual, isEmpty } from 'lodash';
import { findLeafValue, recoverCascaderValue, getAllAbledLeafValue } from './utils';

import type { CascaderProProps } from './models';
import useWatchSystemTheme from '@/hooks/use-watch-system-theme';

const excludesProps = ['value', 'onChange', 'options'];

/**
 * 自定义带全选功能的cascader组件，value是所有叶子节点的值
 * 内部设定为多选模式，单选需求直接使用antd的Cascader
 * @param props 
 * @returns 
 */
export default function CascaderPro(props: CascaderProProps) {
    const { value, onChange, options } = props;

    const theme = useWatchSystemTheme();

    const [isSelectAll, setIsSelectAll] = useState(false);

    const [indeterminate, setIndeterminate] = useState(false);

    const innerValue = useMemo(() => {
        if (value) {
            return recoverCascaderValue(value, options);
        }
        return [];
    }, [options, value]);

    const allAviableLeafValue = useMemo(() => getAllAbledLeafValue(options), [options]);

    const handleChange = (values: (string | number | null)[][]) => {
        const leafValues = findLeafValue(values);
        onChange?.(leafValues);
    };

    const selectAllOnChange: CheckboxProps['onChange'] = (e) => {
        const isSelected = e.target.checked || false;
        setIsSelectAll(isSelected);
        if (isSelected) {
            const allLeafValue = getAllAbledLeafValue(options);
            onChange?.(allLeafValue);
        } else {
            onChange?.([]);
        }
    };

    const dropdownRender = (menus: React.ReactElement) => (
        <div style={{ position: 'relative' }}>
            <div style={{ paddingBottom: 36, maxHeight: 200, overflow: 'scroll' }}>
                {menus}
            </div>
            <div style={{ position: 'absolute', bottom: 0, width: '100%', backgroundColor: theme === 'light' ? '#fff' : 'rgba(255, 255, 255, 0.12)' }}>
                <Divider style={{ margin: '0px' }} />
                <div style={{ margin: '6px 0 6px 16px' }}>
                    <Checkbox checked={isSelectAll} onChange={selectAllOnChange} indeterminate={indeterminate}>全选</Checkbox>
                </div>
            </div>
        </div>
    );

    useEffect(() => {
        if (!isEmpty(allAviableLeafValue)) {
            const isSelectAllAvaliableLeafValue = isEqual(orderBy(value), orderBy(allAviableLeafValue));
            setIsSelectAll(isSelectAllAvaliableLeafValue);
            if (!isSelectAllAvaliableLeafValue && !isEmpty(value)) setIndeterminate(true);
            else setIndeterminate(false);
        } else {
            // setIsSelectAll(false);
            setIndeterminate(false);
        }
    }, [allAviableLeafValue, value]);

    return (
        <AntdCascader
            {...omitBy(props, (_, key) => excludesProps.includes(key))}
            options={options}
            multiple
            maxTagCount="responsive"
            dropdownRender={dropdownRender}
            value={innerValue}
            onChange={handleChange}
        />
    )
}