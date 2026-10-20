(() => {
    const inPagesFolder = /\/pages\//i.test(window.location.pathname);
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const rootPath = inPagesFolder ? "../" : "";

    const icons = {
        home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/></svg>',
        calendar: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>',
        patients: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
        medicine: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10.5 20.5 10-10a5.66 5.66 0 0 0-8-8l-10 10a5.66 5.66 0 0 0 8 8Z"/><path d="m8.5 8.5 7 7"/></svg>',
        prescription: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10l4 4v14H7z"/><path d="M17 3v5h4M10 13h8M10 17h8M3 7v14h14"/></svg>',
        lab: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6M10 3v7l-5.5 9.2A1.2 1.2 0 0 0 5.5 21h13a1.2 1.2 0 0 0 1-1.8L14 10V3"/><path d="M8 15h8"/></svg>',
        care: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-8-4.4-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.6-8 11-8 11Z"/><path d="M8 12h8M12 8v8"/></svg>',
        clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
        report: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V4M4 20h17"/><path d="M8 16v-5M13 16V7M18 16v-8"/></svg>',
        settings: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.6-1.4-2.4L5.3 15a8 8 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 1.7-1L9 7.3h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.6 1.4 2.4-1.4 1.1a8 8 0 0 1-.1 2Z" transform="translate(1 0) scale(.92)"/></svg>'
    };

    const groups = [
        {
            label: "TỔNG QUAN",
            items: [
                { label: "Trang chủ", page: "index.html", icon: "home" },
                { label: "Lịch hẹn", page: "lichhen.html", icon: "calendar" },
                { label: "Bệnh nhân", page: "patients.html", icon: "patients" }
            ]
        },
        {
            label: "QUẢN LÝ KHÁM",
            items: [
                { label: "Tủ thuốc", page: "tu_thuoc.html", icon: "medicine" },
                { label: "Đơn thuốc", page: "don_thuoc.html", icon: "prescription" },
                { label: "Cận lâm sàng", page: "can_lam_sang.html", icon: "lab" },
                { label: "Điều trị", page: "dieutri.html", icon: "care" },
                { label: "Lịch làm việc", page: "schedule.html", icon: "clock" }
            ]
        },
        {
            label: "HỆ THỐNG",
            items: [
                { label: "Báo cáo", page: "report.html", icon: "report" },
                { label: "Cài đặt", page: "settings.html", icon: "settings" }
            ]
        }
    ];

    const sidebar = document.createElement("aside");
    sidebar.className = "app-sidebar";
    sidebar.setAttribute("aria-label", "Điều hướng chính");

    const brand = document.createElement("a");
    brand.className = "sidebar-brand";
    brand.href = inPagesFolder ? "../index.html" : "index.html";
    brand.setAttribute("aria-label", "LMD Health - Trang chủ");

    const logo = document.createElement("img");
    logo.src = rootPath + "assets/images/logo.png";
    logo.alt = "";
    brand.append(logo);

    const brandCopy = document.createElement("span");
    brandCopy.className = "sidebar-brand-copy";
    brandCopy.innerHTML = '<span class="sidebar-brand-name">LMD Health</span><span class="sidebar-brand-caption">Quản lý phòng khám</span>';
    brand.append(brandCopy);
    sidebar.append(brand);

    const navigation = document.createElement("nav");
    navigation.setAttribute("aria-label", "Các trang");

    groups.forEach((group) => {
        const section = document.createElement("section");
        section.className = "sidebar-section";

        const heading = document.createElement("h2");
        heading.className = "sidebar-section-title";
        heading.textContent = group.label;
        section.append(heading);

        const list = document.createElement("ul");
        list.className = "sidebar-nav-list";

        group.items.forEach((item) => {
            const listItem = document.createElement("li");
            const link = document.createElement("a");
            link.className = "sidebar-link";
            link.href = item.page === "index.html"
                ? (inPagesFolder ? "../index.html" : "index.html")
                : (inPagesFolder ? item.page : "pages/" + item.page);
            link.title = item.label;
            link.setAttribute("aria-label", item.label);

            if (currentPage.toLowerCase() === item.page.toLowerCase()) {
                link.setAttribute("aria-current", "page");
            }

            const icon = document.createElement("span");
            icon.className = "sidebar-icon";
            icon.setAttribute("aria-hidden", "true");
            icon.innerHTML = icons[item.icon];

            const label = document.createElement("span");
            label.className = "sidebar-link-label";
            label.textContent = item.label;

            link.append(icon, label);
            listItem.append(link);
            list.append(listItem);
        });

        section.append(list);
        navigation.append(section);
    });

    sidebar.append(navigation);

    const footer = document.createElement("div");
    footer.className = "sidebar-footer";
    footer.textContent = "LMD Health · 2026";
    sidebar.append(footer);

    document.body.classList.add("has-sidebar");
    document.body.insertAdjacentElement("afterbegin", sidebar);
})();
