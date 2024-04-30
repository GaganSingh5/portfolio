import { useCallback, useEffect, useRef } from "react";
import "./App.scss";
import Matter from "matter-js";
import p5 from "p5";
import wordPath from "./wordsPath"
import Alphabet from "./Alphabet";
import Chain from "./Chain";
import Ball from "./Ball";

function App() {
  const canvasDivRef = useRef<HTMLDivElement>(null);


  const sketch = useCallback((p5Instance: p5) => {
    let engine: Matter.Engine;
    let world: Matter.World;
    let mattRender = Matter.Render;
    let mattRunner = Matter.Runner;
    let alphabets: Alphabet[] = [];
    let chain: Chain;
    let chains: Chain[] = [];
    let balls: Ball[] = [];
    const constraint = new Array<Matter.Constraint | Matter.MouseConstraint>();
    let mouse: Matter.Mouse;
    let mcontstraint;
    let renderer: p5.Renderer;
    let leftWall = null;
    let rightWall = null;
    let topWall = null;
    let bottomWall = null;
    let divisions = (canvasDivRef.current?.clientWidth || 600) / 12;

    const init = (render: p5.Renderer) => {
      leftWall = Matter.Bodies.rectangle(-25,
        (canvasDivRef.current?.clientHeight || 600) / 2,
        100, canvasDivRef.current?.clientHeight || 600,
        {
          isStatic: true
        }
      );
      rightWall = Matter.Bodies.rectangle((canvasDivRef.current?.clientWidth || 600) + 25,
        (canvasDivRef.current?.clientHeight || 600) / 2, 100, canvasDivRef.current?.clientHeight || 600,
        {
          isStatic: true
        }
      );
      topWall = Matter.Bodies.rectangle((canvasDivRef.current?.clientWidth || 600) / 2, -20,
        canvasDivRef.current?.clientWidth || 600,
        50,
        {
          isStatic: true,

        }
      );
      bottomWall = Matter.Bodies.rectangle((canvasDivRef.current?.clientWidth || 600) / 2,
        (canvasDivRef.current?.clientHeight || 600) + 45,
        (canvasDivRef.current?.clientWidth || 600) + 500,
        100,
        {
          isStatic: true,
          restitution: 0.8,
          collisionFilter: {
            group: 0x001
          }
        }
      );

      const wordList = [
        wordPath.G,
        wordPath.A,
        wordPath.G,
        wordPath.A,
        wordPath.N,
        wordPath.D,
        wordPath.E,
        wordPath.E,
        wordPath.P
      ]

      const arr = wordList?.map((word, index) => {
        return {
          word: word,
          xCoor: (divisions / 2) + divisions * 1.5 + divisions * index,
          yCoor: (canvasDivRef.current?.clientHeight || 600) / 2
        }
      })

      arr.forEach((e, index) => {
        const color = ["#F6995C", "#AD88C6", "#9BB0C1", "#C5EBAA", "#FFC0D9", "#EBE3D5"]
        let currColor = color[index % color.length];
        let alphabet = new Alphabet(e.word, e.xCoor + 10, e.yCoor + 10, {
          isStatic: false,
          mass: 1,
          restitution: 1, friction: 0.8, frictionAir: 0.001,
          collisionFilter: {
            category: 3,
            group: 1,
            mask: 4
          }
        }, {
          fillColor: "#F5EEE6",
          strokeColor: "#F5EEE6",
          scaleX: 1.5,
          scaleY: 1.5
        })
        alphabets.push(alphabet);

        // Matter.Body.setCentre(alphabet.alphabet, { x: 0, y: -20 }, true)

        chain = new Chain(e.xCoor, 0, 8, 50, 10, { chamfer: { radius: 5 } }, p5Instance)
        chains.push(chain);

        constraint.push(
          Matter.Constraint.create({
            pointA: { x: e.xCoor, y: 30 },
            bodyB: chain.links.bodies[0],
            // pointB: { x: chain.links.bodies[0].position.x, y: chain.links.bodies[0].position.y},
            length: 0,
            stiffness: 1
          })
        );


        constraint.push(
          Matter.Constraint.create({
            bodyA: chain.links.bodies[chain.links.bodies.length - 1],
            pointA: { x: 20, y: 0 },
            pointB: { x: 0, y: -10 },

            bodyB: alphabet.alphabet,
            length: 0,
            stiffness: 0.2
          })
        );
        // pointA: { x: 20, y: 0 },
        // pointB: { x: 0, y: -40 },
        // let chain = new Chain(e.x, 10, 20, 3, {
        //   restitution: 0, friction: 0, collisionFilter: {
        //     group: 0x0001,
        //     // mask: 0x0001
        //   }
        // }, p5Instance);
        // console.log(chain.beads);

        Matter.World.add(world, alphabet.alphabet);
        Matter.World.add(world, chain.links);


        // chain.beads.forEach(bead => {
        //   Matter.World.add(world, bead);
        // })
        // chain.constraints.forEach(constraint => {
        //   Matter.World.add(world, constraint);
        // })


        // if (index > 0) {
        //   constraint.push(
        //     Matter.Constraint.create({
        //       bodyA: alphabets[index].alphabet,
        //       bodyB: alphabets[index - 1].alphabet,
        //       // pointA: { x: alphabets[index].pos.x, y: alphabets[index].pos.y - 32 },
        //       length: 100,
        //       stiffness: 0.2
        //     })
        //   );
        // }

        // for (let index = 0; index < 20; index++) {
        //   let circle = Matter.Bodies.circle(Math.random() * (canvasDivRef.current?.clientWidth || 600),
        //     Math.random() * (canvasDivRef.current?.clientWidth || 600), Math.random() * 10,
        //     {
        //       collisionFilter: {
        //         group: 0x0002,
        //       }
        //     })

        //   Matter.World.add(world, circle);

        // }
        console.log("init done");

      })

      for (let index = 0; index < 100; index++) {
        // const group = Matter.Body.nextGroup(true);
        const color = ["#F6995C", "#AD88C6", "#9BB0C1", "#C5EBAA", "#FFC0D9", "#EBE3D5"]
        let currColor = color[index % color.length];
        
        let ball = new Ball(
          Math.random() * (canvasDivRef.current?.clientWidth || 600),
          -2000,
          Math.random() * 20 + 5,
          {
            mass: 10,
            restitution: 0.8,
            // frictionAir: 0.09,
            isStatic: false, collisionFilter: {
              category: 5,
              group: 1,
              mask: 6
            }
          },
          { fillColor: currColor, strokeColor: currColor }
        )
        console.log(ball);
        
        balls.push(ball)

        Matter.World.add(world, ball.ball);

      }

      let canvasElement: HTMLElement = render.elt;
      mouse = Matter.Mouse.create(canvasElement || canvasElement);
      mouse.pixelRatio = p5Instance.pixelDensity();
      mcontstraint = Matter.MouseConstraint.create(engine, {
        mouse: mouse,
        collisionFilter: {
          category: 3,
          mask: 4,
          group: 1
        }
      });
      mcontstraint.mouse.element.removeEventListener("mousewheel", mcontstraint.mouse.mousewheel);
      mcontstraint.mouse.element.removeEventListener("DOMMouseScroll", mcontstraint.mouse.mousewheel);
      Matter.World.add(world, constraint);
      Matter.World.add(world, mcontstraint);

      Matter.World.add(world, [leftWall, rightWall, bottomWall]);


    }
    p5Instance.preload = () => null;

    p5Instance.setup = () => {
      renderer = p5Instance.createCanvas(canvasDivRef.current?.clientWidth || 600, canvasDivRef.current?.clientHeight || 600);
      engine = Matter.Engine.create();
      world = engine.world;
      engine.gravity.y = 1;
      engine.gravity.x = 0;
      engine.gravity.scale = 0.01


      init(renderer);

    };

    // p5Instance.mouseClicked = (event: PointerEvent) => {
    //   console.log(event);
    // };

    p5Instance.windowResized = () => {
      console.log("resized called", canvasDivRef.current?.clientWidth);

      p5Instance.resizeCanvas(canvasDivRef.current?.clientWidth || 600, canvasDivRef.current?.clientHeight || 600);
      p5Instance.clear();
      alphabets = [];
      chains = [];
      balls = [];
      Matter.Engine.clear(engine);
      Matter.World.clear(world, false);
      // init()
    }
    // let textX = 0;
    // let textY = 100;
    p5Instance.draw = function () {
      // p5Instance.translate((canvasDivRef.current?.clientWidth || 600) / 2, (canvasDivRef.current?.clientHeight || 600) / 2);

      p5Instance.clear();
      // Matter.Engine.clear(engine);
      // textX++;
      // textY  = textY + 0.02;
      // p5Instance.text("h", (textX % (canvasDivRef.current?.clientWidth || 100)), Math.sin(textY) * 100 + 400);
      // p5Instance.text("i", (textX % (canvasDivRef.current?.clientWidth || 100)) + 40, Math.sin(textY + 0.5) * 100 + 400);
      // p5Instance.text("i", (textX % (canvasDivRef.current?.clientWidth || 100)) + 80, Math.sin(textY + 1) * 100 + 400);
      // p5Instance.text("i", (textX % (canvasDivRef.current?.clientWidth || 100)) + 120, Math.sin(textY + 1.5) * 100 + 400);
      // p5Instance.text("i", (textX % (canvasDivRef.current?.clientWidth || 100)) + 160, Math.sin(textY + 2) * 100 + 400);



      p5Instance.textSize(50)
      Matter.Engine.update(engine);
      chains.forEach((chain) => {
        chain.show();
      })
      alphabets.forEach((alphabet) => {
        alphabet.show(p5Instance);
      });

      balls.forEach((ball) => {
        ball.show(p5Instance);
      })
    };

  }, [canvasDivRef]);

  useEffect(() => {
    const p5Instance = new p5(sketch, canvasDivRef.current!);

    // On component destruction, delete the p5 instance
    return () => {
      p5Instance.remove();
    };
  });


  return (
    <>
      <div className="app antialiased bg-pink bg-noise">

        <header className="header fixed w-screen top-0 z-10">
          <nav className="text-cream navbar text-center pt-14 pb-8 px-40 flex justify-between">
            <a className="" href="/">
              GS
            </a>
            <div className="header__links flex gap-12">
              <a className="header__links_link">About</a>
              <a className="header__links_link">Projects</a>
              <a className="header__links_link">Contact</a>
            </div>
          </nav>
        </header>
        <main className="home pt-28">
          <section className="home__canvas grid grid-cols-3 grid-rows-3 h-[calc(100vh-7rem)] relative">
            {/* <p className="row-3">I am a software developer with around 3 years of experience.</p> */}
            <div
              className="w-full h-full absolute"
              ref={canvasDivRef}
            ></div>
          </section>
          <section className="home__canvas grid grid-cols-3 grid-rows-3 h-[calc(100vh-7rem)] relative">
          </section>
        </main>
      </div>
    </>
  );
}

export default App;