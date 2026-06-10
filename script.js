// ==========================================
// 1. DUMMY DATA & CONSTANTS
// ==========================================
// ==========================================
// 1. DUMMY DATA & CONSTANTS
// ==========================================
// Saves the feed posts in the browser.
const FEED_KEY = "kk_demo_feed_v2"; // Updated to force fresh feed load
// Saves the current signed-in user in the browser.
const USER_KEY = "kk_demo_user";
// Saves the marketplace listings in the browser.
const MARKET_KEY = "kk_demo_market_v2";
// Saves which posts each user has liked.
const LIKES_KEY = "kk_post_likes";
// Saves the full list of accounts in the browser.
const USERS_KEY = "kk_demo_users";

// Starter accounts used when the app opens for the first time.
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

// Starter feed posts shown when there is no saved feed yet.
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

// Starter marketplace listings shown when there is no saved market yet.
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
  // Gets the user who is currently signed in.
  // Reads the saved signed-in user text from the browser.
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    // Turns the saved text back into a user object.
    const sessionUser = JSON.parse(raw);
    // Gets the full list of users so we can refresh the role.
    const users = getUsers();
    // Finds the newest version of this same user account.
    const latest = users.find(u => u.id === sessionUser.id);
    if (latest) return { ...sessionUser, role: latest.role };
    return sessionUser;
  } catch (_error) { localStorage.removeItem(USER_KEY); return null; }
}

function getInitials(name) {
  // Turns a full name into short initials.
  // Cleans the name so weird spaces do not cause problems.
  const safeName = String(name || "Anonymous").trim();
  // Splits the name into pieces like first name and last name.
  const parts = safeName.split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] || "A") + (parts[1]?.[0] || "K");
}

