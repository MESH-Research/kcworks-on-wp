import CSL from 'citeproc';
import locales from './locales/locales.json';

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
	other: 'Other',
};

const pluginBaseUrl = '/wp-content/plugins/kcworks/src/kcworks';

export function getItems( data ) {
	return data.hits.hits;
}

export function sortItems( data ) {
	const sorted = data.map( ( item ) => {
		return item;
	} );
	return sorted;
}

/**
 * @param {string} localeId
 * @returns
 */
function getXmlFileLocale( localeId ) {
	if ( localeId === null ) {
		return null;
	}
	const xhr = new XMLHttpRequest();
	xhr.open(
		'GET',
		`${ pluginBaseUrl }/locales/locales-${ localeId }.xml`,
		false
	);
	xhr.send( null );
	return xhr.responseText;
}

/**
 * @param {string} styleId
 * @returns
 */
function getCslFileStyle( styleId ) {
	if ( styleId === null ) {
		return '';
	}
	const xhr = new XMLHttpRequest();
	xhr.open( 'GET', `${ pluginBaseUrl }/styles/${ styleId }.csl`, false );
	xhr.send( null );
	const text = xhr.responseText;
	const parser = new DOMParser();
	return parser.parseFromString( text, 'text/xml' );
}

export function generateBibliography(
	data,
	setLocaleSetting,
	setBibliography,
	styleSetting
) {
	const sys = {
		retrieveLocale: ( locale ) => {
			if ( Object.hasOwn( locales[ 'primary-dialects' ], locale ) ) {
				setLocaleSetting( locale );
				return getXmlFileLocale( locale );
			} else {
				return getXmlFileLocale( 'en-US' );
			}
		},
		retrieveItem: ( itemId ) => {
			return data.find( ( item ) => item.id === itemId );
		},
	};

	const s = new XMLSerializer();
	const style = s.serializeToString( getCslFileStyle( styleSetting ) );
	const citeproc = new CSL.Engine( sys, style );
	const orcidItemIds = data.map( ( item ) => item.id );
	citeproc.updateItems( orcidItemIds );
	const bibliography = citeproc.makeBibliography();
	setBibliography( bibliography[ 1 ].join( '\n' ) );
}
