function seed() {
 

  return Array.prototype.slice.call(arguments)
}

// function seed(...rest) {
//   // return rest.map((item)=>{
//   //   return item
//   // })

//   return rest
// }

// seed(1,2,3)

function same([x, y], [j, k]) {
  return x==j && y==k
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  return this.some((c)=>same(c,cell))
}

const printCell = (cell, state) => {

  return contains.call(state,cell)? "\u25A3" : '\u25A2'
};

const corners = (state = []) => {
  if(state.length ===0){
    return {
      topRight:[0,0],
      bottomLeft:[0,0]
    }
  }

  const x = state.map(([x,_])=>x)
  const y = state.map(([_,y])=>y)

  return {
    topRight:[Math.max(...x),Math.max(...y)],
    bottomLeft:[Math.min(...x),Math.min(...y)]
  }
};

const printCells = (state) => {

  const {bottomLeft,topRight} = corners(state);

  let acc = '';

  for(let y= topRight[1]; y>=bottomLeft[1]; y--){
    let rw = [];

    for(let x= bottomLeft[0]; x<=topRight[0]; x++){
      rw.push(printCell([x,y],state))
    }

    acc += rw.join(" ") + "\n";
  }

  return acc;
 
};

const getNeighborsOf = ([x, y]) =>[
    [x-1,y+1], [x,y+1], [x+1,y+1],
    [x-1,y],            [x+1,y],
    [x-1,y-1], [x,y-1], [x+1,y-1]
  ];

const getLivingNeighbors = (cell, state) => {
  return getNeighborsOf(cell).filter((n)=>contains.bind(state)(n));
};

const willBeAlive = (cell, state) => {
  const livingN = getLivingNeighbors(cell,state)
  
  return (
    livingN.length === 3 || (contains.call(state,cell) && livingN.length === 2)
  )
};

const calculateNext = (state) => {
  const {bottomLeft,topRight} = corners(state)
  let res = [];
  for(let y = topRight[1] + 1 ; y >= bottomLeft[1] - 1; y--){
   
    for(let x= bottomLeft[0] - 1 ; x<= topRight[0] + 1; x++){
      res = res.concat(willBeAlive([x,y],state) ? [[x,y]] : []);
    }
  }

  return res
};

const iterate = (state, iterations) => {
  const Nstate = [state];

  for(let i = 0; i < iterations;i++){
    Nstate.push(calculateNext(Nstate[Nstate.length - 1]));
  }

  return Nstate;
};

const main = (pattern, iterations) => {
  const res = iterate(startPatterns[pattern],iterations)
  res.forEach(n=> console.log(printCells(n)));
};

const startPatterns = {
    rpentomino: [
      [3, 2],
      [2, 3],
      [3, 3],
      [3, 4],
      [4, 4]
    ],
    glider: [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
      [2, 3]
    ],
    square: [
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2]
    ]
  };
  
  const [pattern, iterations] = process.argv.slice(2);
  const runAsScript = require.main === module;
  
  if (runAsScript) {
    if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
      main(pattern, parseInt(iterations));
    } else {
      console.log("Usage: node js/gameoflife.js rpentomino 50");
    }
  }
  
  exports.seed = seed;
  exports.same = same;
  exports.contains = contains;
  exports.getNeighborsOf = getNeighborsOf;
  exports.getLivingNeighbors = getLivingNeighbors;
  exports.willBeAlive = willBeAlive;
  exports.corners = corners;
  exports.calculateNext = calculateNext;
  exports.printCell = printCell;
  exports.printCells = printCells;
  exports.startPatterns = startPatterns;
  exports.iterate = iterate;
  exports.main = main;