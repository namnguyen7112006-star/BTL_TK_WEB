<<<<<<< HEAD
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
=======
/*
    File JavaScript chính của project.

    Hiện tại chỉ là khuôn.
    Các thành viên sẽ tự phát triển chức năng
    bằng JavaScript ở các module của mình.
*/

console.log("Health Management - Project initialized");
>>>>>>> feature/trang-chu-lich-hen
