function accountMenu() {
    const accountMenu = document.getElementById('dynamicContent');
    configureContainer(accountMenu);    
    updateMenuDimensions();

    const title = document.createElement('div');
    title.id = 'accountMenuTitle';
    title.textContent = 'Account';
    title.classList.add('menusTitle');

    const image = document.createElement('img');
    image.src = 'image/image.jpg'; // Remplacez par le chemin de votre image
    image.width = 140;
    image.height = 140;
    image.style.border = '3px solid white';
    image.classList.add('accountMenu-image');

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('buttonContainer');

    const rightButton = document.createElement('button');
    rightButton.id = 'rightButton';
    rightButton.textContent = '>';
    rightButton.classList.add('hoverLambda');
    rightButton.classList.add('accountMenu-rightButton');
    rightButton.addEventListener('mouseover', () => {
        hoverSound.play();
    });
    rightButton.addEventListener('click', () => {
        playAudio('clickIn');
        image.src = 'image/image4.jpg'; 
    });

    const leftButton = document.createElement('button');
    leftButton.id = 'leftButton';
    leftButton.textContent = '<';
    leftButton.classList.add('hoverLambda');
    leftButton.classList.add('accountMenu-leftButton');
    leftButton.addEventListener('mouseover', () => {
        hoverSound.play();
    });
    leftButton.addEventListener('click', () => {
        playAudio('clickIn');
        image.src = 'image/image5.jpg'; 
    });

    const backButton = document.createElement('button');
    backButton.id = 'accountBackButton';
    backButton.textContent = 'Back';
    backButton.classList.add('hoverLambda');
    backButton.classList.add('backButtons');
    backButton.addEventListener('click', () => {
        playAudio('clickOut');
        settingsMenu();
    });
    backButton.addEventListener('mouseover', () => {
        hoverSound.play();
    });

    accountMenu.appendChild(title);
    accountMenu.appendChild(image);
    accountMenu.appendChild(backButton);
    accountMenu.appendChild(leftButton);
    accountMenu.appendChild(rightButton);
    document.body.appendChild(buttonContainer);
}