import Matter from 'matter-js';
import p5 from "p5";
const color = ["#F6995C", "#AD88C6", "#9BB0C1", "#C5EBAA", "#FFC0D9", "#EBE3D5"]
class Chain {
  links: Matter.Composite;
  linkWidth: number;
  constraints: Matter.Constraint[];
  p: p5;
  pos: Matter.Vector[] = [];
  angle: number[] = [];
  constructor(
    x: number, 
    y: number, 
    numLinks: number, 
    linkWidth: number, 
    linkHeight: number, 
    linkOptions: Matter.IChamferableBodyDefinition, 
    p5Instance: p5) {
    // let group = Matter.Body.nextGroup(true);
    this.linkWidth = linkWidth;
    this.links = Matter.Composites.stack(x, y, 1, numLinks, 10, 0, (x: number, y: number) => {
      linkWidth;
      return Matter.Bodies.rectangle(x, y, linkHeight, linkWidth, {
        ...linkOptions,
        collisionFilter: {
          group: -2,
          category: 1,
          mask: 2
        }
      });
    });
    Matter.Composites.chain(this.links, 0.25, 0, -0.25, 0, { stiffness: 1, length: 0 });
    this.constraints = [];
    this.p = p5Instance;
  }


  show = () => {

    for (let index = 0; index < this.links.bodies.length; index++) {
      const link = this.links.bodies[index];
      let fillColor = color[index % color.length]

      this.p.push();
      this.p.translate(link.position.x, link.position.y);
      this.p.rotate(link.angle);
      this.p.rectMode(this.p.CENTER);
      this.p.fill(fillColor);
      this.p.stroke(fillColor);
      this.p.rect(0, 0, 50, this.linkWidth, 12);
      this.p.pop();
    }

    for (let index = 0; index < this.links.constraints.length; index++) {
      const constraint = this.links.constraints[index];

      this.p.push();
      this.p.fill(0,0,0,0);
      this.p.stroke("white");
      this.p.strokeWeight(2);
      this.p.translate(this.links.bodies[index].position.x, this.links.bodies[index].position.y);
      this.p.rectMode(this.p.CENTER);
      this.p.circle(constraint.pointA.x, constraint.pointA.y, 5);
      this.p.pop();
    }



  }
}


export default Chain;