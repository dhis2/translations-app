Feature: Translation
As a user of DHIS2
I want to be able to translate the objects in the system

     Background:
       Given that I am logged in to the Sierra Leone DHIS2
       And that I have the necessary permissions to access the Translations App

    Scenario: Choose a target locale
        When I select a target locale from the app
        Then I should see all available database locales in the system
        And I should be able to select only one of these. 

    Scenario: Choose an object type
        When I select an object type
        I should see a list of available object ytpes
        And I should be able to select only one of these.
    
    Scenario: See a list of objects to translate
        Given I have selected a target locale
        And I have selected an object type
        When I select the data element object type
        Then I should see a list of all data elements
    
    Scenario: Translate a data element name
        When I select the target locale of French
        And I select the data element object type 
        When I translate the name  of "Accute Flaccid Paralysis (Deaths < 5 yrs)" to "Paralysie flasque aiguë (Décès <5 ans)"
        And I save my translation
        Then the translation should exist on the server. 
    
    Scenario: Translate a data element with an existing translation in another language
        Given  I have translated the data element with name "Acute Flaccid Paralysis (AFP) new" to "Paralysie flasque aiguë nouveau"
        And I select another locale which is not French
        And I translate the name to "Akut slapp förlamning"
        And I save my translation
        Then both translated names should exist in the system.
        



    
    
    

    