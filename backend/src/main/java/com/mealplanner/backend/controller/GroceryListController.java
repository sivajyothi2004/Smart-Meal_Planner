package com.mealplanner.backend.controller;

import com.mealplanner.backend.model.GroceryItem;
import com.mealplanner.backend.service.GroceryListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/grocery-list")
public class GroceryListController {
    
    @Autowired
    private GroceryListService groceryListService;
    
    @PostMapping("/generate")
    public ResponseEntity<List<GroceryItem>> generateGroceryList(Authentication authentication) {
        return ResponseEntity.ok(groceryListService.generateGroceryList(authentication.getName()));
    }
    
    @GetMapping
    public ResponseEntity<List<GroceryItem>> getGroceryList(Authentication authentication) {
        return ResponseEntity.ok(groceryListService.getGroceryList(authentication.getName()));
    }
    
    @PutMapping("/{id}/bought")
    public ResponseEntity<GroceryItem> markAsBought(@PathVariable Long id, 
                                                     @RequestBody Map<String, Boolean> request,
                                                     Authentication authentication) {
        Boolean bought = request.get("bought");
        return ResponseEntity.ok(groceryListService.markAsBought(id, bought, authentication.getName()));
    }
    
    @DeleteMapping
    public ResponseEntity<Void> clearGroceryList(Authentication authentication) {
        groceryListService.clearGroceryList(authentication.getName());
        return ResponseEntity.ok().build();
    }
}