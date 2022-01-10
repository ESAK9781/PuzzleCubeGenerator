
const pieces = 5;
const finalDim = 3;
const maxSize = 6;
const minSize = 4;
const maxIterations = 2000;





function disassembleAnim(){
  let cube = JSON.parse(JSON.stringify(c)); // clone the cube, so we can work on it
  let directions = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
    [-1, 0, 0],
    [0, -1, 0],
    [0, 0, -1]
  ];
  let toPull = [];

  let pulled = true;
  let pulledCount = 0;

  let stillThere = []; // list of which pieces have not been pulled out
  for (let i = 0; i < pieces; i++){
    stillThere.push(true);
  }

  while (pulled && pulledCount < pieces){
    pulled = false;

    for (let pieceNum = 0; pieceNum < pieces; pieceNum++){
      if (stillThere[pieceNum]){
        for (let dnum = 0; dnum < directions.length; dnum++){
          if (canEscape(cube, pieceNum, directions[dnum])){
            pullPiece(cube, pieceNum);
            stillThere[pieceNum] = false;
            pulled = true;
            pulledCount++;
            toPull[pieceNum] = [...directions[dnum]];
            let tDir = directions[dnum];
            directions.splice(dnum, 1);
            directions.push(tDir);
            break;
          }
        }
      }
    }
  }

  return toPull;
}






function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function perimeter(cub){
  let per = 0;
  for (let pNum = 0; pNum < pieces; pNum++){
    for (let x = 0; x < cub.length; x++){
      for (let y = 0; y < cub[x].length; y++){
        for (let z = 0; z < cub[x][y].length; z++){
          if (x == 0){
            per++;
            if (cub[x + 1][y][z] != pNum){
              per++;
            }
          } else if (x == cub.length - 1){
            per++;
            if (cub[x - 1][y][z] != pNum){
              per++;
            }
          }

          if (y == 0){
            per++;
            if (cub[x][y + 1][z] != pNum){
              per++;
            }
          } else if (y == cub[x].length - 1){
            per++;
            if (cub[x][y - 1][z] != pNum){
              per++;
            }
          }

          if (z == 0){
            per++;
            if (cub[x][y][z + 1] != pNum){
              per++;
            }
          } else if (z == cub[x][y].length - 1){
            per++;
            if (cub[x][y][z - 1] != pNum){
              per++;
            }
          }
        }
      }
    }
  }
  return per;
}



function intersection(cub){
  let vol = 0;
  for (let i = 0; i < pieces; i++){
    let minX;
    let maxX;
    let minY;
    let maxY;
    let minZ;
    let maxZ;
    for (let x = 0; x < cub.length; x++){
      for (let y = 0; y < cub[x].length; y++){
        for (let z = 0; z < cub[x][y].length; z++){
          if (cub[x][y][z] == i){
            if (minX == undefined){
              minX = x;
              maxX = x;
              minY = y;
              maxY = y;
              minZ = z;
              maxZ = z;
            } else {
              if (x < minX){
                minX = x;
              }
              if (x > maxX){
                maxX = x;
              }

              if (y < minY){
                minY = y;
              }
              if (y > maxY){
                maxY = y;
              }

              if (z < minZ){
                minZ = z;
              }
              if (z > maxZ){
                maxZ = z;
              }
            }
          }
        }
      }
    }
    vol += ((maxX - minX) + 1) * ((maxY - minY) + 1) * ((maxZ - minZ) + 1);
  }
  return vol;
}


function scorePuzzle(p){
  return (intersection(p) - 27 + perimeter(p));
}


function complexGenerate(n){
  let cubes = [];
  let bestScore = 0;
  let bestIndex = 0;
  for (let i = 0; i < n; i++){
    try{
      cubes.push(generate());
      let cubeScore = scorePuzzle(cubes[i]);
      if (cubeScore > bestScore){
        bestScore = cubeScore;
        bestIndex = i;
      }
    } catch(e){
      console.error(e);
    }

  }
  console.log(bestScore);
  return cubes[bestIndex];
}


