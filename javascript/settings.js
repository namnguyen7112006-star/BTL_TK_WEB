function handleAvatarChange(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
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

    alert(`Đã lưu thay đổi thành công!\n\nNgười phụ trách: ${title} ${lastName} ${firstName}\nSố CCHN: ${license}`);
}