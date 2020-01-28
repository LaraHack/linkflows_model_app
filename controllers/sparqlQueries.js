// package used to transform json to csv string
const csv = require('csv-parser');
const fs = require('fs');
const virtuosoClient = require('virtuoso-sparql-client');

const dataEditors = './public/files/data.csv';

module.exports = {
  test
};

function test(req, res) {
  const DbPediaClient = new Client('http://dbpedia.org/sparql');
  DbPediaClient.query('DESCRIBE <http://dbpedia.org/resource/Sardinia>')
    .then((results) => {
      console.log(results);
      res.send(results);
    })
    .catch((err) => {
      console.log(err);
      res.send(error);
    });
};
