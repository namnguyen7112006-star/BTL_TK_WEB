// Lấy tên trang hiện tại từ thẻ <body data-page="...">
const trangHienTai = document.body.getAttribute("data-page") || "hoasinh";

// Dữ liệu mẫu riêng cho từng file HTML để mở trang nào lên cũng có sẵn dữ liệu hợp lý
const duLieuMau = {
    hoasinh: [
        { ngay: "2026-10-16", benhNhan: "Nguyễn Văn An", chiDinh: "Tổng phân tích tế bào máu", thongTinRieng: "Máu tĩnh mạch", bacSi: "BS. Nguyễn Hữu Nam", ketQua: "Đã có KQ: Bình thường" },
        { ngay: "2026-10-16", benhNhan: "Trần Thị Bích", chiDinh: "Định lượng Glucose & Mỡ máu", thongTinRieng: "Huyết thanh", bacSi: "BS. Lê Minh Đức", ketQua: "Chờ kết quả" }
    ],
    hinhanh: [
        { ngay: "2026-10-16", benhNhan: "Lê Hoàng Cường", chiDinh: "Chụp X-Quang ngực thẳng", thongTinRieng: "X-Quang KTS", bacSi: "BS. Nguyễn Hữu Nam", ketQua: "Đã có KQ: Phổi sáng" },
        { ngay: "2026-10-16", benhNhan: "Phạm Thu Hà", chiDinh: "Siêu âm tổng quát ổ bụng", thongTinRieng: "Siêu âm 4D", bacSi: "BS. Lê Minh Đức", ketQua: "Chờ kết quả" }
    ],
    thamdo: [
        { ngay: "2026-10-16", benhNhan: "Hoàng Thu Trang", chiDinh: "Đo Điện tâm đồ 12 chuyển đạo", thongTinRieng: "Máy ECG", bacSi: "BS. Nguyễn Hữu Nam", ketQua: "Đã có KQ: Nhịp xoang đều" },
        { ngay: "2026-10-16", benhNhan: "Vũ Minh Khôi", chiDinh: "Nội soi Tai - Mũi - Họng", thongTinRieng: "Ống nội soi mềm", bacSi: "BS. Lê Minh Đức", ketQua: "Chờ kết quả" }
    ],
    thuthuat: [
        { ngay: "2026-10-16", benhNhan: "Đỗ Văn Hậu", chiDinh: "Thay băng, cắt chỉ vết thương", thongTinRieng: "Phòng Tiểu phẫu 1", bacSi: "BS. Nguyễn Hữu Nam", ketQua: "Đã hoàn thành" },
        { ngay: "2026-10-16", benhNhan: "Ngô Gia Bảo", chiDinh: "Khí dung mũi họng", thongTinRieng: "Phòng Thủ thuật 2", bacSi: "BS. Lê Minh Đức", ketQua: "Chờ thực hiện" }
    ]
};

let danhSach = duLieuMau[trangHienTai];

// Các phần tử trên trang
const tbody = document.getElementById("cls-tbody");
const modal = document.getElementById("modal-add");
const btnOpenModal = document.getElementById("btn-open-modal");
const btnCloseModal = document.getElementById("btn-close-modal");
const btnCancelModal = document.getElementById("btn-cancel-modal");
const formAdd = document.getElementById("form-add");

