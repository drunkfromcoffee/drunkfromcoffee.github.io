const settingsPanel      = document.getElementById("settingsPanel");
const openSettingsButton = document.getElementById("settingsButton");
const settingsContainer  = document.getElementById("settingsContainer");
const avatarInput        = document.getElementById("avatarInput");
const goBackButton       = document.getElementById("fuckGoBack");
const previewAvatar      = document.getElementById("previewAvatar");

// Open settings panel
openSettingsButton.addEventListener("click", e => {
    e.preventDefault();
    avatarInput.value = client.avatarURL;
    previewAvatar.src = avatarInput.value;
    settingsPanel.style.display = "block";
});

goBackButton.onclick = e => {
    e.preventDefault();
    settingsContainer.reset();
    settingsPanel.style.display = "none";
}

// Submit Changes to the server
settingsContainer.addEventListener("submit", e => {
    e.preventDefault();
    if (avatarInput.value === "") return;
    socket.emit("update-user", { avatarURL: avatarInput.value, token: client.token });
    avatarInput.value = "";
});

avatarInput.oninput = () => {
    previewAvatar.src = avatarInput.value;
}

socket.emit("user-modified", user => {
    console.log(user.avatarURL);
    onlineUsers[user.id] = user;
    if (client.user.id === user.id) {
        client.user = user;
    }
    updateOnlineUsers();
});