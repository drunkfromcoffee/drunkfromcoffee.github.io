socket.on("notification", notification => showNotification(notification));

/*

	{
	title: String,
	content: String,
	type: String
	}


*/
function showNotification(notification) {
	const notificationElement = document.createElement("div");
	notificationElement.classList.toggle("notificationBox");
	const notificationType = document.createElement("img");
	notificationType.src = `resources/${notificationTypes[notification.type]}`;
	notificationType.classList.toggle("notificationType");
	const notificationTitle = document.createElement("span");
	notificationTitle.classList.toggle("notificationTitle");
	const notificationContent = document.createElement("span");
	notificationContent.classList.toggle("notificationContent");


	notificationTitle.innerText = notification.title;
	notificationContent.innerText = notification.content;

	notificationElement.append(notificationType);
	notificationElement.append(notificationTitle);
	notificationElement.append(document.createElement("br"));
	notificationElement.append(notificationContent);

	notificationContainer.append(notificationElement);

	setTimeout(() => notificationElement.classList.toggle("animatedNotification"), 1500);
	setTimeout(() => notificationContainer.removeChild(notificationElement), 8000);
	notificationElement.onclick = () => notificationContainer.removeChild(notificationElement);
}
