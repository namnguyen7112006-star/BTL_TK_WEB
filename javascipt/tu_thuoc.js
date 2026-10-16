// Danh sách chứa các thuốc đã thêm
let danhSachThuoc = [];

// Lấy các phần tử trên trang
const modal = document.getElementById("modal-them-thuoc");
const btnOpenModal = document.getElementById("btn-open-modal");
const btnCloseModal = document.getElementById("btn-close-modal");
const btnCancelModal = document.getElementById("btn-cancel-modal");
const formThemThuoc = document.getElementById("form-them-thuoc");
const tbody = document.getElementById("medicine-tbody");

// Các ô tính giá và thuế
const oGiaBan = document.getElementById("gia-ban");
const oGiaBhyt = document.getElementById("gia-bhyt");
const oThue = document.getElementById("thue");
const oGiaBanSauThue = document.getElementById("gia-ban-sau-thue");
const oGiaBhytSauThue = document.getElementById("gia-bhyt-sau-thue");

// 1. Bấm nút "+ Thêm thuốc" để mở khung nhập
btnOpenModal.onclick = function () {
    modal.style.display = "flex";
};

// 2. Bấm nút "X" hoặc "Hủy" để đóng khung nhập
btnCloseModal.onclick = function () {
    modal.style.display = "none";
};

btnCancelModal.onclick = function () {
    modal.style.display = "none";
};

// 3. Tự động tính Giá bán sau thuế & Giá BHYT sau thuế khi gõ
function tinhGiaSauThue() {
    let giaBan = Number(oGiaBan.value) || 0;
    let giaBhyt = Number(oGiaBhyt.value) || 0;
    let thue = Number(oThue.value) || 0;

    let banSauThue = Math.round(giaBan * (1 + thue / 100));
    let bhytSauThue = Math.round(giaBhyt * (1 + thue / 100));

    oGiaBanSauThue.value = banSauThue + "đ";
    oGiaBhytSauThue.value = bhytSauThue + "đ";
}

oGiaBan.oninput = tinhGiaSauThue;
oGiaBhyt.oninput = tinhGiaSauThue;
oThue.oninput = tinhGiaSauThue;