function generate(){
  let cub = createCube(finalDim, undefined);
  let stack = []; //a stack of all changes
  let walkers = []; //a list of walkers
  let tileCounts = []; //a list of block counts
  let tileTotal = 0; //total tiles filled
  let directions = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
    [-1, 0, 0],
    [0, -1, 0],
    [0, 0, -1]
  ]; //list of directions a walker can expand
  shuffle(directions);

  let corns = corners(finalDim);
  shuffle(corns);
  for (let i = 0; i < pieces; i++){
    walkers.push(corns.pop());
    tileCounts.push(0);
    stack.push({
      coord: walkers[i],
      placed: true,
      dir: 0,
      walker: i,
      start: 0
    });
    tileTotal++;
  }


  let iterations = 0;
  while (tileTotal < finalDim * finalDim * finalDim){
    iterations++;

    if (iterations % 100 == 0){
      console.log(`${tileTotal} filled at ${iterations}`);
      console.log(`Piece Sizes: ${tileCounts}`);
      console.log("\n");
    }

    if (iterations > 2000){
      console.log("     MODEL FAILED: starting over\n\n");
      return generate();
    }
    // backtracking algorithm
    let toMove = (stack[stack.length - 1].walker + 1) % walkers.length;

    if (tileCounts[toMove] < maxSize){ // TODO finish this
      //if this piece if not complete
      let accepted = move(walkers, toMove, stack, directions, tileCounts, cub);

      if (!(accepted && tempCriteria(cub))){
        do{
          accepted = back(walkers, stack, directions, tileCounts, cub);
        } while (!(tempCriteria(cub) && accepted));
      }
      tileTotal = summate(tileCounts);

    } else {
      stack.push({
        coord: undefined,
        placed: false,
        dir: undefined,
        walker: toMove,
        start: undefined
      });
    }









  }

  if (!finalCriteria(cub)){
    console.log("     MODEL FAILED: starting over\n\n");
    cub = generate();
  }

  tileCounts = pieceCount(splitPieces(cub));
  tileTotal = summate(tileCounts);

  console.log(`\nMODEL COMPLETED: \n     piece sizes:  ${tileCounts}\n     total filled: ${tileTotal}`);
  return cub;
}


function back(walkers, stack, directions, tileCounts, cub){
  let prev = stack.pop();
  let accepted = true;
  // if this was a filler move (nothing was actually moved), we will return true, as such a move could not have caused a problem
  if (!(prev.coord == undefined)){
    if (prev.placed){
      if (cub[prev.coord[0]][prev.coord[1]][prev.coord[2]] == prev.walker){
        cub[prev.coord[0]][prev.coord[1]][prev.coord[2]] = undefined;
        prev.placed = false;
        tileCounts[prev.walker]--;
      } else {
        prev.placed = false;
      }
    }

    for (let i = 0; i < directions[prev.dir].length; i++){
      walkers[prev.walker][i] -= directions[prev.dir][i];
    }

    prev.dir = (prev.dir + 1) % directions.length;
    if (prev.dir == prev.start){ // we have looped over all of the possible directions and none of them work
      return false;
    } else {
      for (let i = 0; i < directions[prev.dir].length; i++){
        walkers[prev.walker][i] += directions[prev.dir][i];
      }
      prev.coord = [...walkers[prev.walker]];

      for (let i = 0; i < prev.coord.length; i++){
        if (prev.coord[i] < 0 || prev.coord[i] >= finalDim){
          accepted = false;
        }
      }

      if (accepted){
        if (cub[prev.coord[0]][prev.coord[1]][prev.coord[2]] == undefined){
          prev.placed = true;
          cub[prev.coord[0]][prev.coord[1]][prev.coord[2]] = prev.walker;
          tileCounts[prev.walker]++;
        } else if (cub[prev.coord[0]][prev.coord[1]][prev.coord[2]] == prev.walker){
          prev.placed = false;
        } else {
          accepted = false;
        }
      }

      stack.push(prev); //try the changed move, if it does not work, it will be undone and changed again
    }
  }

  return accepted;
}



