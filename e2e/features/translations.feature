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
        And I translate the <property> of <object_instance> to <translation>
        And I save my translation
        Then I should see the success alert.
        Examples:
        | locale | object_type | property | object_instance | translation |
        | French | Category | Name | default | catégorie |

    Scenario Outline: Translate an object property with an existing translation for another locale
        When I select the target locale <locale>
        And I select the object type <object_type>
        And I see a translation for <object_instance> with an existing translation to <translated_name> for <property>
        And I select the target locale <new_locale>
        And I translate the <property> of <object_instance> to <new_translated_name>
        And I save my translation
        Then I select the target locale <locale>
        And I should see a translation for <object_instance> with an existing translation to <translated_name> for <property>
        And I select the target locale <new_locale>
        And I should see a translation for <object_instance> with an existing translation to <new_translated_name> for <property>
        Examples:
        | locale | new_locale | object_type | property | object_instance | translated_name | new_translated_name |
        | French | Portuguese | Category | Name | default | catégorie | categoria |
