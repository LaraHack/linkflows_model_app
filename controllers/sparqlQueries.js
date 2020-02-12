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

  // console.log("BODY REQ");
  // console.log(req.query);
  // console.log("/BODY REQ");

  var checkboxes = req.query;

  // console.log("Checkboxes:");
  // console.log(checkboxes);

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

  console.log("article:" + article);
  console.log("section:" + section);
  console.log("paragraph:" + paragraph);
  console.log("syntax:" + syntax);
  console.log("style:" + style);
  console.log("content:" + content);
  console.log("negative:" + negative);
  console.log("neutral:" + neutral);
  console.log("positive:" + positive);
  console.log("I1:" + I1);
  console.log("I2:" + I2);
  console.log("I3:" + I3);
  console.log("I4:" + I4);
  console.log("I5:" + I5);
  console.log("compulsory:" + compulsory);
  console.log("suggestion:" + suggestion);
  console.log("no_action:" + no_action);


  // const prefixes = {
  //   doco: "http://purl.org/spar/doco/",
  //   dcterms: "http://purl.org/dc/terms/",
  //   po: "http://www.essepuntato.it/2008/12/pattern#",
  //   prov: "http://www.w3.org/ns/prov#",
  //   linkflows: "https://github.com/LaraHack/linkflows_model/blob/master/Linkflows.ttl#"
  // };

  queryAll();

  // var articleTrustyURI = "http://purl.org/np/RAnVHrB5TSxLeOc6XTVafmd9hvosbs4c-4Ck0XRh_CgGk#articleVersion1";
  //
  // var query = "SELECT ?reviewer ?reviewComment ?part ?aspect ?posNeg ?impact  ?actionNeeded " + "\n" +
  // "WHERE { <" + articleTrustyURI + "> (po:contains)* ?part ." + "\n" +
  //   "?reviewComment linkflows:refersTo ?part . " + "\n" +
  //   "VALUES ?partType { doco:Article doco:Section doco:Paragraph } " + "\n" +
  //   "?part a ?partType ." + "\n" +
  //   "VALUES ?aspect { linkflows:SyntaxComment linkflows:StyleComment linkflows:ContentComment } " + "\n" +
  //   "?reviewComment a ?aspect ." + "\n" +
  //   "VALUES ?posNeg { linkflows:PositiveComment linkflows:NeutralComment linkflows:NegativeComment }" + "\n" +
  //   "?reviewComment a ?posNeg ." + "\n" +
  //   "?reviewComment linkflows:hasImpact ?impact ." + "\n" +
  //   "FILTER (?impact = '1'^^xsd:positiveInteger || ?impact = '2'^^xsd:positiveInteger || ?impact = '3'^^xsd:positiveInteger || ?impact = '4'^^xsd:positiveInteger || ?impact = '5'^^xsd:positiveInteger) ." + "\n" +
  //   "VALUES ?actionNeeded { linkflows:ActionNeededComment linkflows:SuggestionComment linkflows:NoActionNeededComment}" + "\n" +
  //   "GRAPH ?assertion { ?reviewComment a linkflows:ReviewComment . }" + "\n" +
  //   "?assertion prov:wasAttributedTo ?reviewer ." + "\n" +
  // "} GROUP BY ?reviewer ?part ?aspect ?posNeg ?impact ?actionNeeded" + "\n" +
  // "ORDER BY ?reviewer ?part ?aspect ?posNeg ?impact ?actionNeeded"

}

function buildPrefix(prefix, url) {
  // console.log("________________________");
  // console.log("PREFIX " + prefix + ": <" + url + ">" + "\n");
  // console.log("________________________");
  return "PREFIX " + prefix + ": <" + url + ">" + "\n";
}

function queryAll() {
  const prefixes = {
    doco: "http://purl.org/spar/doco/",
    dcterms: "http://purl.org/dc/terms/",
    po: "http://www.essepuntato.it/2008/12/pattern#",
    prov: "http://www.w3.org/ns/prov#",
    linkflows: "https://github.com/LaraHack/linkflows_model/blob/master/Linkflows.ttl#"
  };

  var prefixesString = "";

  for (var prefix in prefixes) {
    prefixesString = prefixesString.concat(buildPrefix(prefix, prefixes[prefix]));
  }

  //
  // var articleTrustyURI = "http://purl.org/np/RAnVHrB5TSxLeOc6XTVafmd9hvosbs4c-4Ck0XRh_CgGk#articleVersion1";
  //
  // var query = "SELECT ?reviewer ?reviewComment ?part ?aspect ?posNeg ?impact  ?actionNeeded " + "\n" +
  // "WHERE { <" + articleTrustyURI + "> (po:contains)* ?part ." + "\n" +
  //   "?reviewComment linkflows:refersTo ?part . " + "\n" +
  //   "VALUES ?partType { doco:Article doco:Section doco:Paragraph } " + "\n" +
  //   "?part a ?partType ." + "\n" +
  //   "VALUES ?aspect { linkflows:SyntaxComment linkflows:StyleComment linkflows:ContentComment } " + "\n" +
  //   "?reviewComment a ?aspect ." + "\n" +
  //   "VALUES ?posNeg { linkflows:PositiveComment linkflows:NeutralComment linkflows:NegativeComment }" + "\n" +
  //   "?reviewComment a ?posNeg ." + "\n" +
  //   "?reviewComment linkflows:hasImpact ?impact ." + "\n" +
  //   "FILTER (?impact = '1'^^xsd:positiveInteger || ?impact = '2'^^xsd:positiveInteger || ?impact = '3'^^xsd:positiveInteger || ?impact = '4'^^xsd:positiveInteger || ?impact = '5'^^xsd:positiveInteger) ." + "\n" +
  //   "VALUES ?actionNeeded { linkflows:ActionNeededComment linkflows:SuggestionComment linkflows:NoActionNeededComment}" + "\n" +
  //   "GRAPH ?assertion { ?reviewComment a linkflows:ReviewComment . }" + "\n" +
  //   "?assertion prov:wasAttributedTo ?reviewer ." + "\n" +
  // "} GROUP BY ?reviewer ?part ?aspect ?posNeg ?impact ?actionNeeded" + "\n" +
  // "ORDER BY ?reviewer ?part ?aspect ?posNeg ?impact ?actionNeeded"
  //
  // console.log(prefixesString + "\n" + query);
}
