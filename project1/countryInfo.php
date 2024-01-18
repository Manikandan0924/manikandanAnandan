<?php
// echo '<pre>';
// print_r($_GET['countryIsoCode']);
// exit;
// Remove for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

if (isset($_GET['countryIsoCode'])) {
    $countryCode = $_GET['countryIsoCode'];

    $url = "http://api.geonames.org/countryInfoJSON?formatted=true&lang=it&country={$countryCode}&username=mani0924&style=full";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);

    $result = curl_exec($ch);

    curl_close($ch);

    $decode = json_decode($result, true);
    

    $north = $decode['geonames'][0]['north'];
    $south = $decode['geonames'][0]['south'];
    $east = $decode['geonames'][0]['east'];
    $west = $decode['geonames'][0]['west'];
//     echo '<pre>';
// print_r($decode);
// exit;

$url = "http://api.geonames.org/earthquakesJSON?formatted=true&north={$north}&south={$south}&east={$east}&west={$west}&username=mani0924&style=full";

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
$output['data'] = $decode;

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
}
?>
