import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; // Ensure this matches your actual import path
import { doc, getDoc } from 'firebase/firestore';

const RecipeDetailComponent = ({ recipeId, onBack }) => {
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        if (recipeId) {
            const fetchRecipe = async () => {
                const docRef = doc(db, "Raw Recipes", recipeId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setRecipe(docSnap.data());
                } else {
                    console.log("No such document!");
                }
            };
            fetchRecipe();
        }
    }, [recipeId]);

    if (!recipe) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-5 bg-white rounded shadow">
            <button
                onClick={onBack}
                className="mb-5 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
            >
                Back
            </button>
            <div className="space-y-2">
                <h1 className="text-xl font-bold">{recipe.name_en}</h1>
                {recipe.thumbnail_path && (
                    <img src={recipe.thumbnail_path} alt="Recipe Thumbnail" className="w-full h-64 object-cover rounded-lg"/>
                )}
                <p><strong>Name (SV):</strong> {recipe.name_sv}</p>
                <p><strong>Meal ID:</strong> {recipe.meal_id}</p>
                <p><strong>Preparation Time:</strong> {recipe.minutes} minutes</p>
                <p><strong>Contributor ID:</strong> {recipe.contributor_id}</p>
                <p><strong>Submitted:</strong> {recipe.submitted}</p>
                <p><strong>Tags (EN):</strong> {recipe.tags_en.join(', ')}</p>
                <p><strong>Tags (SV):</strong> {recipe.tags_sv.join(', ')}</p>
                <p><strong>Description (EN):</strong> {recipe.description_en}</p>
                <p><strong>Total Calories:</strong> {recipe.total_calories}</p>
                <p><strong>Updated Total Calories:</strong> {recipe.updated_total_calories}</p>
                <p><strong>Number of Steps:</strong> {recipe.n_steps}</p>
                <p><strong>Steps (EN):</strong> {recipe.steps_en.join(', ')}</p>
                <p><strong>Steps (SV):</strong> {recipe.steps_sv.join(', ')}</p>
                <p><strong>Ingredients (EN):</strong> {recipe.ingredients_en.join(', ')}</p>
                <p><strong>Ingredient IDs:</strong> {recipe.ingredient_ids.join(', ')}</p>
                <p><strong>Allergy IDs:</strong> {recipe.allergy_ids.join(', ')}</p>
                <p><strong>Food Preferences:</strong> {recipe.food_preferences.join(', ')}</p>
                <p><strong>Number of Ingredients:</strong> {recipe.n_ingredients}</p>
                <p><strong>Defaulted Image:</strong> {recipe.defaulted_image ? 'Yes' : 'No'}</p>
                <p><strong>Is Hidden:</strong> {recipe.is_hidden ? 'Yes' : 'No'}</p>
                <p><strong>Creation Date:</strong> {recipe.created_at}</p>
                <p><strong>Last Updated:</strong> {recipe.updated_at}</p>
                {recipe.deleted_at && <p><strong>Deleted At:</strong> {recipe.deleted_at}</p>}
            </div>
        </div>
    );
};

export default RecipeDetailComponent;
