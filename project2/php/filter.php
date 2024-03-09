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

// Get filter criteria from the request
$filterCriteria = json_decode($_GET['filterCriteria'], true);

// Define the base query for searching personnel
$query = 'SELECT `p`.`id`, `p`.`firstName`, `p`.`lastName`, `p`.`email`, `p`.`jobTitle`, `d`.`id` as `departmentID`, `d`.`name` AS `departmentName`, `l`.`id` as `locationID`, `l`.`name` AS `locationName` FROM `personnel` `p` LEFT JOIN `department` `d` ON (`d`.`id` = `p`.`departmentID`) LEFT JOIN `location` `l` ON (`l`.`id` = `d`.`locationID`)';

// Initialize a flag to track if any filter is applied
$filterApplied = false;

// Add filter conditions to the query based on the provided criteria
if ($filterCriteria['firstName']) {
    $query .= ' WHERE `p`.`firstName` IS NOT NULL AND `p`.`firstName` != ""';
    $filterApplied = true;
}
if ($filterCriteria['lastName']) {
    $query .= ($filterApplied ? ' AND' : ' WHERE') . ' `p`.`lastName` IS NOT NULL AND `p`.`lastName` != ""';
    $filterApplied = true;
}
if ($filterCriteria['email']) {
    $query .= ($filterApplied ? ' AND' : ' WHERE') . ' `p`.`email` IS NOT NULL AND `p`.`email` != ""';
    $filterApplied = true;
}
if ($filterCriteria['department']) {
    $query .= ($filterApplied ? ' AND' : ' WHERE') . ' `d`.`name` IS NOT NULL AND `d`.`name` != ""';
    $filterApplied = true;
}
if ($filterCriteria['location']) {
    $query .= ($filterApplied ? ' AND' : ' WHERE') . ' `l`.`name` IS NOT NULL AND `l`.`name` != ""';
    $filterApplied = true;
}

// If no filter is applied, remove the WHERE clause to fetch all data
if (!$filterApplied) {
    $query = 'SELECT `p`.`id`, `p`.`firstName`, `p`.`lastName`, `p`.`email`, `p`.`jobTitle`, `d`.`id` as `departmentID`, `d`.`name` AS `departmentName`, `l`.`id` as `locationID`, `l`.`name` AS `locationName` FROM `personnel` `p` LEFT JOIN `department` `d` ON (`d`.`id` = `p`.`departmentID`) LEFT JOIN `location` `l` ON (`l`.`id` = `d`.`locationID`)';
}

// Prepare and execute the query
$result = $conn->query($query);

// Check if the query was executed successfully
if (!$result) {
    // If query execution fails, prepare error response
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";
    $output['data'] = [];

    // Output JSON error response
    echo json_encode($output);

    // Terminate script execution
    exit;
}

// Prepare an array to store found data
$found = [];

// Fetch data rows and store in $found array
while ($row = $result->fetch_assoc()) {
    array_push($found, $row);
}

// Prepare success response
$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data']['found'] = $found;

// Close database connection
mysqli_close($conn);

// Output JSON success response
echo json_encode($output);
?>
