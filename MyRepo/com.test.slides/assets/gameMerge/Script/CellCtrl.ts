import CellItemInfo, {CellType} from "./CellItemInfo";
import GameSlides from "./GameSlides";

export class CellCtrl {
    private static INSTANCE : CellCtrl;

    static steps : number = 0;// 试玩广告当前完成步数，一共需移动四步

    static V : number = 200; // 移动速度

    public getDuration(length : number) : number{
        return length/CellCtrl.V;
    }

    public reserveCells : number[][] = [
        [1, 4, 1, 4, 0, 1, 4, 0],
        [0, 0, 1, 4, 0, 1, 4, 0],
        [0, 1, 4, 1, 4, 0, 1, 4],
        [0, 1, 4, 1, 4, 1, 4, 0]
    ]

    public constCell : number[][] = [

        [0, 0, 2, 0, 1, 4, 1, 4],
        [0, 0, 1, 4, 2, 0, 1, 4],
        [1, 4, 1, 4, 1, 4, 2, 0],
        [1, 4, 1, 4, 0, 2, 1, 4],
        [2, 3, 3, 3, 3, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2],
    ];

    gameNodes: CellItemInfo[][] = [];

    public static getInstance() : CellCtrl{
        if (this.INSTANCE == null){
            this.INSTANCE = new CellCtrl();
        }
        return this.INSTANCE
    }

    private CellCtrl(){

    }

    /**
     * 一次移动结束后的操作
     * @param endY  结束后判断被移动的方块所在行数是否完成
     */
    moveEnd(endY : number){
        if (this.isComplete(endY)){
            this.destroyLine(endY);
        }else {
            this.rise(8);
        }
    }

    /**
     * 判断指定行是否可以消除
     * @param j
     */
    isComplete(j : number) : boolean{
        for (let i = 0; i < 8; i ++){
            if (CellCtrl.getInstance().gameNodes[j][i] && ( CellCtrl.getInstance().gameNodes[j][i].cellType == CellType.blank ) ){
                return false;
            }
        }
        return true;
    }

    /**
     * 判断是否为空
     * @param line
     */
    isEmpty(line : number) : boolean{
        for (let i = 0; i < 8; i ++){
            if (CellCtrl.getInstance().gameNodes[line][i] && ( CellCtrl.getInstance().gameNodes[line][i].cellType != CellType.blank ) ){
                return false;
            }
        }
        return true;
    }

    static shakeCount = 0;
    /**
     * 销毁指定行
     * @param line
     */
    destroyLine(line : number){
        if (line == 0 && this.isEmpty(1)){
            GameSlides.isShowPpUI = true;
        }
        for (let i = 0; i < 8; i ++){
            if (CellCtrl.getInstance().gameNodes[line][i] && CellCtrl.getInstance().gameNodes[line][i].currentPrefab){
                CellCtrl.getInstance().gameNodes[line][i].shake();
            }
        }
        GameSlides.destroyedLine = line;
    }

    /**
     * 交换两个方块的位置
     * @param startX
     * @param startY
     * @param endX
     * @param endY
     */
    exchange(startX : number, startY : number, endX : number, endY : number){
        if (startX == endX && startY == endY){
            return;
        }

        console.log("CellCtrl : start: " + this.gameNodes[startY][startX].cellType.toString() + " ; " + (this.gameNodes[startY][startX].currentPrefab == null)
            + " ; " + this.gameNodes[endY][endX].cellType + " ; " + (this.gameNodes[endY][endX].currentPrefab == null));

        let info = this.gameNodes[startY][startX];
        this.gameNodes[startY][startX] = this.gameNodes[endY][endX];
        this.gameNodes[endY][endX] = info;

        console.log("CellCtrl : end: " + this.gameNodes[startY][startX].cellType.toString() + " ; " + (this.gameNodes[startY][startX].currentPrefab == null)
            + " ; " + this.gameNodes[endY][endX].cellType + " ; " + (this.gameNodes[endY][endX].currentPrefab == null));
    }

    /**
     * 获取能到达的最大x坐标
     */
    getMaxX(X : number, Y : number, startX : number){
        let result = startX;
        let currentRow = this.gameNodes[Y];
        for (let i = X + 1 ; i < currentRow.length; i ++){
            if (currentRow[i].cellType == CellType.blank){
                result = result + 35 + 4 + 35;
            }else {
                break;
            }
        }
        return result;
    }

    /**
     * 获取能到达的最小x坐标
     */
    getMinX(X : number, Y : number, startX : number){
        let result = startX;
        let currentRow = this.gameNodes[Y];
        for (let i = X - 1 ; i >= 0; i --){
            if (currentRow[i].cellType == CellType.blank){
                result = result - 35 - 4 - 35;
            }else {
                break;
            }
        }
        return result;
    }

    /**
     * 从第startLine行开始每一行都往上移动一格
     * @param startLine
     */
    rise( startLine : number ){
        for (startLine; startLine >= 0; startLine --){
            for (let i = 0; i < 8; i ++){
                let info = CellCtrl.getInstance().gameNodes[startLine][i];
                if (info && info.currentPrefab){
                    info.currentPrefab.startY += 74;
                    info.currentPrefab.currentNode.runAction(
                        cc.sequence(cc.moveTo(0.5, info.currentPrefab.currentNode.position.x, info.currentPrefab.currentNode.position.y + 74),
                            cc.callFunc(()=>{
                                if (i == 0){
                                    GameSlides.isGenerate = true;
                                }
                            })));
                    info.currentPrefab.Y += 1;
                }
                CellCtrl.getInstance().gameNodes[startLine + 1][i] = info;
            }
        }
    }

    /**
     * 从第startLine行开始每一行都下落一格
     */
    fall(startLine : number){
        for (startLine ; startLine < 10; startLine ++){
            for (let i = 0; i < 8; i ++){
                let info = CellCtrl.getInstance().gameNodes[startLine][i];
                if (info && info.currentPrefab){
                    info.currentPrefab.startY -= 74;
                    info.currentPrefab.currentNode.runAction(
                        cc.sequence(
                            cc.moveTo(0.5, info.currentPrefab.currentNode.position.x, info.currentPrefab.currentNode.position.y - 74),
                            cc.callFunc(()=>{
                                if (startLine == 10){
                                    GameSlides.isShowPpUI = true;
                                }

                            }, this)));
                    info.currentPrefab.Y -= 1;
                }
                CellCtrl.getInstance().gameNodes[startLine - 1][i] = info;
            }
        }
    }

}


enum Color{
    blue = 0,
    green = 1,
    purple = 2,
    yellow = 3,
    pink = 4
}