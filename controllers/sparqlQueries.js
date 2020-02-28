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

const sparqlEndpoint1 = "http://dbpedia.org/sparql";
const sparqlEndpoint2 = "http://db:8890/sparql";

const prefixes = {
  doco: "http://purl.org/spar/doco/",
  dcterms: "http://purl.org/dc/terms/",
  po: "http://www.essepuntato.it/2008/12/pattern#",
  prov: "http://www.w3.org/ns/prov#",
  linkflows: "https://github.com/LaraHack/linkflows_model/blob/master/Linkflows.ttl#"
};

const articleTrustyURI = "http://purl.org/np/RAnVHrB5TSxLeOc6XTVafmd9hvosbs4c-4Ck0XRh_CgGk#articleVersion1";

var testQuery1 = "DESCRIBE <http://dbpedia.org/resource/Sardinia>";
var testQuery2 = "SELECT DISTINCT ?concept WHERE { ?s a ?concept .} LIMIT 50";
var testQuery3 = "SELECT (COUNT(*) as ?Triples) WHERE { ?s ?p ?o .}";
var testQuery4 = "SELECT * WHERE { ?article a doco:Article . ?article dcterms:title ?title .}";

// add prefixes to the query
var queryPrefixes = buildPrefixes(prefixes);

function test(req, res) {
  const SPARQLClient = new Client(sparqlEndpoint2);

  SPARQLClient.setOptions(
  "text/csv", // "application/javascript, ""text/html", //"application/sparql-results+json", "application/json",
  prefixes,
  // graph IRI here "http://www.myschema.org/resource/"
  );

  var sparqlQuery = buildQuery(req.query);
  console.log(sparqlQuery);

  SPARQLClient.query(sparqlQuery)
    .then((results) => {
      console.log("Inside function");
      console.log(results);
      // console.log("IN JSON++++++++++++++++");
      // console.log(JSON.stringify(results));
      res.send(results);
    })
    .catch((err) => {
      console.log("Inside error");
      console.log(err);
      res.send(error);
    });
};

function buildQuery(checkboxes) {
  console.log("article:" + checkboxes.article);
  console.log("section:" + checkboxes.section);
  console.log("paragraph:" + checkboxes.paragraph);
  console.log("syntax:" + checkboxes.syntax);
  console.log("style:" + checkboxes.style);
  console.log("content:" + checkboxes.content);
  console.log("negative:" + checkboxes.negative);
  console.log("neutral:" + checkboxes.neutral);
  console.log("positive:" + checkboxes.positive);
  console.log("I1:" + checkboxes.I1);
  console.log("I2:" + checkboxes.I2);
  console.log("I3:" + checkboxes.I3);
  console.log("I4:" + checkboxes.I4);
  console.log("I5:" + checkboxes.I5);
  console.log("compulsory:" + checkboxes.compulsory);
  console.log("suggestion:" + checkboxes.suggestion);
  console.log("no_action:" + checkboxes.no_action);

  // write query
  var query = "SELECT ?reviewer ?reviewComment ?part ?aspect ?posNeg ?impact ?actionNeeded ?reviewCommentContent" + "\n" +
  "WHERE { <" + articleTrustyURI + "> (po:contains)* ?part ." + "\n" +
    "?reviewComment linkflows:refersTo ?part . " + "\n" +
    "VALUES ?partType { " +
      ((checkboxes.article == 'true') ? ("doco:Article ") : "" ) +
      ((checkboxes.section == 'true') ? ("doco:Section ") : "" ) +
      ((checkboxes.paragraph == 'true') ? ("doco:Paragraph ") : "" ) +
    "} " + "\n" +
    "?part a ?partType ." + "\n" +
    "VALUES ?aspect { " +
      ((checkboxes.syntax == 'true') ? ("linkflows:SyntaxComment ") : "" ) +
      ((checkboxes.style == 'true') ? ("linkflows:StyleComment ") : "" ) +
      ((checkboxes.content == 'true') ? ("linkflows:ContentComment ") : "" ) +
    "} " + "\n" +
    "?reviewComment a ?aspect ." + "\n" +
    "VALUES ?posNeg { " +
      ((checkboxes.negative == 'true') ? ("linkflows:NegativeComment ") : "" ) +
      ((checkboxes.neutral == 'true') ? ("linkflows:NeutralComment ") : "" ) +
      ((checkboxes.positive == 'true') ? ("linkflows:PositiveComment ") : "" ) +
    "} " + "\n" +
    "?reviewComment a ?posNeg ." + "\n" +
    "?reviewComment linkflows:hasImpact ?impact ." + "\n" +
    (
      (checkboxes.I1 == 'true') && (checkboxes.I2 == 'true') && (checkboxes.I3 == 'true') &&
      (checkboxes.I4 == 'true') && (checkboxes.I5 == 'true') ? "" :
      ("FILTER ( " +
        ( (checkboxes.I1 == 'true') ? ("?impact = '1'^^xsd:positiveInteger ") : "") +
        ( (checkboxes.I2 == 'true') ?
          ( ((checkboxes.I1 == 'true') ? "||" : "" ) + "?impact = '2'^^xsd:positiveInteger ") : ""
        ) +
        ( (checkboxes.I3 == 'true') ?
          ( ( ((checkboxes.I1 == 'true') || (checkboxes.I2 == 'true')) ? "||" : "" ) +
            "?impact = '3'^^xsd:positiveInteger ") : ""
        ) +
        ( (checkboxes.I4 == 'true') ?
          ( ( ((checkboxes.I1 == 'true') || (checkboxes.I2 == 'true') ||
               (checkboxes.I3 == 'true')) ? "||" : "" ) +
              "?impact = '4'^^xsd:positiveInteger ") : ""
        ) +
        ( (checkboxes.I5 == 'true') ?
          ( ( ((checkboxes.I1 == 'true') || (checkboxes.I2 == 'true') ||
               (checkboxes.I3 == 'true') || (checkboxes.I4 == 'true')) ? "||" : "" ) +
              "?impact = '5'^^xsd:positiveInteger ") : ""
        ) +
      " )" + "\n"
      )
    ) +
    "VALUES ?actionNeeded { " +
      ((checkboxes.compulsory == 'true') ? ("linkflows:ActionNeededComment ") : "" ) +
      ((checkboxes.suggestion == 'true') ? ("linkflows:SuggestionComment ") : "" ) +
      ((checkboxes.no_action == 'true') ? ("linkflows:NoActionNeededComment ") : "" ) +
    "} " + "\n" +
    "?reviewComment a ?actionNeeded ." +  "\n" +
    "?reviewComment linkflows:hasCommentText ?reviewCommentContent ." +  "\n" +
    "GRAPH ?assertion { ?reviewComment a linkflows:ReviewComment . }" + "\n" +
    "?assertion prov:wasAttributedTo ?reviewer ." + "\n" +
  "} GROUP BY ?reviewer ?part ?aspect ?posNeg ?impact ?actionNeeded" + "\n" +
  "ORDER BY ?reviewer ?part ?aspect ?posNeg ?impact ?actionNeeded"

  console.log(query);

  return query;
}

