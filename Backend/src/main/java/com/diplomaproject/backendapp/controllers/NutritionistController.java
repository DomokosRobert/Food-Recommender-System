package com.diplomaproject.backendapp.controllers;

import com.diplomaproject.backendapp.entities.Nutritionist;
import com.diplomaproject.backendapp.entities.User;
import com.diplomaproject.backendapp.service.NutritionistService;
import com.diplomaproject.backendapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins="*",allowedHeaders = "*")
@RestController
@RequestMapping(value = "/api/nutritionist")
public class NutritionistController {
    private final UserService userService;
    private final NutritionistService nutritionistService;

    @Autowired
    public NutritionistController(UserService userService, NutritionistService nutritionistService) {

        this.userService = userService;
        this.nutritionistService = nutritionistService;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Nutritionist nutritionist){
        String username = nutritionist.getUsername();
        String password = nutritionist.getPassword();
        boolean isAuth = nutritionistService.authenticateNutritionist(username,password);

        if(isAuth){
            return ResponseEntity.ok("Login successful");
        }
        else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username/password");
        }
    }
    @GetMapping
    public ResponseEntity<List<Nutritionist>> getAllNutritionists() {
        List<Nutritionist> nutritionists = nutritionistService.getAllNutritionists();
        return ResponseEntity.ok(nutritionists);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Nutritionist> getNutritionistById(@PathVariable("id") Long id) {
        Nutritionist nutritionist = nutritionistService.getNutritionistById(id);
        return ResponseEntity.ok(nutritionist);
    }

    @PostMapping
    public ResponseEntity<Long> insertNutritionist(@RequestBody Nutritionist nutritionist) {
        Long nutritionistId = nutritionistService.insertNutritionist(nutritionist);
        return ResponseEntity.status(HttpStatus.CREATED).body(nutritionistId);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Nutritionist> updateNutritionist(@PathVariable("id") Long id, @RequestBody Nutritionist nutritionist) {
        Nutritionist updatedNutritionist = nutritionistService.updateNutritionist(id, nutritionist);
        return ResponseEntity.ok(updatedNutritionist);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNutritionist(@PathVariable("id") Long id) {
        nutritionistService.deleteNutritionist(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/{id}/users")
    public ResponseEntity<List<User>> getUsersByNutritionist(@PathVariable("id") Long id){
        Nutritionist nutritionist = nutritionistService.getNutritionistById(id);
        List<User> userList = userService.getNutritionistUser(nutritionist);
        return ResponseEntity.ok(userList);
    }
    @GetMapping("/username={username}")
    public ResponseEntity<Nutritionist> getNutritionistByUsername(@PathVariable("username") String username){
        return ResponseEntity.ok(nutritionistService.getNutritionistByUsername(username));
    }

}
