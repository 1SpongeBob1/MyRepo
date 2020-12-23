// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Vec2 = cc.Vec2;
import CellItemInfo, {CellType} from "./CellItemInfo";
import {CellCtrl} from "./CellCtrl";
import CellEvent from "./CellEvent";
import PGlobal from "../../_Script/Project/Global/PGlobal";
import FAudioMgr from "../../_Script/_FutureCore/Manager/FAudioMgr";
import {FMgr} from "../../_Script/_FutureCore/Manager/FMgr";
import {AudioConst} from "./AudioConst";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameSlides extends cc.Component {

    @property(cc.Layout)
    background : cc.Layout = null;

    @property(cc.Node)
    gameNode: cc.Node = null;

    @property(cc.Prefab)
    itemBgPrefab: cc.Prefab;

    @property(cc.Prefab)
    RedCellPrefab : cc.Prefab = null;

    @property(cc.Prefab)
    DoubleRedCellPrefab : cc.Prefab = null;

    @property(cc.Prefab)
    BlueCellPrefab : cc.Prefab = null;

    @property(cc.Prefab)
    DoubleBlueCellPrefab : cc.Prefab = null;

    @property(cc.Prefab)
    GreenCellPrefab : cc.Prefab = null;

    @property(cc.Prefab)
    DoubleGreenCellPrefab : cc.Prefab = null;

    @property(cc.Prefab)
    PurpleCellPrefab : cc.Prefab = null;

    @property(cc.Prefab)
    DoublePurpleCellPrefab : cc.Prefab = null;

    @property(cc.Prefab)
    YellowCellPrefab : cc.Prefab = null;

    @property(cc.Prefab)
    DoubleYellowCellPrefab : cc.Prefab = null;

    @property(cc.Prefab)
    PinkCellPrefab : cc.Prefab = null;

    @property(cc.Prefab)
    DoublePinkCellPrefab : cc.Prefab = null;

    @property(cc.Prefab)
    PpCellPrefab : cc.Prefab = null;


    onLoad () {
        FMgr.Audio.PlayEffect(AudioConst.BGM);
        for (let j = 0; j < 10; j ++){
            for (let i = 0; i < 8; i ++){
                if (CellCtrl.getInstance().gameNodes[j] == null){
                    CellCtrl.getInstance().gameNodes[j] = [];
                }
                // 添加游戏背景
                let prefab = cc.instantiate(this.itemBgPrefab);
                if (prefab){
                    this.background.node.addChild(prefab);
                }
                this.setCells(j, i, this.getCellType(CellCtrl.getInstance().constCell[j][i]));
            }
        }
    }

    getCellType(value : number) : CellType{
        switch (value) {
            case 0:{
                return CellType.single;
            }
            case 1:{
                return CellType.double_start;
            }
            case 2:{
                return CellType.blank;
            }
            case 3:{
                return CellType.pp;
            }
            case 4:{
                return CellType.double_end;
            }
            default:{
                return CellType.blank;
            }
        }
    }

    /**
     * 设置方块位置
     * @param j 所在行数
     * @param i 所在列数
     * @param cellType  要设置在当前坐标的方块类型
     */
    private setCells(j : number, i : number, cellType : CellType, isUpdate = false){
        // 如果当前数组为空则插入方块
        if (!CellCtrl.getInstance().gameNodes[j][i] || isUpdate){
            let cellPrefab;
            let position;
            let cellInfo = new CellItemInfo();
            let script;
            switch (cellType) {
                case CellType.single:{
                    cellPrefab = cc.instantiate(this.getColorfulCell(false));
                    cellInfo.cellType = CellType.single;
                    position = this.getPosition(i, j, false);
                    script = cellPrefab.getComponent(CellEvent);
                    script.X = i;
                    script.Y = j;
                    break;
                }
                case CellType.double_start:{
                    cellPrefab = cc.instantiate(this.getColorfulCell(true));
                    cellInfo.cellType = CellType.double_start;
                    position = this.getPosition(i, j, true);
                    script = cellPrefab.getComponent(CellEvent);
                    script.X = i;
                    script.Y = j;
                    break;
                }
                case CellType.double_end:{
                    cellInfo.cellType = CellType.double_end;
                    position = this.getPosition(i, j, false);
                    cellPrefab = null;
                    break;
                }
                case CellType.blank:{
                    cellPrefab = null;
                    position = this.getPosition(i, j, false);
                    cellInfo.cellType = CellType.blank;
                    break;
                }
                case CellType.pp:{
                    cellPrefab = cc.instantiate(this.PpCellPrefab);
                    position = this.getPosition(i, j, false);
                    cellInfo.cellType = CellType.pp;
                    script = cellPrefab.getComponent(CellEvent);
                    script.X = i;
                    script.Y = j;
                    break;
                }
            }
            if (position){
                if (script){
                    script.currentNode.position = new Vec2(position[0], position[1]);
                    this.gameNode.addChild(script.currentNode);
                }

            }
            cellInfo.currentPrefab = script;
            CellCtrl.getInstance().gameNodes[j][i] = cellInfo;
        }
    }

    // 计算坐标
    private getPosition(x : number, y : number, isDouble : boolean) : number[]{
        let position = [];
        let positionX;
        let positionY;
        if (isDouble){
            if (x == 0){
                positionX = -222;
            }else {
                positionX = -259 + 4*x + 70*x + 37;
            }
        }else {
            if (x == 0){
                positionX = -259;
            }else {
                positionX = -259 + 4*x + 70*x;
            }
        }
        if (y == 0){
            positionY = -333;
        }else {
            positionY = -333 + 4*y + 70*y;
        }
        position.push(positionX);
        position.push(positionY);
        return position;
    }

    start () {

    }

    static shakeCount = 0;
    static test = false;

    update (dt) {
        let completedRow = null;
        for (let j = 0; j < 10; j ++){
            if(CellCtrl.getInstance().gameNodes[j] && this.isComplete(j)){
                completedRow = j;
                // 销毁已完成的行的节点
                for (let i = 0; i < 8; i ++){
                    if (CellCtrl.getInstance().gameNodes[j][i] && CellCtrl.getInstance().gameNodes[j][i].currentPrefab){
                        CellCtrl.getInstance().gameNodes[j][i].shake();
                        // let node = CellCtrl.getInstance().gameNodes[j][i].currentPrefab.currentNode;
                        // node.runAction(
                        //     cc.sequence(
                        //         cc.moveTo( 0.1, node.position.x - 5, 0),
                        //         cc.moveTo(0.1, node.position.x + 10, 0),
                        //         cc.moveTo( 0.1, node.position.x - 10, 0),
                        //         cc.moveTo(0.1, node.position.x + 10, 0),
                        //         cc.moveTo( 0.1, node.position.x - 10, 0),
                        //         cc.moveTo(0.1, node.position.x + 10, 0),
                        //         cc.callFunc(()=>{
                        //
                        //         })
                        //     ));

                        // CellCtrl.getInstance().gameNodes[j][i].cellType = CellType.blank;
                        // CellCtrl.getInstance().gameNodes[j][i].currentPrefab.currentNode.destroy();
                        // CellCtrl.getInstance().gameNodes[j][i] = null;
                    }
                }
            }
        }
        if (completedRow && GameSlides.shakeCount >= 8){
            GameSlides.test = false;
            PGlobal.Me.payPalUI.ShowGetUI();
            let temp = completedRow - 1;
            completedRow = null;
            for (temp; temp >= 0; temp --){
                for (let i = 0; i < 8; i ++){
                    let info = CellCtrl.getInstance().gameNodes[temp][i];
                    if (info && info.currentPrefab){
                        info.currentPrefab.startY += 74;
                        info.currentPrefab.currentNode.runAction(cc.moveTo(0.5, info.currentPrefab.currentNode.position.x, info.currentPrefab.currentNode.position.y + 74));
                    }
                    CellCtrl.getInstance().gameNodes[temp + 1][i] = info;
                }

            }
            for (let i = 0; i < 8; i ++){
                this.setCells(0, i, this.getCellType(CellCtrl.getInstance().reserveCells[CellCtrl.steps][i]), true);
            }
            CellCtrl.steps ++;
            if (CellCtrl.steps < 4){
                CellCtrl.getInstance().gameNodes[4][4 - CellCtrl.steps].currentPrefab.showGuide();
            }
            

        }

    }

    // 当前行是否可以消除
    isComplete(j : number) : boolean{
        for (let i = 0; i < 8; i ++){
            if (CellCtrl.getInstance().gameNodes[j][i] && ( CellCtrl.getInstance().gameNodes[j][i].cellType == CellType.blank ) ){
                return false;
            }
        }
        return true;
    }

    // 返回随机色彩的方块预制
    getColorfulCell(isDouble : boolean){
        let color = Math.round(Math.random() * 5);
        switch (color) {
            case 0:{
                if (isDouble){
                    return this.DoubleBlueCellPrefab;
                }
                return this.BlueCellPrefab;
            }
            case 1:{
                if (isDouble){
                    return this.DoubleGreenCellPrefab;
                }
                return this.GreenCellPrefab;
            }
            case 2:{
                if (isDouble){
                    return this.DoublePurpleCellPrefab;
                }
                return this.PurpleCellPrefab;
            }
            case 3:{
                if (isDouble){
                    return this.DoubleYellowCellPrefab;
                }
                return this.YellowCellPrefab;
            }
            case 4:{
                if (isDouble){
                    return this.DoublePinkCellPrefab;
                }
                return this.PinkCellPrefab;
            }
            default:{
                if (isDouble){
                    return this.DoubleBlueCellPrefab;
                }
                return this.BlueCellPrefab;
            }
        }
    }
}
