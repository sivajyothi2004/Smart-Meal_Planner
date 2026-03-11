package com.mealplanner.backend.service;

import com.mealplanner.backend.model.Ingredient;
import com.mealplanner.backend.model.Meal;
import com.mealplanner.backend.model.MealIngredient;
import com.mealplanner.backend.model.User;
import com.mealplanner.backend.repository.IngredientRepository;
import com.mealplanner.backend.repository.MealRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;

@Service
public class MealService {
    
    @Autowired
    private MealRepository mealRepository;
    
    @Autowired
    private IngredientRepository ingredientRepository;
    
    @Autowired
    private UserService userService;
    
    @Transactional
    public Meal createMeal(Meal meal, List<Map<String, Object>> ingredients, String email) {
        User user = userService.getUserByEmail(email);
        meal.setUser(user);
        Meal savedMeal = mealRepository.save(meal);
        
        for (Map<String, Object> item : ingredients) {
            Long ingredientId = Long.valueOf(item.get("ingredientId").toString());
            Double quantity = Double.valueOf(item.get("quantity").toString());
            String unit = item.get("unit").toString();
            
            Ingredient ingredient = ingredientRepository.findById(ingredientId)
                    .orElseThrow(() -> new RuntimeException("Ingredient not found"));
            
            MealIngredient mealIngredient = new MealIngredient();
            mealIngredient.setMeal(savedMeal);
            mealIngredient.setIngredient(ingredient);
            mealIngredient.setQuantity(quantity);
            mealIngredient.setUnit(unit);
            
            savedMeal.getMealIngredients().add(mealIngredient);
        }
        
        return mealRepository.save(savedMeal);
    }
    
    public List<Meal> getAllMeals(String email) {
        User user = userService.getUserByEmail(email);
        return mealRepository.findByUser(user);
    }
    
    public List<Meal> getMealsByType(Meal.MealType mealType, String email) {
        User user = userService.getUserByEmail(email);
        return mealRepository.findByUserAndMealType(user, mealType);
    }
    
    public Meal getMealById(Long id, String email) {
        User user = userService.getUserByEmail(email);
        Meal meal = mealRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meal not found"));
        
        if (!meal.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        return meal;
    }
    
    @Transactional
    public Meal updateMeal(Long id, Meal updatedMeal, List<Map<String, Object>> ingredients, String email) {
        User user = userService.getUserByEmail(email);
        Meal meal = mealRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meal not found"));
        
        if (!meal.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        meal.setName(updatedMeal.getName());
        meal.setMealType(updatedMeal.getMealType());
        meal.getMealIngredients().clear();
        
        for (Map<String, Object> item : ingredients) {
            Long ingredientId = Long.valueOf(item.get("ingredientId").toString());
            Double quantity = Double.valueOf(item.get("quantity").toString());
            String unit = item.get("unit").toString();
            
            Ingredient ingredient = ingredientRepository.findById(ingredientId)
                    .orElseThrow(() -> new RuntimeException("Ingredient not found"));
            
            MealIngredient mealIngredient = new MealIngredient();
            mealIngredient.setMeal(meal);
            mealIngredient.setIngredient(ingredient);
            mealIngredient.setQuantity(quantity);
            mealIngredient.setUnit(unit);
            
            meal.getMealIngredients().add(mealIngredient);
        }
        
        return mealRepository.save(meal);
    }
    
    public void deleteMeal(Long id, String email) {
        User user = userService.getUserByEmail(email);
        Meal meal = mealRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meal not found"));
        
        if (!meal.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        mealRepository.delete(meal);
    }
}