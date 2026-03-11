package com.mealplanner.backend.repository;

import com.mealplanner.backend.model.Ingredient;
import com.mealplanner.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
    List<Ingredient> findByUser(User user);
    Optional<Ingredient> findByNameAndUser(String name, User user);
}