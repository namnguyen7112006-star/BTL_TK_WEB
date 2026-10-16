document.addEventListener("DOMContentLoaded", function() {
    let danhSachLichHen = [];

    function veLichThang() {
        const calendarContainer = document.getElementById("calendarContainer");
        if (!calendarContainer) return;

        let htmlContent = `
            <div class="month-view-grid">
                <div class="wd-header">CN</div>
                <div class="wd-header">Thứ 2</div>
                <div class="wd-header">Thứ 3</div>
                <div class="wd-header">Thứ 4</div>
                <div class="wd-header">Thứ 5</div>
                <div class="wd-header">Thứ 6</div>
                <div class="wd-header">Thứ 7</div>
        `;

        const daysPrev = [27, 28, 29, 30];
        daysPrev.forEach(d => {
            htmlContent += `<div class="day-cell other"><span>${d}</span></div>`;
        });

        for (let i = 1; i <= 31; i++) {
            let dayFormatted = `2026-10-${i < 10 ? '0' + i : i}`;
            let lichCuaNgay = danhSachLichHen.filter(item => item.ngayKham === dayFormatted);
            let eventsHTML = "";
            lichCuaNgay.forEach(ev => {
                eventsHTML += `<div style="background: #007bff; color: #fff; font-size: 10px; padding: 2px; margin-top: 2px; border-radius: 2px; text-align: left; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">${ev.gioKham} - ${ev.hoTen}</div>`;
            });

            htmlContent += `
                <div class="day-cell">
                    <span style="font-weight: bold; display: block; text-align: right; font-size: 12px; color: #333;">${i}</span>
                    <div>${eventsHTML}</div>
                </div>
            `;
        }

        htmlContent += `</div>`;
        calendarContainer.innerHTML = htmlContent;
    }

    function capNhatDanhSachHienThi() {
        const container = document.getElementById("appointmentListContainer");
        if (!container) return;

        if (danhSachLichHen.length === 0) {
            container.innerHTML = `<p style="color: #666; font-size: 13px;">Chưa có lịch hẹn nào được thêm.</p>`;
            return;
        }

        let html = `<ul style="list-style-type: none; padding: 0;">`;
        danhSachLichHen.forEach((item, index) => {
            html += `
                <li style="background: #f8f9fa; border: 1px solid #e5e7eb; padding: 10px; margin-bottom: 8px; border-radius: 4px; font-size: 13px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${index + 1}. Bệnh nhân: ${item.hoTen}</strong> - Giới tính: ${item.gioiTinh} | Ngày sinh: ${item.ngaySinh} <br>
                        <span style="color: #007bff; font-weight: bold;">Lịch khám: Ngày ${item.ngayKham} vào lúc ${item.gioKham}</span>
                        ${item.diaChi ? `<br>Địa chỉ: ${item.diaChi}` : ''}
                    </div>
                </li>
            `;
        });
        html += `</ul>`;
        container.innerHTML = html;
    }

    veLichThang();
    const viewButtons = document.querySelectorAll(".view-btn");
    const calendarTitle = document.getElementById("calendarTitle");

    if (viewButtons.length > 0) {
        viewButtons.forEach(btn => {
            btn.addEventListener("click", function() {
                viewButtons.forEach(b => b.classList.remove("active"));
                this.classList.add("active");

                const view = this.getAttribute("data-view");
                const calendarContainer = document.getElementById("calendarContainer");

                if (view === "month") {
                    calendarTitle.textContent = "Tháng 10 năm 2026";
                    veLichThang();
                } else if (view === "week") {
                    calendarTitle.textContent = "11 - 17 tháng 10, 2026";
                    calendarContainer.innerHTML = `
                        <table style="width: 100%; border-collapse: collapse; text-align: center; font-size: 13px;">
                            <tr style="background: #f3f4f6;">
                                <th style="border: 1px solid #ddd; padding: 10px;">Giờ</th>
                                <th style="border: 1px solid #ddd; padding: 10px;">CN 11/10</th>
                                <th style="border: 1px solid #ddd; padding: 10px;">Thứ 2 12/10</th>
                                <th style="border: 1px solid #ddd; padding: 10px; background: #fef9c3;">Thứ 3 13/10</th>
                            </tr>
                            <tr><td style="border: 1px solid #ddd; padding: 10px;">08:00</td><td style="border: 1px solid #ddd;"></td><td style="border: 1px solid #ddd;"></td><td style="border: 1px solid #ddd; background: #fef9c3;">Trống</td></tr>
                        </table>
                    `;
                } else if (view === "day") {
                    calendarTitle.textContent = "13 tháng 10, 2026";
                    calendarContainer.innerHTML = `
                        <table style="width: 100%; border-collapse: collapse; text-align: center; font-size: 13px;">
                            <tr style="background: #f3f4f6;">
                                <th style="border: 1px solid #ddd; padding: 10px;">Khung giờ</th>
                                <th style="border: 1px solid #ddd; padding: 10px; background: #fef9c3;">Thứ Ba (13/10/2026)</th>
                            </tr>
                            <tr><td style="border: 1px solid #ddd; padding: 10px;">08:00 - 09:00</td><td style="border: 1px solid #ddd; background: #fef9c3;">Chưa có lịch hẹn</td></tr>
                        </table>
                    `;
                }
            });
        });
    }

    const modal = document.getElementById("appointmentModal");
    const openModalBtn = document.getElementById("openModalBtn");
    const closeModal = document.getElementById("closeModal");
    const cancelModalBtn = document.getElementById("cancelModalBtn");
    const appointmentForm = document.getElementById("appointmentForm");

    if (openModalBtn) {
        openModalBtn.addEventListener("click", () => { modal.style.display = "flex"; });
        closeModal.addEventListener("click", () => { modal.style.display = "none"; });
        cancelModalBtn.addEventListener("click", () => { modal.style.display = "none"; });
    }

    const gioiTinhBox = document.getElementById("gioiTinhBox");
    const gioiTinhDropdown = document.getElementById("gioiTinhDropdown");
    const selectedGioiTinh = document.getElementById("selectedGioiTinh");

    if (gioiTinhBox && gioiTinhDropdown) {
        gioiTinhBox.addEventListener("click", (e) => {
            e.stopPropagation();
            gioiTinhDropdown.style.display = gioiTinhDropdown.style.display === "block" ? "none" : "block";
        });

        gioiTinhDropdown.querySelectorAll(".gender-option").forEach(opt => {
            opt.addEventListener("click", (e) => {
                e.stopPropagation();
                selectedGioiTinh.textContent = opt.getAttribute("data-value");
                gioiTinhDropdown.style.display = "none";
                document.getElementById("errGioiTinh").style.display = "none";
            });
        });
    }

    window.addEventListener("click", () => {
        if (gioiTinhDropdown) gioiTinhDropdown.style.display = "none";
    });

    if (appointmentForm) {
        appointmentForm.addEventListener("submit", function(e) {
            e.preventDefault();
            let isValid = true;

            const hoTenVal = document.getElementById("hoTen").value.trim();
            const gioiTinhVal = selectedGioiTinh.textContent.trim();
            const ngaySinhVal = document.getElementById("ngaySinh").value;
            const ngayKhamVal = document.getElementById("ngayKham").value;
            const gioKhamVal = document.getElementById("gioKham").value;
            const diaChiVal = document.getElementById("diaChi").value.trim();

            const errHoTen = document.getElementById("errHoTen");
            const errGioiTinh = document.getElementById("errGioiTinh");
            const errNgaySinh = document.getElementById("errNgaySinh");
            const errNgayKham = document.getElementById("errNgayKham");
            const errGioKham = document.getElementById("errGioKham");

            if (!hoTenVal) { errHoTen.style.display = "block"; isValid = false; } else { errHoTen.style.display = "none"; }
            if (!gioiTinhVal || gioiTinhVal === "Chọn giới tính") { errGioiTinh.style.display = "block"; isValid = false; } else { errGioiTinh.style.display = "none"; }
            if (!ngaySinhVal) { errNgaySinh.style.display = "block"; isValid = false; } else { errNgaySinh.style.display = "none"; }
            if (!ngayKhamVal) { errNgayKham.style.display = "block"; isValid = false; } else { errNgayKham.style.display = "none"; }
            if (!gioKhamVal) { errGioKham.style.display = "block"; isValid = false; } else { errGioKham.style.display = "none"; }

            if (isValid) {
                danhSachLichHen.push({
                    hoTen: hoTenVal,
                    gioiTinh: gioiTinhVal,
                    ngaySinh: ngaySinhVal,
                    ngayKham: ngayKhamVal,
                    gioKham: gioKhamVal,
                    diaChi: diaChiVal
                });

                alert("Thêm lịch hẹn thành công cho bệnh nhân: " + hoTenVal);
                modal.style.display = "none";
                appointmentForm.reset();
                selectedGioiTinh.textContent = "Chọn giới tính";

                veLichThang();
                capNhatDanhSachHienThi();
            }
        });
    }
});
