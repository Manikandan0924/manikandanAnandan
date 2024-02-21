<?php

// Remove for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

// Check if the query parameter is set in the request
if (isset($_GET['q'])) {
  $query = $_GET['q'];

  // API URL for Wikipedia search
  $url = "http://api.geonames.org/wikipediaSearchJSON?formatted=true&q={$query}&maxRows=10&username=mani0924&style=full";

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
  $decode = json_decode($result, true);

  // Prepare the output response
  $output['status']['code'] = "200";
  $output['status']['name'] = "ok";
  $output['status']['description'] = "success";
  $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
  $output['data'] = $decode;

  // Set the response header
  header('Content-Type: application/json; charset=UTF-8');

  // Output the JSON response
  echo json_encode($output);
}
?>
