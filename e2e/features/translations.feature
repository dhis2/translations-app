Feature: Translation
As a user of DHIS2
I want to be able to translate the objects in the system

     Background:
       Given that I am logged in to the Sierra Leone DHIS2
       And that I have the necessary permissions to access the Translations App

    Scenario: Check available target locales
        When I open the target locales list from the app
        Then I should see all available locales in the system.

    Scenario Outline: Select target locale without object type defined
        When I select the target locale <locale>
        And I do not select the object type
        Then I should see the alert to select an object type.
        Examples:
        | locale |
        | French |

    Scenario Outline: Select target locale with object type defined
        When I select the target locale <locale>
        And I select the object type <object_type>
        Then I should see a list of objects to translate.
        Examples:
        | locale | object_type |
        | French | Category |

    Scenario Outline: Translate an object property
        When I select the target locale <locale>
        And I select the object type <object_type>
        And I translate the first property of first object instance to <translation>
        And I save my translation
        Then I should see the success alert.
        Examples:
        | locale | object_type | translation |
        | French | Category | catégorie |
