import { prefixBeniCulturali as prefix } from 'query'

const baseQuery = (latLong: string) => (culturalSite: string) =>
  `${prefix}
SELECT ?site (SAMPLE(?siteSeeAlso) AS ?siteSeeAlso) (SAMPLE(?siteLabel) AS ?siteLabel) (SAMPLE(?sitePreview) AS ?sitePreview) (SAMPLE(?siteFullAddress) AS ?siteFullAddress) (SAMPLE(?siteCityName) AS ?siteCityName) (SAMPLE(?isPartOfLabel) as ?isPartOfLabel) ${
    latLong ? `(SAMPLE(?lat) as ?lat) (SAMPLE(?long) as ?long)` : ''
  }
WHERE {
 ?culturalInstituteOrSite a cis:CulturalInstituteOrSite ;
 cis:hasSite ?site ;
 rdfs:label ?label .

 ?site rdfs:label ?siteLabel ;
 cis:isPartOf ?isPartOf ;
 cis:siteAddress ?siteAddress .

 FILTER ( ?culturalInstituteOrSite = <${culturalSite}> ) .
 
 OPTIONAL { ?site cis:isPartOf ?isPartOf . 
  ?isPartOf rdfs:label ?isPartOfLabel  } .

 OPTIONAL { ?site owl:deprecated ?deprecatedSite } .
 FILTER ( !BOUND(?deprecatedSite ) ) .
 
 OPTIONAL { ?site rdfs:seeAlso ?siteSeeAlso } .
 OPTIONAL { ?site pico:preview ?sitePreview  } .
 
 OPTIONAL { ?siteAddress clvapit:fullAddress ?siteFullAddress } .
 OPTIONAL { ?siteAddress clvapit:hasCity ?siteCity .
  ?siteCity l0:name ?siteCityName  
 } .
  
 ${latLong}

 ${
   latLong
     ? ` BIND( ROUND( xsd:float(?siteLat)*1000000)/1000000 AS ?lat) .
 BIND( ROUND( xsd:float(?siteLong)*1000000)/1000000 AS ?long) .`
     : ''
 }
}
GROUP BY ?site
`

const latLong1 = `
 ?culturalInstituteOrSite geo:lat ?siteLat ;
  geo:long ?siteLong . `

const latLong2 = `
 ?site a-loc:lat ?siteLat ;
  a-loc:long ?siteLong . `

const latLong3 = `
 ?site clvapit:hasGeometry ?siteGeometry .
 
 ?siteGeometry a-loc:lat ?siteLat ;
  a-loc:long ?siteLong . `

const latLong4 = `
 ?site clvapit:hasGeometry ?siteGeometry .

 ?siteGeometry a-loc:hasCoordinates ?siteCoordinates .

 ?siteCoordinates a-loc:lat ?siteLat ;
  a-loc:long ?siteLong . `

const onlylatLong = (culturalSite: string) => `${prefix}
 SELECT ?siteLat ?siteLong 
 WHERE { ?cultpro rdf:type/rdfs:subClassOf* arco:CulturalProperty ;
  a-loc:hasCulturalPropertyAddress ?siteAddress ;
  a-loc:hasCulturalInstituteOrSite ?culturalInstituteOrSite ;
  clvapit:hasGeometry ?cpGeometry .
 
  ?cpGeometry a-loc:hasCoordinates ?cpCoordinates .
  
  ?cpCoordinates a-loc:lat ?siteLat ;
   a-loc:long ?siteLong .
  
   FILTER ( ?culturalInstituteOrSite = <${culturalSite}> )
  }
 LIMIT 1
 `

export const onlySites = baseQuery('')
export const onlyLatLong = onlylatLong
export const query1 = baseQuery(latLong1)
export const query2 = baseQuery(latLong2)
export const query3 = baseQuery(latLong3)
export const query4 = baseQuery(latLong4)

