document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".carousel-container");
  const images = document.querySelectorAll(".carousel-image");
  const dotsContainer = document.querySelector(".dots-container");
  const gridContainers = document.querySelectorAll(".gallery-grid");
  const hamburger = document.querySelector(".nav-hamburger");
  const menu = document.querySelector(".nav-menu");

  document.getElementById("year").textContent = new Date().getFullYear();

 
  if (hamburger && menu) {
    hamburger.addEventListener("click", () => {
      menu.classList.toggle("active");
      hamburger.classList.toggle("active");
      hamburger.setAttribute("aria-expanded", menu.classList.contains("active"));
    });

    document.body.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove("active");
        hamburger.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
      }
    }, { passive: true });
  }

  let index = 1; // Start at first real image
  const totalImages = images.length;

 
  [...Array(totalImages - 2)].forEach((_, i) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i + 1));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".dot");

  
  function updateCarousel() {
    requestAnimationFrame(() => {
      container.style.transition = "transform 1s ease-in-out";
      container.style.transform = `translateX(-${index * 100}%)`;

      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index - 1);
      });
    });
  }

  function nextSlide() {
    index++;
    updateCarousel();
  }

  function goToSlide(i) {
    index = i;
    updateCarousel();
  }


container.addEventListener("transitionend", () => {
  if (index >= totalImages - 1) {
    requestAnimationFrame(() => {
      container.style.transition = "none"; // Temporarily remove transition
      index = 1; // Reset index
      container.style.transform = `translateX(-${index * 100}%)`;

      
      requestAnimationFrame(() => {
        container.style.transition = "transform 1s ease-in-out";
      });
    });
  }
});

 
  let lastTime = 0;
  function autoSlide(timestamp) {
    if (timestamp - lastTime > 4000) {
      nextSlide();
      lastTime = timestamp;
    }
    requestAnimationFrame(autoSlide);
  }
  requestAnimationFrame(autoSlide);

  gridContainers.forEach((gridContainer) => {
    const galleryImages = gridContainer.querySelectorAll(".gallery-img");

 
    const rows = {};
    galleryImages.forEach((img) => {
      const top = Math.round(img.getBoundingClientRect().top);
      rows[top] = rows[top] || [];
      rows[top].push(img);
    });

    Object.keys(rows).sort().forEach((key, rowIndex) => {
      rows[key].forEach((img, colIndex) => {
        img.style.transitionDelay = `${rowIndex * 200 + colIndex * 100}ms`;
      });
    });

 
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px", threshold: 0.115 });

    galleryImages.forEach((image) => observer.observe(image));
  });
});
