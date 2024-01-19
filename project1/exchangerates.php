<?php
$access_key = '8222544b5e867a25667eca94eb3bf32b';

// Construct API URL
$url = 'http://api.exchangeratesapi.io/v1/latest?access_key=' . $access_key;



// Fetch data from API
$response = file_get_contents($url);

// Return the response
echo $response;
?>
