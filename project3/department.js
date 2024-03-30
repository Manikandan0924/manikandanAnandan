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

// Function to populate the department location dropdown in the department modal
function populateDepartmentLocationDropdown() {
    $.ajax({
        url: "php/getLocationDetails.php",
        type: "GET",
        dataType: "json",
        success: function(response) {
            $('#departmentLocationDropdown').empty();
            $.each(response.data, function(index, location) {
                $('#departmentLocationDropdown').append($('<option>', {
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

// Event listener to detect when the department modal is shown
$('#addDepartmentModal').on('shown.bs.modal', function (e) {
    populateDepartmentLocationDropdown();
});

// Edit Department modal event
$(document).ready(function() {
    $(document).on('show.bs.modal', '#editDepartmentModal', function(e) {
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
});

$("#saveEditDepartmentForm").click(function () {    
    $("#editDepartmentForm").submit();
});

$(document).on('submit', '#editDepartmentForm', function(event) {
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
    
    $('#deleteDepartmentModal').modal('show');
    
    $('#deleteDepartmentModal').data('departmentId', departmentId);
    $('#deleteDepartmentModal').data('departmentName', departmentName);
    $('#deleteDepartmentModal').data('locationName', locationName);
});

$('#confirmDeleteDepartmentBtn').on('click', function() {
    var departmentId = $('#deleteDepartmentModal').data('departmentId');
    deleteDepartment(departmentId);
});

$('#cancelDeleteDepartmentBtn').on('click', function() {
    $('#deleteDepartmentModal').modal('hide');
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

$("#saveDepartmentBtn").click(function () {
    var departmentName = $("#departmentName").val().trim();
    var departmentLocationDropdown = $("#departmentLocationDropdown").val();
    
    if (departmentName === "") {
        alert("Please enter a department name.");
        return;
    }

    $.ajax({
        url: "php/createDepartment.php",
        type: "POST",
        dataType: "json",
        data: {
            name: departmentName,
            locationID: departmentLocationDropdown
        },
        success: function (response) {
            if (response.status.code === "200") {
                $("#addDepartmentModal").modal("hide");
                fetchAndGenerateDepartmentTable(null);
            } else {
                alert("Failed to add department. Please try again.");
            }
        },
        error: function (xhr, status, error) {
            alert("AJAX error: " + error);
        }
   

    });
});
