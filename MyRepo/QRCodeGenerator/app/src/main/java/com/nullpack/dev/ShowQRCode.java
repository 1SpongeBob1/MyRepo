package com.nullpack.dev;

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Toast;

public class ShowQRCode extends Activity {
    private String content;
    private ImageView QRCode;
    private Button save;
    private Bitmap bitmap;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.show_qrcode);
        QRCode = (ImageView)findViewById(R.id.iv);
        save = (Button)findViewById(R.id.save);

        content = this.getIntent().getExtras().getString("content");

        //判断内容是否为空
        if(content.equals("") || content == null){
            Toast.makeText(ShowQRCode.this, "content could not be empty", Toast.LENGTH_SHORT).show();
        }else {
            //生成二维码
            bitmap = QRCodeUtil.createQRCodeBitmap(content, 200, 200, "UTF-8", "H", "0", Color.BLACK, Color.WHITE);
            //展示二维码
            QRCode.setImageBitmap(bitmap);
            save.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    //保存二维码
                    QRCodeUtil.saveImage(ShowQRCode.this, bitmap);
                    if (QRCodeUtil.saveImage(ShowQRCode.this, bitmap) == true) {
                        Toast.makeText(ShowQRCode.this, "save successed", Toast.LENGTH_SHORT).show();
                    } else {
                        Toast.makeText(ShowQRCode.this, "save failed", Toast.LENGTH_SHORT).show();
                    }

                }
            });
        }
    }
}
