var fs = require('fs');
var pr = require("./presidential.js");

var fout = fs.createWriteStream("out.pdf");
var mail = {
	from: [{name: "Jon Sheller"}],
	subject: "This is a test",
	text: "Hello"
};

var pdf = pr.createPDF(mail);
pdf.pipe(fout);