function escapeHtml(value) {
  // Makes text safe to place inside HTML.
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function ownsContent(contentOwnerId, contentOwnerName, user) {
  // Checks if this user made the post or listing.
  if (!user) return false;
  if (contentOwnerId != null && Number(contentOwnerId) === Number(user.id)) return true;
  return String(contentOwnerName || "") === String(user.full_name || "");
}

function closeOwnerMenus(scope = document) {
  // Closes any open pen menus.
  scope.querySelectorAll(".owner-menu.open").forEach(menu => menu.classList.remove("open"));
}

function getUserLikes(userId) {
  // Gets the list of posts this user already liked.
  try {
    // Reads the saved like map from the browser.
    const data = JSON.parse(localStorage.getItem(LIKES_KEY) || "{}");
    return data[userId] || [];
  } catch { return []; }
}

function toggleUserLike(userId, postId) {
  // Adds or removes one like for this user.
  // Starts with an empty like map.
  let data = {};
  try { data = JSON.parse(localStorage.getItem(LIKES_KEY) || "{}"); } catch {}
  // Gets the posts this user already liked.
  const likes = data[userId] || [];
  // Looks for the post inside the liked list.
  const idx = likes.indexOf(postId);
  // True means the post was not liked before.
  const isNowLiked = idx === -1;
  if (isNowLiked) likes.push(postId);
  else likes.splice(idx, 1);
  data[userId] = likes;
  localStorage.setItem(LIKES_KEY, JSON.stringify(data));
  return isNowLiked;
}

function getUsers() {
  // Gets all saved accounts.
  try {
    // Reads the saved user list from the browser.
    const stored = localStorage.getItem(USERS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  // Makes a fresh copy of the demo users.
  const copy = DEMO_USERS.map(u => ({ ...u }));
  localStorage.setItem(USERS_KEY, JSON.stringify(copy));
  return copy;
}

function saveUsers(users) {
  // Saves all accounts back to the browser.
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function attachDisabledNavHandlers() {
  // Stops links that are meant to stay inactive for now.
  // Finds every link marked as disabled.
  const disabledLinks = document.querySelectorAll('[data-disabled-nav="true"]');
  disabledLinks.forEach((link) => {
    link.addEventListener("click", (event) => event.preventDefault());
  });
}

// ==========================================
// 3. STORAGE FUNCTIONS (FEED & MARKET)
// ==========================================
function getPosts() {
  // Gets all feed posts.
  // Reads the saved feed text from the browser.
  const existing = localStorage.getItem(FEED_KEY);
  if (existing) {
    try { return JSON.parse(existing); } 
    catch (_error) { localStorage.removeItem(FEED_KEY); }
  }
  localStorage.setItem(FEED_KEY, JSON.stringify(INITIAL_POSTS));
  return [...INITIAL_POSTS];
}

function savePosts(posts) {
  // Saves all feed posts back to the browser.
  localStorage.setItem(FEED_KEY, JSON.stringify(posts));
}

function getMarketAds() {
  // Gets all marketplace listings.
  // Reads the saved marketplace text from the browser.
  const existing = localStorage.getItem(MARKET_KEY);
  if (existing) {
    try { return JSON.parse(existing); } 
    catch (_error) { localStorage.removeItem(MARKET_KEY); }
  }
  localStorage.setItem(MARKET_KEY, JSON.stringify(INITIAL_MARKET_ADS));
  return [...INITIAL_MARKET_ADS];
}

function saveMarketAds(ads) {
  // Saves all marketplace listings back to the browser.
  localStorage.setItem(MARKET_KEY, JSON.stringify(ads));
}

// ==========================================
// 4. PAGE INITIALIZATION FUNCTIONS
// ==========================================
function initGlobalAuth() {
  // Shows or hides login links based on whether the user is signed in.
  // Gets the current signed-in user.
  const user = getUser();
  // Finds the logout button in the header.
  const logoutBtn = document.getElementById("logoutBtn");
  // Finds the login link in the header.
  const loginLink = document.getElementById("loginLink");
  // Finds the signup link in the header.
  const signupLink = document.getElementById("signupLink");
  // Finds the guest-only message area.
  const guestModePrompt = document.getElementById("guestModePrompt");

  if (document.getElementById("loginForm") || document.getElementById("signupForm")) return; // Skip if on login or signup page

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
  // Handles the login form on the login page.
  // Gets the login form.
  const form = document.getElementById("loginForm");
  if (!form) return;

  // Gets the error message box.
  const errorMessage = document.getElementById("errorMessage");
  // Gets the success message box.
  const successMessage = document.getElementById("successMessage");
  // Gets the mobile number field.
  const mobileInput = document.getElementById("mobileNumber");
  // Gets the password field.
  const passwordInput = document.getElementById("password");

  if (getUser()) {
    window.location.href = "index.html";
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    // Saves the entered mobile number.
    const mobileNumber = mobileInput.value.trim();
    // Saves the entered password.
    const password = passwordInput.value;

    errorMessage.classList.remove("show");
    successMessage.classList.remove("show");

    // Gets all saved accounts.
    const allUsers = getUsers();
    // Finds the matching account.
    const user = allUsers.find(
      (item) => item.mobile_number === mobileNumber && item.password === password
    );

    if (!user) {
      errorMessage.textContent = "Invalid credentials. Check your mobile number and password.";
      errorMessage.classList.add("show");
      return;
    }

    // Stores the signed-in user details for this session.
    const sessionUser = { id: user.id, full_name: user.full_name, mobile_number: user.mobile_number, role: user.role };
    localStorage.setItem(USER_KEY, JSON.stringify(sessionUser));
    
    successMessage.textContent = "Login successful! Redirecting...";
    successMessage.classList.add("show");
    setTimeout(() => { window.location.href = "index.html"; }, 600);
  });
}

function initSignupPage() {
  // Handles the signup form on the signup page.
  // Gets the signup form.
  const form = document.getElementById("signupForm");
  if (!form) return;

  // Gets the error message box.
  const errorMessage = document.getElementById("errorMessage");
  // Gets the success message box.
  const successMessage = document.getElementById("successMessage");
  // Gets the full name field.
  const fullNameInput = document.getElementById("fullName");
  // Gets the mobile number field.
  const mobileInput = document.getElementById("mobileNumber");
  // Gets the password field.
  const passwordInput = document.getElementById("password");
  // Gets the confirm password field.
  const confirmPasswordInput = document.getElementById("confirmPassword");

  if (getUser()) {
    window.location.href = "index.html";
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    // Saves the entered full name.
    const fullName = fullNameInput.value.trim();
    // Saves the entered mobile number.
    const mobileNumber = mobileInput.value.trim();
    // Saves the entered password.
    const password = passwordInput.value;
    // Saves the entered confirmation password.
    const confirmPassword = confirmPasswordInput.value;

    errorMessage.classList.remove("show");
    successMessage.classList.remove("show");

    // Validation
    if (!fullName || !mobileNumber || !password || !confirmPassword) {
      errorMessage.textContent = "Please fill in all fields.";
      errorMessage.classList.add("show");
      return;
    }

    if (password !== confirmPassword) {
      errorMessage.textContent = "Passwords do not match.";
      errorMessage.classList.add("show");
      return;
    }

    if (password.length < 6) {
      errorMessage.textContent = "Password must be at least 6 characters long.";
      errorMessage.classList.add("show");
      return;
    }

    // Check if mobile number already exists
    // Gets all saved accounts.
    const allUsers = getUsers();
    // Checks if the mobile number is already used.
    const existingUser = allUsers.find(u => u.mobile_number === mobileNumber);
    if (existingUser) {
      errorMessage.textContent = "This mobile number is already registered. Please login or use a different number.";
      errorMessage.classList.add("show");
      return;
    }

    // Create new user with max ID + 1, default role is Farmer (admin assigns roles)
    // Finds the next account number.
    const maxId = Math.max(...allUsers.map(u => u.id), 0);
    // Creates the new saved account.
    const newUser = {
      id: maxId + 1,
      mobile_number: mobileNumber,
      password: password,
      full_name: fullName,
      role: "Farmer"
    };

    allUsers.push(newUser);
    saveUsers(allUsers);

    successMessage.textContent = "Account created successfully! Logging you in...";
    successMessage.classList.add("show");
    
    // Auto-login
    // Stores the new user as the current session.
    const sessionUser = { id: newUser.id, full_name: newUser.full_name, mobile_number: newUser.mobile_number, role: newUser.role };
    localStorage.setItem(USER_KEY, JSON.stringify(sessionUser));
    
    setTimeout(() => { window.location.href = "index.html"; }, 1000);
  });
}

function initFeedPage() {
  // Handles the main feed page.
  // Finds the feed container.
  const feedList = document.querySelector(".feed-list");
  // Finds the post composer card.
  const createPostCard = document.getElementById("createPostCard");
  if (!feedList || !createPostCard) return; // Only run on homepage where post creation exists

  // Gets the current user.
  const user = getUser();
  // Finds the avatar in the composer.
  const composerAvatar = document.querySelector(".avatar-owner");
  // Finds the post text box.
  const postTextInput = document.getElementById("postText");
  // Finds the post button.
  const postBtn = document.querySelector(".post-btn");
  // Finds the image picker.
  const postPhotoInput = document.getElementById("postPhoto");
  // Finds the image preview wrapper.
  const postImagePreviewWrap = document.getElementById("postImagePreviewWrap");
  // Finds the image preview itself.
  const postImagePreview = document.getElementById("postImagePreview");
  // Finds the remove-image button.
  const removePostImageBtn = document.getElementById("removePostImage");
  // Keeps track of which post is being edited.
  let editingPostId = null;

  if (composerAvatar && user) {
    composerAvatar.textContent = getInitials(user.full_name);
  }

  // Keeps the chosen image data for the post.
  let selectedImageData = "";

  function clearPreview() {
    // Clears the chosen image.
    selectedImageData = "";
    if (postImagePreview) postImagePreview.src = "";
    if (postImagePreviewWrap) postImagePreviewWrap.hidden = true;
    if (postPhotoInput) postPhotoInput.value = "";
  }

  function resetComposer() {
    // Stops edit mode and resets the composer.
    editingPostId = null;
    if (postBtn) postBtn.textContent = "Post";
    if (postTextInput) postTextInput.value = "";
    clearPreview();
  }

  function beginEditPost(postId) {
    // Loads one post into the composer for editing.
    const posts = getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post || !ownsContent(post.authorId, post.authorName, user)) return;
    editingPostId = postId;
    if (postTextInput) postTextInput.value = post.text_content || "";
    selectedImageData = post.image_url || "";
    if (postImagePreview && selectedImageData) postImagePreview.src = selectedImageData;
    if (postImagePreviewWrap) postImagePreviewWrap.hidden = !selectedImageData;
    if (postBtn) postBtn.textContent = "Update";
    createPostCard.scrollIntoView({ behavior: "smooth", block: "start" });
    postTextInput?.focus();
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
    // Rebuilds the feed cards from saved posts.
    const user = getUser();
    // Gets the posts this user already liked.
    const userLikes = user ? getUserLikes(user.id) : [];
    // Checks whether the current user is an admin.
    const adminUser = user?.role === "Admin";
    // Gets all saved posts.
    const posts = getPosts();
    feedList.innerHTML = posts.map((post, index) => {
      const avatarClass = index % 2 === 0 ? "avatar-a" : "avatar-b";
      const initials = getInitials(post.authorName);
      const imageMarkup = post.image_url ? `<div class="post-photo post-photo-has-image"><img class="post-photo-img" src="${escapeHtml(post.image_url)}" alt="Post image" /></div>` : "";
      const isLiked = userLikes.includes(post.id);
      const canManagePost = ownsContent(post.authorId, post.authorName, user);
      const existingComments = (post.comments || []).map((c, idx) => `
        <div class="comment-item" data-comment-index="${idx}">
          <span class="comment-author">${escapeHtml(c.authorName)}</span>
          <span class="comment-text">${escapeHtml(c.text)}</span>
          <span class="comment-time">${escapeHtml(c.created_at)}</span>
          ${adminUser ? `<button type="button" class="admin-comment-del" data-action="admin-delete-comment" data-post-id="${post.id}" data-comment-index="${idx}" title="Delete comment"><i class="fa-solid fa-xmark"></i></button>` : ""}
        </div>
      `).join("");
      const ownerControls = canManagePost ? `
        <div class="post-owner-actions" style="margin-left:auto; position:relative;">
          <button type="button" class="pill-btn secondary owner-menu-toggle" style="padding:6px 10px; font-size:12px; min-width:40px;" data-action="owner-menu-toggle" data-post-id="${post.id}" aria-label="Post actions"><i class="fa-solid fa-pen"></i></button>
          <div class="owner-menu" style="display:none; position:absolute; right:0; top:42px; z-index:10; min-width:120px; background:#fff; border:1px solid #d9e2f2; border-radius:12px; box-shadow:0 10px 24px rgba(21,44,90,.12); overflow:hidden;">
            <button type="button" class="owner-menu-item" style="width:100%; display:block; padding:10px 14px; border:0; background:#fff; text-align:left;" data-action="edit-post" data-post-id="${post.id}">Edit</button>
            <button type="button" class="owner-menu-item" style="width:100%; display:block; padding:10px 14px; border:0; background:#fff; text-align:left; color:#b91c1c;" data-action="delete-post" data-post-id="${post.id}">Delete</button>
          </div>
        </div>` : "";
      const adminPostBtn = adminUser ? `<button type="button" class="admin-post-del" data-action="admin-delete-post" data-post-id="${post.id}" title="Delete post"><i class="fa-solid fa-trash"></i></button>` : "";

      return `<article class="post-card" data-post-id="${post.id}">
        <div class="post-head">
          <div class="avatar ${avatarClass}">${initials}</div>
          <div class="post-user-meta">
            <p class="post-user">${escapeHtml(post.authorName)}</p>
            <p class="post-time">${escapeHtml(post.created_at)}</p>
          </div>
          ${ownerControls}
          ${adminPostBtn}
        </div>
        <p class="post-text">${escapeHtml(post.text_content || "")}</p>
        ${imageMarkup}
        <div class="post-actions">
          <button type="button" class="like-btn${isLiked ? " liked" : ""}" data-action="like" data-post-id="${post.id}">
            <i class="fa-${isLiked ? "solid" : "regular"} fa-heart"></i> Like <span class="like-count">${Number(post.likesCount) || 0}</span>
          </button>
          <button type="button" data-action="comment" data-post-id="${post.id}">
            <i class="fa-regular fa-comment"></i> Comment <span class="comment-count">${Number(post.commentsCount) || 0}</span>
          </button>
        </div>
        <div class="comment-section" id="comment-section-${post.id}" style="display:none;">
          <div class="comment-list">${existingComments}</div>
          <div class="comment-input-row">
            <div class="avatar avatar-a" style="width:32px;height:32px;font-size:12px;flex-shrink:0;">${user ? getInitials(user.full_name) : "?"}</div>
            <textarea class="comment-textarea" placeholder="Write a comment..." rows="1" data-post-id="${post.id}"></textarea>
            <button type="button" class="comment-submit-btn" data-action="submit-comment" data-post-id="${post.id}">Post</button>
          </div>
        </div>
      </article>`;
    }).join("");
  }

  // Event delegation — attached once, handles all posts
  feedList.addEventListener("click", (e) => {
    const user = getUser();

    const menuToggle = e.target.closest('[data-action="owner-menu-toggle"]');
    if (menuToggle) {
      const actionsWrap = menuToggle.closest(".post-owner-actions");
      const menu = actionsWrap?.querySelector(".owner-menu");
      if (menu) {
        const isOpen = menu.classList.contains("open");
        closeOwnerMenus(feedList);
        menu.classList.toggle("open", !isOpen);
        menu.style.display = !isOpen ? "block" : "none";
      }
      return;
    }

    if (!e.target.closest(".post-owner-actions") && !e.target.closest(".owner-menu")) {
      closeOwnerMenus(feedList);
      feedList.querySelectorAll(".owner-menu").forEach(menu => { menu.style.display = "none"; });
    }

    // Admin: delete post
    const adminDelPost = e.target.closest('[data-action="admin-delete-post"]');
    if (adminDelPost) {
      if (!confirm("Delete this post permanently?")) return;
      const postId = Number(adminDelPost.dataset.postId);
      savePosts(getPosts().filter(p => p.id !== postId));
      adminDelPost.closest("article")?.remove();
      return;
    }

    const editPostBtn = e.target.closest('[data-action="edit-post"]');
    if (editPostBtn) {
      beginEditPost(Number(editPostBtn.dataset.postId));
      closeOwnerMenus(feedList);
      feedList.querySelectorAll(".owner-menu").forEach(menu => { menu.style.display = "none"; });
      return;
    }

    const deletePostBtn = e.target.closest('[data-action="delete-post"]');
    if (deletePostBtn) {
      if (!confirm("Delete your post permanently?")) return;
      const postId = Number(deletePostBtn.dataset.postId);
      const posts = getPosts().filter(p => p.id !== postId);
      savePosts(posts);
      resetComposer();
      closeOwnerMenus(feedList);
      feedList.querySelectorAll(".owner-menu").forEach(menu => { menu.style.display = "none"; });
      renderFeedPosts();
      return;
    }

    // Admin: delete comment
    const adminDelComment = e.target.closest('[data-action="admin-delete-comment"]');
    if (adminDelComment) {
      if (!confirm("Delete this comment?")) return;
      const postId = Number(adminDelComment.dataset.postId);
      const commentIdx = Number(adminDelComment.dataset.commentIndex);
      const posts = getPosts();
      const post = posts.find(p => p.id === postId);
      if (post?.comments) {
        post.comments.splice(commentIdx, 1);
        post.commentsCount = Math.max(0, (post.commentsCount || 0) - 1);
        savePosts(posts);
        adminDelComment.closest(".comment-item")?.remove();
        const article = feedList.querySelector(`[data-post-id="${postId}"]`);
        const countEl = article?.querySelector(".comment-count");
        if (countEl) countEl.textContent = post.commentsCount;
      }
      return;
    }

    // Like
    const likeBtn = e.target.closest('[data-action="like"]');
    if (likeBtn) {
      if (!user) { window.location.href = "login.html"; return; }
      const postId = Number(likeBtn.dataset.postId);
      const isNowLiked = toggleUserLike(user.id, postId);
      const posts = getPosts();
      const post = posts.find(p => p.id === postId);
      if (post) {
        post.likesCount = (Number(post.likesCount) || 0) + (isNowLiked ? 1 : -1);
        savePosts(posts);
      }
      // Update DOM without full re-render
      likeBtn.classList.toggle("liked", isNowLiked);
      const icon = likeBtn.querySelector("i");
      if (icon) { icon.className = isNowLiked ? "fa-solid fa-heart" : "fa-regular fa-heart"; }
      const countEl = likeBtn.querySelector(".like-count");
      if (countEl && post) countEl.textContent = Number(post.likesCount) || 0;
      return;
    }

    // Toggle comment section
    const commentBtn = e.target.closest('[data-action="comment"]');
    if (commentBtn) {
      const postId = commentBtn.dataset.postId;
      const section = document.getElementById(`comment-section-${postId}`);
      if (section) {
        const isVisible = section.style.display !== "none";
        section.style.display = isVisible ? "none" : "block";
        if (!isVisible) section.querySelector(".comment-textarea")?.focus();
      }
      return;
    }

    // Submit comment
    const submitBtn = e.target.closest('[data-action="submit-comment"]');
    if (submitBtn) {
      if (!user) { window.location.href = "login.html"; return; }
      const postId = Number(submitBtn.dataset.postId);
      const section = document.getElementById(`comment-section-${postId}`);
      const textarea = section?.querySelector(".comment-textarea");
      const text = textarea?.value.trim();
      if (!text) return;

      const posts = getPosts();
      const post = posts.find(p => p.id === postId);
      if (post) {
        if (!post.comments) post.comments = [];
        post.comments.push({ authorName: user.full_name, text, created_at: "Just now" });
        post.commentsCount = (Number(post.commentsCount) || 0) + 1;
        savePosts(posts);
        // Update comment count in button
        const article = feedList.querySelector(`[data-post-id="${postId}"]`);
        const countEl = article?.querySelector(".comment-count");
        if (countEl) countEl.textContent = post.commentsCount;
        // Append comment to list
        const commentList = section.querySelector(".comment-list");
        const newComment = document.createElement("div");
        newComment.className = "comment-item";
        newComment.innerHTML = `<span class="comment-author">${escapeHtml(user.full_name)}</span><span class="comment-text">${escapeHtml(text)}</span><span class="comment-time">Just now</span>`;
        commentList.appendChild(newComment);
        textarea.value = "";
        textarea.style.height = "auto";
      }
      return;
    }
  });

  if (postBtn) {
    postBtn.addEventListener("click", () => {
      const text = String(postTextInput?.value || "").trim();
      if (!text && !selectedImageData) return;

      const posts = getPosts();

      if (editingPostId) {
        const post = posts.find(p => p.id === editingPostId);
        if (!post || !ownsContent(post.authorId, post.authorName, user)) {
          alert("You can only edit your own post.");
          resetComposer();
          return;
        }

        post.text_content = text;
        post.image_url = selectedImageData || "";
        savePosts(posts);
        resetComposer();
        renderFeedPosts();
        return;
      }

      const newPost = {
        id: Date.now(),
        authorId: user.id,
        authorName: user.full_name,
        created_at: "Just now",
        text_content: text,
        image_url: selectedImageData,
        likesCount: 0,
        commentsCount: 0,
      };

      posts.unshift(newPost);
      savePosts(posts);

      resetComposer();
      renderFeedPosts();
    });
  }

  renderFeedPosts();
}

function initMarketplacePage() {
  // Handles the marketplace page.
  // Finds the marketplace grid.
  const marketGrid = document.querySelector(".market-grid");
  // Finds the marketplace submit button.
  const marketSubmitBtn = document.querySelector(".marketplace-form .submit-btn");
  // Finds the marketplace clear button.
  const marketClearBtn = document.querySelector(".marketplace-form .cancel-btn");
  // Finds the image picker for listings.
  const adImageInput = document.getElementById("adImage");
  // Finds the image preview wrapper for listings.
  const adImagePreview = document.getElementById("adImagePreview");
  // Finds the image preview image element.
  const adImagePreviewImg = document.getElementById("adImagePreviewImg");
  // Finds the remove-image button for listings.
  const removeAdImageBtn = document.getElementById("removeAdImage");
  // Finds the card that holds the posting form.
  const sellerPostingCard = document.querySelector(".seller-posting-card");

  if (!marketGrid) return;

  // Gets the current user.
  const user = getUser();
  // Checks whether this user can post listings.
  const isSeller = user && user.role === "General Vendor";
  // Stores which listing is being edited.
  let editingAdId = null;

  // Show/hide posting form based on seller status
  if (sellerPostingCard) {
    if (!isSeller) {
      sellerPostingCard.style.display = "none";
    } else {
      sellerPostingCard.style.display = "block";
    }
  }

  // Stores the chosen listing image.
  let selectedAdImage = null;

  // Image preview handling
  if (adImageInput) {
    adImageInput.addEventListener("change", () => {
      // Gets the chosen image file.
      const file = adImageInput.files[0];
      if (!file) return;
      // Reads the file so it can be shown as a preview.
      const reader = new FileReader();
      reader.onload = (e) => {
        // Saves the preview image data.
        selectedAdImage = e.target.result;
        if (adImagePreviewImg) adImagePreviewImg.src = selectedAdImage;
        if (adImagePreview) adImagePreview.style.display = "block";
      };
      reader.readAsDataURL(file);
    });
  }

  if (removeAdImageBtn) {
    removeAdImageBtn.addEventListener("click", () => {
      selectedAdImage = null;
      if (adImageInput) adImageInput.value = "";
      if (adImagePreview) adImagePreview.style.display = "none";
      if (adImagePreviewImg) adImagePreviewImg.src = "";
    });
  }

  // Contact modal — injected once, reused
  // Creates the contact popup box.
  const modal = document.createElement("div");
  modal.id = "contactModal";
  modal.innerHTML = `
    <div class="contact-modal-overlay" id="contactModalOverlay">
      <div class="contact-modal-box">
        <button class="contact-modal-close" id="contactModalClose"><i class="fa-solid fa-xmark"></i></button>
        <div class="contact-modal-icon"><i class="fa-solid fa-phone"></i></div>
        <h3 class="contact-modal-title">Contact Seller</h3>
        <p class="contact-modal-seller" id="contactModalSeller"></p>
        <a class="contact-modal-phone" id="contactModalPhone" href="#"></a>
        <p class="contact-modal-note">This is a demo — tap the number to call</p>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  function closeModal() {
    document.getElementById("contactModalOverlay").style.display = "none";
  }
  function openModal(vendorName, vendorPhone) {
    // Fills the popup with seller details.
    document.getElementById("contactModalSeller").textContent = vendorName;
    // Finds the phone link inside the popup.
    const phoneEl = document.getElementById("contactModalPhone");
    phoneEl.textContent = vendorPhone;
    phoneEl.href = `tel:${vendorPhone}`;
    document.getElementById("contactModalOverlay").style.display = "flex";
  }

  document.getElementById("contactModalClose").addEventListener("click", closeModal);
  document.getElementById("contactModalOverlay").addEventListener("click", (e) => {
    if (e.target === document.getElementById("contactModalOverlay")) closeModal();
  });

  function renderAds() {
    // Rebuilds the marketplace cards from saved listings.
    const ads = getMarketAds();

    if (ads.length === 0) {
      marketGrid.innerHTML = `<p style="text-align:center; width:100%; color: #4a5568;">No products available right now.</p>`;
      return;
    }

    marketGrid.innerHTML = ads.map(ad => {
      // Uses the listing image if one exists.
      const imageMarkup = ad.image_url
        ? `<img src="${escapeHtml(ad.image_url)}" alt="${escapeHtml(ad.product_title)}" class="market-card-img" />`
        : "";
      // Checks whether the current user owns this listing.
      const canManageAd = ownsContent(ad.vendorId, ad.vendorName, user);
      // Builds the owner pen menu for edit/delete.
      const ownerButtons = canManageAd ? `
            <div style="position:relative; margin-left:8px;">
              <button class="submit-btn" style="padding: 8px 12px; font-size: 14px; min-width: 44px;" data-action="owner-menu-toggle-ad" data-ad-id="${ad.id}" aria-label="Listing actions"><i class="fa-solid fa-pen"></i></button>
              <div class="owner-menu" style="display:none; position:absolute; right:0; top:46px; z-index:10; min-width:120px; background:#fff; border:1px solid #d9e2f2; border-radius:12px; box-shadow:0 10px 24px rgba(21,44,90,.12); overflow:hidden;">
                <button type="button" class="owner-menu-item" style="width:100%; display:block; padding:10px 14px; border:0; background:#fff; text-align:left;" data-action="edit-ad" data-ad-id="${ad.id}">Edit</button>
                <button type="button" class="owner-menu-item" style="width:100%; display:block; padding:10px 14px; border:0; background:#fff; text-align:left; color:#b91c1c;" data-action="delete-ad" data-ad-id="${ad.id}">Delete</button>
              </div>
            </div>` : "";
      return `
        <article class="news-card" style="margin-bottom: 20px;">
          ${imageMarkup}
          <div class="news-card-header" style="background: #f8fafc; color: #2c3e50;">
            <h3 class="news-card-title" style="margin:0;">${escapeHtml(ad.product_title)}</h3>
            <span class="news-category-badge">${escapeHtml(ad.category)}</span>
          </div>
          <div class="news-card-body">
            <h2 style="color: #354cce; margin: 0 0 10px 0;">৳${ad.price}</h2>
            <p class="news-card-excerpt">${escapeHtml(ad.description)}</p>
            <p style="font-size: 13px; color: #4a5568;">
              <strong>Quantity:</strong> ${ad.quantity} ${escapeHtml(ad.unit)} <br>
              <strong>Location:</strong> <i class="fa-solid fa-location-dot"></i> ${escapeHtml(ad.location)}
            </p>
            <div class="news-card-footer">
              <span class="news-source"><i class="fa-solid fa-shop"></i> ${escapeHtml(ad.vendorName)}</span>
              <button class="submit-btn" style="padding: 8px 16px; font-size: 14px;"
                data-action="contact" data-ad-id="${ad.id}">Contact Seller</button>
              ${ownerButtons}
            </div>
          </div>
        </article>`;
    }).join("");
  }

  // Event delegation for contact button
  marketGrid.addEventListener("click", (e) => {
    // Opens the owner menu when the pen is clicked.
    const menuToggle = e.target.closest('[data-action="owner-menu-toggle-ad"]');
    if (menuToggle) {
      const wrap = menuToggle.closest("div[style*='position:relative']");
      const menu = wrap?.querySelector(".owner-menu");
      if (menu) {
        const isOpen = menu.classList.contains("open");
        closeOwnerMenus(marketGrid);
        menu.classList.toggle("open", !isOpen);
        menu.style.display = !isOpen ? "block" : "none";
      }
      return;
    }

    if (!e.target.closest(".owner-menu") && !e.target.closest('[data-action="owner-menu-toggle-ad"]')) {
      closeOwnerMenus(marketGrid);
      marketGrid.querySelectorAll(".owner-menu").forEach(menu => { menu.style.display = "none"; });
    }

    const editBtn = e.target.closest('[data-action="edit-ad"]');
    if (editBtn) {
      beginEditAd(Number(editBtn.dataset.adId));
      closeOwnerMenus(marketGrid);
      marketGrid.querySelectorAll(".owner-menu").forEach(menu => { menu.style.display = "none"; });
      return;
    }

    const deleteBtn = e.target.closest('[data-action="delete-ad"]');
    if (deleteBtn) {
      if (!confirm("Delete your listing permanently?")) return;
      const adId = Number(deleteBtn.dataset.adId);
      saveMarketAds(getMarketAds().filter(item => item.id !== adId));
      if (editingAdId === adId) clearMarketForm();
      closeOwnerMenus(marketGrid);
      marketGrid.querySelectorAll(".owner-menu").forEach(menu => { menu.style.display = "none"; });
      renderAds();
      return;
    }

    // Opens the seller contact popup.
    const contactBtn = e.target.closest('[data-action="contact"]');
    if (!contactBtn) return;
    const adId = Number(contactBtn.dataset.adId);
    const ads = getMarketAds();
    const ad = ads.find(a => a.id === adId);
    if (ad) openModal(ad.vendorName, ad.vendorPhone || "Not provided");
  });

  function beginEditAd(adId) {
    // Loads one listing into the form so it can be edited.
    const ad = getMarketAds().find(item => item.id === adId);
    if (!ad || !ownsContent(ad.vendorId, ad.vendorName, user)) return;
    editingAdId = adId;
    document.getElementById("adTitle").value = ad.product_title || "";
    document.getElementById("adDescription").value = ad.description || "";
    document.getElementById("adPrice").value = ad.price || "";
    document.getElementById("adQuantity").value = ad.quantity || "";
    document.getElementById("adUnit").value = ad.unit || "";
    document.getElementById("adCategory").value = ad.category || "";
    document.getElementById("adLocation").value = ad.location || "";
    selectedAdImage = ad.image_url || null;
    if (adImagePreviewImg && selectedAdImage) adImagePreviewImg.src = selectedAdImage;
    if (adImagePreview) adImagePreview.style.display = selectedAdImage ? "block" : "none";
    if (marketSubmitBtn) marketSubmitBtn.textContent = "Update Product";
    document.querySelector(".marketplace-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function clearMarketForm() {
    // Resets the listing form back to empty.
    document.querySelectorAll('.marketplace-form input, .marketplace-form textarea, .marketplace-form select').forEach(el => el.value = '');
    selectedAdImage = null;
    editingAdId = null;
    if (adImagePreview) adImagePreview.style.display = "none";
    if (adImagePreviewImg) adImagePreviewImg.src = "";
    if (marketSubmitBtn) marketSubmitBtn.textContent = "Post Product";
  }

  if (marketClearBtn) {
    marketClearBtn.addEventListener("click", clearMarketForm);
  }

  if (marketSubmitBtn) {
    marketSubmitBtn.addEventListener("click", (e) => {
      e.preventDefault();

      // Stops the action if nobody is signed in.
      if (!user) {
        alert("You must be logged in to post a product.");
        window.location.href = "login.html";
        return;
      }

      // Stops the action if this user is not a vendor.
      if (!isSeller) {
        alert("Only sellers (vendors) can post products. Please create a vendor account to post.");
        return;
      }

      // Gets the product title.
      const title = document.getElementById("adTitle").value;
      // Gets the product description.
      const desc = document.getElementById("adDescription").value;
      // Gets the product price.
      const price = document.getElementById("adPrice").value;
      // Gets the product quantity.
      const quantity = document.getElementById("adQuantity").value;
      // Gets the product unit.
      const unit = document.getElementById("adUnit").value;
      // Gets the product category.
      const category = document.getElementById("adCategory").value;
      // Gets the product location.
      const location = document.getElementById("adLocation").value;

      if (!title || !price || !category || !location) {
        alert("Please fill in the required fields (Title, Price, Category, Location).");
        return;
      }

      // Gets all saved listings.
      const ads = getMarketAds();

      if (editingAdId) {
        // Finds the listing being edited.
        const ad = ads.find(item => item.id === editingAdId);
        if (!ad || !ownsContent(ad.vendorId, ad.vendorName, user)) {
          alert("You can only edit your own listing.");
          clearMarketForm();
          return;
        }

        ad.vendorId = user.id;
        ad.vendorName = user.full_name;
        ad.vendorPhone = user.mobile_number;
        ad.product_title = title;
        ad.description = desc;
        ad.price = Number(price);
        ad.category = category;
        ad.location = location;
        ad.quantity = Number(quantity) || 0;
        ad.unit = unit || "unit";
        ad.image_url = selectedAdImage || null;
        saveMarketAds(ads);
        alert("Product updated successfully!");
      } else {
        // Creates the new listing to save.
        const newAd = {
          id: Date.now(),
          vendorId: user.id,
          vendorName: user.full_name,
          vendorPhone: user.mobile_number,
          product_title: title,
          description: desc,
          price: Number(price),
          category: category,
          location: location,
          quantity: Number(quantity) || 0,
          unit: unit || "unit",
          image_url: selectedAdImage || null
        };

        ads.unshift(newAd);
        saveMarketAds(ads);
        alert("Product posted successfully!");
      }

      clearMarketForm();
      renderAds();
    });
  }

  renderAds();
}

function renderAdminPanel(panel) {
  // Builds the admin tools area.
  panel.style.display = "block";
  // Lists the roles an admin can assign.
  const ROLES = ["Farmer", "Verified Expert", "General Vendor", "Admin"];

  panel.innerHTML = `
    <div class="admin-panel">
      <h2 class="admin-panel-title"><i class="fa-solid fa-shield-halved"></i> Admin Tools</h2>
      <div class="admin-tabs">
        <button class="admin-tab active" data-tab="posts">Posts</button>
        <button class="admin-tab" data-tab="market">Marketplace</button>
        <button class="admin-tab" data-tab="users">Users &amp; Roles</button>
      </div>
      <div id="adminTabContent" class="admin-tab-content"></div>
    </div>
  `;

  function renderTab(tab) {
    // Gets the admin tab content area.
    const content = document.getElementById("adminTabContent");

    if (tab === "posts") {
      // Gets all feed posts for admin review.
      const posts = getPosts();
      if (posts.length === 0) { content.innerHTML = `<p class="admin-empty">No posts yet.</p>`; return; }
      content.innerHTML = posts.map(p => `
        <div class="admin-list-item" data-post-id="${p.id}">
          <div class="admin-item-info">
            <span class="admin-item-author">${escapeHtml(p.authorName)}</span>
            <span class="admin-item-preview">${escapeHtml((p.text_content || "").slice(0, 70))}${(p.text_content || "").length > 70 ? "…" : ""}</span>
            ${(p.comments || []).length > 0 ? `<div class="admin-comment-sublist">${(p.comments || []).map((c, idx) => `
              <div class="admin-comment-row">
                <span class="admin-comment-who">${escapeHtml(c.authorName)}:</span>
                <span class="admin-comment-body">${escapeHtml((c.text || "").slice(0, 50))}${(c.text || "").length > 50 ? "…" : ""}</span>
                <button class="admin-del-sm" data-action="panel-del-comment" data-post-id="${p.id}" data-comment-index="${idx}" title="Delete comment"><i class="fa-solid fa-xmark"></i></button>
              </div>`).join("")}</div>` : ""}
          </div>
          <button class="admin-del-btn" data-action="panel-del-post" data-post-id="${p.id}"><i class="fa-solid fa-trash"></i> Delete</button>
        </div>
      `).join("");

    } else if (tab === "market") {
      // Gets all marketplace listings for admin review.
      const ads = getMarketAds();
      if (ads.length === 0) { content.innerHTML = `<p class="admin-empty">No listings yet.</p>`; return; }
      content.innerHTML = ads.map(a => `
        <div class="admin-list-item" data-ad-id="${a.id}">
          <div class="admin-item-info">
            <span class="admin-item-author">${escapeHtml(a.vendorName)}</span>
            <span class="admin-item-preview">${escapeHtml(a.product_title)} &mdash; ৳${a.price}</span>
          </div>
          <button class="admin-del-btn" data-action="panel-del-ad" data-ad-id="${a.id}"><i class="fa-solid fa-trash"></i> Delete</button>
        </div>
      `).join("");

    } else if (tab === "users") {
      // Gets all saved accounts for role editing.
      const users = getUsers();
      content.innerHTML = users.map(u => `
        <div class="admin-list-item">
          <div class="admin-item-info">
            <span class="admin-item-author">${escapeHtml(u.full_name)}</span>
            <span class="admin-item-preview">${escapeHtml(u.mobile_number)}</span>
          </div>
          <select class="admin-role-select" data-user-id="${u.id}">
            ${ROLES.map(r => `<option value="${r}"${u.role === r ? " selected" : ""}>${r}</option>`).join("")}
          </select>
          <button class="admin-save-btn" data-action="panel-save-role" data-user-id="${u.id}">Save</button>
        </div>
      `).join("");
    }

    // Bind actions inside tab
    content.addEventListener("click", (e) => {
      // Finds the clicked admin action button.
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      const action = btn.dataset.action;

      if (action === "panel-del-post") {
        if (!confirm("Delete this post permanently?")) return;
        savePosts(getPosts().filter(p => p.id !== Number(btn.dataset.postId)));
        renderTab("posts");
      }
      if (action === "panel-del-comment") {
        if (!confirm("Delete this comment?")) return;
        const postId = Number(btn.dataset.postId);
        const idx = Number(btn.dataset.commentIndex);
        const posts = getPosts();
        const post = posts.find(p => p.id === postId);
        if (post?.comments) {
          post.comments.splice(idx, 1);
          post.commentsCount = Math.max(0, (post.commentsCount || 0) - 1);
          savePosts(posts);
        }
        renderTab("posts");
      }
      if (action === "panel-del-ad") {
        if (!confirm("Delete this listing permanently?")) return;
        saveMarketAds(getMarketAds().filter(a => a.id !== Number(btn.dataset.adId)));
        renderTab("market");
      }
      if (action === "panel-save-role") {
        // Gets the user being edited.
        const userId = Number(btn.dataset.userId);
        // Finds the role dropdown for that user.
        const select = content.querySelector(`.admin-role-select[data-user-id="${userId}"]`);
        // Reads the new role from the dropdown.
        const newRole = select?.value;
        if (!newRole) return;
        // Gets all accounts so the selected one can be updated.
        const users = getUsers();
        // Finds the matching account.
        const target = users.find(u => u.id === userId);
        if (target) {
          target.role = newRole;
          saveUsers(users);
          // Update session if admin changed their own role
          // Refreshes the current session if the admin changed their own role.
          const currentUser = JSON.parse(localStorage.getItem(USER_KEY) || "null");
          if (currentUser?.id === userId) {
            localStorage.setItem(USER_KEY, JSON.stringify({ ...currentUser, role: newRole }));
          }
        }
        btn.textContent = "Saved!";
        btn.disabled = true;
        setTimeout(() => { btn.textContent = "Save"; btn.disabled = false; }, 1500);
      }
    });
  }

  renderTab("posts");

  panel.querySelectorAll(".admin-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      panel.querySelectorAll(".admin-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      renderTab(tab.dataset.tab);
    });
  });
}

// ==========================================
// 5. EXECUTION SEQUENCE
// ==========================================
initGlobalAuth();
initLoginPage();
initSignupPage();
initFeedPage();
initMarketplacePage();
initProfilePage();
attachDisabledNavHandlers();
function initProfilePage() {
  // Handles the profile page.
  // Finds the profile card area.
  const profileCard = document.getElementById("profileCard");
  // Finds the profile action area.
  const profileActions = document.getElementById("profileActions");
  // Finds the logout wrapper.
  const profileLogoutWrap = document.getElementById("profileLogoutWrap");
  // Finds the logout button.
  const profileLogoutBtn = document.getElementById("profileLogoutBtn");
  // Finds the user's post list.
  const profilePostsList = document.getElementById("profilePosts");
  // Finds the admin panel area.
  const adminToolsPanel = document.getElementById("adminToolsPanel");

  if (!profileCard) return; // Exit if not on profile page

  // Gets the signed-in user.
  const user = getUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // 1. Render Profile Card
  // Builds the user's avatar initials.
  const initials = getInitials(user.full_name);
  // Gets all saved posts.
  const allPosts = getPosts();
  // Keeps only the posts owned by this user.
  const userPosts = allPosts.filter(p => ownsContent(p.authorId, p.authorName, user));
  
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
    profileActions.innerHTML = "";
  }

  // 3. Render User's Own Posts
  // Gets the posts this user has liked.
  const userLikes = getUserLikes(user.id);
  if (userPosts.length === 0) {
    profilePostsList.innerHTML = `<p style="text-align:center; color: #718096; padding: 20px;">You haven't posted anything yet.</p>`;
  } else {
    profilePostsList.innerHTML = userPosts.map((post, index) => {
      // Picks one of two avatar styles.
      const avatarClass = index % 2 === 0 ? "avatar-a" : "avatar-b";
      // Shows the image if this post has one.
      const imageMarkup = post.image_url ? `<div class="post-photo post-photo-has-image"><img class="post-photo-img" src="${escapeHtml(post.image_url)}" alt="Post image" /></div>` : "";
      // Checks whether the user already liked this post.
      const isLiked = userLikes.includes(post.id);
      // Checks whether this user can edit or delete this post.
      const canManagePost = ownsContent(post.authorId, post.authorName, user);
      // Builds the comment list shown under the post.
      const existingComments = (post.comments || []).map(c => `
        <div class="comment-item">
          <span class="comment-author">${escapeHtml(c.authorName)}</span>
          <span class="comment-text">${escapeHtml(c.text)}</span>
          <span class="comment-time">${escapeHtml(c.created_at)}</span>
        </div>
      `).join("");
      // Builds the owner pen menu for the post.
      const ownerButtons = canManagePost ? `
          <button type="button" class="pill-btn secondary" style="padding:6px 12px; font-size:12px;" data-action="edit-post" data-post-id="${post.id}">Edit</button>
          <button type="button" class="pill-btn secondary" style="padding:6px 12px; font-size:12px;" data-action="delete-post" data-post-id="${post.id}">Delete</button>` : "";

      return `<article class="post-card" data-post-id="${post.id}">
        <div class="post-head">
          <div class="avatar ${avatarClass}">${initials}</div>
          <div class="post-user-meta">
            <p class="post-user">${escapeHtml(post.authorName)}</p>
            <p class="post-time">${escapeHtml(post.created_at)}</p>
          </div>
          <div style="display:flex; gap:8px; margin-left:auto; flex-wrap:wrap; justify-content:flex-end;">${ownerButtons}</div>
        </div>
        <p class="post-text">${escapeHtml(post.text_content || "")}</p>
        ${imageMarkup}
        <div class="post-actions">
          <button type="button" class="like-btn${isLiked ? " liked" : ""}" data-action="like" data-post-id="${post.id}">
            <i class="fa-${isLiked ? "solid" : "regular"} fa-heart"></i> Like <span class="like-count">${Number(post.likesCount) || 0}</span>
          </button>
          <button type="button" data-action="comment" data-post-id="${post.id}">
            <i class="fa-regular fa-comment"></i> Comment <span class="comment-count">${Number(post.commentsCount) || 0}</span>
          </button>
        </div>
        <div class="comment-section" id="comment-section-${post.id}" style="display:none;">
          <div class="comment-list">${existingComments}</div>
          <div class="comment-input-row">
            <div class="avatar avatar-a" style="width:32px;height:32px;font-size:12px;flex-shrink:0;">${getInitials(user.full_name)}</div>
            <textarea class="comment-textarea" placeholder="Write a comment..." rows="1" data-post-id="${post.id}"></textarea>
            <button type="button" class="comment-submit-btn" data-action="submit-comment" data-post-id="${post.id}">Post</button>
          </div>
        </div>
      </article>`;
    }).join("");
  }

  // Event delegation on profile posts list
  if (profilePostsList) {
    profilePostsList.addEventListener("click", (e) => {
      // Checks for a like button click.
      const likeBtn = e.target.closest('[data-action="like"]');
      if (likeBtn) {
        // Reads the post id from the clicked heart button.
        const postId = Number(likeBtn.dataset.postId);
        // Flips the like on or off for this user.
        const isNowLiked = toggleUserLike(user.id, postId);
        // Gets the latest saved posts.
        const posts = getPosts();
        // Finds the exact post that should change.
        const post = posts.find(p => p.id === postId);
        if (post) {
          // Adds or removes one like.
          post.likesCount = (Number(post.likesCount) || 0) + (isNowLiked ? 1 : -1);
          savePosts(posts);
        }
        likeBtn.classList.toggle("liked", isNowLiked);
        const icon = likeBtn.querySelector("i");
        if (icon) icon.className = isNowLiked ? "fa-solid fa-heart" : "fa-regular fa-heart";
        const countEl = likeBtn.querySelector(".like-count");
        if (countEl && post) countEl.textContent = Number(post.likesCount) || 0;
        return;
      }

      // Checks for a comment button click.
      const commentBtn = e.target.closest('[data-action="comment"]');
      if (commentBtn) {
        // Reads the post id from the button.
        const postId = commentBtn.dataset.postId;
        // Finds the comment box for that post.
        const section = document.getElementById(`comment-section-${postId}`);
        if (section) {
          // Checks if the comment box is already open.
          const isVisible = section.style.display !== "none";
          section.style.display = isVisible ? "none" : "block";
          if (!isVisible) section.querySelector(".comment-textarea")?.focus();
        }
        return;
      }

      // Starts editing the clicked post.
      const editPostBtn = e.target.closest('[data-action="edit-post"]');
      if (editPostBtn) {
        // Reads the post id from the menu item.
        const postId = Number(editPostBtn.dataset.postId);
        // Gets the current saved posts.
        const posts = getPosts();
        // Finds the exact post to edit.
        const post = posts.find(p => p.id === postId);
        if (!post || !ownsContent(post.authorId, post.authorName, user)) return;
        // Puts the old text back into the post box.
        postTextInput.value = post.text_content || "";
        // Puts the old image back into the preview.
        selectedImageData = post.image_url || "";
        if (postImagePreview && selectedImageData) postImagePreview.src = selectedImageData;
        if (postImagePreviewWrap) postImagePreviewWrap.hidden = !selectedImageData;
        if (postBtn) postBtn.textContent = "Update";
        postTextInput.focus();
        return;
      }

      // Deletes the clicked post.
      const deletePostBtn = e.target.closest('[data-action="delete-post"]');
      if (deletePostBtn) {
        // Stops the delete if the user says no.
        if (!confirm("Delete your post permanently?")) return;
        // Reads the post id from the menu item.
        const postId = Number(deletePostBtn.dataset.postId);
        // Removes that post from the saved list.
        savePosts(getPosts().filter(p => p.id !== postId));
        renderFeedPosts();
        return;
      }

      // Saves a new comment under the post.
      const submitBtn = e.target.closest('[data-action="submit-comment"]');
      if (submitBtn) {
        // Reads the post id from the submit button.
        const postId = Number(submitBtn.dataset.postId);
        // Finds the comment box for that post.
        const section = document.getElementById(`comment-section-${postId}`);
        // Finds the text box where the user typed.
        const textarea = section?.querySelector(".comment-textarea");
        // Gets the text the user typed.
        const text = textarea?.value.trim();
        if (!text) return;
        // Gets the saved posts list.
        const posts = getPosts();
        // Finds the post that should receive the comment.
        const post = posts.find(p => p.id === postId);
        if (post) {
          if (!post.comments) post.comments = [];
          // Adds the new comment to the list.
          post.comments.push({ authorName: user.full_name, text, created_at: "Just now" });
          // Increases the comment count by one.
          post.commentsCount = (Number(post.commentsCount) || 0) + 1;
          savePosts(posts);
          const article = profilePostsList.querySelector(`[data-post-id="${postId}"]`);
          const countEl = article?.querySelector(".comment-count");
          if (countEl) countEl.textContent = post.commentsCount;
          // Adds the comment to the visible list right away.
          const commentList = section.querySelector(".comment-list");
          const newComment = document.createElement("div");
          newComment.className = "comment-item";
          newComment.innerHTML = `<span class="comment-author">${escapeHtml(user.full_name)}</span><span class="comment-text">${escapeHtml(text)}</span><span class="comment-time">Just now</span>`;
          commentList.appendChild(newComment);
          textarea.value = "";
        }
      }
    });
  }

  // 4. Handle Admin Tools
  if (user.role === "Admin" && adminToolsPanel) {
    renderAdminPanel(adminToolsPanel);
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