//Implements a trie to store all english words (SOWPODS)
function TrieNode(key) {
    this.key = key;
    this.parent = null;
    this.children = {};
    this.end = false;
}

function Trie() {
    this.root = new TrieNode(null);
    this.insert = function(word) {
        let node = this.root;
        for (let i = 0; i < word.length; i++) {
            if (!node.children[word[i]]) {
                node.children[word[i]] = new TrieNode(word[i]);
                node.children[word[i]].parent = node;
            }
            node = node.children[word[i]];
        } 
        node.end = true;
    }
    this.contains = function(word) {
        let node = this.root;
        for (let i = 0; i < word.length; i++) {
            if (node.children[word[i]]) {
                node = node.children[word[i]];
            } else {
                return false;
            }
        } 
        return node.end;
    }
    this.prefix = function(word) {
        let node = this.root;
        for (let i = 0; i < word.length; i++) {
            if (node.children[word[i]]) {
                node = node.children[word[i]];
            } else {
                return false;
            }
        } 
        return true;
    }
}

var wordTrie = new Trie();

for (let i in wordlist) {
    wordTrie.insert(wordlist[i]);
}
wordlist = null;
// console.log(wordTrie)
