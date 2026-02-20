//* main.js */
/* I used GitHub Copilot, VS Code IntelliSense, and ChatGPT for help with each step, debugging, and clearer comments. */
/* GPT created Task map for easy reading. */
/* Updated 17/2/26 - Task 5: Added sw.js following 11-047 textbook example. Referred to ChatGTP on how to register service worker which I wasn't able to see in the example */

// Run this only when the page has fully loaded.
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded and main.js is running");

  // ==================================================
  // Task map (HTML vs JavaScript)
  // ==================================================
  // Task 1: Basic HTML structure (in index.html)
  // Task 2: Product catalog (data, display, add to cart)
  // Task 3: Persistent cart with localStorage (display, save, clear)
  // Task 4: Font preference with sessionStorage
  // Task 5: Browser cache notice message
  // Task 6: Cookie consent, username cookie, and greeting
  // Task 7: Reset saved preferences and cookie data
  // Task 8: Dynamic total updates and initial display

  // ==================================================
  // Setup: get the HTML elements we need
  // ==================================================
  // Get elements by ID so we can update them with JavaScript.
  const cookieConsentBanner = document.getElementById("cookie-consent-banner");
  const acceptCookiesBtn = document.getElementById("accept-cookies");
  const declineCookiesBtn = document.getElementById("decline-cookies");

  const productCatalog = document.getElementById("productCatalog");
  const cartItems = document.getElementById("cartItems");
  const totalPrice = document.getElementById("totalPrice");
  const clearCartBtn = document.getElementById("clearCartBtn");
  const resetPreferencesBtn = document.getElementById("resetPreferencesBtn");
  const fontSelect = document.getElementById("fontSelect");
  const cacheStatus = document.getElementById("cacheStatus");
  const greetingMessage = document.getElementById("greetingMessage");
  const deleteUsernameCookieBtn = document.getElementById(
    "deleteUsernameCookieBtn",
  );

  // ==================================================
  // Task 2: Product data + display
  // ==================================================
  // Product list (5 items with id, name, price, and image). Leaving
  const products = [
  {
    id: 1,
    name: "Mechanical Keyboard (Developer Edition)",
    price: 129.99,
    image: "./images/keyboard.jpg",
  },
  {
    id: 2,
    name: "Noise-Cancelling Headphones",
    price: 249.99,
    image: "./images/headphones.jpg",
  },
  {
    id: 3,
    name: "4K UltraWide Monitor",
    price: 599.99,
    image: "./images/monitor.jpg",
  },
  {
    id: 4,
    name: "Standing Desk (Remote Work Pro)",
    price: 399.99,
    image: "./images/desk.jpg",
  },
  {
    id: 5,
    name: "Cloud Architecture Handbook",
    price: 39.99,
    image: "./images/book.jpg",
  },
];

  // ==================================================
  // Task 3: Save cart + show cart
  // ==================================================
  // Load cart from localStorage. If none is saved, start with an empty cart.
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Save cart to localStorage.
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // Task 2: Product catalog display
  function displayProducts() {
    productCatalog.innerHTML = "";

    // Create a card for each product and show it in the catalog.
    products.forEach(function (product) {
      const productCard = `
                <div class="col-md-6 mb-4 d-flex">
                    <div class="card w-100 d-flex flex-column">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text mt-auto">£${product.price.toFixed(2)}</p>
                            <button class="btn btn-primary w-100 mt-2" data-id="${product.id}">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `;
      productCatalog.innerHTML += productCard;
    });

    // Add click events to all Add to Cart buttons.
    const addToCartButtons = productCatalog.querySelectorAll("button");
    addToCartButtons.forEach(function (button) {
      button.addEventListener("click", function (event) {
        const productId = parseInt(event.target.getAttribute("data-id"));
        addToCart(productId);
      });
    });
  }

  // Task 2 and 3: Add item to cart, save, then refresh cart view.
  function addToCart(productId) {
    const product = products.find(function (productItem) {
      return productItem.id === productId;
    });

    // If item is already in cart, increase quantity. Else add new item.
    if (product) {
      const existingItem = cart.find(function (item) {
        return item.id === productId;
      });

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      saveCart();
      displayCart();
    }
  }

  // Task 3: Remove item from cart, save, then refresh.
  function removeFromCart(productId) {
    cart = cart.filter(function (item) {
      return item.id !== productId;
    });
    saveCart();
    displayCart();
  }

  // Task 3: Show current cart items.
  function displayCart() {
    cartItems.innerHTML = "";

    if (cart.length === 0) {
      cartItems.innerHTML =
        '<li class="list-group-item">Your cart is empty</li>';
      totalPrice.textContent = "£0.00";
      return;
    }

    cart.forEach(function (item) {
      const cartItem = `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${item.name}</strong>
                        <br>
                        <small>£${item.price.toFixed(2)} x ${item.quantity}</small>
                    </div>
                    <div>
                        <span class="me-3">£${(item.price * item.quantity).toFixed(2)}</span>
                        <button class="btn btn-sm btn-outline-danger" data-id="${item.id}">
                            Remove
                        </button>
                    </div>
                </li>
            `;
      cartItems.innerHTML += cartItem;
    });

    const removeButtons = cartItems.querySelectorAll("button");
    removeButtons.forEach(function (button) {
      button.addEventListener("click", function (event) {
        const id = parseInt(event.target.getAttribute("data-id"));
        removeFromCart(id);
      });
    });

    updateTotal();
  }

  // ==================================================
  // Task 8: Update total
  // ==================================================
  // Recalculate and show the total.
  function updateTotal() {
    const total = cart.reduce(function (sum, item) {
      return sum + item.price * item.quantity;
    }, 0);
    totalPrice.textContent = `£${total.toFixed(2)}`;
  }

  // ==================================================
  // Task 4: Font preference in sessionStorage
  // ==================================================
  // Load saved font preference for this tab session.
  const savedFont = sessionStorage.getItem("fontPreference");
  if (savedFont) {
    document.body.style.fontFamily = savedFont;
    fontSelect.value = savedFont;
  }

  fontSelect.addEventListener("change", function () {
    const selectedFont = fontSelect.value;
    document.body.style.fontFamily = selectedFont;

    if (selectedFont === "") {
      sessionStorage.removeItem("fontPreference");
    } else {
      sessionStorage.setItem("fontPreference", selectedFont);
    }
  });

  // ==================================================
  // Task 5: Browser cache notice
  // ==================================================
  // Declare the updateCacheStatus function in order to show cache message to end user
  function updateCacheStatus(message) {
    cacheStatus.classList.remove("d-none"); // unhide the cache message box so users can see message
    cacheStatus.textContent = message; // update the message box with correct message
  }

  // Try to register the service worker file (sw.js) - caching is active or not available
  async function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) {
      updateCacheStatus("Caching is not available right now.");
      return;
    }

    try {
      await navigator.serviceWorker.register("sw.js");
      updateCacheStatus("Caching is active. Repeat visits should load faster.");
    } catch (error) {
      updateCacheStatus("Caching is not available right now.");
    }
  }
  console.log("About to register SW...");
  registerServiceWorker();

  // ==================================================
  // Task 6: Cookie consent + username cookie + greeting
  // ==================================================
  // Cookie helper functions.
  function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
  }

  // Get one cookie value by name.
  function getCookie(name) {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [key, value] = cookie.trim().split("=");
      if (key === name) {
        return decodeURIComponent(value);
      }
    }
    return null;
  }

  // Delete a cookie by setting an old expiry date.
  function deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }

  function showGreetingFromCookie() {
    const savedUsername = getCookie("username");

    if (savedUsername) {
      greetingMessage.textContent = `Welcome back, ${savedUsername}!`;
      deleteUsernameCookieBtn.classList.remove("d-none");
      return true;
    }

    return false;
  }

  // Ask for a username, save it in a cookie, then show greeting.
  function captureUsername() {
    const hasSavedUsername = showGreetingFromCookie();
    if (hasSavedUsername) return;

    const userName = prompt("Please enter your name:");
    if (userName !== null && userName !== "") {
      alert(`Hello, ${userName}!`);
      setCookie("username", userName, 7);
      greetingMessage.textContent = `Welcome back, ${userName}!`;
      deleteUsernameCookieBtn.classList.remove("d-none");
    } else {
      alert("You did not provide a valid name.");
    }
  }

  // On load, check consent and saved username.
  const consentGiven = localStorage.getItem("cookieConsent");
  const hasSavedUsername = showGreetingFromCookie();

  // If consent is accepted and no username is saved, ask for one.
  if (!hasSavedUsername && consentGiven === "true") {
    captureUsername();
  }

  // If no consent choice is saved yet, show the banner.
  if (!consentGiven) {
    cookieConsentBanner.style.display = "block";
  }

  // Accept: save consent and ask for username.
  acceptCookiesBtn.addEventListener("click", function () {
    localStorage.setItem("cookieConsent", "true");
    cookieConsentBanner.style.display = "none";
    captureUsername();
  });

  // Decline: save decision and hide banner.
  declineCookiesBtn.addEventListener("click", function () {
    localStorage.setItem("cookieConsent", "false");
    cookieConsentBanner.style.display = "none";
  });

  // Delete saved username cookie and update the message.
  deleteUsernameCookieBtn.addEventListener("click", function () {
    deleteCookie("username");
    greetingMessage.textContent = "Saved name cookie deleted.";
    deleteUsernameCookieBtn.classList.add("d-none");
  });

  // ==================================================
  // Task 7: Reset saved settings and cookie data
  // ==================================================
  // Clear cart only.
  function clearCart() {
    cart = [];
    saveCart();
    displayCart();
  }

  clearCartBtn.addEventListener("click", clearCart);

  // Task 7: Reset all saved data and show the consent banner again.
  resetPreferencesBtn.addEventListener("click", function () {
    clearCart();
    deleteCookie("username");
    localStorage.removeItem("cookieConsent");
    sessionStorage.removeItem("fontPreference");

    document.body.style.fontFamily = "";
    fontSelect.value = "";

    greetingMessage.textContent = "Preferences reset and cart cleared.";
    deleteUsernameCookieBtn.classList.add("d-none");
    cookieConsentBanner.style.display = "block";
  });

  // ==================================================
  // Task 8: First page display
  // ==================================================
  // First display when the page loads.
  displayProducts();
  displayCart();
});
