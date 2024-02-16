import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Ensure correct path
import { collection, query, getDocs } from 'firebase/firestore';

const IngredientSelector = ({ onIngredientSelect }) => {
    const [ingredients, setIngredients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchIngredients = async () => {
            setLoading(true);
            const q = query(collection(db, 'ingredients'));
            const querySnapshot = await getDocs(q);
            setIngredients(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        };

        fetchIngredients();
    }, []);

    return (
        <div className="">
            <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded mt-2 shadow-sm focus:outline-none focus:border-blue-500 transition duration-150 ease-in-out"
                placeholder="Search Ingredients"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {loading ? (
                <div className="text-center py-4">Loading...</div>
            ) : (
                <div className="border border-gray-300 rounded-md mt-2 shadow">

                    <ul className="max-h-60 overflow-auto mt-2">
                        {ingredients.filter(ingredient => ingredient.ingredient_name_en.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map(ingredient => (
                                <li
                                    key={ingredient.id}
                                    onClick={() => onIngredientSelect(ingredient)}
                                    className="p-2 hover:bg-gray-100 cursor-pointer transition duration-150 ease-in-out"
                                >
                                    {ingredient.ingredient_name_en}
                                </li>
                            ))}
                    </ul>
                </div>

            )}
        </div>
    );
};

export default IngredientSelector;
