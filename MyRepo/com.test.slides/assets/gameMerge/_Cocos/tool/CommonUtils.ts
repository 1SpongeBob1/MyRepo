import { LogTool } from "./LogTool";

export class CommonUtils {

    /**
     * 格式化字符串
     * @param coolTime
     * @param showHour
     * @param showMinute
     * @param showSecond
     */
    public static convertMillisecondsToTime(coolTime: number, showHour = true, showMinute = true, showSecond = true): string {
        let hStr = "";
        let minStr = "";
        let secondStr = "";
        let h = Math.floor(coolTime / 60 / 60);
        hStr = `${h}`;
        if (h < 10) {
            hStr = `0${h}`
        }

        let min = Math.floor(coolTime / 60) % 60;
        minStr = `${min}`;
        if (min < 10) {
            minStr = `0${min}`
        }
        let second = coolTime % 60;
        secondStr = `${second}`;
        if (second < 10) {
            secondStr = `0${second}`
        }
        if (coolTime ==0){

        }
        let timeStr = "00:00:00";
        if (showHour){
            timeStr = `${hStr}:${minStr}:${secondStr}`;
        } else if (showMinute){
            timeStr = `${minStr}:${secondStr}`;
        } else {
            timeStr = `${secondStr}`;
        }
        return timeStr;
    }

    /**
     * 生成16字节随机秘钥
     */
    static randomStr( count: number ): string {
        let randomStrs = "0123456789qwertyuiopasdfghjklzxcvbnm"
        let random = "";
        let pos = 0;
        for (let i = 0; i < count; i++) {
            pos = Math.floor(Math.random() * randomStrs.length)
            random += randomStrs[pos]
        }
        return random
    }

    static getScreenHeight(): number {
        let size = cc.view.getFrameSize()
        return size.height
    }

    static getScreenWidth(): number {
        let size = cc.view.getFrameSize()
        return size.width
    }
    static stringToUint8Array(str){
        return new Uint8Array(CommonUtils.stringToByte(str));
    }
    static stringToByte(str) {
        let bytes = new Array();
        let len, c;
        len = str.length;
        LogTool.log(`commintUtils- string 转bit ${len}`)
        for (let i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if (c >= 0x010000 && c <= 0x10FFFF) {
                bytes.push(((c >> 18) & 0x07) | 0xF0);
                bytes.push(((c >> 12) & 0x3F) | 0x80);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            } else if (c >= 0x000800 && c <= 0x00FFFF) {
                bytes.push(((c >> 12) & 0x0F) | 0xE0);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            } else if (c >= 0x000080 && c <= 0x0007FF) {
                bytes.push(((c >> 6) & 0x1F) | 0xC0);
                bytes.push((c & 0x3F) | 0x80);
            } else {
                bytes.push(c & 0xFF);
            }
        }
        return bytes;
    }
    static byteToString(arr) {
        if (typeof arr === 'string') {
            return arr;
        }
        var str = '',
            _arr = arr;
        for (var i = 0; i < _arr.length; i++) {
            var one = _arr[i].toString(2),
                v = one.match(/^1+?(?=0)/);
            if (v && one.length == 8) {
                var bytesLength = v[0].length;
                var store = _arr[i].toString(2).slice(7 - bytesLength);
                for (var st = 1; st < bytesLength; st++) {
                    store += _arr[st + i].toString(2).slice(2);
                }
                str += String.fromCharCode(parseInt(store, 2));
                i += bytesLength - 1;
            } else {
                str += String.fromCharCode(_arr[i]);
            }
        }
        return str;
    }
    static parseHexString2(str) {
        var result = [];
        while (str.length >= 2) {
            result.push(parseInt(str.substring(0, 2), 16));

            str = str.substring(2, str.length);
        }

        return result;
    }

    static parseHexString(str) {
        var result = [];
        while (str.length >= 8) {
            result.push(parseInt(str.substring(0, 8), 16));

            str = str.substring(8, str.length);
        }

        return result;
    }

