
const src = Bun.file("./text/gotm.txt");
src.text()
    .then(text => console.log(text));
