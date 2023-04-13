



document.addEventListener('DOMContentLoaded', async () => {
    const button = document.querySelector('#submit'); 
    button.addEventListener('click', async (event) => {
        event.preventDefault(); 
        const promptBox = document.querySelector('#prompt'); 
        const legend = document.querySelector('legend'); 
        if (!promptBox.value) {
            legend.style.color = 'red'; 
            return legend.innerText = 'Gotta enter some text!'; 
        }
        legend.style.color = 'white'; 
        legend.innerText = 'Generate a picture!'; 
        const promptValue = promptBox.value; 
        promptBox.value = ''; 
        let picture = await fetch(`/generateImage/${promptValue}`); 
        picture = await picture.text(); 
        const pictureBox = document.querySelector('#pictureBox'); 
        const img = document.createElement('img'); 
        const pTag = document.createElement('h3'); 
        pTag.innerText = `Your Prompt: ${promptValue}`; 
        img.src = "data:image/png;base64,"; 

        
        img.src += picture; 
        img.style.marginBottom = '25px'; 
        pictureBox.appendChild(img); 
        pictureBox.appendChild(pTag); 

    })

    const statusHeader = document.querySelector('#status'); 
    let status = await fetch('/aiImageAPI.html/onlineStatus'); 
    status = await status.text(); 
    if (status === `Online`) {
        statusHeader.innerText = 'The image generator is Online!'; 
        statusHeader.style.color = 'green'; 
    }
})