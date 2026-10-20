let danhSachThuoc = [];

let modal = document.getElementById("modal-them-thuoc");
let btnOpenModal = document.getElementById("btn-open-modal");
let btnCloseModal = document.getElementById("btn-close-modal");
let btnCancelModal = document.getElementById("btn-cancel-modal");
let formThemThuoc = document.getElementById("form-them-thuoc");
let tbody = document.getElementById("medicine-tbody");

let oGiaBan = document.getElementById("gia-ban");
let oGiaBhyt = document.getElementById("gia-bhyt");
let oThue = document.getElementById("thue");
let oGiaBanSauThue = document.getElementById("gia-ban-sau-thue");
let oGiaBhytSauThue = document.getElementById("gia-bhyt-sau-thue");

let giaoDienTrong = tbody.innerHTML;

btnOpenModal.onclick = function () {
    modal.style.display = "flex";
};

function dongModal() {
    modal.style.display = "none";
}

btnCloseModal.onclick = dongModal;
btnCancelModal.onclick = dongModal;

function tinhGiaSauThue() {
    let giaBan = Number(oGiaBan.value);
    let giaBhyt = Number(oGiaBhyt.value);
    let thue = Number(oThue.value);

    oGiaBanSauThue.value = Math.round(giaBan * (1 + thue / 100)) + "đ";
    oGiaBhytSauThue.value = Math.round(giaBhyt * (1 + thue / 100)) + "đ";
}

oGiaBan.oninput = tinhGiaSauThue;
oGiaBhyt.oninput = tinhGiaSauThue;
oThue.oninput = tinhGiaSauThue;

function hienThiBang(danhSach) {
    document.getElementById("total-count").innerText = danhSachThuoc.length;
    document.getElementById("current-count").innerText = danhSach.length;

    if (danhSach.length === 0) {
        tbody.innerHTML = giaoDienTrong;
        document.getElementById("current-see").innerText = "0-0";
        return;
    }

    let html = "";
    for (let i = 0; i < danhSach.length; i++) {
        let t = danhSach[i];
        html += `<tr>
            <td>${i + 1}</td>
            <td>${t.soDangKy}</td>
            <td><b>${t.tenThuoc}</b></td>
            <td>${t.hamLuong}</td>
            <td>${t.duongDung}</td>
            <td>${t.soLuong}</td>
            <td>${t.ghiChu}</td>
        </tr>`;
    }
    tbody.innerHTML = html;
    document.getElementById("current-see").innerText = "1-" + danhSach.length;
}

formThemThuoc.onsubmit = function (e) {
    e.preventDefault();

    let thuocMoi = {
        tenThuoc: document.getElementById("ten-thuoc").value,
        soDangKy: document.getElementById("so-dang-ky").value || "Đang cập nhật",
        hoatChat: document.getElementById("hoat-chat").value,
        hamLuong: document.getElementById("ham-luong").value,
        duongDung: document.getElementById("duong-dung").value,
        soLuong: document.getElementById("so-luong").value,
        ghiChu: document.getElementById("ghi-chu").value || "-"
    };

    danhSachThuoc.push(thuocMoi);
    hienThiBang(danhSachThuoc);

    formThemThuoc.reset();
    oGiaBanSauThue.value = "0đ";
    oGiaBhytSauThue.value = "0đ";
    dongModal();
};

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

document.getElementById("btn-export").onclick = function () {
    if (danhSachThuoc.length === 0) {
        alert("Chưa có thuốc nào trong bảng để xuất!");
        return;
    }

    let noiDung = "Số đăng ký | Tên thuốc | Hàm lượng | Đường dùng | Số lượng | Ghi chú\n";
    for (let i = 0; i < danhSachThuoc.length; i++) {
        let t = danhSachThuoc[i];
        noiDung += `${t.soDangKy} | ${t.tenThuoc} | ${t.hamLuong} | ${t.duongDung} | ${t.soLuong} | ${t.ghiChu}\n`;
    }

    let blob = new Blob([noiDung], { type: "text/plain;charset=utf-8" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "danh_sach_thuoc.txt";
    link.click();
};

let inputFileTxt = document.getElementById("file-txt");

document.getElementById("btn-import").onclick = function () {
    inputFileTxt.click();
};

inputFileTxt.onchange = function (e) {
    let file = e.target.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = function (ev) {
        let cacDong = ev.target.result.split("\n");

        for (let i = 1; i < cacDong.length; i++) {
            let dong = cacDong[i].trim();
            if (dong !== "") {
                let muc = dong.split("|");
                danhSachThuoc.push({
                    soDangKy: muc[0].trim(),
                    tenThuoc: muc[1].trim(),
                    hoatChat: "",
                    hamLuong: muc[2].trim(),
                    duongDung: muc[3].trim(),
                    soLuong: muc[4].trim(),
                    ghiChu: muc[5].trim()
                });
            }
        }
        hienThiBang(danhSachThuoc);
        alert("Đã nhập dữ liệu thành công!");
    };

    reader.readAsText(file, "UTF-8");
    inputFileTxt.value = "";
};