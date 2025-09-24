import { __ } from '@wordpress/i18n';
import { Card, CardBody } from '@wordpress/components';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

const Bibliography = ( {
	fetchError,
	dataFetched,
	bibliography,
	kcworksQuery,
	loading,
	results,
} ) => {
	return (
		<div { ...useBlockProps() }>
			{ ( ! kcworksQuery || ! loading ) && ! dataFetched && (
				<div role="alert">
					<Card>
						<CardBody>
							<p>
								{ __(
									'Please set a query to fetch data from KCWorks.',
									'kcworks'
								) }
							</p>
						</CardBody>
					</Card>
				</div>
			) }
			{ loading && (
				<div role="alert">
					<Card>
						<CardBody>
							<p>
								{ __(
									'Loading data from KCWorks...',
									'kcworks'
								) }
							</p>
						</CardBody>
					</Card>
				</div>
			) }
			{ dataFetched && results.length === 0 && (
				<div role="alert">
					<Card>
						<CardBody>
							<p>
								{ __(
									'No results for KCWorks query.',
									'kcworks'
								) }
							</p>
						</CardBody>
					</Card>
				</div>
			) }
			{ dataFetched && results.length > 0 && (
				<section className="kcworks-bibliography">
					{
						<div
							dangerouslySetInnerHTML={ {
								__html: bibliography,
							} }
						/>
					}
				</section>
			) }
			{ fetchError && results.length == 0 && (
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
		</div>
	);
};

export default Bibliography;