// returns whether the move definately is acceptable
function move(walkers, toMove, stack, directions, tileCounts, cub){
  let choice = Math.floor(Math.random() * directions.length);
  let placing = false;
  let accepted = true;

  for (let i = 0; i < walkers[toMove].length; i++){
    walkers[toMove][i] += directions[choice][i];
    if (walkers[toMove][i] < 0 || walkers[toMove][i] >= finalDim){
      accepted = false;
    }
  }

  if (accepted){
    let coord = walkers[toMove];
    if (cub[coord[0]][coord[1]][coord[2]] == undefined){
      cub[coord[0]][coord[1]][coord[2]] = toMove;
      tileCounts[toMove]++;
    } else {
      // TODO check if we could place something and do so
      placing = false;
      if (cub[coord[0]][coord[1]][coord[2]] != toMove){
        accepted = false;
      }
    }
  }

  stack.push({
    coord: [...walkers[toMove]],
    placed: placing,
    dir: choice,
    walker: toMove,
    start: choice
  });
  return accepted;
}


function summate(ar){
  let s = 0;
  for (let i = 0; i < ar.length; i++){
    s += ar[i];
  }
  return s;
}


// Get the corner coordinates of a dim x dim x dim cube
function corners(dim){
  let d = dim - 1;
  let out = [];
  for (let x = 0; x <= 1; x++){
    for (let y = 0; y <= 1; y++){
      for (let z = 0; z <= 1; z++){
        out.push([x * d, y * d, z * d]);
      }
    }
  }
  return out;
}

var testCube = [
  [
    [0, 0, 0],
    [0, 1, 1],
    [1, 1, 1]
  ],
  [
    [2, 2, 2],
    [2, 3, 3],
    [3, 3, 3]
  ],
  [
    [4, 4, 4],
    [4, 5, 5],
    [5, 5, 5]
  ]
];



function finalCriteria(p){

  let pieceArr = splitPieces(p);
  let counts = pieceCount(pieceArr);

  for (let i = 0; i < counts.length; i++){
    if (counts[i] > maxSize || counts[i] < minSize){
      console.log(`ERROR: Piece number ${i} is of incorrect size at ${counts[i]} blocks`);
      return false;
    }
  }

  if (pieceArr.length != pieces){
    console.log(`ERROR: There are ${pieceArr.length} pieces, there should be ${pieces}`);
    return false;
  }

  let totalSum = summate(counts);

  if (totalSum != finalDim * finalDim * finalDim){
    console.log(`Error: Only ${totalSum} cubes are filled, there should be ${finalDim * finalDim * finalDim}`);
    return false;
  }

  let solve = solvable(p);
  if (!solve){
    console.log("ERROR: The puzzle is not solvable");
    return false;
  }

  return true;
  // TODO check for identical pieces
}

function tempCriteria(p){
  return solvable(p);
}


function solvable(c){
  let cube = JSON.parse(JSON.stringify(c)); // clone the cube, so we can work on it
  let directions = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
    [-1, 0, 0],
    [0, -1, 0],
    [0, 0, -1]
  ];

  let pulled = true;
  let pulledCount = 0;

  let stillThere = []; // list of which pieces have not been pulled out
  for (let i = 0; i < pieces; i++){
    stillThere.push(true);
  }

  while (pulled && pulledCount < pieces){
    pulled = false;

    for (let pieceNum = 0; pieceNum < pieces; pieceNum++){
      if (stillThere[pieceNum]){
        for (let dnum = 0; dnum < directions.length; dnum++){
          if (canEscape(cube, pieceNum, directions[dnum])){
            pullPiece(cube, pieceNum);
            stillThere[pieceNum] = false;
            pulled = true;
            pulledCount++;
            break;
          }
        }
      }
    }
  }

  return pulled;

}

