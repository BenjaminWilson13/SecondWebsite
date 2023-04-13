



document.addEventListener('DOMContentLoaded', async () => {
    const button = document.querySelector('.submit'); 
    console.log(button);

    const statusHeader = document.querySelector('#status'); 
    let status = await fetch('/aiImageAPI.html/onlineStatus'); 
    status = await status.text(); 
    if (status === `Online`) {
        statusHeader.innerText = 'The image generator is Online!'; 
        statusHeader.style.color = 'green'; 
    }
})