const DEMO_USERS = [
  {
    id: 1,
    mobile_number: "01700000001",
    password: "password123",
    full_name: "Rahim Uddin",
    role: "Farmer",
  },
  {
    id: 2,
    mobile_number: "01700000002",
    password: "expert123",
    full_name: "Dr. Nusrat Rahman",
    role: "Verified Expert",
  },
  {
    id: 3,
    mobile_number: "01700000003",
    password: "seller123",
    full_name: "Hasan Traders",
    role: "General Vendor",
  },
  {
    id: 4,
    mobile_number: "01700000004",
    password: "admin123",
    full_name: "System Admin",
    role: "Admin",
  },
];

const FEED_KEY = "kk_demo_feed_posts";
const USER_KEY = "kk_demo_user";
const MARKETPLACE_KEY = "kk_demo_market_items";

const INITIAL_POSTS = [
  {
    id: 101,
    authorName: "Rahim Uddin",
    created_at: "2 hours ago",
    text_content: "Planted winter tomato seeds today. Weather looks stable for the next week.",
    image_url: "",
    likesCount: 6,
    commentsCount: 2,
  },
  {
    id: 102,
    authorName: "Dr. Nusrat Rahman",
    created_at: "5 hours ago",
    text_content: "Keep irrigation light after transplanting. Too much water now can stress roots.",
    image_url: "",
    likesCount: 14,
    commentsCount: 5,
  },
  {
    id: 103,
    authorName: "Hasan Traders",
    created_at: "1 day ago",
    text_content: "New organic compost stock arrived. Delivery available in Gazipur and Dhaka.",
    image_url: "",
    likesCount: 9,
    commentsCount: 3,
  },
];

const INITIAL_MARKET_ITEMS = [
  {
    id: 201,
    title: "Hybrid Tomato Seeds (1kg)",
    category: "Seeds",
    location: "Gazipur",
    price: 950,
    sellerName: "Green Valley Agro",
    phone: "01712000111",
    rating: 4.7,
    verified: true,
  },
  {
    id: 202,
    title: "Organic Vermicompost (50kg)",
    category: "Fertilizer",
    location: "Dhaka",
    price: 1200,
    sellerName: "Hasan Traders",
    phone: "01713000222",
    rating: 4.5,
    verified: true,
  },
  {
    id: 203,
    title: "Portable Water Pump 2HP",
    category: "Machinery",
    location: "Rajshahi",
    price: 8500,
    sellerName: "Rafiq Machinery House",
    phone: "01714000333",
    rating: 4.3,
    verified: false,
  },
  {
    id: 204,
    title: "Hand Sprayer 16L",
    category: "Tools",
    location: "Khulna",
    price: 1450,
    sellerName: "Agro Solution BD",
    phone: "01715000444",
    rating: 4.2,
    verified: false,
  },
  {
    id: 205,
    title: "Dairy Cow (Healthy, 2 years)",
    category: "Livestock",
    location: "Mymensingh",
    price: 78000,
    sellerName: "Rural Livestock Center",
    phone: "01716000555",
    rating: 4.8,
    verified: true,
  },
  {
    id: 206,
    title: "Urea Fertilizer (40kg Bag)",
    category: "Fertilizer",
    location: "Gazipur",
    price: 1100,
    sellerName: "Farm Input Point",
    phone: "01717000666",
    rating: 4.4,
    verified: false,
  },
];

function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (_error) {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

function getInitials(name) {
  const safeName = String(name || "Anonymous").trim();
  const parts = safeName.split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] || "A") + (parts[1]?.[0] || "K");
}

function getPosts() {
  const existing = localStorage.getItem(FEED_KEY);
  if (existing) {
    try {
      return JSON.parse(existing);
    } catch (_error) {
      localStorage.removeItem(FEED_KEY);
    }
  }

  localStorage.setItem(FEED_KEY, JSON.stringify(INITIAL_POSTS));
  return [...INITIAL_POSTS];
}

function savePosts(posts) {
  localStorage.setItem(FEED_KEY, JSON.stringify(posts));
}

function getMarketplaceItems() {
  const existing = localStorage.getItem(MARKETPLACE_KEY);
  if (existing) {
    try {
      return JSON.parse(existing);
    } catch (_error) {
      localStorage.removeItem(MARKETPLACE_KEY);
    }
  }

  localStorage.setItem(MARKETPLACE_KEY, JSON.stringify(INITIAL_MARKET_ITEMS));
  return [...INITIAL_MARKET_ITEMS];
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
    link.addEventListener("click", (event) => {
      event.preventDefault();
    });
  });
}

function renderStars(rating) {
  const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));
  const fullStars = Math.round(safeRating);
  return Array.from({ length: 5 }, (_, index) =>
    index < fullStars ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star"></i>'
  ).join("");
}

