package com.diplomaproject.backendapp.service;

import com.diplomaproject.backendapp.entities.Menu;
import com.diplomaproject.backendapp.entities.Nutritionist;
import com.diplomaproject.backendapp.entities.ShoppingList;
import com.diplomaproject.backendapp.entities.User;
import com.diplomaproject.backendapp.repos.MenuRepository;
import com.diplomaproject.backendapp.repos.NutritionistRepository;
import com.diplomaproject.backendapp.repos.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class UserService {

    private final UserRepository userRepository;
    private final MenuRepository menuRepository;
    private static final Logger LOGGER = LoggerFactory.getLogger(UserService.class);

    @Autowired
    public UserService(UserRepository userRepository, MenuRepository menuRepository) {
        this.menuRepository = menuRepository;
        this.userRepository = userRepository;

    }
    public boolean authenticateUser(String username, String password) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if(userOptional.isPresent()){
            User user = userOptional.get();
            String storedPassword = user.getPassword();
            return storedPassword.equals(password);
        }
        else {
            LOGGER.error("User with username {} not found",username);
            return false;
        }

    }
    public List<User> getAllUsers(){
        return userRepository.findAll();
    }
    public User findByUserId(Long id) {
        Optional<User> user = userRepository.findById(id);
        if(user.isEmpty()){
            LOGGER.error("User {} not found",id);
            throw new ResourceNotFoundException(User.class.getSimpleName() + " id :" + id);
        }
        return user.get();
    }
    public User getUserByUsername(String username){
        Optional<User> user = userRepository.findByUsername(username);
        if(user.isEmpty()){
            LOGGER.error("User with username {} not found",username);
            throw new ResourceNotFoundException(User.class.getSimpleName() + " username :" + username);
        }
        return user.get();
    }
    public Long insert(User user){
        ShoppingList shoppingList = new ShoppingList();
        shoppingList.setUser(user);
        user.setShoppingList(shoppingList);
        user = userRepository.save(user);
        LOGGER.debug("User {} saved", user.getId());
        return user.getId();
    }

    public User updateForm(Long id,User user){
        User userOld = this.findByUserId(id);
        userOld.setHeight(user.getHeight());
        userOld.setWeight(user.getWeight());
        userOld.setAge(user.getAge());
        userOld.setUserType(user.getUserType());
        userOld.setPreferences(user.getPreferences());
        userOld.setActivityLevel(user.getActivityLevel());
        userOld.setGoal(user.getGoal());
        return userRepository.save(userOld);
    }
    public User update(Long id,User user){
        User userOld = this.findByUserId(id);
        userOld.setHeight(user.getHeight());
        userOld.setWeight(user.getWeight());
        userOld.setAge(user.getAge());
        userOld.setName(user.getName());
        userOld.setEmail(user.getEmail());
        userOld.setUsername(user.getUsername());
        userOld.setPassword(user.getPassword());
        return userRepository.save(userOld);
    }
    public User saveMenu(Long userId,String menuContent){
        Optional<User> user = userRepository.findById(userId);
        if(user.isPresent()){
            User presentUser = user.get();
            Menu menu = new Menu(presentUser,menuContent);
            menuRepository.save(menu);
            return userRepository.save(presentUser);
        }else {
            LOGGER.error("User {} not found",userId);
            throw new ResourceNotFoundException(User.class.getSimpleName() + " id :" + userId);

        }

    }
    public List<Menu> geUserMenus(User user){
        return menuRepository.findByUser(user);
    }

    public List<User> getNutritionistUser(Nutritionist nutritionist){
        return userRepository.findByNutritionist(nutritionist);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public void deleteMenu(Long id) {
        menuRepository.deleteById(id);
    }

    public User assignNutritionist(Nutritionist nutritionist, User user){
        user.setNutritionist(nutritionist);
        return userRepository.save(user);
    }
}
