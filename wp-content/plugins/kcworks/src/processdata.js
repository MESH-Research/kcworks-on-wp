function makeDate( dateArray ) {
	let date = new Date();
	const year = dateArray?.[ 0 ];
	const month = dateArray?.[ 1 ];
	const day = dateArray?.[ 2 ];
	date = new Date(
		year ? year : new Date().getFullYear(),
		month ? month - 1 : 6,
		day ? day : 1
	);
	return date;
}

function sortData( data ) {
	return data.sort( ( a, b ) => {
		return (
			makeDate( b.issued[ 'date-parts' ] ) -
			makeDate( a.issued[ 'date-parts' ] )
		);
	} );
}

const itemTypes = {
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

function getProcessedData( data ) {
	const items = data.hits.hits;
	const sorted = sortData( items );
	return sorted;
}

export default getProcessedData;
