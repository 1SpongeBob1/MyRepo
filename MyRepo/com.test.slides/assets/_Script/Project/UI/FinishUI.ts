import FChannel from "../../_FutureCore/Channel/FChannel";
import PGlobal from "../Global/PGlobal";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FinishUI extends cc.Component {
	@property(cc.Node)
    finishUINode: cc.Node = null;

    gameEnd() {
        cc.log("[FinishUI]gameEnd");
        FChannel.Me.onGameEnd();

        PGlobal.Me.node.runAction(cc.sequence(
            cc.delayTime(1.5),
            cc.callFunc(() => {
                this.finishUINode.active = true;

                PGlobal.Me.installUI.gameEnd();
            }, this),
        ));
    }
}