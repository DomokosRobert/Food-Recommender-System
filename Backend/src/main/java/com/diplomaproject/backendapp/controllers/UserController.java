package com.diplomaproject.backendapp.controllers;


import com.diplomaproject.backendapp.entities.Menu;
import com.diplomaproject.backendapp.entities.Nutritionist;
import com.diplomaproject.backendapp.entities.ShoppingList;
import com.diplomaproject.backendapp.entities.User;
import com.diplomaproject.backendapp.service.NutritionistService;
import com.diplomaproject.backendapp.service.ShoppingListService;
import com.diplomaproject.backendapp.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins="*",allowedHeaders = "*")
@RestController
@RequestMapping(value = "/api/user")
public class UserController {
    private final UserService userService;
    private final ShoppingListService shoppingListService;
    private final NutritionistService nutritionistService;
    private static final Logger LOGGER = LoggerFactory.getLogger(UserController.class);

    @Autowired
    public UserController(UserService userService, ShoppingListService shoppingListService, NutritionistService nutritionistService) {

        this.userService = userService;
        this.shoppingListService = shoppingListService;
        this.nutritionistService = nutritionistService;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers(){
        List<User> userList = userService.getAllUsers();
        return ResponseEntity.ok(userList);
    }
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user){
        String username = user.getUsername();
        String password = user.getPassword();
        boolean isAuth = userService.authenticateUser(username,password);

        if(isAuth){
            return ResponseEntity.ok("Login successful");
        }
        else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username/password");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable("id") Long userId) {
        User user = userService.findByUserId(userId);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }
    @GetMapping("/username={username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable("username") String username){
        return ResponseEntity.ok(userService.getUserByUsername(username));
    }
    @PostMapping()
    public ResponseEntity<Long> insertUser(@Valid @RequestBody User user){
        Long userId = userService.insert(user);
        return new ResponseEntity<>(userId,HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUserForm(@PathVariable("id") Long userId, @RequestBody User user){
        User updated = userService.updateForm(userId,user);
        return ResponseEntity.ok(updated);
    }
    @PutMapping("/user/{id}")
    public ResponseEntity<User> update(@PathVariable("id") Long userId, @RequestBody User user){
        User updated = userService.update(userId,user);
        return ResponseEntity.ok(updated);
    }
    @PostMapping("/{userId}/menus")
    public ResponseEntity<User> saveMenu(@PathVariable("userId") Long userId, @RequestBody String menuContent) {
        User user = userService.saveMenu(userId, menuContent);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{userId}/menus")
    public ResponseEntity<List<Menu>> getUserMenus(@PathVariable("userId") Long userId){
        User user = userService.findByUserId(userId);
        if(user != null){
            List<Menu> menus = userService.geUserMenus(user);
            return ResponseEntity.ok(menus);
        }
        else
            return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/menu/{id}")
    public ResponseEntity<Void> deleteMenu(@PathVariable("id") Long id){
        userService.deleteMenu(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{userId}/shoppingList/addItem")
    public ResponseEntity<ShoppingList> addItemToShoppingList(@PathVariable Long userId, @RequestBody String item){
        User user= userService.findByUserId(userId);
        if(user!=null){
            if(user.getShoppingList()==null){
                ShoppingList shoppingList = new ShoppingList();
                shoppingList.setUser(user);
                shoppingList.setItems(new ArrayList<>());
                user.setShoppingList(shoppingList);

            }
            ShoppingList updatedShoppingList = shoppingListService.addItem(user.getShoppingList(),item);
            return ResponseEntity.ok(updatedShoppingList);
        }
        else
            return ResponseEntity.notFound().build();
    }
    @PostMapping("/{userId}/shoppingList/removeItem")
    public ResponseEntity<ShoppingList> removeItemToShoppingList(@PathVariable Long userId, @RequestBody String item){

        String decodedItem = URLDecoder.decode(item, StandardCharsets.UTF_8);
        LOGGER.info("Item to remove: {}", decodedItem);
        User user= userService.findByUserId(userId);
        if(user!=null){
            if(user.getShoppingList()==null){
                return ResponseEntity.ok().build();
            }
            ShoppingList updatedShoppingList = shoppingListService.removeItem(user.getShoppingList(),decodedItem);
            LOGGER.info("Shopping list after remove: {}", updatedShoppingList);
            return ResponseEntity.ok(updatedShoppingList);
        }
        else
            return ResponseEntity.notFound().build();
    }

    @GetMapping("/{userId}/shoppingList/items")
    public ResponseEntity<List<String>> getShoppingListByUser(@PathVariable Long userId){
        User user = userService.findByUserId(userId);
        if(user!=null){
            ShoppingList shoppingList = shoppingListService.getShoppingListByUser(user);
            if(shoppingList == null){
                shoppingList = new ShoppingList();
                shoppingList.setItems(new ArrayList<>());
                user.setShoppingList(shoppingList);
            }
            return ResponseEntity.ok(shoppingList.getItems());
        }
        else{
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{userId}/addNutritionist")
    public ResponseEntity<User> assignNutritionist(@PathVariable Long userId, @RequestBody Long nutritionistId){
        Nutritionist nutritionist = nutritionistService.getNutritionistById(nutritionistId);
        if(nutritionist!=null){
            User user= userService.findByUserId(userId);
            if(user!=null){
                User updated = userService.assignNutritionist(nutritionist,user);
                return ResponseEntity.ok(updated);
            }
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.notFound().build();

    }

}
