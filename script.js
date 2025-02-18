document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".carousel-container");
  const images = document.querySelectorAll(".carousel-image");
  const dotsContainer = document.querySelector(".dots-container");
  const gridContainers = document.querySelectorAll(".gallery-grid");
  const hamburger = document.querySelector(".nav-hamburger");
  const menu = document.querySelector(".nav-menu");

  hamburger.addEventListener("click", () => {
    // Toggle menu visibility
    menu.classList.toggle("active");
    hamburger.classList.toggle("active");

    // Update aria-expanded for accessibility
    const expanded = hamburger.classList.contains("active");
    hamburger.setAttribute("aria-expanded", expanded);
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!hamburger.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove("active");
      hamburger.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    }
  });

  let index = 1; // Start at first real image
  const totalImages = images.length;
  let interval;

  // Create Dots for Navigation
  for (let i = 1; i < totalImages - 1; i++) {
    // Ignore duplicates
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (i === 1) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
  const dots = document.querySelectorAll(".dot");

  function updateCarousel() {
    container.style.transition = "transform 1s ease-in-out";
    container.style.transform = `translateX(-${index * 100}%)`;

    // Update active dot
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index - 1); // Adjust for duplicate
    });
  }

  function nextSlide() {
    index++;
    updateCarousel();

    // When reaching the last duplicate, reset instantly
    if (index === totalImages - 1) {
      setTimeout(() => {
        container.style.transition = "none"; // Disable animation
        index = 1; // Reset index
        container.style.transform = `translateX(-${index * 100}%)`; // Jump back
      }, 1000); // Wait for transition to finish
    }
  }

  function goToSlide(i) {
    index = i + 1; // Adjust for duplicate
    updateCarousel();
  }

  function startAutoSlide() {
    interval = setInterval(nextSlide, 4000);
  }

  function stopAutoSlide() {
    clearInterval(interval);
  }

  document
    .querySelector(".carousel")
    .addEventListener("mouseenter", stopAutoSlide);
  document
    .querySelector(".carousel")
    .addEventListener("mouseleave", startAutoSlide);

  startAutoSlide();

  gridContainers.forEach((gridContainer) => {
    const galleryImages = gridContainer.querySelectorAll(".gallery-img");

    // Group images by row using offsetTop (rounding to account for minor differences)
    let rows = {};
    galleryImages.forEach((img) => {
      const top = img.offsetTop;
      const rowKey = Math.round(top / 10) * 10;
      if (!rows[rowKey]) {
        rows[rowKey] = [];
      }
      rows[rowKey].push(img);
    });

    // Sort the rows and assign delays per row and per column
    const sortedRowKeys = Object.keys(rows).sort((a, b) => a - b);
    sortedRowKeys.forEach((key, rowIndex) => {
      rows[key].forEach((img, colIndex) => {
        // Customize these values as desired
        const delay = rowIndex * 200 + colIndex * 100;
        img.style.transitionDelay = `${delay}ms`;
      });
    });

    // Set up the Intersection Observer for this grid container's images
    const observerOptions = {
      root: null, // viewport
      rootMargin: "0px",
      threshold: 0.125,
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    galleryImages.forEach((image) => {
      observer.observe(image);
    });
  });
});
