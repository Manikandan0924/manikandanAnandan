<?php

// Remove debugging lines for production
// ini_set('display_errors', 'On');
// error_reporting(E_ALL);

// Start timing execution
$executionStartTime = microtime(true);

// Include database configuration
include("config.php");

// Set response headers to indicate JSON content
header('Content-Type: application/json; charset=UTF-8');

// Create database connection
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

// Check if connection is successful
if ($conn->connect_error) {
    // If connection fails, prepare error response
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    // Output JSON error response
    echo json_encode($output);

    // Terminate script execution
    exit;
}

// Define the query variable
$query = null;
if ($_REQUEST['filterData'] == 'personnel') {
    // Prepare the query for personnel search
    $query = 'SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) ORDER BY p.firstName';
    $query = 'SELECT p.id, p.firstName, p.lastName, p.email, p.jobTitle, d.id as departmentID, d.name AS departmentName, l.id as locationID, l.name AS locationName FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) ORDER BY p.firstName';
 
} elseif ($_REQUEST['filterData'] == 'department') {

    $query = "SELECT d.id, d.name, l.name as locationName FROM department d LEFT JOIN location l ON d.locationID = l.id ORDER BY d.name";

} elseif ($_REQUEST['filterData'] == 'location') {

    $query = "SELECT id AS locationid, name AS locationname FROM location ORDER BY name";
}

// Execute the query
$result = $conn->query($query);

// Check for errors
if (!$result) {
    // Handle the case when the query fails
    $output['status']['code'] = "400";
    $output['status']['name'] = "error";
    $output['status']['description'] = "Query execution failed: " . $conn->error;
    echo json_encode($output);
    exit;
}

// Fetch data
$found = [];

while ($row = $result->fetch_assoc()) {
    $found[] = $row;
}

// Prepare success response
$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['data']['found'] = $found;

// Output JSON success response
echo json_encode($output);
?>