'use strict';

const app = require('../../app.js');
const chai = require('chai');
const fs = require("fs");
const expect = chai.expect;
var event, context;

describe('Handler', function () {
  this.timeout(10000);
  it('prog', async () => {

    let end = new Promise(function (resolve, reject) {
      fs.readFile('events/event.json', {
        encoding: 'utf8',
        flag: 'r'
      }, function read(err, data) {


        app.handler(JSON.parse(data), null).then(res => {

          resolve(1)
        })


      })
    });
    await end
    // expect(response.location).to.be.an("string");
  });
});
