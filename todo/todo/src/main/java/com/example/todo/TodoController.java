package com.example.todo;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class TodoController {

    private final TodoRepository todoRepository;
    private final UserRepository userRepository;

    // ✅ Constructor injection (best practice)
    public TodoController(TodoRepository todoRepository, UserRepository userRepository) {
        this.todoRepository = todoRepository;
        this.userRepository = userRepository;
    }

    // 🔹 GET all todos


@GetMapping("/todos")
public List<TodoDTO> getTodos() {

    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    Long userId = (Long) auth.getPrincipal();

    return todoRepository.findByUserId(userId)
            .stream()
            .map(todo -> new TodoDTO(
                    todo.getId(),
                    todo.getTitle(),
                    todo.isCompleted(),
                    todo.getDate()
            ))
            .toList();
}



    // 🔹 POST new todo
  @PostMapping("/todos")
public TodoDTO addTodo(@Valid @RequestBody TodoDTO todoDTO) {

    Long userId = todoDTO.getUserId();
    if (userId == null) {
        throw new RuntimeException("User ID is required");
    }
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    Todo todo = new Todo();
    todo.setTitle(todoDTO.getTitle());
    todo.setDate(todoDTO.getDate());
    todo.setCompleted(false);
    todo.setUser(user);

    Todo savedTodo = todoRepository.save(todo);

    TodoDTO dto = new TodoDTO(
            savedTodo.getId(),
            savedTodo.getTitle(),
            savedTodo.isCompleted(),
            savedTodo.getDate()
    );
    dto.setUserId(savedTodo.getUser().getId());
    return dto;
}

    // 🔹 PUT toggle completed
  @PutMapping("/todos/{id}")
public TodoDTO toggleTodo(@PathVariable Long id) {
    if (id == null) {
        throw new IllegalArgumentException("ID cannot be null");
    }
    // Fetch entity
    Todo todo = todoRepository.findById(id)
            .orElseThrow(() -> new TodoNotFoundException("Todo not found"));

    // Update entity
    todo.setCompleted(!todo.isCompleted());

    // Save updated entity
    Todo updatedTodo = todoRepository.save(todo);

    // Entity → DTO
    TodoDTO dto = new TodoDTO(
            updatedTodo.getId(),
            updatedTodo.getTitle(),
            updatedTodo.isCompleted(),
            updatedTodo.getDate()
    );
    dto.setUserId(updatedTodo.getUser().getId());
    return dto;
}

    // 🔹 DELETE todo
    @DeleteMapping("/todos/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTodo(@PathVariable Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        if (!todoRepository.existsById(id)) {
            throw new TodoNotFoundException("Todo not found");
        }
        todoRepository.deleteById(id);
    }
}
