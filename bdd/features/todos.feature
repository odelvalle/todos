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
      | id                       | response                                                                                                                                          |
      | 609cbf8974641d563ccb0701 | {"status":true,"todo":{"id":"609cbf8974641d563ccb0701","todo":"task updated from swagger","created":"2021-05-13T05:56:25.838Z","completed":true}} |
      | 609cc7cd3cf87b552c62a57b | {"status":true,"todo":{"id":"609cc7cd3cf87b552c62a57b","todo":"example","created":"2021-05-13T06:31:41.961Z","completed":false}}                  |

  Scenario Outline: delete todo
    Given The Todo with <id> exist
    When I send DELETE request to /todos
    Then I get response code 204

    Examples:
      | id |
      | 609cbf8974641d563ccb0701 |
      | 609cc7cd3cf87b552c62a57b |
