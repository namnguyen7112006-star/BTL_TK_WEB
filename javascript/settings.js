const SETTINGS_STORAGE_KEY = "lmdh_full_settings_v2";
const LAB_STORAGE_KEY = "lmdh_lab_catalog_v1";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=Minh+HV&background=e2e8f0&color=64748b&size=128";
const DEFAULT_LOGO = "https://ui-avatars.com/api/?name=LMD+H&background=ffffff&color=e11d48&bold=true&size=128";

let labCatalog = [];
let toastTimeout;

function showToast(msg) {
    const toast = document.getElementById("settingsToast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove("show"), 2600);
}

// Chuyển đổi qua lại giữa tab "Cài đặt tài khoản" và "Danh mục kỹ thuật (Tủ cận lâm sàng)"
function switchMainTab(tab) {
    const settingsView = document.getElementById("settingsView");
    const catalogView = document.getElementById("catalogView");
    const btnSettings = document.getElementById("tabBtnSettings");
    const btnCatalog = document.getElementById("tabBtnCatalog");

    if (tab === "catalog") {
        settingsView.style.display = "none";
        catalogView.style.display = "block";
        btnSettings.classList.remove("active");
        btnCatalog.classList.add("active");
        renderLabCatalog();
    } else {
        settingsView.style.display = "block";
        catalogView.style.display = "none";
        btnSettings.classList.add("active");
        btnCatalog.classList.remove("active");
    }
}

// Xử lý chọn ảnh Avatar & Logo
function handleImageUpload(event, imgElementId, type) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById(imgElementId).src = e.target.result;
        showToast(type === "avatar" ? "Đã tải lên ảnh đại diện mới." : "Đã tải lên ảnh Logo mới.");
    };
    reader.readAsDataURL(file);
}

function removeAvatar() {
    document.getElementById("previewImg").src = DEFAULT_AVATAR;
    document.getElementById("avatarFile").value = "";
    showToast("Đã xóa ảnh đại diện.");
}

function removeLogo() {
    document.getElementById("previewLogoImg").src = DEFAULT_LOGO;
    document.getElementById("logoFile").value = "";
    showToast("Đã đặt lại ảnh Logo.");
}

// Tra cứu nhanh Mã số thuế mẫu
function autoFillTaxInfo() {
    const taxInput = document.getElementById("taxCode").value.trim();
    if (!taxInput) {
        document.getElementById("taxCode").value = "0108824689";
    }
    document.getElementById("clinicName").value = "Phòng khám Đa khoa & YHCT LMD-H";
    document.getElementById("clinicType").value = "Y học cổ truyền (Đông y)";
    document.getElementById("clinicAddress").value = "Số 3 Cầu Giấy, Phường Láng Thượng, Quận Đống Đa, Hà Nội";
    document.getElementById("clinicContact").value = "0912 345 678 | LMD-H@gmail.com | https://lmd-health.vn";
    document.getElementById("clinicBio").value = "Chuyên khám, tư vấn và điều trị bằng Y học cổ truyền kết hợp Y học hiện đại: Điện châm, Cứu ngải, Xoa bóp bấm huyệt và Bốc thuốc thang.";
    showToast("✓ Đã tìm và tự động điền thông tin phòng khám!");
}

// Sao chép lệnh Zalo
function copyZaloCommand() {
    const cmd = document.getElementById("zaloCmdText").textContent;
    navigator.clipboard.writeText(cmd).then(() => {
        showToast("Đã sao chép lệnh: " + cmd);
    }).catch(() => {
        showToast("Lệnh đăng ký: " + cmd);
    });
}

