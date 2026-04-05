const dictionary = {
  en: {
    appTagline: "Farmer Community",
    sharePlaceholder: "Share your farming update...",
    addPhoto: "Add Photo",
    postBtn: "Post",
    timeOne: "2 hours ago",
    timeTwo: "Yesterday at 5:40 PM",
    postOneText: "Just transplanted Boro paddy in Gazipur. Water level is stable after yesterday's rain.",
    postTwoText: "My chili plants show early flowering this week. Using compost tea every 4 days is helping a lot.",
    photoPlaceholder: "Crop Photo Placeholder",
    like: "Like",
    comment: "Comment",
    share: "Share",
    save: "Save",
    home: "Home",
    marketplace: "Market",
    weather: "Weather",
    profile: "Profile",
    toggleLabel: "বাংলা"
  },
  bn: {
    appTagline: "কৃষক কমিউনিটি",
    sharePlaceholder: "আপনার খামারের আপডেট লিখুন...",
    addPhoto: "ছবি যোগ করুন",
    postBtn: "পোস্ট",
    timeOne: "২ ঘণ্টা আগে",
    timeTwo: "গতকাল বিকাল ৫:৪০",
    postOneText: "আজ গাজীপুরে বোরো ধানের চারা রোপণ করলাম। গতকালের বৃষ্টির পরে জমিতে পানির স্তর ভাল আছে।",
    postTwoText: "এই সপ্তাহে আমার মরিচ গাছে আগাম ফুল এসেছে। প্রতি ৪ দিন পর কম্পোস্ট চা দিচ্ছি, ভাল ফল পাচ্ছি।",
    photoPlaceholder: "ফসলের ছবির স্থান",
    like: "লাইক",
    comment: "মন্তব্য",
    share: "শেয়ার",
    save: "সেভ",
    home: "হোম",
    marketplace: "মার্কেট",
    weather: "আবহাওয়া",
    profile: "প্রোফাইল",
    toggleLabel: "English"
  }
};

const body = document.body;
const toggleBtn = document.getElementById("langToggle");
const translatableNodes = document.querySelectorAll("[data-i18n]");
const translatablePlaceholders = document.querySelectorAll("[data-i18n-placeholder]");

let googleTranslateInitialized = false;

function ensureGoogleTranslateReady() {
  if (googleTranslateInitialized) {
    return;
  }

  if (!document.getElementById('google_translate_element')) {
    const hiddenContainer = document.createElement('div');
    hiddenContainer.id = 'google_translate_element';
    hiddenContainer.style.position = 'fixed';
    hiddenContainer.style.left = '-9999px';
    hiddenContainer.style.top = '0';
    document.body.appendChild(hiddenContainer);
  }

  window.googleTranslateElementInit = function googleTranslateElementInit() {
    if (!window.google || !window.google.translate || !window.google.translate.TranslateElement) {
      return;
    }

    new window.google.translate.TranslateElement(
      {
        pageLanguage: 'en',
        includedLanguages: 'en,bn',
        autoDisplay: false,
      },
      'google_translate_element'
    );
  };

  const existingScript = document.querySelector('script[data-google-translate="true"]');
  if (!existingScript) {
    const scriptTag = document.createElement('script');
    scriptTag.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    scriptTag.async = true;
    scriptTag.dataset.googleTranslate = 'true';
    document.body.appendChild(scriptTag);
  }

  googleTranslateInitialized = true;
}

function setGoogleTranslateLanguage(lang) {
  const targetValue = lang === 'bn' ? 'bn' : '';
  const maxRetries = 15;
  let attempt = 0;

  function tryApply() {
    const select = document.querySelector('.goog-te-combo');
    if (!select) {
      attempt += 1;
      if (attempt < maxRetries) {
        setTimeout(tryApply, 200);
      }
      return;
    }

    if (select.value !== targetValue) {
      select.value = targetValue;
      select.dispatchEvent(new Event('change'));
    }
  }

  ensureGoogleTranslateReady();
  tryApply();
}

