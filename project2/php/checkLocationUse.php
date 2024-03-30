<?php

// example use from browser
// http://localhost/companydirectory/libs/php/getAll.php

// Remove next two lines for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

// Check if 'id' parameter exists in the request
if (!isset($_REQUEST['id'])) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "error";
    $output['status']['description'] = "Missing 'id' parameter";
    echo json_encode($output);
    exit;
}

// Get the 'id' parameter from the request
$id = $_REQUEST['id'];

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

$query = "SELECT l.name AS locationName, COUNT(d.id) as DepartmentCount 
          FROM location l 
          LEFT JOIN department d ON (d.locationID = l.id) 
          WHERE l.id = $id";

$result = $conn->query($query);

if (!$result) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed: " . $conn->error;
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $data;
$output['record_count'] = count($data);

mysqli_close($conn);

echo json_encode($output);
