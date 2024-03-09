<?php

// Remove these lines for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

// Include the database configuration file
include("config.php");

// Set the response header
header('Content-Type: application/json; charset=UTF-8');

// Establish a connection to the database
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

// Check if the request is a GET request
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    // Retrieve and sanitize the input data
    $employeeID = $_GET["editPersonnelEmployeeID"];
    $firstName = $_GET["editPersonnelFirstName"];
    $lastName = $_GET["editPersonnelLastName"];
    $jobTitle = $_GET["editPersonnelJobTitle"];
    $emailAddress = $_GET["editPersonnelEmailAddress"];
    $departmentID = $_GET["editPersonnelDepartment"];

    // Perform any additional data validation or sanitization here

    // SQL query to update personnel record
    $query = "UPDATE personnel SET 
            firstName = '$firstName',
            lastName = '$lastName',
            jobTitle = '$jobTitle',
            email = '$emailAddress',
            departmentID = '$departmentID'
            WHERE id = '$employeeID'";

    // Execute the query
    $result = $conn->query($query);

    if (!$result) {
        $output['status']['code'] = "400";
        $output['status']['name'] = "executed";
        $output['status']['description'] = "query failed";  
        $output['data'] = [];

        mysqli_close($conn);

        echo json_encode($output); 
        exit;
    }

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = "Personnel information updated successfully";
    
    mysqli_close($conn);

    echo json_encode($output); 
} else {
    // Handle invalid request method (should be GET)
    http_response_code(405); // Method Not Allowed
    echo json_encode(["error" => "Invalid request method"]);
}

?>