function applyLanguage(lang) {
  body.dataset.lang = lang;

  translatableNodes.forEach((node) => {
    const key = node.dataset.i18n;
    const translatedValue = dictionary[lang][key];
    if (translatedValue) {
      node.textContent = translatedValue;
    }
  });

  translatablePlaceholders.forEach((node) => {
    const key = node.dataset.i18nPlaceholder;
    const translatedValue = dictionary[lang][key];
    if (translatedValue) {
      node.setAttribute("placeholder", translatedValue);
    }
  });

  toggleBtn.textContent = dictionary[lang].toggleLabel;

  setGoogleTranslateLanguage(lang);
}

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    const nextLang = body.dataset.lang === "en" ? "bn" : "en";
    applyLanguage(nextLang);
  });
}

applyLanguage("en");

const feedList = document.querySelector(".feed-list");
const marketplaceGrid = document.querySelector(".market-grid");
const postBtn = document.querySelector(".post-btn");
const postTextInput = document.getElementById("postText");
const postPhotoInput = document.getElementById("postPhoto");
let isAuthenticated = false;
let notificationsLoadedOnce = false;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getAvatarInitials(name) {
  const safeName = String(name || "Anonymous User").trim();
  const parts = safeName.split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "AU";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function formatRelativeTime(dateValue) {
  const now = new Date();
  const postTime = new Date(dateValue);
  const diffSeconds = Math.max(0, Math.floor((now - postTime) / 1000));
  const lang = body.dataset.lang || "en";

  if (diffSeconds < 60) {
    return lang === "bn" ? "এইমাত্র" : "Just now";
  }

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return lang === "bn" ? `${diffMinutes} মিনিট আগে` : `${diffMinutes} minutes ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return lang === "bn" ? `${diffHours} ঘণ্টা আগে` : `${diffHours} hours ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return lang === "bn" ? `${diffDays} দিন আগে` : `${diffDays} days ago`;
}

function renderPosts(posts) {
  if (!feedList) {
    return;
  }

  if (!Array.isArray(posts) || posts.length === 0) {
    const emptyMessage = body.dataset.lang === "bn" ? "এখনও কোন পোস্ট নেই।" : "No posts yet.";
    feedList.innerHTML = `<article class="post-card"><p class="post-text">${emptyMessage}</p></article>`;
    return;
  }

  const actionLike = dictionary[body.dataset.lang || "en"].like;
  const actionComment = dictionary[body.dataset.lang || "en"].comment;
  const actionShare = dictionary[body.dataset.lang || "en"].share;
  const actionSave = dictionary[body.dataset.lang || "en"].save;
  const commentPlaceholder = body.dataset.lang === "bn" ? "মন্তব্য লিখুন..." : "Write a comment...";
  const replyLabel = body.dataset.lang === "bn" ? "উত্তর" : "Reply";
  const submitLabel = body.dataset.lang === "bn" ? "পাঠান" : "Send";

  feedList.innerHTML = posts
    .map((post, index) => {
      const userName = escapeHtml(post.userName || `User #${post.userId}`);
      const textContent = escapeHtml(post.textContent || "");
      const createdText = formatRelativeTime(post.createdAt);
      const avatarInitials = escapeHtml(getAvatarInitials(userName));
      const avatarClass = index % 2 === 0 ? "avatar-a" : "avatar-b";
      const postId = Number(post.id) || 0;
      const likedByMe = Number(post.likedByMe) === 1 || post.likedByMe === true;
      const savedByMe = Number(post.savedByMe) === 1 || post.savedByMe === true;
      const likesCount = Number(post.likesCount) || 0;
      const commentsCount = Number(post.commentsCount) || 0;
      const postPhotoSection = post.imagePath
        ? `<div class="post-photo post-photo-has-image" role="img" aria-label="Uploaded post image"><img class="post-photo-img" src="${escapeHtml(post.imagePath)}" alt="Post image" /></div>`
        : `<div class="post-photo" role="img" aria-label="Crop photo placeholder"><span data-i18n="photoPlaceholder">${dictionary[body.dataset.lang || "en"].photoPlaceholder}</span></div>`;

      return `
      <article class="post-card" data-post-id="${postId}">
        <header class="post-head">
          <div class="avatar ${avatarClass}">${avatarInitials}</div>
          <div class="post-user-meta">
            <h2 class="post-user">${userName}</h2>
            <p class="post-time">${createdText}</p>
          </div>
        </header>
        <p class="post-text">${textContent}</p>
        ${postPhotoSection}
        <footer class="post-actions" aria-label="Post actions">
          <button type="button" class="like-btn ${likedByMe ? "is-liked" : ""}" data-post-id="${postId}"><i class="fa-regular fa-heart"></i> <span data-i18n="like">${actionLike}</span> <strong>${likesCount}</strong></button>
          <button type="button" class="comment-toggle-btn" data-post-id="${postId}"><i class="fa-regular fa-comment"></i> <span data-i18n="comment">${actionComment}</span> <strong>${commentsCount}</strong></button>
          <button type="button"><i class="fa-solid fa-share-nodes"></i> <span data-i18n="share">${actionShare}</span></button>
          <button type="button" class="save-btn ${savedByMe ? "is-saved" : ""}" data-post-id="${postId}"><i class="fa-regular fa-bookmark"></i> <span data-i18n="save">${actionSave}</span></button>
        </footer>
        <section class="comments-wrap" id="comments-wrap-${postId}" style="display:none;">
          <div id="comments-list-${postId}"></div>
          <div class="comment-input-row">
            <textarea id="comment-input-${postId}" placeholder="${commentPlaceholder}"></textarea>
            <div class="comment-actions-row">
              <button type="button" class="submit-comment-btn" data-post-id="${postId}" data-parent-comment-id="">${submitLabel}</button>
            </div>
          </div>
          <small style="opacity:0.75;">${replyLabel}: ${body.dataset.lang === "bn" ? "কোন মন্তব্যের উত্তর দিতে Reply চাপুন" : "Click Reply under any comment to add a nested reply"}</small>
        </section>
      </article>`;
    })
    .join("");
}

function renderCommentNodes(comments, postId) {
  if (!Array.isArray(comments) || comments.length === 0) {
    return `<p class="comment-text">${body.dataset.lang === 'bn' ? 'এখনও মন্তব্য নেই।' : 'No comments yet.'}</p>`;
  }

  return comments
    .map((comment) => {
      const userName = escapeHtml(comment.userName || `User #${comment.userId}`);
      const textContent = escapeHtml(comment.textContent || '');
      const createdText = formatRelativeTime(comment.createdAt);
      const commentId = Number(comment.id) || 0;
      const replyBoxId = `reply-input-${postId}-${commentId}`;

      return `
        <article class="comment-item">
          <div class="comment-meta">
            <p class="comment-user">${userName}</p>
            <p class="comment-time">${createdText}</p>
          </div>
          <p class="comment-text">${textContent}</p>
          <div class="comment-actions-row">
            <button type="button" class="reply-btn" data-post-id="${postId}" data-comment-id="${commentId}">${body.dataset.lang === 'bn' ? 'উত্তর' : 'Reply'}</button>
          </div>
          <div class="comment-input-row" id="${replyBoxId}" style="display:none;">
            <textarea id="reply-text-${postId}-${commentId}" placeholder="${body.dataset.lang === 'bn' ? 'উত্তর লিখুন...' : 'Write a reply...'}"></textarea>
            <div class="comment-actions-row">
              <button type="button" class="submit-comment-btn" data-post-id="${postId}" data-parent-comment-id="${commentId}">${body.dataset.lang === 'bn' ? 'উত্তর দিন' : 'Reply'}</button>
            </div>
          </div>
          ${Array.isArray(comment.replies) && comment.replies.length > 0 ? `<div class="reply-thread">${renderCommentNodes(comment.replies, postId)}</div>` : ''}
        </article>
      `;
    })
    .join('');
}

async function fetchPosts() {
  if (!feedList) {
    return;
  }

  try {
    const response = await fetch("/api/posts");
    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }

    const posts = await response.json();
    renderPosts(posts);
  } catch (error) {
    console.error(error);
    if (feedList) {
      const errorMessage = body.dataset.lang === "bn" ? "পোস্ট লোড করা যায়নি।" : "Unable to load posts.";
      feedList.innerHTML = `<article class="post-card"><p class="post-text">${errorMessage}</p></article>`;
    }
  }
}

