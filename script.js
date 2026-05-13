// ==========================================
// 1. DUMMY DATA & CONSTANTS
// ==========================================
// ==========================================
// 1. DUMMY DATA & CONSTANTS
// ==========================================
const FEED_KEY = "kk_demo_feed_v2"; // Updated to force fresh feed load
const USER_KEY = "kk_demo_user";
const MARKET_KEY = "kk_demo_market_v2";

const DEMO_USERS = [
  { id: 1, mobile_number: "01700000001", password: "password123", full_name: "Rahim Uddin", role: "Farmer" },
  { id: 2, mobile_number: "01700000002", password: "expert123", full_name: "Dr. Nusrat Rahman", role: "Verified Expert" },
  { id: 3, mobile_number: "01700000003", password: "seller123", full_name: "Hasan Traders", role: "General Vendor" },
  { id: 4, mobile_number: "01700000004", password: "admin123", full_name: "System Admin", role: "Admin" },
  { id: 5, mobile_number: "01700000005", password: "jalal123", full_name: "Jalal Mia", role: "Farmer" },
  { id: 6, mobile_number: "01700000006", password: "shirin123", full_name: "Shirin Akter", role: "Farmer" },
  { id: 7, mobile_number: "01700000007", password: "kabir123", full_name: "Kabir Agro Mart", role: "General Vendor" },
  { id: 8, mobile_number: "01700000008", password: "rokeya123", full_name: "Rokeya Seed House", role: "General Vendor" },
  { id: 9, mobile_number: "01700000009", password: "aminul123", full_name: "Aminul Haque", role: "Verified Expert" },
  { id: 10, mobile_number: "01700000010", password: "tania123", full_name: "Tania Sultana", role: "Verified Expert" },
  { id: 11, mobile_number: "01700000011", password: "nahid123", full_name: "Nahid Hasan", role: "Farmer" },
  { id: 12, mobile_number: "01700000012", password: "rima123", full_name: "Rima Khatun", role: "Farmer" },
];

const INITIAL_POSTS = [
  { id: 101, authorName: "Jalal Mia", created_at: "10 mins ago", text_content: "Prepared raised beds for okra today. Soil moisture is stable.", image_url: "", likesCount: 12, commentsCount: 3 },
  { id: 102, authorName: "Rahim Uddin", created_at: "1 hour ago", text_content: "Irrigated the paddy field early morning to reduce evaporation loss.", image_url: "", likesCount: 8, commentsCount: 1 },
  { id: 103, authorName: "Shirin Akter", created_at: "2 hours ago", text_content: "Started compost tea application for chili plants this week.", image_url: "", likesCount: 15, commentsCount: 4 },
  { id: 104, authorName: "Nahid Hasan", created_at: "3 hours ago", text_content: "Neem oil spray helped reduce leaf curl in my brinjal plot.", image_url: "", likesCount: 22, commentsCount: 6 },
  { id: 105, authorName: "Rima Khatun", created_at: "5 hours ago", text_content: "Transplanted tomato seedlings and added organic mulch.", image_url: "", likesCount: 9, commentsCount: 2 },
  { id: 106, authorName: "Kabir Agro Mart", created_at: "1 day ago", text_content: "Received a fresh stock of certified rice seeds in my shop.", image_url: "", likesCount: 34, commentsCount: 8 },
  { id: 107, authorName: "Dr. Nusrat Rahman", created_at: "1 day ago", text_content: "Weather looks cloudy, planning light irrigation only.", image_url: "", likesCount: 45, commentsCount: 12 },
  { id: 108, authorName: "Aminul Haque", created_at: "2 days ago", text_content: "Tested drip line pressure. Uniform flow is much better now.", image_url: "", likesCount: 18, commentsCount: 3 },
  { id: 109, authorName: "Tania Sultana", created_at: "2 days ago", text_content: "Applied balanced NPK before flowering stage as advised.", image_url: "", likesCount: 27, commentsCount: 5 },
  { id: 110, authorName: "Jalal Mia", created_at: "3 days ago", text_content: "Field scouting found early pest signs, taking preventive measures.", image_url: "", likesCount: 14, commentsCount: 2 },
  { id: 111, authorName: "Rokeya Seed House", created_at: "3 days ago", text_content: "Seed germination rate is excellent this season.", image_url: "", likesCount: 11, commentsCount: 1 },
  { id: 112, authorName: "Rahim Uddin", created_at: "4 days ago", text_content: "Using pheromone traps reduced insect pressure significantly.", image_url: "", likesCount: 31, commentsCount: 7 },
];

