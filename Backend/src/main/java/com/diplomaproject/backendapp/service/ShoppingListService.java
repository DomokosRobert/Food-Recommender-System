package com.diplomaproject.backendapp.service;

import com.diplomaproject.backendapp.entities.ShoppingList;
import com.diplomaproject.backendapp.entities.User;
import com.diplomaproject.backendapp.repos.ShoppingListRepository;
import org.springframework.stereotype.Service;

@Service
public class ShoppingListService {
    private final ShoppingListRepository shoppingListRepository;

    public ShoppingListService(ShoppingListRepository shoppingListRepository){
        this.shoppingListRepository = shoppingListRepository;
    }

    public ShoppingList addItem(ShoppingList shoppingList, String item){
        shoppingList.getItems().add(item);
        return shoppingListRepository.save(shoppingList);

    }
    public ShoppingList removeItem(ShoppingList shoppingList,String item){
        shoppingList.getItems().remove(item);
        return shoppingListRepository.save(shoppingList);
    }

    public ShoppingList getShoppingListByUser(User user){
        return shoppingListRepository.findByUser(user);
    }

}
