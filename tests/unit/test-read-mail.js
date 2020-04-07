'use strict';

const app = require('../../app.js');

const chai = require('chai');
const expect = chai.expect;
var event, context;
const fs = require("fs");
var AWS = require('aws-sdk');
// var SES = new AWS.SES({region: 'eu-central-1'});
var SES = new AWS.SES({region: 'eu-west-1'});


describe('Tests Mailparser', function () {


    it('replaceEmails', async () => {

        var end = new Promise(function (resolve, reject) {
            fs.readFile('tests/unit/dmt18etquupkl9psie3sr3jl7bdpcif066cgido1', {
                encoding: 'utf8',
                flag: 'r'
            }, function read(err, data) {

                let content = app.replaceEmails(data, "test@test.com");
                fs.writeFile('tests/unit/replaced', content, function (err) {
                    if (err) throw err;
                    console.log('Saved!');
                });

                resolve(1)
            })
        });
        await end
    })

});
