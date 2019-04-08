// выбор уровня сложности
let overlay = document.querySelector('.overlay');
let modal = document.querySelector('.modal');
let speed = 0;

modal.addEventListener('click', function (e) {

    if (e.target.classList.contains('easy')) {
        speed = 1000;
    } else if (e.target.classList.contains('normal')) {
        speed = 500;
    } else if (e.target.classList.contains('hard')) {
        speed = 200;
    }

    if (e.target.classList.contains('button')) {
        modal.style.display = 'none';
        overlay.style.display = 'none';
        startGame();
    }
});

// тетрис
function startGame () {
    // поле для игры
    let tetris = document.querySelector('.tetris');

    // заполняем поле ячейками
    for (let i = 1; i < 181; i++) {
        let excel = document.createElement('div');
        tetris.appendChild(excel);
        excel.classList.add('excel');
    }

    // каждой ячейке присваиваем координаты
    let excel = document.getElementsByClassName('excel');
    let x = 1, y = 18;

    for (let i = 0; i < excel.length; i++) {
        if (x > 10) {
            x = 1;
            y--;
        }
        excel[i].setAttribute('posX', x);
        excel[i].setAttribute('posY', y);
        x++;
    }

    // определяем стартовую позицию первой ячейки каждой фигуры
    x = 5;
    y= 15;

    // переменная, которая будет отвечать за текущее состояние фигуры (повернута или она и на сколько градусов)
    let rotate = 1;
    // фигура - 4 ячейки с классом 
    let figureBody = 0;
    // главный многомерный массив, отрисовывающий все наши фигуры и во всех ротациях
    let arrCoordinates = [
        //палка
        [
            [0, 1],
            [0, 2],
            [0, 3],
            [
                [-1, 1],
                [0, 0],
                [1, -1],
                [2, -2]
            ],
            [
                [1, -1],
                [0, 0],
                [-1, 1],
                [-2, 2]
            ],
            [
                [-1, 1],
                [0, 0],
                [1, -1],
                [2, -2]
            ],
            [
                [1, -1],
                [0, 0],
                [-1, 1],
                [-2, 2]
            ]
        ],
        //квадрат
        [
            [1, 0],
            [0, 1],
            [1, 1],
            [
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0]
            ],
            [
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0]
            ],
            [
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0]
            ],
            [
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0]
            ]
        ],
        //буква L
        [
            [1, 0],
            [0, 1],
            [0, 2],
            [
                [0, 0],
                [-1, 1],
                [1, 0],
                [2, -1]
            ],
            [
                [1, -1],
                [1, -1],
                [-1, 0],
                [-1, 0]
            ],
            [
                [-1, 0],
                [0, -1],
                [2, -2],
                [1, -1]
            ],
            [
                [0, -1],
                [0, -1],
                [-2, 0],
                [-2, 0]
            ]
        ],
        //буква L зеркальная
        [
            [1, 0],
            [1, 1],
            [1, 2],
            [
                [0, 0],
                [0, 0],
                [1, -1],
                [-1, -1]
            ],
            [
                [0, -1],
                [-1, 0],
                [-2, 1],
                [1, 0]
            ],
            [
                [2, 0],
                [0, 0],
                [1, -1],
                [1, -1]
            ],
            [
                [-2, 0],
                [1, -1],
                [0, 0],
                [-1, 1]
            ]
        ],
        //молния нижний ряд вправо
        [
            [1, 0],
            [-1, 1],
            [0, 1],
            [
                [0, -1],
                [-1, 0],
                [2, -1],
                [1, 0]
            ],
            [
                [0, 0],
                [1, -1],
                [-2, 0],
                [-1, -1]
            ],
            [
                [0, -1],
                [-1, 0],
                [2, -1],
                [1, 0]
            ],
            [
                [0, 0],
                [1, -1],
                [-2, 0],
                [-1, -1]
            ]
        ],
        //молния нижний ряд влево
        [
            [1, 0],
            [1, 1],
            [2, 1],
            [
                [2, -1],
                [0, 0],
                [1, -1],
                [-1, 0]
            ],
            [
                [-2, 0],
                [0, -1],
                [-1, 0],
                [1, -1]
            ],
            [
                [2, -1],
                [0, 0],
                [1, -1],
                [-1, 0]
            ],
            [
                [-2, 0],
                [0, -1],
                [-1, 0],
                [1, -1]
            ]
        ],
        //деталь лего
        [
            [1, 0],
            [2, 0],
            [1, 1],
            [
                [1, -1],
                [0, 0],
                [0, 0],
                [0, 0]
            ],
            [
                [0, 0],
                [-1, 0],
                [-1, 0],
                [1, -1]
            ],
            [
                [1, -1],
                [1, -1],
                [1, -1],
                [0, 0]
            ],
            [
                [-2, 0],
                [0, -1],
                [0, -1],
                [-1, -1]
            ]
        ]
    ];

    // индекс текущей фигуры
    let currentFigure = 0;

    // функция создания новой фигуры
    function create() {
        // возвращаем ротацию на исходную
        rotate = 1;
        // получаем рэндомное число от 0 до 6
        function getRandom() {
            return Math.round(Math.random() * (arrCoordinates.length - 1));
        }
        currentFigure = getRandom();
        // используем это рэндомное число - обращаемся к соответствующему элементу главного массива и достаем оттуда координаты
        // первый элемент фигуры - это его нижняя правая ячейка и она всего будет иметь стартовые координаты [5,15]
        figureBody = [document.querySelector('[posX = "' + x + '"][posY = "' + y + '"]'),
        document.querySelector('[posX = "' + (x + +arrCoordinates[currentFigure][0][0]) + '"][posY = "' + (y + +arrCoordinates[currentFigure][0][1]) + '"]'),
        document.querySelector('[posX = "' + (x + +arrCoordinates[currentFigure][1][0]) + '"][posY = "' + (y + +arrCoordinates[currentFigure][1][1]) + '"]'),
        document.querySelector('[posX = "' + (x + +arrCoordinates[currentFigure][2][0]) + '"][posY = "' + (y + +arrCoordinates[currentFigure][2][1]) + '"]')];
        
            for (let i = 0; i < figureBody.length; i++) {
                figureBody[i].classList.add('figure');
            }
        }
    
    // создаем первую фигуру
    create();
    // переменная, отвечающая за кол-во очков
    let score = 0;
    // записываем очки в инпут
    let input = document.getElementsByTagName('input')[0];
    input.value = `Ваши очки: ${score}`;

    // функция движения вниз
    function move() {
        // флаг, в зависимости от состояния которого фигура либо падает дальше, либо останавливается 
        let moveFlag  = true;
        // текущие координаты всех четырех ячеек фигуры
        let coordinates = [
            [figureBody[0].getAttribute('posX'), figureBody[0].getAttribute('posY')],
            [figureBody[1].getAttribute('posX'), figureBody[1].getAttribute('posY')],
            [figureBody[2].getAttribute('posX'), figureBody[2].getAttribute('posY')],
            [figureBody[3].getAttribute('posX'), figureBody[3].getAttribute('posY')]
        ]
        // проверяем, можно ли нам дальше падать стоит ли хоть одна ячейка фигуры на нижнем ряду поля и занят ли ряд под фигурой
        // если хоть одна ячейка не проходит проверку, то наш флаг становится false
        coordinates.forEach(element => {
            if (element[1] == 1 || document.querySelector('[posX = "' + element[0] + '"][posY = "' + (+element[1] - 1) + '"]').classList.contains('set')) {
                moveFlag = false;
            }
        });
        // если движение вниз возможно, то делаем это
        if (moveFlag) {
            // удаляем класс figure у фигуры
            for (let i = 0; i < figureBody.length; i++) {
                figureBody[i].classList.remove('figure');
            }
            // перезаписываем координаты (понижаем ряд)
            figureBody = [document.querySelector('[posX = "' + coordinates[0][0] + '"][posY = "' + (+coordinates[0][1] - 1) + '"]'),
            document.querySelector('[posX = "' + coordinates[1][0] + '"][posY = "' + (+coordinates[1][1] - 1) + '"]'),
            document.querySelector('[posX = "' + coordinates[2][0] + '"][posY = "' + (+coordinates[2][1] - 1) + '"]'),
            document.querySelector('[posX = "' + coordinates[3][0] + '"][posY = "' + (+coordinates[3][1] - 1) + '"]')
            ];
            // ячейкам с новыми координатами задаем класс figure
            for (let i = 0; i < figureBody.length; i++) {
                figureBody[i].classList.add('figure');
            }
        } else {
            // если фигура не может падать дальше, то фиксируем ее положение в пространстве, удаляем класс figure и ставим класс set
            for (let i = 0; i < figureBody.length; i++) {
                figureBody[i].classList.remove('figure');
                figureBody[i].classList.add('set');
            }
            // проверяем, появились ли заполненные ряды на поле
            for (let i = 1; i < 14; i++) {
                let count = 0;
                for (let k = 1; k < 11; k++) {
                    if (document.querySelector('[posX = "' + k + '"][posY = "' + i + '"]').classList.contains('set')) {
                        count++;
                        if (count == 10) {
                            score += 10;
                            input.value = `Ваши очки: ${score}`;
                            for (let m = 1; m < 11; m++) {
                                document.querySelector('[posX = "' + m + '"][posY = "' + i + '"]').classList.remove('set');
                            }
                            let set = document.querySelectorAll('.set');
                            for (let x = 0; x < set.length; x++) {
                                let setCoordinates = [set[x].getAttribute('posX'), set[x].getAttribute('posY')];
                                if (setCoordinates[1] > i) {
                                    set[x].classList.remove('set');
                                    document.querySelector('[posX = "' + setCoordinates[0] + '"][posY = "' + (setCoordinates[1] - 1) + '"]').classList.add('set');;
                                }
                            }
                            i--;
                        }
                    }
                }
            }
            // если хоть одна ячейка на 15 ряду имеет класс set, то заканчиваем игру
            for (let i = 1; i < 11; i++) {
                if (document.querySelector('[posX = "' + i + '"][posY = "15"]').classList.contains('set')) {
                    clearInterval(interval);
                    alert(`Игра окончена. Ваши очки: ${score}`);
                    break;
                }
            }
            create();
        }
    }
    //запускаем движение
    let interval = setInterval(move, speed);
    let flag = true;

    window.addEventListener('keydown', function (e) {

        let coordinates1 = [figureBody[0].getAttribute('posX'), figureBody[0].getAttribute('posY')];
        let coordinates2 = [figureBody[1].getAttribute('posX'), figureBody[1].getAttribute('posY')];
        let coordinates3 = [figureBody[2].getAttribute('posX'), figureBody[2].getAttribute('posY')];
        let coordinates4 = [figureBody[3].getAttribute('posX'), figureBody[3].getAttribute('posY')];

        function getNewState(a) {
            flag = true;
            let figureNew = [document.querySelector('[posX = "' + (+coordinates1[0] + a) + '"][posY = "' + coordinates1[1] + '"]'),
                document.querySelector('[posX = "' + (+coordinates2[0] + a) + '"][posY = "' + coordinates2[1] + '"]'),
                document.querySelector('[posX = "' + (+coordinates3[0] + a) + '"][posY = "' + coordinates3[1] + '"]'),
                document.querySelector('[posX = "' + (+coordinates4[0] + a) + '"][posY = "' + coordinates4[1] + '"]')
            ];

             figureNew.forEach(function (item) {
                 if (!item || item.classList.contains('set')) {
                    flag = false;
                 }
             })

             if (flag) {
                 figureBody.forEach(function (item) {
                    item.classList.remove('figure');
                 });

                 figureBody = figureNew;

                 figureNew.forEach(function (item) {
                    item.classList.add('figure');
                 });
             }
        }

        if (e.keyCode == 37) {
            getNewState(-1);
        } else if (e.keyCode == 39) {
            getNewState(1);
        } 
        //ускоряем функцию, нажимая на кнопку "вниз"
        else if (e.keyCode == 40) {
            move();
        }

        else if (e.keyCode == 38) {

            flag = true;
            let figureNew = [
            document.querySelector('[posX = "' + (+coordinates1[0] + arrCoordinates[currentFigure][rotate + 2][0][0]) + '"][posY = "' + (+coordinates1[1] + arrCoordinates[currentFigure][rotate + 2][0][1]) + '"]'),
            document.querySelector('[posX = "' + (+coordinates2[0] + arrCoordinates[currentFigure][rotate + 2][1][0]) + '"][posY = "' + (+coordinates2[1] + arrCoordinates[currentFigure][rotate + 2][1][1]) + '"]'),
            document.querySelector('[posX = "' + (+coordinates3[0] + arrCoordinates[currentFigure][rotate + 2][2][0]) + '"][posY = "' + (+coordinates3[1] + arrCoordinates[currentFigure][rotate + 2][2][1]) + '"]'),
            document.querySelector('[posX = "' + (+coordinates4[0] + arrCoordinates[currentFigure][rotate + 2][3][0]) + '"][posY = "' + (+coordinates4[1] + arrCoordinates[currentFigure][rotate + 2][3][1]) + '"]')
            ];
            
            figureNew.forEach(function (item) {
                if (!item || item.classList.contains('set')) {
                    flag = false;
                }
            });

            if (flag) {
                figureBody.forEach(function (item) {
                    item.classList.remove('figure');
                });

                figureBody = figureNew;

                figureNew.forEach(function (item) {
                    item.classList.add('figure');
                });

                if (rotate < 4) {
                    rotate++;
                } else {
                    rotate = 1;
                }
            }
          }
    });
}