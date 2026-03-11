package com.mealplanner.backend.service;

import com.mealplanner.backend.model.Ingredient;
import com.mealplanner.backend.model.User;
import com.mealplanner.backend.repository.IngredientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class IngredientService {
    
    @Autowired
    private IngredientRepository ingredientRepository;
    
    @Autowired
    private UserService userService;
    
    public Ingredient createIngredient(Ingredient ingredient, String email) {
        User user = userService.getUserByEmail(email);
        
        if (ingredientRepository.findByNameAndUser(ingredient.getName(), user).isPresent()) {
            throw new RuntimeException("Ingredient already exists");
        }
        
        ingredient.setUser(user);
        return ingredientRepository.save(ingredient);
    }
    
    public List<Ingredient> getAllIngredients(String email) {
        User user = userService.getUserByEmail(email);
        return ingredientRepository.findByUser(user);
    }
    
    public Ingredient updateIngredient(Long id, Ingredient updatedIngredient, String email) {
        User user = userService.getUserByEmail(email);
        Ingredient ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ingredient not found"));
        
        if (!ingredient.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        ingredient.setName(updatedIngredient.getName());
        ingredient.setQuantity(updatedIngredient.getQuantity());
        ingredient.setUnit(updatedIngredient.getUnit());
        
        return ingredientRepository.save(ingredient);
    }
    
    public void deleteIngredient(Long id, String email) {
        User user = userService.getUserByEmail(email);
        Ingredient ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ingredient not found"));
        
        if (!ingredient.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        ingredientRepository.delete(ingredient);
    }
}