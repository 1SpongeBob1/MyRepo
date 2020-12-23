declare module Yeah {
    function getLang();
}

/// 全局系统配置

// 当前工程版本号 大版本.新功能.修复
const Version_Pro: string = "1.0.0";
// 当前SDK版本号
const Version_SDK: string = "1.0.0";

const globalData = {
    scale: 1,
    isShow: true
}

// 语言类型 zh-tw en ja ko
const Lang = "zh-tw";

// 常用颜色
const BLACK_COLOR = 0x000000;//黑色
const WHITE_COLOR = 0xFFFFFF;//白色
const GREY_COLOR = 0x333333;//灰色

// 视图宽
function GetVisibleViewWidth(): number {
    return cc.view.getVisibleSize().width;
}

// 视图高
function GetVisibleViewHeight(): number {
    return cc.view.getVisibleSize().height;
}

// 浏览器语言
function GetLang(): string {
    try {
        return Yeah.getLang();
    } catch (e) {
        return Lang;
    }
}

export { Version_Pro, Version_SDK, globalData, BLACK_COLOR, WHITE_COLOR, GREY_COLOR, GetVisibleViewWidth, GetVisibleViewHeight, GetLang }