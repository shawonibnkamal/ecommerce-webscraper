// Button Handlers =================================

// Update the products by scrapping all of them newly

function updateProducts() {
  animateSyncIcon();
  $.ajax({
    type: "post",
    url: "/products/update",
    data: {},
    dataType: "json",
    success: function (response) {
      console.log(response);
      $("#add-book .success").text(response);
      $("#add-book .error").text("");
      setTimeout(function () {
        location.reload();
      }, 5000);
    },
    error: function (error) {
      console.log("An error has occured");
      console.error(error.responseText);
      $("#add-book .error").text(error.responseText);
      $("#add-book .success").text("");
    },
  });
}

// Animate Sync Icon
var deg = 2; // starting
var rotation_diff = 30; // you can change it to 2 if you want to rotate 2 deg in each second
function animateSyncIcon() {
  var img = document.getElementById("sync-icon");

  img.style.webkitTransform = "rotate(" + deg + "deg)";
  img.style.transform = "rotate(" + deg + "deg)";
  img.style.MozTransform = "rotate(" + deg + "deg)";
  img.style.msTransform = "rotate(" + deg + "deg)";
  img.style.OTransform = "rotate(" + deg + "deg)";

  setTimeout("animateSyncIcon()", 100);
  deg = deg + rotation_diff;
}

// Delete a product
function deleteProductHandler(e, id) {
  e.preventDefault();
  console.log(id);
}

// Get Requests =============================
function getAllProducts() {
  getProducts("/products/all");
}

function getInStock() {
  getProducts("/products/instock");
}

function getOutOfStock() {
  getProducts("/products/outofstock");
}

function getPriceChanged() {
  getProducts("/products/pricechanged", (showPriceChange = true));
}

function getBackInStock() {
  getProducts("/products/backinstock");
}

// get products functions
function getProducts(url, showPriceChange = false) {
  $.ajax({
    type: "get",
    url: url,
    dataType: "json",
    success: function (response) {
      console.log(response);
      let products = response.products;
      let html = "";
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
      $("#list-products .content").html(html);
      $("#list-products .success").html(response.msg);
      $("#list-products .error").html("");
    },
    error: function (error) {
      console.log("An error has occured");
      console.error(error.responseText);
      $("#list-products .error").html(error.responseText);
      $("#list-products .success").html("");
    },
  });
}
