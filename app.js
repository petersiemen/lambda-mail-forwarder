const AWS = require('aws-sdk');
const S3 = new AWS.S3({region: 'eu-west-1'});
// const SES = new AWS.SES({region: 'eu-west-1'});
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  SES: new AWS.SES({apiVersion: "2010-12-01"})
});

const simpleParser = require('mailparser').simpleParser;

//
//
// function replace(lines, replacement, re, use_orig = false) {
//     return lines.map(function (line) {
//         let matches = line.match(re);
//         if (matches) {
//             let captured = matches[2];
//             if (use_orig) {
//                 return replacement + matches[2]
//             }
//             return replacement;
//         } else {
//             return line
//         }
//     });
// }
//
//
// function replaceFrom(lines, email) {
//     return replace(lines, 'From: ' + email, /^(From: )(.*)$/)
// }
//
// function replaceTo(lines, email) {
//     return replace(lines, 'To: ' + email, /^(To: )(.*)$/)
// }
//
//
// function replaceReturnPath(lines, email) {
//     return replace(lines, 'Reply-To: ', /^(Return-Path: )(.*)$/, use_orig = true);
// }
//
// function replaceEmails(data, email) {
//     let lines = data.toString().split(/(?:\r\n|\r|\n)/g);
//
//     let replaced = replaceFrom(lines, email);
//     replaced = replaceTo(replaced, email);
//     replaced = replaceReturnPath(replaced, email);
//
//     replaced = replaced.join('\r\n');
//     return replaced;
// }

function getObject(bucket, key) {
  let params = {
    Bucket: bucket,
    Key: key
  };
  return S3.getObject(params).promise();
}

//
// function sendRawEmail(email, buffer) {
//     let params = {
//         RawMessage: {Data: buffer},
//         Destinations: [email],
//         Source: email
//     };
//
//     console.info("RAW\n" + JSON.stringify(params, null, 2));
//
//     return SES.sendRawEmail(params).promise();
// }

async function handleEvent(event, bucket, email) {
  console.info("EVENT\n" + JSON.stringify(event, null, 2));

  let ses = event.Records[0]['ses'];


  getObject(bucket, ses.mail.messageId)
    .then(result => {
      return simpleParser(result.Body)
    })
    .then(parsed => {
      return transporter.sendMail({
        from: email,
        to: email,
        subject: parsed.subject,
        // replyto: parsed.reply-to.,
        text: 'I hope this message gets sent!'

      }, (err, info) => {
        console.log(info.envelope);
        console.log(info.messageId);
      });
    })

  //
  // return getObject(bucket, ses.mail.messageId)
  //   .then
  //
  //   .then(function (result) {
  //
  //
  //     // let replaced = replaceEmails(result.Body, email);
  //
  //
  //     // return sendRawEmail(email, replaced)
  //   }).then(function (result) {
  //
  //
  //     return {
  //       statusCode: '200',
  //       body: JSON.stringify(result)
  //     }
  //   });
}

// exports.replaceEmails = replaceEmails;
// exports.sendRawEmail = sendRawEmail;
// exports.replaceFrom = replaceFrom;
exports.handler = async (event, context) => {
  let BUCKET = process.env.BUCKET;
  let EMAIL = process.env.EMAIL;

  return handleEvent(event, BUCKET, EMAIL);
};