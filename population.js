class Population {
  constructor(maxCars, mutationRate) {
    this.maxCars = maxCars;
    this.mutationRate = mutationRate;
    this.cars = [];
    this.totalFitness = 0;
    this.lifespan = 600;
    this.lane = floor(random(1, road.laneCount + 1));
    this.generation = 0;
    this.population = 0;

    for (let i = 0; i < maxCars; i++) {
      this.cars.push(
        new Car(road.getLaneCenter(this.lane), height, 8, color(0, 0, 255, 20), "PLAYER")
      );
    }
    this.bestCar = this.cars[0];
  }

  calcTotalFitness() {
    let sum = 0;
    this.cars.forEach((car) => {
      sum += car.fitness;
    });
    this.totalFitness = sum;
  }

  normalizeFitness() {
    this.cars.forEach((car) => {
      car.fitness = car.fitness / this.totalFitness;
    });
  }

  naturalSelection() {
    let i = 0;
    let r = Math.random();

    while (r > 0) {
      r -= this.cars[i].fitness;
      i++;
    }
    i--;
    return this.cars[i].brain;
  }

  newGeneration() {
    this.calcTotalFitness();
    this.normalizeFitness();
    let newGenerationCars = [];
    this.lane = floor(random(1, road.laneCount + 1));
    for (let i = 0; i < this.maxCars; i++) {
      let child = new Car(road.getLaneCenter(this.lane), height, 8, color(0, 0, 255, 20), "PLAYER");
      let childBrain = this.naturalSelection().copy();
      child.brain = childBrain;
      child.mutate(this.mutationRate);
      newGenerationCars[i] = child;
    }
    this.cars = newGenerationCars;
    this.bestCar = this.cars[0];

    this.generation++;
    this.lifespan = 500;
    traffic = [new Car(road.getLaneCenter(this.lane), height - 200, 5, color(255, 0, 0), "DUMMY")];
  }

  simulate() {
    this.population = 0;
    this.cars.forEach((car, i) => {
      if (car.damaged) return;
      this.population++;
      car.update(road.border, traffic);
      car.render();
      if (this.bestCar.position.y - car.position.y < -400) car.damaged = true;
    });
    this.getBestCar();
    this.bestCar.renderBest();
    this.lifespan--;
    if (this.population == 0 || this.lifespan < 0) this.newGeneration();
  }

  getBestCar() {
    let bestFitness = this.cars[0].fitness;
    for (let i = 1; i < this.maxCars; i++) {
      if (this.cars[i].fitness > bestFitness) {
        bestFitness = this.cars[i].fitness;
        this.bestCar = this.cars[i];
      }
    }
  }
}
