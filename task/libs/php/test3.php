<?php

// Remove for production

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

// $_REQUEST['north'] = 44.1;
// $_REQUEST['south'] = -9.9;
// $_REQUEST['east'] = -22.4;
// $_REQUEST['west'] = 55.2;


$url = "http://api.geonames.org/weatherJSON?formatted=true&north=" . $_REQUEST['north'] . "&south=" . $_REQUEST['south'] . "&east=" . $_REQUEST['east'] . "&west=" . $_REQUEST['west']. "&username=mani0924&style=full";
// http://api.geonames.org/weatherJSON?formatted=true&north=44.1&south=-9.9&east=-22.4&west=55.2&username=mani0924&style=full
$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = $decode['weatherObservations'];

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
?>
