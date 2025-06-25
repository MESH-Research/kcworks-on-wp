/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import { useCallback, useEffect, useState } from '@wordpress/element';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';
import DataBlockInspectorControls from './components/DataBlockInspectorControls.js';
import Bibliography from './components/Bibliography.js';
import useCallbackFetch from './useCallbackFetch.js';
import { generateBibliography } from './processdata.js';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { kcworksQuery, validatedKcworksQuery } = attributes;
	const [ dataFetched, setDataFetched ] = useState( false );
	const [ results, setResults ] = useState( [] );
	const [ invalidQuery, setInvalidQuery ] = useState( false );
	const [ loading, setLoading ] = useState( true );
	const [ fetchError, setFetchError ] = useState( false );

	const [ styleSetting, setStyleSetting ] = useState( 'apa' );
	const [ localeSetting, setLocaleSetting ] = useState( 'en-US' );
	const [ sortSetting, setSortSetting ] = useState( 'newest' );
	const [ bibliography, setBibliography ] = useState( '<p>...</p>' );

	const fetchData = useCallback(
		() =>
			useCallbackFetch(
				setFetchError,
				setDataFetched,
				kcworksQuery,
				setResults,
				setLoading
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
		if ( results.length > 0 ) {
			generateBibliography(
				results,
				setLocaleSetting,
				setBibliography,
				styleSetting
			);
		}
	}, [ results, styleSetting, sortSetting, localeSetting ] );

	function buttonHandler() {
		setLoading( true );
		setAttributes( { kcworksQuery: kcworksQuery } );
		const verification = true; // verifyKcworksQuery( kcworksQuery );
		setAttributes( { validatedKcworksQuery: true } );
		if ( ! verification ) {
			setInvalidQuery( true );
			setLoading( false );
		} else {
			setInvalidQuery( false );
			fetchData();
		}
	}

	return (
		<>
			<DataBlockInspectorControls
				kcworksQuery={ kcworksQuery }
				invalidQuery={ invalidQuery }
				setInvalidQuery={ setInvalidQuery }
				buttonHandler={ buttonHandler }
				loading={ loading }
				setAttributes={ setAttributes }
				styleSetting={ styleSetting }
				setStyleSetting={ setStyleSetting }
				sortSetting={ sortSetting }
				setSortSetting={ setSortSetting }
			/>
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
