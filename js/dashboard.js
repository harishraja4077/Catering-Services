document.addEventListener("DOMContentLoaded", function () {
  // ===== Sidebar toggle (mobile) =====
  const sidebarToggle = document.querySelector(".sidebar-toggle");
  const sidebar = document.querySelector(".dash-sidebar");
  const overlay = document.querySelector(".sidebar-overlay");

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove("open");
    if (overlay) overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", function () {
      sidebar.classList.toggle("open");
      if (overlay) overlay.classList.toggle("active");
      document.body.style.overflow = sidebar.classList.contains("open") ? "hidden" : "";
    });
  }

  if (overlay) {
    overlay.addEventListener("click", closeSidebar);
  }

  if (sidebar) {
    sidebar.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        if (window.innerWidth <= 992) closeSidebar();
      });
    });
  }

  // ===== Dashboard stat counter animation =====
  const statNumbers = document.querySelectorAll(".stat-num[data-target]");

  function animateNumber(el) {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || "";
    let current = 0;
    const increment = Math.max(target / 60, 1);
    const timer = setInterval(function () {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString() + suffix;
    }, 25);
  }

  if (statNumbers.length > 0 && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateNumber(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    statNumbers.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ===== Animate progress bars when visible =====
  const progressFills = document.querySelectorAll(".progress-fill[data-width]");
  const chartBars = document.querySelectorAll(".chart-bar-col .bar[data-height]");

  function animateBars() {
    progressFills.forEach(function (fill) {
      fill.style.width = fill.dataset.width + "%";
    });
    chartBars.forEach(function (bar, i) {
      setTimeout(function () {
        bar.style.height = bar.dataset.height + "%";
      }, i * 80);
    });
  }

  if ("IntersectionObserver" in window) {
    const animSection = document.querySelector(".dash-main") || document.body;
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateBars();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(animSection);
  } else {
    animateBars();
  }

  // ===== Animate donut charts =====
  const donuts = document.querySelectorAll(".donut[data-value]");
  donuts.forEach(function (donut) {
    const value = parseInt(donut.dataset.value);
    donut.style.setProperty("--p", 0);
    let current = 0;
    const timer = setInterval(function () {
      current += value / 60;
      if (current >= value) {
        current = value;
        clearInterval(timer);
      }
      donut.style.setProperty("--p", current);
    }, 30);
  });

  // ===== Tab switching (table filter tabs) =====
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  if (tabBtns.length > 0) {
    tabBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const target = this.dataset.tab;
        tabBtns.forEach(function (b) { b.classList.remove("active"); });
        this.classList.add("active");
        tabPanes.forEach(function (pane) {
          pane.style.display = pane.dataset.pane === target ? "block" : "none";
        });
      });
    });
  }

  // ===== Filter search input (tables) =====
  const dashSearch = document.getElementById("dashSearch");
  if (dashSearch) {
    dashSearch.addEventListener("input", function () {
      const term = this.value.toLowerCase();
      document.querySelectorAll(".dash-table tbody tr").forEach(function (row) {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? "" : "none";
      });
    });
  }

  // ===== Action button feedback (view/edit/delete) =====
  document.querySelectorAll(".action-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const original = this.innerHTML;
      this.innerHTML = '<i class="fas fa-check"></i>';
      this.style.color = "#2e7d32";
      this.style.borderColor = "#a5d6a7";
      setTimeout(function () {
        this.innerHTML = original;
        this.style.color = "";
        this.style.borderColor = "";
      }.bind(this), 1200);
    });
  });

  // ===== Logout confirmation =====
  document.querySelectorAll(".logout-link, .logout-btn").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const confirmed = confirm("Are you sure you want to sign out?");
      if (confirmed) {
        window.location.href = "signin.html";
      }
    });
  });

  // ===== Quick action: export demo =====
  document.querySelectorAll(".export-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      alert("Exporting data... (demo)");
    });
  });

  // ===== Notification bell demo =====
  const notifBtn = document.querySelector(".notif-btn");
  if (notifBtn) {
    notifBtn.addEventListener("click", function () {
      window.location.href = "404.html";
    });
  }

  // ===== Show logged-in email from sign-in =====
  let storedUser = null;
  try {
    storedUser = JSON.parse(localStorage.getItem("StacklyUser") || "null");
  } catch (e) {
    storedUser = null;
  }

  if (storedUser && storedUser.email) {
    const email = storedUser.email;
    const initials = email
      .replace(/@.*$/, "")
      .split(/[\s._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(function (p) { return p.charAt(0).toUpperCase(); })
      .join("") || "U";

    document.querySelectorAll(".sidebar-user .avatar").forEach(function (a) {
      a.textContent = initials;
    });
    document.querySelectorAll(".dash-top-avatar").forEach(function (a) {
      a.textContent = initials;
      a.title = email;
    });

    const nameEl = document.querySelector(".sidebar-user .user-info .user-name");
    if (nameEl) nameEl.textContent = email;

    const roleEl = document.querySelector(".sidebar-user .user-info .user-role");
    if (roleEl) roleEl.textContent = storedUser.role === "admin" ? "Administrator" : "Member";

    const greet = document.querySelector(".dash-greeting h1");
    if (greet) {
      const first = email.split("@")[0];
      const pretty = first.charAt(0).toUpperCase() + first.slice(1);
      greet.textContent = greet.textContent.replace(/John/, pretty);
    }
  }
});
