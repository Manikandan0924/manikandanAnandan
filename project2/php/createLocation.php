<?php
// Remove next two lines for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

// Include the database connection configuration
include("config.php");

header('Content-Type: application/json; charset=UTF-8');

// Establish connection to the database
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

// Check for database connection errors
if ($conn->connect_error) {
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database connection failed";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    echo json_encode($output);

    exit;
}

// Prepare and execute SQL statement to insert location into the database
$query = $conn->prepare('INSERT INTO location (name) VALUES(?)');

if (!$query) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "query preparation failed";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    echo json_encode($output);

    exit;
}

// Bind parameters and execute the query
$query->bind_param("s", $_REQUEST['name']);
$query->execute();

// Check for query execution errors
if ($query->error) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "query execution failed";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    echo json_encode($output);

    exit;
}

// If the location was successfully added, prepare the response
$output['status']['code'] = "200";
$output['status']['name'] = "success";
$output['status']['description'] = "location added successfully";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = [];

// Close the database connection
$query->close();
$conn->close();

echo json_encode($output);

?>