const fs = require('fs');
const FormData = require('form-data');

function addMultipartFormData(requestParams, context, ee, next) {
    const form = new FormData();
    form.append('files', fs.createReadStream('../Thesis_Navid.pdf'));
    form.append('data', 'Hello World')
    requestParams.body = form;
    return next(); 
}

module.exports = {
  addMultipartFormData,
}