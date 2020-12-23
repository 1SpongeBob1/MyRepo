// RegExp.quote = function(str) {
//     return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
// };

// @ts-ignore
String.prototype.replaceAll = function(search, replace){//把f替换成e
    // let reg = new RegExp( RegExp.quote(search) , "g" );
    // return this.replace( reg , replace );
    let reg = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g" );
    return this.replace(reg, replace );
};

export class TextUtils {
    static replaceAll(target, search, replace){
        // let reg = new RegExp( RegExp.quote(search) , "g" );
        let reg = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g" );
        return target.replace( reg , replace );
    }

    static isAscii(s){
        let i = 0;
        for( ;i < s.length; ++i){
            let c = s.charCodeAt(i);
            if ( c > 128 || c < 0) {
                return false;
            }
        }
        return true;
    }
}
