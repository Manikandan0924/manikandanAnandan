
$(document).ready(function () {

       

    $('#filterPersonnelModal').on('show.bs.modal', function () {
        // Store the selected values
        var selectedDepartment = $('#filterPersonnelByDepartment').val();
        var selectedLocation = $('#filterPersonnelByLocation').val();
    
        // Populate departments dropdown
        $.ajax({
            url: "php/getDepartmentDetails.php",
            type: "GET",
            dataType: "json",
            success: function(response) {
                // $('#filterPersonnelByDepartment').empty('');
                $('#filterPersonnelByDepartment').append($('<option>', {
                    value: '',
                    text: 'All'
                }));
                $.each(response.data, function(index, department) {
                    $('#filterPersonnelByDepartment').append($('<option>', {
                        value: department.id,
                        text: department.name
                    }));
                });
    
                // Set selected value for department dropdown
                $('#filterPersonnelByDepartment').val(selectedDepartment);
            },
            error: function(xhr, status, error) {
                // Handle error
            }
        });
    
        // Populate locations dropdown
        $.ajax({
            url: "php/getLocationDetails.php",
            type: "GET",
            dataType: "json",
            success: function(response) {
                // $('#filterPersonnelByLocation').empty();
                $('#filterPersonnelByLocation').append($('<option>', {
                    value: '',
                    text: 'All'
                }));
                $.each(response.data, function(index, location) {
                    $('#filterPersonnelByLocation').append($('<option>', {
                        value: location.locationid,
                        text: location.locationname
                    }));
                });
    
                // Set selected value for location dropdown
                $('#filterPersonnelByLocation').val(selectedLocation);
            },
            error: function(xhr, status, error) {
                // Handle error
            }
        });
    });
    
    $('#filterBtn').click(function () {
        // Open a modal to allow the user to apply a filter
        $('#filterPersonnelModal').modal('show');
    });
    


    $('#filterPersonnelByDepartment').change(function () {
    $('#filterPersonnelByLocation').val('');
        $.ajax({
            url: "php/filterPersonnelByDepartment.php",
            type: "POST",
            dataType: "json",
            data: {
                departmentID: $('#filterPersonnelByDepartment').val(),
            },
            success: function (response) {
                // console.log('response'+response.data);
                generatePersonnelTable(response.data, 'personnelTableBody');
                
            },
            error: function (xhr, status, error) {
                // console.error(error);
            }
        });

    });


    $('#filterPersonnelByLocation').change(function () {
  $('#filterPersonnelByDepartment').val('');

        $.ajax({
            url: "php/filterPersonnelByLocation.php",
            type: "POST",
            dataType: "json",
            data: {
                LocationID: $('#filterPersonnelByLocation').val(),
            },
            success: function (response) {
                // console.log('response'+response.data);
                generatePersonnelTable(response.data, 'personnelTableBody');
            },
            error: function (xhr, status, error) {
                // console.error(error);
            }
        });

    });


    $('#searchType').val('personnel');

    function generatePersonnelSearchTable(data) {
        let tableHtml = '';
        if (data && data.found) {
            data.found.forEach(entry => {
                tableHtml += '<tr>';
                tableHtml += `<td>${entry.lastName}, ${entry.firstName}</td>`;
                tableHtml += `<td class="d-none d-md-table-cell">${entry.departmentName}</td>`; 
                tableHtml += `<td class="d-none d-md-table-cell">${entry.locationName}</td>`; 
                tableHtml += `<td class="d-none d-md-table-cell">${entry.email}</td>`;
                tableHtml += `<td class="d-none d-md-table-cell">${entry.jobTitle}</td>`
                tableHtml += '<td class="text-end text-nowrap">';
                tableHtml += `
                  <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="${entry.id}">
                    <i class="fa-solid fa-pencil fa-fw"></i>
                  </button>`;
               
                tableHtml += `
                  <button type="button" class="btn btn-primary btn-sm deletePersonnelBtn" data-id="${entry.id}">
                    <i class="fa-solid fa-trash fa-fw"></i>
                  </button>`;

                tableHtml += '</td>';
                tableHtml += '</tr>';
            });
        } else {
            tableHtml += '<tr><td colspan="7">No results found.</td></tr>';
        }

        $('#personnelTableBody').html(tableHtml);
    }

    function generateDepartmentSearchTable(data) {
        let tableHtml = '';
        if (data && data.found) {
            data.found.forEach(department => {
                tableHtml += '<tr>';
                tableHtml += `<td>${department.name}</td>`;
                tableHtml += `<td class="d-none d-md-table-cell">${department.locationName}</td>`; 
                tableHtml += '<td class="text-end text-nowrap">';
                tableHtml += `
                   <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="${department.id}">
                     <i class="fa-solid fa-pencil fa-fw"></i>
                   </button>`;
                
                tableHtml += `
                   <button type="button" class="btn btn-primary btn-sm Department-delete-btn" data-id="${department.id}">
                     <i class="fa-solid fa-trash fa-fw"></i>
                   </button>`;
                tableHtml += '</td>';
                tableHtml += '</tr>';
            });
        } else {
            tableHtml += '<tr><td colspan="4">No results found.</td></tr>';
        }

        $('#departmentTableBody').html(tableHtml);
    }

    function generateLocationSearchTable(data) {
        let tableHtml = '';
        if (data && data.found) {
            data.found.forEach(location => {
                tableHtml += '<tr>';
                tableHtml += `<td>${location.locationname}</td>`; 
                tableHtml += '<td class="text-end text-nowrap">';
                tableHtml += `
                   <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id="${location.locationid}">
                     <i class="fa-solid fa-pencil fa-fw"></i>
                   </button>`;
              
                tableHtml += `
                   <button type="button" class="btn btn-primary btn-sm Location-delete-btn" data-id="${location.locationid}">
                     <i class="fa-solid fa-trash fa-fw"></i>
                   </button>`;
                tableHtml += '</td>';
                tableHtml += '</tr>';
            });
        } else {
            tableHtml += '<tr><td colspan="3">No results found.</td></tr>';
        }

        $('#locationTableBody').html(tableHtml);
    }

    function fetchAndGenerateSearchTable(searchText, searchType) {
        $.ajax({
            url: "php/SearchAll.php",
            type: "GET",
            dataType: "json",
            data: {
                txt: searchText,
                type: searchType 
            },
            success: function (response) {
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
                        break;
                }
            },
            error: function (xhr, status, error) {
                // console.error(error);
            }
        });
    }

    // Search functionality
    $("#searchInp").on("keyup", function () {
        var searchText = $(this).val().trim();
        var searchType = $('#searchType').val(); 
        fetchAndGenerateSearchTable(searchText, searchType);
    });

    // Function to refresh the table based on selected search type
    function refreshTableBasedOnSearchType() {
        var searchText = $("#searchInp").val().trim();
        var searchType = $('#searchType').val(); 
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

    // Add table rows with data and edit/delete buttons
    data.forEach(entry => {
        tableHtml += '<tr>';
        // tableHtml += `<td>${key++}</td>`;
        tableHtml += `<td>${entry.lastName}, ${entry.firstName}</td>`;
        tableHtml += `<td class="d-none d-md-table-cell">${entry.department}</td>`; 
        tableHtml += `<td class="d-none d-md-table-cell">${entry.location}</td>`;
        tableHtml += `<td class="d-none d-md-table-cell">${entry.email}</td>`;
        tableHtml += `<td class="d-none d-md-table-cell">${entry.jobTitle}</td>`
        tableHtml += '<td class="text-end text-nowrap">'; 
        tableHtml += `
        <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="${entry.id}">
          <i class="fa-solid fa-pencil fa-fw"></i>
        </button>`;
        tableHtml += '&nbsp;';
        tableHtml += `<button class="btn btn-primary btn-sm Personnel-delete-btn" data-id="${entry.id}">
        <i class="fa-solid fa-trash fa-fw"></i></button>`;
        tableHtml += '</td>';
        tableHtml += '</tr>';
    });

    $('#' + tableBodyId).html(tableHtml);
}

    
    // Function to fetch and generate table
    function fetchAndGenerateTable(searchText, tableBodyId) {
        $.ajax({
            url: "php/getAll.php", 
            type: "GET",
            dataType: "json",
            data: {
                txt: searchText
            },
            success: function (response) {
            // console.log(response);
                generatePersonnelTable(response.data, tableBodyId);
            },
            error: function (xhr, status, error) {
               // console.error(error);
            }
        });
    }

    // Initial table generation
    fetchAndGenerateTable(null, 'personnelTableBody');

// // Event listener for filter button click to open the modal
// $('#filterBtn').click(function () {
//     // // Reset dropdowns to default state
//     // $('#filterPersonnelByDepartment').val('');
//     // $('#filterPersonnelByLocation').val('');
//     // Open a modal to allow the user to apply a filter
//     $('#filterPersonnelModal').modal('show');
// });



    
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
                // console.error("Error fetching departments:", error);
            }
        });
    }

    // Function to handle the submission of the "Add Personnel" form
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
                // console.log(response);
                if (response.status.code === "200") {
                    $("#addpersonnelModal").modal("hide");
                    refreshPersonnelTable();
                } else {
                    alert("Failed to add personnel. Please try again.");
                }
            },
            error: function (xhr, status, error) {
                // console.error("AJAX error:", error);
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
    
            $("#editPersonnelModal").on("show.bs.modal", function (e) {

                var personnelId = $(e.relatedTarget).attr("data-id");

        $.ajax({
            url: "php/getPersonnelByID.php",
            type: "POST",
            dataType: "json",
            data: {
                id: personnelId,
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
                    $("#editPersonnelModal").modal("hide");
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

    $(document).on('click', '.Personnel-delete-btn', function() {
        var personnelId = $(this).data('id');
        
        $.ajax({
            url: "php/checkPersonnelUse.php",
            type: "POST",
            dataType: "json",
            data: {
                id: personnelId,
            },
            success: function(result) {
                var resultCode = result.status.code;
    
                if (resultCode == 200) {
                    $('#areYouSurePersonnelID').val(result.data.personnel[0].id);
                    $("#areYouSurePersonnelName").text(
                        result.data["personnel"][0].firstName +
                        " " +
                        result.data["personnel"][0].lastName
                    );
    
                    $("#deletePersonnelModal").modal("show");
                } else {
                    $("#areYouSurePersonnelModal .modal-title").replaceWith(
                        "Error retrieving data"
                    );
                }
            },
            error: function(xhr, status, error) {
                alert("AJAX error: " + error);
            }
        });
        $('#deletePersonnelModal').data('personnelId', personnelId);

    });
    
    $('#confirmDeletePersonnelBtn').on('click', function() {
        var personnelId = $('#areYouSurePersonnelID').val();
        deletePersonnel(personnelId);
    });
    
    $('#cancelDeletePersonnelBtn').on('click', function() {
        $('#deletePersonnelModal').modal('hide');
    });
    
    function deletePersonnel(personnelId) {
        $.ajax({
            url: "php/deletePersonnel.php",
            type: "POST",
            dataType: "json",
            data: {
                id: personnelId,
            },
            success: function(response) {
                if (response.status.code === "200") {
                    // Personnel record deleted successfully
                    $('#personnelTableBody').find('[data-id="' + personnelId + '"]').closest('tr').remove();
                    $('#deletePersonnelModal').modal('hide');
                } else {
                    // Failed to delete personnel
                    alert("Failed to delete personnel. Please try again.");
                }
            },
            error: function(xhr, status, error) {
                // AJAX error
                // console.log("AJAX error: ", error);
                alert("AJAX error: " + error);
            }
        });
    }
    
    


// ********************************************************************************************************************************************


// Function to generate department table
function generateDepartmentTable(data) {
    let tableHtml = '';

    // Add table rows with department details
    data.forEach(department => {
        tableHtml += '<tr>';
        tableHtml += `<td>${department.name}</td>`;
        tableHtml += `<td class="d-none d-md-table-cell">${department.locationName}</td>`;
        tableHtml += '<td class="text-end text-nowrap">';
        tableHtml += `
            <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="${department.id}">
                <i class="fa-solid fa-pencil fa-fw"></i>
            </button>`;
        tableHtml += '&nbsp;';
        tableHtml += `<button class="btn btn-primary btn-sm Department-delete-btn" data-id="${department.id}">
            <i class="fa-solid fa-trash fa-fw"></i>
        </button>`;
        tableHtml += '</td>';
        tableHtml += '</tr>';
    });

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
            $('#addDepartmentLocation').empty(); 
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
        event.preventDefault();
    
    // Get the department details from the input fields
    var addDepartmentName = $("#addDepartmentName").val();
    var addDepartmentLocation = $("#addDepartmentLocation").val();

    $.ajax({
        url: "php/createDepartment.php",
        type: "POST",
        dataType: "json",
        data: {
            name: addDepartmentName,
            locationID: addDepartmentLocation
        },
        success: function (response) {
            if (response.status.code === "200") {
                $("#addDepartmentModal").modal("hide");
                refreshDepartmentTable();
            } else {
                alert("Failed to add department. Please try again.");
            }
        },
        error: function (xhr, status, error) {
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

        $("#editDepartmentModal").on("show.bs.modal", function (e) {
            var departmentId = $(e.relatedTarget).attr("data-id");
          
        $.ajax({
            url: "php/getDepartmentByID.php",
            type: "POST",
            dataType: "json",
            data: {
                id: departmentId,
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
        type: "POST",
        dataType: "json",
        data: {
          id: departmentId,
        },
        success: function (result) {
            // console.log(result);
          if (result.status.code == 200) {
            if (result.data[0].personnelCount == 0) {
              $("#areYouSureDeptName").text(result.data[0].departmentName);
    
              $("#areYouSureDeleteDepartmentModal").modal("show");

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
        tableHtml += '<td class="text-end text-nowrap">';
        tableHtml += `
            <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id="${location.locationid}">
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
    event.preventDefault();

    var locationName = $('#addLocationName').val();

    $.ajax({
        url: 'php/createLocation.php',
        type: 'POST',
        dataType: 'json',
        data: {
            name: locationName
        },
        success: function(response) {
            if (response.status.code === '200') {
                // Close the modal
                $('#addLocationModal').modal('hide');
                refreshLocationTable();
            } else {
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


$("#editLocationModal").on("show.bs.modal", function (e) {

        var locationId = $(e.relatedTarget).attr("data-id");
        
          $.ajax({
            url: "php/getLocationByID.php",
            type: "POST",
            dataType: "json",
            data: {
                id: locationId,
            },
            success: function (response) {
                        $('#editLocationId').val(response.data.location[0].id);
                        $('#editLocationName').val(response.data.location[0].name);
            },
            error: function (xhr, status, error) {
                alert("AJAX error: " + error);
            }
        });
    });



$("#editLocationForm").on("submit", function (event) {
    
    event.preventDefault();

    var locationId = $("#editLocationId").val().trim();
    var locationName = $("#editLocationName").val().trim();
    
    if (locationName === "") {
        alert("Please enter a location name.");
        return;
    }

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
    // alert('Hi');
    var locationId = $(this).data('id');
    

    
    $.ajax({
        url:"php/checkLocationUse.php",
        type: "POST",
        dataType: "json",
        data: {
          id: locationId,
        },
        success: function (result) {
            // console.log(result);
          if (result.status.code == 200) {
            if (result.data[0].DepartmentCount == 0) {
              $("#areYouSureLocationName").text(result.data[0].locationName);
    
              $("#areYouSureDeleteLocationModal").modal("show");

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

   
});

// Event listener for confirm delete button click for locations
$('#confirmDeleteLocationBtn').on('click', function() {
    
    var locationId = $('#areYouSureDeleteLocationModal').data('locationId');
    
    deleteLocation(locationId);
});

// Event listener for cancel button click
$('#cancelDeleteLocationBtn').on('click', function() {
    $('#areYouSureDeleteLocationModal').modal('hide');
});

// Function to handle deletion of location
function deleteLocation(locationId) {
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
    $("#searchInp").val(''); 
    $("#searchType").val(''); 
    $("#searchType").val('personnel'); 
});

// Departments button click
$("#departmentsBtn").click(function () {
    $('#filterBtn').prop('disabled', true);

    // Call function to refresh department table
    fetchAndGenerateDepartmentTable(null);
    $("#searchInp").val(''); 
    $("#searchType").val(''); 
    $("#searchType").val('department'); 
});

// Locations button click
$("#locationsBtn").click(function () {
    // Call function to refresh location table
    $('#filterBtn').prop('disabled', true);

    fetchAndGenerateLocationTable(null);
    $("#searchInp").val(''); 
    $("#searchType").val(''); 
    $("#searchType").val('location'); 
});
});
