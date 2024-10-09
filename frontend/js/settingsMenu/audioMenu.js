function audioMenu(){
    const audioMenu = newWindowGrid();
    audioMenu.classList.add('audioMenu-container');
    updateMenuDimensions();

    const title = document.createElement('div');
    title.id = 'audioMenuTitle';
    title.textContent = 'Audio';
    title.classList.add('audioMenu-title');
    
    const musicMuteButton = document.createElement('button');
    musicMuteButton.id = 'musicMuteButton';
    musicMuteButton.textContent = 'Mute';
    musicMuteButton.style.backgroundColor = 'white';
    musicMuteButton.classList.add('hoverLambda');
    musicMuteButton.classList.add('audioMenu-musicMuteButton');
    musicMuteButton.addEventListener('mouseover', () => {
        hoverSound.play();
    });
    musicMuteButton.addEventListener('click', () => {
        playAudio('clickIn');
        switchAudio('backgroundAudio');
        musicMuteButton.style.backgroundColor = musicMuteButton.style.backgroundColor === 'white' ? musicMuteButton.style.backgroundColor = 'red' : musicMuteButton.style.backgroundColor = 'white'; 
    });

    const musicVolumeSlider = document.createElement('input');
    musicVolumeSlider.type = 'range';
    musicVolumeSlider.classList.add('audioMenu-musicVolumeSlider');
    musicVolumeSlider.min = '0';
    musicVolumeSlider.max = '100';
    musicVolumeSlider.addEventListener('input', () => {
        const volume = musicVolumeSlider.value / 100;
        document.getElementById('backgroundAudio').volume = volume;
    });

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

    const soundMuteButton = document.createElement('button');
    soundMuteButton.id = 'soundMuteButton';
    soundMuteButton.textContent = 'Mute';
    soundMuteButton.style.backgroundColor = 'white';
    soundMuteButton.classList.add('hoverLambda');
    soundMuteButton.classList.add('audioMenu-soundMuteButton');
    soundMuteButton.addEventListener('mouseover', () => {
        hoverSound.play();
    });
    soundMuteButton.addEventListener('click', () => {
        playAudio('clickIn');
        switchAudio('pongAudio');
        switchAudio('hoverSound');
        switchAudio('clickIn');
        switchAudio('clickOut');
        soundMuteButton.style.backgroundColor = soundMuteButton.style.backgroundColor === 'white' ? soundMuteButton.style.backgroundColor = 'red' : soundMuteButton.style.backgroundColor = 'white'; 
    });


    const backButton = document.createElement('button');
    backButton.id = 'audioBackButton';
    backButton.textContent = 'Back';
    backButton.classList.add('hoverLambda');
    backButton.classList.add('audioMenu-backButton');
    backButton.addEventListener('click', () => {
        playAudio('clickOut');
        document.body.removeChild(audioMenu);
    });
    backButton.addEventListener('mouseover', () => {
        hoverSound.play();
    });

    audioMenu.appendChild(title);
    audioMenu.appendChild(soundVolumeSlider);
    audioMenu.appendChild(musicVolumeSlider);
    audioMenu.appendChild(musicMuteButton);
    audioMenu.appendChild(soundMuteButton);
    audioMenu.appendChild(backButton);
}
