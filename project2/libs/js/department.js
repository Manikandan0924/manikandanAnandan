$(document).ready(function () {

// Function to generate department table
function generateDepartmentTable(data) {
    let tableHtml = '';
    // Add table rows with department details
    data.forEach(department => {
        tableHtml += '<tr>';
        tableHtml += `<td>${department.id}</td>`;
        tableHtml += `<td>${department.name}</td>`;
        tableHtml += `<td>${department.locationName}</td>`; // Display department location
        tableHtml += '<td>';
        // Edit button with data attributes for name and locationName
        tableHtml += `<button class="btn btn-primary btn-sm edit-btn" data-departmentlocationname="${department.locationName}" data-id="${department.id}" data-name="${department.name}" data-locationName="${department.locationName}"><i class="fa-solid fa-pencil fa-fw"></i></button>`;
        // Add some space between the buttons
        tableHtml += '&nbsp;';
        // Delete button with data attributes for name and locationName
        tableHtml += `<button class="btn btn-danger btn-sm delete-btn" data-id="${department.id}" data-name="${department.name}" data-locationName="${department.locationName}"><i class="fa-solid fa-trash fa-fw"></i></button>`;
        tableHtml += '</td>';
        tableHtml += '</tr>';
    });
    // Update the department table body with the generated HTML
    $('#departmentTableBody').html(tableHtml);
}

// Function to fetch and generate department table
function fetchAndGenerateDepartmentTable(searchText) {
    $.ajax({
        url: "php/getAllDepartments.php",
        type: "GET",
        dataType: "json",
        data: {
            txt: searchText // Pass search text to the server-side script
        },
        success: function (response) {
            // Handle the response data here
            console.log(response);
            // Generate table for departments
            generateDepartmentTable(response.data);
        },
        error: function (xhr, status, error) {
            // Handle errors here
            console.error(error);
        }
    });
}

// Initial table generation
fetchAndGenerateDepartmentTable(null);

// Function to populate the department location dropdown in the department modal
function populateDepartmentLocationDropdown() {
    $.ajax({
        url: "php/getLocationDetails.php",
        type: "GET",
        dataType: "json",
        success: function(response) {
            // Clear existing dropdown options
            $('#departmentLocationDropdown').empty();
            // Populate dropdown with fetched locations
            $.each(response.data, function(index, location) {
                $('#departmentLocationDropdown').append($('<option>', {
                    value: location.locationid,
                    text: location.locationname
                }));
            });
        },
        error: function(xhr, status, error) {
            console.error("Error fetching locations:", error);
            // Handle error if needed
        }
    });
}

// Event listener to detect when the department modal is shown
$('#addDepartmentModal').on('shown.bs.modal', function (e) {
    // Populate the department location dropdown when the modal is shown
    populateDepartmentLocationDropdown();
});
// Event listener for edit button click
$(document).on('click', '.edit-btn', function() {
    var departmentId = $(this).data('id');
    var departmentName = $(this).data('name'); // Using data-name attribute
    var departmentlocationname = $(this).data('departmentlocationname'); // Using data-locationid attribute
    // alert(departmentlocationname);
    // Make AJAX call to fetch location details
    $.ajax({
        url: "php/getLocationDetails.php",
        type: "GET",
        dataType: "json",
    
        success: function (response) {
            // Handle the response data here
            var locationName = response.data;
            // Open edit department modal and pass department and location details
            openEditDepartmentModal(departmentId, departmentName, locationName,departmentlocationname);
        },
        error: function (xhr, status, error) {
            // Handle errors here
            console.error(error);
        }
    });
});
function openEditDepartmentModal(departmentId, departmentName, locationName,departmentlocationname) {
    $('#editDepartmentId').val(departmentId);
    $('#editDepartmentName').val(departmentName);
    // alert(departmentName);
    // Clear previous options
    $('#editDepartmentLocationDropdown').empty();

    // Check if locationName is an array
    if (Array.isArray(locationName)) {
        // Iterate over the array and append options
        $.each(locationName, function(index, location) {
            var option = $('<option>', {
                value: location.locationid,
                text: location.locationname
            });
            // Check if current location matches departmentName and set selected attribute
            if (location.locationname === departmentlocationname) {
                option.attr('selected', 'selected');
            }
            $('#editDepartmentLocationDropdown').append(option);
        });
    } else {
        // If locationName is not an array, assume it's a single location name
        $('#editDepartmentLocationDropdown').append($('<option>', {
            value: departmentName,
            text: departmentName,
            selected: 'selected'
        }));
    }

    $('#editDepartmentModal').modal('show');
}


// Function to handle the submission of the "Edit Department" form
$("#saveEditDepartmentBtn").click(function () {
    // Get the edited department ID, name, and location ID from the input fields
    var departmentId = $("#editDepartmentId").val().trim();
    var departmentName = $("#editDepartmentName").val().trim();
    var departmentLocationId = $("#editDepartmentLocationDropdown").val();

    // Validate if department name is not empty
    if (departmentName === "") {
        alert("Please enter a department name.");
        return;
    }

    // AJAX request to send data to the server for updating the department
    $.ajax({
        url: "php/editDepartment.php", // Replace with the actual URL of your server-side script for editing department
        type: "POST", // Use POST method to send data
        dataType: "json", // Expect JSON response from the server
        data: {
            id: departmentId, // Send the edited department ID to the server
            name: departmentName, // Send the edited department name to the server
            locationId: departmentLocationId // Send the edited department location ID to the server
        },
        success: function (response) {
            console.log(response);
            // Check if the server successfully processed the request
            if (response.status.code === "200") {
                // Close the modal after successful editing of department
                $("#editDepartmentModal").modal("hide");
                // Optionally, you can refresh the department table to reflect the changes
                fetchAndGenerateDepartmentTable(null); // Assuming you have a function to fetch and generate department table
            } else {
                // Display error message if server-side operation failed
                alert("Failed to update department. Please try again.");
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

// Event listener for delete button click
$(document).on('click', '.delete-btn', function() {
    var departmentId = $(this).data('id');
    var departmentName = $(this).data('name'); // Using data-name attribute
    var locationName = $(this).data('locationname'); // Using data-locationName attribute
    
    // Open the delete confirmation modal
    $('#deleteDepartmentModal').modal('show');
    
    // Set data attributes in the modal for further processing
    $('#deleteDepartmentModal').data('departmentId', departmentId);
    $('#deleteDepartmentModal').data('departmentName', departmentName);
    $('#deleteDepartmentModal').data('locationName', locationName);
});

// Event listener for confirm delete button click
$('#confirmDeleteDepartmentBtn').on('click', function() {
    // Get department details from the modal data attributes
    var departmentId = $('#deleteDepartmentModal').data('departmentId');
    var departmentName = $('#deleteDepartmentModal').data('departmentName');
    
    // Call the deleteDepartment function
    deleteDepartment(departmentId);
});

// Function to handle deletion of department
function deleteDepartment(departmentId) {
    // AJAX request to send data to the server for deleting the department
    $.ajax({
        url: "php/deleteDepartment.php", // Replace with the actual URL of your server-side script for deleting department
        type: "POST", // Use POST method to send data
        dataType: "json", // Expect JSON response from the server
        data: {
            id: departmentId // Send the department ID to the server for deletion
        },
        success: function (response) {
            console.log(response);
            // Check if the server successfully processed the request
            if (response.status.code === "200") {
                // Optionally, you can refresh the department table to reflect the changes
                fetchAndGenerateDepartmentTable(null); // Assuming you have a function to fetch and generate department table
                // Hide the delete confirmation modal
                $('#deleteDepartmentModal').modal('hide');
            } else {
                // Display error message if server-side operation failed
                alert("Failed to delete department. Please try again.");
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

// Function to handle the submission of the "Add Department" form
$("#saveDepartmentBtn").click(function () {
    // Get the department name from the input field
    var departmentName = $("#departmentName").val().trim();
    var departmentLocationDropdown = $("#departmentLocationDropdown").val();
    
    // Validate if department name is not empty
    if (departmentName === "") {
        alert("Please enter a department name.");
        return;
    }

    // AJAX request to send data to the server
    $.ajax({
        url: "php/createDepartment.php", // Replace with the actual URL of your server-side script for creating departments
        type: "POST", // Use POST method to send data
        dataType: "json", // Expect JSON response from the server
        data: {
            name: departmentName, // Send the department name to the server
            locationID: departmentLocationDropdown // Send the department name to the server
        },
        success: function (response) {
            console.log(response);
            // Check if the server successfully processed the request
            if (response.status.code === "200") {
                // Close the modal after successful addition of department
                $("#addDepartmentModal").modal("hide");
                // Optionally, you can refresh the department table to reflect the changes
                fetchAndGenerateDepartmentTable(null); // Assuming you have a function to fetch and generate department table
            } else {
                // Display error message if server-side operation failed
                alert("Failed to add department. Please try again.");
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