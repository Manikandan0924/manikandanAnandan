<?php
$access_key = 'dc15663d6d4b3fde1bbe42484d2cb178';

// Construct API URL
$url = 'http://api.exchangeratesapi.io/v1/latest?access_key=' . $access_key;

// Fetch data from API
$response = file_get_contents($url);

// Return the response
echo $response;
?>
