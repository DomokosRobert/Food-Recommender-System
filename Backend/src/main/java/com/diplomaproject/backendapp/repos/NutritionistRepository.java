package com.diplomaproject.backendapp.repos;

import com.diplomaproject.backendapp.entities.Nutritionist;
import com.diplomaproject.backendapp.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NutritionistRepository extends JpaRepository<Nutritionist, Long> {

    Optional<Nutritionist> findByUsername(String username);
}
