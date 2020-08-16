const AWS = require('aws-sdk');
const S3 = new AWS.S3({region: 'eu-west-1'});
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  SES: new AWS.SES({apiVersion: "2010-12-01"})
});

const simpleParser = require('mailparser').simpleParser;


function getObject(bucket, key) {
  let params = {
    Bucket: bucket,
    Key: key
  };
  return S3.getObject(params).promise();
}


async function handleEvent(event, bucket, email) {
  console.info("EVENT\n" + JSON.stringify(event, null, 2));

  let ses = event.Records[0]['ses'];


  getObject(bucket, ses.mail.messageId)
    .then(result => {
        return simpleParser(result.Body)
      }, reason => {
        console.log(reason);
      }
    )
    .then(parsed => {
      return transporter.sendMail({
        from: email,
        to: email,
        subject: parsed.subject,
        replyTo: parsed.from.text,
        text: parsed.text,
        html: parsed.html,
        attachments: parsed.attachments
      });
    }).then(success => {
      console.log(success)
  }, failure => {
      console.log(failure)
  })

}

exports.getObject = getObject;
exports.handler = async (event, context) => {
  let BUCKET = process.env.BUCKET;
  let EMAIL = process.env.EMAIL;

  return handleEvent(event, BUCKET, EMAIL);
};