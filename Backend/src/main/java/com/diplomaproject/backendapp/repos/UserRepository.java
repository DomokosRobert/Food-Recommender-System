package com.diplomaproject.backendapp.repos;

import com.diplomaproject.backendapp.entities.Menu;
import com.diplomaproject.backendapp.entities.Nutritionist;
import com.diplomaproject.backendapp.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);
    List<User> findByNutritionist(Nutritionist nutritionist);

}
