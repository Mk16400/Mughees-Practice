import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import RecipesPaginationComponent from '../Components/RecipeRead';
import RecipeForm from '../Components/RecipeForm';
import FilteredRecipesComponent from '../Components/RecipeFilterComponent';
import RecipeDetailComponent from '../Components/RecipeDetailComponent'; // Import the RecipeDetailComponent

const drawerWidth = 240;

export default function Dashboard() {
  const [content, setContent] = useState('recipes'); // Possible values now include 'recipeDetail'
  const [selectedRecipeId, setSelectedRecipeId] = useState(null); // New state for storing selected recipe ID

  const handleContentChange = (newContent, recipeId = null) => {
    setContent(newContent);
    setSelectedRecipeId(recipeId); // Set the selected recipe ID when changing to 'recipeDetail'
  };

  const showRecipeDetail = (recipeId) => {
    setSelectedRecipeId(recipeId);
    setContent('recipeDetail');
  };
  
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Cedric Admin Dashboard
          </Typography>
          <Button color="inherit" onClick={() => handleContentChange('recipes')}>
            Back
          </Button>
          <Button color="inherit" onClick={() => handleContentChange('addRecipe')}>
            Add New Recipe
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            mt: 8
          },
        }}
      >
        <List>
          <ListItem button onClick={() => handleContentChange('recipes')}>
            <ListItemText primary="Raw Recipes" />
          </ListItem>
          <ListItem button onClick={() => handleContentChange('filteredRecipes')}>
            <ListItemText primary="Filtered Recipes" />
          </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: 8
        }}
      >
        <Toolbar />
        {content === 'recipes' && <RecipesPaginationComponent />}
        {content === 'addRecipe' && <RecipeForm />}
        {content === 'filteredRecipes' && <FilteredRecipesComponent onShowDetail={showRecipeDetail} />}
        {content === 'recipeDetail' && <RecipeDetailComponent recipeId={selectedRecipeId} onBack={() => setContent('recipes')} />}
      </Box>
    </Box>
  );
}
