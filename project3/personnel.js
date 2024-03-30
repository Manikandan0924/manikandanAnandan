$(document).ready(function () {

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
        let tableHtml = '';
        // let key = 1; // Initialize a variable to keep track of the incrementing value

        // Add table rows with data and edit/delete buttons
        data.forEach(entry => {
            tableHtml += '<tr>';
            // tableHtml += `<td>${key++}</td>`;
            tableHtml +=
            // tableHtml += `<td>${key++}</td>`;
            tableHtml += `<td>${entry.lastName}, ${entry.firstName}</td>`;
            // tableHtml += `<td>${entry.firstName}</td>`;
            tableHtml += `<td>${entry.department}</td>`; // Use department instead of departmentName
            tableHtml += `<td>${entry.location}</td>`; // Use location instead of locationName

            tableHtml += `<td>${entry.email}</td>`;
            tableHtml += `<td>${entry.jobTitle}</td>`
            tableHtml += '<td class="text-end">'; // Align buttons to the right
            // Edit button with data attributes
            // tableHtml += `<button class="btn btn-primary btn-sm Personnel-edit-btn"  data-bs-target="#editPersonnelModal"
            // data-id="${entry.id}" data-email="${entry.email}" data-firstName="${entry.firstName}" data-lastName="${entry.lastName}" data-department="${entry.department}" data-location="${entry.location}">
            // <i class="fa-solid fa-pencil fa-fw"></i></button>`;
            // Add some space between the buttons
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
        $('#filterModal').modal('show'); // Manually show the filter modal
    });
    
    // Event listener for filter modal shown event
    $('#filterModal').on('show.bs.modal', function (e) {
        // Populate department dropdown when filter modal is shown
        populateFilterDepartmentDropdown();
    });
    
    // Event listener for apply filter button click
    $('#applyFilterBtn').click(function () {
        var selectedDepartment = $('#departmentSelect').val();
        // Call a function to fetch and generate filtered table based on selectedDepartment
        // Pass selectedDepartment to the server-side script to filter data
        fetchAndGenerateFilteredTable(selectedDepartment);
        // Close the filter modal
        $('#filterModal').modal('hide');
    });
    
    // Function to populate department dropdown in the filter modal
    function populateFilterDepartmentDropdown() {
        $.ajax({
            url: "php/getAllDepartments.php", // Update URL to match the PHP file for fetching all departments
            type: "GET",
            dataType: "json",
            success: function(response) {
                // Clear existing dropdown options
                $('#departmentSelect').empty();
                // Populate dropdown with fetched departments
                $.each(response.data, function(index, department) {
                    $('#departmentSelect').append($('<option>', {
                        value: department.name, // Use department name instead of ID
                        text: department.name
                    }));
                });
            },
            error: function(xhr, status, error) {
                // Handle error if needed
            }
        });
    }
    
    // Function to fetch and generate filtered table based on selected department
    function fetchAndGenerateFilteredTable(selectedDepartment) {
        $.ajax({
            url: "php/getFilteredPersonnel.php", // Update URL to match the PHP file for fetching filtered personnel
            type: "GET",
            dataType: "json",
            data: {
                departmentName: selectedDepartment // Send department name instead of ID
            },
            success: function (response) {
                // Handle the response data here
                generatePersonnelTable(response.data, 'personnelTableBody');
            },
            error: function (xhr, status, error) {
                // Handle errors here
            }
        });
    }
    
    // Event listener when the add personnel modal is shown
    $('#addpersonnelModal').on('shown.bs.modal', function (e) {
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
    $("#addPersonnelForm").click(function () {
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
    $(document).ready(function() {
        // Event listener for modal show event
        $(document).on('show.bs.modal', '#editPersonnelModal', function(e) {

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
    });

    $("#saveEditPersonnelForm").click(function () {    
        $("#editPersonnelForm").submit();
    });

    $(document).on('submit', '#editPersonnelForm', function(event) {
        // Prevent the default form submission
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
        
        // Set data attributes in the modal for further processing
        $('#deletePersonnelModal').data('personnelId', personnelId);
        $('#deletePersonnelModal').data('personnelName', personnelName); // Add personnelName attribute
        
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
});