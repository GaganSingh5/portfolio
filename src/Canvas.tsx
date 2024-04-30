import Matter from 'matter-js';
import p5 from 'p5';
import React, { useCallback, useRef } from 'react'
import Alphabet from './Alphabet';
import Chain from './Chain';
import wordPath from './wordsPath';

function Canvas() {
  const canvasDivRef = useRef<HTMLDivElement>(null);
  const sketch = useCallback((p5Instance: p5) => {
    let engine: Matter.Engine;
    let world: Matter.World;
    const alphabets: Alphabet[] = [];
    const chains: Chain[] = [];
    const constraint = new Array<Matter.Constraint | Matter.MouseConstraint>();
    let mouse;
    let mcontstraint;


    p5Instance.setup = () => {
      const render = p5Instance.createCanvas(canvasDivRef.current?.clientWidth || 600, canvasDivRef.current?.clientHeight || 600);
      engine = Matter.Engine.create();
      world = engine.world;
      const arr = [{
        word: wordPath.G,
        x: 40 + ((canvasDivRef.current?.clientWidth || 600) / 3)
      },
      {
        word: wordPath.A,
        x: 110 + ((canvasDivRef.current?.clientWidth || 600) / 3)
      },
      {
        word: wordPath.G,
        x: 190 + ((canvasDivRef.current?.clientWidth || 600) / 3)
      },
      {
        word: wordPath.A,
        x: 270 + ((canvasDivRef.current?.clientWidth || 600) / 3)
      },
      {
        word: wordPath.N,
        x: 350 + ((canvasDivRef.current?.clientWidth || 600) / 3)
      }
      ]

      arr.forEach((e, index) => {
        let alphabet = new Alphabet(e.word, e.x, 50, p5Instance, {
          restitution: 0, friction: 0.8, frictionAir: 0.001, collisionFilter: {
            group: 0x0002,
            mask: 0x0001
          }
        })
        let chain = new Chain(e.x, 10, 20, 3, {
          restitution: 0, friction: 0, collisionFilter: {
            group: 0x0001,
            // mask: 0x0001
          }
        }, p5Instance);
        console.log(chain.beads);

        Matter.World.add(world, alphabet.alphabet);

        chain.beads.forEach(bead => {
          Matter.World.add(world, bead);
        })
        chain.constraints.forEach(constraint => {
          Matter.World.add(world, constraint);
        })
        alphabets.push(alphabet);
        chains.push(chain);
        // constraint.push(
        //   Matter.Constraint.create({
        //     pointA: { x: e.x, y: 10 },
        //     bodyB: chain.beads[0],
        //     pointB: { x: alphabets[index].pos.x, y: alphabets[index].pos.y - 10 },
        //     length: 0,
        //     stiffness: 1
        //   })
        // );

        constraint.push(
          Matter.Constraint.create({
            bodyA: alphabets[index].alphabet,
            bodyB: chain.beads[chain.beads.length - 1],
            pointA: { x: alphabets[index].pos.x, y: alphabets[index].pos.y - 32 },
            length: 0,
            stiffness: 1
          })
        );

      })


      let canvasElement: HTMLCanvasElement = render.elt;
      mouse = Matter.Mouse.create(canvasElement.parentElement || canvasElement);
      mcontstraint = Matter.MouseConstraint.create(engine, {
        mouse: mouse
      });

      Matter.World.add(world, constraint);
      Matter.World.add(world, mcontstraint);
    };

    p5Instance.mousePressed = () => { };

    p5Instance.windowResized = () => {
      p5Instance.resizeCanvas(canvasDivRef.current?.clientWidth || 600, canvasDivRef.current?.clientHeight || 600);
    }
    p5Instance.draw = function () {
      p5Instance.clear();
      Matter.Engine.update(engine);
      chains.forEach((chain) => {
        chain.show();
      })
      alphabets.forEach((box) => {
        box.show();
      });

    };
  }, []);
  return (
    <div className='canvas__container'></div>
  )
}

export default Canvas