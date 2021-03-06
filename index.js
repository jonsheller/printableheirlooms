var MailListener = require('mail-listener2');
var NodeMailer = require("nodemailer");
var Mustache = require("mustache");
var fs = require('fs');
var stylist = require('./styles/stylist');

var html_template = fs.readFileSync("templates/responseHtml.txt", 'utf8');
var text_template = fs.readFileSync("templates/responseText.txt", 'utf8');

Mustache.parse(html_template);
Mustache.parse(text_template);

var mailListener = new MailListener({
  username: process.env["EMAIL_USERNAME"],
  password: process.env["EMAIL_PASSWORD"],
  host: process.env["IMAP_HOST"],
  port: process.env["IMAP_PORT"] || 993, // imap port
  tls: true, // use secure connection
  mailbox: process.env["IMAP_MAILBOX"] || "INBOX", // mailbox to monitor
  markSeen: true, // all fetched email will be marked as seen and not fetched next time
  fetchUnreadOnStart: true // use it only if you want to get all unread email on lib start. Default is `false`
});

if (process.env["WELL_KNOWN_SERVICE"]) {
	var transporter = NodeMailer.createTransport({
		service: process.env["WELL_KNOWN_SERVICE"],
		auth: {
			user: process.env["EMAIL_USERNAME"],
			pass: process.env["EMAIL_PASSWORD"]
		}
	});
} else {
	console.log("Using settings");
	var transporter = NodeMailer.createTransport({
		"host": process.env["SMTP_HOST"],
        "port": process.env["SMTP_PORT"] || 587,
        "authMethod": "LOGIN",
		"auth": {
			user: process.env["EMAIL_USERNAME"],
			pass: process.env["EMAIL_PASSWORD"]
		}
	});
}

mailListener.on("server:connected", function(){
  console.log("imapConnected");
});

mailListener.on("mail", function(mail){
  console.log("Received mail from " + mail.from[0].name);
  enqueue(mail);
});

mailListener.start();

var mailQueue = [];
var timerRunning = false;

function enqueue(mail) {
	mailQueue.push(mail);
	if (!timerRunning) {
		setTimeout(dequeue, 10 * 1000);
		timerRunning = true;
	}
}

function dequeue() {
	timerRunning = false;
	var mail = mailQueue.shift();
	if (mailQueue.length) {
		setTimeout(dequeue, 10 * 1000);
		timerRunning = true;
	}
	
	processMail(mail);
}

function processMail(mail) {
  console.log("Processing mail from " + mail.from[0].name);
  var styledMessage = stylist.styleMessage(mail);
  
  var html = Mustache.to_html(html_template, {
	title: mail.subject,
	style: styledMessage.style
  });
  
  var text = Mustache.render(text_template, {
	title: mail.subject,
	style: styledMessage.style
  });
  
  transporter.sendMail({
	to: mail.from,
	from: process.env["EMAIL_USERNAME"],
	subject: "Your Printable Heirloom inquiry",
	html: html,
	text: text,
	attachments: [{filename: "message.pdf", content: styledMessage.pdf}]
  });
  console.log("Responded.");
}