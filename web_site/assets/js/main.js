(function () {
  "use strict";

  const API_URL = "http://localhost:3000/api/";
  const SEND_MESSAGE = API_URL + "messages/";
  const GET_USER_COUNT = API_URL + "users/counts";

  // Fetch stats data from the backend
  async function fetchStats() {
    try {
      const response = await fetch(GET_USER_COUNT);
      const data = await response.json();

      // Loop through the response data and update the appropriate counters
      data.forEach((item) => {
        if (item.user_type === "Customer") {
          updateCounter("satisfied-customers", item.count);
        } else if (item.user_type === "Merchant") {
          updateCounter("active-retail-partners", item.count);
        } else if (item.user_type === "Driver") {
          updateCounter("active-delivery-partners", item.count);
        }
      });

      // Reset and reinitialize PureCounter after setting new values
      PureCounter.reset();
      new PureCounter();
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }

  // Function to update a counter value dynamically
  function updateCounter(elementId, endValue) {
    const element = document.getElementById(elementId);
    element.setAttribute("data-purecounter-end", endValue);
  }

  // Call the fetch function when the page loads
  window.onload = fetchStats;
  
  /**
   * Toggle the 'scrolled' class on the body element when the page is scrolled past 100px.
   * This can be used to change styles based on scroll position.
   */
  function toggleScrolled() {
    const selectBody = document.querySelector("body");
    const selectHeader = document.querySelector("#header");
    if (
      !selectHeader.classList.contains("scroll-up-sticky") &&
      !selectHeader.classList.contains("sticky-top") &&
      !selectHeader.classList.contains("fixed-top")
    )
      return;
    window.scrollY > 100
      ? selectBody.classList.add("scrolled")
      : selectBody.classList.remove("scrolled");
  }

  document.addEventListener("scroll", toggleScrolled);
  window.addEventListener("load", toggleScrolled);

  /**
   * Toggle the mobile navigation menu when the menu button is clicked.
   * This toggles between showing and hiding the menu on smaller screens.
   */
  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");

  function mobileNavToggle() {
    document.querySelector("body").classList.toggle("mobile-nav-active");
    mobileNavToggleBtn.classList.toggle("bi-list");
    mobileNavToggleBtn.classList.toggle("bi-x");
  }
  mobileNavToggleBtn.addEventListener("click", mobileNavToggle);

  /**
   * Close the mobile navigation menu when a navigation link is clicked.
   * This ensures that the menu hides after navigating to a section on the same page.
   */
  document.querySelectorAll("#navmenu a").forEach((navmenu) => {
    navmenu.addEventListener("click", () => {
      if (document.querySelector(".mobile-nav-active")) {
        mobileNavToggle();
      }
    });
  });

  /**
   * Show or hide the scroll-to-top button based on the scroll position.
   * The button appears when the user scrolls down the page.
   */
  let scrollTop = document.querySelector(".scroll-top");

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100
        ? scrollTop.classList.add("active")
        : scrollTop.classList.remove("active");
    }
  }
  scrollTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  window.addEventListener("load", toggleScrollTop);
  document.addEventListener("scroll", toggleScrollTop);

  /**
   * Initialize AOS (Animate On Scroll) library for scroll animations.
   * AOS adds animations to elements as they enter the viewport.
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }
  window.addEventListener("load", aosInit);

  /**
   * Initialize GLightbox for lightbox effect on images and videos.
   * GLightbox provides a modern, responsive lightbox for media content.
   */
  const glightbox = GLightbox({
    selector: ".glightbox",
  });

  /**
   * Toggle FAQ items on click to expand/collapse the content.
   * This allows users to expand and read more information for each FAQ.
   */
  document
    .querySelectorAll(".faq-item h3, .faq-item .faq-toggle")
    .forEach((faqItem) => {
      faqItem.addEventListener("click", () => {
        faqItem.parentNode.classList.toggle("faq-active");
      });
    });

  /**
   * Scrollspy functionality to highlight navigation items as the user scrolls through sections.
   * This makes it clear which section of the page the user is currently viewing.
   */
  let navmenulinks = document.querySelectorAll(".navmenu a");

  function navmenuScrollspy() {
    navmenulinks.forEach((navmenulink) => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        document
          .querySelectorAll(".navmenu a.active")
          .forEach((link) => link.classList.remove("active"));
        navmenulink.classList.add("active");
      } else {
        navmenulink.classList.remove("active");
      }
    });
  }
  window.addEventListener("load", navmenuScrollspy);
  document.addEventListener("scroll", navmenuScrollspy);

  /**
   * Initialize PureCounter for animating numbers in the stats section.
   * PureCounter provides a simple way to animate number counts on the page.
   */
  new PureCounter();

  // Form submission
  document
    .getElementById("contact-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      // Validation
      let isValid = true;
      const name = document.getElementById("name");
      const email = document.getElementById("email");
      const subject = document.getElementById("subject");
      const message = document.getElementById("message");

      if (!name.value.trim()) {
        name.classList.add("is-invalid");
        isValid = false;
      } else {
        name.classList.remove("is-invalid");
      }

      if (!validateEmail(email.value)) {
        email.classList.add("is-invalid");
        isValid = false;
      } else {
        email.classList.remove("is-invalid");
      }

      if (!subject.value.trim()) {
        subject.classList.add("is-invalid");
        isValid = false;
      } else {
        subject.classList.remove("is-invalid");
      }

      if (!message.value.trim()) {
        message.classList.add("is-invalid");
        isValid = false;
      } else {
        message.classList.remove("is-invalid");
      }

      // If form is valid, submit the data
      if (isValid) {
        const formData = {
          name: name.value,
          email: email.value,
          subject: subject.value,
          message: message.value,
        };

        fetch(SEND_MESSAGE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            showAlert("Message sent successfully!", "alert-success");
            document.getElementById("contact-form").reset();
          })
          .catch((error) => {
            console.error("Error:", error);
            showAlert(
              "Failed to send message. Please try again later.",
              "alert-danger"
            );
          });
      }
    });

  // Email validation function
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Function to show alert
  function showAlert(message, alertType) {
    const formStatus = document.getElementById("form-status");
    const alertMessage = document.getElementById("alert-message");
    const alertIcon = document.getElementById("alert_icon");

    // Set the correct icon and alert class
    if (alertType === "alert-success") {
      alertIcon.setAttribute("xlink:href", "#check-circle-fill");
      formStatus.classList.add("alert-success");
    } else if (alertType === "alert-danger") {
      alertIcon.setAttribute("xlink:href", "#exclamation-triangle-fill");
      formStatus.classList.add("alert-danger");
    }

    formStatus.classList.remove("d-none");
    alertMessage.textContent = message;

    // Hide alert after 2500 milliseconds
    setTimeout(() => {
      formStatus.classList.add("d-none");
      formStatus.classList.remove("alert-success", "alert-danger");
    }, 2500);
  }
})();
