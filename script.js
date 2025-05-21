// LOGIN SYSTEM
window.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("loginModal");
  const loginBtn = document.getElementById("loginSubmit");
  const usernameInput = document.getElementById("loginUsername");
  const passwordInput = document.getElementById("loginPassword");
  const errorMsg = document.getElementById("loginError");

  // Already logged in before? Skip login
  const userRole = localStorage.getItem("userRole");
  if (userRole) {
    modal.style.display = "none";
    return;
  }

  loginBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Predefined delivery logins
const deliveryAccounts = [
  { username: "admin", password: "admin123" },
  { username: "ravi", password: "ravi321" },
  { username: "salma", password: "salma@45" },
];

const isDelivery = deliveryAccounts.some(acc => acc.username === username && acc.password === password);

if (isDelivery) {
  localStorage.setItem("userRole", "delivery");
  window.location.href = "delivery.html";
} else if (username !== "" && password !== "") {
  localStorage.setItem("userRole", "customer");
  alert("Logged in as Customer");
  modal.style.display = "none";
} else {
  errorMsg.style.display = "block";
}


  });
});


//
// Logout logic
document.getElementById("logoutLink").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "index.html";
});



// Hamburger toggle for mobile nav
const hamburger = document.querySelector(".hamburger");
const navLinksContainer = document.querySelector(".nav-links");

if (hamburger && navLinksContainer) {
  hamburger.addEventListener("click", () => {
    navLinksContainer.classList.toggle("active");
  });
}

// Search functionality
const search = document.getElementById("search");
const searchWrapper = document.getElementById("search-wrapper");
const searchButton = document.getElementById("search-button");
const allProducts = document.querySelectorAll(".product");
const noResult = document.getElementById("no-result");

if (search) {
  search.addEventListener("focus", () => {
    searchWrapper.style.border = "1px solid #1dbf73";
  });

  search.addEventListener("blur", () => {
    searchWrapper.style.border = "1px solid rgba(0, 0, 0, 0.276)";
  });

  function doSearch() {
    const query = search.value.toLowerCase().trim();
    let found = false;

    allProducts.forEach((product) => {
      const text = product.textContent.toLowerCase();
      if (text.includes(query)) {
        product.style.display = "";
        found = true;
      } else {
        product.style.display = "none";
      }
    });

    noResult.style.display = found ? "none" : "block";
  }

  searchButton.addEventListener("click", doSearch);
  search.addEventListener("input", doSearch);
}

// Call Now Button (for logging)
const callNowBtn = document.getElementById("callNowBtn");
if (callNowBtn) {
  callNowBtn.addEventListener("click", () => {
    console.log("Calling now...");
  });
}

// Toggle Description
document.querySelectorAll(".toggle-arrow").forEach((arrow) => {
  arrow.addEventListener("click", () => {
    const description = arrow.closest(".menu-item").querySelector(".description");
    const isVisible = description.style.display === "block";
    description.style.display = isVisible ? "none" : "block";
    arrow.classList.toggle("rotate");
  });
});

// Add to cart on index.html (menu)
document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    button.style.display = "none";

    const controls = document.createElement("div");
    controls.className = "qty-controls";
    controls.innerHTML = `
      <button class="qty-decrease">-</button>
      <span class="qty">1</span>
      <button class="qty-increase">+</button>
    `;

    button.parentElement.appendChild(controls);

    const item = {
      name: button.parentElement.querySelector("h3").textContent,
      price: 49,
      qty: 1,
      image: button.parentElement.querySelector("img").src,
    };

    addToCart(item);

    // Enable +/- control logic
    controls.querySelector(".qty-increase").addEventListener("click", () => {
      const qtySpan = controls.querySelector(".qty");
      let qty = parseInt(qtySpan.textContent);
      qty++;
      qtySpan.textContent = qty;

      item.qty = qty;
      addToCart(item, true); // overwrite quantity
    });

    controls.querySelector(".qty-decrease").addEventListener("click", () => {
      const qtySpan = controls.querySelector(".qty");
      let qty = parseInt(qtySpan.textContent);
      if (qty > 1) {
        qty--;
        qtySpan.textContent = qty;

        item.qty = qty;
        addToCart(item, true); // overwrite quantity
      }
    });
  });
});