// Lưu toàn bộ cấu hình vào localStorage
function saveSection(event, sectionName) {
    event.preventDefault();

    const resetAi = document.getElementById("resetAiModel").checked;
    if (resetAi) {
        document.getElementById("aiApiKey").value = "";
        document.getElementById("resetAiModel").checked = false;
    }

    const apiKeyVal = document.getElementById("aiApiKey").value.trim();
    const badge = document.getElementById("aiStatusBadge");
    if (apiKeyVal) {
        badge.textContent = "Đang dùng API Key cá nhân";
        badge.style.background = "#dcfce7";
        badge.style.color = "#15803d";
        badge.style.borderColor = "#86efac";
    } else {
        badge.textContent = "Đang dùng model hệ thống";
        badge.style.background = "#fef9c3";
        badge.style.color = "#a16207";
        badge.style.borderColor = "#fde047";
    }

    const data = {
        avatar: document.getElementById("previewImg").src,
        titlePrefix: document.getElementById("titlePrefix").value,
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        licenseNum: document.getElementById("licenseNum").value.trim(),
        taxCode: document.getElementById("taxCode").value.trim(),
        clinicName: document.getElementById("clinicName").value.trim(),
        clinicType: document.getElementById("clinicType").value,
        clinicAddress: document.getElementById("clinicAddress").value.trim(),
        clinicContact: document.getElementById("clinicContact").value.trim(),
        clinicBio: document.getElementById("clinicBio").value.trim(),
        showBankTransfer: document.getElementById("showBankTransfer").checked,
        showClinicLogo: document.getElementById("showClinicLogo").checked,
        logo: document.getElementById("previewLogoImg").src,
        useESignature: document.getElementById("useESignature").checked,
        paperSize: document.getElementById("paperSize").value,
        aiProvider: document.getElementById("aiProvider").value,
        aiApiKey: apiKeyVal,
        einvoiceProvider: document.getElementById("einvoiceProvider").value,
        nationalRxCode: document.getElementById("nationalRxCode").value.trim()
    };

    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(data));
    showToast(`✓ Đã lưu thay đổi mục "${sectionName}"!`);
}

// Nạp dữ liệu Cài đặt khi mở trang
function loadSavedSettings() {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return;
    try {
        const d = JSON.parse(raw);
        if (d.avatar) document.getElementById("previewImg").src = d.avatar;
        if (d.titlePrefix) document.getElementById("titlePrefix").value = d.titlePrefix;
        if (d.firstName) document.getElementById("firstName").value = d.firstName;
        if (d.lastName) document.getElementById("lastName").value = d.lastName;
        if (d.licenseNum !== undefined) document.getElementById("licenseNum").value = d.licenseNum;
        if (d.taxCode !== undefined) document.getElementById("taxCode").value = d.taxCode;
        if (d.clinicName !== undefined) document.getElementById("clinicName").value = d.clinicName;
        if (d.clinicType) document.getElementById("clinicType").value = d.clinicType;
        if (d.clinicAddress !== undefined) document.getElementById("clinicAddress").value = d.clinicAddress;
        if (d.clinicContact !== undefined) document.getElementById("clinicContact").value = d.clinicContact;
        if (d.clinicBio !== undefined) document.getElementById("clinicBio").value = d.clinicBio;
        if (d.showBankTransfer !== undefined) document.getElementById("showBankTransfer").checked = d.showBankTransfer;
        if (d.showClinicLogo !== undefined) document.getElementById("showClinicLogo").checked = d.showClinicLogo;
        if (d.logo) document.getElementById("previewLogoImg").src = d.logo;
        if (d.useESignature !== undefined) document.getElementById("useESignature").checked = d.useESignature;
        if (d.paperSize) document.getElementById("paperSize").value = d.paperSize;
        if (d.aiProvider) document.getElementById("aiProvider").value = d.aiProvider;
        if (d.aiApiKey) {
            document.getElementById("aiApiKey").value = d.aiApiKey;
            const badge = document.getElementById("aiStatusBadge");
            badge.textContent = "Đang dùng API Key cá nhân";
            badge.style.background = "#dcfce7";
            badge.style.color = "#15803d";
        }
        if (d.einvoiceProvider !== undefined) document.getElementById("einvoiceProvider").value = d.einvoiceProvider;
        if (d.nationalRxCode !== undefined) document.getElementById("nationalRxCode").value = d.nationalRxCode;
    } catch (e) {
        console.error(e);
    }
}

