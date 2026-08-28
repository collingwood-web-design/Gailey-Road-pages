(function () {
  var nav = document.querySelector(".mobile-nav");
  var toggle = document.querySelector(".nav-toggle");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  document.querySelectorAll(".has-sub > a").forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (window.matchMedia("(max-width: 980px)").matches) {
        e.preventDefault();
        link.parentElement.classList.toggle("open");
      }
    });
  });

  document.querySelectorAll(".readmore-wrap").forEach(function (wrap) {
    var btn = wrap.querySelector(".readmore-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var collapsed = wrap.classList.toggle("is-collapsed");
      btn.textContent = collapsed ? "Read more" : "Read less";
    });
  });

  document.querySelectorAll(".newsletter-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var box = form.closest(".newsletter");
      if (box) box.classList.add("success");
    });
  });

  document.querySelectorAll(".oas-bio-toggle-input").forEach(function (input) {
    var entry = input.closest(".oas-cast-entry");
    if (!entry) return;
    var shortBio = entry.querySelector(".oas-bio-short");
    var fullBio = entry.querySelector(".oas-bio-full");
    function sync() {
      var showFull = input.checked;
      if (shortBio) shortBio.hidden = showFull;
      if (fullBio) fullBio.hidden = !showFull;
      input.setAttribute("aria-checked", showFull ? "true" : "false");
    }
    input.addEventListener("change", sync);
    sync();
  });
})();
