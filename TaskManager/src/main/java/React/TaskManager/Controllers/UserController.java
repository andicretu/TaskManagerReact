package React.TaskManager.Controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import React.TaskManager.Models.UserModel;
import React.TaskManager.Repositories.UserRepository;
import React.TaskManager.Configurations.JwtUtil;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private JwtUtil jwtUtil;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<UserModel> createNewUser(@RequestBody UserModel userModel) {
        if (userRepository.findByEmail(userModel.getEmail()) != null) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        userModel.setPassword(passwordEncoder.encode(userModel.getPassword()));
        UserModel savedUser = userRepository.save(userModel);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    @GetMapping("/{email}")
    public ResponseEntity<UserModel> getUserByEmail(@PathVariable String email) {
        UserModel userModel = userRepository.findByEmail(email);
        if (userModel == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(userModel, HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
    
        UserModel user = userRepository.findByEmail(email);
    
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not found"));
        }
    
        if (passwordEncoder.matches(password, user.getPassword())) {
            String token = jwtUtil.generateToken(user);
    
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("message", "Login successful");
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        }
    }    
}
