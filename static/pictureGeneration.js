function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

document.addEventListener('DOMContentLoaded', async () => {
    const randomNumber = getRandomIntInclusive(0, 10000); 
    document.cookie = `sessionId=${randomNumber}`; 
    const button = document.querySelector('#submit'); 


    button.addEventListener('click', async (event) => {
        event.preventDefault(); 
        const promptBox = document.querySelector('#prompt'); 
        const legend = document.querySelector('legend'); 
        if (!promptBox.value) {
            legend.style.color = 'red'; 
            return legend.innerText = 'Gotta enter some text!'; 
        }
        const pictureBox = document.querySelector('#pictureBox'); 
        const promptValue = promptBox.value; 
        legend.style.color = 'green'; 
        legend.innerText = 'Generating! One moment please!'; 
        promptBox.value = ''; 
        const img = document.createElement('img'); 
        img.src = "data:image/png;base64,"; 
        const pTag = document.createElement('h3'); 
        pTag.innerText = `Your Prompt: ${promptValue}`; 
        let status = await fetch(`/generateImage/${promptValue}`); 
        status = await status.json(); 
        document.cookie = `task=${status.task}`;
        legend.innerText += `   Your place in queue is: ${status.queue}`
        
        //getting the picture now
        let picture = await fetch(`/getImage`);
        picture = await picture.text(); 
        img.src += picture; 
        img.style.marginBottom = '25px'; 
        pictureBox.appendChild(img); 
        pictureBox.appendChild(pTag); 
        legend.innerText = 'Generate a picture!'
        legend.style.color = 'white'; 
    })

    const statusHeader = document.querySelector('#status'); 
    let status = await fetch('/aiImageAPI.html/onlineStatus'); 
    status = await status.text(); 
    if (status === `Online`) {
        statusHeader.innerText = 'The image generator is Online!'; 
        statusHeader.style.color = 'green'; 
    }
})