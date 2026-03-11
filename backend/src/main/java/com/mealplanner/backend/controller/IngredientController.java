package com.mealplanner.backend.controller;

import com.mealplanner.backend.model.Ingredient;
import com.mealplanner.backend.service.IngredientService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ingredients")
public class IngredientController {
    
    @Autowired
    private IngredientService ingredientService;
    
    @PostMapping
    public ResponseEntity<Ingredient> createIngredient(@Valid @RequestBody Ingredient ingredient, 
                                                        Authentication authentication) {
        return ResponseEntity.ok(ingredientService.createIngredient(ingredient, authentication.getName()));
    }
    
    @GetMapping
    public ResponseEntity<List<Ingredient>> getAllIngredients(Authentication authentication) {
        return ResponseEntity.ok(ingredientService.getAllIngredients(authentication.getName()));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Ingredient> updateIngredient(@PathVariable Long id, 
                                                        @Valid @RequestBody Ingredient ingredient,
                                                        Authentication authentication) {
        return ResponseEntity.ok(ingredientService.updateIngredient(id, ingredient, authentication.getName()));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIngredient(@PathVariable Long id, Authentication authentication) {
        ingredientService.deleteIngredient(id, authentication.getName());
        return ResponseEntity.ok().build();
    }
}