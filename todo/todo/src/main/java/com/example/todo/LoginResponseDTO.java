package com.example.todo;

public class LoginResponseDTO {

    private final Long id;
    private final String username;

    public LoginResponseDTO(Long id, String username) {
        this.id = id;
        this.username = username;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }
}
