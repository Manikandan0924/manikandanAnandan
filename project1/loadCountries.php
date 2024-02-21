<?php
$geojsonFilePath = 'countryBorders.geo.json';
if (file_exists($geojsonFilePath)) {
    $geojson = file_get_contents($geojsonFilePath);
    $data = json_decode($geojson, true);
    $countries = array();
    foreach ($data['features'] as $feature) {
        $isoCode = isset($feature['properties']['iso_a2']) ? $feature['properties']['iso_a2'] : null;
        $countryName = isset($feature['properties']['name']) ? $feature['properties']['name'] : null;
        $geometry = isset($feature['geometry']) ? $feature['geometry'] : null;
        if ($isoCode !== null && $countryName !== null) {            
            $country = new stdClass();
            $country -> isoCode = $isoCode;
            $country -> countryName = $countryName;
            $country -> geometry = $geometry;
            array_push($countries, $country);
        }
    }
    // Sort countries alphabetically by countryName
    usort($countries, function ($a, $b) {
        return strcmp($a->countryName, $b->countryName);
    });
    // Output country options as JSON
    header('Content-Type: application/json');
    echo json_encode($countries);
} else {
    http_response_code(404);
    echo 'GeoJSON file not found';
}
?>