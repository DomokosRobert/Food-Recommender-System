package com.diplomaproject.backendapp.repos;

import com.diplomaproject.backendapp.entities.Menu;
import com.diplomaproject.backendapp.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuRepository extends JpaRepository<Menu, Long> {
    List<Menu> findByUser(User user);


}
