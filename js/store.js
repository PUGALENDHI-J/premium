/* =========================================================
   Hastavam Textiles — Client-side Store
   Everything here runs in the browser using localStorage.
   There is no server: this simulates the workflow of a real
   ecommerce backend (cart, orders, accounts) for demo purposes.
   ========================================================= */

const LS_KEYS = {
  cart: "hst_cart",
  wishlist: "hst_wishlist",
  compare: "hst_compare",
  recent: "hst_recent",
  auth: "hst_auth",
  orders: "hst_orders",
  addresses: "hst_addresses"
};

function lsGet(key, fallback){
  try{
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : (fallback !== undefined ? fallback : null);
  }catch(e){ return fallback !== undefined ? fallback : null; }
}
function lsSet(key, val){
  try{ localStorage.setItem(key, JSON.stringify(val)); }catch(e){ /* storage unavailable */ }
}

const Store = {

  /* ---------------- CART ---------------- */
  getCart(){ return lsGet(LS_KEYS.cart, []); },
  cartCount(){ return Store.getCart().reduce((n,i)=>n+i.qty,0); },
  cartTotal(){ return Store.getCart().reduce((n,i)=>{ const p=getProduct(i.id); return n + (p?p.price*i.qty:0); },0); },
  addToCart(id, qty){
    qty = qty || 1;
    const cart = Store.getCart();
    const existing = cart.find(i=>i.id===id);
    if(existing){ existing.qty += qty; } else { cart.push({id, qty}); }
    lsSet(LS_KEYS.cart, cart);
    Store.notify();
    Store.toast(getProduct(id) ? `Added "${getProduct(id).name}" to cart` : "Added to cart");
  },
  setQty(id, qty){
    let cart = Store.getCart();
    if(qty <= 0){ cart = cart.filter(i=>i.id!==id); }
    else { const it = cart.find(i=>i.id===id); if(it) it.qty = qty; }
    lsSet(LS_KEYS.cart, cart);
    Store.notify();
  },
  removeFromCart(id){
    const cart = Store.getCart().filter(i=>i.id!==id);
    lsSet(LS_KEYS.cart, cart);
    Store.notify();
    Store.toast("Removed from cart");
  },
  clearCart(){ lsSet(LS_KEYS.cart, []); Store.notify(); },

  /* ---------------- WISHLIST ---------------- */
  getWishlist(){ return lsGet(LS_KEYS.wishlist, []); },
  isWishlisted(id){ return Store.getWishlist().includes(id); },
  toggleWishlist(id){
    let wl = Store.getWishlist();
    if(wl.includes(id)){ wl = wl.filter(x=>x!==id); Store.toast("Removed from wishlist"); }
    else { wl.push(id); Store.toast("Saved to wishlist"); }
    lsSet(LS_KEYS.wishlist, wl);
    Store.notify();
  },
  moveWishlistToCart(id){
    Store.addToCart(id, 1);
    let wl = Store.getWishlist().filter(x=>x!==id);
    lsSet(LS_KEYS.wishlist, wl);
    Store.notify();
  },

  /* ---------------- COMPARE ---------------- */
  getCompare(){ return lsGet(LS_KEYS.compare, []); },
  toggleCompare(id){
    let cmp = Store.getCompare();
    if(cmp.includes(id)){ cmp = cmp.filter(x=>x!==id); }
    else {
      if(cmp.length >= 4){ Store.toast("You can compare up to 4 products"); return; }
      cmp.push(id);
    }
    lsSet(LS_KEYS.compare, cmp);
    Store.notify();
  },
  clearCompare(){ lsSet(LS_KEYS.compare, []); Store.notify(); },

  /* ---------------- RECENTLY VIEWED ---------------- */
  addRecent(id){
    let r = lsGet(LS_KEYS.recent, []).filter(x=>x!==id);
    r.unshift(id);
    r = r.slice(0,8);
    lsSet(LS_KEYS.recent, r);
  },
  getRecent(excludeId){
    return lsGet(LS_KEYS.recent, []).filter(x=>x!==excludeId);
  },

  /* ---------------- COUPONS ---------------- */
  coupons: {
    "HANDLOOM10": { pct:10, label:"10% off" },
    "WELCOME500": { flat:500, label:"₹500 off" },
    "FESTIVE15":  { pct:15, label:"15% off (festive)" }
  },
  applyCoupon(code, subtotal){
    const c = Store.coupons[(code||"").trim().toUpperCase()];
    if(!c) return { ok:false, message:"That coupon code isn't valid." };
    const discount = c.pct ? Math.round(subtotal * c.pct/100) : c.flat;
    return { ok:true, code:(code||"").trim().toUpperCase(), discount, label:c.label };
  },

  /* ---------------- AUTH (demo only — not secure, no backend) ---------------- */
  getAuth(){ return lsGet(LS_KEYS.auth, null); },
  isLoggedIn(){ return !!Store.getAuth(); },
  register(name, email, password){
    const users = lsGet("hst_users", {});
    if(users[email]) return { ok:false, message:"An account with this email already exists." };
    users[email] = { name, email, password };
    lsSet("hst_users", users);
    lsSet(LS_KEYS.auth, { name, email });
    Store.notify();
    return { ok:true };
  },
  login(email, password){
    const users = lsGet("hst_users", {});
    const u = users[email];
    if(!u || u.password !== password) return { ok:false, message:"Incorrect email or password." };
    lsSet(LS_KEYS.auth, { name:u.name, email:u.email });
    Store.notify();
    return { ok:true };
  },
  logout(){ localStorage.removeItem(LS_KEYS.auth); Store.notify(); },

  /* ---------------- ADDRESSES ---------------- */
  getAddresses(){ return lsGet(LS_KEYS.addresses, []); },
  addAddress(addr){
    const list = Store.getAddresses();
    addr.id = "addr_" + Date.now();
    list.push(addr);
    lsSet(LS_KEYS.addresses, list);
    return addr;
  },

  /* ---------------- ORDERS ---------------- */
  getOrders(){ return lsGet(LS_KEYS.orders, []); },
  getOrder(orderId){ return Store.getOrders().find(o=>o.id===orderId); },
  placeOrder({ address, paymentMethod, couponCode, couponDiscount }){
    const cart = Store.getCart();
    if(!cart.length) return { ok:false, message:"Your cart is empty." };
    const items = cart.map(i=>{
      const p = getProduct(i.id);
      return { id:i.id, name:p.name, image:p.images[0], price:p.price, qty:i.qty };
    });
    const subtotal = items.reduce((n,i)=>n+i.price*i.qty,0);
    const shipping = subtotal >= 5000 ? 0 : 149;
    const discount = couponDiscount || 0;
    const tax = Math.round((subtotal - discount) * 0.05); // demo 5% GST
    const total = Math.max(0, subtotal - discount) + shipping + tax;
    const order = {
      id: "HST" + Date.now().toString().slice(-8),
      date: new Date().toISOString(),
      items, subtotal, shipping, tax, discount, couponCode: couponCode||null,
      total, address, paymentMethod,
      status: paymentMethod === "cod" ? "Order Confirmed" : "Payment Pending (Demo)",
      trackingStages: ["Order Confirmed","Packed","Shipped","Out for Delivery","Delivered"],
      trackingIndex: 0
    };
    const orders = Store.getOrders();
    orders.unshift(order);
    lsSet(LS_KEYS.orders, orders);
    Store.clearCart();
    return { ok:true, order };
  },

  /* ---------------- UI: badge sync + toast ---------------- */
  notify(){
    document.querySelectorAll("[data-cart-count]").forEach(el=>{
      const n = Store.cartCount();
      el.textContent = n;
      el.style.display = n > 0 ? "flex" : "none";
    });
    document.querySelectorAll("[data-wishlist-count]").forEach(el=>{
      const n = Store.getWishlist().length;
      el.textContent = n;
      el.style.display = n > 0 ? "flex" : "none";
    });
    document.querySelectorAll("[data-compare-count]").forEach(el=>{
      const n = Store.getCompare().length;
      el.textContent = n;
      el.style.display = n > 0 ? "flex" : "none";
    });
    document.querySelectorAll("[data-auth-state]").forEach(el=>{
      const a = Store.getAuth();
      el.textContent = a ? a.name.split(" ")[0] : "Sign In";
      el.href = a ? "account.html" : "login.html";
    });
  },
  toast(message){
    let host = document.getElementById("toastHost");
    if(!host){
      host = document.createElement("div");
      host.id = "toastHost";
      host.className = "toast-host";
      document.body.appendChild(host);
    }
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = message;
    host.appendChild(el);
    requestAnimationFrame(()=>el.classList.add("show"));
    setTimeout(()=>{ el.classList.remove("show"); setTimeout(()=>el.remove(),300); }, 2600);
  }
};

document.addEventListener("DOMContentLoaded", Store.notify);
