//Components/RecipeForm.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { upsertRecipe } from '../Services/RecipeService';
import { ToastContainer, toast } from 'react-toastify';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import IngredientSelector from './IngredientSelector'; //

function formatDateToISO(dateString) {
    // For 'submitted' date conversion
    if (!dateString || dateString.includes("-")) return dateString?.split(" ")[0]; // If it's already in ISO format, return just the date part
    const parts = dateString.split("/");
    const year = parts[2];
    const month = parts[0].padStart(2, '0'); // Ensure month is 2 digits
    const day = parts[1].padStart(2, '0'); // Ensure day is 2 digits
    return `${year}-${month}-${day}`;
}

const RecipeForm = () => {
    const navigate = useNavigate(); // Initialize navigate function
    const location = useLocation(); // Access location to get state
    const recipeToEdit = location.state?.recipeId; // Adjust according to the actual structure

    const [selectedIngredients, setSelectedIngredients] = useState([]);

    const initialState = recipeToEdit ? {
        id: recipeToEdit.id,
        nameEn: recipeToEdit.name_en || '',
        nameSv: recipeToEdit.name_sv || '',
        mealId: recipeToEdit.meal_id || '',
        minutes: recipeToEdit.minutes.toString() || '',
        contributorId: recipeToEdit.contributor_id || '',
        submitted: formatDateToISO(recipeToEdit.submitted),
        tagsEn: recipeToEdit.tags_en ? recipeToEdit.tags_en.map(tag => tag.replace(/^"|"$/g, '')) : [],
        tagsSv: recipeToEdit.tags_sv ? recipeToEdit.tags_sv.map(tag => tag.replace(/^"|"$/g, '')) : [],
        nutrition: recipeToEdit.nutrition ? recipeToEdit.nutrition.map(nutrient => `${nutrient}`) : [],
        totalCalories: recipeToEdit.total_calories || '',
        updatedTotalCalories: recipeToEdit.updated_total_calories || '',
        nSteps: recipeToEdit.n_steps.toString() || '',
        stepsEn: recipeToEdit.steps_en ? recipeToEdit.steps_en.map(step => step.replace(/^"|"$/g, '')) : [],
        stepsSv: recipeToEdit.steps_sv ? recipeToEdit.steps_sv.map(step => step.replace(/^"|"$/g, '')) : [],
        descriptionEn: recipeToEdit.description_en || '',
        ingredientsEn: recipeToEdit.ingredients_en ? recipeToEdit.ingredients_en.map(ingredient => ingredient.replace(/^"|"$/g, '')) : [],
        ingredientIds: recipeToEdit.ingredient_ids ? recipeToEdit.ingredient_ids.map(id => id.toString()) : [],
        allergyIds: recipeToEdit.allergy_ids ? recipeToEdit.allergy_ids.map(id => id.toString()) : [],
        foodPreferences: recipeToEdit.food_preferences ? recipeToEdit.food_preferences.map(pref => pref.toString()) : [],
        nIngredients: recipeToEdit.n_ingredients.toString() || '',
        thumbnail: recipeToEdit.thumbnail || '',
        thumbnailPath: recipeToEdit.thumbnail_path || '',
        defaultedImage: recipeToEdit.defaulted_image.toString() || '',
        isHidden: recipeToEdit.is_hidden.toString() || 'false', // Assuming '0' is false and '1' is true, adjust logic if needed
        createdAt: recipeToEdit.created_at?.split(" ")[0] || '', // Assuming you only need the date part for the form
        updatedAt: recipeToEdit.updated_at?.split(" ")[0] || '',
        deletedAt: recipeToEdit.deleted_at || ''
    } : {
        id: '',
        nameEn: '',
        nameSv: '',
        mealId: '',
        minutes: '',
        contributorId: '',
        submitted: '',
        tagsEn: [],
        tagsSv: [],
        nutrition: [],
        totalCalories: '',
        updatedTotalCalories: '',
        nSteps: '',
        stepsEn: [],
        stepsSv: [],
        descriptionEn: '',
        ingredientsEn: [],
        ingredientIds: [],
        allergyIds: [],
        foodPreferences: [],
        nIngredients: '',
        thumbnail: '',
        thumbnailPath: '',
        defaultedImage: '',
        isHidden: '',
        createdAt: '',
        updatedAt: '',
        deletedAt: ''
    };

    const [recipeDetails, setRecipeDetails] = useState(initialState);
    const [tempInput, setTempInput] = useState({});
    const [errors, setErrors] = useState({});

    // const validate = () => {
    //     let tempErrors = {};
    //     // Required fields example
    //     if (!recipeDetails.nameEn.trim()) tempErrors.nameEn = "Name (EN) is required.";
    //     if (!recipeDetails.contributorId.trim()) tempErrors.contributorId = "Contributor ID is required.";
    //     // Add more validations as needed

    //     // Array fields should have at least one entry example
    //     if (recipeDetails.tagsEn.length === 0) tempErrors.tagsEn = "At least one tag in English is required.";
    //     // Implement similar checks for other array fields and any specific validation rules

    //     setErrors(tempErrors);
    //     return Object.keys(tempErrors).length === 0; // Returns true if no errors
    // };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecipeDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
        // Optionally clear errors on change
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const handleArrayInputChange = (e) => {
        const { name, value } = e.target;
        setTempInput({ ...tempInput, [name]: value });
    };

    const handleAddItem = (fieldName) => {
        if (!tempInput[fieldName]?.trim()) return;
        setRecipeDetails((prevDetails) => ({
            ...prevDetails,
            [fieldName]: [...prevDetails[fieldName], tempInput[fieldName]],
        }));
        setTempInput({ ...tempInput, [fieldName]: '' }); // Clear input after adding
    };

    const handleRemoveItem = (fieldName, index) => {
        setRecipeDetails((prevDetails) => ({
            ...prevDetails,
            [fieldName]: prevDetails[fieldName].filter((_, i) => i !== index),
        }));
    };

    const handleIngredientSelect = (ingredient) => {
        if (!selectedIngredients.find(i => i.id === ingredient.id)) {
            setSelectedIngredients(prev => [...prev, ingredient]);
            setRecipeDetails(prevDetails => ({
                ...prevDetails,
                ingredientsEn: [...prevDetails.ingredientsEn, ingredient.ingredient_name_en],
                ingredientIds: [...prevDetails.ingredientIds, ingredient.id]
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if (!validate()) {
        //     toast.error("Please correct the errors before submitting.");
        //     return;
        // }
        try {
            // Prepare your form data for Firestore
            const formData = {
                id: recipeDetails.id, // Assuming ID is manually entered or existing one is used for updates
                name_en: recipeDetails.nameEn,
                name_sv: recipeDetails.nameSv,
                meal_id: recipeDetails.mealId,
                minutes: parseInt(recipeDetails.minutes, 10),
                contributor_id: recipeDetails.contributorId,
                submitted: recipeDetails.submitted, // Ensure this is in YYYY-MM-DD format
                tags_en: recipeDetails.tagsEn.map(tag => tag.trim()), // Assuming tagsEn is an array
                tags_sv: recipeDetails.tagsSv.map(tag => tag.trim()), // Assuming tagsSv is an array
                nutrition: recipeDetails.nutrition.map(n => parseFloat(n)), // Convert string to number
                total_calories: parseFloat(recipeDetails.totalCalories),
                updated_total_calories: parseFloat(recipeDetails.updatedTotalCalories),
                n_steps: parseInt(recipeDetails.nSteps, 10),
                steps_en: recipeDetails.stepsEn.map(step => step.trim()),
                steps_sv: recipeDetails.stepsSv.map(step => step.trim()),
                description_en: recipeDetails.descriptionEn,
                ingredients_en: recipeDetails.ingredientsEn.map(ingredient => ingredient.trim()),
                ingredient_ids: recipeDetails.ingredientIds.map(id => parseInt(id, 10)),
                allergy_ids: recipeDetails.allergyIds.map(id => parseInt(id, 10)),
                food_preferences: recipeDetails.foodPreferences.map(pref => parseInt(pref, 10)),
                n_ingredients: parseInt(recipeDetails.nIngredients, 10),
                thumbnail: recipeDetails.thumbnail, // Handle file uploads separately if needed
                thumbnail_path: recipeDetails.thumbnailPath,
                defaulted_image: recipeDetails.defaultedImage === 'true',
                is_hidden: recipeDetails.isHidden === 'true',
                created_at: recipeDetails.createdAt, // Ensure this is in YYYY-MM-DD format
                updated_at: recipeDetails.updatedAt, // Ensure this is in YYYY-MM-DD format
                // 'deleted_at' should only be set during soft delete operations, not here
            };

            await upsertRecipe(recipeDetails.id || doc().id, formData); // Use Firestore generated ID for new recipes if no ID provided
            toast.success('Recipe saved successfully');
            // Redirect or perform additional actions as needed
            navigate('/dashboard');
        } catch (error) {
            console.error("Error saving recipe:", error);
            toast.error(`Error saving recipe: ${error.message}`);
        }
    };

    const renderArrayField = (fieldName) => {
        // Ensure the field exists and is an array; otherwise, use an empty array
        const items = Array.isArray(recipeDetails[fieldName]) ? recipeDetails[fieldName] : [];
        return (
            <div className="flex flex-col gap-2">
                {items.map((item, index) => (
                    <div key={`${fieldName}-${index}`} className="flex items-center justify-between">
                        <span className="text-gray-700">{item}</span>
                        <button type="button" onClick={() => handleRemoveItem(fieldName, index)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                            Remove
                        </button>
                    </div>
                ))}
                <input
                    type="text"
                    name={fieldName}
                    value={tempInput[fieldName] || ''}
                    onChange={handleArrayInputChange}
                    placeholder={`Add new ${fieldName}`}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button type="button" onClick={() => handleAddItem(fieldName)} className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Add
                </button>
            </div>
        );
    };


    return (
        <>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* ID Field */}
                    <div>
                        <label htmlFor="id" className="block text-gray-700 text-sm font-bold mb-2">ID:</label>
                        <input type="text" name="id" value={recipeDetails.id} onChange={handleChange} placeholder="Unique Identifier" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>

                    {/* Name (EN) Field */}
                    <div>
                        <label htmlFor="nameEn" className="block text-gray-700 text-sm font-bold mb-2">Name (EN):</label>
                        <input type="text" name="nameEn" value={recipeDetails.nameEn} onChange={handleChange} placeholder="Recipe Name in English" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>

                    {/* Name (SV) Field */}
                    <div>
                        <label htmlFor="nameSv" className="block text-gray-700 text-sm font-bold mb-2">Name (SV):</label>
                        <input type="text" name="nameSv" value={recipeDetails.nameSv} onChange={handleChange} placeholder="Recipe Name in Swedish" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>

                    {/* Meal ID Field */}
                    <div>
                        <label htmlFor="mealId" className="block text-gray-700 text-sm font-bold mb-2">Meal ID:</label>
                        <input type="text" name="mealId" value={recipeDetails.mealId} onChange={handleChange} placeholder="Meal Identifier" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>

                    {/* Preparation Time Field */}
                    <div>
                        <label htmlFor="minutes" className="block text-gray-700 text-sm font-bold mb-2">Preparation Time (minutes):</label>
                        <input type="number" name="minutes" value={recipeDetails.minutes} onChange={handleChange} placeholder="Time in Minutes" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>

                    {/* Contributor ID Field */}
                    <div>
                        <label htmlFor="contributorId" className="block text-gray-700 text-sm font-bold mb-2">Contributor ID:</label>
                        <input type="text" name="contributorId" value={recipeDetails.contributorId} onChange={handleChange} placeholder="Identifier of the Contributor" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>

                    {/* Submitted Date Field */}
                    <div>
                        <label htmlFor="submitted" className="block text-gray-700 text-sm font-bold mb-2">Submitted Date:</label>
                        <input type="date" name="submitted" value={recipeDetails.submitted} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>

                    {/* Tags (EN) Field */}
                    <div className="col-span-2">
                        <label htmlFor="tagsEn" className="block text-gray-700 text-sm font-bold mb-2">Tags (EN):</label>
                        {renderArrayField('tagsEn')}
                    </div>

                    {/* Tags (SV) Field */}
                    <div className="col-span-2">
                        <label htmlFor="tagsSv" className="block text-gray-700 text-sm font-bold mb-2">Tags (SV):</label>
                        {renderArrayField('tagsSv')}
                    </div>

                    {/* Nutrition Field */}
                    <div className="col-span-2">
                        <label htmlFor="nutrition" className="block text-gray-700 text-sm font-bold mb-2">Nutrition:</label>
                        {renderArrayField('nutrition')}
                    </div>

                    {/* Total Calories Field */}
                    <div>
                        <label htmlFor="totalCalories" className="block text-gray-700 text-sm font-bold mb-2">Total Calories:</label>
                        <input type="number" name="totalCalories" value={recipeDetails.totalCalories} onChange={handleChange} placeholder="Total Calories" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>

                    {/* Updated Total Calories Field */}
                    <div>
                        <label htmlFor="updatedTotalCalories" className="block text-gray-700 text-sm font-bold mb-2">Updated Total Calories:</label>
                        <input type="number" name="updatedTotalCalories" value={recipeDetails.updatedTotalCalories} onChange={handleChange} placeholder="Updated Total Calories" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>

                    {/* Number of Steps Field */}
                    <div>
                        <label htmlFor="nSteps" className="block text-gray-700 text-sm font-bold mb-2">Number of Steps:</label>
                        <input type="number" name="nSteps" value={recipeDetails.nSteps} onChange={handleChange} placeholder="Number of Steps" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>

                    {/* Steps (EN) Field */}
                    <div className="col-span-2">
                        <label htmlFor="stepsEn" className="block text-gray-700 text-sm font-bold mb-2">Steps (EN):</label>
                        {renderArrayField('stepsEn')}
                    </div>

                    {/* Steps (SV) Field */}
                    <div className="col-span-2">
                        <label htmlFor="stepsSv" className="block text-gray-700 text-sm font-bold mb-2">Steps (SV):</label>
                        {renderArrayField('stepsSv')}
                    </div>

                    {/* Description (EN) Field */}
                    <div className="col-span-2">
                        <label htmlFor="descriptionEn" className="block text-gray-700 text-sm font-bold mb-2">Description (EN):</label>
                        <textarea name="descriptionEn" value={recipeDetails.descriptionEn} onChange={handleChange} placeholder="Description in English" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
                    </div>

                    {/* Ingredients (EN) Field */}
                    <IngredientSelector onIngredientSelect={handleIngredientSelect} />
                    <div className="col-span-2">
                        <label htmlFor="ingredientsEn" className="block text-gray-700 text-sm font-bold mb-2">Ingredients (EN):</label>
                        {renderArrayField('ingredientsEn')}
                    </div>

                    {/* Ingredient IDs Field */}
                    <div className="col-span-2">
                        <label htmlFor="ingredientIds" className="block text-gray-700 text-sm font-bold mb-2">Ingredient IDs:</label>
                        {renderArrayField('ingredientIds')}
                    </div>

                    {/* Allergy IDs Field */}
                    <div className="col-span-2">
                        <label htmlFor="allergyIds" className="block text-gray-700 text-sm font-bold mb-2">Allergy IDs:</label>
                        {renderArrayField('allergyIds')}
                    </div>

                    {/* Food Preferences Field */}
                    <div className="col-span-2">
                        <label htmlFor="foodPreferences" className="block text-gray-700 text-sm font-bold mb-2">Food Preferences:</label>
                        {renderArrayField('foodPreferences')}
                    </div>

                    {/* Number of Ingredients Field */}
                    <div>
                        <label htmlFor="nIngredients" className="block text-gray-700 text-sm font-bold mb-2">Number of Ingredients:</label>
                        <input type="number" name="nIngredients" value={recipeDetails.nIngredients} onChange={handleChange} placeholder="Number of Ingredients" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>

                    {/* Thumbnail Field */}
                    <div className="col-span-2">
                        <label htmlFor="thumbnail" className="block text-gray-700 text-sm font-bold mb-2">Thumbnail:</label>
                        <input type="file" name="thumbnail" onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>

                    {/* Thumbnail Path Field */}
                    <div>
                        <label htmlFor="thumbnailPath" className="block text-gray-700 text-sm font-bold mb-2">Thumbnail Path:</label>
                        <input type="text" name="thumbnailPath" value={recipeDetails.thumbnailPath} onChange={handleChange} placeholder="Path to Thumbnail" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>

                    {/* Defaulted Image Field */}
                    <div>
                        <label htmlFor="defaultedImage" className="block text-gray-700 text-sm font-bold mb-2">Defaulted Image:</label>
                        <input type="text" name="defaultedImage" value={recipeDetails.defaultedImage} onChange={handleChange} placeholder="Default Image" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>

                    {/* Is Hidden Field */}
                    <div>
                        <label htmlFor="isHidden" className="block text-gray-700 text-sm font-bold mb-2">Is Hidden:</label>
                        <select name="isHidden" value={(recipeDetails.isHidden ?? '').toString()} onChange={handleChange} className="...">
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>

                    {/* Created At Field */}
                    <div>
                        <label htmlFor="createdAt" className="block text-gray-700 text-sm font-bold mb-2">Created At:</label>
                        <input type="date" name="createdAt" value={recipeDetails.createdAt} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>

                    {/* Updated At Field */}
                    <div>
                        <label htmlFor="updatedAt" className="block text-gray-700 text-sm font-bold mb-2">Updated At:</label>
                        <input type="date" name="updatedAt" value={recipeDetails.updatedAt} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>

                    {/* Deleted At Field */}
                    {recipeDetails.deletedAt && (
                        <div>
                            <label htmlFor="deletedAt" className="block text-gray-700 text-sm font-bold mb-2">Deleted At:</label>
                            <input type="text" name="deletedAt" value={recipeDetails.deletedAt} readOnly className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                        </div>
                    )}


                    {/* Submit Button */}
                    <div className="col-span-2">
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
                            Submit Recipe
                        </button>
                    </div>
                </div>
            </form>
        </>
    );


};

export default RecipeForm;