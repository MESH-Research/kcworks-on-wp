/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

import { useCallback, useEffect, useState } from '@wordpress/element';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';
import { Card, CardBody } from '@wordpress/components';
import DataBlockInspectorControls from './components/DataBlockInspectorControls.js';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { getItems, sortItems } from './processdata.js';

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
	const [ sortSetting, setSortSetting ] = useState( null );

	const fetchData = useCallback( async () => {
		setFetchError( false );
		setDataFetched( false );

		const queryParams = { kcworksQuery: `${ kcworksQuery }` };
		apiFetch( {
			path: addQueryArgs(
				'/mesh_research_kcworks/v1/kcworks-proxy',
				queryParams
			),
		} )
			.then( ( data ) => {
				setDataFetched( true );
				let a = sortItems( getItems( data ) );
				setResults( a );
			} )
			.catch( () => {
				setFetchError( true );
			} )
			.finally( () => {
				setLoading( false );
			} );
	}, [ kcworksQuery ] );

	useEffect( () => {
		if ( kcworksQuery && validatedKcworksQuery && ! dataFetched ) {
			fetchData();
		}
		if ( ! kcworksQuery ) {
			setLoading( false );
		}
	}, [ kcworksQuery, validatedKcworksQuery, dataFetched, fetchData ] );

	function buttonHandler() {
		setLoading( true );
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
				sortSetting={ sortSetting }
				setSortSetting={ setSortSetting }
			/>
			<div { ...useBlockProps() }>
				{ fetchError && (
					<div role="alert">
						<Card>
							<CardBody>
								<p>
									{ __(
										'An error occurred while fetching the data from KCWorks',
										'kcworks'
									) }
								</p>
							</CardBody>
						</Card>
					</div>
				) }
				<p>Welcome to KCWorks</p>
				{ dataFetched && (
					<section>
						<p>Data Fetched!</p>
						<textarea
							style={ {
								width: 'calc(100% - 6px)',
								'min-height': '300px',
							} }
						>
							{ JSON.stringify( results ) }
						</textarea>
					</section>
				) }
			</div>
		</>
	);
}
