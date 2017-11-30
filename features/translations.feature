Feature: Translation
As a user of DHIS2
I want to be able to translate the objects in the system

     Background:
       Given that I am logged in to the Sierra Leone DHIS2
       And that I have the necessary permissions to access the Translations App

    Scenario: Check available target locales
        When I open the target locales list from the app
        Then I should see all available locales in the system.

    Scenario: Select target locale without object type defined
        When I select the target locale from the app
        And I do not select the object type
        Then I should see the alert to select an object type.

    Scenario: Select target locale with object type defined
        When I select the target locale from the app
        And I do select one object type
        Then I should see a list of objects to translate.

    Scenario Outline: Translate an object property
        When I select the target <locale>
        And I select the <object_type>
        And I translate the <property> of <object_instance> to <translated_name>
        And I save my translation
        Then I should see the success alert.
        Examples:
        | locale | object_type | property | object_instance | translated_name |
        | fr | data element | name | Accute Flaccid Paralysis (Deaths < 5 yrs) | Paralysie flasque aiguë (Décès <5 ans) |

    Scenario Outline: Translate an object property with an existing translation for the same locale
        When I select the target <locale>
        And I select the <object_type>
        And I translate the <property> of <object_instance> with an existing translation to <translated_name>
        And I save my translation
        Then I should see the success alert.
        Examples:
        | locale | object_type | property | object_instance | translated_name |
        | fr | data element | name | Acute Flaccid Paralysis (AFP) new | Paralysie flasque aiguë nouveau |

    Scenario Outline: Translate an object property with an existing translation for another locale
        When I select the target <locale>
        And I select the <object_type>
        And I see a translation for <object_instance> with an existing translation to <translated_name>
        And I select the target <new_locale>
        And I translate the <property> of <object_instance> to <new_translated_name>
        And I save my translation
        Then I select the target <locale>
        And I should see a translation for <object_instance> with an existing translation to <translated_name>
        And I select the target <new_locale>
        And I should see a translation for <object_instance> with an existing translation to <new_translated_name>
        Examples:
        | locale | new_locale | object_type | property | object_instance | translated_name | new_translated_name |
        | fr | sv | data element | name | Acute Flaccid Paralysis (AFP) new | Paralysie flasque aiguë nouveau | Akut slapp förlamning |

    # scenario for filter by?
    # scenario for translation removal?
    # scenario for pagination?
