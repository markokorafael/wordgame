let board = 
[['T','E','S','A'],
['B','T','E','V'],
['S','A','I','S'],
['D','E','C','K']];

let valid_words = []
console.log(board)

let board_length = board.length
let board_width = board[0].length

let visited = [];

function findNeighbors(x, y) {
    let neighbors = []
    for (i = -1; i < 2; i++) {
        let newX = i + x;
        if (newX >= 0 && newX < board_width) {
            for (j = -1; j < 2; j++) {
                let newY = j + y;
                if (newY >= 0 && newY < board_length && (i != 0 || i != j)) {
                    // console.log([newX, newY])    
                    neighbors.push([newX,newY]);
                }
            }
        }
    }
    return neighbors;
}

function arrayContains(a, b) {
    for (pair in a) {
        if (a[pair][0] == b[0] && a[pair][1] == b[1]) {
            return true;
        }
    }

    return false;
}

function DFS (x, y, path, word) {
    let letter = board[x][y]
    path.push([x, y])

    word += board[x][y];
    if (wordTrie.contains(word) && valid_words.indexOf(word) == -1) {
        valid_words.push(word)
    }
    if (!wordTrie.prefix(word)) {
        return;
    }
    let neighbors = findNeighbors(x,y)
    for (i in neighbors) {
        if (!arrayContains(path, neighbors[i])){
            let temp_path = [...path];
            DFS(neighbors[i][0], neighbors[i][1], temp_path, word)
        }    
    }
}

for (let i = 0; i < board_length; i++) {
    for (let j = 0; j < board_width; j++) {
        // console.log(`${i} , ${j}`)
        DFS(i, j, [], "")
    }
}
console.log(valid_words.sort(function(a,b) {
    return b.length - a.length;
}))