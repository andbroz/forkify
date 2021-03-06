// replace with
// const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);

import axios from 'axios';

export default class Search {
	constructor(query) {
		this.query = query;
	}

	/** getResults method
	 *
	 */
	async getResults() {
		try {
			const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
			this.result = res.data.recipes;
		} catch (err) {
			console.log('getResult: ', err);
		}
	}
}
