


let puzzle = generate();

let sketch = function(p) {
  var backC;
  var xrot = 0;
  var yrot = 0;
  var tempXRot = 0;
  var tempYRot = 0;
  var colorScheme = [];
  var outlineColor;
  var outlineFaceColor;


  var boxSize = 240;
  var smallSize = boxSize / puzzle.length;

  var pMouseX = 0;
  var pMouseY = 0;

  p.mousePressed = function(){
    pMouseX = p.mouseX;
    pMouseY = p.mouseY;
    tempXRot = 0;
    tempYRot = 0;
  }

  p.mouseReleased = function(){
    tempYRot = p.mouseX - pMouseX;
    tempXRot = -1 * (p.mouseY - pMouseY);
    xrot += tempXRot;
    yrot += tempYRot;
  }

  function placeCube(color, x, y, z){

  }

  function renderPuzzle(puzzle){

  }

  function outline(){
    p.fill(outlineFaceColor);
    p.stroke(outlineColor);
    p.strokeWeight(3);
    p.box(240);
  }

  p.setup = function(){
    p.angleMode(p.RADIANS);
    p.createCanvas(500, 500, p.WEBGL);
    backC = p.color(42, 43, 46);

    colorScheme = [p.color(255, 0, 0), p.color(0, 255, 0), p.color(0, 0, 255), p.color(255, 255, 0), p.color(0, 255, 255), p.color(255, 0, 255), p.color(255, 255, 255)];
    shuffle(colorScheme);
    outlineColor = p.color(209, 70, 47);
    outlineFaceColor = p.color("rgba(0, 0, 0, 0)");

    yrot = p.PI / (4 * 0.01);
    xrot = p.asin(1 / p.pow(3, 0.5)) / -0.01;

  }

  p.draw = function(){

    if (p.mouseIsPressed){
      tempYRot = p.mouseX - pMouseX;
      tempXRot = -1 * (p.mouseY - pMouseY);
    }


    p.background(backC);
    if (p.mouseIsPressed){
      p.rotateX((xrot + tempXRot) * 0.01);
      p.rotateY((yrot + tempYRot) * 0.01);
    } else {
      p.rotateX(xrot * 0.01);
      p.rotateY(yrot * 0.01);
    }

    renderPuzzle(puzzle);
    outline();
  }

};

new p5(sketch, "p5-pane");




























// End
