(function (Undangan) {
  'use strict';

  /**
   * Memecah teks [data-split="letters"|"type"] jadi span per huruf.
   * - Struktur di dalam elemen (<span>, <br>) dipertahankan.
   * - Huruf dibungkus per kata (nowrap) agar baris tidak patah di tengah kata.
   * - --char-i dan --char-count diisi di sini; CSS yang menghitung jeda.
   * - Aksesibilitas: teks utuh dipasang di .sr-only; versi terpecah aria-hidden.
   * Panggil SETELAH teks final terpasang (mis. setelah initGuestName).
   */
  function initSplitLetters(root = document) {
    root.querySelectorAll('[data-split="letters"], [data-split="type"]').forEach(split);
  }

  function split(el) {
    let host = el;
    if (el.getAttribute('aria-hidden') !== 'true') {
      const label = document.createElement('span');
      label.className = 'sr-only';
      label.textContent = el.textContent.replace(/\s+/g, ' ').trim();
      host = document.createElement('span');
      host.setAttribute('aria-hidden', 'true');
      host.append(...el.childNodes);
      el.replaceChildren(label, host);
    }

    const chars = [];
    walk(host, chars);
    chars.forEach((c, i) => c.style.setProperty('--char-i', i));
    chars.at(-1)?.classList.add('split__char--last');
    el.style.setProperty('--char-count', chars.length);
    el.setAttribute('data-split-ready', '');
  }

  function walk(node, chars) {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === Node.ELEMENT_NODE) { walk(child, chars); continue; }
      if (child.nodeType !== Node.TEXT_NODE) continue;
      const text = child.textContent.replace(/\s+/g, ' ');
      if (!text.trim()) continue;

      const frag = document.createDocumentFragment();
      for (const part of text.split(/( )/)) {
        if (!part) continue;
        if (part === ' ') { frag.append(' '); continue; }
        const word = document.createElement('span');
        word.className = 'split__word';
        for (const ch of Array.from(part)) { // Array.from: emoji tidak terbelah
          const c = document.createElement('span');
          c.className = 'split__char';
          c.textContent = ch;
          word.append(c);
          chars.push(c);
        }
        frag.append(word);
      }
      child.replaceWith(frag);
    }
  }

  Object.assign(Undangan, { initSplitLetters });
})((window.Undangan = window.Undangan || {}));