function canEscape(cube, pnum, dir){
  let parts = [];
  for (let x = 0; x < cube.length; x++){
    for (let y = 0; y < cube[x].length; y++){
      for (let z = 0; z < cube[x][y].length; z++){
        if (cube[x][y][z] == pnum){
          let next = cube[Math.max(0, Math.min(finalDim - 1, x + dir[0]))][Math.max(0, Math.min(finalDim - 1, y + dir[1]))][Math.max(0, Math.min(finalDim - 1, z + dir[2]))];
          if (next == pnum){
            // the escapability of the this one is dependant on that of the next
          } else {
            // this block needs to be considered
            parts.push([x, y, z]);
          }
        }
      }
    }
  }

  let mustPass = [];

  for (let i = 0; i < parts.length; i++){
    let path = parts[i];
    while (path[0] > 0 && path[0] < finalDim - 1 && path[1] > 0 && path[1] < finalDim - 1 && path[2] > 0 && path[2] < finalDim - 1){
      path[0] += dir[0];
      path[1] += dir[1];
      path[2] += dir[2];
      mustPass.push([...path]);
    }
  }

  for (let i = 0; i < mustPass.length; i++){
    let toPass = mustPass[i];
    // console.log(cube);
    // console.log("");
    // console.log(toPass);
    // console.log("\n")
    let tType = cube[toPass[0]][toPass[1]][toPass[2]];
    if (tType == undefined || tType == pnum){
      // the piece can pass through here
    } else {
      return false;
    }
  }

  return true;
}

function pullPiece(cube, pnum){
  for (let x = 0; x < cube.length; x++){
    for (let y = 0; y < cube[x].length; y++){
      for (let z = 0; z < cube[x][y].length; z++){
        if (cube[x][y][z] == pnum){
          cube[x][y][z] = undefined;
        }
      }
    }
  }
}














// takes the splitPieces output and returns the # blocks in each piece
function pieceCount(p){
  let out = [];
  for (let i = 0; i < p.length; i++){
    let c = 0;
    for (let x = 0; x < p[i].length; x++){
      for (let y = 0; y < p[i][x].length; y++){
        for (let z = 0; z < p[i][x][y].length; z++){
          c += p[i][x][y][z];
        }
      }
    }
    out.push(c);
  }
  return out;
}

function splitPieces(p){
  let out = [];
  for (let x = 0; x < p.length; x++){
    for (let y = 0; y < p[x].length; y++){
      for (let z = 0; z < p[x][y].length; z++){
        if (!(p[x][y][z] == undefined)){

          if (out[p[x][y][z]] == undefined){
            out[p[x][y][z]] = createCube(p.length, false);
          }

          out[p[x][y][z]][x][y][z] = true;
        }
      }
    }
  }



  return out
}

function createCube(dim, val){
  let out = [];
  for (let x = 0; x < dim; x++){
    let tx = [];
    for (let y = 0; y < dim; y++){
      let ty = [];
      for (let z = 0; z < dim; z++){
        ty[z] = val;
      }
      tx.push(ty);
    }
    out.push(tx);
  }
  return out;
}


function printCube(c){
  console.log("\n");
  for (let i = 0; i < c.length; i++){
    for (let x = 0; x < c[i].length; x++){
      let row = "";
      for (let y = 0; y < c[i][x].length; y++){
        if (c[i][x][y] == undefined){
          row += " ";
        } else {
          row += c[i][x][y];
        }
      }
      console.log(row);
    }
    console.log("\n-----------------\n");
  }
  console.log("\n");
}








// printCube(generate());
//
// console.log("0: red");
// console.log("1: green");
// console.log("2: yellow");
// console.log("3: blue");
// console.log("4: black");































// End
