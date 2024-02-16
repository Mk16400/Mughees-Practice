// Services/RecipeService.js
import { db } from '../firebase'; // Adjust import path as necessary
import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { query, orderBy, startAfter, limit, getDocs, where, documentId } from 'firebase/firestore';

const recipeCollectionRef = collection(db, 'Raw Recipes');

// Utility function to chunk an array
const chunkArray = (array, size) => {
    const chunkedArray = [];
    let index = 0;
    while (index < array.length) {
        chunkedArray.push(array.slice(index, size + index));
        index += size;
    }
    return chunkedArray;
};

// Function to fetch recipes in chunks based on IDs
export const fetchRecipesByIds = async (recipeIds, start, limit) => {
    // Determine the slice of IDs to query for based on pagination
    const paginatedIds = recipeIds.slice(start, start + limit);
    const CHUNK_SIZE = 10; // Firestore `in` query limit remains the same
    const chunks = chunkArray(paginatedIds, CHUNK_SIZE);
    let recipes = [];

    await Promise.all(chunks.map(async (chunk) => {
        const q = query(collection(db, "Raw Recipes"), where(documentId(), 'in', chunk));
        const snapshot = await getDocs(q);
        const fetchedRecipes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        recipes = recipes.concat(fetchedRecipes);
    }));

    return recipes;
};

//============================================

// Create a new recipe
export const createRecipe = async (recipe) => {
    const recipeDocRef = doc(recipeCollectionRef, recipe.id); // Use user-defined ID
    await setDoc(recipeDocRef, recipe.toFirestore());
};

// Read a recipe by ID
export const getRecipe = async (id) => {
    const recipeDocRef = doc(recipeCollectionRef, id);
    const docSnap = await getDoc(recipeDocRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    } else {
        // Handle the case where the document does not exist
        console.log("No such document!");
    }
};
//fetchrecipepaginated
export const fetchRecipesPaginated = async (lastVisible, pageSize = 3) => {
    let q = query(recipeCollectionRef, orderBy('created_at', 'desc'), limit(pageSize));
    if (lastVisible) {
        q = query(recipeCollectionRef, orderBy('created_at', 'desc'), startAfter(lastVisible), limit(pageSize));
    }

    const documentSnapshots = await getDocs(q);
    const lastVisibleDocument = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    const recipes = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { recipes, lastVisible: lastVisibleDocument };
};

// Update a recipe
export const updateRecipe = async (id, updatedFields) => {
    const recipeDocRef = doc(recipeCollectionRef, id);
    await updateDoc(recipeDocRef, updatedFields);
};

export const upsertRecipe = async (id, recipeData) => {
    const recipeDocRef = doc(db, "Raw Recipes", id);
    await setDoc(recipeDocRef, recipeData, { merge: true });
};

// Delete a recipe
export const deleteRecipe = async (id) => {
    const recipeDocRef = doc(recipeCollectionRef, id);
    await deleteDoc(recipeDocRef);
};

// Soft Delete a recipe by setting 'deleted_at' field
export const softDeleteRecipe = async (id) => {
    const recipeDocRef = doc(recipeCollectionRef, id);
    const now = new Date();
    const deletedAt = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    await updateDoc(recipeDocRef, { deleted_at: deletedAt });
};

