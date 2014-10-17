var MailListener = require('mail-listener2');

console.log(process.env["IMAP_HOST"]);

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

mailListener.on("server:connected", function(){
  console.log("imapConnected");
});

mailListener.on("mail", function(mail){
  console.log("new mail arrived with id:" + mail);
  for (m in mail) {
	console.log(m + ": " + mail[m]);
  }
});

mailListener.start();