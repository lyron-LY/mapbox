export const global = <any>window;
const assetsUrl = `${location.protocol}//${location.host}`.replace(/\/$/, "");

/**
 * 项目配置
 */
export const webSetting = {
    /* 后端接口地址（必填） */
    serviceUrl: "http://localhost:3000",

    /* 前端包路径（必填，如果在根路径下可不填）*/
    assetsUrl,

    /* 页面主标题 */
    heading: "CodeBoard",

    /* 登录后跳转页 */
    loginToPage: "edit",

    /* 页面数据刷新时间 */
    dataRefreshTime: 10000,

    /* mock配置 */
    mock: { open: false, url: "" },

    /* 屏幕尺寸 */
    screen: { width: 1920, height: 1080 },

    ...global.webSetting
};