class Sensor {
  constructor(car) {
    this.car = car;
    this.start = [];
    this.end = [];
    this.raySpread = -PI / 3;
    this.rayCounts = 5;
    this.rayLength = 200;

    this.readings = [];

    for (let i = 0; i < this.rayCounts; i++) {
      this.start[i] = { x: this.car.position.x, y: this.car.position.y };
    }
  }

  update(roadBorder, traffic) {
    this.castRays();
    this.readings = [];
    for (let i = 0; i < this.rayCounts; i++) {
      this.readings.push(this.getReading(this.start[i], this.end[i], roadBorder, traffic));
    }
  }

  getReading(rayStart, rayEnd, roadBorder, traffic) {
    let touches = [];

    //check if the ray intersects with road borders
    let touch = getIntersection(
      rayStart,
      rayEnd,
      { x: roadBorder.left, y: -shiftedy },
      { x: roadBorder.left, y: -shiftedy + height }
    );
    if (touch) touches.push(touch);
    touch = getIntersection(
      rayStart,
      rayEnd,
      { x: roadBorder.right, y: -shiftedy },
      { x: roadBorder.right, y: -shiftedy + height }
    );
    if (touch) touches.push(touch);

    //check if the ray intersects with traffic
    traffic.forEach((dummy) => {
      const dummypolygons = dummy.polygon;
      for (let i = 0; i < dummypolygons.length; i++) {
        touch = getIntersection(
          rayStart,
          rayEnd,
          dummypolygons[i],
          dummypolygons[(i + 1) % dummypolygons.length]
        );
        if (touch) touches.push(touch);
      }
    });

    if (touches.length == 0) return null;
    else {
      const offsets = touches.map((point) => point.offset);
      const minOffset = min(...offsets);
      return touches.find((point) => point.offset == minOffset);
    }
  }

  castRays() {
    for (let i = 0; i < this.rayCounts; i++) {
      const angle =
        lerp(this.raySpread, -this.raySpread, i / (this.rayCounts - 1)) + this.car.angle;

      this.start[i].x = this.car.position.x;
      this.start[i].y = this.car.position.y;

      this.end[i] = {
        x: this.start[i].x + this.rayLength * cos(angle),
        y: this.start[i].y + this.rayLength * sin(angle),
      };
    }
  }

  render() {
    for (let i = 0; i < this.rayCounts; i++) {
      let castedEnd = this.end[i];
      if (this.readings[i]) castedEnd = this.readings[i];
      stroke(241, 196, 15);
      line(this.start[i].x, this.start[i].y, castedEnd.x, castedEnd.y);
      stroke(0);
      line(castedEnd.x, castedEnd.y, this.end[i].x, this.end[i].y);
    }
  }
}
