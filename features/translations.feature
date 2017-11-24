Feature: Translation
As a user of DHIS2
I want to be able to translate the objects in the system

     Background:
       Given that I am logged in to the Sierra Leone DHIS2
       And that I have the necessary permissions to access the Translations App

    Scenario: Check available target locales
        When I open the target locale select from the app
        Then I should see all available database locales in the system.

    Scenario: Select target locale without object type defined
        When I select the target locale from the app
        And I do not select the object type
        Then I should see the select an object type alert.

    Scenario: Select target locale with object type defined
        When I select the target locale from the app
        And I do select one object type
        Then I should see a list of objects to translate.

    Scenario Outline: Translate an object name
        When I select the target <locale>
        And I select the <object_type>
        And I translate the name of <object_instance> to <translated_name>
        And I save my translation
        Then I should see the saved alert.
        Examples:
        | locale | object_type | object_instance | translated_name |
        | fr | data element | Accute Flaccid Paralysis (Deaths < 5 yrs) | Paralysie flasque aiguë (Décès <5 ans) |

    Scenario Outline: Translate an object name with an existing translation for the same locale
        When I select the target <locale>
        And I select the <object_type>
        And I translate the name of <object_instance> with an existing translation to <translated_name>
        And I save my translation
        Then I should see the saved alert.
        Examples:
        | locale | object_type | object_instance | translated_name |
        | fr | data element | Acute Flaccid Paralysis (AFP) new | Paralysie flasque aiguë nouveau |

    Scenario Outline: Translate an object name with an existing translation for other locale
        When I select the target <locale>
        And I select the <object_type>
        And I see a translation for <object_instance> with an existing translation to <translated_name>
        And I select the target <other_than_locale>
        And I translate the name of <object_instance> to <other_translated_name>
        And I save my translation
        Then I select the target <locale>
        And I should see a translation for <object_instance> with an existing translation to <translated_name>
        And I select the target <other_than_locale>
        And I should see a translation for <object_instance> with an existing translation to <other_translated_name>
        Examples:
        | locale | object_type | object_instance | translated_name | other_than_locale | other_translated_name |
        | fr | data element | Acute Flaccid Paralysis (AFP) new | Paralysie flasque aiguë nouveau | sv | Akut slapp förlamning |

    # scenario for filter by?
    # scenario for other properties than name?
    # scenario for translation removal?
    # scenario for pagination?