// Modified to accept overwrite (used in menu qty changes)
function addToCart(item, overwrite = false) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find((i) => i.name === item.name);

  if (existing) {
    if (overwrite) {
      existing.qty = item.qty;
    } else {
      existing.qty += 1;
    }
  } else {
    cart.push(item);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

// Cart Page Rendering
function renderCartItems() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.querySelector(".cart-items");
  const emptyCart = document.getElementById("emptyCart");
  const checkoutBtn = document.querySelector(".checkout-btn");

  if (!container || !emptyCart || !checkoutBtn) return;

  container.innerHTML = "";

  if (cart.length === 0) {
    emptyCart.style.display = "block";
    checkoutBtn.disabled = true;
    updateTotal();
    return;
  }

  emptyCart.style.display = "none";
  checkoutBtn.disabled = false;

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div class="item-info">
        <h3>${item.name}</h3>
        <p>₹${item.price}</p>
        <div class="qty-controls">
          <button class="qty-decrease">-</button>
          <span class="qty">${item.qty}</span>
          <button class="qty-increase">+</button>
        </div>
      </div>
      <button class="remove">🗑️</button>
    `;

    // Quantity controls
    div.querySelector(".qty-increase").addEventListener("click", () => {
      item.qty++;
      saveAndReload(cart);
    });

    div.querySelector(".qty-decrease").addEventListener("click", () => {
      if (item.qty > 1) {
        item.qty--;
      } else {
        cart.splice(index, 1);
      }
      saveAndReload(cart);
    });

    div.querySelector(".remove").addEventListener("click", () => {
      cart.splice(index, 1);
      saveAndReload(cart);
    });

    container.appendChild(div);
  });

  updateTotal();
}

function saveAndReload(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCartItems();
}

function updateTotal() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  const subEl = document.getElementById("subtotal");
  const taxEl = document.getElementById("tax");
  const totalEl = document.getElementById("total");

  if (subEl) subEl.textContent = subtotal;
  if (taxEl) taxEl.textContent = tax;
  if (totalEl) totalEl.textContent = total;
}

// Auto-init for cart page
if (document.querySelector(".cart-items")) {
  renderCartItems();
}

// Show order update from delivery (in cart.html)
const updateBox = document.getElementById("orderUpdateBox");
const updateText = document.getElementById("orderUpdateText");

if (updateBox && updateText) {
  const updateRaw = localStorage.getItem("orderUpdate");
  if (updateRaw) {
    const update = JSON.parse(updateRaw);
    updateBox.style.display = "block";
    updateText.innerHTML = `
      ${update.message}<br>
      <small style="color: gray; font-weight: normal;">🕒 Sent at: ${update.time}</small>
    `;
  }
}

// 
const addressNav = document.getElementById("addressNav");
const addressListModal = document.getElementById("addressListModal");
const addressListContent = document.getElementById("addressListContent");

if (addressNav) {
  addressNav.addEventListener("click", (e) => {
    e.preventDefault(); // prevent # from showing in URL

    const addressList = JSON.parse(localStorage.getItem("customerInfoList")) || [];
    addressListContent.innerHTML = "";

    if (addressList.length === 0) {
      addressListContent.innerHTML = "<p>No addresses found.</p>";
    } else {
      addressList.forEach((info, index) => {
        const isDefault = info.default ? "checked" : "";
        addressListContent.innerHTML += `
          <div class="address-card">
            <input type="radio" name="defaultAddress" value="${index}" ${isDefault} onchange="setDefaultAddress(${index})" />
            <strong>${info.name}</strong><br>
            📞 ${info.phone} | ☎️ ${info.altPhone}<br>
            ${info.area}, ${info.city}, ${info.state}, ${info.pincode}<br>
            ${info.landmark ? "📍 " + info.landmark + "<br>" : ""}
            <small>${info.locType === 'live' ? '📡 Live Location' : '📝 Manual'}</small><br>
            <button onclick="editAddress(${index})">✏️ Edit</button>
            <button onclick="deleteAddress(${index})">🗑️ Delete</button>
          </div>
        `;
      });
    }

    addressListModal.style.display = "flex";
  });
}

// Live Map Embed
const mapFrame = document.getElementById("liveMap");
if (infoList.length > 0) {
  const first = infoList[0];
  if (first.locType === "live" && first.location.includes(",")) {
    const coords = first.location.split(",");
    const lat = coords[0].trim();
    const lon = coords[1].trim();
    mapFrame.src = `https://www.openstreetmap.org/export/embed.html?bbox=${lon}%2C${lat}%2C${lon}%2C${lat}&layer=mapnik&marker=${lat}%2C${lon}`;
  } else {
    document.getElementById("mapBox").innerHTML = "<p style='color:white;'>📍 No live location available.</p>";
  }
}

// Floating call button
const callBtn = document.getElementById("callCustomerBtn");
if (infoList.length > 0) {
  const customerPhone = infoList[0].phone;
  callBtn.href = `tel:${customerPhone}`;
}


function setDefaultAddress(index) {
  const list = JSON.parse(localStorage.getItem("customerInfoList") || "[]");
  list.forEach((item, i) => item.default = (i === index));
  localStorage.setItem("customerInfoList", JSON.stringify(list));
  showToast("Default address updated");
}

