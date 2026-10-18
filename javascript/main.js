document.addEventListener("DOMContentLoaded", function () {
    const menuDrops = document.querySelectorAll(".menu-drop");

    menuDrops.forEach(function (item) {
        item.addEventListener("click", function () {
            const parent = this.parentElement;
            const icon = this.querySelector(".drop-icon");

            parent.classList.toggle("open");

            if (parent.classList.contains("open")) {
                icon.textContent = "-";
            } else {
                icon.textContent = "+";
            }
        });
    });
});
