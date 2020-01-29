// package used to transform json to csv string
const csv = require('csv-parser');
const fs = require('fs');
// using an ES6 destructuring assignment equivalent to
// const sparqlClient =  require('virtuoso-sparql-client');
// const Client = sparqlClient.Client;
const {Client, Node, Text, Data, Triple} = require('virtuoso-sparql-client');

module.exports = {
  test
};

var sparqlEndpoint1 = "http://dbpedia.org/sparql";
var sparqlEndpoint2 = "http://localhost:8890/sparql";

var testQuery1 = "DESCRIBE <http://dbpedia.org/resource/Sardinia>";
var testQuery2 = "SELECT DISTINCT ?concept WHERE { ?s a ?concept .} LIMIT 50";

function test(req, res) {
  const DbPediaClient = new Client(sparqlEndpoint1);
  DbPediaClient.query(testQuery1)
    .then((results) => {
      console.log("Inside function");
      console.log(results);
      res.send(JSON.stringify(results));
    })
    .catch((err) => {
      console.log("Inside error");
      console.log(err);
      res.send(error);
    });
};

// function testInsertion(res, req) {
//   const SaveClient = new Client("http://www.myendpoint.org/sparql");
//   SaveClient.setOptions(
//     "application/json",
//     {"myprefix": "http://www.myschema.org/ontology/"},
//     "http://www.myschema.org/resource/"
//   );
//
//   SaveClient.getLocalStore().add(
//     new Triple(
//       new Node("http://www.myschema.org/ontology/id123"),
//       "dcterms:created",
//       new Data(SaveClient.getLocalStore().now, "xsd:dateTimeStamp")
//     )
//   );
//   SaveClient.getLocalStore().add(
//     new Triple(
//       "myprefix:id123",
//       "rdfs:label",
//       new Text("A new lable", "en"),
//       Triple.ADD
//     )
//   );
//
//   SaveClient.store(true)
//   .then((result)=>{
//     console.log(result)
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// }
