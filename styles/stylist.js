var htmlparser = require('htmlparser');
var Entities = require('html-entities').AllHtmlEntities;

var entities = new Entities();

var styles = {
	"Presidential": require('./presidential'),
	"Ransom": require('./ransom')
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

function getMailParagraphs(mail) {
	var paragraphs = [];
	
	function processDom(dom) {
		for (var i = 0; i < dom.length; i++) {
			if (dom[i].type == 'text') {
				paragraphs.push(entities.decode(dom[i].data));
			}
			
			if (dom[i].children) {
				processDom(dom[i].children);
			}
		}
	}
	
	var handler = new htmlparser.DefaultHandler(function(error, dom) {
		if (error) {
		} else {
			processDom(dom);
		}
	});
	
	var parser = new htmlparser.Parser(handler);
	parser.parseComplete(mail.html);
	return paragraphs;
}

function parsedMail(mail) {
	return {
		from: mail.from,
		to: mail.to,
		paragraphs: getMailParagraphs(mail),
		text: mail.text,
		subject: mail.subject
	};
}

exports.styleMessage = function(mail, style) {
	style = resolveStyle(style) || pickRandomStyle();
	
	return {
		style: style.name,
		pdf: style.createPDF(parsedMail(mail))
	}
}