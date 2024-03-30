<?php

// Remove next two lines for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

// Establish connection to the database
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

// Check for database connection errors
if (mysqli_connect_errno()) {
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;
}

// Prepare and execute SQL statement to insert department into the database
$query = $conn->prepare('INSERT INTO department (name, locationID) VALUES (?, ?)');
$query->bind_param("si", $_POST['name'], $_POST['locationID']);
$query->execute();

// Check for query execution errors
if ($query === false) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;
}

// Fetch the location name corresponding to the inserted department
$locationQuery = $conn->prepare('SELECT name FROM location WHERE id = ?');
$locationQuery->bind_param("i", $_POST['locationID']);
$locationQuery->execute();
$locationResult = $locationQuery->get_result();
$locationData = $locationResult->fetch_assoc();

// If the location name was successfully fetched, add it to the output
if ($locationData) {
    $output['data']['locationName'] = $locationData['name'];
}

// If the department was successfully added, prepare the response
$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";

// Close the database connection
mysqli_close($conn);

// Return the JSON response
echo json_encode($output);
?>