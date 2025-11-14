/**
 * Use this file for JavaScript code that you want to run in the front-end
 * on posts/pages that contain this block.
 *
 * When this file is defined as the value of the `viewScript` property
 * in `block.json` it will be enqueued on the front end of the site.
 *
 * Example:
 *
 * ```js
 * {
 *   "viewScript": "file:./view.js"
 * }
 * ```
 *
 * If you're not making any changes to this file because your project doesn't need any
 * JavaScript running in the front-end, then you should delete this file and remove
 * the `viewScript` property from `block.json`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */

import { __ } from '@wordpress/i18n';
import {
	useCallback,
	useEffect,
	useState,
	createRoot,
} from '@wordpress/element';

import './editor.scss';
import Bibliography from './components/Bibliography.js';
import useCallbackFetch from './useCallbackFetch.js';
import {
	generateBibliography,
	generateBibliographyGrouped,
} from './processdata.js';

function MeshResearchKcworks( { attributes } ) {
	const {
		kcworksQuery,
		citationFormat,
		validatedKcworksQuery,
		groupingEnabled,
		headingLevel,
	} = attributes;
	const [ dataFetched, setDataFetched ] = useState( false );
	const [ results, setResults ] = useState( [] );
	const [ loading, setLoading ] = useState( true );
	const [ fetchError, setFetchError ] = useState( false );

	const [ newCitationFormat, setNewCitationFormat ] = useState( false );
	const [ citationFormatCsl, setCitationFormatCsl ] = useState( null );
	const [ localeSetting, setLocaleSetting ] = useState( 'en-US' );
	const [ localeSettingXml, setLocaleSettingXml ] = useState( null );
	const [ bibliography, setBibliography ] = useState( '<p>...</p>' );

	const fetchData = useCallback(
		() =>
			useCallbackFetch(
				setFetchError,
				setDataFetched,
				kcworksQuery,
				setResults,
				setLoading,
				dataFetched
			),
		[ kcworksQuery ]
	);

	useEffect( () => {
		if ( kcworksQuery && validatedKcworksQuery && ! dataFetched ) {
			fetchData();
		}
		if ( ! kcworksQuery ) {
			setLoading( false );
		}
	}, [ kcworksQuery, validatedKcworksQuery, dataFetched ] );

	useEffect( () => {
		if ( groupingEnabled ) {
			generateBibliographyGrouped(
				results,
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
			);
		} else {
			generateBibliography(
				results,
				localeSettingXml,
				citationFormatCsl,
				citationFormat,
				newCitationFormat,
				setBibliography,
				setLocaleSettingXml,
				setLocaleSetting,
				setCitationFormatCsl,
				setNewCitationFormat
			);
		}
	}, [ results ] );

	return (
		<>
			<Bibliography
				fetchError={ fetchError }
				dataFetched={ dataFetched }
				bibliography={ bibliography }
				kcworksQuery={ kcworksQuery }
				loading={ loading }
				results={ results }
			/>
		</>
	);
}
window.addEventListener( 'DOMContentLoaded', () => {
	const blocks = document.querySelectorAll( '.mesh-research-kcworks-on-wp' );
	blocks.forEach( ( block ) => {
		const root = createRoot( block );
		const attributes = JSON.parse(
			block.getAttribute( 'data-attributes' )
		);
		root.render( <MeshResearchKcworks attributes={ attributes } /> );
	} );
} );
