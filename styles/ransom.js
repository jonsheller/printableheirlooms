var pdfkit = require('pdfkit');

exports.createPDF = function(mail) {
	var doc = new pdfkit();
	doc.font('./styles/fonts/earwig factory rg.ttf');
	doc.fontSize(20);
	doc.text(mail.subject, {align: 'center'});
	doc.text(mail.text);
	doc.end();
	return doc;
}

exports.name = "Ransom";