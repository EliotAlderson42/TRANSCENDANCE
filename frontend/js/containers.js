function configureContainer(container) {
    container.innerHTML = '';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.justifyContent = 'center'; // Center horizontally
    container.style.alignItems = 'center'; // Center vertically if needed
    container.style.overflow = 'auto';
    container.style.zIndex = '1000';
}

function updateMenuDimensions() {
const container = document.getElementById('dynamicContent');
const containerRect = container.getBoundingClientRect();

// Mettre à jour les dimensions du conteneur principal
container.style.width = `${containerRect.width}px`;
container.style.height = `${containerRect.height}px`;

// Sélectionner tous les menus à l'intérieur du conteneur principal
const menus = document.querySelectorAll('.resizableMenu');

menus.forEach(menu => {
    // Mettre à jour les dimensions de chaque menu
    menu.style.width = `${containerRect.width}px`;
    menu.style.height = `${containerRect.height}px`;

    // Positionnement fixe pour la superposition
    menu.style.position = 'fixed';
    menu.style.top = `${containerRect.top}px`;
    menu.style.left = `${containerRect.left}px`;
});
}

document.addEventListener('DOMContentLoaded', updateMenuDimensions);
window.addEventListener('resize', updateMenuDimensions);
window.addEventListener('scroll', updateMenuDimensions);

function newWindowGrid(){
    const newWindow = document.createElement('div');
    const rect = document.getElementById('dynamicContent').getBoundingClientRect();
    newWindow.id = 'newWindow2';
    newWindow.classList.add('resizableMenu');
    newWindow.style.position = 'absolute';
    newWindow.style.top = `${rect.top}px`;
    newWindow.style.left = `${rect.left}px`;
    newWindow.style.width = `${rect.width}px`;
    newWindow.style.height = `${rect.height}px`;
    newWindow.style.backgroundColor = 'rgba(0, 0, 0, 1)';
    newWindow.style.zIndex = '1000';

    document.body.appendChild(newWindow);
    return newWindow;
}