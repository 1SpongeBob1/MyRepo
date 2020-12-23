import FChannel from "../../_FutureCore/Channel/FChannel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class InstallUI extends cc.Component {
    @property(cc.Node)
    downLoadNode: cc.Node = null;

    start() {
        this.downLoadNode.on(cc.Node.EventType.TOUCH_END, this.btnDownLoadClick, this);

        // 呼吸效果
        this.downLoadNode.runAction(
            cc.repeatForever(cc.sequence(
                cc.scaleTo(0.8, 0.8),
                cc.scaleTo(0.8, 1)
                )
            )
        );

    }

    btnDownLoadClick() {
        FChannel.Me.onInstall();
    }

    gameEnd() {
        let endPos = cc.v2(0, -250);
        this.node.runAction(
            cc.moveTo(0.3, endPos)
        );
    }
}