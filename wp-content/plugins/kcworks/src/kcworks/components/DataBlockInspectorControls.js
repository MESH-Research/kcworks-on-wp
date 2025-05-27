import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { Button, Panel, PanelBody, TextControl } from '@wordpress/components';
import LoadingSpinner from './LoadingSpinner.js';

const DataBlockInspectorControls = ( {
	kcworksQuery,
	invalidQuery,
	setInvalidQuery,
	buttonHandler,
	loading,
	setAttributes,
} ) => {
	return (
		<InspectorControls>
			<Panel>
				<PanelBody>
					<TextControl
						__next40pxDefaultSize={ true }
						__nextHasNoMarginBottom={ true }
						label={ __( 'Query', 'kcworks' ) }
						value={ kcworksQuery }
						onChange={ ( value ) => {
							setInvalidQuery( false );
							setAttributes( { kcworksQuery: value } );
						} }
					/>
					<Button
						variant="primary"
						onClick={ () => buttonHandler() }
						text={ __( 'Set Query', 'kcworks' ) }
					/>
					<div role="alert" aria-atomic="true">
						{ invalidQuery && (
							<p style={ { marginTop: '16px' } }>
								<i
									style={ {
										backgroundColor: 'red',
										display: 'inline-block',
										height: '20px',
										textAlign: 'center',
										width: '20px',
										fontStyle: 'normal',
									} }
									role="presentation"
								>
									❕
								</i>{ ' ' }
								<span>
									{ __(
										'Please provide a valid query.',
										'kcworks'
									) }
								</span>
							</p>
						) }
					</div>
				</PanelBody>
			</Panel>
			{ loading ? (
				<PanelBody>
					<LoadingSpinner />
				</PanelBody>
			) : (
				<PanelBody>
					<p>Loaded</p>
				</PanelBody>
			) }
		</InspectorControls>
	);
};

export default DataBlockInspectorControls;
