package com.example.todo;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

public AuthController(UserRepository userRepository,
                      BCryptPasswordEncoder passwordEncoder,
                      JwtUtil jwtUtil) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtUtil = jwtUtil;
}

    // 🔐 Register (Sign-Up)
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserDTO userDTO) {

        // Check if username already exists
        if (userRepository.findByUsername(userDTO.getUsername()).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Username already exists"));
        }

        // DTO → Entity
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword())); // Hash password

        User savedUser = userRepository.save(user);

        // Entity → DTO (no password!)
        UserDTO response = new UserDTO(savedUser.getId(), savedUser.getUsername());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

@PostMapping("/login")
public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO loginDTO) {

    User user = userRepository.findByUsername(loginDTO.getUsername())
            .orElseThrow(() -> new RuntimeException("Invalid username or password"));

    if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid username or password"));
    }

    String token = jwtUtil.generateToken(user.getId());

    return ResponseEntity.ok(
            Map.of("token", token)
    );
}
}