// ==================== CHỨC NĂNG TỦ CẬN LÂM SÀNG (DANH MỤC KỸ THUẬT) ====================
function loadLabCatalog() {
    try {
        const saved = localStorage.getItem(LAB_STORAGE_KEY);
        labCatalog = saved ? JSON.parse(saved) : [];
    } catch (_) {
        labCatalog = [];
    }
}

function renderLabCatalog() {
    const kw = (document.getElementById("labSearch")?.value || "").toLowerCase().trim();
    const grp = document.getElementById("labGroupFilter")?.value || "all";
    const sort = document.getElementById("labSort")?.value || "asc";

    let filtered = labCatalog.filter(item => {
        const matchKw = item.name.toLowerCase().includes(kw) ||
                        item.code.toLowerCase().includes(kw) ||
                        item.group.toLowerCase().includes(kw) ||
                        item.unit.toLowerCase().includes(kw);
        const matchGrp = grp === "all" || item.group === grp;
        return matchKw && matchGrp;
    });

    filtered.sort((a, b) => sort === "asc" ? a.name.localeCompare(b.name, "vi") : b.name.localeCompare(a.name, "vi"));

    const tbody = document.getElementById("labTableBody");
    const emptyBox = document.getElementById("labEmptyState");
    document.getElementById("labCountText").textContent = `Hiển thị ${filtered.length} / ${labCatalog.length} mục`;

    if (filtered.length === 0) {
        tbody.innerHTML = "";
        emptyBox.style.display = "flex";
        document.getElementById("labPaginationInfo").textContent = "Dòng đang xem: 0-0";
        return;
    }

    emptyBox.style.display = "none";
    tbody.innerHTML = filtered.map(item => `
        <tr>
            <td>${item.group}</td>
            <td><strong>${item.name}</strong><br><small style="color:#64748b">${item.code}</small></td>
            <td>${item.range || "—"}</td>
            <td>${item.unit || "—"}</td>
            <td style="text-align: center;">
                <button type="button" class="btn-action-delete" onclick="deleteLabItem('${item.code}')">Xóa</button>
            </td>
        </tr>
    `).join("");

    document.getElementById("labPaginationInfo").textContent = `Dòng đang xem: 1-${filtered.length}`;
}

function openLabModal() {
    document.getElementById("labForm").reset();
    document.getElementById("labModal").classList.add("active");
}

function closeLabModal() {
    document.getElementById("labModal").classList.remove("active");
}

function addLabItem(e) {
    e.preventDefault();
    const group = document.getElementById("newLabGroup").value;
    const name = document.getElementById("newLabName").value.trim();
    const range = document.getElementById("newLabRange").value.trim();
    const unit = document.getElementById("newLabUnit").value.trim();

    const code = "KT-" + String(Date.now()).slice(-4);
    labCatalog.push({ code, group, name, range, unit });
    localStorage.setItem(LAB_STORAGE_KEY, JSON.stringify(labCatalog));
    closeLabModal();
    renderLabCatalog();
    showToast("Đã thêm chỉ định: " + name);
}

function deleteLabItem(code) {
    labCatalog = labCatalog.filter(x => x.code !== code);
    localStorage.setItem(LAB_STORAGE_KEY, JSON.stringify(labCatalog));
    renderLabCatalog();
    showToast("Đã xóa mục khỏi danh mục kỹ thuật.");
}

// Bắt sự kiện active cho menu trái khi click
document.addEventListener("DOMContentLoaded", () => {
    loadSavedSettings();
    loadLabCatalog();

    const subLinks = document.querySelectorAll(".settings-subnav .subnav-link");
    subLinks.forEach(link => {
        link.addEventListener("click", function () {
            subLinks.forEach(l => l.classList.remove("active"));
            this.classList.add("active");
        });
    });

    ["labSearch", "labGroupFilter", "labSort", "labPageSize"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("input", renderLabCatalog);
    });
});