const INITIAL_MARKET_ADS = [
  { id: 201, vendorName: "Hasan Traders", product_title: "Hybrid Tomato Seeds", description: "Early flowering variety, high yield", price: 850, category: "Seeds", location: "Gazipur", quantity: 200, unit: "kg" },
  { id: 202, vendorName: "Hasan Traders", product_title: "Potassium Fertilizer (50kg)", description: "NPK 0-0-60 for fruiting stage", price: 2500, category: "Fertilizer", location: "Gazipur", quantity: 100, unit: "bag" },
  { id: 203, vendorName: "Rahim Uddin", product_title: "Fresh Eggplant", description: "Organically grown, pesticide-free", price: 120, category: "Produce", location: "Bogura", quantity: 800, unit: "kg" },
  { id: 204, vendorName: "Rahim Uddin", product_title: "Green Beans (Fresh)", description: "Tender and crisp, harvested today", price: 180, category: "Produce", location: "Bogura", quantity: 500, unit: "kg" },
  { id: 205, vendorName: "System Admin", product_title: "Diesel Hand Pump", description: "Heavy duty 1.5HP with 5m hose", price: 8500, category: "Equipment", location: "Dhaka", quantity: 15, unit: "piece" },
  { id: 206, vendorName: "System Admin", product_title: "Agricultural Hose (50m)", description: "3-ply rubber, UV resistant", price: 1200, category: "Tools", location: "Dhaka", quantity: 40, unit: "roll" },
  { id: 207, vendorName: "Hasan Traders", product_title: "Urea Fertilizer (50kg)", description: "Nitrogen rich for vegetative growth", price: 1800, category: "Fertilizer", location: "Gazipur", quantity: 150, unit: "bag" },
  { id: 208, vendorName: "Rahim Uddin", product_title: "Red Chili Powder (1kg)", description: "Dried and ground, spicy variety", price: 450, category: "Produce", location: "Bogura", quantity: 300, unit: "kg" },
  { id: 209, vendorName: "Hasan Traders", product_title: "Premium Boro Rice Seed", description: "High germination rate seed suitable for current Boro season.", price: 1200, category: "Seeds", location: "Gazipur", quantity: 150, unit: "kg" },
  { id: 210, vendorName: "Hasan Traders", product_title: "Fresh Green Chili", description: "Freshly harvested green chili from Bogura farms.", price: 140, category: "Produce", location: "Bogura", quantity: 500, unit: "kg" },
  { id: 211, vendorName: "Hasan Traders", product_title: "Sprayer Machine (16L)", description: "Durable hand sprayer suitable for regular field work.", price: 3200, category: "Tools", location: "Dhaka", quantity: 25, unit: "piece" }
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
  const createPostCard = document.getElementById("createPostCard");
  if (!feedList || !createPostCard) return; // Only run on homepage where post creation exists

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

function initProfilePage() {
  const profileCard = document.getElementById("profileCard");
  const profileLogoutWrap = document.getElementById("profileLogoutWrap");
  const profileLogoutBtn = document.getElementById("profileLogoutBtn");
  const profilePostsList = document.getElementById("profilePosts");

  if (!profileCard) return; // Exit if not on profile page

  const user = getUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // 1. Render Profile Card
  const initials = getInitials(user.full_name);
  
  // Calculate dynamic stats
  const allPosts = getPosts();
  const userPosts = allPosts.filter(p => p.authorName === user.full_name);
  
  profileCard.innerHTML = `
    <div class="profile-avatar-large">${initials}</div>
    <h2 class="profile-name">${escapeHtml(user.full_name)}</h2>
    <span class="profile-role-badge">${escapeHtml(user.role)}</span>
    <div class="profile-stats">
      <div class="stat-item">
        <span class="stat-value">${userPosts.length}</span>
        <span class="stat-label">Posts</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${user.mobile_number.slice(-3)}</span> <!-- Dummy stat based on mobile -->
        <span class="stat-label">Connections</span>
      </div>
    </div>
  `;

  // 2. Render User's Own Posts
  if (userPosts.length === 0) {
    profilePostsList.innerHTML = `<p style="text-align:center; color: #718096; padding: 20px;">You haven't posted anything yet.</p>`;
  } else {
    profilePostsList.innerHTML = userPosts.map((post, index) => {
      const avatarClass = index % 2 === 0 ? "avatar-a" : "avatar-b";
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
        </div>
      </article>`;
    }).join("");
  }

  // 3. Handle Logout
  if (profileLogoutWrap && profileLogoutBtn) {
    profileLogoutWrap.style.display = "block";
    profileLogoutBtn.addEventListener("click", () => {
      localStorage.removeItem(USER_KEY);
      window.location.href = "login.html";
    });
  }
}

// ==========================================
// 5. EXECUTION SEQUENCE
// ==========================================
initGlobalAuth();
initLoginPage();
initFeedPage();
initMarketplacePage();
initProfilePage();
attachDisabledNavHandlers();
function initProfilePage() {
  const profileCard = document.getElementById("profileCard");
  const profileActions = document.getElementById("profileActions");
  const profileLogoutWrap = document.getElementById("profileLogoutWrap");
  const profileLogoutBtn = document.getElementById("profileLogoutBtn");
  const profilePostsList = document.getElementById("profilePosts");
  const adminToolsPanel = document.getElementById("adminToolsPanel");

  if (!profileCard) return; // Exit if not on profile page

  const user = getUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // 1. Render Profile Card
  const initials = getInitials(user.full_name);
  const allPosts = getPosts();
  const userPosts = allPosts.filter(p => p.authorName === user.full_name);
  
  // Using the image's exact structure
  profileCard.innerHTML = `
    <div class="profile-header-row">
      <div class="profile-avatar-new">${initials}</div>
      <div class="profile-info-new">
        <h2 class="profile-name-new">${escapeHtml(user.full_name)}</h2>
        <p class="profile-role-new">${escapeHtml(user.role)} &bull; Dhaka</p>
      </div>
    </div>
    <p class="profile-bio-new">No bio yet.</p>
    <div class="profile-stats-grid">
      <div class="stat-box">
        <span class="stat-num">${userPosts.length}</span>
        <span class="stat-text">Posts</span>
      </div>
      <div class="stat-box">
        <span class="stat-num">7</span>
        <span class="stat-text">Connections</span>
      </div>
      <div class="stat-box">
        <span class="stat-num">0</span>
        <span class="stat-text">Followers</span>
      </div>
      <div class="stat-box">
        <span class="stat-num">0</span>
        <span class="stat-text">Following</span>
      </div>
    </div>
  `;

  // 2. Render Action Buttons (Matching the Pill Design)
  if (profileActions) {
    profileActions.innerHTML = `
      <button id="editProfileBtn" class="pill-btn primary">Edit Profile</button>
      <button id="viewConnectionsBtn" class="pill-btn secondary">View Connections</button>
      <button id="requestRoleBtn" class="pill-btn secondary">Request Role</button>
    `;

    document.getElementById("editProfileBtn").addEventListener("click", () => alert("Edit Profile feature coming soon!"));
    document.getElementById("viewConnectionsBtn").addEventListener("click", () => alert("Connections view coming soon!"));
    document.getElementById("requestRoleBtn").addEventListener("click", () => alert("Role request sent!"));
  }

  // 3. Render User's Own Posts
  if (userPosts.length === 0) {
    profilePostsList.innerHTML = `<p style="text-align:center; color: #718096; padding: 20px;">You haven't posted anything yet.</p>`;
  } else {
    profilePostsList.innerHTML = userPosts.map((post, index) => {
      const avatarClass = index % 2 === 0 ? "avatar-a" : "avatar-b";
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
          <button type="button" onclick="alert('Liked!')"><i class="fa-regular fa-heart"></i> Like ${Number(post.likesCount) || 0}</button>
          <button type="button"><i class="fa-regular fa-comment"></i> Comment ${Number(post.commentsCount) || 0}</button>
        </div>
      </article>`;
    }).join("");
  }

  // 4. Handle Admin Tools
  if (user.role === "Admin" && adminToolsPanel) {
    adminToolsPanel.style.display = "block";
  }

  // 5. Handle Logout
  if (profileLogoutWrap && profileLogoutBtn) {
    profileLogoutWrap.style.display = "flex";
    profileLogoutWrap.style.justifyContent = "flex-start"; // Align left like the image
    profileLogoutBtn.className = "pill-btn secondary logout-pill"; // Update class to match pills
    
    // Remove old icon if it exists and just use text
    profileLogoutBtn.innerHTML = "Logout"; 

    profileLogoutBtn.addEventListener("click", () => {
      localStorage.removeItem(USER_KEY);
      window.location.href = "login.html";
    });
  }
}