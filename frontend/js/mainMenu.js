
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
        }, 30);
    });
}

function mainMenu() {
    
    const container = document.getElementById('dynamicContent');
    configureContainer(container);

    const pong = document.createElement('button');
    pong.id = 'pongButton';
    // pong.classList.add('mainMenu-pongButton');
    pong.textContent = 'PONG';
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
    play.addEventListener('click', function() {
        playAudio('clickIn');
        playMenu.show();
    });
    play.addEventListener('mouseover', () => {
        hoverSound.play();
    });

    const settings = document.createElement('button');
    settings.id = 'settingsButton';
    settings.textContent = 'Settings';
    settings.classList.add('buttonLambda');
    settings.classList.add('hoverLambda');
    settings.addEventListener('click', function() {
        playAudio('clickIn');
        settingsMenu.show();
    });
    settings.addEventListener('mouseover', () => {
        hoverSound.play();
    });

    const authenticate = document.createElement('button');
    authenticate.id = 'authenticateButton';
    authenticate.textContent = 'Authenticate';
    authenticate.classList.add('buttonLambda');
    authenticate.classList.add('hoverLambda');

    authenticate.addEventListener('click', function() {
        playAudio('clickIn');
        authenticationMenu.show();
    });
    authenticate.addEventListener('mouseover', () => {
        hoverSound.play();
    });

    container.appendChild(pong);
    container.appendChild(play);
    container.appendChild(settings);
    container.appendChild(authenticate);
}
