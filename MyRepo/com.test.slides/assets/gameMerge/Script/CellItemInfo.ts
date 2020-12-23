// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import CellEvent from "./CellEvent";
import {CellCtrl} from "./CellCtrl";
import GameSlides from "./GameSlides";
import {FMgr} from "../../_Script/_FutureCore/Manager/FMgr";
import {AudioConst} from "./AudioConst";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CellItemInfo extends cc.Component {

    public cellType : CellType = null;

    public currentPrefab : CellEvent = null;

    shake(){
        if (this.currentPrefab && this.currentPrefab.currentNode){
            this.currentPrefab.currentNode.runAction(
                cc.sequence(
                    cc.moveTo( 0.05, this.currentPrefab.currentNode.position.x - 5, this.currentPrefab.currentNode.position.y),
                    cc.moveTo(0.05, this.currentPrefab.currentNode.position.x + 10, this.currentPrefab.currentNode.position.y),
                    cc.moveTo( 0.05, this.currentPrefab.currentNode.position.x - 10, this.currentPrefab.currentNode.position.y),
                    cc.moveTo(0.05, this.currentPrefab.currentNode.position.x + 10, this.currentPrefab.currentNode.position.y),
                    // cc.moveTo( 0.05, this.currentPrefab.currentNode.position.x - 10, this.currentPrefab.currentNode.position.y),
                    // cc.moveTo(0.05, this.currentPrefab.currentNode.position.x + 10, this.currentPrefab.currentNode.position.y),
                    cc.callFunc(()=>{
                        this.currentPrefab.currentNode.destroy();
                        this.cellType = CellType.blank;
                        FMgr.Audio.PlayEffect(AudioConst.ADD);
                    })
                ));
        }
        this.func();
    }

    func(){
        CellCtrl.shakeCount ++;
    }
}

/**
 * 当前位置的方块类型
 */
export enum CellType{
    single = 0,         //普通单格
    double_start = 1,   //双格左边格子
    blank = 2,          //空格子
    pp = 3,             //pp卡单格
    double_end = 4      //双格右边格子
}
