'use strict';

const app = require('../../app.js');
const chai = require('chai');
const expect = chai.expect;
var event, context;

describe('S3', function () {
  this.timeout(10000);
  it('getObject', async () => {


    var end = app.getObject("mail.petersiemen.net", "f4bg9borq7k2e4u3maaq0obs9imu56um5u800fg1")
      .then(result => {

          console.log(result)

          resolve(1)
        },
        error => {
          console.log(error)

          resolve(1)
        }
      )


    await end;
    // expect(response.location).to.be.an("string");
  });
});
