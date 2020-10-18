const welcomeText = document.getElementById("login-text")
const welcomes = ["Welcome back!", "Hey!", "Discord is a lie", "<3"]
welcomeText.innerText = welcomes[Math.floor(Math.random() * welcomes.length)]


const socket = io('https://VitalNiceRoute.acell24.repl.co')
const loginContainer = document.getElementById("login-container");
const usernameInput  = document.getElementById("username-input");
const passwordInput  = document.getElementById("password-input");   
const errorField     = document.getElementById("error");


loginContainer.addEventListener("submit", e => {
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
    socket.emit("login-attempt", { username: usernameInput.value, password: passwordInput.value});
    usernameInput.value = "";
    passwordInput.value = "";
})

socket.on("wrong-username", () => {
    errorField.innerText = "Wrong username";
    errorField.style.display = "block";
});

socket.on("wrong-password", () => {
    errorField.innerText = "Wrong password";
    errorField.style.display = "block";
})

socket.on("login-success", user => {
    localStorage.setItem("token", user.token);
    window.location.replace("chat.html")
})