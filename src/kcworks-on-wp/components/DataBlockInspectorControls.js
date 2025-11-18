import { __ } from '@wordpress/i18n';
import {
	BlockControls,
	HeadingLevelDropdown,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	Button,
	CheckboxControl,
	Icon,
	Panel,
	PanelBody,
	SelectControl,
	TextControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import LoadingSpinner from './LoadingSpinner.js';

const HeadingLevelToolbar = ( { headingLevel, setAttributes } ) => (
	<BlockControls group="block">
		<HeadingLevelDropdown
			options={ [ 1, 2, 3, 4, 5, 6 ] }
			value={ headingLevel }
			onChange={ ( value ) => setAttributes( { headingLevel: value } ) }
		/>
	</BlockControls>
);

const DataBlockInspectorControls = ( {
	setAttributes,
	kcworksQuery,
	invalidQuery,
	setInvalidQuery,
	buttonHandler,
	loading,
	citationFormat,
	groupingEnabled,
	setNewCitationFormat,
	headingLevel,
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
					<div style={ { float: 'right' } }>
						<Icon aria-hidden="true" icon="editor-help" />
						<a
							href="https://works.hcommons.org/help/search"
							target="_blank"
						>
							Query Syntax <br />
							(opens new window)
						</a>
					</div>
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
				<>
					<Panel>
						<PanelBody>
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
								onChange={ ( newFormat ) => {
									setNewCitationFormat( true );
									setAttributes( {
										citationFormat: newFormat,
									} );
								} }
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>

							<CheckboxControl
								__nextHasNoMarginBottom
								label="Group Works"
								help="Toggle whether works are grouped by resource type"
								checked={ groupingEnabled }
								onChange={ ( value ) =>
									setAttributes( { groupingEnabled: value } )
								}
							/>
						</PanelBody>
					</Panel>
					{ groupingEnabled && (
						<>
							<HeadingLevelToolbar
								headingLevel={ headingLevel }
								setAttributes={ setAttributes }
							/>

							<Panel>
								<PanelBody>
									<SelectControl
										label="Group Heading Level"
										value={ headingLevel }
										options={ [
											{ label: 'H1', value: 1 },
											{ label: 'H2', value: 2 },
											{ label: 'H3', value: 3 },
											{ label: 'H4', value: 4 },
											{ label: 'H5', value: 5 },
											{ label: 'H6', value: 6 },
										] }
										onChange={ ( value ) => {
											setAttributes( {
												headingLevel: parseInt( value ),
											} );
										} }
										__next40pxDefaultSize
										__nextHasNoMarginBottom
									/>
									<p>
										Note the heading level used before this
										block to choose the{ ' ' }
										<a
											href="https://www.section508.gov/blog/accessibility-bytes/document-headings/#why-heading-order-matters"
											target="_blank"
										>
											correct heading level (opens new
											window)
										</a>
										.
									</p>
								</PanelBody>
							</Panel>
						</>
					) }
				</>
			) }
		</InspectorControls>
	);
};

export default DataBlockInspectorControls;
