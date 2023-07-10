// import fs
var fs = require('fs')
const chai =require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect  = require('chai').expect;
var app = require('../src/')
var should = require('chai').should();
const md5 = require('md5');



const binaryParser = function (res, cb) {
    res.setEncoding('binary');
    res.data = '';
    res.on("data", function (chunk) {
        res.data += chunk;
    });
    res.on('end', function () {
        cb(null, new Buffer(res.data, 'binary'));
    });
};

describe('Create Server test', () => {
let server;

  server = app.listen(3001, () => {
    console.log('started for testing');
  });



it('should upload a file',
 async () => {
    const response = await chai.request(app)
      .post("/test")
      .set('Content-Type', 'application/form-data')
      .field('data', 'Hello World')
      .attach("pdfFile",
        fs.readFileSync('./test/input/Thesis_Navid.pdf'),
        'Thesis_Navid.pdf')
        .buffer()
        .parse(binaryParser)
        .end(async function(err, res) {
            if (err) { done(err); }
           
            res.should.have.status(200);

            // Check the headers for type and size
            res.should.have.header('content-type');
            res.header['content-type'].should.be.equal('application/pdf');
            res.should.have.header('content-length');
            const size = fs.statSync('./test/output/thesis_navid.pdf').size.toString();
            res.header['content-length'].should.be.equal(size);
           
            // verify checksum 
            // console.log(JSON.stringify(res.body))               
           expect(md5(res.body.data)).to.equal('8f321ce7ee068fe9c85fea5e68b22be3');              
        });
  },
);
});