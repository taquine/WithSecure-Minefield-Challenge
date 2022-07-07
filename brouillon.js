//fill maze array with table data
function getMazeData() {
    let mazeTable = document.getElementsByClassName("col-sm")[0].children[1];

    for (i = 0; i < mazeTable.rows.length; i++) {
        let cells = mazeTable.rows.item(i).cells;

        //(empty/full) => (0/1)
        for (let j = 0; j < cells.length; j++) {
            let cv = cells.item(j).className;

            if (cv === "empty") {
                maze[i][j] = "0";
            } else {
                maze[i][j] = "1";
            }
        }
    }
    //console.table(maze);
}

//check if 2 pos are equal
function isEqual(p1, p2) {
    return p1.x == p2.x && p1.y == p2.y;
}

//check if visited
function isVisited(pos) {
    return visited.filter((n) => isEqual(pos, n)).length > 0;
}

//check that position is possible
function isValid(maze, pos) {
    return maze[pos.y] != null && maze[pos.y][pos.x] === "0"; // row exists and cell is empty
}

//create child nodes that are accessible from current pos
function getChildren(maze, cPos) {
    let children = [],
        options = [ //array of possible moves from this cell (prioritises R and D. End is always R and D from start)
            { x: cPos.x + 1, y: cPos.y, val: "R" },
            { x: cPos.x, y: cPos.y + 1, val: "D" },
            { x: cPos.x - 1, y: cPos.y, val: "L" },
            { x: cPos.x, y: cPos.y - 1, val: "U" },
        ];

    for (let i = 0; i < options.length; i++) {
        let n = options[i];

        if (isValid(maze, n) && !isVisited(n)) {
            children.push(n);
        }
    }

    children.forEach((c) => {
        c.parent = currentPos.id;
        c.id = idCounter++;
    });

    return children;
}

//backtrack the path from the end to the origin while saving the moves
function getPath() {
    let parent = visited[visited.length - 1],
        tmp = "";

    do {
        tmp += parent.val;
        parent = visited.find((n) => n.id === parent.parent);
    } while (parent != null);

    
    tmp = tmp.split("").reverse().join(""); 
    document.getElementsByName("solution")[0].value = tmp;
    document.getElementsByClassName("btn btn-primary float-right")[0].click();
}

//main method using dfs algorithm
function traverse() {
    getMazeData();

    while (dTop.length > 0) {
        currentPos = dTop.shift();
        visited.push(currentPos);

        if (isEqual(currentPos, { x: 21, y: 21 })) {
            break;
        }

        dTop.unshift(...getChildren(maze, currentPos));
    }

    getPath();
}


  ////////////////////////////////////////////////////////////////////
 //////////////////////////      Main      //////////////////////////
////////////////////////////////////////////////////////////////////

let maze = [...Array(22)].map(e => Array(22)),      //maze array
    dTop = [{ x: 0, y: 0, id: 0, parent: null, val: ""}],    //data queue of sorts
    visited = [],                                   //visited nodes
    idCounter = 1,                                  //counter for node ids
    currentPos = {};                                //current position


traverse();
