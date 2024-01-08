package com.diplomaproject.backendapp.service;

import com.diplomaproject.backendapp.entities.Nutritionist;
import com.diplomaproject.backendapp.entities.User;
import com.diplomaproject.backendapp.repos.NutritionistRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NutritionistService {
    private final NutritionistRepository nutritionistRepository;

    private static final Logger LOGGER = LoggerFactory.getLogger(UserService.class);

    @Autowired
    public NutritionistService(NutritionistRepository nutritionistRepository) {
        this.nutritionistRepository = nutritionistRepository;
    }

    public List<Nutritionist> getAllNutritionists() {
        return nutritionistRepository.findAll();
    }

    public Nutritionist getNutritionistById(Long id) {
        return nutritionistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(Nutritionist.class.getSimpleName() + " id :" + id));
    }
    public Nutritionist getNutritionistByUsername(String username){
        Optional<Nutritionist> nutritionist = nutritionistRepository.findByUsername(username);
        if(nutritionist.isEmpty()){
            LOGGER.error("Nutritionist {} not found",username);
            throw new ResourceNotFoundException(Nutritionist.class.getSimpleName() + " username :" + username);
        }
        return nutritionist.get();
    }
    public Long insertNutritionist(Nutritionist nutritionist) {
        nutritionist = nutritionistRepository.save(nutritionist);
        LOGGER.debug("Nutritionist {} saved", nutritionist.getId());
        return nutritionist.getId();
    }
    public boolean authenticateNutritionist(String username, String password) {
        Optional<Nutritionist> nutritionistOptional = nutritionistRepository.findByUsername(username);
        if(nutritionistOptional.isPresent()){
            Nutritionist nutritionist = nutritionistOptional.get();
            String storedPassword = nutritionist.getPassword();
            return storedPassword.equals(password);
        }
        else {
            LOGGER.error("Nutritionist with username {} not found",username);
            return false;
        }

    }
    public Nutritionist updateNutritionist(Long id, Nutritionist nutritionist) {
        Nutritionist nutritionistOld = getNutritionistById(id);
        nutritionistOld.setFirstname(nutritionist.getFirstname());
        nutritionistOld.setLastname(nutritionist.getLastname());
        nutritionistOld.setUsername(nutritionist.getUsername());
        nutritionistOld.setPassword(nutritionist.getPassword());
        nutritionistOld.setEmail(nutritionist.getEmail());

        return nutritionistRepository.save(nutritionistOld);
    }

    public void deleteNutritionist(Long id) {
        nutritionistRepository.deleteById(id);
    }

}
