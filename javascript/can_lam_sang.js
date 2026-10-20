const trangHienTai = document.body.getAttribute("data-page") || "hoasinh";

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

const tbody = document.getElementById("cls-tbody");
const modal = document.getElementById("modal-add");
const btnOpenModal = document.getElementById("btn-open-modal");
const btnCloseModal = document.getElementById("btn-close-modal");
const btnCancelModal = document.getElementById("btn-cancel-modal");
const formAdd = document.getElementById("form-add");

function hienThiBang(mangHienThi) {
    document.getElementById("total-count").innerText = danhSach.length;
    document.getElementById("current-count").innerText = mangHienThi.length;

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

function capNhatKetQua(viTri) {
    let ca = danhSach[viTri];
    let kqMoi = prompt("Nhập kết quả mới cho bệnh nhân " + ca.benhNhan + ":", ca.ketQua);
    if (kqMoi !== null && kqMoi.trim() !== "") {
        danhSach[viTri].ketQua = kqMoi;
        hienThiBang(danhSach);
    }
}

btnOpenModal.onclick = function () {
    document.getElementById("inp-date").valueAsDate = new Date();
    modal.style.display = "flex";
};
btnCloseModal.onclick = function () { modal.style.display = "none"; };
btnCancelModal.onclick = function () { modal.style.display = "none"; };

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

document.getElementById("search-input").oninput