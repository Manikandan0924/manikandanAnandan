<?php

if (isset($_GET['countryName'])) {
    $selectedCountry = $_GET['countryName'];
    $citiesFilePath = 'airports.json'; // Path to your cities data file

    if (file_exists($citiesFilePath)) {
        $citiesJson = file_get_contents($citiesFilePath);

        if ($citiesJson === false) {
            http_response_code(500);
            echo 'Error reading cities JSON file';
            exit;
        }

        $citiesData = json_decode($citiesJson, true);

        if ($citiesData === null && json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(500);
            echo 'Error decoding cities JSON';
            exit;
        }

        $filteredCities = array_filter($citiesData, function ($city) use ($selectedCountry) {
            return isset($city['country']) && $city['country'] === $selectedCountry;
        });

        $filteredCitiesData = array_map(function ($city) {
            return [
                'country' => $city['country'],
                'city' => $city['city'], // Assuming 'city' is the key for city name in airports.json
                'lat' => $city['lat'],
                'lon' => $city['lon']
            ];
        }, $filteredCities);

        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($filteredCitiesData, JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(404);
        echo 'Cities JSON file not found';
    }
} else {
    http_response_code(400);
    echo 'Country name not provided';
}

?>
