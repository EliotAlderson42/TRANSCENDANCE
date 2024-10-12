function accountSettingsMenu(){
    const accountSettingsMenu = document.getElementById('dynamicContent');
    configureContainer(accountSettingsMenu);

    const title = document.createElement('div');
    title.id = 'accountSettingsMenuTitle';
    title.textContent = 'Account settings';
    title.style.marginTop = '5vh';
    title.classList.add('menusTitle');

    const upButton = document.createElement('button');
    upButton.id = 'upButton';
    upButton.textContent = '';
    upButton.classList.add('hoverLambda');
    upButton.classList.add('accountSettingsMenu-upButton');
    // upButton.style.marginTop = '0.5vh';
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

    const uploadButton = document.createElement('button');
    uploadButton.id = 'uploadButton';
    uploadButton.textContent = 'upload';
    uploadButton.classList.add('hoverLambda');
    uploadButton.classList.add('accountSettingsMenu-uploadButton');
    uploadButton.addEventListener('mouseover', () => {
        hoverSound.play();
    });
    uploadButton.addEventListener('click', () => {
        playAudio('clickIn');
    });

    const idText = document.createElement('div');
    idText.id = 'idText';
    idText.textContent = 'Id';
    idText.classList.add('accountSettingsMenu-text');
    idText.style.marginTop = '2vh';

    const idInput = document.createElement('input');
    idInput.id = 'idInput';
    idInput.classList.add('accountSettingsMenu-input');
    idInput.style.backgroundColor = 'darkGrey';
    idInput.classList.add('stealthButton');
    idInput.readOnly = true;
    idInput.addEventListener('click', () => {
        idErrorMess.style.visibility = 'visible';
        idErrorMess.style.opacity = '1';
    });

    const idErrorMess = document.createElement('div');
    idErrorMess.id = 'idErrorMess';
    idErrorMess.textContent = '42 IDs are not editable';
    idErrorMess.style.color = 'red';
    idErrorMess.style.visibility = 'hidden';

    const passwordText = document.createElement('div');
    passwordText.id = 'passwordText';
    passwordText.textContent = 'Password';
    passwordText.classList.add('accountSettingsMenu-text');

    const passwordInput = document.createElement('input');
    passwordInput.id = 'passwordInput';
    passwordInput.classList.add('accountSettingsMenu-input');
    passwordInput.style.backgroundColor = 'darkGrey';
    passwordInput.classList.add('stealthButton');
    passwordInput.readOnly = true;
    passwordInput.addEventListener('click', () => {
        passwordErrorMess.style.visibility = 'visible';
        passwordErrorMess.style.opacity = '1';
    });

    const passwordErrorMess = document.createElement('div');
    passwordErrorMess.id = 'passwordErrorMess';
    passwordErrorMess.textContent = '42 Passwords are not editable';
    passwordErrorMess.style.color = 'red';
    passwordErrorMess.style.visibility = 'hidden';

    const pseudoText = document.createElement('div');
    pseudoText.id = 'pseudoText';
    pseudoText.textContent = 'Nickname';
    pseudoText.classList.add('accountSettingsMenu-text');

    const pseudoInput = document.createElement('input');
    pseudoInput.id = 'pseudoInput';
    pseudoInput.classList.add('accountSettingsMenu-input');
    
    const backButton = document.createElement('button');
    backButton.id = 'accountSettingsBackButton';
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
    accountSettingsMenu.appendChild(uploadButton);
    accountSettingsMenu.appendChild(idText);
    accountSettingsMenu.appendChild(idInput);
    accountSettingsMenu.appendChild(idErrorMess);
    accountSettingsMenu.appendChild(passwordText);
    accountSettingsMenu.appendChild(passwordInput);
    accountSettingsMenu.appendChild(passwordErrorMess);
    accountSettingsMenu.appendChild(pseudoText);
    accountSettingsMenu.appendChild(pseudoInput);
    accountSettingsMenu.appendChild(backButton);
}