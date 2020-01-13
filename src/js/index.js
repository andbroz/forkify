// API http://forkify-api.herokuapp.com/

import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app
 *  - Search object
 *  - Current recipe obj
 *  - Shopping list obj
 *  - Linked recipes
 */
const state = {};

// Functions

/**
 * Search Controller
 */
const controlSearch = async () => {
	// get query from view

	const query = searchView.getInput();

	if (query) {
		// new search obj and add state
		state.search = new Search(query);

		// prepare UI for results
		searchView.clearInput();
		searchView.clearResults();
		renderLoader(elements.searchRes);

		// search for recipes
		try {
			await state.search.getResults();

			// render results on UI
			clearLoader();
			if (state.search.result) {
				searchView.renderResults(state.search.result);
			}
		} catch (err) {
			clearLoader();
			console.error(err);
		}
	}
};

// Event Listeners

// Search form
elements.searchForm.addEventListener('submit', e => {
	e.preventDefault();
	controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
	const btn = e.target.closest('.btn-inline');
	if (btn) {
		const goToPage = parseInt(btn.dataset.goto, 10);
		searchView.clearResults();
		searchView.renderResults(state.search.result, goToPage);
	}
});

/**
 * Recipe Controller
 */

const controlRecipe = async () => {
	const id = window.location.hash.replace('#', '');
	// console.log(id);

	if (id) {
		// prepare UI for changes
		recipeView.clearRecipe();
		renderLoader(elements.recipe);
		// create new recipe obj

		state.recipe = new Recipe(id);

		try {
			// get recipe data and parse ingriedients
			await state.recipe.getRecipe();
			state.recipe.parseIngredients();

			// calculate time and serings
			state.recipe.calcTime();
			state.recipe.calcServings();
			// render recipe
			clearLoader();
			recipeView.renderRecipe(state.recipe);
		} catch (err) {
			console.error(err);
			alert('Error processing recipe');
		}
	}
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));
