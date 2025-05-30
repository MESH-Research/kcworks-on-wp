import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	Button,
	Panel,
	PanelBody,
	TextControl,
	SelectControl,
} from '@wordpress/components';
import LoadingSpinner from './LoadingSpinner.js';

const DataBlockInspectorControls = ( {
	kcworksQuery,
	invalidQuery,
	setInvalidQuery,
	buttonHandler,
	loading,
	setAttributes,
	sortSetting,
	setSortSetting,
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
						<SelectControl
							label="Sort"
							value={ sortSetting }
							options={ [
								{ label: 'Newest', value: 'newest' },
								{ label: 'Best Match', value: 'bestmatch' },
								{ label: 'Oldest', value: 'oldest' },
								{
									label: 'Date Published (Newest)',
									value: 'published-desc',
								},
								{
									label: 'Date Published (Oldest)',
									value: 'published-asc',
								},
								{ label: 'Version', value: 'version' },
								{
									label: 'Date Updated (Newest)',
									value: 'updated-desc',
								},
								{
									label: 'Date Updated (Oldest)',
									value: 'updated-asc',
								},
								{ label: 'Most Viewed', value: 'mostviewed' },
								{
									label: 'Most Downloaded',
									value: 'mostdownloaded',
								},
							] }
							onChange={ ( newSort ) =>
								setSortSetting( newSort )
							}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>

						<SelectControl
							label="Citation Format"
							value={ null }
							options={ [
								{ label: 'APA', value: 'apa' },
								{ label: 'Harvard', value: 'Harvard1' },
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
								console.log( newFormat )
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
