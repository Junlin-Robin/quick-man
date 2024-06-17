/**
 * 判断是否是生产环境
 * 会在构建的时候自动获取env环境
 */
export const isProd = import.meta.env.REACT_APP_ENV === 'production';

/**
 * 判断当前程序环境 production-生产环境；staging-st环境（目前项目未配置）；development-开发环境
 * @returns 当前环境
 */
export const getEnv = () => {
    switch (process?.env?.REACT_APP_ENV) {
        case 'staging':
            return 'staging';
        case 'production':
            return 'production';
        default:
            return 'development';
    }
}
