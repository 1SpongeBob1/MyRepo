import { FMgr } from "../../_FutureCore/Manager/FMgr";
import PGlobal from "../Global/PGlobal";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GetCardUI extends cc.Component {
	@property(cc.Node)
	flyNode: cc.Node = null;

	@property(cc.Node)
	btnReward: cc.Node = null;

	@property(cc.Node)
	clickNode: cc.Node = null;

	@property(cc.Sprite)
	spLight: cc.Sprite = null;

	@property(cc.Label)
	lbReward: cc.Label = null;

	@property(cc.Label)
	lbReward_1: cc.Label = null;

	isCloseIng = false;
	from = null;
	pay = 0;

	private canClick: boolean = false;

	private showRewardList: number[] = [];
	private isShowing: boolean = false;

	onLoad(): void {
		this.clickNode.on(cc.Node.EventType.TOUCH_END, this.onBtnDark, this);
	}

	protected start(): void {
		this.spLight.node.runAction(cc.repeatForever(cc.rotateBy(0.6, 30)));
	}

	onEnable() {
		if (CC_EDITOR){
			return;
		}
		let self = this;
		this.isCloseIng = false;

		self.flyNode.active = true;
		this.btnReward.active = true;
		this.canClick = true;
		self.flyNode.scale = 1;
		self.flyNode.setPosition(cc.v2(0, 50));
	}


	initStatus(from, num = 0) {
		let self = this;
		self.from = from;

		if (num) {
			self.pay = num;
		}
		self.lbReward.string = self.pay.toFixed(2);
		self.lbReward_1.string = self.pay.toFixed(2);
		cc.log("[GetCardUI]initStatus");

		this.scheduleOnce(this.onBtnDark, 1.5);
	}


	onBtnDark() {
		if (!this.canClick){
			return;
		}
		this.canClick = false;
		this.unscheduleAllCallbacks();

		cc.log("[GetCardUI]onBtnDark");
		if (this.isCloseIng == false) {
			this.onVideoAward();
		}
	}

	private onVideoAward() {
		let self = this;
		self.isCloseIng = true;
		self.flyNode.stopAllActions();

		if (this.btnReward)
			this.btnReward.active = false;

		let coin: cc.Node = PGlobal.Me.payPalUI.lbReward.node;
		let pos = coin.parent.convertToWorldSpaceAR(coin.getPosition());
		let p1 = self.node.convertToNodeSpaceAR(pos);

		let act = cc.sequence(
			cc.delayTime(0.2),
			cc.spawn(
				cc.scaleTo(0.5, 0, 0),
				cc.moveTo(0.5, p1),
			),
			cc.callFunc(function () {
				FMgr.Audio.PlayEffect('award');

				self.flyNode.active = false;
				self.closePage();
			})
		);
		self.flyNode.runAction(act);
	}

	closePage() {
		let self = this;
		this.node.active = false;
		PGlobal.Me.payPalUI.setCardRecAni();

		this.isShowing = false;
		this.tryShow();

	}

	Show(num: number) {
		this.showRewardList.push(num);

		this.tryShow();
	}

	private tryShow(){
		if (this.showRewardList.length <= 0){
			return;
		}
		if (this.isShowing){
			return;
		}

		let num = this.showRewardList[0];
		this.showRewardList.splice(0, 1);

		this.isShowing = true;

		FMgr.Audio.PlayEffect('giftPopup');

		this.node.active = true;
		this.lbReward.string = num.toFixed(2);
		this.lbReward_1.string = num.toFixed(2);
		this.initStatus(null, num);
	}
}