// Products functions ===============================================
// ==================================================================

// Button Handlers =================================

// Update the products by scrapping all of them newly

function updateProducts() {
  // animate the sync icon
  animateSyncIcon();

  // Post request to sync the products
  $.ajax({
    type: "post",
    url: "/products/update",
    data: {},
    dataType: "json",
    success: function (response) {
      console.log(response);

      // Add message to DOM
      $("#add-book .success").text(response);
      $("#add-book .error").text("");

      // Reload page after 3s
      setTimeout(function () {
        location.reload();
      }, 3000);
    },
    error: function (error) {
      // print error to console
      console.log("An error has occured");
      console.error(error.responseText);

      // Add messages to DOM
      $("#add-book .error").text(error.responseText);
      $("#add-book .success").text("");
    },
  });
}

// Delete a product
function deleteProductHandler(e, id) {
  e.preventDefault();
  console.log(id);
}

// Get Requests =============================

// Get all product filter
function getAllProducts() {
  getProducts("/products/all");
}

// Get the products in stock filter
function getInStock() {
  getProducts("/products/instock");
}

// Get the products out of stock filter
function getOutOfStock() {
  getProducts("/products/outofstock");
}

// Get all products with price changed filter
function getPriceChanged() {
  getProducts("/products/pricechanged", (showPriceChange = true));
}

// Get all product back in stock filter
function getBackInStock() {
  getProducts("/products/backinstock");
}

// get products functions
function getProducts(url, showPriceChange = false) {
  // get request
  $.ajax({
    type: "get",
    url: url,
    dataType: "json",
    success: function (response) {
      console.log(response);
      let products = response.products;
      let html = "";

      // Update DOM
      for (let i = 0; i < products.length; i++) {
        html += `
              <tr>
                  <td>${products[i].sku}</td>
                  <td>${products[i].title}</td>`;
        if (showPriceChange) {
          html += `<td>${products[i].newprice}<br><del>${products[i].oldprice}</del></td>`;
        } else {
          html += `<td>${products[i].newprice}</td>`;
        }

        html += `<td>${products[i].newstock}</td>
                <td><a href="${products[i].url}">Visit URL</a></td>
                <td><a href="#" onclick="deleteProductHandler(event, '${products[i]._id}')" class="btn btn-danger btn-sm">Delete</a></td>
            </tr>
            `;
      }

      // Place the html to DOM
      $("#list-products .content").html(html);

      // Final message
      $(".success").html("Products successfully retrived.");
      $(".error").html("");
    },
    error: function (error) {
      // Print error message to console
      console.log("An error has occured");
      console.error(error.responseText);

      // Show error message in DOM
      $(".error").html("An error has occured");
      $(".success").html("");
    },
  });
}

// Get request for the web scrapping function. It fetches the data from the
// website and fills up the form to save the product
function fetchData(e) {
  e.preventDefault();

  // animation
  animateSyncIcon();

  // get url from input field
  let url = $("#fetch-url").val();

  // get request
  $.ajax({
    type: "get",
    url: "/products/fetch?search=" + url,
    dataType: "json",
    success: function (response) {
      // Stop animating the icon
      stopSyncIcon();
      console.log(response);

      // Fill up the form from response data
      $("#save-product input[name=price]").val(response.productData.price);
      $("#save-product input[name=url]").val(response.productData.productUrl);
      $("#save-product input[name=sku]").val(response.productData.sku);
      $("#save-product input[name=stock]").val(response.productData.stock);
      $("#save-product input[name=title]").val(response.productData.title);

      // Show message in dom
      $("#fetch-data  .success").html("Product data fetched succesfully");
      $("#fetch-data  .error").html("");
    },
    error: function (error) {
      // Print errors
      console.log("An error has occured");
      console.error(error.responseText);

      // Show errors in dom
      $("#fetch-data .error").html("An error has occured");
      $("#fetch-data  .success").html("");
    },
  });
}

// Get request to get the counts for the dashboard homepage
function getCountDashboard() {
  // get request
  $.ajax({
    type: "get",
    url: "/products/all",
    dataType: "json",
    success: function (response) {
      console.log(response);
      let counts = response.counts;

      // Place the html to DOM
      $("#total-count").html(counts.total);
      $("#instock-count").html(counts.instock);
      $("#outofstock-count").html(counts.outofstock);
      $("#pricechanged-count").html(counts.pricechanged);
      $("#backinstock-count").html(counts.backinstock);
      $("#updated-count").html(counts.updated);
      $("#notupdated-count").html(counts.notupdated);

      // Final message
      $(".success").html("Product information successfully retrived.");
      $(".error").html("");
    },
    error: function (error) {
      // Print error message to console
      console.log("An error has occured");
      console.error(error.responseText);

      // Show error message in DOM
      $(".error").html("An error has occured");
      $(".success").html("");
    },
  });
}

// POST Requests ============================================
function postAddProduct(e) {
  e.preventDefault();

  // Serialize form data
  let data = $("#save-product-container form").serialize();

  // print data for debugging purpose
  console.log(data);

  $.ajax({
    type: "post",
    url: "/products/new",
    data: data,
    dataType: "json",
    success: function (response) {
      // print response to console
      console.log(response);

      // Show success message
      $("#save-product-container .success").text(response.message);
      $("#save-product-container .error").text("");
    },
    error: function (error) {
      // print error message to console
      console.error("An error has occured");
      console.error(error.responseText);

      // show error message to dom
      $("#save-product-container .error").text("An error has occured");
      $("#save-product-container .success").text("");
    },
  });
}
