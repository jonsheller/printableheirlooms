var pdfkit = require('pdfkit');

var intraParagraphWords = ["Whereupon", "Whereas", "Wherefore", "Be it known that", "", "", ""];

function renderLetterhead(mail, doc) {
	doc.font("Times-Italic");
	doc.fontSize(12);
	doc.text("From the desk of", {align: 'center'});
	doc.moveDown(0.5);
	doc.font("Times-Roman");
	var nameFirstLetter = mail.from[0].name[0];
	var restOfName = mail.from[0].name.slice(1).toUpperCase();
	doc.fontSize(24);
	var firstLetterSize = doc.widthOfString(nameFirstLetter);
	doc.fontSize(20);
	var restOfNameSize = doc.widthOfString(restOfName);
	var totalWidth = firstLetterSize + restOfNameSize;
	var pageWidth = doc.page.width;
	var wordStart = (doc.page.width - totalWidth) / 2;
	doc.fontSize(24);
	doc.text(nameFirstLetter, wordStart);
	doc.moveUp();
	doc.fontSize(20);
	doc.text(restOfName, wordStart + firstLetterSize);
	doc.lineWidth(1);
	doc.image('./styles/images/pres_seal.png', doc.page.margins.left, doc.page.margins.top, {height: doc.y - doc.page.margins.top});
	doc.image('./styles/images/pres_seal.png', doc.page.width - doc.page.margins.right - 40, doc.page.margins.top, {height: doc.y - doc.page.margins.top});
	doc.moveTo(doc.page.margins.left, doc.y + 4);
	doc.lineTo(doc.page.width - doc.page.margins.right, doc.y + 4).stroke("black");
	doc.moveDown(0.5);
	doc.font("Times-Roman");
	doc.fontSize(12);
	doc.text(mail.subject, doc.page.margins.left, doc.y, {align: 'center'});
	doc.lineWidth(1);
	doc.moveTo(doc.page.margins.left, doc.y + 4);
	doc.lineTo(doc.page.width - doc.page.margins.right, doc.y + 4).stroke("black");
	doc.moveDown(1.5);
}

exports.createPDF = function(mail) {
	var doc = new pdfkit();
	renderLetterhead(mail, doc);
	for (var i = 0; i < mail.paragraphs.length; i++) {
		var chosenIntra = intraParagraphWords[ intraParagraphWords.length * Math.random() << 0 ];
		if (i != 0 && i != mail.paragraphs.length - 1 && chosenIntra != "") {
			doc.font("Times-Italic");
			doc.text(chosenIntra);
			doc.font("Times-Roman");
			doc.moveDown();
		}
		
		doc.text(mail.paragraphs[i]);
		doc.moveDown();
	}
	doc.end();
	return doc;
}

exports.name = "Presidential";