function renderMarketplaceItems(grid, items) {
  if (!grid) return;

  if (!items.length) {
    grid.innerHTML = `<article class="market-card"><div class="market-body"><h3 class="market-title">No listing found</h3><p class="post-time">Try changing search or filter options.</p></div></article>`;
    return;
  }

  grid.innerHTML = items
    .map((item) => {
      const verifiedTag = item.verified
        ? `<span class="verified-badge"><i class="fa-solid fa-circle-check"></i> Verified</span>`
        : "";

      return `<article class="market-card">
        <div class="market-image">
          <i class="fa-solid fa-seedling"></i>
          <span>${escapeHtml(item.category || "Product")}</span>
        </div>
        <div class="market-body">
          <h3 class="market-title">${escapeHtml(item.title || "Untitled listing")}</h3>
          <p class="market-price">৳${Number(item.price || 0).toLocaleString("en-BD")}</p>
          <p class="post-time"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(item.location || "Unknown")}</p>
          <p class="market-seller">
            <i class="fa-solid fa-store"></i>
            <span>${escapeHtml(item.sellerName || "Unknown Seller")}</span>
            ${verifiedTag}
          </p>
          <div class="market-rating" aria-label="Rating ${escapeHtml(item.rating)} out of 5">
            ${renderStars(item.rating)}
          </div>
          <a class="call-seller-btn" href="tel:${escapeHtml(item.phone || "")}"><i class="fa-solid fa-phone"></i> Call ${escapeHtml(item.phone || "Seller")}</a>
        </div>
      </article>`;
    })
    .join("");
}

function renderPosts(feedList, posts) {
  feedList.innerHTML = posts
    .map((post, index) => {
      const avatarClass = index % 2 === 0 ? "avatar-a" : "avatar-b";
      const initials = getInitials(post.authorName);
      const imageMarkup = post.image_url
        ? `<div class="post-photo post-photo-has-image"><img class="post-photo-img" src="${escapeHtml(post.image_url)}" alt="Post image" /></div>`
        : "";

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
    })
    .join("");
}

function initLoginPage() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  const errorMessage = document.getElementById("errorMessage");
  const successMessage = document.getElementById("successMessage");
  const mobileInput = document.getElementById("mobileNumber");
  const passwordInput = document.getElementById("password");

  const current = getUser();
  if (current) {
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

    const sessionUser = {
      id: user.id,
      full_name: user.full_name,
      mobile_number: user.mobile_number,
      role: user.role,
    };

    localStorage.setItem(USER_KEY, JSON.stringify(sessionUser));
    successMessage.textContent = "Login successful! Redirecting...";
    successMessage.classList.add("show");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 600);
  });
}

function initFeedPage() {
  const feedList = document.querySelector(".feed-list");
  if (!feedList) return;

  const user = getUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const logoutBtn = document.getElementById("logoutBtn");
  const loginLink = document.getElementById("loginLink");
  const signupLink = document.getElementById("signupLink");
  const guestModePrompt = document.getElementById("guestModePrompt");
  const composerAvatar = document.querySelector(".avatar-owner");
  const postTextInput = document.getElementById("postText");
  const postBtn = document.querySelector(".post-btn");
  const postPhotoInput = document.getElementById("postPhoto");
  const postImagePreviewWrap = document.getElementById("postImagePreviewWrap");
  const postImagePreview = document.getElementById("postImagePreview");
  const removePostImageBtn = document.getElementById("removePostImage");

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

  if (composerAvatar) {
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
      if (!file) {
        clearPreview();
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        selectedImageData = String(reader.result || "");
        if (postImagePreview) postImagePreview.src = selectedImageData;
        if (postImagePreviewWrap) postImagePreviewWrap.hidden = false;
      };
      reader.readAsDataURL(file);
    });
  }

  if (removePostImageBtn) {
    removePostImageBtn.addEventListener("click", clearPreview);
  }

  function refreshFeed() {
    renderPosts(feedList, getPosts());
  }

  if (postBtn) {
    postBtn.addEventListener("click", () => {
      const text = String(postTextInput?.value || "").trim();
      if (!text && !selectedImageData) {
        return;
      }

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
      refreshFeed();
    });
  }

  refreshFeed();
  attachDisabledNavHandlers();
}

function initMarketplacePage() {
  const marketGrid = document.getElementById("marketGrid");
  if (!marketGrid) return;

  const searchInput = document.getElementById("marketSearch");
  const categorySelect = document.getElementById("marketCategory");
  const locationSelect = document.getElementById("marketLocation");
  const user = getUser();

  const logoutBtn = document.getElementById("logoutBtn");
  const loginLink = document.getElementById("loginLink");
  const signupLink = document.getElementById("signupLink");

  if (user) {
    if (loginLink) loginLink.style.display = "none";
    if (signupLink) signupLink.style.display = "none";
    if (logoutBtn) {
      logoutBtn.style.display = "inline-block";
      logoutBtn.textContent = `Logout (${user.full_name})`;
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem(USER_KEY);
        window.location.href = "login.html";
      });
    }
  } else {
    if (loginLink) loginLink.style.display = "inline-block";
    if (signupLink) signupLink.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "none";
  }

  const allItems = getMarketplaceItems();

  function refreshMarketplace() {
    const query = String(searchInput?.value || "").trim().toLowerCase();
    const category = String(categorySelect?.value || "all");
    const location = String(locationSelect?.value || "all");

    const filtered = allItems.filter((item) => {
      const matchesQuery =
        !query ||
        String(item.title || "").toLowerCase().includes(query) ||
        String(item.sellerName || "").toLowerCase().includes(query) ||
        String(item.category || "").toLowerCase().includes(query);

      const matchesCategory = category === "all" || item.category === category;
      const matchesLocation = location === "all" || item.location === location;

      return matchesQuery && matchesCategory && matchesLocation;
    });

    renderMarketplaceItems(marketGrid, filtered);
  }

  if (searchInput) searchInput.addEventListener("input", refreshMarketplace);
  if (categorySelect) categorySelect.addEventListener("change", refreshMarketplace);
  if (locationSelect) locationSelect.addEventListener("change", refreshMarketplace);

  refreshMarketplace();
  attachDisabledNavHandlers();
}

initLoginPage();
initFeedPage();
initMarketplacePage();
