$(document).ready(function () {

// Function to generate location table
function generateLocationTable(data) {
    let tableHtml = '';
    data.forEach(location => {
        tableHtml += '<tr>';
        tableHtml += `<td>${location.locationid}</td>`;
        tableHtml += `<td>${location.locationname}</td>`;
        tableHtml += '<td>';
        tableHtml += `<button class="btn btn-primary btn-sm edit-btn Location-edit-btn" data-id="${location.locationid}" data-name="${location.locationname}"><i class="fa-solid fa-pencil fa-fw"></i></button>`;
        tableHtml += '&nbsp;';
        tableHtml += `<button class="btn btn-danger btn-sm delete-btn Location-delete-btn" data-id="${location.locationid}"><i class="fa-solid fa-trash fa-fw"></i></button>`;
        tableHtml += '</td>';
        tableHtml += '</tr>';
    });
    $('#locationTableBody').html(tableHtml);
}


    // Function to fetch and generate location table
    function fetchAndGenerateLocationTable(searchText) {
        $.ajax({
            url: "php/getLocationDetails.php",
            type: "GET",
            dataType: "json",
            data: {
                txt: searchText // Pass search text to the server-side script
            },
            success: function (response) {
                // Handle the response data here
                console.log(response);
                // Generate table for locations
                generateLocationTable(response.data);
            },
            error: function (xhr, status, error) {
                // Handle errors here
                console.error(error);
            }
        });
    }

    // Initial table generation for locations
    fetchAndGenerateLocationTable(null);

   


// Function to open edit modal
function openEditModal(locationId, locationName) {
    $('#editLocationId').val(locationId);
    $('#editLocationName').val(locationName);
    $('#editLocationModal').modal('show');
}

// Function to open edit modal
$(document).on('click', '.Location-edit-btn', function() {
    var locationId = $(this).data('id');
    var locationName = $(this).data('name');
    openEditModal(locationId, locationName);
});


// Function to handle the submission of the "Edit Location" form
$("#saveChangesBtn").click(function () {
    // Get the edited location ID and name from the input fields
    var locationId = $("#editLocationId").val().trim();
    var locationName = $("#editLocationName").val().trim();
    
    // Validate if location name is not empty
    if (locationName === "") {
        alert("Please enter a location name.");
        return;
    }

    // AJAX request to send data to the server for updating the location
    $.ajax({
        url: "php/editLocation.php", // Replace with the actual URL of your server-side script for updating location
        type: "POST", // Use POST method to send data
        dataType: "json", // Expect JSON response from the server
        data: {
            id: locationId, // Send the edited location ID to the server
            name: locationName // Send the edited location name to the server
        },
        success: function (response) {
            console.log(response);
            // Check if the server successfully processed the request
            if (response.status.code === "200") {
                // Close the modal after successful editing of location
                $("#editLocationModal").modal("hide");

                // Optionally, you can refresh the location table to reflect the changes
                fetchAndGenerateLocationTable(null); // Assuming you have a function to fetch and generate location table
            } else {
                // Display error message if server-side operation failed
                alert("Failed to update location. Please try again.");
            }
        },
        error: function (xhr, status, error) {
            // Handle AJAX errors
            console.error("AJAX error:", error);
            // Display error message to the user
            alert("AJAX error: " + error);
        }
    });
});



// Function to handle deletion of location
function deleteLocation(locationId) {
    // AJAX request to send data to the server for deleting the location
    $.ajax({
        url: "php/deleteLocation.php", // Replace with the actual URL of your server-side script for deleting location
        type: "POST", // Use POST method to send data
        dataType: "json", // Expect JSON response from the server
        data: {
            id: locationId // Send the location ID to the server for deletion
        },
        success: function (response) {
            console.log(response);
            // Check if the server successfully processed the request
            if (response.status.code === "200") {
                // Optionally, you can refresh the location table to reflect the changes
                fetchAndGenerateLocationTable(null); // Assuming you have a function to fetch and generate location table
            } else {
                // Display error message if server-side operation failed
                alert("Failed to delete location. Please try again.");
            }
        },
        error: function (xhr, status, error) {
            // Handle AJAX errors
            console.error("AJAX error:", error);
            // Display error message to the user
            alert("AJAX error: " + error);
        }
    });
}

// Function to bind click event for delete buttons
$(document).on('click', '.Location-delete-btn', function() {
    var locationId = $(this).data('id');
    confirmDelete(locationId);
});

// Function to confirm deletion
function confirmDelete(locationId) {
    if (confirm("Are you sure you want to delete this location?")) {
        deleteLocation(locationId);
    }
}

// Function to handle the submission of the "Add Location" form
$("#saveLocationBtn").click(function () {
    // Get the location name from the input field
    var locationName = $("#locationName").val().trim();
    
    // Validate if location name is not empty
    if (locationName === "") {
        alert("Please enter a location name.");
        return;
    }

    // AJAX request to send data to the server
    $.ajax({
        url: "php/createLocation.php", // Replace with the actual URL of your server-side script
        type: "POST", // Use POST method to send data
        dataType: "json", // Expect JSON response from the server
        data: {
            name: locationName // Send the location name to the server
        },
        success: function (response) {
            console.log(response);
            // Check if the server successfully processed the request
            if (response.status.code === "200") {
                // Close the modal after successful addition of location
                $("#addLocationModal").modal("hide");
                // Optionally, you can refresh the location table to reflect the changes
                fetchAndGenerateLocationTable(null); // Assuming you have a function to fetch and generate location table
            } else {
                // Display error message if server-side operation failed
                alert("Failed to add location. Please try again.");
            }
        },
        error: function (xhr, status, error) {
            // Handle AJAX errors
            console.error("AJAX error:", error);
            // Display error message to the user
            alert("AJAX error: " + error);
        }
    });
});
});