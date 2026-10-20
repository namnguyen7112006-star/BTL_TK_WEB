let btnOpen = document.getElementById("btn-open-modal");
let btnClose = document.getElementById("btn-close-modal");
let btnCancel = document.getElementById("btn-cancel-modal");
let modal = document.getElementById("modal-prescription");
let form = document.getElementById("form-prescription");

let tbody = document.querySelector(".data-table tbody");
let currentCount = document.getElementById("current-count");
let totalCount = document.getElementById("total-count");
let currentSee = document.getElementById("current-see");

let searchInput = document.querySelector(".search-input");
let dateInput = document.querySelector(".date-input");
let arrangeSelect = document.querySelector(".arrange");

let emptyRowHTML = tbody.innerHTML;
let dsDonThuoc = [];

btnOpen.onclick = function() {
    modal.classList.add("active");
};

function dongModal() {
    modal.classList.remove("active");
    form.reset();
}

btnClose.onclick = dongModal;
btnCancel.onclick = dongModal;

function hienThiBang(danhSach) {
    if (danhSach.length === 0) {
        tbody.innerHTML = emptyRowHTML;
        currentCount.innerText = 0;
        totalCount.innerText = dsDonThuoc.length;
        currentSee.innerText = 0;
        return;
    }

    let html = "";
    for (let i = 0; i < danhSach.length; i++) {
        let item = danhSach[i];
        html += "<tr onclick='chonDong(" + (i + 1) + ")'>" +
                    "<td>" + item.ngay + "</td>" +
                    "<td>" + item.benhNhan + "</td>" +
                    "<td>" + item.chanDoan + "</td>" +
                    "<td>" + item.thuoc + "</td>" +
                "</tr>";
    }

    tbody.innerHTML = html;
    currentCount.innerText = danhSach.length;
    totalCount.innerText = dsDonThuoc.length;
}

function chonDong(stt) {
    currentSee.innerText = stt;
}

form.onsubmit = function(e) {
    e.preventDefault();

    let benhNhan = document.getElementById("pres-patient").value;
    let ngay = document.getElementById("pres-date").value;
    let chanDoan = document.getElementById("pres-diagnosis").value;
    let tenThuoc = document.getElementById("med-name").value;
    let donVi = document.getElementById("med-unit").value;
    let soLuong = document.getElementById("med-qty").value;
    let lieuUong = document.getElementById("med-dosage").value;
    let cachDung = document.getElementById("med-usage").value;
    let ghiChu = document.getElementById("pres-note").value;

    let thongTinThuoc = tenThuoc + " (SL: " + soLuong + " " + donVi + ") - " + lieuUong + ", " + cachDung;
    if (ghiChu !== "") {
        thongTinThuoc += " (" + ghiChu + ")";
    }

    let donMoi = {
        ngay: ngay,
        benhNhan: benhNhan,
        chanDoan: chanDoan,
        thuoc: thongTinThuoc
    };

    dsDonThuoc.push(donMoi);
    hienThiBang(dsDonThuoc);
    dongModal();
};

function locDonThuoc() {
    let tuKhoa = searchInput.value.toLowerCase();
    let ngayChon = dateInput.value;
    let ketQua = [];

    for (let i = 0; i < dsDonThuoc.length; i++) {
        let item = dsDonThuoc[i];
        let khopTuKhoa = item.benhNhan.toLowerCase().includes(tuKhoa) ||
                         item.chanDoan.toLowerCase().includes(tuKhoa) ||
                         item.thuoc.toLowerCase().includes(tuKhoa);

        let khopNgay = (ngayChon === "") || (item.ngay === ngayChon);

        if (khopTuKhoa && khopNgay) {
            ketQua.push(item);
        }
    }

    let kieuSapXep = arrangeSelect.selectedIndex;
    if (kieuSapXep === 1) {
        ketQua.sort(function(a, b) {
            return a.ngay < b.ngay ? 1 : -1;
        });
    } else if (kieuSapXep === 2) {
        ketQua.sort(function(a, b) {
            return a.ngay > b.ngay ? 1 : -1;
        });
    } else if (kieuSapXep === 3) {
        ketQua.sort(function(a, b) {
            return a.benhNhan.localeCompare(b.benhNhan);
        });
    } else if (kieuSapXep === 4) {
        ketQua.sort(function(a, b) {
            return b.benhNhan.localeCompare(a.benhNhan);
        });
    }

    hienThiBang(ketQua);
}

searchInput.oninput = locDonThuoc;
dateInput.onchange = locDonThuoc;
arrangeSelect.onchange = locDonThuoc;