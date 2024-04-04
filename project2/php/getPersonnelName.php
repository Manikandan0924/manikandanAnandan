<?php
// Include database configuration
include("config.php");

// Check if the ID is set in the POST request
if (isset($_POST['id'])) {
    // Sanitize the input to prevent SQL injection
    $id = $conn->real_escape_string($_POST['id']);

    // Prepare and execute the SQL statement to fetch the personnel name
    $sql = "SELECT CONCAT(lastName, ', ', firstName) AS name FROM personnel WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    // Check if the query was successful
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $response['status']['code'] = "200";
        $response['status']['name'] = "ok";
        $response['data'] = $row;
    } else {
        $response['status']['code'] = "404";
        $response['status']['name'] = "not found";
        $response['data'] = null;
    }

    // Close the prepared statement
    $stmt->close();
} else {
    $response['status']['code'] = "400";
    $response['status']['name'] = "bad request";
    $response['data'] = null;
}

// Output the JSON response
header('Content-Type: application/json');
echo json_encode($response);
?>
