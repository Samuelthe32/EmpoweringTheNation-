// style.js

// Wait until the page has fully loaded before running any code
document.addEventListener("DOMContentLoaded", () => {

  // Get the "Calculate" button from the form page
  const calculateBtn = document.getElementById("calculateBtn");

  // ----------------- FORM PAGE (selecting courses) -----------------
  if (calculateBtn) {
    calculateBtn.addEventListener("click", () => {
      // Get all checkboxes that are checked
      const selectedCourses = document.querySelectorAll(
        'input[name="courses"]:checked'
      );

      let courses = [];   // To store all selected courses
      let subtotal = 0;   // To keep track of total price before discount & VAT

      // Go through each selected course
      selectedCourses.forEach((course) => {
        let courseName = course.dataset.name;     // ✅ Get name from data-name
        let price = parseFloat(course.value);     // Convert value (string) → number

        // Save this course into our list
        courses.push({ name: courseName, price: price });

        // Add price to subtotal
        subtotal += price;
      });

      // Apply 10% discount if subtotal is R3000 or more
      let discount = subtotal >= 3000 ? subtotal * 0.1 : 0;

      // VAT = 15% of (subtotal - discount)
      let vat = (subtotal - discount) * 0.15;

      // Final total = subtotal - discount + VAT
      let total = subtotal - discount + vat;

      // Save everything in localStorage (so we can use it on the results page)
      localStorage.setItem("courses", JSON.stringify(courses));
      localStorage.setItem("subtotal", subtotal.toFixed(2));
      localStorage.setItem("discount", discount.toFixed(2));
      localStorage.setItem("vat", vat.toFixed(2));
      localStorage.setItem("total", total.toFixed(2));

      // Move to the results page
      window.location.href = "results-display-page.html";
    });
  }

  // ----------------- RESULTS PAGE (showing totals) -----------------
  if (window.location.pathname.includes("results-display-page.html")) {
    // Get elements where results will be displayed
    const courseList = document.getElementById("courseList");
    const subtotalSpan = document.getElementById("subtotal");
    const discountSpan = document.getElementById("discount");
    const vatSpan = document.getElementById("vat");
    const totalSpan = document.getElementById("total");

    // Load stored values from localStorage
    let courses = JSON.parse(localStorage.getItem("courses")) || [];
    let subtotal = localStorage.getItem("subtotal") || "0.00";
    let discount = localStorage.getItem("discount") || "0.00";
    let vat = localStorage.getItem("vat") || "0.00";
    let total = localStorage.getItem("total") || "0.00";

    // Function to format numbers as Rand values (R1,500.00)
    function formatPrice(num) {
      return "R" + parseFloat(num).toLocaleString("en-ZA", { minimumFractionDigits: 2 });
    }

    // Show selected courses in a list
    courseList.innerHTML = "";
    courses.forEach((course) => {
      let li = document.createElement("li");
      li.textContent = `${course.name} - ${formatPrice(course.price)}`;
      courseList.appendChild(li);
    });

    // Show totals
    subtotalSpan.textContent = formatPrice(subtotal);
    discountSpan.textContent = formatPrice(discount);
    vatSpan.textContent = formatPrice(vat);
    totalSpan.textContent = formatPrice(total);
  }
});
