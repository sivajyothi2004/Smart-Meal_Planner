package com.mealplanner.backend.controller;

import com.mealplanner.backend.model.Meal;
import com.mealplanner.backend.service.MealService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/meals")
public class MealController {
    
    @Autowired
    private MealService mealService;
    
    @PostMapping
    public ResponseEntity<Meal> createMeal(@RequestBody Map<String, Object> request, 
                                           Authentication authentication) {
        Meal meal = new Meal();
        meal.setName(request.get("name").toString());
        
        if (request.containsKey("mealType")) {
            meal.setMealType(Meal.MealType.valueOf(request.get("mealType").toString()));
        }
        
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> ingredients = (List<Map<String, Object>>) request.get("ingredients");
        
        return ResponseEntity.ok(mealService.createMeal(meal, ingredients, authentication.getName()));
    }
    
    @GetMapping
    public ResponseEntity<List<Meal>> getAllMeals(
            @RequestParam(required = false) String mealType,
            Authentication authentication) {
        
        if (mealType != null && !mealType.isEmpty()) {
            return ResponseEntity.ok(mealService.getMealsByType(
                Meal.MealType.valueOf(mealType), 
                authentication.getName()
            ));
        }
        
        return ResponseEntity.ok(mealService.getAllMeals(authentication.getName()));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Meal> getMealById(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(mealService.getMealById(id, authentication.getName()));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Meal> updateMeal(@PathVariable Long id, 
                                           @RequestBody Map<String, Object> request,
                                           Authentication authentication) {
        Meal meal = new Meal();
        meal.setName(request.get("name").toString());
        
        if (request.containsKey("mealType")) {
            meal.setMealType(Meal.MealType.valueOf(request.get("mealType").toString()));
        }
        
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> ingredients = (List<Map<String, Object>>) request.get("ingredients");
        
        return ResponseEntity.ok(mealService.updateMeal(id, meal, ingredients, authentication.getName()));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMeal(@PathVariable Long id, Authentication authentication) {
        mealService.deleteMeal(id, authentication.getName());
        return ResponseEntity.ok().build();
    }
}