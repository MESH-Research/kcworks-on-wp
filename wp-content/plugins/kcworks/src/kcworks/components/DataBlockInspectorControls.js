import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	Button,
	Panel,
	PanelBody,
	TextControl,
	SelectControl,
	CheckboxControl,
} from '@wordpress/components';
import LoadingSpinner from './LoadingSpinner.js';

const DataBlockInspectorControls = ( {
	setAttributes,
	kcworksQuery,
	invalidQuery,
	setInvalidQuery,
	buttonHandler,
	loading,
	citationFormat,
	groupingEnabled,
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
				<Panel>
					<PanelBody>
						<LoadingSpinner />
					</PanelBody>
				</Panel>
			) : (
				<Panel>
					<PanelBody>
						<CheckboxControl
							__nextHasNoMarginBottom
							label="Group Works"
							help="Toggle whether works are grouped by resource type"
							checked={ groupingEnabled }
							onChange={ ( value ) =>
								setAttributes( { groupingEnabled: value } )
							}
						/>
						<SelectControl
							label="Citation Format"
							value={ citationFormat }
							options={ [
								{ label: 'APA', value: 'apa' },
								{
									label: 'Harvard (format 1)',
									value: 'harvard1',
								},
								{
									label: 'Harvard (Cite Them Right)',
									value: 'harvard-cite-them-right',
								},
								{
									label: 'MLA',
									value: 'modern-language-association',
								},
								{ label: 'Vancouver', value: 'vancouver' },
								{
									label: 'Chicago',
									value: 'chicago-fullnote-bibliography',
								},
								{ label: 'IEEE', value: 'ieee' },
							] }
							onChange={ ( newFormat ) =>
								setAttributes( { citationFormat: newFormat } )
							}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					</PanelBody>
				</Panel>
			) }
		</InspectorControls>
	);
};

export default DataBlockInspectorControls;
