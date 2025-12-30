
$(document).ready(function () {

    // 1. Get property id from URL
    const propertyId = window.location.pathname.split("/").pop();
    console.log("Viewing property:", propertyId);

    // 2. Load details from backend
    $.ajax({
        url: `${window.APP_CONFIG.BACKEND_URL}/api/property/${propertyId}`,
        method: "GET",
        success: function (data) {
            console.log("Property loaded:", data);

            const segments = window.location.pathname.split('/').filter(Boolean);
            if (segments.length === 3 && segments[1] === 'edit') {
                console.log("Edit mode");
                makeeditPage(data);
                $('input[name="propertyId"]').val(propertyId);
                renderEditGallery(data.images);
                
            }
            else if (segments.length === 2) {
                populatePage(data);
            }
            
        },
        error: function (err) {
            console.error("Failed to load property:", err);
        }
    });

    // Property Delete 
    $('#id_property_delete').click(async function() {

        const token = await getToken();
        Swal.fire({
            title: "",
            text: 'Are you sure you want to delete this property?',
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'  
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `${window.APP_CONFIG.BACKEND_URL}/api/property/${propertyId}`,
                    method: "DELETE",
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    success: function () {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Your property has been deleted.',
                            icon: 'success'
                        });
                        window.location.href = "/list-property";
                    },
                    error: function (err) {
                        console.error("Failed to delete property:", err);
                        Swal.fire({
                            title: 'Failed!',
                            text: 'Your property was not able to deleted.',
                            icon: 'error'
                        });
                    }
                });
                
            }
        });
        return false; 
    });


     // Property Edit
     $("#id_property_edit").on("click", function () { 
        const propertyId = $('input[name="propertyId"]').val();
    
        window.location.href = "/property/edit/" + propertyId;
    });

    $('#propertyDoneBtn').on("click", function () { 
        const propertyId = $('input[name="propertyId"]').val();
    
        window.location.href = "/property/" + propertyId;
    });
    

});


// ---------------------- POPULATE PAGE ----------------------
function populatePage(data) {

    $("#id_property_status").text(formatStatus(data.propertyStatus));
    $("#id_property_created_at").text(formatDate(data.createdAt));
    $("#id_property_title").text(data.title);
    $("#id_property_address").text(`${data.address}, ${data.city}, ${data.country}`);
    $("#id_property_description").text(data.description || "No description available");

    $('input[name="propertyId"]').val(data.id);

    // Property Detail
    const pd = data.propertyDetail;
    updateDetail("Home Area", pd.squareFeet + " sqft");
    updateDetail("Baths", pd.bathrooms);
    updateDetail("Year built", pd.yearBuilt);
    updateDetail("Condition", pd?.furnishType.replace("_", " ") || "N/A");
    updateDetail("Property Type", data?.propertyType.replace("_", " ") || "N/A");
    updateDetail("Available From", formatDate(data.availableDate));

    updateDetail("Kitchen", pd.kitchens);
    updateDetail("Beds", pd.bedrooms);
    updateDetail("Price", data.price + " " + data.currency);
    updateDetail("Property Status", formatStatus(data.propertyStatus));

    if (data.propertyStatus === "FOR_RENT") {
            $(".rental_frequency").text(` (${data.leaseTerm.replace("_", " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())})`);
    }

    // Amenities
    setCheckbox("#chk_elevator", pd.hasElevator);
    setCheckbox("#chk_garden", pd.hasGarden);
    setCheckbox("#chk_gym", pd.hasGym);
    setCheckbox("#chk_parking", pd.hasParking);
    setCheckbox("#chk_security", pd.hasSecurity);
    setCheckbox("#chk_pool", pd.hasSwimmingPool);

    const af = pd.additionalFeatures;
    setCheckbox("#chk_wifi", af.wifi === "true");
    setCheckbox("#chk_disabled", af.disabledAccess === "true");
    setCheckbox("#chk_aircon", af.airConditioning === "true");
    setCheckbox("#chk_laundry", af.laundry === "true");
    setCheckbox("#chk_heater",  af.heater === "true");

    renderGallery(data.images);
    updateMap(data.latitude, data.longitude);

    const loggedUserId = localStorage.getItem("userId");
    if (isAuthenticated() && loggedUserId && loggedUserId == data.advertiserId) {
        $("#id_property_edit").show();
        $("#id_property_delete").show();
    } else {
        $("#id_property_edit").hide();
        $("#id_property_delete").hide();
    }
}

