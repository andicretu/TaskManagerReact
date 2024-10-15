package React.TaskManager.Controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import React.TaskManager.Models.TaskModel;
import React.TaskManager.Repositories.TaskRepository;
import React.TaskManager.Models.UserModel;
import React.TaskManager.Repositories.UserRepository;
import React.TaskManager.Configurations.JwtUtil;

import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public TaskController(TaskRepository taskRepository, UserRepository userRepository, JwtUtil jwtUtil) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<Page<TaskModel>> getTasksForUser(
        @RequestParam int page,
        @RequestParam int size,
        HttpServletRequest request) {

        String token = request.getHeader("Authorization").replace("Bearer ", "");
        String userEmail = jwtUtil.extractEmail(token);
        UserModel user = userRepository.findByEmail(userEmail);
    
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    
        Pageable pageable = PageRequest.of(page, size);
        Page<TaskModel> tasks = taskRepository.findByUserModel(user, pageable);
        return ResponseEntity.ok(tasks);
    }

    @PostMapping
    public ResponseEntity<TaskModel> createTask(@RequestBody TaskModel newTask, HttpServletRequest request) {
        String token = request.getHeader("Authorization").replace("Bearer ", "");
        String userEmail = jwtUtil.extractEmail(token);
        UserModel user = userRepository.findByEmail(userEmail);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        newTask.setUserModel(user);
        TaskModel createdTask = taskRepository.save(newTask);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskModel> updateTask(@PathVariable Long id, @RequestBody TaskModel updatedTask, HttpServletRequest request) {
        String token = request.getHeader("Authorization").replace("Bearer ", "");
        String userEmail = jwtUtil.extractEmail(token);
        UserModel user = userRepository.findByEmail(userEmail);
        
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        Optional<TaskModel> taskOpt = taskRepository.findById(id);
        if (taskOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        TaskModel task = taskOpt.get();
        
        if (!task.getUserModel().getEmail().equals(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        task.setStatus(updatedTask.getStatus());
        
        taskRepository.save(task);
        return ResponseEntity.ok(task);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id, HttpServletRequest request) {
        String token = request.getHeader("Authorization").replace("Bearer ", "");
        String userEmail = jwtUtil.extractEmail(token); // 
        UserModel user = userRepository.findByEmail(userEmail);
        
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<TaskModel> taskOpt = taskRepository.findById(id);
        if (taskOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        TaskModel task = taskOpt.get();

        if (!task.getUserModel().getEmail().equals(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        taskRepository.delete(task);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}


