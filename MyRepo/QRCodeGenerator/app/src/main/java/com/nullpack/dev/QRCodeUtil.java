package com.nullpack.dev;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.net.Uri;
import android.os.Environment;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Hashtable;

public class QRCodeUtil {

    /**
     *
     * @param content
     * @param width
     * @param height
     * @param character_set
     * @param error_correction_level
     * @param margin
     * @param color_black
     * @param color_white
     * @return  返回二维码位图
     */
    @Nullable
    public static Bitmap createQRCodeBitmap(String content, int width, int height, String character_set, String error_correction_level, String margin, int color_black, int color_white){

        try {
            //字符串内容判空
            if (TextUtils.isEmpty(content)){
                return null;
            }
            //宽高>=0
            if ( width < 0 || height < 0 ){
                return null;
            }
            //设置二维码相关配置
            Hashtable<EncodeHintType, String> hints = new Hashtable<>();
            //字符转码格式设置
            if (!TextUtils.isEmpty(character_set)){
                hints.put(EncodeHintType.CHARACTER_SET, character_set);
            }
            //容错率设置
            if (!TextUtils.isEmpty(error_correction_level)){
                hints.put(EncodeHintType.ERROR_CORRECTION, error_correction_level);
            }
            //空白边距设置
            if (!TextUtils.isEmpty(margin)){
                hints.put(EncodeHintType.MARGIN, margin);
            }
            //将配置参数传入QRCodeWriter的encode方法生成BitMatrix（位矩阵）对象
            BitMatrix bitMatrix = new QRCodeWriter().encode(content, BarcodeFormat.QR_CODE, width, height, hints);

            int[] pixels = new int[width*height];
            for (int y = 0; y < height; y ++){
                for (int x = 0; x < width; x ++){
                    //bitMatrix.get(x,y) 方法返回true是黑色方块，false是白色方块
                    if (bitMatrix.get(x,y)){
                        pixels[y * width + x] = color_black;    //黑色色块像素设置
                    }else{
                        pixels[y * height + x] = color_white;   //白色色块像素设置
                    }
                }
            }
            //创建BitMap对象，根据像素数组设置BitMap每个像素点的颜色值，并返回BitMap对象
            Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
            bitmap.setPixels(pixels, 0, width, 0, 0, width, height);
            return bitmap;
        } catch (WriterException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 保存图片到设备
     * @param context
     * @param bitmap
     * @return
     */
    public static boolean saveImage(Context context, Bitmap bitmap){
        //首先保存图片
        String filePath = Environment.getExternalStorageDirectory().getAbsolutePath() + File.separator + "My QRCode";
        File appDir = new File(filePath);
        if (ContextCompat.checkSelfPermission(context, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED){
            //申请WRIT_EXTERNAL_STORAGE权限
            ActivityCompat.requestPermissions((Activity) context, new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, 1);
        }
        if(!appDir.exists()){
            appDir.mkdirs();
        }
        String fileName = System.currentTimeMillis() + ".jpg";
        File file = new File(appDir, fileName);
        try {
            FileOutputStream fos = new FileOutputStream(file);
            //通过io流的方式来压缩保存图片
            boolean isSuccess = bitmap.compress(Bitmap.CompressFormat.JPEG, 100, fos);
            fos.flush();
            fos.close();

            //保存图片后发送到广播通知更新数据库
            Uri uri = Uri.fromFile(file);
            context.sendBroadcast(new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE, uri));
            if (isSuccess){
                return true;
            } else {
                return false;
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return false;
    }
}
