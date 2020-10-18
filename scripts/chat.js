if (!localStorage.token) {
  window.location.replace("login.html")
}
const socket = io('https://VitalNiceRoute.acell24.repl.co')
const messageForm = document.getElementById('send-container')
const messageContainer = document.getElementById('message-container')
const messageInput = document.getElementById('message-input')
const onlineUsersElement = document.getElementById('online-container')
let client = {};
let onlineUsers = {};


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
  
  messageContainer.append(messageElement);
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