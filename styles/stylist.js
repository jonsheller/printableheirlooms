var pdfkit = require('pdfkit');
var styles = {
	"Elegant": require('elegant'),
	"Ransom": require('ransom'),
	"Business": require('business')
};

function resolveStyle(style) {
	if (styles[style]) {
		return styles[style];
	}
}

function pickRandomStyle() {
	var keys = Object.keys(styles)
    return styles[keys[ keys.length * Math.random() << 0]];
}

exports.styleMessage = function(mail, style) {
	style = resolveStyle(style) || pickRandomStyle();
	return {
		style: style.name,
		pdf: style.createPDF(mail);
	}
}