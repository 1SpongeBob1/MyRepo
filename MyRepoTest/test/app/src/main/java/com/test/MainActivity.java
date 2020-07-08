package com.test;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {

    FrameLayout frameLayout1;
    FrameLayout frameLayout2;
    TextView textView;
    ImageView imageView1;
    ImageView imageView2;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
//        this.requestWindowFeature(Window.FEATURE_NO_TITLE);


        frameLayout1 = (FrameLayout)findViewById(R.id.test3);
        frameLayout2 = (FrameLayout)findViewById(R.id.test4);
        textView = (TextView)findViewById(R.id.text);
        imageView1 = (ImageView) findViewById(R.id.image1);
        imageView2 = (ImageView) findViewById(R.id.image2);

        imageView1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                frameLayout1.setVisibility(View.GONE);
                frameLayout2.setVisibility(View.VISIBLE);
            }
        });

        imageView2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                imageView2.setVisibility(View.INVISIBLE);
                textView.setVisibility(View.VISIBLE);
            }
        });
    }
}
