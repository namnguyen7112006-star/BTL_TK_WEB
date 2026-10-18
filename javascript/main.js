// JavaScript dùng chung cho các trang
document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById("patient-menu-toggle");
    const submenu = document.getElementById("patient-submenu");

    if (toggle && submenu) {
        toggle.addEventListener("click", function () {
            const isExpanded = toggle.getAttribute("aria-expanded") === "true";
            toggle.setAttribute("aria-expanded", String(!isExpanded));
            submenu.hidden = isExpanded;
            const arrow = toggle.querySelector(".menu-arrow");
            if (arrow) arrow.textContent = isExpanded ? "+" : "−";
        });
    }

    document.querySelectorAll("[data-close]").forEach(function (button) {
        button.addEventListener("click", function () {
            const dialog = document.getElementById(button.dataset.close);
            if (dialog) dialog.close();
        });
    });
});
