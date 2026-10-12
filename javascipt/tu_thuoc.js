// 1. Lấy các phần tử HTML ra để JS điều khiển
const modal = document.getElementById('addMedicineModal');
const btnOpen = document.getElementById('btn-open-modal');
const btnClose = document.getElementById('btn-close-modal');
const btnCancel = document.getElementById('btn-cancel-modal');

// 2. Chức năng MỞ Modal: Lắng nghe sự kiện click vào nút "+ Thêm thuốc"
btnOpen.addEventListener('click', function() {
    modal.classList.add('active'); // Thêm class 'active' để đổi display: none -> flex
});

// 3. Chức năng ĐÓNG Modal: Lắng nghe click vào dấu (X) hoặc nút "Hủy bỏ"
btnClose.addEventListener('click', function() {
    modal.classList.remove('active'); // Gỡ class 'active' đi để giấu Modal
});

btnCancel.addEventListener('click', function() {
    modal.classList.remove('active');
});

// Chức năng nâng cao: Click ra vùng đen mờ bên ngoài cũng đóng Modal
modal.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.classList.remove('active');
    }
});