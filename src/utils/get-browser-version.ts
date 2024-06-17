
export const getBrowserUserAgent = () => {
    const userAgent = navigator.userAgent;
    const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1;
    return isIE;
}