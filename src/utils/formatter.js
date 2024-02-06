export const formatWord = (word) =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();


export const formatName = (name) =>
    name.split(" ").map(i => formatWord(i)).join().replace(",", " ")