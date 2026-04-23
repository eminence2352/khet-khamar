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

initLoginPage();
initFeedPage();