// 1. Hàm hiển thị bảng và tính 3 ô thống kê
function hienThiBang(mangHienThi) {
    document.getElementById("total-count").innerText = danhSach.length;
    document.getElementById("current-count").innerText = mangHienThi.length;

    // Tính số lượng cho 3 ô thống kê phía trên
    let demCho = 0;
    let demXong = 0;
    for (let i = 0; i < danhSach.length; i++) {
        if (danhSach[i].ketQua.toLowerCase().includes("chờ")) {
            demCho++;
        } else {
            demXong++;
        }
    }
    document.getElementById("stat-total").innerText = danhSach.length;
    document.getElementById("stat-wait").innerText = demCho;
    document.getElementById("stat-done").innerText = demXong;

    // Nếu không có dữ liệu thì hiện ảnh emty-folder.png giống hệt trang Đơn thuốc
    if (mangHienThi.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-row">
                <td colspan="7">
                    <div class="empty-state">
                        <img src="../assets/images/emty-folder.png" alt="không có dữ liệu" class="emty-icon">
                        <h3 class="empty-title">Không có chỉ định phù hợp.</h3>
                    </div>
                </td>
            </tr>
        `;
        document.getElementById("current-see").innerText = "0-0";
        return;
    }

    // Vẽ từng dòng dữ liệu
    let html = "";
    for (let i = 0; i < mangHienThi.length; i++) {
        let item = mangHienThi[i];
        let mauTrangThai = item.ketQua.toLowerCase().includes("chờ") ? "status-wait" : "status-done";

        html += `
            <tr>
                <td>${item.ngay}</td>
                <td><strong>${item.benhNhan}</strong></td>
                <td>${item.chiDinh}</td>
                <td>${item.thongTinRieng}</td>
                <td>${item.bacSi}</td>
                <td class="${mauTrangThai}">${item.ketQua}</td>
                <td>
                    <button type="button" class="btn-secondary" onclick="capNhatKetQua(${i})">Nhập KQ</button>
                </td>
            </tr>
        `;
    }
    tbody.innerHTML = html;
    document.getElementById("current-see").innerText = "1-" + mangHienThi.length;
}

// 2. Hàm bấm nút "Nhập KQ" trên từng dòng để sửa nhanh kết quả
function capNhatKetQua(viTri) {
    let ca = danhSach[viTri];
    let kqMoi = prompt("Nhập kết quả mới cho bệnh nhân " + ca.benhNhan + ":", ca.ketQua);
    if (kqMoi !== null && kqMoi.trim() !== "") {
        danhSach[viTri].ketQua = kqMoi;
        hienThiBang(danhSach);
    }
}

// 3. Mở / Đóng khung Thêm Bệnh Nhân
btnOpenModal.onclick = function () {
    document.getElementById("inp-date").valueAsDate = new Date();
    modal.style.display = "flex";
};
btnCloseModal.onclick = function () { modal.style.display = "none"; };
btnCancelModal.onclick = function () { modal.style.display = "none"; };

// 4. Lưu bệnh nhân mới vào bảng
formAdd.onsubmit = function (event) {
    event.preventDefault();

    let caMoi = {
        ngay: document.getElementById("inp-date").value,
        benhNhan: document.getElementById("inp-patient").value,
        chiDinh: document.getElementById("inp-service").value,
        thongTinRieng: document.getElementById("inp-extra").value,
        bacSi: document.getElementById("inp-doctor").value,
        ketQua: document.getElementById("inp-result").value || "Chờ kết quả"
    };

    danhSach.push(caMoi);
    hienThiBang(danhSach);
    formAdd.reset();
    modal.style.display = "none";
};

// 5. Tìm kiếm theo tên bệnh nhân, chỉ định, bác sĩ
document.getElementById("search-input").oninput = function () {
    let tuKhoa = this.value.toLowerCase();
    let ketQuaLoc = [];

    for (let i = 0; i < danhSach.length; i++) {
        let item = danhSach[i];
        if (
            item.benhNhan.toLowerCase().includes(tuKhoa) ||
            item.chiDinh.toLowerCase().includes(tuKhoa) ||
            item.bacSi.toLowerCase().includes(tuKhoa)
        ) {
            ketQuaLoc.push(item);
        }
    }
    hienThiBang(ketQuaLoc);
};

// 6. Sắp xếp A-Z, Z-A
document.getElementById("sort-select").onchange = function () {
    let kieu = this.value;
    let tam = danhSach.slice();

    if (kieu === "az") {
        tam.sort(function (a, b) { return a.benhNhan.localeCompare(b.benhNhan); });
    } else if (kieu === "za") {
        tam.sort(function (a, b) { return b.benhNhan.localeCompare(a.benhNhan); });
    }
    hienThiBang(tam);
};

// 7. Xuất danh sách ra file .txt
document.getElementById("btn-export").onclick = function () {
    let noiDung = "Ngày | Bệnh nhân | Chỉ định | Chi tiết | Bác sĩ | Kết quả\n";
    for (let i = 0; i < danhSach.length; i++) {
        let d = danhSach[i];
        noiDung += `${d.ngay} | ${d.benhNhan} | ${d.chiDinh} | ${d.thongTinRieng} | ${d.bacSi} | ${d.ketQua}\n`;
    }
    let blob = new Blob([noiDung], { type: "text/plain;charset=utf-8" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "danh_sach_" + trangHienTai + ".txt";
    link.click();
};

// Hiển thị bảng ngay khi mở trang
hienThiBang(danhSach);