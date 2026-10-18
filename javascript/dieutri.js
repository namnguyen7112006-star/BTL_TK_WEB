let treatmentList = [
    {
        date: "2026-10-15",
        patient: "Nguyễn Văn Hòa",
        service: "Châm cứu / Điện châm",
        location: "Cổ vai gáy (Phong trì, Kiên tỉnh)",
        doctor: "Lương y Trần Bình",
        doneSessions: 4,
        totalSessions: 7,
        price: 150000
    },
    {
        date: "2026-10-16",
        patient: "Lê Thị Mai",
        service: "Xoa bóp - Bấm huyệt",
        location: "Thắt lưng (Thận du, Đại trường du)",
        doctor: "KTV Hoàng Nam",
        doneSessions: 5,
        totalSessions: 5,
        price: 120000
    },
    {
        date: "2026-10-17",
        patient: "Phạm Minh Tuấn",
        service: "Cứu ngải",
        location: "Khớp gối (Túc tam lý)",
        doctor: "Lương y Trần Bình",
        doneSessions: 2,
        totalSessions: 10,
        price: 100000
    }
];

const servicePrices = {
    "Châm cứu / Điện châm": 150000,
    "Xoa bóp - Bấm huyệt": 120000,
    "Giác hơi - Cạo gió": 80000,
    "Cứu ngải": 100000,
    "Thủy châm": 180000,
    "Xông hơi thảo dược": 130000
};

const tbody = document.getElementById("dt-tbody");
const modal = document.getElementById("modal-add");
const formAdd = document.getElementById("form-add");
const searchInput = document.getElementById("search-input");
const dateInput = document.getElementById("date-input");
const filterStatus = document.getElementById("filter-status");
const sortSelect = document.getElementById("sort-select");
const pageSizeSelect = document.getElementById("page-size");

const inpService = document.getElementById("inp-service");
const inpTotalSessions = document.getElementById("inp-total-sessions");
const inpPrice = document.getElementById("inp-price");
const inpTotalPrice = document.getElementById("inp-total-price");

function formatMoney(amount) {
    return amount.toLocaleString("vi-VN") + "đ";
}

function updateModalTotalPrice() {
    let totalSessions = Number(inpTotalSessions.value) || 0;
    let price = Number(inpPrice.value) || 0;
    inpTotalPrice.value = formatMoney(totalSessions * price);
}

inpService.addEventListener("change", function () {
    let selected = inpService.value;
    if (servicePrices[selected]) {
        inpPrice.value = servicePrices[selected];
        updateModalTotalPrice();
    }
});

inpTotalSessions.addEventListener("input", updateModalTotalPrice);
inpPrice.addEventListener("input", updateModalTotalPrice);

function updateStats() {
    let total = treatmentList.length;
    let wait = 0;
    let done = 0;

    for (let i = 0; i < treatmentList.length; i++) {
        if (treatmentList[i].doneSessions >= treatmentList[i].totalSessions) {
            done++;
        } else {
            wait++;
        }
    }

    document.getElementById("stat-total").innerText = total;
    document.getElementById("stat-wait").innerText = wait;
    document.getElementById("stat-done").innerText = done;
    document.getElementById("total-count").innerText = total;
}

function renderTable() {
    let keyword = searchInput.value.toLowerCase().trim();
    let dateFilter = dateInput.value;
    let statusFilter = filterStatus.value;
    let sortValue = sortSelect.value;
    let pageSize = Number(pageSizeSelect.value);

    let filtered = [];

    for (let i = 0; i < treatmentList.length; i++) {
        let item = treatmentList[i];
        let isDone = item.doneSessions >= item.totalSessions;

        let matchKeyword = item.patient.toLowerCase().includes(keyword) ||
                           item.service.toLowerCase().includes(keyword) ||
                           item.doctor.toLowerCase().includes(keyword);

        let matchDate = (dateFilter === "") || (item.date === dateFilter);

        let matchStatus = true;
        if (statusFilter === "wait") matchStatus = !isDone;
        if (statusFilter === "done") matchStatus = isDone;

        if (matchKeyword && matchDate && matchStatus) {
            filtered.push({ data: item, originalIndex: i });
        }
    }

    if (sortValue === "az") {
        filtered.sort(function (a, b) {
            return a.data.patient.localeCompare(b.data.patient, "vi");
        });
    } else if (sortValue === "za") {
        filtered.sort(function (a, b) {
            return b.data.patient.localeCompare(a.data.patient, "vi");
        });
    }

    let displayed = filtered.slice(0, pageSize);
    tbody.innerHTML = "";

    if (displayed.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-row">
                <td colspan="9">
                    <div class="empty-state">
                        <img src="../assets/images/emty-folder.png" alt="không có dữ liệu" class="emty-icon">
                        <h3 class="empty-title">Không có ca điều trị phù hợp.</h3>
                    </div>
                </td>
            </tr>
        `;
        document.getElementById("current-count").innerText = 0;
        document.getElementById("current-see").innerText = "0-0";
        updateStats();
        return;
    }

    for (let i = 0; i < displayed.length; i++) {
        let item = displayed[i].data;
        let idx = displayed[i].originalIndex;
        let totalMoney = item.totalSessions * item.price;
        let isDone = item.doneSessions >= item.totalSessions;

        let statusHTML = isDone
            ? `<span class="status-done">Đã hoàn thành</span>`
            : `<span class="status-wait">Đang điều trị</span>`;

        let stepBtn = isDone
            ? ""
            : `<button type="button" class="btn-secondary btn-small" onclick="addSession(${idx})">+1 buổi</button>`;

        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.date}</td>
            <td><strong>${item.patient}</strong></td>
            <td>${item.service}</td>
            <td>${item.location}</td>
            <td>${item.doctor}</td>
            <td>${item.doneSessions} / ${item.totalSessions} buổi</td>
            <td>${formatMoney(totalMoney)}</td>
            <td>${statusHTML}</td>
            <td>
                ${stepBtn}
                <button type="button" class="btn-secondary btn-small" onclick="openEditModal(${idx})">Sửa</button>
                <button type="button" class="btn-danger btn-small" onclick="deleteItem(${idx})">Xóa</button>
            </td>
        `;
        tbody.appendChild(row);
    }

    document.getElementById("current-count").innerText = displayed.length;
    document.getElementById("current-see").innerText = "1-" + displayed.length;
    updateStats();
}

