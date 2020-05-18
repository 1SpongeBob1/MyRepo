package com.nullpack.dev;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.widget.Toast;

public class NoteDatabaseHelper extends SQLiteOpenHelper {

    public static final String DATABASE_NAME = "NoteDatabase";
    public static final int DATABASE_VERSION = 1;
    private static String createNoteDB = "CREATE TABLE noteTable (" + "id integer primary key autoincrement," + "note text," + "time text)";

    public NoteDatabaseHelper(Context context){         //建库
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {       //建表逻辑
        db.execSQL(createNoteDB);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {

    }
}
