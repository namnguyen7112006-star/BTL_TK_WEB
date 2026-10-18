(() => {
    const $= s => document.querySelector(s),$$ = s => [...document.querySelectorAll(s)];
    const KEY = 'lmd_health_patients_v1';

    const DEFAULT_PATIENTS = [
        {
            id: 'BN0001',
            name: 'Nguyễn Văn An',
            gender: 'Nam',
            birthYear: 1982,
            address: 'Quận Cầu Giấy, TP Hà Nội',
            phone: '0912345678',
            identity: '001082012345',
            history: 'Đau dây thần kinh tọa, huyết áp ổn định',
            createdAt: Date.now() - 300000
        },
        {
            id: 'BN0002',
            name: 'Trần Thị Mai',
            gender: 'Nữ',
            birthYear: 1990,
            address: 'Quận Đống Đa, TP Hà Nội',
            phone: '0988123456',
            identity: '001190054321',
            history: 'Mất ngủ kéo dài, suy nhược cơ thể',
            createdAt: Date.now() - 200000
        },
        {
            id: 'BN0003',
            name: 'Lê Hoàng Long',
            gender: 'Nam',
            birthYear: 1975,
            address: 'Quận Thanh Xuân, TP Hà Nội',
            phone: '0903789012',
            identity: '001075098765',
            history: 'Thoái hóa đốt sống cổ, dị ứng Penicillin',
            createdAt: Date.now() - 100000
        }
    ];

    let patients = [];
    try {
        const stored = localStorage.getItem(KEY);
        patients = stored ? JSON.parse(stored) : DEFAULT_PATIENTS;
    } catch (_) {
        patients = DEFAULT_PATIENTS;
    }

    let page = 1, sortKey = 'createdAt', sortDir = -1, toastTimer;
    const listView = $('#listView'), addView = $('#addView'), modal = $('#modal'), rows = $('#patientRows');

    function save() {
        try {
            localStorage.setItem(KEY, JSON.stringify(patients));
        } catch (e) {
            toast('Không thể lưu dữ liệu trong trình duyệt.', true);
        }
    }

    function esc(v) {
        return String(v ?? '').replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    function toast(msg, error = false) {
        const t = $('#toast'); if (!t) return; t.textContent = msg; t.style.background = error ? '#b83245' : '#1f8f5f'; t.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600); }      function years() { $$('.birth-year').forEach(s => {
            s.innerHTML = '';
            for (let y = new Date().getFullYear(); y >= 1900; y--) {
                let o = document.createElement('option');
                o.value = y;
                o.textContent = y;
                if (y === 1995) o.selected = true;
                s.appendChild(o);
            }
        });
    }

    function showView(view) {
        if (listView) listView.hidden = view !== 'list';
        if (addView) addView.hidden = view !== 'add';
        const pageTitle = $('#pageTitle'); if (pageTitle) pageTitle.textContent = view === 'list' ? 'Danh sách Bệnh Nhân' : 'Thêm bệnh nhân mới';
        const breadcrumbText = $('#breadcrumbText'); if (breadcrumbText) breadcrumbText.textContent = view === 'list' ? 'Bệnh Nhân' : 'Thêm Bệnh Nhân mới'; $$('.submenu-item').forEach(b => b.classList.toggle('selected', b.dataset.view === view));
        const openAddBtn = $('#openAdd'); if (openAddBtn) openAddBtn.hidden = view === 'add';
        if (view === 'add') {
            const nameInput = $('#pageForm [name=name]');
            if (nameInput) nameInput.focus();
        }
    }

    function formData(form) {
        let d = new FormData(form);
        return {
            name: String(d.get('name') || '').trim(),
            gender: d.get('gender'),
            birthYear: Number(d.get('birthYear')),
            address: String(d.get('address') || '').trim(),
            phone: String(d.get('phone') || '').trim(),
            identity: String(d.get('identity') || '').trim(),
            history: String(d.get('history') || '').trim()
        };
    }

    function addFrom(form, closeModal) {
        let p = formData(form), err = form.querySelector('.error');
        if (err) err.textContent = '';
        if (!p.name || !p.address || !p.birthYear) {
            if (err) err.textContent = 'Vui lòng điền đầy đủ Họ & Tên, Năm sinh và Địa chỉ.';
            return;
        }
        if (p.phone && !/^[0-9+\s().-]{8,15}$/.test(p.phone)) {
            if (err) err.textContent = 'Số điện thoại chưa hợp lệ. Hãy kiểm tra lại.';
            return;
        }
        if (p.identity && patients.some(x => x.identity === p.identity)) {
            if (err) err.textContent = 'Số CCCD/CMND này đã tồn tại.';
            return;
        }
        let n = patients.reduce((m, x) => Math.max(m, Number(String(x.id).replace(/\D/g, '')) || 0), 0) + 1;
        p.id = 'BN' + String(n).padStart(4, '0');
        p.createdAt = Date.now();
        patients.push(p);
        save();
        page = 1;
        form.reset();
        years();
        render();
        if (closeModal && modal && !modal.hidden) close();
        showView('list');
        toast('Đã thêm hồ sơ ' + p.id + ' thành công.');
    }

    function filtered() {
        let searchEl = $('#search'), genderFilterEl = $('#genderFilter'), yearFromEl = $('#yearFrom'), yearToEl = $('#yearTo'), sortEl = $('#sort');
        let q = searchEl ? searchEl.value.trim().toLocaleLowerCase('vi') : '',
            g = genderFilterEl ? genderFilterEl.value : 'all',
            from = yearFromEl ? Number(yearFromEl.value) || 0 : 0,
            to = yearToEl ? Number(yearToEl.value) || 9999 : 9999,
            mode = sortEl ? sortEl.value : 'new';

        let a = patients.filter(p =>
            [p.id, p.name, p.phone, p.identity, p.history, p.address].join(' ').toLocaleLowerCase('vi').includes(q) &&
            (g === 'all' || p.gender === g) &&
            p.birthYear >= from &&
            p.birthYear <= to
        );

        a.sort((x, y) => {
            if (mode === 'nameAsc') return x.name.localeCompare(y.name, 'vi');
            if (mode === 'nameDesc') return y.name.localeCompare(x.name, 'vi');
            if (mode === 'birthAsc') return x.birthYear - y.birthYear;
            if (mode === 'birthDesc') return y.birthYear - x.birthYear;
            if (sortKey === 'id') return x.id.localeCompare(y.id) * sortDir;
            if (sortKey === 'name') return x.name.localeCompare(y.name, 'vi') * sortDir;
            if (sortKey === 'phone') return (x.phone || '').localeCompare(y.phone || '') * sortDir;
            if (sortKey === 'history') return (x.history || '').localeCompare(y.history || '', 'vi') * sortDir;
            return (y.createdAt || 0) - (x.createdAt || 0);
        });
        return a;
    }

    function render() {
        let a = filtered(),
            pageSizeEl = $('#pageSize'),
            size = pageSizeEl ? Number(pageSizeEl.value) : 10,
            total = a.length,
            pages = Math.ceil(total / size) || 1;

        if (pages && page > pages) page = pages;
        if (page < 1) page = 1;

        let start = (page - 1) * size,
            shown = a.slice(start, start + size);

        const countText = $('#countText'); if (countText) countText.textContent = `Hiển thị ${shown.length} / ${total} hồ sơ`;
        const rangeEl = $('#range'); if (rangeEl) rangeEl.textContent = `Dòng đang xem: ${total ? start + 1 : 0}-${Math.min(start + shown.length, total)}`;
        const pageNoEl = $('#pageNo'); if (pageNoEl) pageNoEl.textContent = `${total ? page : 0} / ${pages}`;
        const prevBtn = $('#prev'); if (prevBtn) prevBtn.disabled = page <= 1 || !total;
        const nextBtn = $('#next'); if (nextBtn) nextBtn.disabled = page >= pages || !total;

        if (rows) {
            rows.innerHTML = shown.map(p => `
                <tr>
                    <td><strong>${esc(p.id)}</strong></td>
                    <td>
                        <div class="patient-name">${esc(p.name)}</div>
                        <div class="patient-sub">${esc(p.gender)} · ${esc(p.birthYear)}</div>
                    </td>
                    <td class="contact-line">
                        ${p.phone ? '☎ ' + esc(p.phone) : '—'}<br>
                        <span class="patient-sub">${p.identity ? 'CCCD: ' + esc(p.identity) : esc(p.address)}</span>
                    </td>
                    <td class="history-text">${esc(p.history || 'Chưa cập nhật')}</td>
                    <td class="action-cell">
                        <button class="row-action" data-action="view" data-id="${esc(p.id)}" title="Xem hồ sơ" type="button">⌕</button>
                        <button class="row-action" data-action="delete" data-id="${esc(p.id)}" title="Xóa hồ sơ" type="button">×</button>
                    </td>
                </tr>
            `).join('');
        }

        const emptyEl = $('#empty'); if (emptyEl) emptyEl.hidden = total > 0;
        const tableEl = $('table'); if (tableEl) tableEl.hidden = total === 0;
        const emptyTextEl = $('#emptyText'); 
        if (emptyTextEl) {
            emptyTextEl.textContent = patients.length
                ? 'Không có bệnh nhân phù hợp với bộ lọc hiện tại.'
                : 'Chưa có hồ sơ bệnh nhân. Nhấn “Thêm Bệnh Nhân” để tạo hồ sơ đầu tiên.';
        }
    }

    function openModal() {
        if (!modal) return;
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        const modalForm = $('#modalForm');
        if (modalForm) {
            modalForm.reset();
            const err = modalForm.querySelector('.error');
            if (err) err.textContent = '';
        }
        years();
        requestAnimationFrame(() => {
            const nameInput = $('#modalForm [name=name]');
            if (nameInput) nameInput.focus();
        });
    }

    function closeModal() {
        if (!modal) return;
        modal.hidden = true;
        document.body.style.overflow = '';
    }

    const patientMenuToggle = $('#patientMenuToggle');
    if (patientMenuToggle) {
        patientMenuToggle.addEventListener('click', () => {
            let s = $('#patientSubmenu');
            if (!s) return;
            s.hidden = !s.hidden;
            patientMenuToggle.setAttribute('aria-expanded', String(!s.hidden));
            const chevron = $('.chevron');
            if (chevron) chevron.textContent = s.hidden ? '+' : '−';
        });
    }

    const openAddBtn = $('#openAdd'); if (openAddBtn) openAddBtn.addEventListener('click', openModal);
    const closeModalBtn = $('#closeModal'); if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    const cancelModalBtn = $('#cancelModal'); if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal && !modal.hidden) closeModal(); });

    const modalForm = $('#modalForm'); if (modalForm) modalForm.addEventListener('submit', e => { e.preventDefault(); addFrom(e.currentTarget, true); });
    const pageForm = $('#pageForm'); if (pageForm) pageForm.addEventListener('submit', e => { e.preventDefault(); addFrom(e.currentTarget, false); });
    
    const cancelPageBtn = $('#cancelPage'); if (cancelPageBtn) cancelPageBtn.addEventListener('click', () => showView('list'));
    const closeAddPageBtn = $('#closeAddPage'); if (closeAddPageBtn) closeAddPageBtn.addEventListener('click', () => showView('list'));

    const searchInput = $('#search'); if (searchInput) searchInput.addEventListener('input', () => { page = 1; render(); });
    const sortSelect = $('#sort'); if (sortSelect) sortSelect.addEventListener('change', () => { page = 1; render(); });
    const pageSizeSelect = $('#pageSize'); if (pageSizeSelect) pageSizeSelect.addEventListener('change', () => { page = 1; render(); });
    
    const filterToggle = $('#filterToggle');
    if (filterToggle) {
        filterToggle.addEventListener('click', () => {
            const filterPanel = $('#filterPanel');
            if (filterPanel) filterPanel.hidden = !filterPanel.hidden;
        });
    }

    const applyFilterBtn = $('#applyFilter'); if (applyFilterBtn) applyFilterBtn.addEventListener('click', () => { page = 1; render(); });
    const clearFilterBtn = $('#clearFilter');
    if (clearFilterBtn) {
        clearFilterBtn.addEventListener('click', () => {
            const gf = $('#genderFilter'); if (gf) gf.value = 'all';
            const yf = $('#yearFrom'); if (yf) yf.value = '';
            const yt = $('#yearTo'); if (yt) yt.value = '';
            const s = $('#search'); if (s) s.value = '';
            page = 1;
            render();
        });
    }

    const prevBtn = $('#prev'); if (prevBtn) prevBtn.addEventListener('click', () => { page--; render(); });
    const nextBtn = $('#next'); if (nextBtn) nextBtn.addEventListener('click', () => { page++; render(); });      $$('.sort-arrow').forEach(b => b.addEventListener('click', () => {
        let k = b.dataset.sort;
        if (sortKey === k) sortDir *= -1;
        else { sortKey = k; sortDir = 1; }
        const sortSel = $('#sort'); if (sortSel) sortSel.value = 'new';
        render();
    }));

    if (rows) {
        rows.addEventListener('click', e => {
            let b = e.target.closest('[data-action]');
            if (!b) return;
            let p = patients.find(x => x.id === b.dataset.id);
            if (!p) return;
            if (b.dataset.action === 'view') {
                alert(`HỒ SƠ BỆNH NHÂN: ${p.id}\n\nHọ tên: ${p.name}\nGiới tính: ${p.gender}\nNăm sinh: ${p.birthYear}\nĐịa chỉ: ${p.address}\nĐiện thoại: ${p.phone || 'Chưa cập nhật'}\nCCCD/CMND: ${p.identity || 'Chưa cập nhật'}\nTiền căn: ${p.history || 'Chưa cập nhật'}`);
            } else if (b.dataset.action === 'delete') {
                if (confirm(`Bạn có chắc muốn xóa hồ sơ ${p.id} - ${p.name}?`)) {
                    patients = patients.filter(x => x.id !== p.id);
                    save();
                    render();
                    toast('Đã xóa hồ sơ bệnh nhân.');
                }
            }
        });
    }

    years();
    render();
    showView('list');
})();