import CellItemInfo, {CellType} from "./CellItemInfo";

export class CellCtrl {
    private static INSTANCE : CellCtrl;

    static steps : number = 0;// 试玩广告当前完成步数，一共需移动四步

    static V : number = 200; // 移动速度

    public getDuration(length : number) : number{
        return length/CellCtrl.V;
    }

    public reserveCells : number[][] = [
        [1, 4, 1, 4, 0, 2, 0, 2],
        [0, 0, 2, 1, 4, 1, 4, 2],
        [1, 4, 2, 2, 1, 4, 1, 4],
        [2, 1, 4, 2, 0, 0, 1, 4]
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
     */
    moveEnd(){

    }

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
        // 这里只考虑向右
        for (let i = X + 1 ; i < currentRow.length; i ++){
            if (currentRow[i].cellType == CellType.blank){
                result = result + 35 + 4 + 35;
            }else {
                break;
            }
        }
        return result;
    }

}


enum Color{
    blue = 0,
    green = 1,
    purple = 2,
    yellow = 3,
    pink = 4
}