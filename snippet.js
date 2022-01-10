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