function deleteAddress(index) {
  const list = JSON.parse(localStorage.getItem("customerInfoList") || "[]");
  list.splice(index, 1);
  localStorage.setItem("customerInfoList", JSON.stringify(list));
  showToast("Address deleted");
  addressNav.click(); // Re-render
}


function editAddress(index) {
  const list = JSON.parse(localStorage.getItem("customerInfoList") || "[]");
  const addr = list[index];

  document.getElementById("custName").value = addr.name;
  document.getElementById("custPhone").value = addr.phone;
  document.getElementById("custAltPhone").value = addr.altPhone;
  document.getElementById("custPincode").value = addr.pincode;
  document.getElementById("custState").value = addr.state;
  document.getElementById("custCity").value = addr.city;
  document.getElementById("custArea").value = addr.area;
  document.getElementById("custLandmark").value = addr.landmark;
  document.getElementById("locationType").value = addr.locType;
  document.getElementById("custLocation").value = addr.location;

  document.getElementById("addressModal").style.display = "flex";

  saveAddressBtn.onclick = () => {
    list[index] = {
      name: document.getElementById("custName").value.trim(),
      phone: document.getElementById("custPhone").value.trim(),
      altPhone: document.getElementById("custAltPhone").value.trim(),
      pincode: document.getElementById("custPincode").value.trim(),
      state: document.getElementById("custState").value.trim(),
      city: document.getElementById("custCity").value.trim(),
      area: document.getElementById("custArea").value.trim(),
      landmark: document.getElementById("custLandmark").value.trim(),
      locType: document.getElementById("locationType").value,
      location: document.getElementById("custLocation").value.trim(),
      default: addr.default
    };
    localStorage.setItem("customerInfoList", JSON.stringify(list));
    document.getElementById("addressModal").style.display = "none";
    showToast("Address updated");
  };
}


// proceed to chec address popup
const checkoutBtn = document.getElementById("checkout-btn");
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    const addresses = JSON.parse(localStorage.getItem("customerInfoList") || "[]");
    if (addresses.length === 0) {
      alert("Please add an address before placing your order.");
    } else {
      // Proceed with order logic here
      alert("Proceeding to checkout...");
    }
  });
}

function addNewAddress() {
  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const altPhone = document.getElementById("custAltPhone").value.trim();
  const pincode = document.getElementById("custPincode").value.trim();
  const state = document.getElementById("custState").value.trim();
  const city = document.getElementById("custCity").value.trim();
  const area = document.getElementById("custArea").value.trim();
  const landmark = document.getElementById("custLandmark").value.trim();
  const locType = document.getElementById("locationType").value;
  const location = document.getElementById("custLocation").value.trim();
  const error = document.getElementById("addressError");

  if (name && phone && pincode && state && city && area && location) {
    const info = {
      name, phone, altPhone, pincode, state, city, area, landmark, locType, location, default: false
    };

    let allAddresses = JSON.parse(localStorage.getItem("customerInfoList")) || [];
    allAddresses.push(info);
    localStorage.setItem("customerInfoList", JSON.stringify(allAddresses));

    addressModal.style.display = "none";
    showToast("Address added");
  } else {
    error.style.display = "block";
  }
}
 
if (addNewAddressBtn) {
  addNewAddressBtn.addEventListener("click", () => {
    addressListModal.style.display = "none";
    addressModal.style.display = "flex";

    // 🧼 Clear existing form values
    document.getElementById("custName").value = "";
    document.getElementById("custPhone").value = "";
    document.getElementById("custAltPhone").value = "";
    document.getElementById("custPincode").value = "";
    document.getElementById("custState").value = "";
    document.getElementById("custCity").value = "";
    document.getElementById("custArea").value = "";
    document.getElementById("custLandmark").value = "";
    document.getElementById("custLocation").value = "";
    document.getElementById("locationType").value = "manual";

    // 🧠 Bind fresh click for new address
    saveAddressBtn.onclick = addNewAddress;
  });
}


// location
const detectLocationBtn = document.getElementById("detectLocationBtn");

if (detectLocationBtn) {
  detectLocationBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(success => {
      const { latitude, longitude } = success.coords;

      fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
        .then(response => response.json())
        .then(data => {
          document.getElementById("custLocation").value = data.display_name || `${latitude}, ${longitude}`;
          // Optionally fill fields if available
          if (data.address) {
            document.getElementById("custPincode").value = data.address.postcode || "";
            document.getElementById("custState").value = data.address.state || "";
            document.getElementById("custCity").value = data.address.city || data.address.town || "";
            document.getElementById("custArea").value = data.address.suburb || "";
          }
        });
    }, error => {
      alert("Unable to fetch location");
    });
  });
}

// 
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.display = "block";
  toast.style.opacity = "1";
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => (toast.style.display = "none"), 300);
  }, 2000);
}
// 


