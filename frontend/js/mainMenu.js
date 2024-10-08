
document.addEventListener('DOMContentLoaded', function() {
    initPage();
});
function initPage() {
const container = document.getElementById('dynamicContent');
const button = document.createElement('button')
button.textContent = 'PONG';
button.style.fontSize = '18em';
button.style.width = '100%';
button.style.height = '100%';
button.classList.add('hoverLambda');
container.appendChild(button);
button.addEventListener('click', function() {
    playAudio('pongAudio');
    playAudio('backgroundAudio');
    document.body.classList.add('animationActive');
    //button.classList.add('bounce');
    setTimeout(function() {
        button.classList.add('fadeOut');
    }, 1000);
    setTimeout(function() {
    button.style.display = 'none';
    mainMenu();
    }, 0000);
});
}

function mainMenu() {

    const container = document.getElementById('dynamicContent');
    configureContainer(container);
    
    const pong = document.createElement('button');
    pong.id = 'pongButton';
    // pong.classList.add('mainMenu-pongButton');
    pong.textContent = 'Pong';
    pong.style.fontSize = '12em';
    pong.style.color = 'white';
    pong.classList.add('FadeIn');
    pong.classList.add('stealthButton');
    pong.style.marginBottom = '0.1em';
    
    const play = document.createElement('button');
    play.id = 'playButton';
    play.textContent = 'Play';
    play.classList.add('buttonLambda');
    play.classList.add('hoverLambda');
    setTimeout(function() {
        play.classList.add('FadeIn');
    }, 0000);
    play.addEventListener('click', function() {
        playAudio('clickIn');                
    });
    play.addEventListener('mouseover', () => {
    hoverSound.currentTime = 0;
    hoverSound.play();
    });

    const settings = document.createElement('button');
    settings.id = 'settingsButton';
    settings.textContent = 'Settings';
    settings.classList.add('buttonLambda');
    settings.classList.add('hoverLambda');
    setTimeout(function() {
        settings.classList.add('FadeIn');
    }, 0000);
    settings.addEventListener('click', function() {
        playAudio('clickIn');
        settingsMenu();
    });
    settings.addEventListener('mouseover', () => {
    hoverSound.currentTime = 0;
    hoverSound.play();
    });

    container.appendChild(pong);
    container.appendChild(play);
    container.appendChild(settings);
}
