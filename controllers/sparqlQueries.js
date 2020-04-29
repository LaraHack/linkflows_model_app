// package used to transform json to csv string
const csv = require('csv-parser');
const fs = require('fs');
// using an ES6 destructuring assignment equivalent to
// const sparqlClient =  require('virtuoso-sparql-client');
// const Client = sparqlClient.Client;
const {Client, Node, Text, Data, Triple} = require('virtuoso-sparql-client');

module.exports = {
  getReviewCommentsByReviewers,
  getArticleMainSections,
  getReviewCommentsBySection
};

const sparqlEndpoint1 = "http://dbpedia.org/sparql";
const sparqlEndpoint2 = "http://localhost:8890/sparql";
const sparqlEndpoint3 = "http://db:18890/sparql";

const prefixes = {
  doco: "http://purl.org/spar/doco/",
  dcterms: "http://purl.org/dc/terms/",
  po: "http://www.essepuntato.it/2008/12/pattern#",
  prov: "http://www.w3.org/ns/prov#",
  c4o: "http://purl.org/spar/c4o/",
  linkflows: "https://github.com/LaraHack/linkflows_model/blob/master/Linkflows.ttl#"
};

// this is hardcoded for now
const articleTrustyURI = "http://purl.org/np/RAnVHrB5TSxLeOc6XTVafmd9hvosbs4c-4Ck0XRh_CgGk#articleVersion1";

var testQuery1 = "DESCRIBE <http://dbpedia.org/resource/Sardinia>";
var testQuery2 = "SELECT DISTINCT ?concept WHERE { ?s a ?concept .} LIMIT 50";
var testQuery3 = "SELECT (COUNT(*) as ?Triples) WHERE { ?s ?p ?o .}";
var testQuery4 = "SELECT * WHERE { ?article a doco:Article . ?article dcterms:title ?title .}";

// add prefixes to the query
var queryPrefixes = buildPrefixes(prefixes);

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

function getReviewCommentsByReviewers(req, res) {
  const SPARQLClient = new Client(sparqlEndpoint3);

  SPARQLClient.setOptions(
  "text/csv", // "application/javascript, ""text/html", //"application/sparql-results+json", "application/json",
  prefixes,
  // graph IRI here "http://www.myschema.org/resource/"
  );

  var sparqlQuery = queryReviewCommentsByReviewers(req.query);
  console.log(sparqlQuery);

  SPARQLClient.query(sparqlQuery)
    .then((results) => {
      console.log("Inside function");
      console.log(results);
      // console.log("IN JSON++++++++++++++++");
      // console.log(JSON.stringify(results));
      res.send(results);
    })
    .catch((error) => {
      console.log("ERROR:" + error);
      res.send(error);
    });
};

function getArticleMainSections(req, res) {
  const SPARQLClient = new Client(sparqlEndpoint3);

  SPARQLClient.setOptions(
  "text/csv",
  prefixes,
  );

  var sparqlQuery = queryArticleMainSections();
  console.log(sparqlQuery);

  SPARQLClient.query(sparqlQuery)
    .then((results) => {
      res.send(results);
    })
    .catch((error) => {
      console.log("ERROR:" + error);
      res.send(error);
    });
};

function getReviewCommentsBySection(req, res) {
  const SPARQLClient = new Client(sparqlEndpoint3);

  SPARQLClient.setOptions(
  "text/csv",
  prefixes,
  );

  var sparqlQuery = queryReviewCommentsBySection();
  console.log(sparqlQuery);

  SPARQLClient.query(sparqlQuery)
    .then((results) => {
      res.send(results);
    })
    .catch((error) => {
      console.log("ERROR:" + error);
      res.send(error);
    });
};

function queryReviewCommentsByReviewers(checkboxes) {
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
  "ORDER BY ?reviewer ?part ?aspect ?posNeg ?impact ?actionNeeded";

  console.log(query);

  return query;
}

// query for when all values are selected
function queryAllReviewCommentsByReviewers() {
  // add prefixes to the query, only neede if the prefixes option is not added to the SPARQLClient
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
  "ORDER BY ?reviewer ?part ?aspect ?posNeg ?impact ?actionNeeded";

  // console.log(queryPrefixes + query);
  return queryPrefixes + query;
}

function queryArticleMainSections() {
  // write query
  var query = "SELECT ?sectionNumberLiteral AS ?Section, ?sectionTitleLiteral AS ?Title" + "\n" +
  "WHERE { <" + articleTrustyURI + "> dcterms:title ?title ;" + "\n" +
    "  po:contains ?section ." + "\n" +
    "?section a doco:Section ;" + "\n" +
    "  po:containsAsHeader ?sectionNumber, ?sectionTitle ." + "\n" +
    "?sectionNumber a doco:SectionLabel ;" + "\n" +
    "  c4o:hasContent ?sectionNumberLiteral ." + "\n" +
    "?sectionTitle a doco:SectionTitle ;" + "\n" +
    "  c4o:hasContent ?sectionTitleLiteral ." + "\n" +
  "} ORDER BY ASC(?sectionNumberLiteral)";

  console.log(query);
  return query;
}

function queryReviewCommentsBySection() {
  // write query
  var query = "SELECT ?sectionNumberLiteral AS ?Section, ?sectionTitleLiteral AS ?Title, ?reviewComment, ?aspect, ?posNeg, ?impact, ?actionNeeded, ?commentText" + "\n" +
  "WHERE { <" + articleTrustyURI + "> dcterms:title ?title ;" + "\n" +
    "  po:contains ?section . " + "\n" +
    "?section a doco:Section ;" + "\n" +
    "  po:containsAsHeader ?sectionNumber, ?sectionTitle ." + "\n" +
    "?sectionNumber a doco:SectionLabel ;" + "\n" +
    "  c4o:hasContent ?sectionNumberLiteral ." + "\n" +
    "?sectionTitle a doco:SectionTitle ;" + "\n" +
    "  c4o:hasContent ?sectionTitleLiteral ." + "\n" +
    "?section (po:contains)* ?subpart." + "\n" +
    "?reviewComment a linkflows:ReviewComment ;" + "\n" +
    " linkflows:refersTo ?subpart." + "\n" +
    "?subpart a ?part ." + "\n" +
    "VALUES ?part { doco:Section doco:Paragraph }" + "\n" +
    "VALUES ?aspect { linkflows:SyntaxComment linkflows:StyleComment linkflows:ContentComment }" + "\n" +
    "?reviewComment a ?aspect ." + "\n" +
    "VALUES ?posNeg { linkflows:PositiveComment linkflows:NeutralComment linkflows:NegativeComment }" + "\n" +
    "?reviewComment a ?posNeg ." + "\n" +
    "?reviewComment linkflows:hasImpact ?impact ." + "\n" +
    "VALUES ?actionNeeded { linkflows:ActionNeededComment linkflows:SuggestionComment linkflows:NoActionNeededComment}" + "\n" +
    "?reviewComment a ?actionNeeded ." + "\n" +
    "?reviewComment linkflows:hasCommentText ?commentText ." + "\n" +
  "} ORDER BY ASC(?sectionNumberLiteral)";

  console.log(query);
  return query;
}
