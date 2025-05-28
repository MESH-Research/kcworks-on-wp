const csl_types = {
	'article-journal': 'Journal article',
	book: 'Book',
	chapter: 'Book section',
	'paper-conference': 'Conference paper',
	'article-magazine': 'Magazine article',
	'article-newspaper': 'Newspaper article',
	thesis: 'Thesis',
	'review-book': 'Review',
	webpage: 'Blog post',
};

export function getItems( data ) {
	return data.hits.hits;
}

export function sortItems( data ) {
	const sorted = data.map( ( item ) => {
		return item;
	} );
	return sorted;
}
