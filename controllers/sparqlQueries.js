// package used to transform json to csv string
const csv = require('csv-parser');
const fs = require('fs');
// using an ES6 destructuring assignment equivalent to
// const sparqlClient =  require('virtuoso-sparql-client');
// const Client = sparqlClient.Client;
const {Client, Node, Text, Data, Triple} = require('virtuoso-sparql-client');

module.exports = {
  test,
  buildQuery
};

var sparqlEndpoint1 = "http://dbpedia.org/sparql";
var sparqlEndpoint2 = "http://localhost:8890/sparql";

var testQuery1 = "DESCRIBE <http://dbpedia.org/resource/Sardinia>";
var testQuery2 = "SELECT DISTINCT ?concept WHERE { ?s a ?concept .} LIMIT 50";
var testQuery3 = "SELECT (COUNT(*) as ?Triples) WHERE { ?s ?p ?o .}";
var testQuery4 = "SELECT * WHERE { ?article a doco:Article . ?article dcterms:title ?title .}";

function test(req, res) {
  console.log("req: " + req);
  const SPARQLClient = new Client(sparqlEndpoint2);

  SPARQLClient.query(testQuery4)
    .then((results) => {
      console.log("Inside function");
      console.log(results);
      console.log("IN JSON++++++++++++++++");
      console.log(JSON.stringify(results));
      res.send(results);
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

function buildQuery(req, res) {
  //get values from checkboxes sent by client
  var checkboxes = JSON.parse(req.body);

  console.log("Checkboxes:");
  console.log(checkboxes);

  var article = (checkboxes.article == 'true');
  var section = (checkboxes.section == 'true');
  var paragraph = (checkboxes.paragraph == 'true');
  var syntax = (checkboxes.syntax == 'true');
  var style = (checkboxes.style == 'true');
  var content = (checkboxes.content == 'true');
  var negative = (checkboxes.negative == 'true');
  var neutral = (checkboxes.neutral == 'true');
  var positive = (checkboxes.positive == 'true');
  var I1 = (checkboxes.I1 == 'true');
  var I2 = (checkboxes.I2 == 'true');
  var I3 = (checkboxes.I3 == 'true');
  var I4 = (checkboxes.I4 == 'true');
  var I5 = (checkboxes.I5 == 'true');
  var compulsory = (checkboxes.compulsory == 'true');
  var suggestion = (checkboxes.suggestion == 'true');
  var no_action = (checkboxes.no_action == 'true');

  const prefixes = {
    doco: "http://purl.org/spar/doco/",
    dcterms: "http://purl.org/dc/terms/",
    po: "http://www.essepuntato.it/2008/12/pattern#",
    prov: "http://www.w3.org/ns/prov#",
    linkflows: "https://github.com/LaraHack/linkflows_model/blob/master/Linkflows.ttl#"
  };

  // var prefixes = "PREFIX doco: " + encodeURIComponent("<http://purl.org/spar/doco/>") +
  //     "\n PREFIX dcterms: " + encodeURIComponent("<http://purl.org/dc/terms/>") +
  //     "\n PREFIX po: " + encodeURIComponent("<http://www.essepuntato.it/2008/12/pattern#>") +
  //     "\n PREFIX prov: " + encodeURIComponent("<http://www.w3.org/ns/prov#>") +
  //     "\n PREFIX linkflows: " + encodeURIComponent("<https://github.com/LaraHack/linkflows_model/blob/master/Linkflows.ttl#>");
  //
  // var queryIntro = "SELECT (COUNT(?reviewCommentArticle) AS ?commentsPerArticle) (COUNT(?reviewCommentSection) AS ?commentsPerSections) (COUNT(?reviewCommentParagraph) AS ?commentsPerParagraph)
  // WHERE {" + encodeURIComponent("<http://purl.org/np/RAnVHrB5TSxLeOc6XTVafmd9hvosbs4c-4Ck0XRh_CgGk#articleVersion1>") + " (po:contains)* ?subpart .";
  //
  // if (section) {
  //   queryIntro.concat("\n" + "?reviewComment linkflows:refersTo ?subpart . " +
  //   "\n { ?subpart a doco:Section . \n }"
  // }
  // if (paragraph) {
  //   queryIntro.concat("\n" + "UNION { ?subpart a doco:Paragraph .}");
  // }
  //
  // queryIntro.concat("\n" + "VALUES ?type { ");
  // if (negative) queryIntro.concat("linkflows:NegativeComment");
  // if (neutral) queryIntro.concat(" linkflows:NeutralComment");
  // if (positive) queryIntro.concat(" linkflows:PositiveComment");
  // queryIntro.concat("}");
  //
  // queryIntro.concat("\n" + "GRAPH ?assertion {?c a ?type ; ?reviewCommentlinkflows:hasImpact ?impact ; ?reviewComment a linkflows:ActionNeededComment }" + "\n" + "FILTER (?impact = "3"^^xsd:positiveInteger || ?impact = "4"^^xsd:positiveInteger || ?impact = "5"^^xsd:positiveInteger) .");

    //   ?assertion prov:wasAttributedTo ?reviewer .
    // } GROUP BY ?reviewer  ORDER BY ASC(?reviewer)
}
