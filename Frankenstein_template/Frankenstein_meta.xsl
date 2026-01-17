<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    exclude-result-prefixes="xs tei"
    version="2.0">
    
    <!-- <xsl:output method="xml" omit-xml-declaration="yes" indent="yes" /> -->

    
    <xsl:template match="tei:TEI">
                     <div class="row">
                         <div class="col">
                             <h4>About the manuscript page:</h4>
                             <xsl:value-of select="//tei:sourceDesc"/>
                             <xsl:value-of select="//tei:licence"/> <!-- You can change the way the metadata is visualised as well-->
                         </div>
                         <div class="col">
                            <table class="stats-table"> 
                                <tr>
                                    <td>Total number of modifications: <xsl:value-of select="count(//tei:del|//tei:add)" /></td>
                                </tr>
                                <tr>
                                    <td>Number of additions: <xsl:value-of select="count(//tei:add)"/></td>
                                </tr>
                                <tr>
                                    <td>Number of deletions: <xsl:value-of select="count(//tei:del)"/></td>
                                </tr>
                                <tr>
                                    <td>Corrections by Mary Shelley: <xsl:value-of select="count(//tei:add[@hand='#MWS'] | //tei:del[@hand='#MWS'])"/></td>
                                </tr>
                                <tr>
                                    <td>Corrections by Percy Shelley: <xsl:value-of select="count(//tei:add[@hand='#PBS'] | //tei:del[@hand='#PBS'])"/></td>
                                </tr>
                                <tr>
                                    <td>Interventions by Clerval: <xsl:value-of select="count(//tei:q[@who='Clerval'])"/></td>
                                </tr>
                                <tr>
                                    <td>Interventions by Victor Frankenstein: <xsl:value-of select="count(//tei:q[@who='Victor'])"/></td>
                                </tr>
                                <tr>
                                    <td>Word count: <span id="wordCountDisplay">calculating...</span></td>
                                </tr>
                            </table>
                        </div>
                     </div>
        <hr/>
    </xsl:template>
    

</xsl:stylesheet>
