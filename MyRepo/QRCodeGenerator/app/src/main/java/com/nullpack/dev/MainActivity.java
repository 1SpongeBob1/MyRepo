package com.nullpack.dev;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {
    private EditText textInput;
    private Button generate;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        textInput = (EditText)findViewById(R.id.textInput);
        generate = (Button)findViewById(R.id.generate);

        generate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent i = new Intent(MainActivity.this, ShowQRCode.class);
                Bundle b = new Bundle();
                b.putString("content", textInput.getText().toString());
                i.putExtras(b);
                startActivity(i);
            }
        });

    }
}
