//Components/RecipeRead.js
import React, { useState, useEffect } from 'react';
import { fetchRecipesPaginated, softDeleteRecipe } from '../Services/RecipeService'; // Ensure you import softDeleteRecipe
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // For notifications

const RecipesPaginationComponent = () => {
    const [recipes, setRecipes] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true); // State to track if more recipes are available

    const loadRecipes = async () => {
        if (!hasMore || loading) return; // Also check if already loading

        setLoading(true);
        const { recipes: newRecipes, lastVisible: newLastVisible } = await fetchRecipesPaginated(lastVisible, 10);

        setRecipes((prevRecipes) => {
            const existingIds = new Set(prevRecipes.map(r => r.id));
            const filteredNewRecipes = newRecipes.filter(r => !existingIds.has(r.id));
            return [...prevRecipes, ...filteredNewRecipes];
        });

        setLastVisible(newLastVisible);
        setHasMore(newRecipes.length === 10);
        setLoading(false);
    };

    useEffect(() => {
        loadRecipes();
    }, []); // Empty dependency array means this effect runs once after the initial render      

    const formatDate = (date) => date ? new Date(date).toLocaleDateString() : 'N/A';
    const formatArray = (array) => {
        if (!Array.isArray(array)) {
            // Return a default string or handle the case appropriately if it's not an array
            return 'N/A'; // or return String(array) if it's a valid string that needs to be displayed
        }
        return array.join(', ');
    };

    const formatBoolean = (bool) => bool ? 'Yes' : 'No';

    // Inside the RecipesPaginationComponent function, before the return statement:
    const navigate = useNavigate();

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this recipe?')) {
            await softDeleteRecipe(id); // Use soft delete
            toast.success('Recipe soft-deleted successfully');
            // Optionally, refresh the list or indicate the recipe is deleted
            setRecipes(recipes.map(recipe => recipe.id === id ? { ...recipe, deleted_at: new Date().toISOString() } : recipe));
        }
    };
    return (
        <div className="flex flex-col items-center overflow-hidden">
            <div className="w-full max-w-6xl overflow-x-auto">
                <table className="min-w-full text-sm divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name (EN)</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name (SV)</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meal ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preparation Time</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contributor ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">English Tags</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Swedish Tags</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nutrition Information</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Calories</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated Total Calories</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number of Steps</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">English Steps</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Swedish Steps</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description (EN)</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ingredients (EN)</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ingredient IDs</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allergy IDs</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food Preferences</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number of Ingredients</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thumbnail</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thumbnail Path</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Defaulted Image</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Is Hidden</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deleted At</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {recipes.map((recipe) => (
                            <tr key={recipe.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{recipe.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{recipe.name_en || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{recipe.name_sv || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{recipe.meal_id || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{recipe.minutes || 0} minutes</td>
                                <td className="px-6 py-4 whitespace-nowrap">{recipe.contributor_id || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{formatDate(recipe.submitted)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{formatArray(recipe.tags_en)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{formatArray(recipe.tags_sv)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {/* Listing nutrition information */}
                                    {recipe.nutrition && recipe.nutrition.length > 0
                                        ? recipe.nutrition.map(n => `${n.name}: ${n.amount}${n.unit}`).join(', ')
                                        : 'N/A'}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">{recipe.total_calories || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{recipe.updated_total_calories || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{recipe.n_steps || 0}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {/* Listing steps in English */}
                                    {recipe.steps_en ? recipe.steps_en.join(', ') : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {/* Listing steps in Swedish */}
                                    {recipe.steps_sv ? recipe.steps_sv.join(', ') : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {recipe.description_en || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {/* Listing ingredients in English */}
                                    {recipe.ingredients_en ? recipe.ingredients_en.join(', ') : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{formatArray(recipe.ingredient_ids)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{formatArray(recipe.allergy_ids)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{formatArray(recipe.food_preferences)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{recipe.n_ingredients || 0}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {recipe.thumbnail && <img src={recipe.thumbnail} alt="Recipe Thumbnail" className="w-16 h-16 rounded" />}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{recipe.thumbnail_path || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{formatBoolean(recipe.defaulted_image)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{formatBoolean(recipe.is_hidden)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{formatDate(recipe.created_at)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{formatDate(recipe.updated_at)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{formatDate(recipe.deleted_at)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => navigate('/recipeform', { state: { recipeId: recipe } })}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        Update
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => handleDelete(recipe.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button
                onClick={() => loadRecipes()}
                disabled={loading}
                className="mt-4 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                {loading ? 'Loading...' : 'Load More'}
            </button>
        </div>
    );
};

export default RecipesPaginationComponent;
