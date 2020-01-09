// API http://forkify-api.herokuapp.com/

// Then, in Recipe.js (as soon as you get there), please replace:
// const res = await axios(
// 	`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`
// );

import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements } from './views/base';

/** Global state of the app
 *  - Search object
 *  - Current recipe obj
 *  - Shopping list obj
 *  - Linked recipes
 */
const state = {};

// Functions

const controlSearch = async () => {
	// get query from view

	const query = searchView.getInput();
	console.log(query);
	if (query) {
		// new search obj and add state
		state.search = new Search(query);

		// prepare UI for results
		searchView.clearInput();
		searchView.clearResults();

		// search for recipes
		await state.search.getResults();

		// render results on UI
		if (state.search.result) {
			searchView.renderResults(state.search.result);
		}
	}
};

// Event Listeners

// Search form

elements.searchForm.addEventListener('submit', e => {
	e.preventDefault();
	controlSearch();
});

//search.getResults();
