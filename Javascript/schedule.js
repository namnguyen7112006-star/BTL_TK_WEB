// Chức năng trang Lịch làm việc: khung giờ, trạng thái, ngày nghỉ, sao chép và QR.
document.addEventListener("DOMContentLoaded", function () {
    const DAYS = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
    const STORAGE_KEY = "lmd_schedule_v1";
    const HOLIDAY_KEY = "lmd_holidays_v1";

    const scheduleList = document.getElementById("schedule-list");
    const summary = document.getElementById("schedule-summary");
    const timeModal = document.getElementById("time-modal");
    const timeForm = document.getElementById("time-form");
    const holidayModal = document.getElementById("holiday-modal");
    const holidayForm = document.getElementById("holiday-form");
    const qrModal = document.getElementById("qr-modal");
    const toast = document.getElementById("toast");

    let toastTimer;
    let schedule = loadJSON(STORAGE_KEY, DAYS.map(function (day) {
        return { day: day, enabled: false, times: [] };
    }));
    let holidays = loadJSON(HOLIDAY_KEY, []);

    document.getElementById("current-year").textContent = new Date().getFullYear();

    const shareUrl = document.getElementById("share-url");
    shareUrl.value = window.location.href;

    function loadJSON(key, fallback) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch (error) {
            return fallback;
        }
    }

    function notify(message) {
        toast.textContent = message;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            toast.classList.remove("show");
        }, 2800);
    }

    function saveAll(showMessage) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
        localStorage.setItem(HOLIDAY_KEY, JSON.stringify(holidays));
        renderSchedule();
        renderHolidays();
        if (showMessage) notify("Đã lưu thay đổi trên trình duyệt.");
    }

    function renderSchedule() {
        scheduleList.innerHTML = "";

        schedule.forEach(function (item, dayIndex) {
            const row = document.createElement("div");
            row.className = "schedule-row";

            const name = document.createElement("div");
            name.className = "day-name";
            name.innerHTML = '<span class="day-icon" aria-hidden="true">▦</span>';
            const nameText = document.createElement("span");
            nameText.textContent = item.day || DAYS[dayIndex];
            name.appendChild(nameText);

            const status = document.createElement("div");
            status.className = "status-control";
            const statusLabel = document.createElement("span");
            statusLabel.className = "status-label" + (item.enabled ? " open" : "");
            statusLabel.textContent = item.enabled ? "Làm việc" : "Nghỉ";
            const toggle = document.createElement("button");
            toggle.type = "button";
            toggle.className = "switch";
            toggle.setAttribute("role", "switch");
            toggle.setAttribute("aria-checked", String(Boolean(item.enabled)));
            toggle.setAttribute("aria-label", "Bật/tắt " + item.day);
            toggle.addEventListener("click", function () {
                item.enabled = !item.enabled;
                if (item.enabled && item.times.length === 0) {
                    item.times.push({ start: "08:00", end: "17:00" });
                }
                saveAll(false);
                notify(item.day + (item.enabled ? ": đã bật làm việc." : ": đã chuyển sang nghỉ."));
            });
            status.append(statusLabel, toggle);

            const timeList = document.createElement("div");
            timeList.className = "time-list";
            if (!item.enabled || item.times.length === 0) {
                const noTime = document.createElement("span");
                noTime.className = "no-time";
                noTime.textContent = item.enabled ? "Chưa thiết lập khung giờ" : "Chưa có khung giờ (Mặc định cả ngày)";
                timeList.appendChild(noTime);
            } else {
                item.times.forEach(function (time, timeIndex) {
                    const chip = document.createElement("span");
                    chip.className = "time-chip";
                    const text = document.createElement("span");
                    text.textContent = time.start + " – " + time.end;
                    const edit = document.createElement("button");
                    edit.type = "button";
                    edit.title = "Sửa khung giờ";
                    edit.setAttribute("aria-label", "Sửa khung giờ " + text.textContent);
                    edit.textContent = "✎";
                    edit.addEventListener("click", function () {
                        openTimeModal(dayIndex, timeIndex);
                    });
                    const remove = document.createElement("button");
                    remove.type = "button";
                    remove.title = "Xóa khung giờ";
                    remove.setAttribute("aria-label", "Xóa khung giờ " + text.textContent);
                    remove.textContent = "×";
                    remove.addEventListener("click", function () {
                        if (!confirm("Bạn có chắc muốn xóa khung giờ " + text.textContent + "?")) return;
                        item.times.splice(timeIndex, 1);
                        if (item.times.length === 0) item.enabled = false;
                        saveAll(false);
                        notify("Đã xóa khung giờ.");
                    });
                    chip.append(text, edit, remove);
                    timeList.appendChild(chip);
                });
            }

            const actions = document.createElement("div");
            actions.className = "row-actions";
            const addButton = document.createElement("button");
            addButton.type = "button";
            addButton.className = "primary-button add-time-button";
            addButton.textContent = "＋ Thêm giờ";
            addButton.addEventListener("click", function () {
                openTimeModal(dayIndex, -1);
            });
            actions.appendChild(addButton);

            row.append(name, status, timeList, actions);
            scheduleList.appendChild(row);
        });

        const activeDays = schedule.filter(function (item) { return item.enabled; }).length;
        const totalSlots = schedule.reduce(function (sum, item) { return sum + item.times.length; }, 0);
        summary.textContent = activeDays + "/7 ngày làm việc · " + totalSlots + " khung giờ";
    }

    function openTimeModal(dayIndex, timeIndex) {
        document.getElementById("time-day-index").value = dayIndex;
        document.getElementById("time-edit-index").value = timeIndex;
        document.getElementById("time-modal-day").textContent = schedule[dayIndex].day;
        const isEditing = timeIndex >= 0;
        document.getElementById("time-modal-title").textContent = isEditing ? "Sửa khung giờ" : "Thêm khung giờ";
        document.getElementById("time-start").value = isEditing ? schedule[dayIndex].times[timeIndex].start : "08:00";
        document.getElementById("time-end").value = isEditing ? schedule[dayIndex].times[timeIndex].end : "17:00";
        timeModal.showModal();
    }

    timeForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const dayIndex = Number(document.getElementById("time-day-index").value);
        const timeIndex = Number(document.getElementById("time-edit-index").value);
        const start = document.getElementById("time-start").value;
        const end = document.getElementById("time-end").value;

        if (!start || !end || start >= end) {
            notify("Giờ kết thúc phải sau giờ bắt đầu.");
            return;
        }

        const item = schedule[dayIndex];
        const overlaps = item.times.some(function (time, index) {
            if (index === timeIndex) return false;
            return start < time.end && end > time.start;
        });
        if (overlaps) {
            notify("Khung giờ này bị trùng với một khung giờ khác.");
            return;
        }

        const newTime = { start: start, end: end };
        if (timeIndex >= 0) item.times[timeIndex] = newTime;
        else item.times.push(newTime);

        item.times.sort(function (a, b) { return a.start.localeCompare(b.start); });
        item.enabled = true;
        timeModal.close();
        saveAll(false);
        notify("Đã cập nhật khung giờ " + item.day + ".");
    });

    document.getElementById("save-schedule").addEventListener("click", function () {
        saveAll(true);
    });

    function renderHolidays() {
        const list = document.getElementById("holiday-list");
        list.innerHTML = "";

        if (holidays.length === 0) {
            const empty = document.createElement("div");
            empty.className = "empty-holiday";
            empty.innerHTML = '<div class="empty-icon" aria-hidden="true">▦</div><h3>Chưa có ngày nghỉ nào</h3><p>Bạn có thể thêm ngày lễ, nghỉ phép hoặc lịch công tác để bệnh nhân nắm rõ.</p>';
            list.appendChild(empty);
            return;
        }

        holidays.sort(function (a, b) { return a.date.localeCompare(b.date); });
        holidays.forEach(function (holiday) {
            const card = document.createElement("article");
            card.className = "holiday-card";
            const top = document.createElement("div");
            top.className = "holiday-card-top";
            const info = document.createElement("div");
            const title = document.createElement("h3");
            title.textContent = holiday.name;
            const date = document.createElement("div");
            date.className = "holiday-date";
            date.textContent = formatDate(holiday.date);
            info.append(title, date);
            const remove = document.createElement("button");
            remove.className = "remove-holiday";
            remove.type = "button";
            remove.textContent = "×";
            remove.title = "Xóa ngày nghỉ";
            remove.setAttribute("aria-label", "Xóa ngày nghỉ " + holiday.name);
            remove.addEventListener("click", function () {
                if (!confirm('Xóa ngày nghỉ "' + holiday.name + '"?')) return;
                holidays = holidays.filter(function (item) { return item.id !== holiday.id; });
                saveAll(false);
                notify("Đã xóa ngày nghỉ.");
            });
            top.append(info, remove);
            card.appendChild(top);
            if (holiday.note) {
                const note = document.createElement("p");
                note.className = "holiday-note";
                note.textContent = holiday.note;
                card.appendChild(note);
            }
            list.appendChild(card);
        });
    }

    document.getElementById("add-holiday").addEventListener("click", function () {
        holidayForm.reset();
        document.getElementById("holiday-date").min = "";
        holidayModal.showModal();
    });

    holidayForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const name = document.getElementById("holiday-name").value.trim();
        const date = document.getElementById("holiday-date").value;
        const note = document.getElementById("holiday-note").value.trim();

        if (!name || !date) {
            notify("Vui lòng nhập tên và ngày nghỉ.");
            return;
        }
        if (holidays.some(function (holiday) { return holiday.date === date; })) {
            notify("Ngày này đã có trong danh sách ngày nghỉ.");
            return;
        }

        holidays.push({ id: String(Date.now()), name: name, date: date, note: note });
        holidayModal.close();
        saveAll(false);
        notify("Đã thêm ngày nghỉ đặc biệt.");
    });

    function formatDate(dateString) {
        const parts = dateString.split("-");
        return parts.length === 3 ? parts[2] + "/" + parts[1] + "/" + parts[0] : dateString;
    }

    async function copyText(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                const temporary = document.createElement("textarea");
                temporary.value = text;
                temporary.style.position = "fixed";
                temporary.style.opacity = "0";
                document.body.appendChild(temporary);
                temporary.select();
                const copied = document.execCommand("copy");
                temporary.remove();
                if (!copied) throw new Error("copy failed");
            }
            notify("Đã sao chép liên kết.");
        } catch (error) {
            notify("Không thể tự sao chép. Hãy chọn và sao chép liên kết trong ô.");
            shareUrl.focus();
            shareUrl.select();
        }
    }

    document.getElementById("copy-link").addEventListener("click", function () {
        copyText(shareUrl.value);
    });

    document.getElementById("show-qr").addEventListener("click", function () {
        const url = shareUrl.value;
        document.getElementById("qr-url-text").textContent = url;
        document.getElementById("qr-image").src =
            "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=" + encodeURIComponent(url);
        qrModal.showModal();
    });

    document.getElementById("copy-qr-link").addEventListener("click", function () {
        copyText(shareUrl.value);
    });

    // Khi chạy bằng file://, QR/link là địa chỉ cục bộ của máy. Muốn chia sẻ cho người khác,
    // hãy triển khai trang lên hosting hoặc máy chủ trong mạng nội bộ.
    renderSchedule();
    renderHolidays();
});
