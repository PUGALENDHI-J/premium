/**
 * Rib Cotton - Global E-Commerce Store & State Management
 * Handles Cart, Wishlist, Coupons, WhatsApp & Call Integrations, Quick View, and Mini-Cart
 */

(function (window) {
  "use strict";

  const PHONE_NUMBER = "919840012345"; // Rib Cotton Official WhatsApp & Call Helpline
  const CART_KEY = "ribcotton_cart_v1";
  const WISH_KEY = "ribcotton_wishlist_v1";
  const COUPON_KEY = "ribcotton_coupon_v1";

  // Coupon rules
  const COUPONS = {
    RIBFIRST10: { code: "RIBFIRST10", discountPercent: 10, minOrder: 500, desc: "10% off on your first order" },
    FREESHIP: { code: "FREESHIP", freeShipping: true, minOrder: 499, desc: "Free shipping on orders over ₹499" },
    SUMMER15: { code: "SUMMER15", discountPercent: 15, minOrder: 1499, desc: "15% off on orders over ₹1,499" }
  };

  const RibStore = {
    phoneNumber: PHONE_NUMBER,

    // Cart API
    getCart: function () {
      try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
      } catch (e) {
        return [];
      }
    },

    saveCart: function (cart) {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      this.notifyCartChange();
    },

    addToCart: function (productOrId, size, color, quantity = 1) {
      let product = productOrId;
      if (typeof productOrId === "number" || typeof productOrId === "string") {
        product = this.getProductById(productOrId);
      }
      if (!product) return false;

      const chosenSize = size || (product.sizes ? product.sizes[0] : "M");
      const chosenColor = color || (product.colors ? product.colors[0].name : "Standard");
      const cart = this.getCart();

      const existingIndex = cart.findIndex(
        item => item.id === product.id && item.size === chosenSize && item.color === chosenColor
      );

      if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
      } else {
        cart.push({
          id: product.id,
          slug: product.slug,
          name: product.name,
          category: product.category,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          size: chosenSize,
          color: chosenColor,
          quantity: quantity
        });
      }

      this.saveCart(cart);
      this.showToast(`Added ${product.name} (${chosenSize}) to bag!`, "success", {
        label: "View Bag",
        onClick: () => this.openMiniCart()
      });
      this.bumpCartIcon();
      return true;
    },

    updateCartQuantity: function (index, newQty) {
      const cart = this.getCart();
      if (index >= 0 && index < cart.length) {
        if (newQty <= 0) {
          cart.splice(index, 1);
        } else {
          cart[index].quantity = newQty;
        }
        this.saveCart(cart);
      }
    },

    removeFromCart: function (index) {
      const cart = this.getCart();
      if (index >= 0 && index < cart.length) {
        const item = cart[index];
        cart.splice(index, 1);
        this.saveCart(cart);
        this.showToast(`Removed ${item.name} from bag`, "info");
      }
    },

    clearCart: function () {
      localStorage.removeItem(CART_KEY);
      this.notifyCartChange();
    },

    getCartCount: function () {
      const cart = this.getCart();
      return cart.reduce((total, item) => total + (item.quantity || 1), 0);
    },

    getCartTotals: function () {
      const cart = this.getCart();
      const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
      const originalSubtotal = cart.reduce((sum, item) => sum + (item.originalPrice || item.price) * (item.quantity || 1), 0);
      const mrpSavings = Math.max(0, originalSubtotal - subtotal);

      // Shipping calculation (free over ₹999)
      const freeShippingThreshold = 999;
      let shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 99;

      // Coupon discount
      const appliedCoupon = this.getAppliedCoupon();
      let couponDiscount = 0;
      if (appliedCoupon && subtotal >= appliedCoupon.minOrder) {
        if (appliedCoupon.discountPercent) {
          couponDiscount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
        }
        if (appliedCoupon.freeShipping) {
          shipping = 0;
        }
      }

      const total = Math.max(0, subtotal - couponDiscount + shipping);
      const freeShipProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
      const amountNeededForFreeShip = Math.max(0, freeShippingThreshold - subtotal);

      return {
        subtotal,
        originalSubtotal,
        mrpSavings,
        shipping,
        couponDiscount,
        total,
        freeShipProgress,
        amountNeededForFreeShip,
        hasFreeShipping: shipping === 0 && subtotal > 0
      };
    },

    // Coupon API
    getAppliedCoupon: function () {
      try {
        const code = localStorage.getItem(COUPON_KEY);
        return COUPONS[code] || null;
      } catch (e) {
        return null;
      }
    },

    applyCoupon: function (code) {
      const cleaned = (code || "").trim().toUpperCase();
      if (!COUPONS[cleaned]) {
        return { success: false, message: "Invalid promo code. Try RIBFIRST10 or FREESHIP" };
      }
      const coupon = COUPONS[cleaned];
      const { subtotal } = this.getCartTotals();
      if (subtotal < coupon.minOrder) {
        return {
          success: false,
          message: `Code ${coupon.code} requires a minimum order of ₹${coupon.minOrder}.`
        };
      }
      localStorage.setItem(COUPON_KEY, coupon.code);
      this.notifyCartChange();
      return { success: true, message: `Coupon ${coupon.code} applied successfully!`, coupon };
    },

    removeCoupon: function () {
      localStorage.removeItem(COUPON_KEY);
      this.notifyCartChange();
      this.showToast("Promo coupon removed", "info");
    },

    // Wishlist API
    getWishlist: function () {
      try {
        return JSON.parse(localStorage.getItem(WISH_KEY)) || [];
      } catch (e) {
        return [];
      }
    },

    toggleWishlist: function (productId) {
      const id = parseInt(productId, 10);
      const list = this.getWishlist();
      const idx = list.indexOf(id);
      let isAdded = false;

      if (idx > -1) {
        list.splice(idx, 1);
        isAdded = false;
      } else {
        list.push(id);
        isAdded = true;
      }

      localStorage.setItem(WISH_KEY, JSON.stringify(list));
      this.notifyWishlistChange();

      const prod = this.getProductById(id);
      const name = prod ? prod.name : "Item";
      this.showToast(isAdded ? `Saved ${name} to Wishlist` : `Removed from Wishlist`, "info");
      return isAdded;
    },

    isInWishlist: function (productId) {
      const list = this.getWishlist();
      return list.includes(parseInt(productId, 10));
    },

    getWishlistCount: function () {
      return this.getWishlist().length;
    },

    // Product Lookup Helper
    getProductById: function (id) {
      if (typeof PRODUCTS === "undefined") return null;
      return PRODUCTS.find(p => p.id === parseInt(id, 10)) || null;
    },

    getProductBySlug: function (slug) {
      if (typeof PRODUCTS === "undefined") return null;
      return PRODUCTS.find(p => p.slug === slug) || null;
    },

    // WhatsApp Direct Integrations
    openWhatsAppChat: function (customText) {
      const defaultText = "Hello Rib Cotton! I'm interested in your premium rib cotton fashion collection. Please assist me.";
      const msg = encodeURIComponent(customText || defaultText);
      const url = `https://wa.me/${this.phoneNumber}?text=${msg}`;
      window.open(url, "_blank");
    },

    openWhatsAppInquiry: function (productId, chosenSize, chosenColor) {
      const p = this.getProductById(productId);
      if (!p) return;
      const sizeStr = chosenSize ? ` | Size: ${chosenSize}` : "";
      const colorStr = chosenColor ? ` | Color: ${chosenColor}` : "";
      const text = `Hi Rib Cotton! 👋 I'm interested in buying:
*${p.name}*
Price: ₹${p.price.toLocaleString("en-IN")} (MRP: ₹${p.originalPrice.toLocaleString("en-IN")})
Category: ${p.category}${sizeStr}${colorStr}
Product Link: ${window.location.origin}/product-detail.html?id=${p.id}

Is this in stock for delivery?`;
      this.openWhatsAppChat(text);
    },

    sendWhatsAppOrder: function (orderData) {
      const { orderId, items, totals, shippingInfo } = orderData;
      let itemsList = items
        .map((it, idx) => `${idx + 1}. *${it.name}* (Size: ${it.size}, Color: ${it.color}) x ${it.quantity} = ₹${(it.price * it.quantity).toLocaleString("en-IN")}`)
        .join("\n");

      const text = `🛍️ *NEW ORDER CONFIRMATION - RIB COTTON*
*Order ID:* ${orderId}

*Customer Details:*
Name: ${shippingInfo.name}
Phone: ${shippingInfo.phone}
Address: ${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.pincode}

*Order Items:*
${itemsList}

*Payment Summary:*
Subtotal: ₹${totals.subtotal.toLocaleString("en-IN")}
Discount: ₹${totals.couponDiscount.toLocaleString("en-IN")}
Shipping: ${totals.shipping === 0 ? "FREE" : "₹" + totals.shipping}
*Total Payable: ₹${totals.total.toLocaleString("en-IN")}*
Payment Method: ${shippingInfo.paymentMethod.toUpperCase()}

Please confirm my order dispatch! Thank you!`;

      this.openWhatsAppChat(text);
    },

    // Call Direct Integration
    triggerCall: function () {
      window.location.href = `tel:+${this.phoneNumber}`;
    },

    // UI Updates
    notifyCartChange: function () {
      this.updateHeaderBadges();
      this.renderMiniCart();
      window.dispatchEvent(new CustomEvent("rib:cart-change", { detail: { count: this.getCartCount(), totals: this.getCartTotals() } }));
    },

    notifyWishlistChange: function () {
      this.updateHeaderBadges();
      window.dispatchEvent(new CustomEvent("rib:wishlist-change", { detail: { count: this.getWishlistCount() } }));
    },

    updateHeaderBadges: function () {
      const cartCount = this.getCartCount();
      const wishCount = this.getWishlistCount();

      document.querySelectorAll(".cart-count-badge").forEach(el => {
        el.textContent = cartCount;
        el.hidden = cartCount === 0;
      });

      document.querySelectorAll(".wish-count-badge").forEach(el => {
        el.textContent = wishCount;
        el.hidden = wishCount === 0;
      });
    },

    bumpCartIcon: function () {
      const icons = document.querySelectorAll(".cart-btn-icon, #cartCount");
      icons.forEach(el => {
        el.classList.add("bump");
        setTimeout(() => el.classList.remove("bump"), 400);
      });
    },

    showToast: function (message, type = "info", action = null) {
      let toast = document.getElementById("ribToast");
      if (!toast) {
        toast = document.createElement("div");
        toast.id = "ribToast";
        toast.className = "rib-toast";
        toast.setAttribute("role", "status");
        toast.setAttribute("aria-live", "polite");
        document.body.appendChild(toast);
      }

      toast.innerHTML = `
        <div class="toast-content">
          <span class="toast-icon">${type === "success" ? "✓" : "ℹ"}</span>
          <span class="toast-text">${message}</span>
          ${action ? `<button type="button" class="toast-action-btn" id="toastAction">${action.label}</button>` : ""}
        </div>
      `;

      if (action && document.getElementById("toastAction")) {
        document.getElementById("toastAction").addEventListener("click", () => {
          action.onClick();
          toast.classList.remove("show");
        });
      }

      toast.classList.add("show");
      clearTimeout(this._toastTimeout);
      this._toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
      }, 3500);
    },

    // Mini Cart Drawer
    initMiniCart: function () {
      if (document.getElementById("miniCartDrawer")) return;

      const drawer = document.createElement("div");
      drawer.id = "miniCartDrawer";
      drawer.className = "mini-cart-drawer";
      drawer.innerHTML = `
        <div class="mini-cart-overlay" id="miniCartOverlay"></div>
        <div class="mini-cart-panel">
          <div class="mini-cart-header">
            <h3>Shopping Bag (<span id="mcHeaderCount">0</span>)</h3>
            <button class="mini-cart-close" id="miniCartClose" aria-label="Close cart">&times;</button>
          </div>
          <div class="free-shipping-banner" id="mcShippingBanner">
            <div class="free-shipping-text" id="mcShippingText">Add ₹999 for FREE Delivery</div>
            <div class="free-shipping-bar"><span id="mcShippingProgress" style="width: 0%"></span></div>
          </div>
          <div class="mini-cart-items" id="mcItemsList">
            <!-- Items rendered via renderMiniCart() -->
          </div>
          <div class="mini-cart-footer" id="mcFooter">
            <div class="mc-summary-row">
              <span>Subtotal:</span>
              <strong id="mcSubtotal">₹0</strong>
            </div>
            <p class="mc-tax-note">Shipping &amp; discounts calculated at checkout</p>
            <div class="mc-btn-group">
              <a href="cart.html" class="btn btn-outline btn-block">View Full Bag</a>
              <a href="checkout.html" class="btn btn-primary btn-block">Proceed to Checkout →</a>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(drawer);

      document.getElementById("miniCartClose").addEventListener("click", () => this.closeMiniCart());
      document.getElementById("miniCartOverlay").addEventListener("click", () => this.closeMiniCart());

      // Wire up cart trigger buttons in header
      document.querySelectorAll("[data-action='open-cart'], .open-cart-trigger").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          this.openMiniCart();
        });
      });
    },

    openMiniCart: function () {
      this.initMiniCart();
      this.renderMiniCart();
      const drawer = document.getElementById("miniCartDrawer");
      if (drawer) drawer.classList.add("open");
      document.body.classList.add("cart-open");
    },

    closeMiniCart: function () {
      const drawer = document.getElementById("miniCartDrawer");
      if (drawer) drawer.classList.remove("open");
      document.body.classList.remove("cart-open");
    },

    renderMiniCart: function () {
      const itemsList = document.getElementById("mcItemsList");
      const headerCount = document.getElementById("mcHeaderCount");
      const subtotalEl = document.getElementById("mcSubtotal");
      const shippingBanner = document.getElementById("mcShippingBanner");
      const shippingText = document.getElementById("mcShippingText");
      const shippingProgress = document.getElementById("mcShippingProgress");
      const footer = document.getElementById("mcFooter");

      if (!itemsList) return;

      const cart = this.getCart();
      const totals = this.getCartTotals();
      const count = this.getCartCount();

      if (headerCount) headerCount.textContent = count;
      if (subtotalEl) subtotalEl.textContent = `₹${totals.subtotal.toLocaleString("en-IN")}`;

      if (totals.hasFreeShipping) {
        shippingText.innerHTML = "🎉 <strong>Congratulations!</strong> You unlocked FREE Shipping!";
        shippingProgress.style.width = "100%";
        shippingProgress.classList.add("complete");
      } else {
        shippingText.innerHTML = `Add <strong>₹${totals.amountNeededForFreeShip}</strong> more for <strong>FREE Delivery</strong>`;
        shippingProgress.style.width = `${totals.freeShipProgress}%`;
        shippingProgress.classList.remove("complete");
      }

      if (cart.length === 0) {
        itemsList.innerHTML = `
          <div class="mc-empty-state">
            <div class="mc-empty-icon">🛍️</div>
            <h4>Your Bag is Empty</h4>
            <p>Looks like you haven't added any premium cotton styles yet.</p>
            <a href="shop.html" class="btn btn-primary btn-sm" onclick="RibStore.closeMiniCart()">Start Shopping</a>
          </div>
        `;
        if (footer) footer.style.display = "none";
        return;
      }

      if (footer) footer.style.display = "block";

      itemsList.innerHTML = cart.map((item, idx) => `
        <div class="mc-item">
          <img src="${item.image}" alt="${item.name}" class="mc-item-thumb" onerror="this.src='asserts/products/sumwon-wave-oversized-tee.jpg'">
          <div class="mc-item-info">
            <h5 class="mc-item-title"><a href="product-detail.html?id=${item.id}">${item.name}</a></h5>
            <div class="mc-item-variants">
              <span>Size: <strong>${item.size}</strong></span>
              <span>•</span>
              <span>Color: <strong>${item.color}</strong></span>
            </div>
            <div class="mc-item-price-row">
              <div class="mc-qty-stepper">
                <button type="button" class="mc-qty-btn" onclick="RibStore.updateCartQuantity(${idx}, ${item.quantity - 1})" aria-label="Decrease quantity">−</button>
                <span class="mc-qty-val">${item.quantity}</span>
                <button type="button" class="mc-qty-btn" onclick="RibStore.updateCartQuantity(${idx}, ${item.quantity + 1})" aria-label="Increase quantity">+</button>
              </div>
              <span class="mc-item-price">₹${(item.price * item.quantity).toLocaleString("en-IN")}</span>
            </div>
          </div>
          <button type="button" class="mc-item-remove" onclick="RibStore.removeFromCart(${idx})" title="Remove item" aria-label="Remove item">&times;</button>
        </div>
      `).join("");
    },

    // Quick View Modal
    initQuickViewModal: function () {
      if (document.getElementById("quickViewModal")) return;

      const modal = document.createElement("div");
      modal.id = "quickViewModal";
      modal.className = "quick-view-modal";
      modal.innerHTML = `
        <div class="qv-overlay" id="qvOverlay"></div>
        <div class="qv-dialog" role="dialog" aria-modal="true">
          <button type="button" class="qv-close" id="qvClose" aria-label="Close modal">&times;</button>
          <div class="qv-content" id="qvContent">
            <!-- Injected via openQuickView() -->
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      document.getElementById("qvClose").addEventListener("click", () => this.closeQuickView());
      document.getElementById("qvOverlay").addEventListener("click", () => this.closeQuickView());
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("open")) {
          this.closeQuickView();
        }
      });
    },

    openQuickView: function (productId) {
      this.initQuickViewModal();
      const p = this.getProductById(productId);
      if (!p) return;

      const qvContent = document.getElementById("qvContent");
      const selectedSize = p.sizes[0];
      const selectedColor = p.colors[0].name;

      qvContent.innerHTML = `
        <div class="qv-grid">
          <div class="qv-gallery">
            <div class="qv-main-img-wrap">
              <img id="qvMainImg" src="${p.image}" alt="${p.name}">
              <span class="qv-tag">${p.tag}</span>
            </div>
            <div class="qv-thumbs">
              ${p.gallery.map((img, i) => `
                <button type="button" class="qv-thumb-btn ${i === 0 ? 'active' : ''}" onclick="document.getElementById('qvMainImg').src='${img}'; document.querySelectorAll('.qv-thumb-btn').forEach(b => b.classList.remove('active')); this.classList.add('active');">
                  <img src="${img}" alt="Thumbnail ${i + 1}">
                </button>
              `).join("")}
            </div>
          </div>
          <div class="qv-details">
            <span class="qv-category">${p.category}</span>
            <h2 class="qv-title">${p.name}</h2>
            <div class="qv-rating">
              <span class="stars" style="--r:${p.rating}">★★★★★</span>
              <span>${p.rating} (${p.reviews} verified reviews)</span>
            </div>
            <div class="qv-price-box">
              <span class="qv-price">₹${p.price.toLocaleString("en-IN")}</span>
              <s class="qv-mrp">₹${p.originalPrice.toLocaleString("en-IN")}</s>
              <span class="qv-discount">${p.discount}</span>
            </div>
            <p class="qv-desc">${p.description}</p>
            
            <div class="qv-options">
              <div class="qv-option-group">
                <label>Select Size:</label>
                <div class="qv-size-pills" id="qvSizes">
                  ${p.sizes.map((s, i) => `
                    <button type="button" class="qv-size-pill ${i === 0 ? 'active' : ''}" data-size="${s}">${s}</button>
                  `).join("")}
                </div>
              </div>

              <div class="qv-option-group">
                <label>Color: <span id="qvColorName">${selectedColor}</span></label>
                <div class="qv-color-swatches" id="qvColors">
                  ${p.colors.map((c, i) => `
                    <button type="button" class="qv-color-dot ${i === 0 ? 'active' : ''}" style="background-color: ${c.hex}" data-color="${c.name}" title="${c.name}"></button>
                  `).join("")}
                </div>
              </div>

              <div class="qv-option-group">
                <label>Quantity:</label>
                <div class="qv-qty-stepper">
                  <button type="button" id="qvQtyDec">−</button>
                  <span id="qvQtyVal">1</span>
                  <button type="button" id="qvQtyInc">+</button>
                </div>
              </div>
            </div>

            <div class="qv-actions">
              <button type="button" class="btn btn-primary btn-block" id="qvAddBagBtn">
                <svg class="i i-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>
                Add to Shopping Bag
              </button>
              <button type="button" class="btn btn-whatsapp btn-block" id="qvWhatsAppBtn">
                <svg class="i i-sm" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.301-.15-1.782-.879-2.058-.98-.276-.1-.477-.15-.678.15-.201.301-.779.98-.955 1.18-.176.201-.352.226-.653.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.786-1.677-2.087-.176-.301-.019-.464.132-.614.136-.135.301-.352.452-.527.15-.176.201-.301.301-.502.101-.201.05-.377-.025-.527-.075-.15-.678-1.633-.93-2.236-.245-.588-.495-.508-.678-.518l-.578-.01c-.201 0-.527.075-.803.377-.276.301-1.054 1.03-1.054 2.512 0 1.482 1.079 2.912 1.23 3.113.15.201 2.123 3.242 5.143 4.547.718.311 1.279.497 1.716.636.721.229 1.377.197 1.896.119.578-.087 1.782-.728 2.033-1.431.251-.703.251-1.306.176-1.431-.075-.125-.276-.201-.577-.351z"/></svg>
                Inquire on WhatsApp
              </button>
              <a href="product-detail.html?id=${p.id}" class="qv-view-full">View Full Product Details &amp; Sizing &rarr;</a>
            </div>
          </div>
        </div>
      `;

      // Wire interactive controls in Quick View
      let currentSize = selectedSize;
      let currentColor = selectedColor;
      let currentQty = 1;

      document.querySelectorAll("#qvSizes .qv-size-pill").forEach(btn => {
        btn.addEventListener("click", () => {
          document.querySelectorAll("#qvSizes .qv-size-pill").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          currentSize = btn.getAttribute("data-size");
        });
      });

      document.querySelectorAll("#qvColors .qv-color-dot").forEach(btn => {
        btn.addEventListener("click", () => {
          document.querySelectorAll("#qvColors .qv-color-dot").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          currentColor = btn.getAttribute("data-color");
          document.getElementById("qvColorName").textContent = currentColor;
        });
      });

      const qtyVal = document.getElementById("qvQtyVal");
      document.getElementById("qvQtyInc").addEventListener("click", () => {
        currentQty++;
        qtyVal.textContent = currentQty;
      });
      document.getElementById("qvQtyDec").addEventListener("click", () => {
        if (currentQty > 1) {
          currentQty--;
          qtyVal.textContent = currentQty;
        }
      });

      document.getElementById("qvAddBagBtn").addEventListener("click", () => {
        this.addToCart(p, currentSize, currentColor, currentQty);
        this.closeQuickView();
      });

      document.getElementById("qvWhatsAppBtn").addEventListener("click", () => {
        this.openWhatsAppInquiry(p.id, currentSize, currentColor);
      });

      const modal = document.getElementById("quickViewModal");
      modal.classList.add("open");
      document.body.classList.add("modal-open");
    },

    closeQuickView: function () {
      const modal = document.getElementById("quickViewModal");
      if (modal) modal.classList.remove("open");
      document.body.classList.remove("modal-open");
    },

    // Global Initializer
    init: function () {
      this.updateHeaderBadges();
      this.initMiniCart();

      // Listen for storage events across multiple tabs
      window.addEventListener("storage", (e) => {
        if (e.key === CART_KEY || e.key === WISH_KEY) {
          this.updateHeaderBadges();
          this.renderMiniCart();
        }
      });

      // Quick View triggers
      document.addEventListener("click", (e) => {
        const qvTrigger = e.target.closest("[data-quick-view]");
        if (qvTrigger) {
          e.preventDefault();
          const pid = qvTrigger.getAttribute("data-quick-view");
          this.openQuickView(pid);
        }

        const wishTrigger = e.target.closest("[data-wishlist-toggle]");
        if (wishTrigger) {
          e.preventDefault();
          const pid = wishTrigger.getAttribute("data-wishlist-toggle");
          const active = this.toggleWishlist(pid);
          wishTrigger.classList.toggle("active", active);
          wishTrigger.setAttribute("aria-pressed", String(active));
        }

        const addTrigger = e.target.closest("[data-add-to-cart]");
        if (addTrigger) {
          e.preventDefault();
          const pid = addTrigger.getAttribute("data-add-to-cart");
          this.addToCart(pid, null, null, 1);
        }

        const waTrigger = e.target.closest("[data-whatsapp-inquire]");
        if (waTrigger) {
          e.preventDefault();
          const pid = waTrigger.getAttribute("data-whatsapp-inquire");
          this.openWhatsAppInquiry(pid);
        }
      });
    }
  };

  // Export to window
  window.RibStore = RibStore;

  // Auto-init when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => RibStore.init());
  } else {
    RibStore.init();
  }
})(window);