    static createHexString(arr) {
        var result = "";
        var z;

        for (var i = 0; i < arr.length; i++) {
            var str = arr[i].toString(16);

            z = 8 - str.length + 1;
            str = Array(z).join("0") + str;

            result += str;
        }

        return result;
    }

    static dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    /**
     * 来自微信
     * @param str
     */
    static stringToBytes(str) {
        let ch, st, re = [];
        for (let i = 0; i < str.length; i++) {
            ch = str.charCodeAt(i);  // get char
            st = [];                 // set up "stack"
            do {
                st.push(ch & 0xFF);  // push byte to stack
                ch = ch >> 8;          // shift value down by 1 byte
            }
            while (ch);
            // add stack contents to result
            // done because chars have "wrong" endianness
            re = re.concat(st.reverse());
        }
        // return an array of bytes
        return re;
    }

    static base64ToArrayBuffer(base64) {
        var binary_string =  window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array( len );
        for (var i = 0; i < len; i++)        {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }
    static base64ToU8Array(base64) {
        var binary_string =  window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array( len );
        for (var i = 0; i < len; i++)        {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes;
    }
    static uint8ArrayToStringSimple(fileData) {
        var dataString = "";
        for (var i = 0; i < fileData.length; i++) {
            dataString += String.fromCharCode(fileData[i]);
        }

        return dataString
    }
    static uint8ArrayToString(arr) {
        if (typeof arr === 'string') {
            return arr;
        }
        var str = '',
            _arr = arr;
        for (var i = 0; i < _arr.length; i++) {
            var one = _arr[i].toString(2),
                v = one.match(/^1+?(?=0)/);
            if (v && one.length == 8) {
                var bytesLength = v[0].length;
                var store = _arr[i].toString(2).slice(7 - bytesLength);
                for (var st = 1; st < bytesLength; st++) {
                    store += _arr[st + i].toString(2).slice(2);
                }
                str += String.fromCharCode(parseInt(store, 2));
                i += bytesLength - 1;
            } else {
                str += String.fromCharCode(_arr[i]);
            }
        }
        return str;
    }
    static stringToUint8ArraySimple(str) {
        let bytes = [];
        let len, c;
        len = str.length;
        for (let i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            bytes.push(c);
        }
        return new Uint8Array(bytes);
    }
    static byteArrayToString(byteArray) {
        var str = "", i;
        for (i = 0; i < byteArray.length; ++i) {
            str += escape(String.fromCharCode(byteArray[i]));
        }
        return str;
    }
    static arrayBufferToBase64( buffer ) {
        var binary = '';
        var bytes = new Uint8Array( buffer );
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
        }
        return window.btoa( binary );
    }
    static uint8ArrayToBase64( buffer ) {
        var binary = '';
        var bytes = new Uint8Array( buffer );
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
        }
        return binary;
    }

    static wordToByteArray2(word, length) {
        var ba = [],
            i,
            xFF = 0xFF;
        if (length > 0)
            ba.push(word >>> 24);
        if (length > 1)
            ba.push((word >>> 16) & xFF);
        if (length > 2)
            ba.push((word >>> 8) & xFF);
        if (length > 3)
            ba.push(word & xFF);

        return ba;
    }

    static wordArrayToByteArray2(wordArray, length) {
        if (wordArray.hasOwnProperty("sigBytes") && wordArray.hasOwnProperty("words")) {
            length = wordArray.sigBytes;
            wordArray = wordArray.words;
        }

        var result = [],
            bytes,
        i = 0;
        while (length > 0) {
            bytes = CommonUtils.wordToByteArray2(wordArray[i], Math.min(4, length));
            length -= bytes.length;
            result.push(bytes);
            i++;
        }
        return [].concat.apply([], result);
    }

    /**
     * 是否命中概率
     * @param idp
     */
    public static isHitIDP(idp: number){
        if (idp >= 100){
            return true;
        }else if (idp <= 0){
            return false;
        }

        let random = Math.floor(Math.random() * 100);
        return (idp > random);
    }
}
