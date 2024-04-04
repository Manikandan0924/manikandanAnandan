<?php

// Example use from browser
// http://localhost/companydirectory/libs/php/getPersonnel.php

// Remove next two lines for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

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

// Check if the ID is set in the POST request
if (isset($_POST['id'])) {
    // Sanitize the input to prevent SQL injection
    $id = $conn->real_escape_string($_POST['id']);

    // Prepare and execute the SQL SELECT statement
    $query = "SELECT p.id, p.firstName, p.lastName, p.jobTitle, p.email FROM personnel p WHERE p.id = $id";
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

    $data = [];

    while ($row = mysqli_fetch_assoc($result)) {
        $personnel = [
            'id' => $row['id'],
            'firstName' => $row['firstName'],
            'lastName' => $row['lastName'],
            'jobTitle' => $row['jobTitle'],
            'email' => $row['email']
        ];
        $data['personnel'][] = $personnel;
    }

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = $data;
} else {
    $output['status']['code'] = "400";
    $output['status']['name'] = "error";
    $output['status']['description'] = "ID not provided in the request";
    $output['data'] = [];
}

mysqli_close($conn);

echo json_encode($output);
?>
