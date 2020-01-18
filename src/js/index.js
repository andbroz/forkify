// API http://forkify-api.herokuapp.com/

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app
 *  - Search object
 *  - Current recipe obj
 *  - Shopping list obj
 *  - Linked recipes
 */
const state = {};
// window.state = state;

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

		// highlight selected recipe
		if (state.search) {
			searchView.highlightSelected(id);
		}
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
			if (state.likes) likesView.toggleLikeBtn(state.likes.isLiked(id));
		} catch (err) {
			console.error(err);
			alert('Error processing recipe');
		}
	}
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));

/**
 * List controller
 */
const controlList = () => {
	// create a new list IF there is non yet
	if (!state.list) state.list = new List();

	// Add each ingredient to the list and UI
	state.recipe.ingredients.forEach(el => {
		const item = state.list.addItem(el.count, el.unit, el.ingredient);
		listView.renderItem(item);
	});
};

// Hnadle delete and update list item events

elements.shopping.addEventListener('click', e => {
	const id = e.target.closest('.shopping__item').dataset.itemid;

	// delete btn event
	if (e.target.matches('.shopping__delete, .shopping__delete *')) {
		// delete from state
		state.list.deleteItem(id);
		// delete from UI
		listView.deleteItem(id);
	} else if (e.target.matches('.shopping__count-value, .shopping__count-value *')) {
		const val = parseFloat(e.target.value);
		state.list.updateCount(id, val);
	}
});

/**
 * Likes controller
 */

const controlLike = () => {
	if (!state.likes) state.likes = new Likes();

	const currentID = state.recipe.id;

	// User has NOT liked current recipe
	if (!state.likes.isLiked(currentID)) {
		// add like to the state
		const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.author, state.recipe.img);
		// toggle the like button
		likesView.toggleLikeBtn(true);
		// add like to UI list
		likesView.renderLike(newLike);
	} else {
		// User has liked current recipe
		// remove like from the state
		state.likes.deleteLike(currentID);
		// toggle the like button
		likesView.toggleLikeBtn(false);
		// remove like from UI
		likesView.deleteLike(currentID);
	}
	likesView.toggleLikeMenu(state.likes.getNumLikes());
};

//  restore liked recipes when pages loads

window.addEventListener('load', () => {
	state.likes = new Likes();

	// restore likes
	state.likes.readStorage();

	// toggle button
	likesView.toggleLikeMenu(state.likes.getNumLikes());

	// render likes
	state.likes.likes.forEach(like => {
		likesView.renderLike(like);
	});
});

/**
 * Catching btn clicks
 */
// handling recipe button clicks
elements.recipe.addEventListener('click', e => {
	if (e.target.matches('.btn-decrease, .btn-decrease *')) {
		// decrease button is clicked
		if (state.recipe.servings > 1) {
			state.recipe.updateServings('dec');
			recipeView.updateServingsIngredients(state.recipe);
		}
	} else if (e.target.matches('.btn-increase, .btn-increase *')) {
		// increase button is clicked
		if (state.recipe.servings > 0) {
			state.recipe.updateServings('inc');
			recipeView.updateServingsIngredients(state.recipe);
		}
	} else if (e.target.matches('.recipe__btn-add, .recipe__btn-add *')) {
		// Add ingredients to shopping list
		controlList();
	} else if (e.target.matches('.recipe__love, .recipe__love *')) {
		// Like controller
		controlLike();
	}
});
