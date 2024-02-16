import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { fetchRecipesByIds, softDeleteRecipe } from '../Services/RecipeService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner'; // Correct import statement

const RecipeFilterComponent = ({ onShowDetail, onEditRecipe }) => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [recipesPerPage] = useState(10);
    const [foodPreference, setFoodPreference] = useState('vegetarian');
    const [mealType, setMealType] = useState('Breakfast');
    const [searchTerm, setSearchTerm] = useState(''); // Added state for search term

    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true); // Trigger loading state on preference change
        const fetchRecipeIdsAndDetails = async () => {
            try {
                const recipeIdsSnapshot = await getDocs(collection(db, `${foodPreference}${mealType}`));
                const recipeIds = recipeIdsSnapshot.docs.map(doc => doc.id);

                if (recipeIds.length > 0) {
                    const startIndex = (currentPage - 1) * recipesPerPage;
                    const detailedRecipes = await fetchRecipesByIds(recipeIds, startIndex, recipesPerPage);
                    setRecipes(detailedRecipes);
                } else {
                    setRecipes([]);
                }
            } catch (error) {
                console.error("Error fetching recipe details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipeIdsAndDetails();
    }, [foodPreference, mealType, currentPage]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this recipe?')) {
            await softDeleteRecipe(id);
            toast.success('Recipe soft-deleted successfully');
            setRecipes(recipes.filter(recipe => recipe.id !== id));
        }
    };

    const nextPage = () => setCurrentPage(prev => prev + 1);
    const prevPage = () => setCurrentPage(prev => prev > 1 ? prev - 1 : 1);

    // Filter recipes based on search term
    const filteredRecipes = searchTerm
        ? recipes.filter(recipe =>
            recipe.name_en.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : recipes;

    return (
        <div className="p-5">
            <div className="flex flex-wrap gap-3 mb-4">
                {/* Search Input */}
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                    placeholder="Search recipes..."
                />
                <select
                    value={foodPreference}
                    onChange={(e) => setFoodPreference(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                >
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="pescatarian">Pescatarian</option>
                    <option value="regular">Regular</option>
                </select>
                <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                </select>
            </div>

            {loading ? (
                <div className="flex justify-center items-center">
                    <ThreeDots
                        color="#00BFFF" // Loader color
                        height={100} // Height of the loader
                        width={100} // Width of the loader
                    />
                </div>
            ) : filteredRecipes.length > 0 ? (
                <>
                    {/* Recipes List */}
                    {filteredRecipes.map(recipe => (
                        <div key={recipe.id} className="flex items-center justify-between bg-white shadow rounded-lg p-4 mb-4">
                            <div className="flex-grow">
                                <h2 className="text-lg font-semibold">{recipe.name_en}</h2>
                                <p className="text-sm text-gray-600">Recipe ID: {recipe.id}</p>
                            </div>
                            <div className="flex-shrink-0 ml-4">
                                <button
                                    onClick={() => onShowDetail(recipe.id)}
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 mr-2"
                                >
                                    View Detail
                                </button>
                                <button
                                    onClick={() => navigate('/recipeform', { state: { recipeId: recipe } })}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(recipe.id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Pagination */}
                    <div className="flex justify-between mt-4">
                        <button onClick={prevPage} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Previous</button>
                        <button onClick={nextPage} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Next</button>
                    </div>
                </>
            ) : (
                <p>No recipes found.</p>
            )}
        </div>
    );
};

export default RecipeFilterComponent;


// ///////////////////////////////////////////////////////
// import React, { useState, useEffect } from 'react';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from '../firebase';
// import { fetchRecipesByIds, softDeleteRecipe } from '../Services/RecipeService';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';

// const RecipeListComponent = () => {
//     const [recipes, setRecipes] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [recipesPerPage] = useState(10);
//     const [foodPreference, setFoodPreference] = useState('vegetarian');
//     const [mealType, setMealType] = useState('Breakfast');

//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchRecipeIdsAndDetails = async () => {
//             try {
//                 const recipeIdsSnapshot = await getDocs(collection(db, `${foodPreference}${mealType}`));
//                 const recipeIds = recipeIdsSnapshot.docs.map(doc => doc.id);

//                 if (recipeIds.length > 0) {
//                     const startIndex = (currentPage - 1) * recipesPerPage;
//                     const detailedRecipes = await fetchRecipesByIds(recipeIds, startIndex, recipesPerPage);
//                     setRecipes(detailedRecipes);
//                 } else {
//                     setRecipes([]);
//                 }
//             } catch (error) {
//                 console.error("Error fetching recipe details:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchRecipeIdsAndDetails();
//     }, [foodPreference, mealType, currentPage]);

//     const handleDelete = async (id) => {
//         if (window.confirm('Are you sure you want to delete this recipe?')) {
//             await softDeleteRecipe(id);
//             toast.success('Recipe soft-deleted successfully');
//             setRecipes(recipes.filter(recipe => recipe.id !== id));
//         }
//     };

//     const nextPage = () => setCurrentPage(prev => prev + 1);
//     const prevPage = () => setCurrentPage(prev => prev > 1 ? prev - 1 : 1);

//     return (
//         <div className="p-5">
//             <div className="flex flex-wrap gap-3 mb-4">
//                 {/* Food Preference Selector */}
//                 <select
//                     value={foodPreference}
//                     onChange={(e) => setFoodPreference(e.target.value)}
//                     className="p-2 border border-gray-300 rounded"
//                 >
//                     <option value="vegetarian">Vegetarian</option>
//                     <option value="vegan">Vegan</option>
//                     <option value="pescatarian">Pescatarian</option>
//                     <option value="regular">Regular</option>
//                 </select>

//                 {/* Meal Type Selector */}
//                 <select
//                     value={mealType}
//                     onChange={(e) => setMealType(e.target.value)}
//                     className="p-2 border border-gray-300 rounded"
//                 >
//                     <option value="Breakfast">Breakfast</option>
//                     <option value="Lunch">Lunch</option>
//                     <option value="Dinner">Dinner</option>
//                 </select>
//             </div>

//             {/* Loading and Recipe List Display */}
//             {loading ? (
//                 <p className="text-blue-500 font-semibold">Loading recipes...</p>
//             ) : recipes.length > 0 ? (
//                 <div>
//                     {/* Recipes Table */}
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name (EN)</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name (SV)</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meal ID</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minutes</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contributor ID</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags (EN)</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags (SV)</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nutrition</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Calories</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated Total Calories</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number of Steps</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Steps (EN)</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Steps (SV)</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description (EN)</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ingredients (EN)</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ingredient IDs</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allergy IDs</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food Preferences</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number of Ingredients</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thumbnail</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Defaulted Image</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Is Hidden</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deleted At</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {recipes.map(recipe => (
//                                     <tr key={recipe.id}>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recipe.id}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recipe.name_en}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recipe.name_sv}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recipe.meal_id}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recipe.minutes}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recipe.contributor_id}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recipe.submitted}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recipe.tags_en.join(', ')}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recipe.tags_sv.join(', ')}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recipe.nutrition.map(nutrient => `${nutrient.name}: ${nutrient.amount}${nutrient.unit}`).join(', ')}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recipe.total_calories}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recipe.updated_total_calories}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recipe.n_steps}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recipe.steps_en.join(', ')}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recipe.steps_sv.join(', ')}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recipe.description_en}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recipe.ingredients_en.join(', ')}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recipe.ingredient_ids.join(', ')}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recipe.allergy_ids.join(', ')}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recipe.food_preferences.join(', ')}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recipe.n_ingredients}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                             <img src={recipe.thumbnail_path} alt="Recipe Thumbnail" className="h-10 w-10 rounded-full" />
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recipe.defaulted_image ? 'Yes' : 'No'}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recipe.is_hidden ? 'Yes' : 'No'}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recipe.created_at}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recipe.updated_at}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recipe.deleted_at}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>

//                     </div>

//                     {/* Pagination Controls */}
//                     <div className="flex justify-between mt-4">
//                         <button onClick={prevPage} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Previous</button>
//                         <button onClick={nextPage} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Next</button>
//                     </div>
//                 </div>
//             ) : (
//                 <p>No recipes found.</p>
//             )}
//         </div>
//     );
// };

// export default RecipeListComponent;






