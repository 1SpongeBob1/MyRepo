import BaseWindow from "./BaseWindow";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BaseDialog extends BaseWindow {

    //对话框需要显示底部广告
    @property({type: cc.Boolean, override: true})
    protected shouldShowBannerAD: boolean = true;

    /**
     * 背景色
     */
    bgColor: cc.Node;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        super.onLoad();

        //显示半透明背景
        this.showBg();
    }

    start() {
        super.start();
        let self = this;
        // 刷新背景，否则在全面屏手机下onResume后打开的对话框背景不能覆盖全屏
        this.scheduleOnce(function () {
            if (self.bgColor != null) {
                self.bgColor.width = self.node.width;
                self.bgColor.height = self.node.height;
                self.bgColor.getComponent(cc.Widget).updateAlignment();
            }
        }, 0.1);

    }

    onDestroy() {
        super.onDestroy();
    }

    //SEVER EVENT CALLBACKS:


    //CLICK EVENT CALLBACKS:


    /**
     * 显示半透明背景
     */
    protected showBg() {
        let self = this;
    }

}
