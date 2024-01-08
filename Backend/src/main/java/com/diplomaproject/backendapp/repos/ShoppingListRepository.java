package com.diplomaproject.backendapp.repos;

import com.diplomaproject.backendapp.entities.ShoppingList;
import com.diplomaproject.backendapp.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShoppingListRepository extends JpaRepository<ShoppingList,Long> {
    ShoppingList findByUser(User user);
}
