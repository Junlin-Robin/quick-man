/**
 * 用于判断浏览器是否支持localStorage，不支持直接刨除异常，需要捕获
 */
export function judgeLocalStorageisAvailable() {
    if (!window.localStorage) {
        throw new Error('当前浏览器不支持使用本地存储，清更换Chrome浏览器或者打开localStorage权限！');
    }
    return true;
}


/**
 * 获取localStorage存储的工程列表
 * 如果需要读区嵌套路径，可以传path参数，格式为 path1.path2.path3
 */
export function getAndParseValueInLoaclStorage<T>(Key: string): T {
    if (!Key) throw new Error('系统错误，未设置工程id，请联系管理员！');

    let existValue: T;

    try {
        const projectIdListJson = localStorage.getItem(Key);
        existValue = JSON.parse(projectIdListJson || JSON.stringify([]));
    } catch {
        throw new Error('系统错误，解析localStorage出错，请联系管理员！');
    }

    return existValue;
}

/**
 * 设置工程列表到 localStorage
 */
export function stringifyAndSetValueInLocalStorage<T>(newValue: T, Key: string): boolean  {
    if (!Key) throw new Error('系统错误，未设置工程id，请联系管理员！');

    try {
        const newProjectIdListJson = JSON.stringify(newValue);
        localStorage.setItem(Key, newProjectIdListJson);
    } catch {
        throw new Error('系统错误，序列化工程信息出错，请联系管理员！');
    }

    return true;
}
