let shiftedy;
const bottomGap = 200;
const maxTraffic = 5;
let randomInterval;
let population;

const generation = document.querySelector("#generation");
const lifespan = document.querySelector("#lifespan");
const totalCars = document.querySelector("#population");
const fitness = document.querySelector("#fitness");

function setup() {
  createCanvas(512, innerHeight);
  road = new Road(width / 2, width * 0.9);
  population = new Population(800, 0.02);
  traffic = [
    new Car(
      road.getLaneCenter(floor(random(1, road.laneCount + 1))),
      height - 200,
      5,
      color(255, 0, 0),
      "DUMMY"
    ),
  ];
  randomInterval = random(50, 300);

  rectMode(CENTER);
  strokeWeight(2);
}

function draw() {
  background(150);
  // console.log(frameRate());

  shiftedy = height - population.bestCar.position.y - bottomGap;
  translate(0, shiftedy);
  road.render();
  traffic.forEach((dummycar, i) => {
    dummycar.update();
    dummycar.render();
    if (population.bestCar.position.y - dummycar.position.y < -400) {
      traffic.splice(i, 1);
      population.lifespan += 200;
    }
  });
  population.simulate();

  if (randomInterval < 0) {
    if (traffic.length < maxTraffic)
      traffic.push(
        new Car(
          road.getLaneCenter(floor(random(1, road.laneCount + 1))),
          population.bestCar.position.y - 800,
          random(4, 6),
          color(255, 0, 0),
          "DUMMY"
        )
      );
    randomInterval = random(50, 300);
  }
  randomInterval--;

  generation.innerHTML = population.generation;
  lifespan.innerHTML = population.lifespan;
  totalCars.innerHTML = population.population;
  fitness.innerHTML = population.bestCar.fitness;
}

function keyPressed() {
  if (keyCode === 78) population.newGeneration();
}

//Utility Functions
function getIntersection(A, B, C, D) {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }

  return null;
}
