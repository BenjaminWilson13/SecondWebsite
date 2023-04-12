



document.addEventListener('DOMContentLoaded', async () => {
    const button = document.querySelector('.submit'); 
    console.log(button);

    button.addEventListener('click', async (event) => {
        const textBox = document.querySelector('.prompt'); 
        console.log(textBox, textBox.innerText); 
        if (textBox.innerText) {

        }
    })  
    
})