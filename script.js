// ==========================================
// 1. DUMMY DATA & CONSTANTS
// ==========================================
const FEED_KEY = "kk_demo_feed_posts";
const USER_KEY = "kk_demo_user";
const MARKET_KEY = "kk_demo_market_v2"; // Updated to force fresh data load

const DEMO_USERS = [
  { id: 1, mobile_number: "01700000001", password: "password123", full_name: "Rahim Uddin", role: "Farmer" },
  { id: 2, mobile_number: "01700000002", password: "expert123", full_name: "Dr. Nusrat Rahman", role: "Verified Expert" },
  { id: 3, mobile_number: "01700000003", password: "seller123", full_name: "Hasan Traders", role: "General Vendor" },
  { id: 4, mobile_number: "01700000004", password: "admin123", full_name: "System Admin", role: "Admin" },
];

const INITIAL_POSTS = [
  { id: 101, authorName: "Rahim Uddin", created_at: "2 hours ago", text_content: "Planted winter tomato seeds today. Weather looks stable for the next week.", image_url: "", likesCount: 6, commentsCount: 2 },
  { id: 102, authorName: "Dr. Nusrat Rahman", created_at: "5 hours ago", text_content: "Keep irrigation light after transplanting. Too much water now can stress roots.", image_url: "", likesCount: 14, commentsCount: 5 },
  { id: 103, authorName: "Hasan Traders", created_at: "1 day ago", text_content: "New organic compost stock arrived. Delivery available in Gazipur and Dhaka.", image_url: "", likesCount: 9, commentsCount: 3 },
];

const INITIAL_MARKET_ADS = [
  { id: 201, vendorName: "Hasan Traders", product_title: "Hybrid Tomato Seeds", description: "Early flowering variety, high yield", price: 850, category: "Seeds", location: "Gazipur", quantity: 200, unit: "kg" },
  { id: 202, vendorName: "Hasan Traders", product_title: "Potassium Fertilizer (50kg)", description: "NPK 0-0-60 for fruiting stage", price: 2500, category: "Fertilizer", location: "Gazipur", quantity: 100, unit: "bag" },
  { id: 203, vendorName: "Rahim Uddin", product_title: "Fresh Eggplant", description: "Organically grown, pesticide-free", price: 120, category: "Produce", location: "Bogura", quantity: 800, unit: "kg" },
  { id: 204, vendorName: "Rahim Uddin", product_title: "Green Beans (Fresh)", description: "Tender and crisp, harvested today", price: 180, category: "Produce", location: "Bogura", quantity: 500, unit: "kg" },
  { id: 205, vendorName: "System Admin", product_title: "Diesel Hand Pump", description: "Heavy duty 1.5HP with 5m hose", price: 8500, category: "Equipment", location: "Dhaka", quantity: 15, unit: "piece" },
  { id: 206, vendorName: "System Admin", product_title: "Agricultural Hose (50m)", description: "3-ply rubber, UV resistant", price: 1200, category: "Tools", location: "Dhaka", quantity: 40, unit: "roll" },
  { id: 207, vendorName: "Hasan Traders", product_title: "Urea Fertilizer (50kg)", description: "Nitrogen rich for vegetative growth", price: 1800, category: "Fertilizer", location: "Gazipur", quantity: 150, unit: "bag" },
  { id: 208, vendorName: "Rahim Uddin", product_title: "Red Chili Powder (1kg)", description: "Dried and ground, spicy variety", price: 450, category: "Produce", location: "Bogura", quantity: 300, unit: "kg" }
];

// ==========================================
// 2. HELPER FUNCTIONS
// ==========================================
function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } 
  catch (_error) { localStorage.removeItem(USER_KEY); return null; }
}

function getInitials(name) {
  const safeName = String(name || "Anonymous").trim();
  const parts = safeName.split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] || "A") + (parts[1]?.[0] || "K");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function attachDisabledNavHandlers() {
  const disabledLinks = document.querySelectorAll('[data-disabled-nav="true"]');
  disabledLinks.forEach((link) => {
    link.addEventListener("click", (event) => event.preventDefault());
  });
}

// ==========================================
// 3. STORAGE FUNCTIONS (FEED & MARKET)
// ==========================================
function getPosts() {
  const existing = localStorage.getItem(FEED_KEY);
  if (existing) {
    try { return JSON.parse(existing); } 
    catch (_error) { localStorage.removeItem(FEED_KEY); }
  }
  localStorage.setItem(FEED_KEY, JSON.stringify(INITIAL_POSTS));
  return [...INITIAL_POSTS];
}

function savePosts(posts) {
  localStorage.setItem(FEED_KEY, JSON.stringify(posts));
}