async function toggleLike(postId) {
  if (!isAuthenticated) {
    alert(body.dataset.lang === 'bn' ? 'লাইক দিতে লগইন করুন।' : 'Please login to like posts.');
    window.location.href = '/login.html';
    return;
  }

  const response = await fetch(`/api/posts/${postId}/like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to update like');
  }

  await fetchPosts();
  await refreshNotifications();
}

async function toggleSave(postId) {
  if (!isAuthenticated) {
    alert(body.dataset.lang === 'bn' ? 'সেভ করতে লগইন করুন।' : 'Please login to save posts.');
    window.location.href = '/login.html';
    return;
  }

  const response = await fetch(`/api/posts/${postId}/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to update saved post');
  }

  await fetchPosts();
}

async function loadComments(postId) {
  const target = document.getElementById(`comments-list-${postId}`);
  if (!target) return;

  const response = await fetch(`/api/posts/${postId}/comments`);
  if (!response.ok) {
    throw new Error('Failed to load comments');
  }

  const comments = await response.json();
  target.innerHTML = renderCommentNodes(comments, postId);
}

async function submitComment(postId, parentCommentId = null) {
  if (!isAuthenticated) {
    alert(body.dataset.lang === 'bn' ? 'মন্তব্য দিতে লগইন করুন।' : 'Please login to comment.');
    window.location.href = '/login.html';
    return;
  }

  const isReply = parentCommentId != null && parentCommentId !== '';
  const inputId = isReply ? `reply-text-${postId}-${parentCommentId}` : `comment-input-${postId}`;
  const input = document.getElementById(inputId);
  const textValue = input ? input.value.trim() : '';

  if (!textValue) {
    return;
  }

  const payload = {
    textContent: textValue,
  };

  if (isReply) {
    payload.parentCommentId = Number(parentCommentId);
  }

  const response = await fetch(`/api/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to submit comment');
  }

  if (input) {
    input.value = '';
  }

  await loadComments(postId);
  await fetchPosts();
  await refreshNotifications();
}

function setupFeedInteractions() {
  if (!feedList) {
    return;
  }

  feedList.addEventListener('click', async (event) => {
    const likeButton = event.target.closest('.like-btn');
    if (likeButton) {
      const postId = Number(likeButton.dataset.postId);
      if (!Number.isInteger(postId) || postId <= 0) return;

      try {
        await toggleLike(postId);
      } catch (error) {
        console.error(error);
        alert(body.dataset.lang === 'bn' ? 'লাইক আপডেট করা যায়নি।' : 'Unable to update like right now.');
      }
      return;
    }

    const saveButton = event.target.closest('.save-btn');
    if (saveButton) {
      const postId = Number(saveButton.dataset.postId);
      if (!Number.isInteger(postId) || postId <= 0) return;

      try {
        await toggleSave(postId);
      } catch (error) {
        console.error(error);
        alert(body.dataset.lang === 'bn' ? 'সেভ আপডেট করা যায়নি।' : 'Unable to save this post right now.');
      }
      return;
    }

    const commentToggleButton = event.target.closest('.comment-toggle-btn');
    if (commentToggleButton) {
      const postId = Number(commentToggleButton.dataset.postId);
      if (!Number.isInteger(postId) || postId <= 0) return;

      const wrap = document.getElementById(`comments-wrap-${postId}`);
      if (!wrap) return;

      const becomingVisible = wrap.style.display === 'none';
      wrap.style.display = becomingVisible ? 'grid' : 'none';

      if (becomingVisible) {
        try {
          await loadComments(postId);
        } catch (error) {
          console.error(error);
        }
      }
      return;
    }

    const replyButton = event.target.closest('.reply-btn');
    if (replyButton) {
      const postId = Number(replyButton.dataset.postId);
      const commentId = Number(replyButton.dataset.commentId);
      if (!Number.isInteger(postId) || !Number.isInteger(commentId)) return;

      const replyBox = document.getElementById(`reply-input-${postId}-${commentId}`);
      if (replyBox) {
        replyBox.style.display = replyBox.style.display === 'none' ? 'grid' : 'none';
      }
      return;
    }

    const submitButton = event.target.closest('.submit-comment-btn');
    if (submitButton) {
      const postId = Number(submitButton.dataset.postId);
      const parentCommentId = submitButton.dataset.parentCommentId || null;
      if (!Number.isInteger(postId) || postId <= 0) return;

      try {
        await submitComment(postId, parentCommentId);
      } catch (error) {
        console.error(error);
        alert(body.dataset.lang === 'bn' ? 'মন্তব্য পাঠানো যায়নি।' : 'Unable to post comment right now.');
      }
    }
  });
}

const notificationBtn = document.getElementById('notificationBtn');
const notificationBadge = document.getElementById('notificationBadge');
const notificationPanel = document.getElementById('notificationPanel');
const notificationList = document.getElementById('notificationList');
const markAllReadBtn = document.getElementById('markAllReadBtn');

function formatNotificationMessage(notification) {
  const actor = escapeHtml(notification.actorName || 'Someone');
  const shortPost = escapeHtml(notification.postPreview || 'a post');

  if (notification.type === 'like') {
    return body.dataset.lang === 'bn'
      ? `${actor} আপনার পোস্টে লাইক দিয়েছে: "${shortPost}"`
      : `${actor} liked your post: "${shortPost}"`;
  }

  if (notification.type === 'reply') {
    return body.dataset.lang === 'bn'
      ? `${actor} একটি উত্তরে লিখেছে: "${shortPost}"`
      : `${actor} replied on a thread in: "${shortPost}"`;
  }

  return body.dataset.lang === 'bn'
    ? `${actor} আপনার পোস্টে মন্তব্য করেছে: "${shortPost}"`
    : `${actor} commented on your post: "${shortPost}"`;
}

async function refreshNotifications() {
  if (!isAuthenticated || !notificationBtn) {
    return;
  }

  const response = await fetch('/api/notifications?limit=30');
  if (!response.ok) {
    throw new Error('Failed to load notifications');
  }

  const notifications = await response.json();
  const unreadCount = notifications.filter((item) => !item.isRead).length;

  if (notificationBadge) {
    notificationBadge.textContent = String(unreadCount);
    notificationBadge.style.display = unreadCount > 0 ? 'grid' : 'none';
  }

  if (!notificationList) {
    return;
  }

  if (notifications.length === 0) {
    notificationList.innerHTML = `<p class="notification-text">${body.dataset.lang === 'bn' ? 'এখনও কোনো নোটিফিকেশন নেই।' : 'No notifications yet.'}</p>`;
    return;
  }

  notificationList.innerHTML = notifications
    .map((notification) => {
      const createdText = formatRelativeTime(notification.createdAt);
      return `
        <article class="notification-item ${notification.isRead ? '' : 'unread'}" data-notification-id="${Number(notification.id) || 0}">
          <p class="notification-text">${formatNotificationMessage(notification)}</p>
          <p class="notification-time">${createdText}</p>
        </article>
      `;
    })
    .join('');
}

function setupNotificationInteractions() {
  if (!notificationBtn) {
    return;
  }

  notificationBtn.addEventListener('click', async () => {
    if (!notificationPanel) {
      window.location.href = '/notifications.html';
      return;
    }

    const shouldOpen = notificationPanel.style.display === 'none';
    notificationPanel.style.display = shouldOpen ? 'block' : 'none';

    if (shouldOpen) {
      try {
        await refreshNotifications();
        await fetch('/api/notifications/read', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });
        await refreshNotifications();
      } catch (error) {
        console.error('Notification load error:', error);
      }
    }
  });

  if (markAllReadBtn) {
    markAllReadBtn.addEventListener('click', async () => {
      try {
        await fetch('/api/notifications/read', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });
        await refreshNotifications();
      } catch (error) {
        console.error('Mark-read error:', error);
      }
    });
  }
}

function getMarketplaceIconClass(ad) {
  const category = String(ad.category || "").toLowerCase();
  const title = String(ad.productTitle || "").toLowerCase();

  if (category.includes("seed")) {
    return "fa-seedling";
  }

  if (category.includes("produce") || title.includes("chili") || title.includes("rice")) {
    return "fa-wheat-awn";
  }

  if (category.includes("tool") || category.includes("equipment")) {
    return "fa-screwdriver-wrench";
  }

  return "fa-store";
}

function formatPrice(ad) {
  const priceValue = Number(ad.price);
  const safePrice = Number.isFinite(priceValue) ? priceValue.toFixed(2).replace(/\.00$/, "") : String(ad.price || "0");
  const unit = ad.unit ? ` / ${escapeHtml(ad.unit)}` : "";
  return `৳ ${safePrice}${unit}`;
}

function renderMarketplaceAds(ads) {
  if (!marketplaceGrid) {
    return;
  }

  if (!Array.isArray(ads) || ads.length === 0) {
    const emptyMessage = body.dataset.lang === "bn" ? "এখনও কোন বিজ্ঞাপন নেই।" : "No marketplace ads yet.";
    marketplaceGrid.innerHTML = `<article class="market-card"><div class="market-body"><p class="market-seller">${emptyMessage}</p></div></article>`;
    return;
  }

  marketplaceGrid.innerHTML = ads
    .map((ad) => {
      const productTitle = escapeHtml(ad.productTitle || "Untitled Product");
      const sellerName = escapeHtml(ad.sellerName || "Unknown Seller");
      const sellerMobile = escapeHtml(ad.sellerMobile || "N/A");
      const verifiedBadge = ad.isVerifiedSeller
        ? '<span class="verified-badge"><i class="fa-solid fa-circle-check"></i> Verified</span>'
        : "";
      const imageIconClass = getMarketplaceIconClass(ad);

      return `
      <article class="market-card">
        <div class="market-image">
          <i class="fa-solid ${imageIconClass}"></i>
          <span data-i18n="marketImagePlaceholder">Product Image</span>
        </div>
        <div class="market-body">
          <h2 class="market-title">${productTitle}</h2>
          <p class="market-price">${formatPrice(ad)}</p>
          <p class="market-seller">
            ${sellerName}
            ${verifiedBadge}
          </p>
          <div class="market-rating" aria-label="5 star rating">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
          </div>
          <button class="call-seller-btn" type="button">Call Seller: ${sellerMobile}</button>
        </div>
      </article>`;
    })
    .join("");
}

if (postBtn && postTextInput) {
  postBtn.addEventListener("click", async () => {
    const textContent = postTextInput.value.trim();
    const selectedImageFile = postPhotoInput && postPhotoInput.files ? postPhotoInput.files[0] : null;

    if (!textContent && !selectedImageFile) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("textContent", textContent);
      if (selectedImageFile) {
        formData.append("image", selectedImageFile);
      }

      const response = await fetch("/api/posts", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      postTextInput.value = "";
      if (postPhotoInput) {
        postPhotoInput.value = "";
      }
      await fetchPosts();
    } catch (error) {
      console.error(error);
      alert(body.dataset.lang === "bn" ? "পোস্ট করা যায়নি।" : "Could not publish post.");
    }
  });
}

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    fetchPosts();
    filterMarketplaceAds();
  });
}

let allMarketplaceAds = [];

const searchInput = document.querySelector('.market-filter-item.search-field input');
const categorySelect = document.getElementById('categorySelect');
const locationSelect = document.getElementById('locationSelect');

function filterMarketplaceAds() {
  if (!marketplaceGrid || !Array.isArray(allMarketplaceAds)) {
    return;
  }

  const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
  const selectedCategory = categorySelect ? categorySelect.value : '';
  const selectedLocation = locationSelect ? locationSelect.value : '';

  const filtered = allMarketplaceAds.filter((ad) => {
    const matchesSearch =
      !searchTerm ||
      String(ad.productTitle || '').toLowerCase().includes(searchTerm) ||
      String(ad.description || '').toLowerCase().includes(searchTerm);

    const matchesCategory = !selectedCategory || ad.category === selectedCategory;
    const matchesLocation = !selectedLocation || ad.location === selectedLocation;

    return matchesSearch && matchesCategory && matchesLocation;
  });

  renderMarketplaceAds(filtered);
}

if (searchInput) {
  searchInput.addEventListener('input', filterMarketplaceAds);
}

if (categorySelect) {
  categorySelect.addEventListener('change', filterMarketplaceAds);
}

if (locationSelect) {
  locationSelect.addEventListener('change', filterMarketplaceAds);
}

async function fetchMarketplaceAdsWithFiltering() {
  if (!marketplaceGrid) {
    return;
  }

  try {
    const response = await fetch('/api/marketplace');
    if (!response.ok) {
      throw new Error('Failed to fetch marketplace ads');
    }

    allMarketplaceAds = await response.json();
    filterMarketplaceAds();
  } catch (error) {
    console.error(error);
    const errorMessage =
      body.dataset.lang === 'bn'
        ? 'বিজ্ঞাপন লোড করা যায়নি।'
        : 'Unable to load marketplace ads.';
    marketplaceGrid.innerHTML = `<article class="market-card"><div class="market-body"><p class="market-seller">${errorMessage}</p></div></article>`;
  }
}

fetchPosts();
fetchMarketplaceAdsWithFiltering();

// ============================================
// AUTHENTICATION & GUEST MODE
// ============================================

const createPostCard = document.getElementById('createPostCard');
const guestModePrompt = document.getElementById('guestModePrompt');
const loginLink = document.getElementById('loginLink');
const signupLink = document.getElementById('signupLink');
const logoutBtn = document.getElementById('logoutBtn');

// Check authentication status on page load
async function checkAuthentication() {
  try {
    const response = await fetch('/api/auth/check');
    const data = await response.json();

    if (data.authenticated) {
      isAuthenticated = true;
      // User is logged in
      showAuthenticatedUI();
    } else {
      isAuthenticated = false;
      // User is guest
      showGuestModeUI();
    }
  } catch (error) {
    console.error('Auth check error:', error);
    isAuthenticated = false;
    showGuestModeUI();
  }
}

function showAuthenticatedUI() {
  if (createPostCard) createPostCard.style.display = 'block';
  if (guestModePrompt) guestModePrompt.style.display = 'none';
  if (loginLink) loginLink.style.display = 'none';
  if (signupLink) signupLink.style.display = 'none';
  if (notificationBtn) notificationBtn.style.display = 'grid';
  if (logoutBtn) {
    logoutBtn.style.display = 'block';
    logoutBtn.onclick = async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/index.html';
    };
  }

  if (!notificationsLoadedOnce) {
    refreshNotifications().catch((error) => {
      console.error('Initial notification load failed:', error);
    });
    notificationsLoadedOnce = true;
  }
}

function showGuestModeUI() {
  if (createPostCard) createPostCard.style.display = 'none';
  if (guestModePrompt) guestModePrompt.style.display = 'block';
  if (loginLink) loginLink.style.display = 'inline-block';
  if (signupLink) signupLink.style.display = 'inline-block';
  if (logoutBtn) logoutBtn.style.display = 'none';
  if (notificationBtn) notificationBtn.style.display = 'none';
  if (notificationPanel) notificationPanel.style.display = 'none';

  // Disable post creation for guests
  if (postBtn) {
    postBtn.disabled = true;
    postBtn.style.opacity = '0.5';
    postBtn.style.cursor = 'not-allowed';
  }
}

checkAuthentication();
setupFeedInteractions();
setupNotificationInteractions();

// Add translations for new strings
dictionary.en.guestModeMsg = "You're browsing as a guest.";
dictionary.en.loginToReact = "Login to post and react";
dictionary.en.login = "Login";
dictionary.en.signup = "Sign Up";
dictionary.en.logout = "Logout";
dictionary.en.notifications = "Notifications";
dictionary.en.markAllRead = "Mark all read";

dictionary.bn.guestModeMsg = "আপনি অতিথি হিসেবে ব্রাউজ করছেন।";
dictionary.bn.loginToReact = "পোস্ট করতে এবং প্রতিক্রিয়া জানাতে লগইন করুন";
dictionary.bn.login = "লগইন";
dictionary.bn.signup = "সাইন আপ";
dictionary.bn.logout = "লগ আউট";
dictionary.bn.notifications = "নোটিফিকেশন";
dictionary.bn.markAllRead = "সব পঠিত করুন";