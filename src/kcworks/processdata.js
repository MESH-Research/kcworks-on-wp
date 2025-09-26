import CSL from 'citeproc';
import locales from './locales/locales.json';

const csl_types = {
	article: 'Article',
	'article-journal': 'Journal Article',
	'article-magazine': 'Magazine Article',
	'article-newspaper': 'Newspaper Article',
	book: 'Book',
	chapter: 'Chapter',
	collection: 'Collection',
	dataset: 'Dataset',
	document: 'Document',
	entry: 'Dentry',
	event: 'Event',
	figure: 'Figure',
	graphic: 'Graphic',
	interview: 'Interview',
	'legal-case': 'Legal Case',
	map: 'Map',
	motion_picture: 'Motion Picture',
	other: 'Other',
	'paper-conference': 'Paper Conference',
	patent: 'Patent',
	performance: 'Performance',
	podcast: 'Podcast',
	'post-weblog': 'Blog Post',
	report: 'Report',
	review: 'Review',
	'review-book': 'Book Review',
	software: 'Software',
	song: 'Song',
	speech: 'Speech',
	standard: 'Standard',
	thesis: 'Thesis',
	webpage: 'Webpage',
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

export function generateBibliographyGrouped(
	data,
	setLocaleSetting,
	setBibliography,
	styleSetting
) {
	const types = new Set( data.map( ( item ) => item.type ) );
	const a = [ ...types ].map( ( type ) => {
		const title = `<header><strong>${ csl_types[ type ] }</strong></header>`;
		const filtered = Array.from( data ).filter(
			( item ) => item.type === type
		);
		const bib = makeCiteProcBibliography(
			filtered,
			setLocaleSetting,
			styleSetting
		);
		return `<section>${ title } ${ bib[ 1 ].join( '\n' ) }</section><br/>`;
	} );
	setBibliography( a.join( ' ' ) );
}

export function generateBibliography(
	data,
	setLocaleSetting,
	setBibliography,
	styleSetting
) {
	const bibliography = makeCiteProcBibliography(
		data,
		setLocaleSetting,
		styleSetting
	);
	setBibliography( bibliography[ 1 ].join( '\n' ) );
}

function makeCiteProcBibliography( data, setLocaleSetting, styleSetting ) {
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
	return citeproc.makeBibliography();
}
