<?php
if (isset($_GET['countryName'])) {
    $selectedCountry = $_GET['countryName'];
    $airportsFilePath = 'airports.json';

    if (file_exists($airportsFilePath)) {
        $airportsJson = file_get_contents($airportsFilePath);

        if ($airportsJson === false) {
            http_response_code(500);
            echo 'Error reading airports JSON file';
            exit;
        }

        $airportsData = json_decode($airportsJson, true);

        if ($airportsData === null && json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(500);
            echo 'Error decoding airports JSON';
            exit;
        }

        $filteredAirports = array_filter($airportsData, function ($airport) use ($selectedCountry) {
            return isset($airport['country']) && $airport['country'] === $selectedCountry;
        });

        // Keep track of airport names to avoid duplicates
        $airportNames = [];

        $filteredAirportsData = [];
        foreach ($filteredAirports as $airport) {
            $name = $airport['name'];
            $city = $airport['city'];

            // Check if the name and city are the same to avoid duplicates
            if ($name === $city) {
                // If airport name is not already added, add it
                if (!in_array($name, $airportNames)) {
                    $filteredAirportsData[] = [
                        'name' => $name,
                        'lat' => $airport['lat'],
                        'lon' => $airport['lon']
                    ];
                    // Add airport name to the list
                    $airportNames[] = $name;
                }
            } else {
                $airportFullName = "$name, $city";
                // If airport full name is not already added, add it
                if (!in_array($airportFullName, $airportNames)) {
                    $filteredAirportsData[] = [
                        'name' => $airportFullName,
                        'lat' => $airport['lat'],
                        'lon' => $airport['lon']
                    ];
                    // Add airport full name to the list
                    $airportNames[] = $airportFullName;
                }
            }
        }

        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($filteredAirportsData, JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(404);
        echo 'Airports JSON file not found';
    }
} else {
    http_response_code(400);
    echo 'Country name not provided';
}
?>
