PREFIX doco: <http://purl.org/spar/doco/>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX po: <http://www.essepuntato.it/2008/12/pattern#>
PREFIX linkflows: <https://github.com/LaraHack/linkflows_model/blob/master/Linkflows.ttl#>

SELECT (COUNT(?reviewCommentArticle) AS ?commentsPerArticle) (COUNT(?reviewCommentSection) AS ?commentsPerSections) (COUNT(?reviewCommentParagraph) AS ?commentsPerParagraph) (COUNT(?reviewCommentFigure) AS ?commentsPerFigure) (COUNT(?reviewCommentTable) AS ?commentsPerTable) (COUNT(?reviewCommentFootnote) AS ?commentsPerFootnote) (COUNT(?reviewCommentFormula) AS ?commentsPerFormula)
WHERE {
  <http://purl.org/np/RAnVHrB5TSxLeOc6XTVafmd9hvosbs4c-4Ck0XRh_CgGk#articleVersion1>
    (po:contains)* ?subpart .

  {
    ?reviewCommentArticle a linkflows:ReviewComment .
    ?reviewCommentArticle linkflows:refersTo  ?subpart .
    ?subpart a doco:Article .
  } UNION {
    ?reviewCommentSection a linkflows:ReviewComment .
    ?reviewCommentSection linkflows:refersTo ?subpart .
    ?subpart a doco:Section .
  } UNION {
    ?reviewCommentParagraph a linkflows:ReviewComment .
    ?reviewCommentParagraph linkflows:refersTo ?subpart .
    ?subpart a doco:Paragraph .
  } UNION {
    ?reviewCommentFigure a linkflows:ReviewComment .
    ?reviewCommentFigure linkflows:refersTo ?subpart .
    ?subpart a doco:Figure .
  } UNION {
    ?reviewCommentTable a linkflows:ReviewComment .
    ?reviewCommentTable linkflows:refersTo ?subpart .
    ?subpart a doco:Table .
  } UNION {
    ?reviewCommentFootnote a linkflows:ReviewComment .
    ?reviewCommentFootnote linkflows:refersTo ?subpart .
    ?subpart a doco:Footnote .
  } UNION {
    ?reviewCommentFormula a linkflows:ReviewComment .
    ?reviewCommentFormula linkflows:refersTo ?subpart .
    ?subpart a doco:Formula .
  }
}


PREFIX doco: <http://purl.org/spar/doco/>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX po: <http://www.essepuntato.it/2008/12/pattern#>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX linkflows: <https://github.com/LaraHack/linkflows_model/blob/master/Linkflows.ttl#>

SELECT ?reviewer ?level (COUNT(DISTINCT ?c) AS ?typecount)
WHERE {
  <http://purl.org/np/RAnVHrB5TSxLeOc6XTVafmd9hvosbs4c-4Ck0XRh_CgGk#articleVersion1>
    (po:contains)* ?part .
  ?c linkflows:refersTo ?part .
  ?part a ?level .

  GRAPH ?assertion { ?c a ?type . }
  ?assertion prov:wasAttributedTo ?reviewer .
} GROUP BY ?reviewer ?level ORDER BY ?reviewer


### example query from form, built dynamically from Javascript

Assumptions (checked checkboxes):

Article level: section, paragraph
Aspect: syntax, content
Pos/Neg: negative, neutral, positive
Impact: 3, 4, 5
Action needed: compulsory

#### Query logic (declarative)

Retrieve number of review comments per reviewer that:
 - target a certain part of the given article URI ```AND```
 - the part targeted in the article is a section or a paragraph ```AND```
 - the review comments are about syntax or content ```AND```
 - the review comments are negative or neutral or positive ```AND```
 - the impact is 3 or 4 or 5 ```AND```
 - the action needed by author is compulsory to be addressed

#### Query logic with some pseudo-SPARQL

 Retrieve number of review comments per reviewer (```GROUP BY ?reviewer  ORDER BY ASC(?reviewer)``` )
 ```
 GRAPH ?assertion {...}
 ?assertion prov:wasAttributedTo ?reviewer .
 ...
 ?reviewComment a linkflows:ReviewComment .
 ```
 that:
  - target a certain part of the given article URI ```AND```
    ```
    <http://purl.org/np/RAnVHrB5TSxLeOc6XTVafmd9hvosbs4c-4Ck0XRh_CgGk#articleVersion1>
      (po:contains)* ?subpart .
    ```

  - the part targeted in the article is a section or a paragraph ```AND```
    ```
    ?reviewComment linkflows:refersTo ?subpart .
    ...
    ?subpart a doco:Section OR ?subpart a doco:Paragraph .
      ```

  - the review comments are about syntax or content ```AND```
  - the review comments are negative or neutral or positive ```AND```
  - the impact is 3 or 4 or 5 ```AND```
    ```
    VALUES ?type { linkflows:NegativeComment linkflows:NeutralComment linkflows:PositiveComment }
    GRAPH ?assertion { ?c a ?type ; linkflows:hasImpact ?impact . }
    FILTER (?impact = "3"^^xsd:positiveInteger || ?impact = "4"^^xsd:positiveInteger || ?impact = "5"^^xsd:positiveInteger) .
    ```

  - the action needed by author is compulsory to be addressed
    ```
    GRAPH ?assertion { ?reviewComment a linkflows:ActionNeededComment }
    ```