function getMarketAds() {
  const existing = localStorage.getItem(MARKET_KEY);
  if (existing) {
    try { return JSON.parse(existing); } 
    catch (_error) { localStorage.removeItem(MARKET_KEY); }
  }
  localStorage.setItem(MARKET_KEY, JSON.stringify(INITIAL_MARKET_ADS));
  return [...INITIAL_MARKET_ADS];
}

function saveMarketAds(ads) {
  localStorage.setItem(MARKET_KEY, JSON.stringify(ads));
}

// ==========================================
// 4. PAGE INITIALIZATION FUNCTIONS
// ==========================================
function initGlobalAuth() {
  const user = getUser();
  const logoutBtn = document.getElementById("logoutBtn");
  const loginLink = document.getElementById("loginLink");
  const signupLink = document.getElementById("signupLink");
  const guestModePrompt = document.getElementById("guestModePrompt");

  if (document.getElementById("loginForm")) return; // Skip if on login page

  if (user) {
    if (loginLink) loginLink.style.display = "none";
    if (signupLink) signupLink.style.display = "none";
    if (guestModePrompt) guestModePrompt.style.display = "none";
    
    if (logoutBtn) {
      logoutBtn.style.display = "inline-block";
      logoutBtn.textContent = `Logout (${user.full_name})`;
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem(USER_KEY);
        window.location.href = "login.html";
      });
    }
  } else {
    // Redirect non-logged in users
    window.location.href = "login.html";
  }
}

function initLoginPage() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  const errorMessage = document.getElementById("errorMessage");
  const successMessage = document.getElementById("successMessage");
  const mobileInput = document.getElementById("mobileNumber");
  const passwordInput = document.getElementById("password");

  if (getUser()) {
    window.location.href = "index.html";
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const mobileNumber = mobileInput.value.trim();
    const password = passwordInput.value;

    errorMessage.classList.remove("show");
    successMessage.classList.remove("show");

    const user = DEMO_USERS.find(
      (item) => item.mobile_number === mobileNumber && item.password === password
    );

    if (!user) {
      errorMessage.textContent = "Invalid credentials. Use one of the dummy login options.";
      errorMessage.classList.add("show");
      return;
    }

    const sessionUser = { id: user.id, full_name: user.full_name, mobile_number: user.mobile_number, role: user.role };
    localStorage.setItem(USER_KEY, JSON.stringify(sessionUser));
    
    successMessage.textContent = "Login successful! Redirecting...";
    successMessage.classList.add("show");
    setTimeout(() => { window.location.href = "index.html"; }, 600);
  });
}

function initFeedPage() {
  const feedList = document.querySelector(".feed-list");
  if (!feedList) return; 

  const user = getUser();
  const composerAvatar = document.querySelector(".avatar-owner");
  const postTextInput = document.getElementById("postText");
  const postBtn = document.querySelector(".post-btn");
  const postPhotoInput = document.getElementById("postPhoto");
  const postImagePreviewWrap = document.getElementById("postImagePreviewWrap");
  const postImagePreview = document.getElementById("postImagePreview");
  const removePostImageBtn = document.getElementById("removePostImage");

  if (composerAvatar && user) {
    composerAvatar.textContent = getInitials(user.full_name);
  }

  let selectedImageData = "";

  function clearPreview() {
    selectedImageData = "";
    if (postImagePreview) postImagePreview.src = "";
    if (postImagePreviewWrap) postImagePreviewWrap.hidden = true;
    if (postPhotoInput) postPhotoInput.value = "";
  }

  if (postPhotoInput) {
    postPhotoInput.addEventListener("change", (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) return clearPreview();

      const reader = new FileReader();
      reader.onload = () => {
        selectedImageData = String(reader.result || "");
        if (postImagePreview) postImagePreview.src = selectedImageData;
        if (postImagePreviewWrap) postImagePreviewWrap.hidden = false;
      };
      reader.readAsDataURL(file);
    });
  }

  if (removePostImageBtn) removePostImageBtn.addEventListener("click", clearPreview);

  function renderFeedPosts() {
    const posts = getPosts();
    feedList.innerHTML = posts.map((post, index) => {
      const avatarClass = index % 2 === 0 ? "avatar-a" : "avatar-b";
      const initials = getInitials(post.authorName);
      const imageMarkup = post.image_url ? `<div class="post-photo post-photo-has-image"><img class="post-photo-img" src="${escapeHtml(post.image_url)}" alt="Post image" /></div>` : "";

      return `<article class="post-card">
        <div class="post-head">
          <div class="avatar ${avatarClass}">${initials}</div>
          <div class="post-user-meta">
            <p class="post-user">${escapeHtml(post.authorName)}</p>
            <p class="post-time">${escapeHtml(post.created_at)}</p>
          </div>
        </div>
        <p class="post-text">${escapeHtml(post.text_content || "")}</p>
        ${imageMarkup}
        <div class="post-actions">
          <button type="button"><i class="fa-regular fa-heart"></i> Like ${Number(post.likesCount) || 0}</button>
          <button type="button"><i class="fa-regular fa-comment"></i> Comment ${Number(post.commentsCount) || 0}</button>
          <button type="button"><i class="fa-solid fa-share"></i> Share</button>
        </div>
      </article>`;
    }).join("");
  }

  if (postBtn) {
    postBtn.addEventListener("click", () => {
      const text = String(postTextInput?.value || "").trim();
      if (!text && !selectedImageData) return;

      const newPost = {
        id: Date.now(),
        authorName: user.full_name,
        created_at: "Just now",
        text_content: text,
        image_url: selectedImageData,
        likesCount: 0,
        commentsCount: 0,
      };

      const posts = getPosts();
      posts.unshift(newPost);
      savePosts(posts);

      if (postTextInput) postTextInput.value = "";
      clearPreview();
      renderFeedPosts();
    });
  }

  renderFeedPosts();
}

