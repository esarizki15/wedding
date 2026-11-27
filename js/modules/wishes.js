(function (Undangan) {
  'use strict';

  function renderWishes(list, wishes) {
    list.replaceChildren();
    if (!wishes.length) {
      const li = document.createElement('li');
      li.className = 'wish-empty';
      li.textContent = 'Belum ada ucapan. Jadilah yang pertama.';
      list.append(li);
      return;
    }
    for (const w of wishes) {
      const li = document.createElement('li');
      const name = document.createElement('strong');
      const msg = document.createElement('p');
      name.textContent = w.name;     // textContent: data pengguna tidak pernah jadi HTML
      msg.textContent = w.message;
      li.append(name, msg);
      list.append(li);
    }
  }

  function initWishes() {
    const form = document.querySelector('[data-wish-form]');
    const list = document.querySelector('[data-wish-list]');
    const status = document.querySelector('[data-wish-status]');
    const counter = document.querySelector('[data-counter]');
    if (!form || !list) return;

    const say = (text) => { status.textContent = text; };

    const textarea = form.elements.message;
    textarea.addEventListener('input', () => {
      counter.textContent = `${textarea.value.length}/${Undangan.MAX_MESSAGE}`;
    });

    // MODE DEMO: SUPABASE belum diisi → pakai data contoh, kiriman hanya lokal.
    if (!Undangan.isConfigured()) {
      const local = [...Undangan.DUMMY_WISHES];
      renderWishes(list, local);
      say('Mode demo: ucapan contoh, kiriman tidak disimpan.');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        local.unshift({ name: form.elements.name.value.trim(), message: form.elements.message.value.trim() });
        renderWishes(list, local);
        form.elements.message.value = '';
        counter.textContent = `0/${Undangan.MAX_MESSAGE}`;
        say('Terkirim! (demo, tidak disimpan)');
      });
      return;
    }

    const load = () =>
      Undangan.fetchWishes().then((w) => renderWishes(list, w)).catch(() => say('Gagal memuat ucapan.'));
    load();

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      say('Mengirim…');
      try {
        await Undangan.sendWish({
          name: form.elements.name.value,
          message: form.elements.message.value,
          attendance: form.elements.attendance.value,
        });
        say('Terkirim! Terima kasih.');
        form.elements.message.value = '';
        counter.textContent = `0/${Undangan.MAX_MESSAGE}`;
        load();
      } catch (err) {
        say(err.message === 'already-sent'
          ? 'Link undangan ini sudah pernah mengirim ucapan.'
          : 'Gagal mengirim, coba lagi.');
      } finally {
        btn.disabled = false;
      }
    });
  }

  Object.assign(Undangan, { initWishes });
})((window.Undangan = window.Undangan || {}));
