<?php

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
    $output['status']['description'] = "Database connection failed";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // SQL statement is prepared to avoid SQL injection.
    $query = $conn->prepare('UPDATE personnel SET firstName = ?, lastName = ?, email = ?, departmentID = ?, jobTitle = ? WHERE id = ?');
    $query->bind_param("sssssi", $_POST['firstName'], $_POST['lastName'], $_POST['email'], $_POST['departmentID'], $_POST['jobTitle'], $_POST['id']);
    $query->execute();

    if ($query === false) {
        $output['status']['code'] = "400";
        $output['status']['name'] = "error";
        $output['status']['description'] = "Query execution failed";    
        $output['data'] = [];

        mysqli_close($conn);

        echo json_encode($output); 

        exit;
    }

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "Success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) . " sec";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);
} else {
    // If the request method is not POST, return an error response
    $output['status']['code'] = "405";
    $output['status']['name'] = "method_not_allowed";
    $output['status']['description'] = "Method Not Allowed";
    $output['data'] = [];

    echo json_encode($output);
}

?>
