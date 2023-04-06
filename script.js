const gridSizeSelect = document.getElementById("grid-size");
const gridContainer = document.getElementById("grid-container");


let snake = [[5, 3]];
let snakeSize = 0;
let direction = '';

// #region Criacao da grid
function createGrid() {
    const size = gridSizeSelect.value;

    // Limpa a grade antiga
    gridContainer.innerHTML = "";

    // Define o estilo da grade
    gridContainer.style.setProperty('--grid-size', size);
    gridContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    // Cria as células da grade
    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement("div");
        let x = Math.floor(i / size); // Obtém o índice da linha
        let y = i % size; // Obtém o índice da coluna
        let r = document.createElement("div")
        r.innerHTML = x + "," + y
        cell.id = x + '-' + y
        cell.appendChild(r)
        cell.classList.add("grid-item");
        gridContainer.appendChild(cell);
    }
}
// #endregion

function createSnake() {
    document.getElementById(snake[0][0] + "-" + snake[0][1]).dataset.head = true
}

// #region Mudanca de tamanho da grid
gridSizeSelect.addEventListener('change', function () {
    createGrid();
});
// #endregion

// #region Controles
document.addEventListener('keydown', function (event) {
    if(direction == "up" || direction == "down" || direction ==''){
        if (event.keyCode == 37)
            direction = 'left'
        if (event.keyCode == 39)
            direction = 'right'
    }
    if (direction == "left" || direction == "right" || direction == '') {
        if (event.keyCode == 38)
            direction = 'up'
        if (event.keyCode == 40)
            direction = 'down'
    }
});
// #endregion

// #region Comida
function createFood() {
    let x = Math.floor(Math.random() * (gridSizeSelect.value));
    let y = Math.floor(Math.random() * (gridSizeSelect.value));

    let f = document.getElementById(x + "-" + y)
    f.dataset.food = true;
}
// #endregion

// #region Verificadores
function stayInGrid() {
    if (snake[0][0] < 0) {
        snake[0][0] = 0
    }
    if (snake[0][0] > gridSizeSelect.value - 1) {
        snake[0][0] = gridSizeSelect.value - 1
    }
    if (snake[0][1] < 0) {
        snake[0][1] = 0
    }
    if (snake[0][1] > gridSizeSelect.value - 1) {
        snake[0][1] = gridSizeSelect.value - 1
    }
}

function canEat(current, old) {
    if (current.dataset.food) {
        snakeSize++;
        old.dataset.body = true
        current.dataset.food = false;
        grow(old)
    }
}

function grow(old) {
    if (snake.length > 1) {
        let last = snake[snake.length - 1]
        let front = snake[snake.length - 2]
        let x = last[0]
        let y = last[1]
        if (last[0] > front[0]) {
            x = last[0] + 1
        } else if (last[0] < front[0]) {
            x = last[0] - 1
        } else if (last[0] == front[0]) {
            if (last[1] > front[1]) {
                y = last[1] + 1
            } else if (last[1] < front[1]) {
                y = last[1] - 1
            }
        }
        snake.push([x,y])
    } else {
        snake.push(old.id.split('-'))
    }
}

// #endregion

createGrid();
createSnake();
createFood();

// #region Atualização
setInterval(() => {
    console.log(snake.length)
    snake.forEach((cell) => {
        let old = document.getElementById(cell[0] + '-' + cell[1])
        switch (direction) {
            case 'up': //cima
                cell[0]--;
                break;
            case 'down': //baixo
                cell[0]++;
                break;
            case "left": //esquerda
                cell[1]--;
                break;
            case 'right': //direita
                cell[1]++;
                break;
        }

        stayInGrid();

        old.dataset.head = false;
        let current = document.getElementById(cell[0] + '-' + cell[1])
        canEat(current, old);
        current.dataset.head = true
    })
}, 500)
// #endregion