(function () {
  var nav = document.querySelector(".mobile-nav");
  var toggle = document.querySelector(".nav-toggle");
  if (toggle && nav) {
    var label = toggle.querySelector(".nav-toggle-label");
    function setNavOpen(open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Menu");
      if (label) {
        label.textContent = open
          ? label.getAttribute("data-close") || "X"
          : label.getAttribute("data-open") || "Menu";
      }
    }
    toggle.addEventListener("click", function () {
      setNavOpen(!nav.classList.contains("is-open"));
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

  document.querySelectorAll("iframe.buzz").forEach(function (iframe) {
    iframe.setAttribute("scrolling", "no");
  });

  document.querySelectorAll(".workshop-carousel").forEach(function (carousel) {
    var track = carousel.querySelector(".workshop-carousel-track");
    var slides = carousel.querySelectorAll(".workshop-carousel-slide");
    var dots = carousel.querySelector(".workshop-carousel-dots");
    var count = carousel.querySelector(".workshop-carousel-count");
    var caption = carousel.querySelector(".workshop-caption");
    if (!track || !slides.length || !dots || !count) return;

    var index = 0;

    function render() {
      track.style.transform = "translateX(-" + index * 100 + "%)";
      count.textContent = index + 1 + " of " + slides.length;
      if (caption) {
        caption.textContent = slides[index].getAttribute("data-caption") || "";
      }
      dots.querySelectorAll("button").forEach(function (btn, i) {
        btn.classList.toggle("is-active", i === index);
        btn.setAttribute("aria-current", i === index ? "true" : "false");
      });
    }

    slides.forEach(function (_, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-label", "Show photo " + (i + 1));
      btn.addEventListener("click", function () {
        index = i;
        render();
      });
      dots.appendChild(btn);
    });

    render();
  });

  document.querySelectorAll('.prod-jump a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var header = document.querySelector(".site-header");
      var offset = header ? header.getBoundingClientRect().height + 24 : 110;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  (function initLightbox() {
    var links = Array.prototype.slice.call(document.querySelectorAll("a.lightbox"));
    if (!links.length) return;

    var overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    overlay.hidden = true;
    overlay.innerHTML =
      '<button type="button" class="lightbox-close" aria-label="Close">&times;</button>' +
      '<button type="button" class="lightbox-prev" aria-label="Previous image">&#10094;</button>' +
      '<button type="button" class="lightbox-next" aria-label="Next image">&#10095;</button>' +
      '<figure class="lightbox-figure"><img alt=""><figcaption class="lightbox-caption"></figcaption></figure>';
    document.body.appendChild(overlay);

    var img = overlay.querySelector("img");
    var caption = overlay.querySelector(".lightbox-caption");
    var btnClose = overlay.querySelector(".lightbox-close");
    var btnPrev = overlay.querySelector(".lightbox-prev");
    var btnNext = overlay.querySelector(".lightbox-next");
    var group = [];
    var index = 0;
    var lastFocus = null;

    function show(i) {
      index = i;
      var link = group[index];
      var thumb = link.querySelector("img");
      img.src = link.getAttribute("href");
      img.alt = thumb ? thumb.alt : "";
      var fig = link.closest("figure");
      var cap = fig ? fig.querySelector("figcaption") : null;
      caption.textContent = cap ? cap.textContent.trim() : "";
      caption.hidden = !caption.textContent;
      var multi = group.length > 1;
      btnPrev.hidden = !multi;
      btnNext.hidden = !multi;
    }

    function open(startLink) {
      var g = startLink.getAttribute("data-lightbox-group");
      group = g
        ? links.filter(function (l) {
            return l.getAttribute("data-lightbox-group") === g;
          })
        : [startLink];
      var start = group.indexOf(startLink);
      lastFocus = document.activeElement;
      overlay.hidden = false;
      document.body.classList.add("lightbox-open");
      show(start < 0 ? 0 : start);
      btnClose.focus();
    }

    function close() {
      overlay.hidden = true;
      document.body.classList.remove("lightbox-open");
      img.removeAttribute("src");
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    function step(dir) {
      if (group.length < 2) return;
      show((index + dir + group.length) % group.length);
    }

    links.forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        open(link);
      });
    });

    btnClose.addEventListener("click", close);
    btnPrev.addEventListener("click", function () {
      step(-1);
    });
    btnNext.addEventListener("click", function () {
      step(1);
    });
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener("keydown", function (e) {
      if (overlay.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });
  })();
})();
