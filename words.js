let valid_words = []

let totalPoints = 0;

const WORD_VALUE = [0,0,0,100,400,800,1400,1800,2200,2600,3000,3400]; //points based on word length
const search_button = document.getElementById("Search");
const highlighted_word = document.getElementById("Highlighted");

input_word.addEventListener("focusout", () => { //change the grid to match the input text
    if (input_word.value.length == 16) {//only do it if you can fill the whole grid 
        let index = 0;
        Array.from(document.getElementsByClassName("letterInput")).map(block => {
            block.value = input_word.value[index++].toUpperCase();
        });
    }
})

search_button.addEventListener("click", function() {
    let found_words_list = document.getElementById("foundWordsList"); 
    //delete the list of valid words from previous search
    while (found_words_list.firstChild) {
        found_words_list.removeChild(found_words_list.firstChild);
    }

    input_word.value = "";
    //overwrite the text field 
    Array.from(document.getElementsByClassName("letterInput")).map(block => {
        input_word.value += block.value;
        block.value = block.value.toUpperCase();
    });
    startSearch();
    console.log(totalPoints);
    found_words_list.innerHTML = "Points Possible: " + totalPoints + " - Possible Words: " + valid_words.length;
    valid_words.sort((a,b) => {return b.length - a.length}).map(word => { //sort by length of the word
        //each word will have point value and a link to the definition
        let li = document.createElement("li"); 
        let definition = document.createElement("a");
        definition.href="https://en.wiktionary.org/wiki/" + word.toLowerCase();
        definition.target="_blank";
        definition.innerText = word;
        definition.onmouseover = () => findWord(definition.innerText); //highlight the path on the grid
        definition.onmouseleave = () => {//clear the grid styles
            Array.from(document.getElementsByClassName("letterInput")).forEach(input => {
                input.style.backgroundColor = "white";
                input.style.board_width = "1px";
            })
            highlighted_word.innerHTML = "";
        }
        li.innerHTML = WORD_VALUE[word.length] + " - ";
        li.appendChild(definition);
        found_words_list.appendChild(li);
    });

    console.log(valid_words)
})

function findWord(to_find) {
    function DFS(x, y, path, word) {
        let letter = document.getElementById("letter" + x + y).value.toUpperCase();
        word += letter; //the word formed by the current path
        path.push([x,y]);
        if (to_find == word) { //if the word is found, finish the search and return the path
            return path;
        }
        if (word != to_find.substring(0, word.length)) {//leave the function early if word cant be made
            return null;
        }
        let neighbors = findNeighbors(x, y); //check surrounding blocks
        for (i in neighbors) {
            if (!arrayContains(path, neighbors[i])){ //check if its not in the path already
                //check all neighbors for a path
                result = DFS(neighbors[i][0], neighbors[i][1], [...path], word);
                if (result != null) { //keep going if a path isnt found
                    return result;
                }
            }    
        }
        return null; 
    }

    let result = [];

    //run a different DFS when searching for only one word
    for (let i = 0; i < board_length; i++) {
        for (let j = 0; j < board_width; j++) {
            result = DFS(i, j, [], "")
            if (result != null) {
                break;
            }
        }
        if (result != null) break;
    }

    result.map(block => { //color the path a light green and the starting block a dark green
        document.getElementById("letter" + block[0] + block[1]).style.backgroundColor = "#D1EFA3";
    });
    document.getElementById("letter" + result[0][0] + result[0][1]).style.backgroundColor = "#42f55d";
    highlighted_word.innerHTML = to_find;
}

const clear_button = document.getElementById("Clear"); //empty the grid
clear_button.addEventListener("click", function() {
    Array.from(document.getElementsByClassName("letterInput")).map(block => {
        block.value = "";
    })
    let found_words_list = document.getElementById("foundWordsList"); 
    //delete the list of valid words from previous search
    while (found_words_list.firstChild) {
        found_words_list.removeChild(found_words_list.firstChild);
    }
})

const randomize_button = document.getElementById("Randomize");
randomize_button.addEventListener("click", function() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let formed_word = "";
    let target = 300000;
    do { //keep generating a new map until the total possible points is greater than the target
        //keep decreasing the target so that a map can eventually be generated
        formed_word = "";
        Array.from(document.getElementsByClassName("letterInput")).map(block => {
            block.value = alphabet[Math.floor(Math.random() * 26)];
            formed_word += block.value;
        })
        startSearch();
        target -= 750;
    } while (totalPoints < target);
    input_word.value = formed_word;
})

// randomize_button.addEventListener("click", function() {
//     const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//     let formed_word = "";
//     let cycles = 10000;
//     let total = 0;
//     for (let i = 0; i < cycles; i++) {
//         formed_word = "";
//         Array.from(document.getElementsByClassName("letterInput")).map(block => {
//             block.value = alphabet[Math.floor(Math.random() * 26)];
//             formed_word += block.value;
//         })
//         startSearch();
//         total += totalPoints;
//     } 
//     console.log(total + "/" + cycles + " = " + total/cycles)
//     input_word.value = formed_word;
// })

function findNeighbors(x, y) {
    //return the neighbors of (x, y) if their coordinates are valid
    let neighbors = []; 
    let neighbor_coords = [[-1, -1], [-1, 0], [-1, 1],
                           [ 0, -1],          [ 0, 1],
                           [ 1, -1], [ 1, 0], [ 1, 1]];

    neighbor_coords.map(coord => { 
        let newX = coord[0] + x;
        let newY = coord[1] + y;
        if (newY >= 0 && newY < board_width && newX >= 0 && newX < board_length) {
            neighbors.push([newX,newY]);
        }
    });

    return neighbors;
}

function arrayContains(a, b) {
    //function for checking if pair exists in an array 
    //probably very not efficient but it works for now
    for (pair in a) { 
        if (a[pair][0] == b[0] && a[pair][1] == b[1]) {
            return true;
        }
    }
    return false;
}

function startSearch() {
    // console.log(board_length + "," + board_width)
    function DFS (x, y, path, word) {
        // console.log(word)
        // console.log(x + "," + y)
        let letter = document.getElementById("letter" + x + y).value;
        if (letter == "") {
            return;
        }
        path.push([x, y]);//add the current coord to the list of visited blocks
        word += letter; //word formed by current path
        //if the word is in the trie and not in the list of valid words, add it to the list
        if (wordTrie.contains(word) && valid_words.indexOf(word) == -1) {
            valid_words.push(word);
            totalPoints += WORD_VALUE[word.length];
        }
        //if the word has no possible path then it doesnt exist and cut the search early
        if (!wordTrie.prefix(word)) {
            return;
        }
        let neighbors = findNeighbors(x,y)
        neighbors.map(block => { //run the search on all neighbors
            if (!arrayContains(path, block)){
                // let temp_path = [...path];
                DFS(block[0], block[1], [...path], word);
            }    
        });
    }

    totalPoints = 0;
    valid_words = [];
    //run the search on every block
    for (let i = 0; i < board_length; i++) {
        for (let j = 0; j < board_width; j++) {
            DFS(i, j, [], "");
        }
    }
}

function printGrid() {
    for (let i = 0; i < board_length; i++) {
        for (let j = 0; j < board_width; j++) {
            console.log(document.getElementById("letter"+i+j).value);
        }
    }
}