window.addSession = function (index) {
    if (treatmentList[index].doneSessions < treatmentList[index].totalSessions) {
        treatmentList[index].doneSessions++;
        renderTable();
    }
};

window.deleteItem = function (index) {
    if (confirm("Bạn có chắc muốn xóa ca điều trị này?")) {
        treatmentList.splice(index, 1);
        renderTable();
    }
};

window.openEditModal = function (index) {
    let item = treatmentList[index];
    document.getElementById("modal-title").innerText = "Cập nhật ca điều trị";
    document.getElementById("edit-index").value = index;

    document.getElementById("inp-patient").value = item.patient;
    document.getElementById("inp-date").value = item.date;
    document.getElementById("inp-service").value = item.service;
    document.getElementById("inp-doctor").value = item.doctor;
    document.getElementById("inp-location").value = item.location;
    document.getElementById("inp-done-sessions").value = item.doneSessions;
    document.getElementById("inp-total-sessions").value = item.totalSessions;
    document.getElementById("inp-price").value = item.price;

    updateModalTotalPrice();
    modal.style.display = "flex";
};

document.getElementById("btn-open-modal").addEventListener("click", function () {
    document.getElementById("modal-title").innerText = "Thêm ca điều trị mới";
    document.getElementById("edit-index").value = "-1";
    formAdd.reset();
    document.getElementById("inp-date").valueAsDate = new Date();
    document.getElementById("inp-price").value = 150000;
    updateModalTotalPrice();
    modal.style.display = "flex";
});

function closeModal() {
    modal.style.display = "none";
}

document.getElementById("btn-close-modal").addEventListener("click", closeModal);
document.getElementById("btn-cancel-modal").addEventListener("click", closeModal);

formAdd.addEventListener("submit", function (e) {
    e.preventDefault();

    let editIndex = Number(document.getElementById("edit-index").value);
    let doneSessions = Number(document.getElementById("inp-done-sessions").value);
    let totalSessions = Number(document.getElementById("inp-total-sessions").value);

    if (doneSessions > totalSessions) {
        alert("Số buổi đã làm không được lớn hơn tổng số buổi!");
        return;
    }

    let newItem = {
        date: document.getElementById("inp-date").value,
        patient: document.getElementById("inp-patient").value.trim(),
        service: document.getElementById("inp-service").value,
        location: document.getElementById("inp-location").value.trim(),
        doctor: document.getElementById("inp-doctor").value.trim(),
        doneSessions: doneSessions,
        totalSessions: totalSessions,
        price: Number(document.getElementById("inp-price").value)
    };

    if (editIndex === -1) {
        treatmentList.push(newItem);
    } else {
        treatmentList[editIndex] = newItem;
    }

    closeModal();
    renderTable();
});

searchInput.addEventListener("input", renderTable);
dateInput.addEventListener("change", renderTable);
filterStatus.addEventListener("change", renderTable);
sortSelect.addEventListener("change", renderTable);
pageSizeSelect.addEventListener("change", renderTable);

document.getElementById("btn-export").addEventListener("click", function () {
    let lines = [];
    for (let i = 0; i < treatmentList.length; i++) {
        let item = treatmentList[i];
        lines.push(
            item.date + "|" +
            item.patient + "|" +
            item.service + "|" +
            item.location + "|" +
            item.doctor + "|" +
            item.doneSessions + "|" +
            item.totalSessions + "|" +
            item.price
        );
    }

    let blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "danh_sach_dieu_tri.txt";
    link.click();
});

const fileInput = document.getElementById("file-txt");
document.getElementById("btn-import").addEventListener("click", function () {
    fileInput.click();
});

fileInput.addEventListener("change", function (e) {
    let file = e.target.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = function (event) {
        let content = event.target.result;
        let rows = content.split("\n");

        for (let i = 0; i < rows.length; i++) {
            let line = rows[i].trim();
            if (!line) continue;
            let parts = line.split("|");
            if (parts.length >= 8) {
                treatmentList.push({
                    date: parts[0].trim(),
                    patient: parts[1].trim(),
                    service: parts[2].trim(),
                    location: parts[3].trim(),
                    doctor: parts[4].trim(),
                    doneSessions: Number(parts[5]) || 0,
                    totalSessions: Number(parts[6]) || 1,
                    price: Number(parts[7]) || 0
                });
            }
        }
        renderTable();
        fileInput.value = "";
    };
    reader.readAsText(file);
});

renderTable();