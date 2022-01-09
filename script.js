
const complexity = 10;

let puzzle = complexGenerate(complexity);

var colorScheme = ["03045e","0077b6", "00b4d8","90e0ef","caf0f8","003049","d62828","f77f00","fcbf49","eae2b7"];
var checkBoxes = [];
var labels = [];

function createCheck(){
  let pane = document.getElementById("check-pane");
  for (let i = 0; i < pieces; i++){
    let checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.name = "piecetoggle" + i;
    checkBox.id = "piecetoggle" + i;
    checkBox.checked = true;
    let label = document.createElement("lable");
    label.for = checkBox.id;

    label.style.backgroundColor = "#" + colorScheme[i];
    label.style.display = "inline-block";
    label.style.width = "40px";
    label.style.height = "20px";
    label.style.borderRadius = "5px";

    checkBox.style.width = "20px";
    checkBox.style.height = "20px";
    checkBox.transition = "background-color 1s";

    let br = document.createElement("br");
    checkBoxes.push(checkBox);
    labels.push(label);
    pane.appendChild(checkBox);
    pane.appendChild(label);
    pane.appendChild(br);
  }
  let button = document.createElement("button");
  button.innerHTML = "Deselect";
  button.style.fontSize = "14px";
  button.style.backgroundColor = "rgb(209, 70, 47)";
  button.style.color = "rgb(215, 185, 213)";
  button.style.textAlign = "center";
  button.style.width = "65px";
  button.style.height = "20px";
  button.onclick = deselectAll;
  pane.appendChild(button);
}

createCheck();

function deselectAll(){
  for (let i = 0; i < checkBoxes.length; i++){
    checkBoxes[i].checked = false;
  }
}



function regen(){
  puzzle = complexGenerate(complexity);
  shuffle(colorScheme);

  for (let i = 0; i < checkBoxes.length; i++){
    checkBoxes[i].checked = true;
    labels[i].style.backgroundColor = colorScheme[i].toString("#rrggbb");
  }
}


let sketch = function(p) {
  var backC;
  var xrot = 0;
  var yrot = 0;
  var tempXRot = 0;
  var tempYRot = 0;
  var outlineColor;
  var outlineFaceColor;


  var boxSize = 240;
  var outBuffer = 5;
  var smallSize = (boxSize - (outBuffer * 2)) / puzzle.length;

  var pMouseX = 0;
  var pMouseY = 0;
  var transparentC;

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
    p.push();

    p.translate(x, y, z);
    p.fill(color);
    p.shininess(20);
    p.strokeWeight(1);
    p.stroke(0);

    p.box(smallSize);

    p.pop();
  }

  function renderPuzzle(puzzle){
    for (let x = 0; x < puzzle.length; x++){
      for (let y = 0; y < puzzle[x].length; y++){
        for (let z = 0; z < puzzle[x][y].length; z++){
          if (checkBoxes[puzzle[x][y][z]].checked){
            let xCoord = (x + 0.5 - (puzzle.length / 2)) * smallSize;
            let yCoord = (y + 0.5 - (puzzle[x].length / 2)) * smallSize;
            let zCoord = (z + 0.5 - (puzzle[x][y].length / 2)) * smallSize;
            placeCube(colorScheme[puzzle[x][y][z]], xCoord, yCoord, zCoord);
          }
        }
      }
    }

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
    transparentC = p.color("rgba(0, 0, 0, 0)");


    // colorScheme = [p.color(255, 0, 0), p.color(0, 255, 0), p.color(0, 0, 255), p.color(255, 255, 0), p.color(0, 255, 255), p.color(255, 0, 255), p.color(255, 255, 255)];


    for (let i = 0; i < colorScheme.length; i++){
      colorScheme[i] = (p.color("#" + colorScheme[i]));
    }

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

    // p.ambientLight(p.color(214, 188, 60));
    p.ambientLight(125);
    p.directionalLight(255, 255, 255, 1, 0, -1)

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
