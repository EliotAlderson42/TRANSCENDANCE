function accountMenu(){
    const accountMenu = document.getElementById('dynamicContent');
    configureContainer(accountMenu);

    const title = document.createElement('div');
    title.id = 'accountMenuTitle';
    title.textContent = 'Account settings';
    title.style.marginTop = '5vh';
    title.classList.add('menusTitle');

    const upButton = document.createElement('button');
    upButton.id = 'upButton';
    upButton.textContent = '';
    upButton.classList.add('hoverLambda');
    upButton.classList.add('accountMenu-upButton');
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
    image.classList.add('accountMenu-image');

    const downButton = document.createElement('button');
    downButton.id = 'downButton';
    downButton.textContent = '';
    downButton.classList.add('hoverLambda');
    downButton.classList.add('accountMenu-downButton');
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
    uploadButton.classList.add('accountMenu-uploadButton');
    uploadButton.addEventListener('mouseover', () => {
        hoverSound.play();
    });
    uploadButton.addEventListener('click', () => {
        playAudio('clickIn');
    });

    const idText = document.createElement('div');
    idText.id = 'idText';
    idText.textContent = 'Id';
    idText.classList.add('accountMenu-text');
    idText.style.marginTop = '2vh';

    const idInput = document.createElement('input');
    idInput.id = 'idInput';
    idInput.classList.add('accountMenu-input');
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
    passwordText.classList.add('accountMenu-text');

    const passwordInput = document.createElement('input');
    passwordInput.id = 'passwordInput';
    passwordInput.classList.add('accountMenu-input');
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
    pseudoText.classList.add('accountMenu-text');

    const pseudoInput = document.createElement('input');
    pseudoInput.id = 'pseudoInput';
    pseudoInput.classList.add('accountMenu-input');
    
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
    accountMenu.appendChild(upButton);
    accountMenu.appendChild(image);
    accountMenu.appendChild(downButton);
    accountMenu.appendChild(uploadButton);
    accountMenu.appendChild(idText);
    accountMenu.appendChild(idInput);
    accountMenu.appendChild(idErrorMess);
    accountMenu.appendChild(passwordText);
    accountMenu.appendChild(passwordInput);
    accountMenu.appendChild(passwordErrorMess);
    accountMenu.appendChild(pseudoText);
    accountMenu.appendChild(pseudoInput);
    accountMenu.appendChild(backButton);
}