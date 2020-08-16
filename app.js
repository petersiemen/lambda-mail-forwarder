const AWS = require('aws-sdk');
const S3 = new AWS.S3({region: 'eu-west-1'});
const SES = new AWS.SES({region: 'eu-west-1'});

function replace(lines, replacement, re, use_orig = false) {
    return lines.map(function (line) {
        let matches = line.match(re);
        if (matches) {
            let captured = matches[2];
            if (use_orig) {
                return replacement + matches[2]
            }
            return replacement;
        } else {
            return line
        }
    });
}


function replaceFrom(lines, email) {
    return replace(lines, 'From: ' + email, /^(From: )(.*)$/)
}

function replaceTo(lines, email) {
    return replace(lines, 'To: ' + email, /^(To: )(.*)$/)
}


function replaceReturnPath(lines, email) {
    return replace(lines, 'Reply-To: ', /^(Return-Path: )(.*)$/, use_orig = true);
}

function replaceEmails(data, email) {
    let lines = data.toString().split(/(?:\r\n|\r|\n)/g);

    var replaced = replaceFrom(lines, email);
    replaced = replaceTo(replaced, email);
    replaced = replaceReturnPath(replaced, email);

    replaced = replaced.join('\r\n');
    return replaced;
}

function getObject(bucket, key) {
    let params = {
        Bucket: bucket,
        Key: key
    };
    return S3.getObject(params).promise();
}

function sendRawEmail(email, buffer) {
    let params = {
        RawMessage: {Data: buffer},
        Destinations: [email],
        Source: email
    };
    return SES.sendRawEmail(params).promise();
}

async function handleEvent(event, bucket, email) {
    let ses = event.Records[0]['ses'];

    console.info("EVENT\n" + JSON.stringify(event, null, 2));

    return getObject(bucket, ses.mail.messageId)
        .then(function (result) {
            let replaced = replaceEmails(result.Body, email);
            return sendRawEmail(email, replaced)
        }).then(function (result) {
            return {
                statusCode: '200',
                body: JSON.stringify(result)
            }
        });
}

exports.replaceEmails = replaceEmails;
exports.replaceFrom = replaceFrom;
exports.handler = async (event, context) => {
    let BUCKET = process.env.BUCKET;
    let EMAIL = process.env.EMAIL;

    return handleEvent(event, BUCKET, EMAIL);
};