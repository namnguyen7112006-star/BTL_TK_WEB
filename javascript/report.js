const examReports = [
    {
        id: "HD-001",
        date: "2026-10-11",
        patient: "Nguyễn Văn An (0912 345 678)",
        diagnosis: "Tọa cốt phong (Đau dây thần kinh tọa)",
        treatment: "Điện châm + 7 thang Độc hoạt ký sinh",
        services: [
            { title: "Khám tứ chẩn & bắt mạch", fee: 100000 },
            { title: "Điện châm thông kinh lạc", fee: 150000 },
            { title: "7 thang Độc hoạt ký sinh thang", fee: 700000 }
        ],
        status: "paid"
    },
    {
        id: "HD-002",
        date: "2026-10-10",
        patient: "Trần Thị Mai (0988 123 456)",
        diagnosis: "Tâm tỳ lưỡng hư (Mất ngủ kéo dài)",
        treatment: "Cứu ngải + 10 thang Quy tỳ thang",
        services: [
            { title: "Khám & bắt mạch", fee: 100000 },
            { title: "Cứu ngải dưỡng tâm", fee: 120000 },
            { title: "10 thang Quy tỳ thang", fee: 900000 }
        ],
        status: "paid"
    },
    {
        id: "HD-003",
        date: "2026-10-09",
        patient: "Lê Hoàng Long (0903 789 012)",
        diagnosis: "Lạc chẩm (Đau mỏi cổ gáy)",
        treatment: "Xoa bóp bấm huyệt + Thủy châm",
        services: [
            { title: "Khám tư vấn", fee: 100000 },
            { title: "Xoa bóp bấm huyệt cổ gáy", fee: 180000 },
            { title: "Thủy châm Vitamin B12", fee: 120000 }
        ],
        status: "pending"
    },
    {
        id: "HD-004",
        date: "2026-10-08",
        patient: "Phạm Minh Tuấn (0977 654 321)",
        diagnosis: "Vị quản thống (Đau dạ dày thể khí trệ)",
        treatment: "Châm cứu + 5 thang Sài hồ sơ can thang",
        services: [
            { title: "Khám tứ chẩn & bắt mạch", fee: 100000 },
            { title: "Châm cứu tả pháp", fee: 150000 },
            { title: "5 thang Sài hồ sơ can thang", fee: 550000 }
        ],
        status: "paid"
    },
    {
        id: "HD-005",
        date: "2026-10-07",
        patient: "Hoàng Bích Ngọc (0934 567 890)",
        diagnosis: "Phong hàn thấp tý (Viêm khớp gối)",
        treatment: "Ôn điện châm + Đắp nến parafin",
        services: [
            { title: "Khám & bắt mạch", fee: 100000 },
            { title: "Ôn điện châm khớp gối", fee: 160000 },
            { title: "Đắp nến parafin trị liệu", fee: 140000 }
        ],
        status: "paid"
    },
    {
        id: "HD-006",
        date: "2026-10-05",
        patient: "Đỗ Văn Hùng (0965 432 109)",
        diagnosis: "Thận dương hư (Đau lưng mỏi gối)",
        treatment: "Cứu ấm mệnh môn + 10 thang Bát vị hoàn",
        services: [
            { title: "Khám tư vấn Đông y", fee: 100000 },
            { title: "Cứu ngải huyệt Mệnh môn, Thận du", fee: 150000 },
            { title: "10 thang Bát vị quế phụ", fee: 950000 }
        ],
        status: "pending"
    }
];

let filteredReports = [...examReports];
let pageCurrent = 1;
const rowsPerPage = 5;

function formatVND(amount) {
    return amount.toLocaleString('vi-VN') + ' đ';
}

function sumTotal(services) {
    return services.reduce((acc, curr) => acc + curr.fee, 0);
}

