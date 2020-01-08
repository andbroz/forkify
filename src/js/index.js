// API http://forkify-api.herokuapp.com/

// Then, in Recipe.js (as soon as you get there), please replace:
// const res = await axios(
// 	`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`
// );

import Search from './models/Search';

const search = new Search('pizza');
console.log(search);
search.getResults();
