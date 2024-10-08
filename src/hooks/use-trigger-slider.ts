import { useEffect, useState } from 'react';
import { Grid } from "antd";


const { useBreakpoint } = Grid;

export default function useTriggerSlider() {
    const [collapsed, setCollapsed] = useState(false); //控制slider是否收缩

    const { md } = useBreakpoint();

    useEffect(() => {
        if (md) setCollapsed(false);
        else setCollapsed(true);
    }, [md]);

    return {
        collapsed,
        setCollapsed,
        /**是否比设定的最小宽度大 */
        isLargerThanMinWidth: md,
    };

}
