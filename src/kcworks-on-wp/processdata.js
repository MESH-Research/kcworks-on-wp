import CSL from 'citeproc';
import locales from './locales/locales.json';
import { __experimentalHeading as Heading } from '@wordpress/components';

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
	entry: 'Entry',
	event: 'Event',
	figure: 'Figure',
	graphic: 'Graphic',
	interview: 'Interview',
	'legal-case': 'Legal Case',
	map: 'Map',
	motion_picture: 'Video',
	other: 'Other',
	'paper-conference': 'Conference Paper',
	patent: 'Patent',
	performance: 'Performance',
	podcast: 'Podcast',
	'post-weblog': 'Blog Post',
	report: 'Report',
	review: 'Review',
	'review-book': 'Book Review',
	software: 'Software',
	song: 'Song',
	speech: 'Presentation',
	standard: 'Standard',
	thesis: 'Thesis',
	webpage: 'Webpage',
};

// pluginBaseUrl is supplied from the backend
const pluginUrl = `${ pluginBaseUrl }src/kcworks-on-wp`;

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
		`${ pluginUrl }/locales/locales-${ localeId }.xml`,
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
	xhr.open( 'GET', `${ pluginUrl }/styles/${ styleId }.csl`, false );
	xhr.send( null );
	const text = xhr.responseText;
	const parser = new DOMParser();
	return parser.parseFromString( text, 'text/xml' );
}

export function generateBibliographyGrouped(
	data,
	localeSettingXml,
	citationFormatCsl,
	citationFormat,
	newCitationFormat,
	setBibliography,
	setLocaleSettingXml,
	setLocaleSetting,
	setCitationFormatCsl,
	setNewCitationFormat,
	headingLevel
) {
	const types = new Set( data.map( ( item ) => item.type ) );
	const a = [ ...types ].map( ( type ) => {
		const filtered = Array.from( data ).filter( ( item ) => {
			return item.type === type;
		} );
		const bib = makeCiteProcBibliography(
			filtered,
			localeSettingXml,
			setLocaleSettingXml,
			setLocaleSetting,
			citationFormatCsl,
			setCitationFormatCsl,
			citationFormat,
			newCitationFormat,
			setNewCitationFormat
		);
		return (
			<section key={ type }>
				<Heading level={ headingLevel }>{ csl_types[ type ] }</Heading>

				<div
					dangerouslySetInnerHTML={ {
						__html: bib[ 1 ].join( '\n' ),
					} }
				/>
			</section>
		);
	} );
	setBibliography( a );
}

export function generateBibliography(
	data,
	localeSettingXml,
	citationFormatCsl,
	citationFormat,
	newCitationFormat,
	setBibliography,
	setLocaleSettingXml,
	setLocaleSetting,
	setCitationFormatCsl,
	setNewCitationFormat
) {
	const bibliography = makeCiteProcBibliography(
		data,
		localeSettingXml,
		setLocaleSettingXml,
		setLocaleSetting,
		citationFormatCsl,
		setCitationFormatCsl,
		citationFormat,
		newCitationFormat,
		setNewCitationFormat
	);
	setBibliography( bibliography[ 1 ].join( '\n' ) );
}

function makeCiteProcBibliography(
	data,
	localeSettingXml,
	setLocaleSettingXml,
	setLocaleSetting,
	citationFormatCsl,
	setCitationFormatCsl,
	citationFormat,
	newCitationFormat,
	setNewCitationFormat
) {
	const sys = {
		retrieveLocale: ( locale ) => {
			if ( localeSettingXml ) {
				return localeSettingXml;
			} else {
				let lookupKey = 'en-US';
				if ( Object.hasOwn( locales[ 'primary-dialects' ], locale ) ) {
					lookupKey = locale;
				}
				setLocaleSetting( lookupKey );
				const xmlData = getXmlFileLocale( lookupKey );
				setLocaleSettingXml( xmlData );
				return xmlData;
			}
		},
		retrieveItem: ( itemId ) => {
			return data.find( ( item ) => item.id === itemId );
		},
	};

	const s = new XMLSerializer();
	let style = '';
	if ( citationFormatCsl && newCitationFormat === false ) {
		style = citationFormatCsl;
	} else {
		style = s.serializeToString( getCslFileStyle( citationFormat ) );
		setCitationFormatCsl( style );
		setNewCitationFormat( false );
	}
	const citeproc = new CSL.Engine( sys, style );
	const orcidItemIds = data.map( ( item ) => item.id );
	citeproc.opt.development_extensions.wrap_url_and_doi = true;
	citeproc.updateItems( orcidItemIds );
	return citeproc.makeBibliography();
}
