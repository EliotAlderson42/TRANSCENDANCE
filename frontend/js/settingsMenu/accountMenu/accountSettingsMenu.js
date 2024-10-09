function accountSettingsMenu(){
    const accountSettingsMenu = document.getElementById('dynamicContent');
    configureContainer(accountSettingsMenu);

    const title = document.createElement('div');
    title.id = 'accountSettingsMenuTitle';
    title.textContent = 'Account settings';
    title.classList.add('menusTitle');

    const upButton = document.createElement('button');
    upButton.id = 'upButton';
    upButton.textContent = '';
    upButton.classList.add('hoverLambda');
    upButton.classList.add('accountSettingsMenu-upButton');
    upButton.style.marginTop = '20px';
    upButton.addEventListener('mouseover', () => {
        hoverSound.play();
    });
    upButton.addEventListener('click', () => {
        playAudio('clickIn');
        image.src = 'image/image5.jpg';
    });

    const image = document.createElement('img');
    image.src = 'image/image.jpg'; 
    image.width = 140;
    image.height = 140;
    image.style.border = '3px solid white';
    image.classList.add('accountSettingsMenu-image');

    const downButton = document.createElement('button');
    downButton.id = 'downButton';
    downButton.textContent = '';
    downButton.classList.add('hoverLambda');
    downButton.classList.add('accountSettingsMenu-downButton');
    downButton.addEventListener('mouseover', () => {
        hoverSound.play();
    });
    downButton.addEventListener('click', () => {
        playAudio('clickIn');
        image.src = 'image/image4.jpg'; 
    });


    const pseudoText = document.createElement('div');
    pseudoText.id = 'pseudoText';
    pseudoText.textContent = 'Alias';
    pseudoText.classList.add('accountSettingsMenu-pseudoText');

    const pseudoInput = document.createElement('input');
    pseudoInput.id = 'pseudoInput';
    pseudoInput.classList.add('accountSettingsMenu-pseudoInput');
    

    const backButton = document.createElement('button');
    backButton.id = 'accountBackButton';
    backButton.textContent = 'Back';
    backButton.classList.add('hoverLambda');
    backButton.classList.add('backButtons');
    backButton.addEventListener('click', () => {
        playAudio('clickOut');
        accountMenu();
    });
    backButton.addEventListener('mouseover', () => {
        hoverSound.play();
    });

    accountSettingsMenu.appendChild(title);
    accountSettingsMenu.appendChild(upButton);
    accountSettingsMenu.appendChild(image);
    accountSettingsMenu.appendChild(downButton);
    // accountSettingsMenu.appendChild(pseudoText);
    // accountSettingsMenu.appendChild(pseudoInput);
    // accountSettingsMenu.appendChild(backButton);
}