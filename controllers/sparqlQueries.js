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
  console.log("req: " + req);
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

// var checkedDimensions = new Map([
//   ["article", true],
//   ["section", true],
//   ["paragraph", true],
//   ["syntax", true],
//   ["style", true],
//   ["content", true],
//   ["negative", true],
//   ["neutral", true],
//   ["positive", true],
//   ["I1", true],
//   ["I2", true],
//   ["I3", true],
//   ["I4", true],
//   ["I5", true],
//   ["compulsory", true],
//   ["suggestion", true],
//   ["no_action", true]
// ]);

// Assumptions (checked checkboxes):
//
// Article level: section, paragraph
// Aspect: syntax, content
// Pos/Neg: negative, neutral, positive
// Impact: 3, 4, 5
// Action needed: compulsory

function buildQueryTemplate(req, res) {
  var checkboxes = JSON.parse(req.body);

  

  if (checkboxes.article)
    // PREFIX doco: <http://purl.org/spar/doco/>
    // PREFIX dcterms: <http://purl.org/dc/terms/>
    // PREFIX po: <http://www.essepuntato.it/2008/12/pattern#>
    // PREFIX prov: <http://www.w3.org/ns/prov#>
    // PREFIX linkflows: <https://github.com/LaraHack/linkflows_model/blob/master/Linkflows.ttl#>
    //
    // SELECT (COUNT(?reviewCommentArticle) AS ?commentsPerArticle) (COUNT(?reviewCommentSection) AS ?commentsPerSections) (COUNT(?reviewCommentParagraph) AS ?commentsPerParagraph)
    // WHERE {
    //   <http://purl.org/np/RAnVHrB5TSxLeOc6XTVafmd9hvosbs4c-4Ck0XRh_CgGk#articleVersion1>
    //     (po:contains)* ?subpart .
    //
    //   ?reviewComment linkflows:refersTo ?subpart .
    //   {
    //     ?subpart a doco:Section .
    //   } UNION {
    //     ?subpart a doco:Paragraph .
    //   }
    //
    //   VALUES ?type { linkflows:NegativeComment linkflows:NeutralComment linkflows:PositiveComment }
    //
    //   GRAPH ?assertion {
    //     ?c a ?type ;
    //     ?reviewCommentlinkflows:hasImpact ?impact ;
    //     ?reviewComment a linkflows:ActionNeededComment
    //   }
    //   FILTER (?impact = "3"^^xsd:positiveInteger || ?impact = "4"^^xsd:positiveInteger || ?impact = "5"^^xsd:positiveInteger) .
    //
    //   ?assertion prov:wasAttributedTo ?reviewer .
    // } GROUP BY ?reviewer  ORDER BY ASC(?reviewer)
}