function makeeditPage(p) {

    console.log("Populating edit page with data:", p);
    $("#input_title").val(p.title);
    $("#input_description").val(p.description);
    $("#input_country").val(p.country);
    $("#input_city").val(p.city);
    $("#input_address").val(p.address);
    $("#input_postal_code").val(p.postalCode);

    $("#input_property_type").val(p.propertyType).change().niceSelect('update');
    $("#input_property_status").val(p.propertyStatus).change().niceSelect('update');
    $("#input_rental_frequency").val(p.leaseTerm).change().niceSelect('update');
    $("#input_currency").val(p.currency);
    $("#input_price").val(p.price);
    $("#available_date").val(p.availableDate);
    $("#input_min_lease").val(p.minLeaseMonths);

    const pd = p.propertyDetail;
    
    $("#input_size").val(pd.squareFeet);
    $("#input_built").val(pd.yearBuilt);
    $("#input_bedroom").val(pd.bedrooms);
    $("#input_bathroom").val(pd.bathrooms);
    $("#input_kitchen").val(pd.kitchens);
    $("#input_furnished_type").val(pd.furnishType).change().niceSelect('update');
    

    // Amenities
    setCheckbox("#chk_elevator", pd.hasElevator);
    setCheckbox("#chk_garden", pd.hasGarden);
    setCheckbox("#chk_gym", pd.hasGym);
    setCheckbox("#chk_parking", pd.hasParking);
    setCheckbox("#chk_security", pd.hasSecurity);
    setCheckbox("#chk_pool", pd.hasSwimmingPool);
   
    const af = pd.additionalFeatures;
    setCheckbox("#chk_wifi", af.wifi === "true");
    setCheckbox("#chk_disabled", af.disabledAccess === "true");
    setCheckbox("#chk_aircon", af.airConditioning === "true");
    setCheckbox("#chk_laundry", af.laundry === "true");
    setCheckbox("#chk_heater",  af.heater === "true");

}

// Edit Submit Button; 

$(".cl_ebtn_property").on("click", function (e) {
    e.preventDefault();

    const propertyId = $('input[name="propertyId"]').val();

    const payload = getPropertyPayload(); // you already have this

    console.log("Submitting property edit:", JSON.stringify(payload));

    $.ajax({
        url: API_URL + "/api/property/update/" + propertyId,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(payload),
        success: function (res) {
            //alert(isEdit ? "Property updated!" : "Property created!");
            Swal.fire({
                title: 'Success!',
                text: 'Property updated successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                var mediaTab = new bootstrap.Tab(document.querySelector('#tabMedia'));
                mediaTab.show();
                $("#propertyId").val(propertyId);
            });
            
        },
        error: function (xhr) {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to update property: ' + xhr.responseText,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    });
});


// ---------------------- Helper Functions ----------------------
function formatStatus(status) {
    return status.replace("_", " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric"
    });
}

function updateDetail(labelName, value) {
    $(".property-detail-info-list label").each(function () {
        if ($(this).text().trim().startsWith(labelName)) {
            $(this).siblings("span").text(value);
        }
    });
}

function setCheckbox(id, val) {
    $(id).prop("checked", !!val);
}

function renderGallery(images) {
    const gallery = $(".ltn__property-details-gallery .row");
    gallery.empty();

    if (!images || images.length === 0) {
        gallery.append(`<p>No images available</p>`);
        return;
    }

    images.forEach(img => { 
        const encodedUrl = encodeURI(img.imageUrl);
        gallery.append(`
            <div class="col-md-4 col-sm-6 col-12 product-img">
                <a href="${encodedUrl}" data-rel="lightcase:gallery">
                    <img class="mb-30" src="${encodedUrl}">
                </a>
            </div>
        `);
    });

    $('a[data-rel^=lightcase]').lightcase();
}

function renderEditGallery(images) {
    const gallery = $("#previewContainer");
    gallery.empty();

    if (!images || images.length === 0) {
        gallery.append(`<p>No images available</p>`);
        return;
    }

    images.forEach(img => { 
        $("#previewContainer").append(`
            <div class="preview-box" data-image-id="${img.id}" 
                 style="display:inline-block;margin:10px;position:relative;width:150px;">

                <img src="${img.imageUrl}" 
                     style="width:150px;height:120px;object-fit:cover;border-radius:6px;display: block;">
                
                <p style="font-size:12px;width:100%;word-wrap: break-word;">${img.fileName}</p>

                <button class="delete-existing-img" 
                      style="position:relative;top:5px;right:5px;
                      background:#dc3545;color:#fff;padding:2px 6px;display: block;width: 100%;
                      border: none; box-sizing: border-box;cursor:pointer;">×</button>
            </div>
        `);
    });
}

$("#previewContainer").on("click", ".delete-existing-img", function () {
    const imageBox = $(this).closest(".preview-box");
    const imageId = imageBox.attr("data-image-id");

    if (imageId === "") {
        // This is a newly added image, just remove from UI
        imageBox.remove();
        return;
    }

    Swal.fire({
        title: "",
        text: 'Are you sure you want to delete this property image?',
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'  
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `${window.APP_CONFIG.BACKEND_URL}/api/property-images/${imageId}`,
                method: "DELETE",
                success: function () {
                    imageBox.remove();
                },
                error: function (err) {
                    alert("Failed to delete image: " + err.responseText);
                }
            });
        }
    });
    return;
});




function updateMap(lat, lng) {
    // $("iframe").attr("src",
    //     `https://www.google.com/maps/embed/v1/view?key=YOUR_API_KEY&center=${lat},${lng}&zoom=16`
    // );
}

