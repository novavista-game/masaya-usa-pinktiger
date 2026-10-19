/* ==========================================================================
   Instagram (Elfsight) Feed — Broken / Archived Live Post Auto-Hider  v2
   --------------------------------------------------------------------------
   Elfsight caches deleted/expired Instagram Live posts, which then render as
   grey empty boxes in the feed grid and in the popup. This script:
     0) Clears Elfsight / InstaShow cache keys from localStorage/sessionStorage
     1) Hooks attachShadow so even CLOSED shadow roots are tracked
     2) Deep-scans document + every shadowRoot (+ same-origin iframes)
     3) Hides posts containing archived-Live captions
     4) Hides posts whose media failed to load or is missing entirely
   Hidden posts get display:none !important (inline + <style> injected into the
   owning shadowRoot), so the next valid post follows directly.
   Scope: Instagram widget + its popup only (YouTube widget is excluded).

   NOTE: must be loaded BEFORE https://elfsightcdn.com/platform.js (no defer)
   so the attachShadow hook is in place before the widget renders.
   ========================================================================== */
(function () {
  'use strict';

  var HIDDEN_CLASS = 'pt-ig-hidden-post';
  var STYLE_ID = 'pt-ig-hide-style';
  var HIDE_CSS =
    '.' + HIDDEN_CLASS + ',[data-pt-ig-hidden]{' +
    'display:none!important;visibility:hidden!important;width:0!important;' +
    'height:0!important;margin:0!important;padding:0!important;overflow:hidden!important;}';

  // Captions of deleted / expired Live posts (matched after whitespace normalisation)
  var BLOCKED_PHRASES = [
    'ふとした瞬間に配信が始まりました',
    'みんなに嬉しい報告してたら'
  ];

  /* ======================================================================
     0) Clear Elfsight / InstaShow cache in Web Storage (runs immediately)
     ====================================================================== */
  var CACHE_KEY_RE = /elfsight|instashow|eapps/i;
  function clearWidgetCache(storage) {
    try {
      if (!storage) return;
      var doomed = [];
      for (var i = 0; i < storage.length; i++) {
        var k = storage.key(i);
        if (k && CACHE_KEY_RE.test(k)) doomed.push(k);
      }
      for (var j = 0; j < doomed.length; j++) storage.removeItem(doomed[j]);
    } catch (e) { /* storage may be blocked (privacy mode) — ignore */ }
  }
  try { clearWidgetCache(window.localStorage); } catch (e) { /* noop */ }
  try { clearWidgetCache(window.sessionStorage); } catch (e) { /* noop */ }

  /* ======================================================================
     1) Track every shadow root (open AND closed) via attachShadow hook
     ====================================================================== */
  var knownShadowRoots = new Set();
  var observedRoots = new WeakSet();
  var rootObserver = null; // created in start()

  function registerShadowRoot(root) {
    if (!root || knownShadowRoots.has(root)) return;
    knownShadowRoots.add(root);
    observeRoot(root);
    scheduleScan();
  }

  if (window.Element && Element.prototype.attachShadow && !Element.prototype.attachShadow.__ptIgHooked) {
    var nativeAttachShadow = Element.prototype.attachShadow;
    var hooked = function () {
      var root = nativeAttachShadow.apply(this, arguments);
      try { registerShadowRoot(root); } catch (e) { /* noop */ }
      return root;
    };
    hooked.__ptIgHooked = true;
    Element.prototype.attachShadow = hooked;
  }

  /* ======================================================================
     Selectors
     ====================================================================== */
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

  // Never hide these (site layout / widget roots)
  var PROTECTED_SELECTOR = [
    'html', 'body', 'section', 'main',
    '.ig-widget-container',
    '.masaya-ig-updates-section',
    '[class*="elfsight-app-"]'
  ].join(',');
  var STRICT_POPUP_SHELL = '[role="dialog"], [aria-modal="true"]';
  var YT_WIDGET_SELECTOR = '[class*="elfsight-app-5ab5f85a"]';
  var MEDIA_SLOT_SELECTOR = 'img, video, picture, [style*="background-image"], [class*="media"], [class*="Media"], [class*="image"], [class*="Image"]';

  var EMPTY_MEDIA_GRACE_MS = 4000; // wait before treating "no media" as broken
  var firstSeen = new WeakMap();

  /* ======================================================================
     Helpers (shadow-DOM aware)
     ====================================================================== */
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

  // closest() that crosses shadow boundaries (climbs to host)
  function closestDeep(el, selector) {
    var node = el;
    while (node) {
      if (node.nodeType === 1) {
        var hit = node.closest(selector);
        if (hit) return hit;
      }
      var root = node.getRootNode ? node.getRootNode() : null;
      node = root && root.host ? root.host : null;
    }
    return null;
  }

  function inYouTubeWidget(el) {
    return !!closestDeep(el, YT_WIDGET_SELECTOR);
  }

  function isInsideHidden(el) {
    return !!closestDeep(el, '.' + HIDDEN_CLASS);
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

  function isProtected(el) {
    if (!el || el.nodeType !== 1) return true;
    if (el.matches(PROTECTED_SELECTOR) || el.matches(STRICT_POPUP_SHELL)) return true;
    // Popup root wrappers (e.g. "...-popup", "...-popup-inner") but not popup items
    if (el.matches(POPUP_ROOT_SELECTOR) && !el.matches(ITEM_SELECTOR) &&
        (el.parentElement === document.body || isListLike(el))) return true;
    return false;
  }

  function hasMediaSlot(el) {
    return !!el.querySelector(MEDIA_SLOT_SELECTOR) ||
      el.matches('[class*="media"], [class*="image"]');
  }

  // Find the top-level post block for any descendant element
  function findPostItem(el, requireMedia) {
    if (!el || el.nodeType !== 1) return null;
    if (requireMedia === undefined) requireMedia = true;

    // 1) Known item selectors → outermost item that is not itself a list
    var known = el.closest(ITEM_SELECTOR);
    if (known && !isProtected(known)) {
      var best = isListLike(known) ? null : known;
      var up = known.parentElement && known.parentElement.closest(ITEM_SELECTOR);
      while (up && !isProtected(up)) {
        if (isListLike(up)) break;
        best = up;
        up = up.parentElement && up.parentElement.closest(ITEM_SELECTOR);
      }
      if (best) return best;
    }

    // 2) Generic: first ancestor that is one of ≥2 similar siblings (a card in a list)
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

  // 3) Fallback for single-post popups: the INNERMOST ancestor that holds both
  //    the caption and a large media slot (≥120px, i.e. the photo / grey box).
  //    Innermost → the popup shell (close button, arrows) is never hidden.
  function hasLargeMediaSlot(el) {
    var slots = el.querySelectorAll(MEDIA_SLOT_SELECTOR);
    for (var i = 0; i < slots.length && i < 60; i++) {
      var r = slots[i].getBoundingClientRect();
      if (r.width >= 120 && r.height >= 120) return true;
    }
    return false;
  }

  function findSingleCard(el) {
    var node = el;
    while (node && node.nodeType === 1 && !isProtected(node)) {
      if (isListLike(node)) return null;
      if (hasLargeMediaSlot(node)) return node;
      node = node.parentElement;
    }
    return null;
  }

  function resolvePostBlock(el) {
    var item = findPostItem(el, true);
    // Accept if it's a known Elfsight item or it actually contains the big media
    // area (the grey box); otherwise it's likely just a caption/comment row.
    if (item && (item.matches(ITEM_SELECTOR) || hasLargeMediaSlot(item) || !isOnScreen(item))) return item;
    return findSingleCard(el) || item || findPostItem(el, false);
  }

  // Inject the hide stylesheet into the root that owns el (shadowRoot or document)
  function ensureHideStyle(el) {
    var root = el && el.getRootNode ? el.getRootNode() : document;
    try {
      if (root instanceof ShadowRoot) {
        if (!root.querySelector('style#' + STYLE_ID)) {
          var s = document.createElement('style');
          s.id = STYLE_ID;
          s.textContent = HIDE_CSS;
          root.appendChild(s);
        }
      } else {
        var doc = root && root.nodeType === 9 ? root : document;
        if (!doc.getElementById(STYLE_ID) && (doc.head || doc.documentElement)) {
          var ds = doc.createElement('style');
          ds.id = STYLE_ID;
          ds.textContent = HIDE_CSS;
          (doc.head || doc.documentElement).appendChild(ds);
        }
      }
    } catch (e) { /* noop */ }
  }

  function hidePost(item, reason) {
    if (!item || item.classList.contains(HIDDEN_CLASS) || isProtected(item) || inYouTubeWidget(item)) return;
    ensureHideStyle(item);
    item.classList.add(HIDDEN_CLASS);
    item.setAttribute('data-pt-ig-hidden', reason);
    item.style.setProperty('display', 'none', 'important');
    var vids = item.querySelectorAll('video');
    for (var i = 0; i < vids.length; i++) {
      try { vids[i].pause(); } catch (e) { /* noop */ }
    }
  }

  /* ======================================================================
     2) Deep query — document + all shadow roots (+ same-origin iframes)
     ====================================================================== */
  function collectAllRoots() {
    var roots = [];
    var seen = new Set();
    var queue = [document];

    // include roots captured by the attachShadow hook (covers closed roots)
    knownShadowRoots.forEach(function (r) {
      if (r.host && r.host.isConnected) queue.push(r);
      else knownShadowRoots.delete(r);
    });

    while (queue.length) {
      var root = queue.shift();
      if (!root || seen.has(root)) continue;
      seen.add(root);
      roots.push(root);
      var all;
      try { all = root.querySelectorAll('*'); } catch (e) { continue; }
      for (var i = 0; i < all.length; i++) {
        var el = all[i];
        if (el.shadowRoot && !seen.has(el.shadowRoot)) {
          queue.push(el.shadowRoot);
          if (!knownShadowRoots.has(el.shadowRoot)) {
            knownShadowRoots.add(el.shadowRoot);
            observeRoot(el.shadowRoot);
          }
        }
        if (el.tagName === 'IFRAME') {
          try {
            var d = el.contentDocument;
            if (d && d.documentElement && !seen.has(d)) queue.push(d);
          } catch (e) { /* cross-origin — not accessible */ }
        }
      }
    }
    return roots;
  }

  function deepQueryAll(selector) {
    var out = [];
    var roots = collectAllRoots();
    for (var i = 0; i < roots.length; i++) {
      try {
        var list = roots[i].querySelectorAll(selector);
        for (var j = 0; j < list.length; j++) out.push(list[j]);
      } catch (e) { /* noop */ }
    }
    return out;
  }
  // exposed for debugging in DevTools: window.__ptIgFilter.deepQueryAll('img')
  window.__ptIgFilter = { deepQueryAll: deepQueryAll, rescan: function () { runScan(); } };

  /* ======================================================================
     3) Caption text detection (per root)
     ====================================================================== */
  function scanBlockedText(root) {
    var start = root.nodeType === 9 ? root.body : root;
    if (!start) return;
    var walker = document.createTreeWalker(start, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = walker.nextNode())) {
      var parent = n.parentElement;
      if (!parent || parent.closest('script, style, textarea, noscript')) continue;
      // caption may be split across several <span>s → check a few small ancestors
      var matchEl = null;
      if (containsBlockedPhrase(n.nodeValue)) matchEl = parent;
      for (var a = parent, lvl = 0; !matchEl && a && lvl < 4; a = a.parentElement, lvl++) {
        var at = a.textContent || '';
        if (at.length > 800) break;
        if (containsBlockedPhrase(at)) {
          // must be the DEEPEST element holding the whole phrase; if a child
          // already contains it, this text node is unrelated (e.g. close "×")
          var childHas = false;
          for (var ch = a.firstElementChild; ch; ch = ch.nextElementSibling) {
            if (containsBlockedPhrase(ch.textContent)) { childHas = true; break; }
          }
          if (!childHas) matchEl = a;
          break;
        }
      }
      if (!matchEl) continue;
      if (isInsideHidden(matchEl) || inYouTubeWidget(matchEl)) continue;
      var item = resolvePostBlock(matchEl);
      if (item) hidePost(item, 'archived-live');
    }
    var attrEls = start.querySelectorAll('img[alt], [aria-label], [title]');
    for (var i = 0; i < attrEls.length; i++) {
      var el = attrEls[i];
      var txt = (el.getAttribute('alt') || '') + (el.getAttribute('aria-label') || '') + (el.getAttribute('title') || '');
      if (!containsBlockedPhrase(txt) || isInsideHidden(el) || inYouTubeWidget(el)) continue;
      var it = resolvePostBlock(el);
      if (it) hidePost(it, 'archived-live');
    }
  }

  /* ======================================================================
     4) Broken / empty media detection (IG-related roots only)
     ====================================================================== */
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

  function hasHealthyMedia(item) {
    var imgs = item.querySelectorAll('img');
    for (var i = 0; i < imgs.length; i++) {
      var w = imgs[i].getAttribute('width');
      if (w && parseInt(w, 10) < 60) continue; // ignore avatars/icons
      if (!isImgBroken(imgs[i])) return true;
    }
    var vids = item.querySelectorAll('video');
    for (var j = 0; j < vids.length; j++) {
      if (!isVideoBroken(vids[j])) return true;
    }
    if (item.querySelector('iframe[src]')) return true;
    return hasBackgroundImage(item);
  }

  // Only judge "empty" posts that are on screen — off-screen slides are lazy-loaded
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

  function isIgElement(el) {
    if (inYouTubeWidget(el)) return false;
    var hit = closestDeep(el, IG_ROOT_SELECTOR + ',' + POPUP_ROOT_SELECTOR);
    if (!hit) return false;
    // Skip site-own dialogs that are not Instagram related (e.g. schedule modal)
    if (hit.matches(STRICT_POPUP_SHELL) &&
        !hit.querySelector('[class*="eapps"], [class*="instagram"], [class*="Instagram"], a[href*="instagram.com"]') &&
        !closestDeep(hit, '[class*="eapps"], [class*="elfsight"]')) return false;
    return true;
  }

  function isIgShadowRoot(root) {
    if (!(root instanceof ShadowRoot)) return false;
    if (root.host && inYouTubeWidget(root.host)) return false;
    if (root.host && isIgElement(root.host)) return true;
    return !!root.querySelector('[class*="eapps-instagram"], [class*="instagram"], [class*="Instagram"], a[href*="instagram.com"]');
  }

  function scanBrokenMedia(root, wholeRootIsIg) {
    var items = root.querySelectorAll(ITEM_SELECTOR);
    var checked = new Set();
    for (var i = 0; i < items.length; i++) {
      if (!wholeRootIsIg && !isIgElement(items[i])) continue;
      var post = findPostItem(items[i]);
      if (post && !checked.has(post)) { checked.add(post); checkItemMedia(post); }
    }

    var samples = new Set();
    var media = root.querySelectorAll('img, video');
    for (var k = 0; k < media.length; k++) {
      var m = media[k];
      if (!wholeRootIsIg && !isIgElement(m)) continue;
      attachErrorListener(m);
      var item = findPostItem(m);
      if (!item) continue;
      if (m.tagName === 'IMG' && isImgBroken(m) === 'error') checkItemMedia(item);
      if (m.tagName === 'VIDEO' && isVideoBroken(m) === 'error') checkItemMedia(item);
      if (item.parentElement) samples.add(item);
    }
    samples.forEach(function (sample) {
      var parent = sample.parentElement;
      if (!parent) return;
      var sig = classSignature(sample);
      for (var c = parent.firstElementChild; c; c = c.nextElementSibling) {
        if (classSignature(c) === sig) checkItemMedia(c);
      }
    });
  }

  function attachErrorListener(el) {
    if (el.__ptIgErrBound) return;
    el.__ptIgErrBound = true;
    el.addEventListener('error', function () {
      var item = findPostItem(el) || findSingleCard(el);
      if (item && !hasHealthyMedia(item)) hidePost(item, 'media-error');
    }, true);
  }

  /* ======================================================================
     Scan orchestration
     ====================================================================== */
  function runScan() {
    try {
      var roots = collectAllRoots();
      for (var i = 0; i < roots.length; i++) {
        var root = roots[i];
        scanBlockedText(root);
        if (root.nodeType === 9) scanBrokenMedia(root, false);
        else scanBrokenMedia(root, isIgShadowRoot(root));
      }
    } catch (e) {
      if (window.console) console.warn('[IG filter]', e);
    }
  }

  var scheduled = false;
  var lastScan = 0;
  var MIN_SCAN_GAP_MS = 150;
  function scheduleScan() {
    if (scheduled || !started) return;
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

  function onMutations(mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var t = mutations[i].target;
      var el = t.nodeType === 1 ? t : t.parentElement;
      if (el && el.classList && el.classList.contains(HIDDEN_CLASS)) continue;
      scheduleScan();
      return;
    }
  }

  var OBSERVE_OPTS = {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['src', 'srcset', 'style', 'class', 'alt']
  };

  function observeRoot(root) {
    if (!rootObserver || !root || observedRoots.has(root)) return;
    try {
      rootObserver.observe(root, OBSERVE_OPTS);
      observedRoots.add(root);
    } catch (e) { /* noop */ }
  }

  var started = false;
  function start() {
    if (started) return;
    started = true;
    rootObserver = new MutationObserver(onMutations);
    observeRoot(document.body);
    knownShadowRoots.forEach(observeRoot);

    ensureHideStyle(document.body);
    runScan();

    // Media load errors don't bubble → capture phase (works for light DOM)
    document.addEventListener('error', function (ev) {
      var tgt = ev.target;
      if (!tgt || !(tgt.tagName === 'IMG' || tgt.tagName === 'VIDEO' || tgt.tagName === 'SOURCE')) return;
      var host = tgt.tagName === 'SOURCE' ? tgt.parentElement : tgt;
      if (!host || !isIgElement(host)) return;
      var item = findPostItem(host) || findSingleCard(host);
      if (item && !hasHealthyMedia(item)) hidePost(item, 'media-error');
    }, true);

    // Periodic safety net (grace-period expiry, late popups, new shadow roots)
    setInterval(runScan, 1500);

    // Re-scan right after user interaction (opening widget / popup / next arrow)
    document.addEventListener('click', function () {
      scheduleScan();
      setTimeout(runScan, 250);
      setTimeout(runScan, 800);
      setTimeout(runScan, 2000);
    }, true);
    document.addEventListener('keydown', function () { setTimeout(runScan, 250); }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
