package com.nullpack.dev;

class ItemInfo {
    private String note;
    private String time;

    public ItemInfo(String note, String time){
        this.note = note;
        this.time = time;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }
}
