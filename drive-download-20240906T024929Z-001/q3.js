// Read content from a source file
// and write it to a destination file
const fs = require("fs");
fs.readFile("input.txt", "utf8", function (err, data) {
  if (err) {
    return console.log(err);
  }
  // Count total number of characters, words and special characters in the file
  var count = data.length;
  var words = data.split(" ").length;
  var special = "!@#$%^&*()_+{}|:\"<>?[];',./".split("");

  var c = 0;
  for (var i = 0; i < data.length; i++) {
    if (special.includes(data[i])) {
      c++;
    }
  }
  console.log("Number of characters = " + count);
  console.log("Number of words = " + words);
  console.log("Number of special characters = " + c);
  fs.writeFile("output.txt", data, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("File written successfully!");
  });
});