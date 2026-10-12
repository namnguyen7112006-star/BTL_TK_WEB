let technicalList = [
    { code: "KT-01", name: "Điện châm thông kinh lạc", group: "Châm cứu", duration: "30 phút", unit: "Lần", price: 150000 },
    { code: "KT-02", name: "Cứu ngải điếu dưỡng tâm an thần", group: "Cứu ngải", duration: "25 phút", unit: "Lần", price: 120000 },
    { code: "KT-03", name: "Xoa bóp bấm huyệt cột sống cổ vai gáy", group: "Xoa bóp", duration: "40 phút", unit: "Lượt", price: 180000 },
    { code: "KT-04", name: "Thủy châm Vitamin B12 vào huyệt", group: "Thủy châm", duration: "15 phút", unit: "Mũi", price: 120000 },
    { code: "KT-05", name: "Giác hơi giải biểu trừ hàn thấp", group: "Cứu ngải", duration: "20 phút", unit: "Lần", price: 90000 }
];

let filteredTechList = [...technicalList];
let currentTechPage = 1;
const techRowsPerPage = 5;

function formatCurrency(amount) {
    return Number(amount).toLocaleString('vi-VN') + ' đ';
}

function renderTechTable() {
    const tbody = document.getElementById("techTableBody");
    tbody.innerHTML = "";

    if (filteredTechList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 30px; color: #94a3b8;">Không có kỹ thuật nào phù hợp.</td></tr>`;
        document.getElementById("techPaginationInfo").innerText = "Dòng đang xem: 0 - 0";
        return;
    }

    const start = (currentTechPage - 1) * techRowsPerPage;
    const end = Math.min(start + techRowsPerPage, filteredTechList.length);
    const paginatedItems = filteredTechList.slice(start, end);

    paginatedItems.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><span style="background: #eff6ff; color: #1d4ed8; padding: 4px 8px; border-radius: 6px; font-weight: 600; font-size: 12px;">${item.group}</span></td>
            <td><strong>${item.name}</strong> <small style="color: #64748b;">(${item.code})</small></td>
            <td>${item.duration}</td>
            <td>${item.unit}</td>
            <td style="font-weight: bold;">${formatCurrency(item.price)}</td>
            <td style="text-align: center;">
                <button class="btn-action-delete" onclick="deleteTechnique('${item.code}')">Xóa</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById("techPaginationInfo").innerText = `Dòng đang xem: ${start + 1} - ${end} (Tổng: ${filteredTechList.length})`;
    document.getElementById("currentTechPage").innerText = currentTechPage;
    document.getElementById("btnPrevTech").disabled = currentTechPage === 1;
    document.getElementById("btnNextTech").disabled = end >= filteredTechList.length;
}

function filterTech() {
    const kw = document.getElementById("techSearch").value.toLowerCase().trim();
    const group = document.getElementById("groupFilter").value;
    const sort = document.getElementById("techSort").value;

    filteredTechList = technicalList.filter(item => {
        const matchKw = item.name.toLowerCase().includes(kw) || item.code.toLowerCase().includes(kw);
        const matchGroup = group === "all" ? true : item.group === group;
        return matchKw && matchGroup;
    });

    if (sort === "name_asc") filteredTechList.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "price_asc") filteredTechList.sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") filteredTechList.sort((a, b) => b.price - a.price);

    currentTechPage = 1;
    renderTechTable();
}

function openTechModal() { document.getElementById("techModal").classList.add("active"); }
function closeTechModal() { document.getElementById("techModal").classList.remove("active"); }

function saveNewTech(e) {
    e.preventDefault();
    const newTech = {
        code: `KT-0${technicalList.length + 1}`,
        name: document.getElementById("modalName").value.trim(),
        group: document.getElementById("modalGroup").value,
        duration: document.getElementById("modalDuration").value.trim() || "30 phút",
        unit: document.getElementById("modalUnit").value.trim() || "Lần",
        price: parseInt(document.getElementById("modalPrice").value, 10)
    };
    technicalList.unshift(newTech);
    closeTechModal();
    filterTech();
    document.getElementById("techForm").reset();
}

function deleteTechnique(code) {
    if (confirm(`Bạn có chắc muốn xóa mã ${code}?`)) {
        technicalList = technicalList.filter(x => x.code !== code);
        filterTech();
    }
}

document.getElementById("techSearch").addEventListener("input", filterTech);
document.getElementById("groupFilter").addEventListener("change", filterTech);
document.getElementById("techSort").addEventListener("change", filterTech);

document.getElementById("btnPrevTech").addEventListener("click", () => {
    if (currentTechPage > 1) { currentTechPage--; renderTechTable(); }
});
document.getElementById("btnNextTech").addEventListener("click", () => {
    if (currentTechPage * techRowsPerPage < filteredTechList.length) { currentTechPage++; renderTechTable(); }
});

document.addEventListener("DOMContentLoaded", renderTechTable);