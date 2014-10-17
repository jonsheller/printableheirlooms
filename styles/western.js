var pdfkit = require('pdfkit');

exports.name = "Western";

exports.createPDF = function(mail) {
	var doc = new pdfkit();
	
	doc.end();
	return doc;
}