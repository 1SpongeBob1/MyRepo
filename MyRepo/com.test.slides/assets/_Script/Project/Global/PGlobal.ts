import FinishUI from "../UI/FinishUI";
import GetCardUI from "../UI/GetCardUI";
import InstallUI from "../UI/InstallUI";
import PayPalUI from "../UI/PayPalUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PGlobal extends cc.Component {
    public static Me: PGlobal = null;

    @property(PayPalUI)
    payPalUI: PayPalUI = null;

    @property(GetCardUI)
    getCardUI: GetCardUI = null;

    @property(FinishUI)
    finishUI: FinishUI = null;

    @property(InstallUI)
    installUI: InstallUI = null;

    onLoad() {
        PGlobal.Me = this;
    }
}