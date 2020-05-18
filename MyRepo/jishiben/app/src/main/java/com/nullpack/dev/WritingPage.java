package com.nullpack.dev;

import android.app.Activity;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.Nullable;
import java.util.Date;
import java.text.SimpleDateFormat;

public class WritingPage extends Activity {

    private EditText et;
    private Button saveButton;
    private SQLiteDatabase database;
    private NoteDatabaseHelper dbHelper;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.writing_page);
        et = (EditText)findViewById(R.id.et);
        saveButton = (Button)findViewById(R.id.bt);

        saveButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(et.getText().toString().equals("")){
                    Context context = getApplication().getApplicationContext();
                    Toast.makeText(WritingPage.this, "Content could not be empty!", Toast.LENGTH_SHORT).show();
                }else{
                    dbHelper = new NoteDatabaseHelper(WritingPage.this);
                    database = dbHelper.getReadableDatabase();
                    saveData();
                }
            }
        });
    }

    public void saveData(){
        String text = et.getText().toString();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String time = sdf.format(new Date());
        ContentValues values = new ContentValues();
        values.put("note", text);
        values.put("time", time);
        database.insert("noteTable", null, values);
        Toast.makeText(WritingPage.this, "save successed", Toast.LENGTH_SHORT).show();
        Intent intent = new Intent(WritingPage.this, MainActivity.class);
        startActivity(intent);
    }

}
