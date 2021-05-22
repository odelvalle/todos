@todos-service
Feature: TODOs Service
  In order manage todos
  As a developer
  I want to make sure CRUD operations through REST API works fine

  Scenario Outline: create a todo
    Given A Todo <request>
    When I send POST request to /todos
    Then I get response code 201

    Examples:
      | request                  |
      | {"todo":"BDD example 1"} |
      | {"todo":"BDD example 2"} |

  Scenario Outline: modify todo
    Given The Todo with <id> exist
    When I send PATCH request with a <completed> to /todos
    Then I get response code 200

    Examples:
      | id                        | completed           |
      | 609cbf8974641d563ccb0701  | {"completed": true} |
      | 609cc2211a28b23a089cffbd  | {"completed": true} |

  Scenario Outline: get todo
    Given The Todo with <id> exist
    When I send GET request to /todos
    Then I receive <response>

    Examples:
      | id | response                                                                                                                                      |
      | 609cbf8974641d563ccb0701 | {"id":99,"name":"Dwayne Klocko","email":"Rene30@hotmail.com","phoneNumber":"1-876-420-9890","secondaryPhoneNumber": "(914) 249-3519"}         |
      | 7  | {"id":7,"name":"Ian Weimann DVM","email":"Euna_Bergstrom@hotmail.com","phoneNumber":"(297) 962-1879", "secondaryPhoneNumber": "788.323.7782"} |

  Scenario Outline: delete todo
    Given The todo with <id> exist
    When I send DELETE request to /todos
    Then I get response code 204

    Examples:
      | id |
      | 99 |
      | 7  |
