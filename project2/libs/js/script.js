
$(document).ready(function () {

    $.ajax({
        url: "php/getDepartmentDetails.php",
        type: "GET",
        dataType: "json",
        success: function(response) {
            // Clear existing dropdown options
            $('#filterPersonnelByDepartment').empty();
            $('#filterPersonnelByDepartment').append($('<option>', {
                value: '',
                text: 'Select Department'
            }));
            // Populate dropdown with fetched departments
            $.each(response.data, function(index, department) {

                $('#filterPersonnelByDepartment').append($('<option>', {
                    value: department.id,
                    text: department.name
                }));
            });
        },
        error: function(xhr, status, error) {
            // // console.error("Error fetching departments:", error);
            // Handle error if needed
        }
    });

    $.ajax({
        url: "php/getLocationDetails.php",
        type: "GET",
        dataType: "json",
        success: function(response) {
            $('#filterPersonnelByLocation').empty();
            $('#filterPersonnelByLocation').append($('<option>', {
                value: '',
                text: 'Select Location'
            }));
            $.each(response.data, function(index, location) {
                $('#filterPersonnelByLocation').append($('<option>', {
                    value: location.locationid,
                    text: location.locationname
                }));
            });
        },
        error: function(xhr, status, error) {
            console.error("Error fetching locations:", error);
        }
    });


    $('#filterPersonnelByDepartment').change(function () {

        $.ajax({
            url: "php/filterPersonnelByDepartment.php",
            type: "POST",
            dataType: "json",
            data: {
                departmentID: $('#filterPersonnelByDepartment').val(),
            },
            success: function (response) {
                // Handle the response data here
                console.log('response'+response.data);
                generatePersonnelTable(response.data, 'personnelTableBody');
            },
            error: function (xhr, status, error) {
                // Handle errors here
                console.error(error);
            }
        });

    });


    $('#filterPersonnelByLocation').change(function () {

        $.ajax({
            url: "php/filterPersonnelByLocation.php",
            type: "POST",
            dataType: "json",
            data: {
                LocationID: $('#filterPersonnelByLocation').val(),
            },
            success: function (response) {
                // Handle the response data here
                console.log('response'+response.data);
                generatePersonnelTable(response.data, 'personnelTableBody');
            },
            error: function (xhr, status, error) {
                // Handle errors here
                console.error(error);
            }
        });

    });


    $('#searchType').val('personnel');

    // Function to generate search table for personnel
    function generatePersonnelSearchTable(data) {
        let tableHtml = '';
        // Check if data is not empty and if 'found' property exists
        if (data && data.found) {
            // Add table rows with data and edit/delete buttons
            data.found.forEach(entry => {
                tableHtml += '<tr>';
                tableHtml += `<td>${entry.lastName}, ${entry.firstName}</td>`;
                tableHtml += `<td>${entry.departmentName}</td>`; // Use departmentName instead of department
                tableHtml += `<td>${entry.locationName}</td>`; // Use locationName instead of location
                tableHtml += `<td>${entry.email}</td>`;
                tableHtml += '<td class="text-end">';
                // Edit button
                tableHtml += `
                  <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="${entry.id}">
                    <i class="fa-solid fa-pencil fa-fw"></i>
                  </button>`;
                // Add some space between the buttons
                // tableHtml += '&nbsp;';
                // Delete button
                tableHtml += `
                  <button type="button" class="btn btn-primary btn-sm deletePersonnelBtn" data-id="${entry.id}">
                    <i class="fa-solid fa-trash fa-fw"></i>
                  </button>`;

                tableHtml += '</td>';
                tableHtml += '</tr>';
            });
        } else {
            // If no data is found, display a message
            tableHtml += '<tr><td colspan="7">No results found.</td></tr>';
        }

        // Update the personnel table body with the generated HTML
        $('#personnelTableBody').html(tableHtml);
    }

    // Function to generate search table for departments
    function generateDepartmentSearchTable(data) {
        let tableHtml = '';
        // Check if data is not empty and if 'found' property exists
        if (data && data.found) {
            // Add table rows with department details
            data.found.forEach(department => {
                tableHtml += '<tr>';
                tableHtml += `<td>${department.name}</td>`;
                tableHtml += `<td>${department.locationName}</td>`; // Display department location
                tableHtml += '<td class="text-end">';
                // Edit button
                tableHtml += `
                   <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="${department.id}">
                     <i class="fa-solid fa-pencil fa-fw"></i>
                   </button>`;
                // Add some space between the buttons
                // tableHtml += '&nbsp;';
                // Delete button
                tableHtml += `
                   <button type="button" class="btn btn-primary btn-sm Department-delete-btn" data-id="${department.id}">
                     <i class="fa-solid fa-trash fa-fw"></i>
                   </button>`;
                tableHtml += '</td>';
                tableHtml += '</tr>';
            });
        } else {
            // If no data is found, display a message
            tableHtml += '<tr><td colspan="4">No results found.</td></tr>';
        }

        // Update the department table body with the generated HTML
        $('#departmentTableBody').html(tableHtml);
    }

    // Function to generate search table for locations
    function generateLocationSearchTable(data) {
        let tableHtml = '';
        // Check if data is not empty and if 'found' property exists
        if (data && data.found) {
            // Add table rows with data and edit/delete buttons
            data.found.forEach(location => {
                tableHtml += '<tr>';
                tableHtml += `<td>${location.locationname}</td>`; // Use locationname instead of locationName
                tableHtml += '<td class="text-end">';
                // Edit button
                tableHtml += `
                   <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id="${location.locationid}">
                     <i class="fa-solid fa-pencil fa-fw"></i>
                   </button>`;
                // Add some space between the buttons
                // tableHtml += '&nbsp;';
                // Delete button
                tableHtml += `
                   <button type="button" class="btn btn-primary btn-sm Location-delete-btn" data-id="${location.locationid}">
                     <i class="fa-solid fa-trash fa-fw"></i>
                   </button>`;
                tableHtml += '</td>';
                tableHtml += '</tr>';
            });
        } else {
            // If no data is found, display a message
            tableHtml += '<tr><td colspan="3">No results found.</td></tr>';
        }

        // Update the location table body with the generated HTML
        $('#locationTableBody').html(tableHtml);
    }

    // Function to fetch and generate search table
    function fetchAndGenerateSearchTable(searchText, searchType) {
        $.ajax({
            url: "php/searchAll.php",
            type: "GET",
            dataType: "json",
            data: {
                txt: searchText,
                type: searchType // Add search type parameter
            },
            success: function (response) {
                // Handle the response data here
                switch (searchType) {
                    case 'personnel':
                        generatePersonnelSearchTable(response.data);
                        break;
                    case 'department':
                        generateDepartmentSearchTable(response.data);
                        break;
                    case 'location':
                        generateLocationSearchTable(response.data);
                        break;
                    default:
                        // Handle default case
                        break;
                }
            },
            error: function (xhr, status, error) {
                // Handle errors here
                console.error(error);
            }
        });
    }

    // Search functionality
    $("#searchInp").on("keyup", function () {
        var searchText = $(this).val().trim();
        var searchType = $('#searchType').val(); // Get the selected search type
        // Fetch and generate table using searchAll.php
        fetchAndGenerateSearchTable(searchText, searchType);
    });

    // Function to refresh the table based on selected search type
    function refreshTableBasedOnSearchType() {
        var searchText = $("#searchInp").val().trim();
        var searchType = $('#searchType').val(); // Get the selected search type
        fetchAndGenerateSearchTable(searchText, searchType);
    }

    // Search type change event
    $('#searchType').change(function () {
        refreshTableBasedOnSearchType();
    });

    // Initial table generation
    refreshTableBasedOnSearchType();

   // Function to generate personnel table
function generatePersonnelTable(data, tableBodyId) {
    // console.log(data);
    let tableHtml = '';
    // let key = 1; // Initialize a variable to keep track of the incrementing value

    // Add table rows with data and edit/delete buttons
    data.forEach(entry => {
        tableHtml += '<tr>';
        // tableHtml += `<td>${key++}</td>`;
        tableHtml += `<td>${entry.lastName}, ${entry.firstName}</td>`;
        tableHtml += `<td>${entry.department}</td>`; // Use department instead of departmentName
        tableHtml += `<td>${entry.location}</td>`; // Use location instead of locationName
        tableHtml += `<td>${entry.email}</td>`;
        tableHtml += `<td>${entry.jobTitle}</td>`
        tableHtml += '<td class="text-end">'; // Align buttons to the right
        // Edit button with data attributes
        tableHtml += `
        <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="${entry.id}">
          <i class="fa-solid fa-pencil fa-fw"></i>
        </button>`;
        tableHtml += '&nbsp;';
        // Delete button with data attributes
        tableHtml += `<button class="btn btn-primary btn-sm Personnel-delete-btn"
        data-id="${entry.id}" data-name="${entry.firstName} ${entry.lastName}">
        <i class="fa-solid fa-trash fa-fw"></i></button>`;
        tableHtml += '</td>';
        tableHtml += '</tr>';
    });

    // Update the table body with the generated HTML
    $('#' + tableBodyId).html(tableHtml);
}

    
    // Function to fetch and generate table
    function fetchAndGenerateTable(searchText, tableBodyId) {
        $.ajax({
            url: "php/getAll.php", // Corrected filename
            type: "GET",
            dataType: "json",
            data: {
                txt: searchText
            },
            success: function (response) {
                // Handle the response data here
                // // console.log(response);
                generatePersonnelTable(response.data, tableBodyId);
            },
            error: function (xhr, status, error) {
                // Handle errors here
                // // // console.error(error);
            }
        });
    }

    // Initial table generation
    fetchAndGenerateTable(null, 'personnelTableBody');

// Event listener for filter button click to open the modal
$('#filterBtn').click(function () {
    // Open a modal to allow the user to apply a filter
    $('#filterPersonnelModal').modal('show');
});



    
    // Event listener when the add personnel modal is shown
    $('#addpersonnelModal').on('show.bs.modal', function (e) {
        // event.preventDefault();
        // Get the personnel details from the input fields
        $("#addPersonnelFirstName").val('');
        $("#addPersonnelLastName").val('');
        $("#addPersonnelEmailAddress").val('');
        $("#addPersonnelDepartment").val('');
        $("#addPersonnelJobTitle").val('');
        // Populate the department dropdown when the modal is shown
        populatePersonnelDepartmentDropdown();
    });
    
    // Function to populate the department dropdown in the add personnel modal
    function populatePersonnelDepartmentDropdown() {
        $.ajax({
            url: "php/getDepartmentDetails.php",
            type: "GET",
            dataType: "json",
            success: function(response) {
                // Clear existing dropdown options
                $('#addPersonnelDepartment').empty();
                // Populate dropdown with fetched departments
                $.each(response.data, function(index, department) {
                    $('#addPersonnelDepartment').append($('<option>', {
                        value: department.id,
                        text: department.name
                    }));
                });
            },
            error: function(xhr, status, error) {
                // // console.error("Error fetching departments:", error);
                // Handle error if needed
            }
        });
    }

    // Function to handle the submission of the "Add Personnel" form
    // $("#addPersonnelForm").click(function () {
        $("#addPersonnelForm").on("submit", function (event) {

            event.preventDefault();
        // Get the personnel details from the input fields
        var addPersonnelFirstName = $("#addPersonnelFirstName").val();
        var addPersonnelLastName = $("#addPersonnelLastName").val();
        var addPersonnelEmailAddress = $("#addPersonnelEmailAddress").val();
        var addPersonnelDepartment = $("#addPersonnelDepartment").val();
        var addPersonnelJobTitle = $("#addPersonnelJobTitle").val();


        // AJAX request to send data to the server
        $.ajax({
            url: "php/createPersonnel.php",
            type: "POST",
            dataType: "json",
            data: {
                firstName: addPersonnelFirstName,
                lastName: addPersonnelLastName,
                email: addPersonnelEmailAddress,
                departmentID: addPersonnelDepartment,
                jobTitle: addPersonnelJobTitle
            },
            success: function (response) {
                // // console.log(response);
                // Check if the server successfully processed the request
                if (response.status.code === "200") {
                    // Close the modal after successful addition of personnel
                    $("#addpersonnelModal").modal("hide");
                    // Refresh the table to reflect the changes
                    refreshPersonnelTable();
                } else {
                    // Display error message if server-side operation failed
                    alert("Failed to add personnel. Please try again.");
                }
            },
            error: function (xhr, status, error) {
                // Handle AJAX errors
                // // console.error("AJAX error:", error);
                // Display error message to the user
                alert("AJAX error: " + error);
            }
        });
    });

    // Function to refresh the personnel table
    function refreshPersonnelTable() {
        var searchText = $("#searchInp").val().trim();
        fetchAndGenerateTable(searchText, 'personnelTableBody');
    }



     // Edit personnel modal event
    // $(document).ready(function() {
        // Event listener for modal show event
        // $(document).on('show.bs.modal', '#editPersonnelModal', function(e) {
            $("#editPersonnelModal").on("show.bs.modal", function (e) {


        $.ajax({
            url: "php/getPersonnelByID.php",
            type: "POST",
            dataType: "json",
            data: {
                id: $(e.relatedTarget).attr("data-id")
            },
            success: function (result) {
                var resultCode = result.status.code;

                if (resultCode == 200) {
                    $("#editPersonnelEmployeeID").val(result.data.personnel[0].id);
                    $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
                    $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
                    $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
                    $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);
                    $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);


                    $("#editPersonnelDepartment").html("");

                    $.each(result.data.department, function () {
                        $("#editPersonnelDepartment").append(
                            $("<option>", {
                                value: this.id,
                                text: this.name
                            })
                        );
                    });

                    $("#editPersonnelDepartment").val(result.data.personnel[0].departmentID);
                } else {
                    $("#editPersonnelModal .modal-title").replaceWith("Error retrieving data");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#editPersonnelModal .modal-title").replaceWith("Error retrieving data");
            }
        });
    });
    // });

    // $("#saveEditPersonnelForm").click(function () {    
    //     $("#editPersonnelForm").submit();
    // });

        // Prevent the default form submission
$("#editPersonnelForm").on("submit", function (event) {

        event.preventDefault();

        // Retrieve form data
        var editPersonnelId = $('#editPersonnelEmployeeID').val();
        var editPersonnelFirstName = $('#editPersonnelFirstName').val();
        var editPersonnelLastName = $('#editPersonnelLastName').val();
        var editPersonnelEmailAddress = $('#editPersonnelEmailAddress').val();
        var editPersonnelDepartment = $('#editPersonnelDepartment').val();
        var editPersonnelJobTitle = $('#editPersonnelJobTitle').val();

        // Perform AJAX request
        $.ajax({
            url: "php/EditPersonnel.php",
            type: "POST",
            dataType: "json",
            data: {
                id: editPersonnelId,
                firstName: editPersonnelFirstName,
                lastName: editPersonnelLastName,
                email: editPersonnelEmailAddress,
                departmentID: editPersonnelDepartment,
                jobTitle: editPersonnelJobTitle
            },
            success: function (response) {
                if (response.status.code === "200") {
                    // Close the modal after successful editing of personnel
                    $("#editPersonnelModal").modal("hide");
                    // Optionally, refresh the personnel table to reflect the changes
                    fetchAndGenerateTable($("#searchInp").val().trim(), 'personnelTableBody');
                } else {
                    alert("Failed to update personnel. Please try again.");
                }
            },
            error: function (xhr, status, error) {
                alert("AJAX error: " + error);
            }
        });
    });

    // Event listener for delete button click
    $(document).on('click', '.Personnel-delete-btn', function() {
        // Get data attributes from the button
        var personnelId = $(this).data('id');
        var personnelName = $(this).data('name');
      

        $('#deletePersonnelModal').data('personnelId', personnelId);
        $('#name').html(personnelName); // Add personnelName attribute
        
        // Show the delete modal
        $('#deletePersonnelModal').modal('show');
       
    });

    // Event listener for confirm delete button click
    $('#confirmDeletePersonnelBtn').on('click', function() {
        // Get personnel ID and name from the modal data attributes
        var personnelId = $('#deletePersonnelModal').data('personnelId');
        var personnelName = $('#deletePersonnelModal').data('personnelName');
        
        // Call the deletePersonnel function
        deletePersonnel(personnelId, personnelName); // Pass personnelName as an argument
    });

    // Event listener for cancel button click for delete personnel modal
    $('#cancelDeletePersonnelBtn').on('click', function() {
        // Hide the delete confirmation modal
        $('#deletePersonnelModal').modal('hide');
    });


    // Function to handle deletion of personnel
    function deletePersonnel(personnelId, personnelName) {
        // AJAX request to send data to the server for deleting the personnel
        $.ajax({
            url: "php/deletePersonnel.php", // Replace with the actual URL of your server-side script for deleting personnel
            type: "POST", // Use POST method to send data
            dataType: "json", // Expect JSON response from the server
            data: {
                id: personnelId // Send the personnel ID to the server for deletion
            },
            success: function (response) {
                // // console.log(response);
                // Check if the server successfully processed the request
                if (response.status.code === "200") {
                    // Remove the deleted personnel row from the table
                    $('#personnelTableBody').find('[data-id="' + personnelId + '"]').closest('tr').remove();
                    
                    // Hide the delete confirmation modal
                    $('#deletePersonnelModal').modal('hide');
                } else {
                    // Display error message if server-side operation failed
                    alert("Failed to delete personnel. Please try again.");
                }
            },
            error: function (xhr, status, error) {
                // Handle AJAX errors
                // // console.error("AJAX error:", error);
                // Display error message to the user
                alert("AJAX error: " + error);
            }
        });
    }
// });


// ********************************************************************************************************************************************


// Function to generate department table
function generateDepartmentTable(data) {
    let tableHtml = '';

    // Add table rows with department details
    data.forEach(department => {
        tableHtml += '<tr>';
        tableHtml += `<td>${department.name}</td>`;
        tableHtml += `<td>${department.locationName}</td>`;
        tableHtml += '<td class="text-end">';
        tableHtml += `
            <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="${department.id}" data-name="${department.name}" data-locationName="${department.locationName}">
                <i class="fa-solid fa-pencil fa-fw"></i>
            </button>`;
        tableHtml += '&nbsp;';
        tableHtml += `<button class="btn btn-primary btn-sm Department-delete-btn" data-id="${department.id}" data-name="${department.name}" data-locationName="${department.locationName}">
            <i class="fa-solid fa-trash fa-fw"></i>
        </button>`;
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
            txt: searchText
        },
        success: function (response) {
            generateDepartmentTable(response.data);
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}

// Initial table generation
fetchAndGenerateDepartmentTable(null);


// Event listener to detect when the department modal is shown
$('#addDepartmentModal').on('show.bs.modal', function (e) {
    // event.preventDefault();


      // Clear any previous input field
      $('#addDepartmentName').val('');
      $('#addDepartmentLocation').val('');

    populateDepartmentLocationDropdown();
    
});

// Function to populate the department location dropdown in the department modal
function populateDepartmentLocationDropdown() {
    $.ajax({
        url: "php/getLocationDetails.php",
        type: "GET",
        dataType: "json",
        success: function(response) {
            $('#addDepartmentLocation').empty(); // Assuming addDepartmentLocation is the ID of your dropdown
            $.each(response.data, function(index, location) {
                $('#addDepartmentLocation').append($('<option>', {
                    value: location.locationid,
                    text: location.locationname
                }));
            });
        },
        error: function(xhr, status, error) {
            console.error("Error fetching locations:", error);
        }
    });
}



// Function to handle the submission of the "Add Department" form
$("#addDepartmentForm").submit(function(event) {
        // Prevent the default form submission behavior
        event.preventDefault();
    
    // Get the department details from the input fields
    var addDepartmentName = $("#addDepartmentName").val();
    var addDepartmentLocation = $("#addDepartmentLocation").val();

    // AJAX request to send data to the server
    $.ajax({
        url: "php/createDepartment.php",
        type: "POST",
        dataType: "json",
        data: {
            name: addDepartmentName,
            locationID: addDepartmentLocation
        },
        success: function (response) {
            // Check if the server successfully processed the request
            if (response.status.code === "200") {
                // Close the modal after successful addition of department
                $("#addDepartmentModal").modal("hide");
                // Refresh the table to reflect the changes
                refreshDepartmentTable();
            } else {
                // Display error message if server-side operation failed
                alert("Failed to add department. Please try again.");
            }
        },
        error: function (xhr, status, error) {
            // Handle AJAX errors
            alert("AJAX error: " + error);
        }
    });
});

 // Function to refresh the personnel table
 function refreshDepartmentTable() {
    var searchText = $("#searchInp").val().trim();
    fetchAndGenerateDepartmentTable(searchText, 'departmentTableBody');
}

// Edit Department modal event
// $(document).ready(function() {
    // $(document).on('show.bs.modal', '#editDepartmentModal', function(e) {
        $("#editDepartmentModal").on("show.bs.modal", function (e) {

        $.ajax({
            url: "php/getDepartmentByID.php",
            type: "POST",
            dataType: "json",
            data: {
                id: $(e.relatedTarget).attr("data-id")
            },
            success: function (result) {
                var resultCode = result.status.code;
                if (resultCode == 200) {
                    $("#editDepartmentId").val(result.data.Department[0].id);
                    $("#editDepartmentName").val(result.data.Department[0].name);
                    $("#editDepartmentLocationDropdown").html("");
                    $.each(result.data.location, function () {
                        $("#editDepartmentLocationDropdown").append(
                            $("<option>", {
                                value: this.id,
                                text: this.name
                            })
                        );
                    });
                    $("#editDepartmentLocationDropdown").val(result.data.Department[0].locationID);
                } else {
                    $("#editDepartmentModal .modal-title").replaceWith("Error retrieving data");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#editDepartmentModal .modal-title").replaceWith("Error retrieving data");
            }
        });
    });
// });

// $("#saveEditDepartmentForm").click(function () {    
//     $("#editDepartmentForm").submit();
// });

$("#editDepartmentForm").on("submit", function (event) {
    event.preventDefault();

    var departmentId = $("#editDepartmentId").val().trim();
    var departmentName = $("#editDepartmentName").val().trim();
    var departmentLocationId = $("#editDepartmentLocationDropdown").val();

    if (departmentName === "") {
        alert("Please enter a department name.");
        return;
    }

    $.ajax({
        url: "php/editDepartment.php",
        type: "POST",
        dataType: "json",
        data: {
            id: departmentId,
            name: departmentName,
            locationId: departmentLocationId
        },
        success: function (response) {
            if (response.status.code === "200") {
                $("#editDepartmentModal").modal("hide");
                fetchAndGenerateDepartmentTable($("#searchInp").val().trim());
            } else {
                alert("Failed to update department. Please try again.");
            }
        },
        error: function (xhr, status, error) {
            alert("AJAX error: " + error);
        }
    });
});

$(document).on('click', '.Department-delete-btn', function() {
    var departmentId = $(this).data('id');
    var departmentName = $(this).data('name');
    var locationName = $(this).data('locationname');
    

    $.ajax({
        url:"php/checkDepartmentUse.php",
        // SELECT d.name AS departmentName, COUNT(p.id) as personnelCount FROM department d LEFT JOIN personnel p ON (p.departmentID = d.id) WHERE d.id  = ?
        type: "POST",
        dataType: "json",
        data: {
          id: departmentId // Retrieves the data-id attribute from the calling button
        },
        success: function (result) {
            console.log(result);
          if (result.status.code == 200) {
            if (result.data[0].personnelCount == 0) {
              $("#areYouSureDeptName").text(result.data[0].departmentName);
    
              $("#areYouSureDeleteDepartmentModal").modal("show");
    // $('#deleteDepartmentModal').modal('show');

            } else {
              $("#cantDeleteDeptName").text(result.data[0].departmentName);
              $("#personnelCount").text(result.data[0].personnelCount);
    
              $("#cantDeleteDepartmentModal").modal("show");
            }
          } else {
            $("#exampleModal .modal-title").replaceWith("Error retrieving data");
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          $("#exampleModal .modal-title").replaceWith("Error retrieving data");
        }
      });

    
    $('#areYouSureDeleteDepartmentModal').data('departmentId', departmentId);
    $('#areYouSureDeleteDepartmentModal').data('departmentName', departmentName);
    $('#areYouSureDeleteDepartmentModal').data('locationName', locationName);
});

$('#confirmDeleteDepartmentBtn').on('click', function() {
    var departmentId = $('#areYouSureDeleteDepartmentModal').data('departmentId');
    deleteDepartment(departmentId);
});

$('#cancelDeleteDepartmentBtn').on('click', function() {
    $('#areYouSureDeleteDepartmentModal').modal('hide');
});

function deleteDepartment(departmentId) {
    $.ajax({
        url: "php/deleteDepartment.php",
        type: "POST",
        dataType: "json",
        data: {
            id: departmentId
        },
        success: function (response) {
            if (response.status.code === "200") {
                fetchAndGenerateDepartmentTable(null);
                $('#deleteDepartmentModal').modal('hide');
            } else {
                alert("Failed to delete department. Please try again.");
            }
        },
        error: function (xhr, status, error) {
            alert("AJAX error: " + error);
        }
    });
}


// ********************************************************************************************************************************************

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


// Event listener to detect when the add location modal is shown
$('#addLocationModal').on('show.bs.modal', function (e) {
    // event.preventDefault();

    // Clear any previous input in the location name field
    $('#addLocationName').val('');
});


// Event listener for the add location form submission
$('#addLocationForm').submit(function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the location name from the input field
    var locationName = $('#addLocationName').val();

    // Send an AJAX request to insert the location into the database
    $.ajax({
        url: 'php/createLocation.php',
        type: 'POST',
        dataType: 'json',
        data: {
            name: locationName
        },
        success: function(response) {
            // Check if the insertion was successful
            if (response.status.code === '200') {
                // Close the modal
                $('#addLocationModal').modal('hide');
                refreshLocationTable();
                // Optionally, you can update the location dropdown or perform any other necessary actions
            } else {
                // Handle the case where the insertion failed
                console.error('Failed to add location:', response.status.description);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error adding location:', error);
        }
    });
});



 // Function to refresh the personnel table
 function refreshLocationTable() {
    var searchText = $("#searchInp").val().trim();
    fetchAndGenerateLocationTable(searchText, 'locationTableBody');
}


// Edit Location modal event
// $(document).ready(function() {
//     $(document).on('show.bs.modal', '#editLocationModal', function(e) {
        $("#editLocationModal").on("show.bs.modal", function (e) {

        var locationId = $(e.relatedTarget).attr("data-id");
        var locationName = $(e.relatedTarget).attr("data-name");
        $('#editLocationId').val(locationId);
        $('#editLocationName').val(locationName);
    });
// });

// Event handler for submitting the "Edit Location" form
// $("#saveEditLocationForm").click(function () {    
//     $("#editLocationForm").submit();
// });

// Event handler for submitting the "Edit Location" form
// $(document).on('submit', '#editLocationForm', function(event) {
    $("#editLocationForm").on("submit", function (event) {
    
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
    

    
    $.ajax({
        url:"php/checkLocationUse.php",
        // SELECT d.name AS departmentName, COUNT(p.id) as personnelCount FROM department d LEFT JOIN personnel p ON (p.departmentID = d.id) WHERE d.id  = ?
        type: "POST",
        dataType: "json",
        data: {
          id: locationId // Retrieves the data-id attribute from the calling button
        },
        success: function (result) {
            console.log(result);
          if (result.status.code == 200) {
            if (result.data[0].DepartmentCount == 0) {
              $("#areYouSureLocationName").text(result.data[0].locationName);
    
              $("#areYouSureDeleteLocationModal").modal("show");
    // $('#deleteDepartmentModal').modal('show');

            } else {
              $("#cantDeleteLocationName").text(result.data[0].locationName);
              $("#DepartmentCount").text(result.data[0].DepartmentCount);
    
              $("#cantDeleteLocationModal").modal("show");
            }
          } else {
            $("#exampleModal .modal-title").replaceWith("Error retrieving data");
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          $("#exampleModal .modal-title").replaceWith("Error retrieving data");
        }
      });

    
    $('#areYouSureDeleteLocationModal').data('locationId', locationId);

    // Open the delete confirmation modal
    // $('#deleteLocationModal').modal('show');
    
    // Set data attributes in the modal for further processing
});

// Event listener for confirm delete button click for locations
$('#confirmDeleteLocationBtn').on('click', function() {
    // alert("hi");
    // Get location details from the modal data attributes
    var locationId = $('#areYouSureDeleteLocationModal').data('locationId');
    
    // Call the deleteLocation function
    deleteLocation(locationId);
});

// Event listener for cancel button click
$('#cancelDeleteLocationBtn').on('click', function() {
    // Hide the delete confirmation modal
    $('#areYouSureDeleteLocationModal').modal('hide');
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
    $('#filterBtn').prop('disabled', false);

    fetchAndGenerateTable(null, 'personnelTableBody');
    $("#searchInp").val(''); // Clear search input
    $("#searchType").val(''); 
    $("#searchType").val('personnel'); 
});

// Departments button click
$("#departmentsBtn").click(function () {
    $('#filterBtn').prop('disabled', true);

    // Call function to refresh department table
    fetchAndGenerateDepartmentTable(null);
    $("#searchInp").val(''); // Clear search input
    $("#searchType").val(''); 
    $("#searchType").val('department'); 
});

// Locations button click
$("#locationsBtn").click(function () {
    // Call function to refresh location table
    $('#filterBtn').prop('disabled', true);

    fetchAndGenerateLocationTable(null);
    $("#searchInp").val(''); // Clear search input
    $("#searchType").val(''); 
    $("#searchType").val('location'); 
});
});

// // Function to handle close button click event
// function handleCloseButtonClick() {
//     $('#editDepartmentModal, #editLocationModal, #addDepartmentModal, #addLocationModal, #addpersonnelModal').modal('hide');
// }

// // Attach event listener to close buttons
// $(document).on('click', '.modal .close', handleCloseButtonClick);
// $(document).on('click', '.modal .btn-secondary', handleCloseButtonClick);
// });

