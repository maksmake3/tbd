const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Body } = Matter;

const engine = Engine.create();
engine.world.gravity.y = 0; // Убираем гравитацию
const world = engine.world;

const container = document.getElementById('container');

const render = Render.create({
    element: container,
    engine: engine,
    options: {
        width: container.offsetWidth,
        height: container.offsetHeight,
        wireframes: false,
        background: 'black'
    }
});

Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

// Функция для определения максимального размера шара в зависимости от размера контейнера
function getMaxBallSize() {
    const maxWidth = container.offsetWidth;
    const maxHeight = container.offsetHeight;
    const minDimension = Math.min(maxWidth, maxHeight);
    return minDimension * 0.1; // Примерно 10% от меньшей стороны контейнера
}

function createBall() {
    const maxSize = getMaxBallSize();
    const size = Math.random() * maxSize + 10; // Size between 10 and maxSize

    const ball = Bodies.circle(Math.random() * container.offsetWidth, Math.random() * container.offsetHeight, size, {
        restitution: 0.9, // High restitution to make balls bounce more
        render: { fillStyle: 'grey' }
    });
    Composite.add(world, ball);
}

// Создаем 100 шаров
for (let i = 0; i < 100; i++) {
    setTimeout(createBall, i * 100); // Добавляем шары с интервалом, чтобы они не создавались одновременно
}

// Создаем стены для контейнера
const ground = Bodies.rectangle(container.offsetWidth / 2, container.offsetHeight + 25, container.offsetWidth, 50, { isStatic: true, render: { fillStyle: 'grey' } });
const leftWall = Bodies.rectangle(-25, container.offsetHeight / 2, 50, container.offsetHeight, { isStatic: true, render: { fillStyle: 'grey' } });
const rightWall = Bodies.rectangle(container.offsetWidth + 25, container.offsetHeight / 2, 50, container.offsetHeight, { isStatic: true, render: { fillStyle: 'grey' } });
const ceiling = Bodies.rectangle(container.offsetWidth / 2, -25, container.offsetWidth, 50, { isStatic: true, render: { fillStyle: 'grey' } });

Composite.add(world, [ground, leftWall, rightWall, ceiling]);

// Добавляем возможность взаимодействия мышкой
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: { visible: false }
    }
});
Composite.add(world, mouseConstraint);

render.mouse = mouse;

// Функция для добавления случайной силы к шарам
function applyRandomForce() {
    Composite.allBodies(world).forEach(body => {
        if (!body.isStatic) {
            const forceMagnitude = 0.0005 * body.mass; // Уменьшаем силу для медленного движения
            Body.applyForce(body, body.position, {
                x: (Math.random() - 0.5) * forceMagnitude,
                y: (Math.random() - 0.5) * forceMagnitude
            });
        }
    });
}

// Применяем случайные силы к шарам каждые 1000 миллисекунд
setInterval(applyRandomForce, 1000);

