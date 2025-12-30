
    $(document).ready(function() {
    
        $("#searchForm").submit(function(e) {
            e.preventDefault();
            currentPage = 0;
            // loadProperties();
        });

        // Fill right widget area with latest properties
        if (window.location.pathname === '/list-property') {
            loadProperties(); 
            $.ajax({
                url: API_URL + "/api/property/widget-data",
                type: "GET",
                success: function(res) {
                    renderPropertyType(res.propertyTypes);
                    renderStatus(res.statuses);
                    renderAmenities(res.amenities);
                }
            });

        } else {
            $.ajax({
                url:  window.APP_CONFIG.BACKEND_URL + "/api/property/home-data",
                type: "GET",
                success: function(res) {
                    console.log("Home data:", res);
                    renderPropertyOptions(res.propertyTypes);
                    renderCityOptions(res.propertyCities);
                }
            });
        }
        
    });

    function loadProperties() {
        const params = new URLSearchParams(window.location.search);
        console.log("Search params:", params.toString());
        $.ajax({
            url: API_URL + "/api/property/list",
            method: "GET",
            data: {
                page: currentPage,
                size: pageSize,
                keyword: $("#searchKeyword").val(),
                propertyType: params?.get('propertyType') || $("#input_property_type").val(),
                propertyStatus: params?.get('propertyStatus') || $("#input_property_status").val(),
                city: params?.get('city') || $("#input_city").val()
            },
            success: function(response) {
                renderPropertyList(response.content);
                renderPropertyGrid(response.content);
                renderPagination(response);
            },
            error: function(xhr) {
                console.error(xhr.responseText);
            }
        });
    }

    function renderPropertyGrid(list) {
        let container = $("#propertyGridContainer");
        container.empty();

        list.forEach(item => {
            const template = `<div class="col-xl-6 col-sm-6 col-12">
                                        <div class="ltn__product-item ltn__product-item-4 ltn__product-item-5 text-center---">
                                            <div class="product-img">
                                                <a href="/property/${item.id}">
                                                    <img src="${item.images?.length ? item.images[0].imageUrl : 'img/no-image.jpg'}" alt="#">
                                                </a>
                                                
                                            </div>
                                            <div class="product-info">
                                                <div class="product-badge">
                                                    <ul>
                                                        <li class="sale-badg">${item.propertyStatus.replace("_", " ")}</li>
                                                    </ul>
                                                </div>
                                                <h2 class="product-title">
                                                    <a href="/property/${item.id}">${item.title}</a></h2>
                                                <div class="product-img-location">
                                                    <ul>
                                                        <li>
                                                            <a href="locations.html"><i class="flaticon-pin"></i> ${item.city}, ${item.country} </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <ul class="ltn__list-item-2--- ltn__list-item-2-before--- ltn__plot-brief">
                                                    <li><span> ${item.propertyDetail?.bedrooms || 0} </span>
                                                        Bed
                                                    </li>
                                                    <li><span> ${item.propertyDetail?.bathrooms || 0} </span>
                                                        Bath
                                                    </li>
                                                    <li><span>${item.propertyDetail?.squareFeet || 0} </span>
                                                        Square Ft
                                                    </li>
                                                </ul>
                                                <div class="product-hover-action">
                                                    <ul>
                                                       
                                                        <li>
                                                            <a href="#" title="Wishlist" data-bs-toggle="modal" data-bs-target="#liton_wishlist_modal">
                                                                <i class="flaticon-heart-1"></i></a>
                                                        </li>
                                                        <li>
                                                            <a href="/property/${item.id}" title="Details" data-id="${item.id}" class="btn-view-property">
                                                                <i class="flaticon-expand"></i>
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div class="product-info-bottom">
                                                <div class="product-price">
                                                    <span>
                                                    ${(item.currency === 'JPY') ? "¥" : "$"}
                                                    ${item.price}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                `;

            container.append(template);
        });
    }

    function renderPropertyList(list) {
        let container = $("#propertyListContainer");
        container.empty();

        if (list.length === 0) {
            container.append(`<div class='col-lg-12 text-center'><h3>No properties found.</h3></div>`);
            return;
        }

        list.forEach(item => {
            const template = `
                <div class="col-lg-12">
                    <div class="ltn__product-item ltn__product-item-4 ltn__product-item-5">
                        
                        <div class="product-img">
                            <a href="/property/${item.id}">
                                <img src="${item.images?.length ? item.images[0].imageUrl : 'img/no-image.jpg'}" alt="#">
                            </a>
                        </div>

                        <div class="product-info">
                            <div class="product-badge-price">
                                <div class="product-badge">
                                    <ul>
                                        <li class="sale-badg">${item.propertyStatus.replace("_", " ")}</li>
                                    </ul>
                                </div>
                                <div class="product-price">
                                    <span>
                                    ${(item.currency === 'JPY') ? "¥" : "$"}
                                    ${item.price}</span>
                                </div>
                            </div>

                            <h2 class="product-title">
                                <a href="/property/${item.id}">${item.title}</a>
                            </h2>

                            <div class="product-img-location">
                                <ul>
                                    <li>
                                        <a><i class="flaticon-pin"></i> ${item.city}, ${item.country}</a>
                                    </li>
                                </ul>
                            </div>

                            <ul class="ltn__list-item-2-before--- ltn__plot-brief">
                                <li><span>${item.propertyDetail?.bedrooms || 0} </span> Bed</li>
                                <li><span>${item.propertyDetail?.bathrooms || 0} </span> Bath</li>
                                <li><span>${item.propertyDetail?.squareFeet || 0}</span> Sq Ft</li>
                            </ul>
                        </div>

                        <div class="product-info-bottom">
                            <div class="product-hover-action">
                                <ul>
                                    
                                    <li>
                                        <a href="#" title="Wishlist"><i class="flaticon-heart-1"></i></a>
                                    </li>
                                    <li>
                                        <a href="/property/${item.id}" title="Details">
                                            <i class="flaticon-expand"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            `;

            container.append(template);
        });
    }

    function renderPagination(data) {
        let pagination = $("#paginationContainer");
        pagination.empty();

        // Previous
        pagination.append(`
            <li><a href="#" onclick="gotoPage(${data.number - 1})"><i class="fas fa-angle-double-left"></i></a></li>
        `);

        // Numbers
        for (let i = 0; i < data.totalPages; i++) {
            pagination.append(`
                <li><a href="#" class="${i === data.number ? 'active' : ''}"
                       onclick="gotoPage(${i})">${i + 1}</a></li>
            `);
        }

        // Next
        pagination.append(`
            <li><a href="#" onclick="gotoPage(${data.number + 1})"><i class="fas fa-angle-double-right"></i></a></li>
        `);
    }

    function gotoPage(page) {
        if (page < 0) return;
        currentPage = page;
        loadProperties();
    }

    $("#btnCreateProperty").click(function () {
        // if (!requireLogin("/add-property")) {
        //     return;
        // }
        window.location.href = "/add-property";
    });

    // Add new property
    $(".cl_btn_property").on("click", async function (e) {
        e.preventDefault();

        if ($("#input_title").val().trim() === "" || 
            $("#input_city").val().trim() === "" || 
            $("#input_property_type").val().trim() === "" ||
            $("#input_property_status").val().trim() === "" ||
            $("#input_price").val().trim() === "") {

            // To highlight empty required fields;
            requiredPropertyFields.forEach(function(id) {
                if ($(id).val().trim() === "") {
                    $(id).addClass('is-invalid');
                    isValid = false;
                }
            });
            
            Swal.fire({
                title: '',
                text: 'Please fill in all required fields.',
                icon: 'warning'
            });
            return;
        }

        // Build JSON payload
        const payload = {
            title: $("#input_title").val(),
            description: $("#input_description").val(),
            propertyType: $("#input_property_type").val(),
            propertyStatus: $("#input_property_status").val(),
            price: parseFloat($("#input_price").val()) || 0,
            currency: $("#input_currency").val(), // You may add currency field later in UI
            address: $("#input_address").val(),
            city: $("#input_city").val(),
            postalCode: $("#input_postal_code").val(),
            country: $("#input_country").val(),
            latitude: 1.3515,   // if needed, later use Google Maps API
            longitude: 103.8667,
            availableDate: $("#available_date").val(),
            leaseTerm: $("#input_rental_frequency").val(),
            minLeaseMonths: parseInt($("#input_min_lease").val()) || 0,
            
            // Backend no longer needs advertiserId from frontend — extracted from JWT.
            // Only include if API requires it:
            // advertiserId: 1,

            propertyDetail: {
                bedrooms: parseInt($("#input_bedroom").val()) || 0,
                bathrooms: parseInt($("#input_bathroom").val()) || 0,
                kitchens: parseInt($("#input_kitchen").val()) || 0,
                squareFeet: parseInt($("#input_size").val()) || 0,
                yearBuilt: parseInt($("#input_built").val()) || 0,
                
                furnishType: $("#input_furnished_type").val(),

                hasParking: $("#chk_parking").is(":checked"),
                hasSwimmingPool: $("#chk_pool").is(":checked"),
                hasElevator: $("#chk_elevator").is(":checked"),
                hasGarden: $("#chk_garden").is(":checked"),
                hasSecurity: $("#chk_security").is(":checked"),
                hasGym: $("#chk_gym").is(":checked"),

                additionalFeatures: {
                    wifi: $("#chk_wifi").is(":checked"),
                    disabledAccess: $("#chk_disabled").is(":checked"),
                    airConditioning: $("#chk_aircon").is(":checked"),
                    laundry: $("#chk_laundry").is(":checked"),
                    heater: $("#chk_heater").is(":checked")
                }
            }
        };

        console.log(">>> Sending JSON payload:", JSON.stringify(payload));

        const token = await getToken();
        $.ajax({
            url: API_URL + "/api/property/create",
            type: "POST",
            headers: {
                "Authorization": "Bearer " + token 
            },
            contentType: "application/json",
            data: JSON.stringify(payload),
            success: function (res) {
                Swal.fire({
                    title: '',
                    text: 'Property created successfully!',
                    icon: 'info'
                });
                console.log("Created property ID:", res.data.id);
                var mediaTab = new bootstrap.Tab(document.querySelector('#tabMedia'));
                mediaTab.show();
                $('input[name="propertyId"]').val(res.data.id);
            },
            error: function (xhr) {
                Swal.fire({
                    title: '',
                    text: 'Error creating property: ' + xhr.responseText,
                    icon: 'error'
                });
                return false;
            }
        });

    });


    // Old version with preview replacement; 
    // $("#propertyMedia").on("change", function () {
    //     $("#previewContainer").empty(); // clear old previews
    
    //     const files = this.files;
    
    //     if (!files || files.length === 0) return;
    
    //     Array.from(files).forEach(file => {
    //         const reader = new FileReader();
    //         reader.onload = function (e) {
    //             $("#previewContainer").append(`
    //                 <div class="preview-box" style="display:inline-block;margin:10px;">
    //                     <img src="${e.target.result}" style="width:150px;height:120px;object-fit:cover;border-radius:6px;">
    //                     <p style="font-size:12px;">${file.name}</p>
    //                 </div>
    //             `);
    //         };
    //         reader.readAsDataURL(file);
    //     });
    // });

    // Now will support to show existing images too;
    $("#propertyMedia").on("change", function () {
        // $("#previewContainer").empty(); // clear old previews
        const files = this.files;
        if (!files || files.length === 0) return;
    
        Array.from(files).forEach(file => {

            if (file.size > MAX_SIZE_BYTES) {
                Swal.fire({
                    title: '',
                    text: `File ${file.name} exceeds ${MAX_SIZE_MB} MB limit!`,
                    icon: 'warning'
                });
                e.target.value = ""; 
                return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                $("#previewContainer").append(`
                    <div class="preview-box" data-image-id="" 
                        style="display:inline-block;margin:10px;position:relative;width:150px;">

                        <img src="${e.target.result}" 
                            style="width:150px;height:120px;object-fit:cover;border-radius:6px;display: block;">
                        
                        <p style="font-size:12px;width:100%;word-wrap: break-word;">${file.name}</p>

                        <button class="delete-existing-img" 
                            style="position:relative;top:5px;right:5px;
                            background:#dc3545;color:#fff;padding:2px 6px;display: block;width: 100%;
                            border: none; box-sizing: border-box;cursor:pointer;">×</button>
                    </div>
                `);
            };
            reader.readAsDataURL(file);
        });
    });
    


    $("#uploadImagesBtn").click(function () {
        console.log("Uploading images...", $("#propertyMedia")[0].files.length);
        const files = $("#propertyMedia")[0].files;
        if (files.length === 0) {
            Swal.fire({
                title: '',
                text: 'No Images to upload!',
                icon: 'warning'
            });
            return;
        }

        let propertyId = $('input[name="propertyId"]').val();
    
        let formData = new FormData();
        formData.append("propertyId", propertyId);
    
        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]); // MULTIPLE FILES
        }
    
        $.ajax({
            url: API_URL + "/api/property-images/upload-multiple",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
                console.log(res);
                Swal.fire({
                    title: '',
                    text: 'Images uploaded successfully!',
                    icon: 'success'
                }).then(() => {
                    window.location.href = "/property/" + propertyId;
                });
                
            },
            error: function (xhr) {
                alert("Upload failed: " + xhr.responseText);
            }
        });
    });


    function renderPropertyType(list) {
        let html = "";
        list.forEach(item => {
            html += `
                <li>
                    <label class="checkbox-item">${item.name}
                        <input type="checkbox" class="filter-type" value="${item.name}">
                        <span class="checkmark"></span>
                    </label>
                    <span class="categorey-no">${item.count}</span>
                </li>
            `;
        });
        $("#property-type-widget").html(html);
    }
    
    function renderStatus(list) {
        let html = "";
        list.forEach(item => {
            html += `
                <li>
                    <label class="checkbox-item">${item.name.replace("_", " ")}
                        <input type="checkbox" class="filter-status" value="${item.name}">
                        <span class="checkmark"></span>
                    </label>
                    <span class="categorey-no">${item.count}</span>
                </li>
            `;
        });
        $("#property-status-widget").html(html);
    }
    
    function renderAmenities(list) {
        let html = "";
        list.forEach(name => {
            html += `
                <li>
                    <label class="checkbox-item">${name}
                        <input type="checkbox" class="filter-amenity" value="${name}">
                        <span class="checkmark"></span>
                    </label>
                </li>
            `;
        });
        $("#amenities-widget").html(html);
    }

    function getPropertyPayload() {

        // Build JSON payload
        const payload = {
            title: $("#input_title").val(),
            description: $("#input_description").val(),
            propertyType: $("#input_property_type").val(),
            propertyStatus: $("#input_property_status").val(),
            price: parseFloat($("#input_price").val()) || 0,
            currency: $("#input_currency").val(), // You may add currency field later in UI
            address: $("#input_address").val(),
            city: $("#input_city").val(),
            postalCode: $("#input_postal_code").val(),
            country: $("#input_country").val(),
            latitude: 1.3515,   // if needed, later use Google Maps API
            longitude: 103.8667,
            availableDate: $("#available_date").val(),
            leaseTerm: $("#input_rental_frequency").val(),
            minLeaseMonths: parseInt($("#input_min_lease").val()) || 0,
            
            // Backend no longer needs advertiserId from frontend — extracted from JWT.
            // Only include if API requires it:
            // advertiserId: 1,

            propertyDetail: {
                bedrooms: parseInt($("#input_bedroom").val()) || 0,
                bathrooms: parseInt($("#input_bathroom").val()) || 0,
                kitchens: parseInt($("#input_kitchen").val()) || 0,
                squareFeet: parseInt($("#input_size").val()) || 0,
                yearBuilt: parseInt($("#input_built").val()) || 0,
                
                furnishType: $("#input_furnished_type").val(),

                hasParking: $("#chk_parking").is(":checked"),
                hasSwimmingPool: $("#chk_pool").is(":checked"),
                hasElevator: $("#chk_elevator").is(":checked"),
                hasGarden: $("#chk_garden").is(":checked"),
                hasSecurity: $("#chk_security").is(":checked"),
                hasGym: $("#chk_gym").is(":checked"),

                additionalFeatures: {
                    wifi: $("#chk_wifi").is(":checked"),
                    disabledAccess: $("#chk_disabled").is(":checked"),
                    airConditioning: $("#chk_aircon").is(":checked"),
                    laundry: $("#chk_laundry").is(":checked"),
                    heater: $("#chk_heater").is(":checked")
                }
            }
        };

        return payload;

    }

    function renderAmenities(list) {
        let html = "";
        list.forEach(name => {
            html += `
                <li>
                    <label class="checkbox-item">${name}
                        <input type="checkbox" class="filter-amenity" value="${name}">
                        <span class="checkmark"></span>
                    </label>
                </li>
            `;
        });
        $("#amenities-widget").html(html);
    }

    function renderCityOptions(list) {
        let html = "<option value=''>Choose City</option>";
        list.forEach(val => {
            html += `<option value=${val.toLowerCase()}> ${val.replace('_', ' ')}</option>`; 
        });
        $("#input_city").html(html);
    }
    
    function renderPropertyOptions(list) {
        let html = "<option value=''>Property Type </option>";
        list.forEach(val => {
            html += `<option value=${val}> ${val}</option>`; 
        });
        $("#input_property_type").html(html);
    }

    