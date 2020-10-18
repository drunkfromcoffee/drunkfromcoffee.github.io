function resize() {
    const elementsArray = ["message-container", "message-input"];    
    const percentArray = [94, 5];
    
    const height = window.innerHeight;

    for (let i = 0; i < elementsArray.length; i++) {
        const temp = document.getElementById(elementsArray[i]) 
        if (!temp) continue;
        temp.style.height = `${Math.floor((height * percentArray[i]) / 100)}px`;
        
    }
}