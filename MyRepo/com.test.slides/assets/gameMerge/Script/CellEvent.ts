import Vec2 = cc.Vec2;
import {CellCtrl} from "./CellCtrl";
import {CellType} from "./CellItemInfo";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CellEvent extends cc.Component{
    @property(cc.Node)
    currentNode : cc.Node = null;

    @property(cc.Node)
    guide : cc.Node = null;

    /**
     * 当前节点对应的行列数
     */
    private _X : number = null;
    private _Y : number = null

    startX : number = null;
    startY : number = null;

    currentX : number = null;
    // currentY : number = null;

    get X(): number {
        return this._X;
    }

    set X(value: number) {
        this._X = value;
    }

    get Y(): number {
        return this._Y;
    }

    set Y(value: number) {
        this._Y = value;
    }

    public showGuide(){
        if (this.guide && this.guide.active == false){
            this.guide.active = true;
        }
    }

    protected start() {
        if (this.guide && (this._X != 4 || this._Y != 4)){
        // if (this.guide){
            this.guide.active = false;
        }
        this.startX = this.currentNode.position.x;
        this.startY = this.currentNode.position.y;
        if (CellCtrl.getInstance().gameNodes[this._Y][this._Y].cellType != CellType.pp){
            return;
        }
        this.currentNode.on(cc.Node.EventType.TOUCH_MOVE, (event)=>{
            console.log("CellEvent : currentPosition : " + this._X + " " + this._Y);
            this.move(event);
        }, this);

        this.currentNode.on(cc.Node.EventType.TOUCH_END, ()=>{
            this.moveEnd(this.currentX);
        }, this);

        this.currentNode.on(cc.Node.EventType.TOUCH_CANCEL, ()=>{
            this.moveEnd(this.currentX);
        }, this);
    }

    move(event){
        let maxLimit = CellCtrl.getInstance().getMaxX(this._X, this._Y, this.startX);
        let minLimit = CellCtrl.getInstance().getMinX(this._X, this._Y, this.startX);
        this.currentX = event.getLocation().x - 360;
        if (this.currentX <= minLimit){
            this.currentX = minLimit;
        }
        if (this.currentX >= this.startX){
            if (this.currentX > maxLimit){
                this.currentX = maxLimit;
            }
        }
        this.currentNode.position = new Vec2(this.currentX, this.startY);
        if (this.guide && this.guide.active == true){
            this.guide.active = false;
        }
    }

    /**
     * 获取停止移动后方块的最终落点
     */
    moveEnd(value : number){
        let endX;
        for (let i = 0; i < 8; i ++){
            let x = -294 + 35 + (35 + 4 + 35)*i;
            if (value <= x){
                if ((x - value) <= 35 ){
                    endX = i;
                    this.currentNode.position = new Vec2(x, this.startY);
                    this.startX = x;
                }else {
                    endX = i - 1;
                    this.currentNode.position = new Vec2(x-74, this.startY);
                    this.startX = x-74;
                }
                if (endX == this._X){
                    return;
                }
                CellCtrl.getInstance().exchange(this._X, this._Y, endX, this._Y);
                this._X = endX;
                break;
            }
        }
        this.down();
    }

    down(){
        console.log("CellEvent : " + this._X + "; " + this._Y + "; " + this.startX + "; " + this.startY);
        if (this._Y == 0){
            CellCtrl.getInstance().moveEnd(this._Y);
            return;
        }
        for(let i = this._Y - 1; i >= 0; i --){
            if (CellCtrl.getInstance().gameNodes[i][this._X].cellType != CellType.blank){
                this.currentNode.runAction(cc.sequence(
                    cc.moveTo(CellCtrl.getInstance().getDuration(74*(this._Y - i -1)), this.startX, this.startY - 74*(this._Y - i -1)),
                    null,
                    cc.callFunc(()=>{
                        CellCtrl.getInstance().exchange(this._X, this._Y, this._X, i + 1);
                        this._Y = i + 1;
                        this.startY = this.startY - 74*(this._Y - i - 1);
                        CellCtrl.getInstance().moveEnd(this._Y);
                    }, this)));
                break;
            }else {
                if (i == 0){
                    this.currentNode.runAction(cc.sequence(cc.moveTo(CellCtrl.getInstance().getDuration(74*this._Y), this.startX, this.startY - 74*this._Y),
                        null,
                        cc.callFunc(()=>{
                            CellCtrl.getInstance().exchange(this._X, this._Y, this._X, 0);
                            this._Y = 0;
                            this.startY = this.startY - 74*this._Y;
                            CellCtrl.getInstance().moveEnd(this._Y);
                        }, this)));
                }
            }
        }
        console.log("CellEvent : currentPosition-end : " + this._X + "; " + this._Y + "; " + this.startX + "; " + this.startY);
    }
}