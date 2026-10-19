/* ==========================================================================
   Instagram (Elfsight) Feed — Broken / Archived Live Post Auto-Hider
   --------------------------------------------------------------------------
   Elfsight caches deleted/expired Instagram Live posts, which then render as
   grey empty boxes in the feed grid and in the popup. This script detects:
     1) Posts containing specific archived-Live captions
     2) Posts whose media (image/video) failed to load or is missing entirely
   and hides the WHOLE post block (display:none !important) so the next valid
   post follows directly. Uses MutationObserver + a periodic safety check.
   Scope: Instagram widget + its popup only (YouTube widget is excluded).
   ========================================================================== */
(function () {
  'use strict';

  var HIDDEN_CLASS = 'pt-ig-hidden-post';

  // Captions of deleted / expired Live posts (matched after whitespace normalisation)
  var BLOCKED_PHRASES = [
    'ふとした瞬間に配信が始まりました',
    'みんなに嬉しい報告してたら'
  ];

  // Elfsight Instagram widget roots (grid + popup portals)
  var IG_ROOT_SELECTOR = [
    '[class*="elfsight-app-7561fee8-e7d0-4a8a-812f-1d09abf905a7"]',
    '[class*="eapps-instagram-feed"]',
    '[class*="eapps-instagram"]'
  ].join(',');

  // Popup / lightbox containers Elfsight may render at <body> level
  var POPUP_ROOT_SELECTOR = [
    '[class*="eapps-instagram-feed-popup"]',
    '[class*="instagram-feed-popup"]',
    '[class*="InstagramFeed"][class*="opup"]',
    '[class*="es-popup"]',
    '[class*="eapps-widget-popup"]',
    '[class*="elfsight"][class*="opup"]',
    '[role="dialog"]',
    '[aria-modal="true"]'
  ].join(',');

  // Known post-item containers (old + new Elfsight markup)
  var ITEM_SELECTOR = [
    '.eapps-instagram-feed-posts-item',
    '.eapps-instagram-feed-popup-item',
    '[class*="eapps-instagram-feed-posts-item"]',
    '[class*="eapps-instagram-feed-popup-item"]',
    '[class*="posts-item"]',
    '[class*="popup-item"]',
    '[class*="post-item"]',
    '[class*="PostItem"]',
    '[class*="PostsItem"]',
    '[class*="PopupItem"]',
    '[class*="es-post-container"]',
    '[class*="es-popup-post"]'
  ].join(',');

  // Never hide these (site layout / widget roots / YouTube widget)
  var PROTECTED_SELECTOR = [
    'html', 'body', 'section', 'main',
    '.ig-widget-container',
    '.masaya-ig-updates-section',
    '[class*="elfsight-app-"]'
  ].join(',');
  var YT_WIDGET_SELECTOR = '[class*="elfsight-app-5ab5f85a"]';

  var EMPTY_MEDIA_GRACE_MS = 4000; // wait before treating "no media" as broken
  var firstSeen = new WeakMap();

  /* ---------------------------- helpers ---------------------------- */

  function normalize(text) {
    return (text || '').replace(/\s+/g, '');
  }
  var NORMALIZED_PHRASES = BLOCKED_PHRASES.map(normalize);

  function containsBlockedPhrase(text) {
    var t = normalize(text);
    if (!t) return false;
    for (var i = 0; i < NORMALIZED_PHRASES.length; i++) {
      if (t.indexOf(NORMALIZED_PHRASES[i]) !== -1) return true;
    }
    return false;
  }

  // Only true layout/widget roots & dialog shells are protected. The broad
  // discovery selectors (IG_ROOT / POPUP_ROOT) also match post items themselves,
  // so they must NOT be used for protection.
  var STRICT_POPUP_SHELL = '[role="dialog"], [aria-modal="true"]';
  function isProtected(el) {
    if (!el || el.nodeType !== 1) return true;
    if (el.matches(PROTECTED_SELECTOR) || el.matches(STRICT_POPUP_SHELL)) return true;
    // Popup root wrappers (e.g. "...-popup", "...-popup-inner") but not popup items
    if (el.matches(POPUP_ROOT_SELECTOR) && !el.matches(ITEM_SELECTOR) && isListLikeOrShell(el)) return true;
    return false;
  }

  function isListLikeOrShell(el) {
    // A popup wrapper is considered a shell if it is attached directly to <body>
    // or wraps multiple post items.
    return el.parentElement === document.body || isListLike(el);
  }

  function inYouTubeWidget(el) {
    return !!(el && el.closest && el.closest(YT_WIDGET_SELECTOR));
  }

  function classSignature(el) {
    return (el.tagName || '') + '|' + (typeof el.className === 'string' ? el.className.trim() : '');
  }

  // True if el wraps 2+ sibling post items (i.e. it's a list/grid, not a single post)
  function isListLike(el) {
    var inner = el.querySelectorAll(ITEM_SELECTOR);
    for (var i = 0; i < inner.length; i++) {
      var p = inner[i].parentElement;
      if (!p) continue;
      var count = 0;
      var sig = classSignature(inner[i]);
      for (var c = p.firstElementChild; c; c = c.nextElementSibling) {
        if (classSignature(c) === sig && ++count >= 2) return true;
      }
    }
    return false;
  }

  // Find the enclosing post block for any descendant element
  function findPostItem(el, requireMedia) {
    if (!el || el.nodeType !== 1) return null;
    if (requireMedia === undefined) requireMedia = true;

    // 1) Known item selectors
    var known = el.closest(ITEM_SELECTOR);
    if (known && !isProtected(known)) {
      // climb to the OUTERMOST matching item (e.g. "posts-item" over "posts-item-image"),
      // but never to a wrapper that itself contains multiple post items (a list)
      var best = isListLike(known) ? null : known;
      var up = known.parentElement && known.parentElement.closest(ITEM_SELECTOR);
      while (up && !isProtected(up)) {
        if (isListLike(up)) break;
        best = up;
        up = up.parentElement && up.parentElement.closest(ITEM_SELECTOR);
      }
      if (best) return best;
    }

    // 2) Generic heuristic: first ancestor that is one of ≥2 similar siblings
    var node = el;
    while (node && node.parentElement) {
      var parent = node.parentElement;
      if (isProtected(parent) && isProtected(node)) break;
      if (!isProtected(node)) {
        var sig = classSignature(node);
        var similar = 0;
        var kids = parent.children;
        for (var i = 0; i < kids.length; i++) {
          if (classSignature(kids[i]) === sig) similar++;
        }
        if (similar >= 2 && (!requireMedia || hasMediaSlot(node))) return node;
      }
      if (isProtected(parent)) break;
      node = parent;
    }
    return null;
  }

  // Whether an element looks like it should hold post media (img/video/bg area)
  function hasMediaSlot(el) {
    return !!el.querySelector('img, video, picture, [style*="background-image"], [class*="media"], [class*="Media"], [class*="image"], [class*="Image"]') ||
      el.matches('[class*="media"], [class*="image"]');
  }

  function hidePost(item, reason) {
    if (!item || item.classList.contains(HIDDEN_CLASS) || isProtected(item) || inYouTubeWidget(item)) return;
    item.classList.add(HIDDEN_CLASS);
    item.setAttribute('data-pt-ig-hidden', reason);
    item.style.setProperty('display', 'none', 'important');
    // Pause any media inside so hidden posts don't keep loading/playing
    var vids = item.querySelectorAll('video');
    for (var i = 0; i < vids.length; i++) {
      try { vids[i].pause(); } catch (e) { /* noop */ }
    }
  }

  /* ------------------------- media checks -------------------------- */

  function isImgBroken(img) {
    var src = img.currentSrc || img.getAttribute('src') || '';
    if (!src && !img.getAttribute('srcset') && !img.getAttribute('data-src')) return 'missing';
    if (img.complete && img.naturalWidth === 0 && src) return 'error';
    return false;
  }

  function isVideoBroken(video) {
    if (video.error) return 'error';
    var hasSrc = video.getAttribute('src') || video.getAttribute('poster') || video.querySelector('source[src]');
    return hasSrc ? false : 'missing';
  }

  function hasBackgroundImage(el) {
    var nodes = [el].concat(Array.prototype.slice.call(el.querySelectorAll('div, span, a, figure'), 0, 40));
    for (var i = 0; i < nodes.length; i++) {
      var bg = nodes[i].style && nodes[i].style.backgroundImage;
      if (!bg || bg === 'none') {
        try { bg = window.getComputedStyle(nodes[i]).backgroundImage; } catch (e) { bg = ''; }
      }
      if (bg && bg !== 'none' && bg.indexOf('url(') !== -1 && bg.indexOf('url("")') === -1) return true;
    }
    return false;
  }

  // Returns true if the item has at least one healthy (or still-loading) media element
  function hasHealthyMedia(item) {
    var imgs = item.querySelectorAll('img');
    for (var i = 0; i < imgs.length; i++) {
      // ignore tiny avatars/icons
      var w = imgs[i].getAttribute('width');
      if (w && parseInt(w, 10) < 60) continue;
      if (!isImgBroken(imgs[i])) return true;
    }
    var vids = item.querySelectorAll('video');
    for (var j = 0; j < vids.length; j++) {
      if (!isVideoBroken(vids[j])) return true;
    }
    if (item.querySelector('iframe[src]')) return true;
    return hasBackgroundImage(item);
  }

  // Only judge "empty" posts that are actually on screen — off-screen slides
  // are often lazy-loaded and legitimately have no media yet.
  function isOnScreen(el) {
    var r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    var vw = window.innerWidth || document.documentElement.clientWidth;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    return r.bottom > 0 && r.right > 0 && r.top < vh && r.left < vw;
  }

  function checkItemMedia(item) {
    if (!item || item.classList.contains(HIDDEN_CLASS)) return;
    if (hasHealthyMedia(item)) { firstSeen.delete(item); return; }
    if (!isOnScreen(item)) { firstSeen.delete(item); return; }
    var now = Date.now();
    if (!firstSeen.has(item)) { firstSeen.set(item, now); return; }
    if (now - firstSeen.get(item) >= EMPTY_MEDIA_GRACE_MS) hidePost(item, 'empty-media');
  }

  /* --------------------------- scanning ---------------------------- */

  function collectRoots() {
    var roots = [];
    var seen = new Set();
    var list = document.querySelectorAll(IG_ROOT_SELECTOR + ',' + POPUP_ROOT_SELECTOR);
    for (var i = 0; i < list.length; i++) {
      var r = list[i];
      if (inYouTubeWidget(r) || seen.has(r)) continue;
      // Skip site-own dialogs that are not Instagram related (e.g. schedule modal)
      if (r.matches('[role="dialog"], [aria-modal="true"]') &&
          !r.querySelector('[class*="eapps"], [class*="instagram"], [class*="Instagram"], a[href*="instagram.com"]') &&
          !r.closest('[class*="eapps"], [class*="elfsight"]')) continue;
      seen.add(r);
      roots.push(r);
      if (r.shadowRoot) roots.push(r.shadowRoot);
    }
    return roots;
  }

  // 1) Caption text match — searches whole document (phrases are unique to the IG posts)
  function scanBlockedText(root) {
    if (!root) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = walker.nextNode())) {
      var parent = n.parentElement;
      if (!parent || parent.closest('script, style, textarea, noscript, .' + HIDDEN_CLASS)) continue;
      if (inYouTubeWidget(parent)) continue;
      var parentText = parent.textContent || '';
      if (!containsBlockedPhrase(n.nodeValue) &&
          !(parentText.length < 600 && containsBlockedPhrase(parentText))) continue;
      var item = findPostItem(parent, true) || findPostItem(parent, false);
      if (item) hidePost(item, 'archived-live');
    }
    // Also check alt / aria-label attributes (captions are often stored there)
    var attrEls = root.querySelectorAll ? root.querySelectorAll('img[alt], [aria-label], [title]') : [];
    for (var i = 0; i < attrEls.length; i++) {
      var el = attrEls[i];
      if (inYouTubeWidget(el) || el.closest('.' + HIDDEN_CLASS)) continue;
      var txt = (el.getAttribute('alt') || '') + (el.getAttribute('aria-label') || '') + (el.getAttribute('title') || '');
      if (containsBlockedPhrase(txt)) {
        var it = findPostItem(el, true) || findPostItem(el, false);
        if (it) hidePost(it, 'archived-live');
      }
    }
  }

  // 2) Broken / empty media detection inside IG roots only
  function scanBrokenMedia(root) {
    // Known item selectors
    var items = root.querySelectorAll(ITEM_SELECTOR);
    var checked = new Set();
    for (var i = 0; i < items.length; i++) {
      if (inYouTubeWidget(items[i])) continue;
      var post = findPostItem(items[i]);
      if (post && !checked.has(post)) { checked.add(post); checkItemMedia(post); }
    }

    // Generic: discover post lists via media elements, then check every sibling post
    var lists = new Set();
    var media = root.querySelectorAll('img, video');
    for (var k = 0; k < media.length; k++) {
      var m = media[k];
      if (inYouTubeWidget(m)) continue;
      attachErrorListener(m);
      var item = findPostItem(m);
      if (!item) continue;
      if (m.tagName === 'IMG' && isImgBroken(m) === 'error') checkItemMedia(item);
      if (m.tagName === 'VIDEO' && isVideoBroken(m) === 'error') checkItemMedia(item);
      if (item.parentElement) lists.add(item);
    }
    lists.forEach(function (sample) {
      var parent = sample.parentElement;
      if (!parent) return;
      var sig = classSignature(sample);
      var kids = parent.children;
      for (var j = 0; j < kids.length; j++) {
        if (classSignature(kids[j]) === sig) checkItemMedia(kids[j]);
      }
    });
  }

  function attachErrorListener(el) {
    if (el.__ptIgErrBound) return;
    el.__ptIgErrBound = true;
    el.addEventListener('error', function () {
      var item = findPostItem(el);
      if (item && !hasHealthyMedia(item)) hidePost(item, 'media-error');
    }, true);
  }

  function runScan() {
    try {
      scanBlockedText(document.body);
      var roots = collectRoots();
      for (var i = 0; i < roots.length; i++) {
        scanBrokenMedia(roots[i]);
        if (roots[i] instanceof ShadowRoot) scanBlockedText(roots[i]);
      }
    } catch (e) {
      if (window.console) console.warn('[IG filter]', e);
    }
  }

  /* ------------------------ scheduling ----------------------------- */

  var scheduled = false;
  var lastScan = 0;
  var MIN_SCAN_GAP_MS = 120;
  function scheduleScan() {
    if (scheduled) return;
    scheduled = true;
    var wait = Math.max(0, MIN_SCAN_GAP_MS - (Date.now() - lastScan));
    var run = function () {
      scheduled = false;
      lastScan = Date.now();
      runScan();
    };
    // rAF → runs before next paint, so blocked posts never flash on screen
    if (wait === 0 && window.requestAnimationFrame) window.requestAnimationFrame(run);
    else setTimeout(run, wait);
  }

  function start() {
    runScan();

    var observer = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var t = mutations[i].target;
        var el = t.nodeType === 1 ? t : t.parentElement;
        if (el && el.closest && el.closest('.' + HIDDEN_CLASS)) continue;
        scheduleScan();
        return;
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['src', 'srcset', 'style', 'class', 'alt']
    });

    // Capture media load errors anywhere (error events don't bubble, so use capture)
    document.addEventListener('error', function (ev) {
      var tgt = ev.target;
      if (tgt && (tgt.tagName === 'IMG' || tgt.tagName === 'VIDEO' || tgt.tagName === 'SOURCE')) {
        if (inYouTubeWidget(tgt)) return;
        var host = tgt.tagName === 'SOURCE' ? tgt.parentElement : tgt;
        if (!host || !host.closest(IG_ROOT_SELECTOR + ',' + POPUP_ROOT_SELECTOR)) return;
        var item = findPostItem(host);
        if (item && !hasHealthyMedia(item)) hidePost(item, 'media-error');
      }
    }, true);

    // Periodic safety net (handles grace-period expiry & lazy-loaded popups)
    setInterval(runScan, 1500);

    // Re-scan immediately on user interaction (opening widget / popup)
    document.addEventListener('click', function () {
      scheduleScan();
      setTimeout(runScan, 300);
      setTimeout(runScan, 1000);
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