function buildPrefix(prefix, url) {
  return "PREFIX " + prefix + ": <" + url + ">" + "\n";
}

function buildPrefixes(prefixes) {
  var prefixesString = "";

  for (var prefix in prefixes) {
    prefixesString = prefixesString.concat(buildPrefix(prefix, prefixes[prefix]));
  }

  return prefixesString;
}

// query for when all values are selected
function queryAll() {
  // add prefixes to the query
  var queryPrefixes = buildPrefixes(prefixes);

  // write query
  var query = "SELECT ?reviewer ?reviewComment ?part ?aspect ?posNeg ?impact ?actionNeeded ?reviewCommentContent" + "\n" +
  "WHERE { <" + articleTrustyURI + "> (po:contains)* ?part ." + "\n" +
    "?reviewComment linkflows:refersTo ?part . " + "\n" +
    "VALUES ?partType { doco:Article doco:Section doco:Paragraph } " + "\n" +
    "?part a ?partType ." + "\n" +
    "VALUES ?aspect { linkflows:SyntaxComment linkflows:StyleComment linkflows:ContentComment } " + "\n" +
    "?reviewComment a ?aspect ." + "\n" +
    "VALUES ?posNeg { linkflows:PositiveComment linkflows:NeutralComment linkflows:NegativeComment }" + "\n" +
    "?reviewComment a ?posNeg ." + "\n" +
    "?reviewComment linkflows:hasImpact ?impact ." + "\n" +
    "FILTER (?impact = '1'^^xsd:positiveInteger || ?impact = '2'^^xsd:positiveInteger || ?impact = '3'^^xsd:positiveInteger || ?impact = '4'^^xsd:positiveInteger || ?impact = '5'^^xsd:positiveInteger) ." + "\n" +
    "VALUES ?actionNeeded { linkflows:ActionNeededComment linkflows:SuggestionComment linkflows:NoActionNeededComment}" + "\n" +
    "?reviewComment a ?actionNeeded ." +  "\n" +
    "?reviewComment linkflows:hasCommentText ?reviewCommentContent ." +  "\n" +
    "GRAPH ?assertion { ?reviewComment a linkflows:ReviewComment . }" + "\n" +
    "?assertion prov:wasAttributedTo ?reviewer ." + "\n" +
  "} GROUP BY ?reviewer ?part ?aspect ?posNeg ?impact ?actionNeeded" + "\n" +
  "ORDER BY ?reviewer ?part ?aspect ?posNeg ?impact ?actionNeeded"

  // console.log(queryPrefixes + query);
  return queryPrefixes + query;
}
