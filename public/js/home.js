
$(document).ready(function() {
    // loadProperties();

    $("#propertySearchForm").submit(function(e) {
        e.preventDefault();
        window.location.href = `/list-property?propertyType=${$("#input_property_type").val()}&propertyStatus=${$("#input_property_status").val()}&city=${$("#input_city").val()}`;
        // loadProperties();
    });

    // Fill right widget area with latest properties
    $.ajax({
        url: window.APP_CONFIG.BACKEND_URL + "/api/property/home-data",
        type: "GET",
        success: function(res) {
            console.log("Home data:", res);
            renderPropertyOptions(res.propertyTypes);
            renderCityOptions(res.propertyCities);
        }
    });
});

// function renderCityOptions(list) {
//     let html = "<option value=''>Choose City</option>";
//     list.forEach(val => {
//         html += `<option value=${val.toLowerCase()}> ${val.replace('_', ' ')}</option>`; 
//     });
//     $("#input_city").html(html);
// }

// function renderPropertyOptions(list) {
//     let html = "<option>Property Type</option>";
//     list.forEach(val => {
//         html += `<option value=${val}> ${val}</option>`; 
//     });
//     $("#input_property_type").html(html);
// }