package com.diplomaproject.backendapp.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.Objects;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="username",unique = true)
    private String username;

    @Column(name="password",nullable = false)
    private String password;

    @Column(name="name")
    private String name;

    @Column(name="email")
    private String email;

    @Column(name="height")
    private Double height;

    @Column(name="weight")
    private Double weight;

    @Column(name="age")
    private Integer age;

    @Column(name="userType")
    private UserType userType;

    @Column(name="preferences")
    private String preferences;

    @Column(name="activityLevel")
    private ActivityLevel activityLevel;

    @Column(name="goal")
    private Goal goal;

    @ManyToOne
    @JoinColumn(name="nutritionist_id")
    private Nutritionist nutritionist;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private ShoppingList shoppingList;

    public User(Long id, String username, String password, String name, String email, Double height, Double weight, Integer age, UserType userType, String preferences, ActivityLevel activityLevel, Nutritionist nutritionist, ShoppingList shoppingList, Goal goal) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.name = name;
        this.email = email;
        this.height = height;
        this.weight = weight;
        this.age = age;
        this.userType = userType;
        this.preferences = preferences;
        this.activityLevel = activityLevel;
        this.nutritionist = nutritionist;
        this.shoppingList = shoppingList;
        this.goal = goal;
    }

    public Goal getGoal() {
        return goal;
    }

    public void setGoal(Goal goal) {
        this.goal = goal;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public User(Long id, String username, String password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }

    public User(){

    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Double getHeight() {
        return height;
    }

    public void setHeight(Double height) {
        this.height = height;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public UserType getUserType() {
        return userType;
    }

    public void setUserType(UserType userType) {
        this.userType = userType;
    }

    public String getPreferences() {
        return preferences;
    }

    public void setPreferences(String preferences) {
        this.preferences = preferences;
    }

    public ActivityLevel getActivityLevel() {
        return activityLevel;
    }

    public void setActivityLevel(ActivityLevel activityLevel) {
        this.activityLevel = activityLevel;
    }

    public Nutritionist getNutritionist() {
        return nutritionist;
    }

    public void setNutritionist(Nutritionist nutritionist) {
        this.nutritionist = nutritionist;
    }

    public ShoppingList getShoppingList() {
        return shoppingList;
    }

    public void setShoppingList(ShoppingList shoppingList) {
        this.shoppingList = shoppingList;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id) && Objects.equals(username, user.username) && Objects.equals(password, user.password) && Objects.equals(name, user.name) && Objects.equals(email, user.email) && Objects.equals(height, user.height) && Objects.equals(weight, user.weight) && Objects.equals(age, user.age) && userType == user.userType && Objects.equals(preferences, user.preferences) && activityLevel == user.activityLevel && goal == user.goal && Objects.equals(nutritionist, user.nutritionist) && Objects.equals(shoppingList, user.shoppingList);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, username, password, name, email, height, weight, age, userType, preferences, activityLevel, goal, nutritionist, shoppingList);
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", height=" + height +
                ", weight=" + weight +
                ", age=" + age +
                ", userType=" + userType +
                ", preferences='" + preferences + '\'' +
                ", activityLevel=" + activityLevel +
                ", goal=" + goal +
                ", nutritionist=" + nutritionist +
                ", shoppingList=" + shoppingList +
                '}';
    }
}
