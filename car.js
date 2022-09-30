class Car {
  constructor(x, y, maxSpeed, color, controlType) {
    this.position = { x: x, y: y };
    this.angle = -PI / 2;
    this.dimention = { h: 110, w: 60 };
    this.color = color;
    this.speed = 0;
    this.maxSpeed = maxSpeed;
    this.friction = 0.04;
    this.moving = {
      up: false,
      right: false,
      down: false,
      left: false,
    };
    this.damaged = false;
    this.fitness = 0;

    this.polygon = this.generateploygon();
    if (controlType == "PLAYER") {
      this.sensor = new Sensor(this);
      this.brain = new NeuralNetwork(this.sensor.rayCounts, 6, 4);
    }
  }

  detectcollison(roadBorder, traffic) {
    let collided = false;
    //Detects collison with the road borders
    for (let i = 0; i < this.polygon.length; i++) {
      if (
        getIntersection(
          this.polygon[i],
          this.polygon[(i + 1) % this.polygon.length],
          { x: roadBorder.left, y: -shiftedy },
          { x: roadBorder.left, y: -shiftedy + height }
        )
      ) {
        collided = true;
        break;
      } else if (
        getIntersection(
          this.polygon[i],
          this.polygon[(i + 1) % this.polygon.length],
          { x: roadBorder.right, y: -shiftedy },
          { x: roadBorder.right, y: -shiftedy + height }
        )
      ) {
        collided = true;
        break;
      }
    }
    if (collided) return collided;

    //Detecs collison with other traffic
    traffic.forEach((dummy) => {
      const dummypolygons = dummy.polygon;
      for (let i = 0; i < dummypolygons.length; i++) {
        if (collided) break;
        for (let j = 0; j < this.polygon.length; j++) {
          if (
            getIntersection(
              this.polygon[j],
              this.polygon[(j + 1) % this.polygon.length],
              dummypolygons[i],
              dummypolygons[(i + 1) % dummypolygons.length]
            )
          ) {
            collided = true;
            break;
          }
        }
      }
    });

    return collided;
  }

  generateploygon() {
    let points = [];
    const diagonal = pow(pow(this.dimention.h, 2) + pow(this.dimention.w, 2), 0.5) / 2;
    const rad = atan(this.dimention.h / this.dimention.w);
    points.push({
      x: this.position.x + diagonal * cos(HALF_PI + this.angle + rad),
      y: this.position.y + diagonal * sin(HALF_PI + this.angle + rad),
    });
    points.push({
      x: this.position.x + diagonal * cos(3 * HALF_PI + this.angle - rad),
      y: this.position.y + diagonal * sin(3 * HALF_PI + this.angle - rad),
    });
    points.push({
      x: this.position.x - diagonal * cos(HALF_PI + this.angle + rad),
      y: this.position.y - diagonal * sin(HALF_PI + this.angle + rad),
    });
    points.push({
      x: this.position.x - diagonal * cos(3 * HALF_PI + this.angle - rad),
      y: this.position.y - diagonal * sin(3 * HALF_PI + this.angle - rad),
    });
    return points;
  }

  update(roadBorder, traffic) {
    this.polygon = this.generateploygon();
    if (!this.damaged) {
      if (this.sensor) this.move();
      else this.speed = this.maxSpeed;
      if (roadBorder) {
        this.sensor.update(roadBorder, traffic);
        this.getMovement();
      }
      this.position.x += this.speed * cos(this.angle);
      this.position.y += this.speed * sin(this.angle);
      if (height - this.position.y > 0) this.fitness = pow((height - this.position.y) / 1000, 2);
      if (roadBorder && this.detectcollison(roadBorder, traffic)) this.damaged = true;
    }
  }

  getMovement() {
    const movementResponse = this.brain.feedForward(
      this.sensor.readings.map((x) => (x == null ? 0 : 1 - x.offset))
    );
    movementResponse[0] > 0.5 ? (this.moving.up = true) : (this.moving.up = false);
    movementResponse[1] > 0.5 ? (this.moving.right = true) : (this.moving.right = false);
    movementResponse[2] > 0.5 ? (this.moving.down = true) : (this.moving.down = false);
    movementResponse[3] > 0.5 ? (this.moving.left = true) : (this.moving.left = false);
  }

  move() {
    if (this.moving.up) this.speed += 0.1;
    if (this.moving.down) this.speed += -0.1;

    const flag = map(this.speed, -8, 8, -1, 1);
    if (this.moving.right) this.angle += 0.05 * flag;
    if (this.moving.left) this.angle += 0.05 * -flag;

    if (this.speed > 0) this.speed -= this.friction;
    else if (this.speed < 0) this.speed += this.friction;
    if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
    if (this.speed < -this.maxSpeed) this.speed = -this.maxSpeed;
  }

  mutate(mutationRate) {
    function mutate(val) {
      if (random() < mutationRate) return val + randomGaussian();
      else return val;
    }

    this.brain.ih_weights = this.brain.ih_weights.map(mutate);
    this.brain.ho_weights = this.brain.ho_weights.map(mutate);
    this.brain.bias_h = this.brain.bias_h.map(mutate);
    this.brain.bias_o = this.brain.bias_o.map(mutate);
  }
  
    renderBest() {
    if (!this.damaged) fill(0, 0, 255);
    quad(
      this.polygon[0].x,
      this.polygon[0].y,
      this.polygon[1].x,
      this.polygon[1].y,
      this.polygon[2].x,
      this.polygon[2].y,
      this.polygon[3].x,
      this.polygon[3].y
    );
    this.sensor.render();
  }

  render() {
    noStroke();
    fill(this.color);
    quad(
      this.polygon[0].x,
      this.polygon[0].y,
      this.polygon[1].x,
      this.polygon[1].y,
      this.polygon[2].x,
      this.polygon[2].y,
      this.polygon[3].x,
      this.polygon[3].y
    );
  }
}
