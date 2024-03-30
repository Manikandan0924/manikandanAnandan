// Function to generate location table
function generateLocationTable(data) {
    let tableHtml = '';
    data.forEach(location => {
        tableHtml += '<tr>';
        tableHtml += `<td>${location.locationname}</td>`;
        tableHtml += '<td class="text-end">';
        tableHtml += `
            <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id="${location.locationid}" data-name="${location.locationname}">
                <i class="fa-solid fa-pencil fa-fw"></i>
            </button>`;
        tableHtml += '&nbsp;';
        tableHtml += `<button class="btn btn-primary btn-sm Location-delete-btn" data-id="${location.locationid}">
            <i class="fa-solid fa-trash fa-fw"></i>
        </button>`;
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
            txt: searchText
        },
        success: function (response) {
            generateLocationTable(response.data);
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}

// Initial table generation for locations
fetchAndGenerateLocationTable(null);

// Edit Location modal event
$(document).ready(function() {
    $(document).on('show.bs.modal', '#editLocationModal', function(e) {
        var locationId = $(e.relatedTarget).attr("data-id");
        var locationName = $(e.relatedTarget).attr("data-name");
        $('#editLocationId').val(locationId);
        $('#editLocationName').val(locationName);
    });
});

// Event handler for submitting the "Edit Location" form
$("#saveEditLocationForm").click(function () {    
    $("#editLocationForm").submit();
});

// Event handler for submitting the "Edit Location" form
$(document).on('submit', '#editLocationForm', function(event) {
    // Prevent the default form submission
    event.preventDefault();

    // Retrieve form data
    var locationId = $("#editLocationId").val().trim();
    var locationName = $("#editLocationName").val().trim();
    
    // Validate if location name is not empty
    if (locationName === "") {
        alert("Please enter a location name.");
        return;
    }

    // Perform AJAX request to update the location
    $.ajax({
        url: "php/editLocation.php",
        type: "POST",
        dataType: "json",
        data: {
            id: locationId,
            name: locationName
        },
        success: function (response) {
            if (response.status.code === "200") {
                $("#editLocationModal").modal("hide");
                fetchAndGenerateLocationTable();
            } else {
                alert("Failed to update location. Please try again.");
            }
        },
        error: function (xhr, status, error) {
            alert("AJAX error: " + error);
        }
    });
});

// Event listener for delete button click for locations
$(document).on('click', '.Location-delete-btn', function() {
    var locationId = $(this).data('id');
    
    // Open the delete confirmation modal
    $('#deleteLocationModal').modal('show');
    
    // Set data attributes in the modal for further processing
    $('#deleteLocationModal').data('locationId', locationId);
});

// Event listener for confirm delete button click for locations
$('#confirmDeleteLocationBtn').on('click', function() {
    // Get location details from the modal data attributes
    var locationId = $('#deleteLocationModal').data('locationId');
    
    // Call the deleteLocation function
    deleteLocation(locationId);
});

// Event listener for cancel button click
$('#cancelDeleteLocationBtn').on('click', function() {
    // Hide the delete confirmation modal
    $('#deleteLocationModal').modal('hide');
});

// Function to handle deletion of location
function deleteLocation(locationId) {
    // AJAX request to send data to the server for deleting the location
    $.ajax({
        url: "php/deleteLocation.php",
        type: "POST",
        dataType: "json",
        data: {
            id: locationId
        },
        success: function (response) {
            if (response.status.code === "200") {
                fetchAndGenerateLocationTable(null);
                $('#deleteLocationModal').modal('hide');
            } else {
                alert("Failed to delete location. Please try again.");
            }
        },
        error: function (xhr, status, error) {
            alert("AJAX error: " + error);
        }
    });
}

// Function to handle the submission of the "Add Location" form
$("#saveLocationBtn").click(function () {
    var locationName = $("#locationName").val().trim();
    
    // Validate if location name is not empty
    if (locationName === "") {
        alert("Please enter a location name.");
        return;
    }

    // AJAX request to send data to the server
    $.ajax({
        url: "php/createLocation.php",
        type: "POST",
        dataType: "json",
        data: {
            name: locationName
        },
        success: function (response) {
            if (response.status.code === "200") {
                $("#addLocationModal").modal("hide");
                fetchAndGenerateLocationTable(null);
            } else {
                alert("Failed to add location. Please try again.");
            }
        },
        error: function (xhr, status, error) {
            alert("AJAX error: " + error);
        }
    });
});



// Add button functionality
$("#addBtn").click(function () {
    var modalpopupvalue = $("#searchType").val();

    if (modalpopupvalue == 'personnel') { 
        $("#addpersonnelModal").modal("show");
    }
    else if (modalpopupvalue == 'department') { 
        $("#addDepartmentModal").modal("show");
    }
    else if (modalpopupvalue == 'location') { 
        $("#addLocationModal").modal("show");
    }
});

// Refresh button functionality
$("#refreshBtn").click(function () {
    // Clear the search input field
    $("#searchInp").val("");
    
    if ($("#personnelBtn").hasClass("active")) {
        // Refresh personnel table
        fetchAndGenerateTable(null, 'personnelTableBody');
    } else if ($("#departmentsBtn").hasClass("active")) {
        // Refresh department table
        fetchAndGenerateDepartmentTable(null);
    } else {
        // Refresh location table
        fetchAndGenerateLocationTable(null);
    }
});

// Personnel button click
$("#personnelBtn").click(function () {
    // Call function to refresh personnel table
    fetchAndGenerateTable(null, 'personnelTableBody');
    $("#searchInp").val(''); // Clear search input
    $("#searchType").val(''); 
    $("#searchType").val('personnel'); 
});

// Departments button click
$("#departmentsBtn").click(function () {
    // Call function to refresh department table
    fetchAndGenerateDepartmentTable(null);
    $("#searchInp").val(''); // Clear search input
    $("#searchType").val(''); 
    $("#searchType").val('department'); 
});

// Locations button click
$("#locationsBtn").click(function () {
    // Call function to refresh location table
    fetchAndGenerateLocationTable(null);
    $("#searchInp").val(''); // Clear search input
    $("#searchType").val(''); 
    $("#searchType").val('location'); 
});

// Function to handle close button click event
function handleCloseButtonClick() {
    $('#editDepartmentModal, #editLocationModal, #addDepartmentModal, #addLocationModal, #addpersonnelModal').modal('hide');
}

// Attach event listener to close buttons
$(document).on('click', '.modal .close', handleCloseButtonClick);
$(document).on('click', '.modal .btn-secondary', handleCloseButtonClick);
