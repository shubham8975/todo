package com.example.todo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class TodoDTO {

private Long id;
 private Long userId;

    @NotBlank(message = "Title must not be empty")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    private String title;

    private boolean completed;

    @NotBlank(message = "Date is required")
    private String date;

    public TodoDTO() {
    }

    public TodoDTO(Long id, String title, boolean completed, String date) {
        this.id = id;
        this.title = title;
        this.completed = completed;
        this.date = date;
    }
   

public Long getUserId() {
    return userId;
}

public void setUserId(Long userId) {
    this.userId = userId;
}

    // getters & setters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public boolean isCompleted() { return completed; }
    public String getDate() { return date; }

    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setCompleted(boolean completed) { this.completed = completed; }
    public void setDate(String date) { this.date = date; }
}
