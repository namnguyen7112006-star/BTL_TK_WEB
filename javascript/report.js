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
    tbody.innerHTML = "";

    if (filteredReports.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 30px; color: #94a3b8;">Không có dữ liệu phù hợp.</td></tr>`;
        document.getElementById("paginationInfo").innerText = "Dòng đang xem: 0 - 0";
        return;
    }

    const start = (pageCurrent - 1) * rowsPerPage;
    const end = Math.min(start + rowsPerPage, filteredReports.length);
    const paginatedItems = filteredReports.slice(start, end);

    paginatedItems.forEach(item => {
        const total = sumTotal(item.services);
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${item.date}</strong></td>
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
        const matchKw = item.patient.toLowerCase().includes(kw) ||
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
        <div style="border-top: 1px dashed #cbd5e1; margin: 10px 0;"></div>
        ${itemsHtml}
        <div style="border-top: 1px dashed #cbd5e1; margin: 10px 0;"></div>
        <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; color: #1b75ff; margin-top: 8px;">
            <span>TỔNG THANH TOÁN:</span>
            <span>${formatVND(total)}</span>
        </div>
    `;

    document.getElementById("invoiceModal").classList.add("active");
}

function closeInvoiceModal() {
    document.getElementById("invoiceModal").classList.remove("active");
}

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