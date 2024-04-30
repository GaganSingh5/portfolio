import p5 from "p5";
import Matter from "matter-js";

interface IStyle {
  fillColor: string;
  strokeColor: string;
  scaleX: number;
  scaleY: number;
}

class Alphabet {
  alphabet: Matter.Body;
  pos: Matter.Vector = { x: 0, y: 0 };
  angle: number = 0;
  vectors: Matter.Vector[];
  style: IStyle;
  constructor(
    path: string,
    xCoor: number,
    yCoor: number,
    options: Matter.IChamferableBodyDefinition | undefined,
    style: IStyle,
  ) {
    this.vectors = this.processPath(path).map((coor) => {
      return Matter.Vector.create(coor.x, coor.y);
    });
    this.vectors = Matter.Vertices.scale(this.vectors, style.scaleX, style.scaleY, Matter.Vertices.centre(this.vectors))
    this.alphabet = Matter.Bodies.fromVertices(xCoor, yCoor, [this.vectors], options);
    this.style = style;

  }

  parseCoordinates(coordinatesString: string) {
    const lines = coordinatesString.trim().split("\n");
    const coordinatesArray: Matter.Vector[] = [];

    for (const line of lines) {
      if (line === "#") {
        break;
      }

      const [x, y] = line.split(",").map(Number);
      let vector: Matter.Vector = { x, y };
      coordinatesArray.push(vector);
    }

    return coordinatesArray;
  };

  processPath(letter: string) {
    const coordinatesArray = this.parseCoordinates(letter);
    const centroid = Matter.Vertices.centre(coordinatesArray);
    let centeredCoordinates = coordinatesArray.map((point) => {
      point.x = point.x - centroid.x;
      point.y = point.y - centroid.y;
      return point;
    });

    return centeredCoordinates;
  };

  show = (p5Instance: p5) => {
    this.pos = this.alphabet.position;
    this.angle = this.alphabet.angle;

    p5Instance.push();
    p5Instance.translate(this.pos.x, this.pos.y);
    p5Instance.rotate(this.angle);

    p5Instance.beginShape();
    this.vectors.forEach((coor) => {
      p5Instance.vertex(coor.x, coor.y);
    });
    p5Instance.fill(this.style.fillColor);
    p5Instance.stroke(this.style.strokeColor);
    p5Instance.endShape(p5Instance.CLOSE);

   
    p5Instance.pop();
  };
}

export default Alphabet