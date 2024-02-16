// Models/Recipe.js
export class Recipe {
    constructor({
      id,
      nameEn,
      nameSv,
      mealId,
      minutes,
      contributorId,
      submitted,
      tagsEn = [],
      tagsSv = [],
      nutrition = [],
      totalCalories,
      updatedTotalCalories,
      nSteps,
      stepsEn = [],
      stepsSv = [],
      descriptionEn,
      ingredientsEn = [],
      ingredientIds = [],
      allergyIds = [],
      foodPreferences = [],
      nIngredients,
      thumbnail,
      thumbnailPath,
      defaultedImage,
      isHidden,
      createdAt,
      updatedAt,
      deletedAt,
    }) {
      this.id = id;
      this.nameEn = nameEn;
      this.nameSv = nameSv;
      this.mealId = mealId;
      this.minutes = minutes;
      this.contributorId = contributorId;
      this.submitted = submitted;
      this.tagsEn = tagsEn;
      this.tagsSv = tagsSv;
      this.nutrition = nutrition;
      this.totalCalories = totalCalories;
      this.updatedTotalCalories = updatedTotalCalories;
      this.nSteps = nSteps;
      this.stepsEn = stepsEn;
      this.stepsSv = stepsSv;
      this.descriptionEn = descriptionEn;
      this.ingredientsEn = ingredientsEn;
      this.ingredientIds = ingredientIds;
      this.allergyIds = allergyIds;
      this.foodPreferences = foodPreferences;
      this.nIngredients = nIngredients;
      this.thumbnail = thumbnail;
      this.thumbnailPath = thumbnailPath;
      this.defaultedImage = defaultedImage;
      this.isHidden = isHidden;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
      this.deletedAt = deletedAt;
    }
  
    // Method to convert Recipe instance to Firestore document
    toFirestore() {
      return {
        id: this.id,
        name_en: this.nameEn,
        name_sv: this.nameSv,
        meal_id: this.mealId,
        minutes: this.minutes,
        contributor_id: this.contributorId,
        submitted: this.submitted,
        tags_en: this.tagsEn,
        tags_sv: this.tagsSv,
        nutrition: this.nutrition,
        total_calories: this.totalCalories,
        updated_total_calories: this.updatedTotalCalories,
        n_steps: this.nSteps,
        steps_en: this.stepsEn,
        steps_sv: this.stepsSv,
        description_en: this.descriptionEn,
        ingredients_en: this.ingredientsEn,
        ingredient_ids: this.ingredientIds,
        allergy_ids: this.allergyIds,
        food_preferences: this.foodPreferences,
        n_ingredients: this.nIngredients,
        thumbnail: this.thumbnail,
        thumbnail_path: this.thumbnailPath,
        defaulted_image: this.defaultedImage,
        is_hidden: this.isHidden,
        created_at: this.createdAt,
        updated_at: this.updatedAt,
        deleted_at: this.deletedAt,
      };
    }
  }
  