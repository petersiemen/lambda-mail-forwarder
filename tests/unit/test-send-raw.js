'use strict';

const app = require('../../app.js');

const chai = require('chai');
const expect = chai.expect;
var event, context;
const fs = require("fs");
var AWS = require('aws-sdk');
// var SES = new AWS.SES({region: 'eu-central-1'});
var SES = new AWS.SES({region: 'eu-west-1'});



describe('Tests Send with SES', function () {


  it('sesnd', async () => {

    var end = new Promise(function (resolve, reject) {
      fs.readFile('tests/unit/with', {
        encoding: 'utf8',
        flag: 'r'
      }, function read(err, data) {

        let content = app.sendRawEmail("peter.siemen+production@gmail.com", data).then(function (result) {

          console.log(result)

          resolve(1)
        })



      })
    });
    await end
  })

});
