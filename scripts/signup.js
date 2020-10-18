const socket = io('https://VitalNiceRoute.acell24.repl.co')

const signupContainer = document.getElementById("signup-container");
const usernameInput   = document.getElementById("username-input");
const passwordInput   = document.getElementById("password-input");
const errorField       = document.getElementById("error");

signupContainer.addEventListener("submit", e => {
    errorField.style.display = "none";
    e.preventDefault();

    if (usernameInput.value === "") {
        usernameInput.style.borderStyle = "solid";
        usernameInput.style.borderColor = "red";
    } else usernameInput.style.borderStyle = "none";

    if (passwordInput.value === "") {
        passwordInput.style.borderStyle = "solid";
        passwordInput.style.borderColor = "red";
    } else passwordInput.style.borderStyle = "none";

    if (passwordInput.value === "" || usernameInput.value === "") return;
    socket.emit("signup-request", { username: usernameInput.value, password: passwordInput.value });
    usernameInput.value = "";
    passwordInput.value = "";
});

socket.on("username-already-taken", () => {
    errorField.style.display = "block";
    errorField.innerText = "This username is already taken";
}); 

socket.on("signup-success", token => {
    localStorage.setItem("token", token);
    window.location.replace("chat.html");
})