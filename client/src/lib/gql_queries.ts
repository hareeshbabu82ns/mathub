import { gql } from "@apollo/client";

///////// Test Queries //////////
export const FETCH_TEST_SETTINGS = gql`
  query {
    testsettings(where: { type: ARITHMETIC }) {
      id
      settings
    }
  }
`;
export const CREATE_TEST_SETTINGS = gql`
  mutation ($settings: Json) {
    createTestsetting(data: { type: ARITHMETIC, settings: $settings }) {
      id
    }
  }
`;

export const UPDATE_TEST_SETTINGS = gql`
  mutation ($id: ID!, $settings: Json) {
    updateTestsetting(
      where: { id: $id }
      data: { type: ARITHMETIC, settings: $settings }
    ) {
      id
    }
  }
`;

export const FETCT_TEST_SUMMARY = gql`
  query FetchTestSummary($from: DateTime!, $to: DateTime!) {
    tests(
      where: { type: ABACUS, createdAt_between: { from: $from, to: $to } }
      orderBy: { createdAt: ASC }
    ) {
      id
      createdAt
      updatedAt
      type
      questions
      answers
    }
  }
`;

///////// Test Mutations //////////
export const ADD_TEST = gql`
  mutation CreateTest(
    $type: TestType!
    $createdAt: DateTime!
    $updatedAt: DateTime!
    $questions: Json
    $answers: Json
  ) {
    createTest(
      data: {
        type: $type
        createdAt: $createdAt
        updatedAt: $updatedAt
        questions: $questions
        answers: $answers
      }
    ) {
      id
    }
  }
`;
