import PGlobal from "../Global/PGlobal";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PayPalUI extends cc.Component {
	@property(cc.Label)
	lbReward: cc.Label = null;

	@property(cc.Node)
	cardList: cc.Node[] = [];

	@property(cc.ProgressBar)
	barPP: cc.ProgressBar = null;

	Config_PPNum: number[] = [10, 20, 50, 100];

	PPIndex = 0;
	ppCoin = 0;
	updateScore = 0;

	private showGetCount: number = 0;

	start() {
		this.barPP.progress = 0;
	}

	update() {
		if (this.updateScore <= this.ppCoin) {
			let addScore = this.ppCoin - this.updateScore;
			if (addScore > 10)
				this.updateScore += 1;
			else if (addScore > 3)
				this.updateScore += 0.3;
			else
				this.updateScore += 0.1;
			this.updateScore = Math.min(this.updateScore, this.ppCoin);//保证最大只能是score

			if (Math.floor(this.updateScore * 100) != Math.floor(parseFloat(this.lbReward.string) * 100)) {
				this.lbReward.string = '$' + this.updateScore.toFixed(2);
			}
		}
	}

	SetPPCoin(ppCoin: number) {
		this.ppCoin += ppCoin;
	}

	getCurrntPPBtn() {
		return this.cardList[this.PPIndex];
	}

	fillCurrentPPBtn() {
		let PPBtn = this.getCurrntPPBtn();
		PPBtn.getChildByName('ok').active = true;
		this.barPP.progress = 0.33 * (this.PPIndex);
		this.SetPPCoin(this.Config_PPNum[this.PPIndex]);

		let act = cc.sequence(
			cc.scaleTo(0.25, 1.2),
			cc.scaleTo(0.15, 1),
		);
		PPBtn.runAction(act);
	}

	//卡片收集到的闪动动画
	setCardRecAni() {
		this.fillCurrentPPBtn();
		this.PPIndex++;

		if (this.PPIndex == this.Config_PPNum.length) {
			PGlobal.Me.finishUI.gameEnd();
		}
	}

	// API
	public ShowGetUI() {
		if (this.PPIndex >= this.Config_PPNum.length){
			return;
		}

		if (this.showGetCount >= this.Config_PPNum.length){
			return;
		}
		let reward = this.Config_PPNum[this.showGetCount];
		this.showGetCount++;
		PGlobal.Me.getCardUI.Show(reward);
	}

	// API
	public AddProgress(currLv: number, currClickCount: number) {
		if (this.PPIndex != 0) {
			this.barPP.progress = this.barPP.progress + 0.066;
		}
	}
}