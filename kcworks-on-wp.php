<?php
/**
 * Plugin Name:       KCWorks on WP
 * Plugin URI:        https://github.com/MESH-Research/kcworks-on-wp
 * Description:       Display bibliographies from KCWorks on pages, posts, and sites
 * Version:           1.0.1
 * Requires at least: 6.8.1
 * Requires PHP:      7.4
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       kcworks
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// Include the custom API file
require_once plugin_dir_path(__FILE__) . 'kcworks-on-wp-api.php';

/**
 * Add the plugin directory URL to a script
 *
 * @param string $handle The handle of the script to add to
 * @return void
 */
function kcworks_on_wp_add_inline_script($handle): void {
    $path = plugin_dir_url(__FILE__);
    $js = 'const pluginBaseUrl = "'. $path . '"';
    wp_add_inline_script($handle, $js, 'before');
}

/**
 * Registers the block using a `blocks-manifest.php` file, which improves the performance of block type registration.
 * Behind the scenes, it also registers all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
 */
function mesh_research_kcworks_on_wp_block_init() {
	/**
	 * Registers the block(s) metadata from the `blocks-manifest.php` and registers the block type(s)
	 * based on the registered block metadata.
	 * Added in WordPress 6.8 to simplify the block metadata registration process added in WordPress 6.7.
	 *
	 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
	 */
	if ( function_exists( 'wp_register_block_types_from_metadata_collection' ) ) {
		wp_register_block_types_from_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
		return;
	}

	/**
	 * Registers the block(s) metadata from the `blocks-manifest.php` file.
	 * Added to WordPress 6.7 to improve the performance of block type registration.
	 *
	 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
	 */
	if ( function_exists( 'wp_register_block_metadata_collection' ) ) {
		wp_register_block_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
	}
	/**
	 * Registers the block type(s) in the `blocks-manifest.php` file.
	 *
	 * @see https://developer.wordpress.org/reference/functions/register_block_type/
	 */
	$manifest_data = require __DIR__ . '/build/blocks-manifest.php';
	foreach ( array_keys( $manifest_data ) as $block_type ) {
		register_block_type( __DIR__ . "/build/{$block_type}" );
	}
}
add_action( 'init', 'mesh_research_kcworks_on_wp_block_init' );

add_action('enqueue_block_assets', function(): void {
    wp_enqueue_style('dashicons');
});

add_action('admin_enqueue_scripts', function(): void {
    kcworks_on_wp_add_inline_script('mesh-research-kcworks-on-wp-editor-script');
});

add_action('wp_enqueue_scripts', function(): void {
    kcworks_on_wp_add_inline_script('mesh-research-kcworks-on-wp-view-script');
});
