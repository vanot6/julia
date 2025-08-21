document.addEventListener('DOMContentLoaded', function () {
  // --- Mobile Menu Toggle ---
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const mainNav = document.getElementById('main-nav');
  const navLinks = mainNav ? mainNav.querySelectorAll('a') : [];

  if (menuToggleBtn && mainNav) {
    menuToggleBtn.addEventListener('click', function () {
      mainNav.classList.toggle('is-open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', function () {
        if (mainNav.classList.contains('is-open')) {
          mainNav.classList.remove('is-open');
        }
      });
    });
  }

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId.length > 1) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --- Contact Form: submit to Formspree ---
  const form = document.getElementById('contact-form');
  const formResponse = document.getElementById('form-response');

  function showFormMessage(message, type) {
    if (!formResponse) return;
    formResponse.textContent = message;
    formResponse.className = 'form-message ' + (type === 'error' ? 'error' : 'success');
    formResponse.classList.remove('hidden');
  }

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const name = (document.getElementById('name') || {}).value?.trim();
      const email = (document.getElementById('email') || {}).value?.trim();
      const message = (document.getElementById('message') || {}).value?.trim();

      if (!name || !email || !message) {
        showFormMessage('Пожалуйста, заполните обязательные поля (Имя, Email, Сообщение).', 'error');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      try {
        const formData = new FormData(form);
        formData.append('_source', window.location.href);

        const res = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          form.reset();
          showFormMessage('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.', 'success');
        } else {
          let errorText = 'Не удалось отправить форму. Попробуйте позже или напишите на ics-russia@mail.ru';
          try {
            const data = await res.json();
            if (data && data.errors && data.errors.length) {
              errorText = data.errors.map(e => e.message).join('; ');
            }
          } catch (_) {}
          showFormMessage(errorText, 'error');
        }
      } catch (err) {
        showFormMessage('Ошибка сети. Проверьте подключение и попробуйте ещё раз.', 'error');
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  // --- Animate Sections on Scroll ---
  const sections = document.querySelectorAll('section');
  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
});