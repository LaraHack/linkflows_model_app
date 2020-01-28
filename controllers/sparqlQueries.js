// package used to transform json to csv string
const csv = require('csv-parser');
const fs = require('fs');
const {Client, Node, Text, Data, Triple} = require('virtuoso-sparql-client');

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

function testInsertion(res, req) {
  const SaveClient = new Client("http://www.myendpoint.org/sparql");
  SaveClient.setOptions(
    "application/json",
    {"myprefix": "http://www.myschema.org/ontology/"},
    "http://www.myschema.org/resource/"
  );

  SaveClient.getLocalStore().add(
    new Triple(
      new Node("http://www.myschema.org/ontology/id123"),
      "dcterms:created",
      new Data(SaveClient.getLocalStore().now, "xsd:dateTimeStamp")
    )
  );
  SaveClient.getLocalStore().add(
    new Triple(
      "myprefix:id123",
      "rdfs:label",
      new Text("A new lable", "en"),
      Triple.ADD
    )
  );

  SaveClient.store(true)
  .then((result)=>{
    console.log(result)
  })
  .catch((err) => {
    console.log(err);
  });
}
