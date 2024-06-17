import { useEffect, useState } from 'react';
import { isProd } from '../utils/get-env';
import { message } from 'antd';
import { useMemoizedFn } from 'ahooks';

export default function useWatchSystemTheme() {
    //系统主题色
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    const checkBrowserSupport = useMemoizedFn(() => {
        if (!window.matchMedia) {
            const warningMessage = '当前浏览器不支持获取系统主题色，请使用谷歌最新版本的浏览器查看';
            if (isProd) message.warning(warningMessage);
            else console.warn(warningMessage);
            return false;
        }
        return true;
    });

    const query = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = useMemoizedFn(() => {
        const matchResult = query.matches;
        setTheme(matchResult ? 'dark' : 'light');
    });

    useEffect(() => {
        if (!checkBrowserSupport()) return;
        //监听媒体查询的变化
        query.addEventListener('change', handleSystemThemeChange);
        //初始化调用
        handleSystemThemeChange();

        return () => {
            query.removeEventListener('change', handleSystemThemeChange);
        };
    }, [checkBrowserSupport, handleSystemThemeChange, query]);


    return theme;
}
