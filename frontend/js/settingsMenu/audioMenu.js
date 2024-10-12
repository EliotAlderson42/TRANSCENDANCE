function audioMenu(){
    const audioMenu = document.getElementById('dynamicContent');
    configureContainer(audioMenu);

    const title = document.createElement('div');
    title.id = 'audioMenuTitle';
    title.textContent = 'Audio';
    title.classList.add('menusTitle');

    const ambientText = document.createElement('div');
    ambientText.textContent = 'Ambient volume';
    ambientText.classList.add('audioMenu-ambientText');

    const ambientVolumeSlider = document.createElement('input');
    ambientVolumeSlider.type = 'range';
    ambientVolumeSlider.classList.add('audioMenu-ambientVolumeSlider');
    ambientVolumeSlider.min = '0';
    ambientVolumeSlider.max = '100';
    ambientVolumeSlider.addEventListener('input', () => {
        const volume = ambientVolumeSlider.value / 100;
        document.getElementById('backgroundAudio').volume = volume;
    });

    const soundText = document.createElement('div');
    soundText.textContent = 'Sound volume';
    soundText.classList.add('audioMenu-soundText');

    const soundVolumeSlider = document.createElement('input');
    soundVolumeSlider.type = 'range';
    soundVolumeSlider.classList.add('audioMenu-soundVolumeSlider');
    soundVolumeSlider.min = '0';
    soundVolumeSlider.max = '100';
    soundVolumeSlider.addEventListener('input', () => {
        const volume = soundVolumeSlider.value / 100;
        document.getElementById('pongAudio').volume = volume;
        document.getElementById('hoverSound').volume = volume;
        document.getElementById('clickIn').volume = volume;
        document.getElementById('clickOut').volume = volume;
    });

    const backButton = document.createElement('button');
    backButton.id = 'audioBackButton';
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

    audioMenu.appendChild(title);
    audioMenu.appendChild(ambientText);
    audioMenu.appendChild(ambientVolumeSlider);
    audioMenu.appendChild(soundText);
    audioMenu.appendChild(soundVolumeSlider);
    audioMenu.appendChild(backButton);
}
