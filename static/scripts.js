



async function newCatButton () {
    let catReply = await fetch('https://api.thecatapi.com/v1/images/search'); 
    catReply = await catReply.json(); 
    catReply = catReply[0];

    const catImgBox = document.querySelector('#animalPictureBox'); 
    catImgBox.style.display = 'flex'; 
    catImgBox.style.flexDirection = 'column'; 
    catImgBox.style.gap = '20px'; 
    catImgBox.style.marginTop = '45px'; 
    const catImg = document.querySelector('#animalImg'); 
    catImg.setAttribute('src', catReply.url); 
    catImg.style.width = '650px'; 
    catImg.style.height = 'auto';  
    catImgBox.append(catImg); 
}

async function newDogButton () {
    let dogReply = await fetch('https://some-random-api.ml/animal/dog'); 
    dogReply = await dogReply.json();
    const dogImgBox = document.querySelector('#animalPictureBox'); 
    dogImgBox.style.display = 'flex'; 
    dogImgBox.style.flexDirection = 'column'; 
    dogImgBox.style.gap = '20px'; 
    dogImgBox.style.marginTop = '45px'; 
    const dogImg = document.querySelector('#animalImg'); 
    dogImg.setAttribute('src', dogReply.image); 
    dogImg.style.width = '650px'; 
    dogImg.style.height = 'auto';  
    dogImgBox.append(dogImg); 

}

(async () => {
    const getNewCatButton = document.querySelector('#GetNewCat'); 
    getNewCatButton.addEventListener('click', newCatButton); 

    const GetNewDogButton = document.querySelector('#GetNewDog'); 
    GetNewDogButton.addEventListener('click', newDogButton); 
})();