import "./FJSWindow";
import { FMgr } from "../Manager/FMgr";

// 从 cc._decorator 命名空间中引入 ccclass 装饰器
const { ccclass } = cc._decorator;

// 使用装饰器声明 CCClass
@ccclass
// ES6 Class 声明语法，继承 cc.Component
export default class FMainLauncher extends cc.Component {
    public static Me: FMainLauncher = null;

    private managerRoot: cc.Node = null;

    // 成员方法
    onLoad() {
        cc.log("[FMainLauncher]onLoad");
        FMainLauncher.Me = this;

        this.managerRoot = new cc.Node();
        this.managerRoot.setParent(this.node);
        FMgr.Init(this.managerRoot);

        setTimeout(() =>
        {
            FMgr.Audio.PlayBgm('bgm_MainScene', 0.35);
        }, 0.1);
    }

    start() {
        cc.log("[FMainLauncher]start");
    }

    update() {
    }
}