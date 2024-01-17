<?php
// echo '<pre>';
// print_r($_GET['countryIsoCode']);
// exit;

// Check if the country code is set in the request
if (isset($_GET['countryIsoCode'])) {
    $countryCode = $_GET['countryIsoCode'];

    // Construct the GeoNames API URL for country information
    $url = "http://api.geonames.org/countryInfoJSON?formatted=true&lang=it&country={$countryCode}&username=mani0924&style=full";

    // Initialize cURL session
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);

    // Execute cURL session and get the result
    $result = curl_exec($ch);

    // Close cURL session
    curl_close($ch);

    // Decode the JSON result
    $decodedResult = json_decode($result, true);

    // Check if currency information is available
    if (isset($decodedResult['geonames'][0]['currencyCode'])) {
        $currencyCode = $decodedResult['geonames'][0]['currencyCode'];

        // echo '<pre>';
        // print_r($currencyCode);
        // exit;

        // Prepare the output response
        $output['status']['code'] = "200";
        $output['status']['name'] = "ok";
        $output['status']['description'] = "success";
        $output['isocode'] =  $currencyCode;

        // Set the response header
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($output);
        // exit;
    } else {
        // Handle the case where currency information is not available
        $output['status']['code'] = "404";
        $output['status']['name'] = "not found";
        $output['status']['description'] = "Currency information not found for the specified country code.";

        // Set the response header
        header('Content-Type: application/json; charset=UTF-8');

        // Output the JSON response
        echo json_encode($output);
    }
}
