<?php

// Remove next two lines for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

// Include the configuration file
include("config.php");

// Set the content type to JSON
header('Content-Type: application/json; charset=UTF-8');

// Establish a database connection
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

// Check for database connection errors
if (mysqli_connect_errno()) {
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;
}

// Check if the required parameter (id) is provided
if (!isset($_POST['id'])) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "bad request";
    $output['status']['description'] = "Personnel ID parameter is required";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;
}

// Prepare SQL statement to delete the personnel based on the provided ID
$query = $conn->prepare('DELETE FROM personnel WHERE id = ?');

// Bind the personnel ID parameter
$query->bind_param("i", $_POST['id']);

// Execute the SQL query
$query->execute();

// Check if the query was successful
if ($query->affected_rows === -1) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "Query failed";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;
}

// If the deletion was successful, set the response status to success
$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "Success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = [];

// Close the database connection
mysqli_close($conn);

// Send the JSON response
echo json_encode($output);

?>
