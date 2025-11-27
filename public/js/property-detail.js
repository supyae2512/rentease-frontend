
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
            populatePage(data);
        },
        error: function (err) {
            console.error("Failed to load property:", err);
        }
    });

    $('#id_property_delete').click(function() {
        if (confirm("Are you sure you want to delete this property?")) {
            $.ajax({
                url: `${window.APP_CONFIG.BACKEND_URL}/api/property/${propertyId}`,
                method: "DELETE",
                headers: {
                    'Authorization': 'Bearer ' + getToken()
                },
                success: function () {
                    alert("Property deleted successfully.");
                    window.location.href = "/list-property";
                },
                error: function (err) {
                    console.error("Failed to delete property:", err);
                    alert("Failed to delete property.");
                }
            });
        }
    });

});


// ---------------------- POPULATE PAGE ----------------------
function populatePage(data) {

    $("#id_property_status").text(formatStatus(data.propertyStatus));
    $("#id_property_created_at").text(formatDate(data.createdAt));
    $("#id_property_title").text(data.title);
    $("#id_property_address").text(`${data.address}, ${data.city}, ${data.country}`);
    $("#id_property_description").text(data.description || "No description available");

    // Property Detail
    const pd = data.propertyDetail;
    updateDetail("Home Area", pd.squareFeet + " sqft");
    updateDetail("Baths", pd.bathrooms);
    updateDetail("Year built", pd.yearBuilt);
    updateDetail("Condition", pd.furnishType);
    updateDetail("Kitchen", pd.kitchens);
    updateDetail("Beds", pd.bedrooms);
    updateDetail("Price", data.price + " " + data.currency);
    updateDetail("Property Status", formatStatus(data.propertyStatus));

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
    if (loggedUserId && loggedUserId == data.advertiserId) {
        $("#id_property_edit").show();
        $("#id_property_delete").show();
    } else {
        $("#id_property_edit").hide();
        $("#id_property_delete").hide();
    }
}


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
        gallery.append(`
            <div class="col-md-6">
                <a href="${img.imageUrl}" data-rel="lightcase:myCollection">
                    <img class="mb-30" src="${img.imageUrl}">
                </a>
            </div>
        `);
    });
}

function updateMap(lat, lng) {
    // $("iframe").attr("src",
    //     `https://www.google.com/maps/embed/v1/view?key=YOUR_API_KEY&center=${lat},${lng}&zoom=16`
    // );
}