function initMarketplacePage() {
  const marketGrid = document.querySelector(".market-grid");
  const marketSubmitBtn = document.querySelector(".marketplace-form .submit-btn");
  const marketClearBtn = document.querySelector(".marketplace-form .cancel-btn");
  
  if (!marketGrid) return; // Exit if not on marketplace

  function renderAds() {
    const ads = getMarketAds();
    
    if (ads.length === 0) {
      marketGrid.innerHTML = `<p style="text-align:center; width:100%; color: #4a5568;">No products available right now.</p>`;
      return;
    }

    marketGrid.innerHTML = ads.map(ad => `
      <article class="news-card" style="margin-bottom: 20px;"> 
        <div class="news-card-header" style="background: #f8fafc; color: #2c3e50;">
          <h3 class="news-card-title" style="margin:0;">${escapeHtml(ad.product_title)}</h3>
          <span class="news-category-badge">${escapeHtml(ad.category)}</span>
        </div>
        <div class="news-card-body">
          <h2 style="color: #7aa169; margin: 0 0 10px 0;">৳${ad.price}</h2>
          <p class="news-card-excerpt">${escapeHtml(ad.description)}</p>
          <p style="font-size: 13px; color: #4a5568;">
            <strong>Quantity:</strong> ${ad.quantity} ${escapeHtml(ad.unit)} <br>
            <strong>Location:</strong> <i class="fa-solid fa-location-dot"></i> ${escapeHtml(ad.location)}
          </p>
          <div class="news-card-footer">
            <span class="news-source"><i class="fa-solid fa-shop"></i> ${escapeHtml(ad.vendorName)}</span>
            <button class="submit-btn" style="padding: 8px 16px; font-size: 14px;">Contact</button>
          </div>
        </div>
      </article>
    `).join("");
  }

  function clearMarketForm() {
    document.querySelectorAll('.marketplace-form input, .marketplace-form textarea, .marketplace-form select').forEach(el => el.value = '');
  }

  if (marketClearBtn) {
    marketClearBtn.addEventListener("click", clearMarketForm);
  }

  if (marketSubmitBtn) {
    marketSubmitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      
      const user = getUser();
      if (!user) {
        alert("You must be logged in to post a product.");
        window.location.href = "login.html";
        return;
      }

      const title = document.getElementById("adTitle").value;
      const desc = document.getElementById("adDescription").value;
      const price = document.getElementById("adPrice").value;
      const quantity = document.getElementById("adQuantity").value;
      const unit = document.getElementById("adUnit").value;
      const category = document.getElementById("adCategory").value;
      const location = document.getElementById("adLocation").value;

      if (!title || !price || !category || !location) {
        alert("Please fill in the required fields (Title, Price, Category, Location).");
        return;
      }

      const newAd = {
        id: Date.now(),
        vendorName: user.full_name,
        product_title: title,
        description: desc,
        price: Number(price),
        category: category,
        location: location,
        quantity: Number(quantity) || 0,
        unit: unit || "unit"
      };

      const ads = getMarketAds();
      ads.unshift(newAd);
      saveMarketAds(ads);
      
      alert("Product posted successfully!");
      clearMarketForm();
      renderAds();
    });
  }

  renderAds();
}

// ==========================================
// 5. EXECUTION SEQUENCE
// ==========================================
initGlobalAuth();
initLoginPage();
initFeedPage();
initMarketplacePage();
attachDisabledNavHandlers();