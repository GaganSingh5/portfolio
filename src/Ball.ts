import p5 from "p5";
import Matter from "matter-js";

interface IStyle {
  fillColor: string;
  strokeColor: string;
}

class Ball {
  ball: Matter.Body;
  pos: Matter.Vector = { x: 0, y: 0 };
  angle: number = 0;
  style: IStyle;
  constructor(
    xCoor: number,
    yCoor: number,
    radius: number,
    options: Matter.IBodyDefinition | undefined,
    style: IStyle,
  ) {
    this.ball = Matter.Bodies.circle(xCoor, yCoor, radius, options)
    this.style = style;
  }

  show = (p5Instance: p5) => {
    this.pos = this.ball.position;
    this.angle = this.ball.angle;

    p5Instance.push();
    p5Instance.translate(this.pos.x, this.pos.y);
    p5Instance.rotate(this.angle);
    
    p5Instance.fill(this.style.fillColor);
    p5Instance.stroke(this.style.strokeColor);
    p5Instance.circle(0, 0, (this.ball.circleRadius || 10) * 2);

    p5Instance.pop();
  };
}

export default Ball