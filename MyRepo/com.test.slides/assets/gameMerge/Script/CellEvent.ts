import Vec2 = cc.Vec2;
import {CellCtrl} from "./CellCtrl";
import {CellType} from "./CellItemInfo";
import GameSlides from "./GameSlides";
import callFunc = cc.callFunc;

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
            this.guide.active = false;
        }
        this.startX = this.currentNode.position.x;
        this.startY = this.currentNode.position.y;
        this.currentX = this.startX;
        if (CellCtrl.getInstance().gameNodes[this._Y][this._X].cellType != CellType.pp){
            return;
        }

        this.currentNode.on(cc.Node.EventType.TOUCH_MOVE, (event)=>{
                this.move(event);

        }, this);

        this.currentNode.on(cc.Node.EventType.TOUCH_END, ()=>{
                this.moveEnd(this.currentX);

        }, this);

        this.currentNode.on(cc.Node.EventType.TOUCH_CANCEL, ()=>{
                this.moveEnd(this.currentX);
        }, this);
    }

    limit : number = null;
    move(event){
        if (event.getLocation().x - 360 <= this.startX){
            return;
        }
        this.currentX = event.getLocation().x - 360;
        this.limit = CellCtrl.getInstance().getMaxX(this._X, this._Y, this.startX);

        switch (CellCtrl.steps) {
            case 0:{
                this.limit = -259 + 74 * 5;
                break;
            }
            case 1:{
                this.limit = -259 + 74 * 6;
                break;
            }
            case 2:{
                this.limit = -259 + 74 * 4;
                break;
            }
            case 3:{
                this.limit = -259 + 74 * 2;
                break;
            }
        }

        if (this.currentX > this.startX){
            if (this.currentX > this.limit){
                this.currentX = this.limit;
            }
            this.currentNode.position = new Vec2(this.currentX, this.startY);
            this.currentX = this.limit;
            this.node.runAction(cc.sequence(cc.moveTo(CellCtrl.getInstance().getDuration(this.limit - this.startX), this.limit, this.startY), callFunc(()=>{
                this.moveEnd(this.limit);
            })));
            if (this.guide && this.guide.active == true){
                this.guide.active = false;
            }
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
                        }, this)));
                }
            }
        }
        console.log("CellEvent : " + this._X + "; " + this._Y + "; " + this.startX + "; " + this.startY);
    }

}