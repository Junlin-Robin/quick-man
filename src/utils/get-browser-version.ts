
export const getBrowserUserAgent = () => {
    const userAgent = navigator.userAgent;
    const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1;
    const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    return {
        isIE,
        isMobile,
    };
}