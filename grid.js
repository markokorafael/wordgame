const grid_container = document.getElementById("mainGrid");
const resize_button = document.getElementById("resizeButton");
const length_input = document.getElementById("lengthInput")
const width_input = document.getElementById("widthInput")
const input_word = document.getElementById("wordInput");//text field to input "seed"

resize_button.addEventListener("click", function () {
    console.log('RESIZING');
    createGrid(length_input.value, width_input.value);
});

let board_length = 4;
let board_width = 4;

function createGrid(length, width) {
    let found_words_list = document.getElementById("foundWordsList"); 
    //delete the list of valid words from previous search
    while (found_words_list.firstChild) {
        found_words_list.removeChild(found_words_list.firstChild);
    }
    
    board_length = length;
    board_width = width;
    while (grid_container.firstChild) {
        grid_container.removeChild(grid_container.firstChild);
    }
    input_word.maxLength = length * width;
    for (let i = 0; i < length; i++) {
        let newRow = document.createElement("br");
        // newRow.class = "gridRow";
        for (let j = 0; j < width; j++) {
            let newInput = document.createElement("input");
            newInput.setAttribute("class", "letterInput");
            newInput.setAttribute("id", "letter" + i + j);
            newInput.setAttribute("maxLength", "1");
            newInput.setAttribute("type", "text");
            newInput.setAttribute("onkeydown", "return /[a-z]/i.test(event.key)");
            // console.log(newInput);
            grid_container.appendChild(newInput);
        }  
        grid_container.appendChild(newRow);
    }
    $(".letterInput").keyup(function () {
        if (this.value.length == this.maxLength) {
            $(this).next('.letterInput').focus();
            // if (jQuery(this).index() === jQuery(this).siblings().length) {
            //     jQuery(this).parent().next("div").find(".letterInput").first().focus();
            // } else {
            //     $(this).next('.letterInput').focus();
            // }
        }
    });
}

createGrid(4,4);
// console.log("DONE");