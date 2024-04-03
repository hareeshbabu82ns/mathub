import { gql } from '@apollo/client'

///////// Test Queries //////////
export const FETCH_TEST_SETTINGS = gql`
  query ($type: TestType!) {
    testsettings(where: { type: $type }) {
      id
      settings
    }
  }
`
export const CREATE_TEST_SETTINGS = gql`
  mutation ($type: TestType!, $settings: Json) {
    createTestsetting(data: { type: $type, settings: $settings }) {
      id
    }
  }
`

export const UPDATE_TEST_SETTINGS = gql`
  mutation ($id: ID!, $type: TestType!, $settings: Json) {
    updateTestsetting(
      where: { id: $id }
      data: { type: $type, settings: $settings }
    ) {
      id
    }
  }
`

export const FETCT_TEST_SUMMARY = gql`
  query FetchTestSummary($type: TestType!, $from: DateTime!, $to: DateTime!) {
    tests(
      where: { type: $type, createdAt_between: { from: $from, to: $to } }
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
`

///////// Test Mutations //////////
export const FETCH_TEST_BY_ID = gql`
  query ($id: ID!) {
    test(where: { id: $id }) {
      id
      type
      questions
      answers
      createdAt
      updatedAt
    }
  }
`
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
`
