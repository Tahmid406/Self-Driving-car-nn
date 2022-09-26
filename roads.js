class Road {
  constructor(x, w, laneCount = 4) {
    this.x = x;
    this.laneCount = laneCount;
    this.width = w;
    this.border = {
      left: x - w / 2,
      right: x + w / 2,
    };
    this.dashGap = 30;
    this.dashlines = [];

    for (let i = 1; i < this.laneCount; i++) {
      const xposition = lerp(this.border.left, this.border.right, i / this.laneCount);
      let lane = [];
      for (let j = 0; j < Math.ceil(height / (this.dashGap * 2)); j++) {
        lane.push([xposition, j * this.dashGap * 2 + bottomGap]);
      }
      this.dashlines.push(lane);
    }
  }

  getLaneCenter(laneIndex) {
    return this.border.left + (this.width / this.laneCount) * (laneIndex - 0.5);
  }

  render() {
    noStroke();
    fill(255);
    //left border
    rect(this.border.left, -shiftedy + height / 2, 5, height);
    //right border
    rect(this.border.right, -shiftedy + height / 2, 5, height);
    //lane dividers
    this.dashlines.forEach((line) => {
      line.forEach((dash, i) => {
        rect(dash[0], dash[1], 5, this.dashGap);
        if (dash[1] + this.dashGap + shiftedy < 0) {
          line.splice(i, 1);
          line.push([line[line.length - 1][0], line[line.length - 1][1] + this.dashGap * 2]);
        } else if (dash[1] - this.dashGap + shiftedy > height) {
          line.splice(i, 1);
          line.unshift([line[0][0], line[0][1] - this.dashGap * 2]);
        }
      });
    });

    // circle(width / 2, -shiftedy + height / 2, 20);
  }
}
