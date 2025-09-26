import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { getItems, sortItems } from './processdata.js';

async function useCallbackFetch(
	setFetchError,
	setDataFetched,
	kcworksQuery,
	setResults,
	setLoading,
	dataFetched
) {
	setFetchError( false );
	if ( dataFetched ) {
		setDataFetched( false );
	}

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
		.catch( ( error ) => {
			console.error( error );
			setFetchError( true );
		} )
		.finally( () => {
			setLoading( false );
		} );
}

export default useCallbackFetch;
