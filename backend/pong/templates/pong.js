const canvas = document.getElementById("pongCanvas") //va chercher l'element canva via son id "pongCanvas"
const ctx = canvas.getContext("2d") // pas trop bien compris mais ca sert a dire que le canvas sera en 2d

const paddleWidth = 10; // largeur des raquettes en const car la valeur na va jamais changer
const paddleHeight = 100; // longueur des raquettes 
let ballRadius = 8; // rayon de la balle
let x = canvas.width / 2; // position de la balle dans la largeur
let y = canvas.height / 2; // position de la balle dans la hauteur , les 2 sont initialiser pour que la balle commence au centre
let dx = 2; //vitesse de la balle en largeur
let dy = -2; // vitesse de la balle en hauteur, a chaque cycle de jeu la balle se deplace de $valeur pixels

const paddleY = (canvas.height - paddleHeight) / 2; // definit la position initiale de la raquette 
let leftPaddleY = paddleY; // attribut la poosition calculez juste avant aux raquettes au debut de la partie
let rightPaddleY = paddleY; // pareil
let leftPaddleDy = 0; // definit si les raquettes sont en mouvement ou non, 0 = pas de mouvements
let rightPaddleDy = 0;

let leftScore = 0;
let rightScore = 0; // pas besoin d'expliquer

function drawBall(){ // Fonction qui dessine la balle avec des fonctions que je connais pas 
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI * 2); // recupere la position de la balle et son radius pour la dessiner
	ctx.fillStyle = "white";
	ctx.fill();
	ctx.closePath();
}

function drawPaddle(x, y){
	ctx.beginPath();
	ctx.rec(x, y, paddleWidth, paddleHeight);
	ctx.fillStyle = "white";
	ctx.fill();
	ctx.closePath();
}

function drawScore(){
	ctx.font = "32px Arial";
	ctx.fillStyle = "white";
	ctx.fillText(leftScore, canvas.width / 4, 50);
	ctx.fillText(rightScore, (canvas.width * 3) / 4, 50);
}

function updateBallPosition(){
	x += dx;
	y += dy;

	if (y + dy > canvas.height - ballRadius) // verifie si la balle atteint le sommet du canvas si cest le cas inverse sa direction
		dy = -dy;

	if (x + dx < paddleWidth && y > leftPaddleY && y < leftPaddleY + paddleHeight) // verifie si la balle touche une des raquettes, inverse la position si cest le cas
		dx = -dx;
	else if (x + dx > canvas.width - paddleWidth && y > rightPaddleY && y < rightPaddleY + paddleHeight) // pareil pour lotre raquette
		dx = -dx;

	if (x + dx < 0) // verifie si la balle sort et incremente le score en fonction et remets la balle au centre
	{
		rightScore++;
		resetBall();
	}
	else if (x + dx > canvas.width)
	{
		leftScore++;
		resetBall();
	}
}

function resetBall(){ //APAGNAN KOICOUBEH
	x = canvas.width / 2;
	y = canvas.height / 2;
	dx = -dx;
}

function updatePaddles(){
	leftPaddleY += leftPaddleDy; // reajuste la position de la raquette en fonction de sa vitesse
	rightPaddleY += rightPaddleDy; // pareil

	if (leftPaddleY < 0) // bloque la raquette pour qu'elle ne sorte pas de l'ecran, pareil pour les autres if
		leftPaddleY = 0;
	if (leftPaddleY  > canvas.height - paddleHeight)
		leftPaddleY = canvas.height - paddleHeight;
	if (rightPaddleY < 0)
		rightPaddleY = 0;
	else if (rightPaddleY > canvas.height - paddleHeight)
		rightPaddleY = canvas.height - paddleHeight;

}

document.addEventListener("keydown", (event) => { //verifie si les touches sont presser et ajuste la vitesse pour pouvoir par la suite ajuster la position des raquettes 
	if (event.key === "ArrowUp")
			rightPaddleDy = -5;
	else if (event.key === "ArrowDown")
			rightPaddleDy = 5;
	else if (event.key == "w")
			leftPaddleDy = -5;
	else if (event.key == "s")
			leftPaddleDy = 5;

});

document.addEventListener("keyup", (event) => {
	if (event.key === "ArrowUp" || event.key === "ArrowDown")
			rightPaddleDy = 0;
	if (event.key === "w" || event.key === "s")
			leftPaddleDy = 0;
});

setInterval(draw, 16);

