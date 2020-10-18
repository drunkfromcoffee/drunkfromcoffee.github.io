if (!localStorage.token) {
  window.location.replace("login.html")
}

if (Notification.permission != "granted") {
  Notification.requestPermission();
}


const socket = io('https://VitalNiceRoute.acell24.repl.co')
const messageForm = document.getElementById('send-container')
const messageContainer = document.getElementById('message-container')
const messageInput = document.getElementById('message-input')
const onlineUsersElement = document.getElementById('online-container')
const notificationContainer = document.getElementById("notificationsContainer")
let client = {};
let onlineUsers = {};

const notificationTypes = {
  "Default": "Notification_Icon_Default.png",
  "Warning": "Notification_Icon_Warning.png",
  "Error": "Notification_Icon_Error.png"
};


const imageArray = ["gif", "jpg", "jpeg", "png", "webm", "GIF"];

// Emitted when opening the page
socket.emit("new-user", localStorage.token);

// Used to get info about all the users when first opening the page
socket.on("user-details", users => {
  onlineUsers = users;
  updateOnlineUsers();
})

// Get the curent user
socket.on("client", user => client = user)

// New User Joins
socket.on("user-joined", user => {
  onlineUsers[user.id] = user;
  updateOnlineUsers();
})

// On user disconnect, delete him from the sidebar
socket.on("user-disconnected", user => {
  delete onlineUsers[user.id];
  updateOnlineUsers();
})

// On user modified
socket.on("user-modified", user => {
  console.log(user);
  onlineUsers[user.id] = user;
  if (user.id === client.id) {
    user.token = client.token;
    client = user;
  }
  updateOnlineUsers();
});

// Send a message
messageForm.addEventListener("submit", e => {
  e.preventDefault();
  if (messageInput.value === "") return;
  const message = { content: messageInput.value, author: client, createdAt: new Date()};
  socket.emit("send-chat-message", message)
  messageInput.value = "";
});

// Receive messages
socket.on("message", message => {
  appendMessage(message);
});

/*
  Append a message to the screen
  Message should atleast be following the 
  {
    content: String,
    createdAt: int,
    author: {
      username: String,
    }
  }

  structure
*/

function appendMessage(message) {
  // if (message.content.includes("discord.com")) return;
  const messageElement = document.createElement('div');
  messageElement.classList.toggle("message");
  const userElement    = document.createElement('span');
  const contentElement = document.createElement('span');
  
  userElement.classList.toggle('username');
  contentElement.classList.toggle('messageContent');
  
  userElement.innerText = message.author.username;
  contentElement.innerText = message.content;
  

  messageElement.append(userElement);
  messageElement.append(document.createElement("br"));
  messageElement.append(contentElement);

  
  linkTest: {
    if (message.content.includes("http") || message.content.includes("www.")) {
      let word = '';
      if (message.content.includes("http"))
        word = `http${message.content.split("http")[1].split(" ")[0]}`
      else 
        word = `www.${message.content.split("www.")[1].split(" ")[0]}`
      if (!word.includes("://") && word.includes("http")) break linkTest;
      contentElement.innerHTML = contentElement.innerHTML.replace(word, `<a href='${word.includes("http") ? "" : "http://" + word}'>${word}</a>`);
      const isImage = imageArray.find(t => word.includes(t));
      if (isImage && word.includes("http")) {
        const imageElement = document.createElement("img");
        imageElement.classList.toggle('messagePreview');
        imageElement.src = word;
        messageElement.append(document.createElement("br"));
        messageElement.append(imageElement);
      }
    }
  }

  messageContainer.append(messageElement);

  if (!document.hasFocus()) {
    console.log("focus")
    const audio = new Audio("resources/Notification_Sound.mp3");
    audio.play();
    if (Notification.permission === "granted") {
      const notification = new Notification(message.author.username, {
        body: message.content,
        icon: message.author.avatarURL
      });

    }
  }
}


function updateOnlineUsers() {
  const onlineUsersOld = document.getElementsByClassName("onlineUser");
  while (onlineUsersOld[0]) onlineUsersOld[0].parentNode.removeChild(onlineUsersOld[0]);
  let users = [];
  for (let i = 0; i < Object.keys(onlineUsers).length; i++) {
    users.push(onlineUsers[Object.keys(onlineUsers)[i]]);
  }
  users.sort((first, second) => {
    if (first.username.toLowerCase() > second.username.toLowerCase()) return 1;
    else return -1;
  });

  for (let i  = 0; i < users.length; i++) {
    const userElement  = document.createElement('div');
    const userPar      = document.createElement('span');
    const imageElement = document.createElement('img');
    imageElement.src=users[i].avatarURL;
    userPar.classList.toggle("onlineUserText")
    imageElement.classList.toggle("avatar");
    userElement.classList.toggle('onlineUser');
    if (users[i] === client) userPar.style.fontWeight = 'bold';
    userPar.innerText = users[i].username;
    userElement.append(imageElement);
    userElement.append(userPar);
    onlineUsersElement.append(userElement);
  }
}