function renderReportTable() {
    const tbody = document.getElementById("reportTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (filteredReports.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 30px; color: #94a3b8;">Không có dữ liệu phù hợp.</td></tr>`;
        document.getElementById("paginationInfo").innerText = "Dòng đang xem: 0 - 0";
        document.getElementById("btnPrevPage").disabled = true;
        document.getElementById("btnNextPage").disabled = true;
        return;
    }

    const start = (pageCurrent - 1) * rowsPerPage;
    const end = Math.min(start + rowsPerPage, filteredReports.length);
    const paginatedItems = filteredReports.slice(start, end);

    paginatedItems.forEach(item => {
        const total = sumTotal(item.services);
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${item.id}</strong></td>
            <td>${item.date}</td>
            <td>${item.patient}</td>
            <td>${item.diagnosis}</td>
            <td>${item.treatment}</td>
            <td style="font-weight: bold;">${formatVND(total)}</td>
            <td>
                <span class="status-tag ${item.status}">
                    ${item.status === 'paid' ? 'Đã thu tiền' : 'Chờ thanh toán'}
                </span>
            </td>
            <td style="text-align: center;">
                <button class="btn-action-view" onclick="openInvoiceModal('${item.id}')">Xem HĐ</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById("paginationInfo").innerText = `Dòng đang xem: ${start + 1} - ${end} (Tổng: ${filteredReports.length})`;
    document.getElementById("currentPageNum").innerText = pageCurrent;
    document.getElementById("btnPrevPage").disabled = pageCurrent === 1;
    document.getElementById("btnNextPage").disabled = end >= filteredReports.length;
}

function handleFilter() {
    const kw = document.getElementById("reportSearch").value.toLowerCase().trim();
    const from = document.getElementById("dateFrom").value;
    const to = document.getElementById("dateTo").value;
    const sort = document.getElementById("sortBy").value;

    filteredReports = examReports.filter(item => {
        const matchKw = item.id.toLowerCase().includes(kw) ||
                        item.patient.toLowerCase().includes(kw) ||
                        item.diagnosis.toLowerCase().includes(kw) ||
                        item.treatment.toLowerCase().includes(kw);
        const matchFrom = from ? item.date >= from : true;
        const matchTo = to ? item.date <= to : true;
        return matchKw && matchFrom && matchTo;
    });

    filteredReports.sort((a, b) => {
        return sort === "desc" ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date);
    });

    pageCurrent = 1;
    renderReportTable();
}

function openInvoiceModal(id) {
    const item = examReports.find(x => x.id === id);
    if (!item) return;

    const total = sumTotal(item.services);
    const container = document.getElementById("modalInvoiceDetail");

    let itemsHtml = item.services.map((s, idx) => `
        <div style="display: flex; justify-content: space-between; padding: 6px 0;">
            <span>${idx + 1}. ${s.title}</span>
            <span style="font-weight: 600;">${formatVND(s.fee)}</span>
        </div>
    `).join("");

    container.innerHTML = `
        <p><strong>Mã hóa đơn:</strong> ${item.id} &nbsp;|&nbsp; <strong>Ngày lập:</strong> ${item.date}</p>
        <p><strong>Bệnh nhân:</strong> ${item.patient}</p>
        <p><strong>Chẩn đoán:</strong> ${item.diagnosis}</p>
        <div style="border-top: 1px dashed #cbd5e1; margin: 12px 0;"></div>
        ${itemsHtml}
        <div style="border-top: 1px dashed #cbd5e1; margin: 12px 0;"></div>
        <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; color: #3165e8; margin-top: 8px;">
            <span>TỔNG THANH TOÁN:</span>
            <span>${formatVND(total)}</span>
        </div>
    `;

    document.getElementById("invoiceModal").classList.add("active");
}

function closeInvoiceModal() {
    document.getElementById("invoiceModal").classList.remove("active");
}

function exportReportCSV() {
    let csvContent = "\uFEFFMã HĐ,Ngày khám,Bệnh nhân,Chẩn đoán,Pháp trị,Tổng tiền (VNĐ),Trạng thái\n";
    filteredReports.forEach(item => {
        const total = sumTotal(item.services);
        const statusText = item.status === "paid" ? "Đã thu tiền" : "Chờ thanh toán";
        csvContent += `"${item.id}","${item.date}","${item.patient}","${item.diagnosis}","${item.treatment}",${total},"${statusText}"\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Bao_cao_hoa_don_LMDH.csv";
    link.click();
}

window.addEventListener("click", (e) => {
    const modal = document.getElementById("invoiceModal");
    if (e.target === modal) closeInvoiceModal();
});

document.getElementById("reportSearch").addEventListener("input", handleFilter);
document.getElementById("dateFrom").addEventListener("change", handleFilter);
document.getElementById("dateTo").addEventListener("change", handleFilter);
document.getElementById("sortBy").addEventListener("change", handleFilter);

document.getElementById("btnPrevPage").addEventListener("click", () => {
    if (pageCurrent > 1) { pageCurrent--; renderReportTable(); }
});

document.getElementById("btnNextPage").addEventListener("click", () => {
    if (pageCurrent * rowsPerPage < filteredReports.length) { pageCurrent++; renderReportTable(); }
});

document.addEventListener("DOMContentLoaded", renderReportTable);