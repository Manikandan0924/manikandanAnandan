<?php
// Remove error reporting for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

// Include database configuration
include("config.php");

// Set response headers
header('Content-Type: application/json; charset=UTF-8');

// Establish database connection
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if the ID is set in the POST request
if (isset($_POST['id'])) {
    // Sanitize the input to prevent SQL injection
    $id = $conn->real_escape_string($_POST['id']);

    // Prepare and execute the SQL DELETE statement
    $sql = "DELETE FROM personnel WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id); // Assuming 'id' is an integer, adjust the type accordingly
    $stmt->execute();

    // Check if the deletion was successful
    if ($stmt->affected_rows > 0) {
        $response['status']['code'] = "200";
        $response['status']['name'] = "ok";
        $response['status']['description'] = "Personnel record deleted successfully";
    } else {
        $response['status']['code'] = "400";
        $response['status']['name'] = "error";
        $response['status']['description'] = "Failed to delete personnel record";
    }

    // Close the prepared statement
    $stmt->close();
} else {
    $response['status']['code'] = "400";
    $response['status']['name'] = "error";
    $response['status']['description'] = "ID not provided in the request";
}

// Close the database connection
$conn->close();

// Output the JSON response
header('Content-Type: application/json');
echo json_encode($response);
?>