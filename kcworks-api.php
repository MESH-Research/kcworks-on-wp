<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}
function mesh_research_kcworks_handle_kcworks_proxy_request(WP_REST_Request $request)
{

    // sanitize_url()
    // filter_block_kses_value($request->get_param('kcworksQuery'),[]);
    $kcworks_query = sanitize_text_field($request->get_param('kcworksQuery'));
    if (!isset($kcworks_query) || empty($kcworks_query)) {
        return new WP_Error('missing_kcworks_query', 'Missing Query', array('status' => 400));
    }

    if (!mesh_research_kcworks_validate_kcworks_query($kcworks_query)) {
        return new WP_Error('invalid_kcworks_query', 'Invalid Query', array('status' => 400));
    }

    $response = wp_remote_get("https://works.hcommons.org/api/records?{$kcworks_query}", array(
        'headers' => array(
            'Accept' => 'application/vnd.citationstyles.csl+json',
        ),
    ));

    if (is_wp_error($response)) {
        return new WP_Error('request_failed', 'Failed to fetch data from KCWorks', array('status' => 500));
    }

    $body = wp_remote_retrieve_body($response);
    return rest_ensure_response(json_decode($body));
}
add_action('rest_api_init', function () {
    register_rest_route('mesh_research_kcworks/v1', '/kcworks-proxy', array(
        'methods' => 'GET',
        'callback' => 'mesh_research_kcworks_handle_kcworks_proxy_request',
        'permission_callback' => '__return_true',
    ));
});

/**
 * Validate a query string for KCWorks
 *
 * @param string $value
 * @return bool
 */
function mesh_research_kcworks_validate_kcworks_query($value)
{
    // TODO: Develop this

    return true;
}
