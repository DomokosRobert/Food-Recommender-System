package com.diplomaproject.backendapp.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "shoppinglist")
public class ShoppingList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ElementCollection
    @CollectionTable(name = "foods", joinColumns = @JoinColumn(name="shoppinglist_id"))
    @Column(name="item")
    private List<String> items = new ArrayList<>();

    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User user;

    public ShoppingList() {
    }

    public ShoppingList(Long id, List<String> items, User user) {
        this.id = id;
        this.items = items;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<String> getItems() {
        return items;
    }

    public void setItems(List<String> items) {
        this.items = items;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ShoppingList that = (ShoppingList) o;
        return Objects.equals(id, that.id) && Objects.equals(items, that.items) && Objects.equals(user, that.user);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, items, user);
    }

    @Override
    public String toString() {
        return "ShoppingList{" +
                "id=" + id +
                ", items=" + items +
                ", user=" + (user != null ? user.getId() : "null") +
                '}';
    }
}
