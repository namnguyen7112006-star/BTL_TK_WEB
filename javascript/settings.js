const STORAGE_KEY = "lmdh_doctor_profile";

document.addEventListener("DOMContentLoaded", () => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
        try {
            const profile = JSON.parse(savedData);
            if (profile.title) document.getElementById("titlePrefix").value = profile.title;
            if (profile.lastName) document.getElementById("lastName").value = profile.lastName;
            if (profile.firstName) document.getElementById("firstName").value = profile.firstName;
            if (profile.license) document.getElementById("licenseNum").value = profile.license;
            if (profile.avatar) document.getElementById("previewImg").src = profile.avatar;
        } catch (err) {
            console.error("Lỗi đọc dữ liệu cài đặt:", err);
        }
    }
});

function handleAvatarChange(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("previewImg").src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function saveProfile(event) {
    event.preventDefault();
    const title = document.getElementById("titlePrefix").value;
    const lastName = document.getElementById("lastName").value.trim();
    const firstName = document.getElementById("firstName").value.trim();
    const license = document.getElementById("licenseNum").value.trim();
    const avatar = document.getElementById("previewImg").src;

    const profileData = { title, lastName, firstName, license, avatar };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profileData));

    alert(`Đã lưu thay đổi thành công!\n\nNgười phụ trách: ${title} ${lastName} ${firstName}\nSố CCHN: ${license}`);
}