// 4. Hàm hiển thị danh sách thuốc ra bảng
function hienThiBang(danhSach) {
    document.getElementById("total-count").innerText = danhSachThuoc.length;
    document.getElementById("current-count").innerText = danhSach.length;

    // Nếu chưa có thuốc nào thì hiện lại hình emty-folder.png ở giữa
    if (danhSach.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-row">
                <td colspan="7">
                    <div class="empty-state">
                        <img src="../assets/images/emty-folder.png" alt="không có dữ liệu" class="emty-icon">
                        <h3 class="empty-title">Không có thuốc phù hợp trong tủ thuốc.</h3>
                    </div>
                </td>
            </tr>
        `;
        document.getElementById("current-see").innerText = "0-0";
        return;
    }

    // Nếu có thuốc thì vẽ từng dòng vào bảng
    let html = "";
    for (let i = 0; i < danhSach.length; i++) {
        let thuoc = danhSach[i];
        html += `
            <tr>
                <td>${i + 1}</td>
                <td>${thuoc.soDangKy}</td>
                <td><strong>${thuoc.tenThuoc}</strong></td>
                <td>${thuoc.hamLuong}</td>
                <td>${thuoc.duongDung}</td>
                <td>${thuoc.soLuong}</td>
                <td>${thuoc.ghiChu}</td>
            </tr>
        `;
    }
    tbody.innerHTML = html;
    document.getElementById("current-see").innerText = "1-" + danhSach.length;
}

// 5. Khi bấm nút "Thêm thuốc" trong form
formThemThuoc.onsubmit = function (event) {
    event.preventDefault(); // Ngăn trang web tự tải lại

    let thuocMoi = {
        tenThuoc: document.getElementById("ten-thuoc").value,
        soDangKy: document.getElementById("so-dang-ky").value || "Đang cập nhật",
        hoatChat: document.getElementById("hoat-chat").value,
        hamLuong: document.getElementById("ham-luong").value,
        duongDung: document.getElementById("duong-dung").value,
        soLuong: Number(document.getElementById("so-luong").value),
        nguongCanhBao: Number(document.getElementById("nguong-canh-bao").value) || 20,
        ghiChu: document.getElementById("ghi-chu").value || "-"
    };

    danhSachThuoc.push(thuocMoi);
    hienThiBang(danhSachThuoc);

    // Đóng khung và xóa trắng form để nhập lần sau
    formThemThuoc.reset();
    oGiaBanSauThue.value = "0đ";
    oGiaBhytSauThue.value = "0đ";
    modal.style.display = "none";
};

// 6. Chức năng tìm kiếm thuốc theo tên, số đăng ký, hoạt chất
document.getElementById("search-input").oninput = function () {
    let tuKhoa = this.value.toLowerCase();
    let ketQua = [];

    for (let i = 0; i < danhSachThuoc.length; i++) {
        let t = danhSachThuoc[i];
        if (
            t.tenThuoc.toLowerCase().includes(tuKhoa) ||
            t.soDangKy.toLowerCase().includes(tuKhoa) ||
            t.hoatChat.toLowerCase().includes(tuKhoa)
        ) {
            ketQua.push(t);
        }
    }
    hienThiBang(ketQua);
};
// =========================================================
// 7. CHỨC NĂNG XUẤT THUỐC RA FILE .TXT
// =========================================================
const btnExport = document.getElementById("btn-export");

btnExport.onclick = function () {
    if (danhSachThuoc.length === 0) {
        alert("Hiện chưa có thuốc nào trong bảng để xuất!");
        return;
    }

    // Dòng đầu tiên làm tiêu đề cho dễ đọc khi mở bằng Notepad
    let noiDungTxt = "Số đăng ký | Tên thuốc | Hàm lượng | Đường dùng | Số lượng | Ghi chú\n";

    // Ghép từng thuốc thành 1 dòng, ngăn cách bằng dấu gạch đứng "|"
    for (let i = 0; i < danhSachThuoc.length; i++) {
        let t = danhSachThuoc[i];
        noiDungTxt += `${t.soDangKy} | ${t.tenThuoc} | ${t.hamLuong} | ${t.duongDung} | ${t.soLuong} | ${t.ghiChu}\n`;
    }

    // Tạo file .txt và tải về máy
    let blob = new Blob([noiDungTxt], { type: "text/plain;charset=utf-8" });
    let linkTai = document.createElement("a");
    linkTai.href = URL.createObjectURL(blob);
    linkTai.download = "danh_sach_thuoc.txt";
    linkTai.click();
};

// =========================================================
// 8. CHỨC NĂNG NHẬP THUỐC TỪ FILE .TXT
// =========================================================
const btnImport = document.getElementById("btn-import");
const inputFileTxt = document.getElementById("file-txt");

btnImport.onclick = function () {
    inputFileTxt.click(); // Mở cửa sổ chọn file .txt
};

inputFileTxt.onchange = function (event) {
    let file = event.target.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = function (e) {
        let noiDung = e.target.result;
        let cacDong = noiDung.split("\n"); // Tách nội dung thành từng dòng

        // Chạy từ i = 1 để bỏ qua dòng tiêu đề đầu tiên
        for (let i = 1; i < cacDong.length; i++) {
            let dong = cacDong[i].trim();
            if (dong !== "") {
                // Cắt dòng thành từng mục dựa vào dấu "|"
                let muc = dong.split("|");

                danhSachThuoc.push({
                    soDangKy: muc[0].trim(),
                    tenThuoc: muc[1].trim(),
                    hoatChat: "Đang cập nhật",
                    hamLuong: muc[2].trim(),
                    duongDung: muc[3].trim(),
                    soLuong: Number(muc[4].trim()) || 0,
                    nguongCanhBao: 20,
                    ghiChu: muc[5].trim()
                });
            }
        }

        hienThiBang(danhSachThuoc);
        alert("Đã đọc file " + file.name + " thành công!");
    };

    reader.readAsText(file, "UTF-8");
    inputFileTxt.value = ""; // Xóa file cũ để chọn lại được
};