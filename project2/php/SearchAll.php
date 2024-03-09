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

// Modify the queries to include the ORDER BY clause
if ($_REQUEST['txt'] != '') {
    if ($_REQUEST['type'] == 'personnel') {
        // Prepare the query for personnel search
        $query = $conn->prepare('SELECT `p`.`id`, `p`.`firstName`, `p`.`lastName`, `p`.`email`, `p`.`jobTitle`, `d`.`id` as `departmentID`, `d`.`name` AS `departmentName`, `l`.`id` as `locationID`, `l`.`name` AS `locationName` FROM `personnel` `p` LEFT JOIN `department` `d` ON (`d`.`id` = `p`.`departmentID`) LEFT JOIN `location` `l` ON (`l`.`id` = `d`.`locationID`) WHERE `p`.`firstName` LIKE ? OR `p`.`lastName` LIKE ? OR `p`.`email` LIKE ? OR `p`.`jobTitle` LIKE ? OR `d`.`name` LIKE ? OR `l`.`name` LIKE ? ORDER BY `p`.`id`');
        // Bind search text parameter
        $likeText = "%" . $_REQUEST['txt'] . "%";
        $query->bind_param("ssssss", $likeText, $likeText, $likeText, $likeText, $likeText, $likeText);
    } elseif ($_REQUEST['type'] == 'department') {
        // Prepare the query for department search
        $query = $conn->prepare('SELECT d.`id`, d.`name`, l.`name` AS `locationName` FROM `department` d LEFT JOIN `location` l ON d.`locationID` = l.`id` WHERE d.`name` LIKE ? OR l.`name` LIKE ? ORDER BY d.`id`');
        // Bind search text parameter
        $likeText = "%" . $_REQUEST['txt'] . "%";
        $query->bind_param("ss", $likeText, $likeText);
    } elseif ($_REQUEST['type'] == 'location') {
        // Prepare the query for location search
        $query = $conn->prepare('SELECT l.`id` AS locationid, l.`name` AS locationname FROM `location` l WHERE l.`name` LIKE ? ORDER BY l.`id`');
        // Bind search text parameter
        $likeText = "%" . $_REQUEST['txt'] . "%";
        $query->bind_param("s", $likeText);
    }
} else {
    // If search text is empty, execute a query without any filtering and maintain original order
    if ($_REQUEST['type'] == 'personnel') {
        $query = $conn->prepare('SELECT `p`.`id`, `p`.`firstName`, `p`.`lastName`, `p`.`email`, `p`.`jobTitle`, `d`.`id` as `departmentID`, `d`.`name` AS `departmentName`, `l`.`id` as `locationID`, `l`.`name` AS `locationName` FROM `personnel` `p` LEFT JOIN `department` `d` ON (`d`.`id` = `p`.`departmentID`) LEFT JOIN `location` `l` ON (`l`.`id` = `d`.`locationID`) ORDER BY `p`.`id`');
    } elseif ($_REQUEST['type'] == 'department') {
        $query = $conn->prepare('SELECT d.`id`, d.`name`, l.`name` AS `locationName` FROM `department` d LEFT JOIN `location` l ON d.`locationID` = l.`id` ORDER BY d.`id`');
    } elseif ($_REQUEST['type'] == 'location') {
        $query = $conn->prepare('SELECT l.`id` AS locationid, l.`name` AS locationname FROM `location` l ORDER BY l.`id`');
    }
}


// Execute the query
$query->execute();

// Retrieve query results
$result = $query->get_result();

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
