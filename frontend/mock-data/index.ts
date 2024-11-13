import { Complexity } from '@repo/user-types'
import { ITestcase, QuestionStatus } from '@/types'

interface ICollaborator {
    name: string
    email: string
}

interface IQuestion {
    title: string
    description: string
    complexity: Complexity
    categories: string[]
    testCases: ITestcase[]
}

const mockCollaboratorData: ICollaborator = {
    name: 'John Doe',
    email: 'johnnydoey@gmail.com',
}

const mockUserData: ICollaborator = {
    name: 'Oliver Wye',
    email: 'oliverwye@gmail.com',
}

const mockChatData = [
    {
        user: mockUserData,
        message: "I don't understand the question. Please help me!",
        timestamp: '2024-09-20T11:59:00',
    },
    {
        user: mockCollaboratorData,
        message: 'Hey, lets try to solve this together.',
        timestamp: '2024-09-20T12:01:00',
    },
    {
        user: mockUserData,
        message: 'Okay! I am ready',
        timestamp: '2024-09-20T12:03:00',
    },
    {
        user: mockCollaboratorData,
        message: 'Sure, lets start by understanding the question',
        timestamp: '2024-09-20T12:05:00',
    },
    {
        user: mockCollaboratorData,
        message: 'This question is about reversing a string',
        timestamp: '2024-09-20T12:08:00',
    },
    {
        user: mockUserData,
        message: 'What does reverse mean?',
        timestamp: '2024-09-20T12:09:00',
    },
]

const mockQuestionData: IQuestion = {
    title: 'Reverse a String',
    description:
        'Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory. Example 1: Input: s =["h", "e", "l", "l", "o"] Output: ["o", "l", "l", "e", "h"]',
    complexity: Complexity.EASY,
    categories: ['Array', 'Hash Table'],
    testCases: [
        {
            input: '["h", "e", "l", "l", "o"]',
            output: '["o", "l", "l", "e", "h"]',
        },
        {
            input: '["H", "a", "n", "n", "a", "h"]',
            output: '["h", "a", "n", "n", "a", "H"]',
        },
    ],
}

const mockTestCaseData = [
    {
        idx: 1,
        inputVar: 's',
        input: '["h", "e", "l", "l", "o"]',
        output: '["o", "l", "l", "e", "h"]',
    },
    {
        idx: 2,
        inputVar: 's',
        input: '["H", "a", "n", "n", "a", "h"]',
        output: '["h", "a", "n", "n", "a", "H"]',
    },
]

const mockQuestionsData = [
    {
        id: '1',
        category: ['Algorithms'],
        status: QuestionStatus.FAILED,
        description: 'This is a description',
        complexity: Complexity.MEDIUM,
        title: 'Title of the question',
    },
    {
        id: '2',
        category: ['Algorithms'],
        status: QuestionStatus.FAILED,
        description: 'This is a description',
        complexity: Complexity.EASY,
        title: 'Title of the question',
    },
    {
        id: '3',
        category: ['Algorithms'],
        status: QuestionStatus.COMPLETED,
        description: 'This is a description',
        complexity: Complexity.HARD,
        title: 'Title of the question',
    },
    {
        id: '4',
        category: ['Algorithms'],
        status: QuestionStatus.NOT_ATTEMPTED,
        description: 'This is a description',
        complexity: Complexity.MEDIUM,
        title: 'Title of the question',
    },
    {
        id: '5',
        category: ['Strings'],
        status: QuestionStatus.COMPLETED,
        description: 'This is a description',
        complexity: Complexity.MEDIUM,
        title: 'Title of the question',
    },
    {
        id: '6',
        category: ['Algorithms'],
        status: QuestionStatus.COMPLETED,
        description: 'This is a description',
        complexity: Complexity.MEDIUM,
        title: 'Title of the question',
    },
    {
        id: '7',
        category: ['Strings'],
        status: QuestionStatus.FAILED,
        description: 'This is a description',
        complexity: Complexity.MEDIUM,
        title: 'Title of the question',
    },
    {
        id: '8',
        category: ['Algorithms'],
        status: QuestionStatus.FAILED,
        description:
            'This is some super super unnecessarily long description to test the overflow of the text in the datatable column. This is some super super unnecessarily long description to test the overflow of the text in the datatable column',
        complexity: Complexity.MEDIUM,
        title: 'Another title of the question',
    },
    {
        id: '9',
        category: ['Algorithms, Strings'],
        status: QuestionStatus.NOT_ATTEMPTED,
        description: 'Test algbat',
        complexity: Complexity.MEDIUM,
        title: 'Title of the question',
    },
    {
        id: '10',
        category: ['Algorithms'],
        status: QuestionStatus.FAILED,
        description: 'Appla tat',
        complexity: Complexity.MEDIUM,
        title: 'Another title of the question',
    },
    {
        id: '11',
        category: ['Algorithms'],
        status: QuestionStatus.NOT_ATTEMPTED,
        description: 'ZOogo a',
        complexity: Complexity.MEDIUM,
        title: 'Title of the question',
    },
    {
        id: '12',
        category: ['Algorithms'],
        status: QuestionStatus.COMPLETED,
        description: 'Baga bia',
        complexity: Complexity.MEDIUM,
        title: 'Title of the question',
    },
]

// const mockSessionsData: ISession[] = [
//     {
//         id: '1',
//         name: 'Olivian Martin',
//         email: 'olvia.martin@email.com',
//         question: 'reverse a string',
//         description: 'reverse the given string, returning the chracters in reverse order',
//         status: 'failed',
//         complexity: 'EASY',
//         time: 1727445395396,
//     },
//     {
//         id: '2',
//         name: 'Billy Russo',
//         email: 'billy.russo@email.com',
//         question: 'reverse a string',
//         description: 'reverse the given string, returning the chracters in reverse order',
//         status: 'completed',
//         complexity: 'MEDIUM',
//         time: 1727745397396,
//     },
//     {
//         id: '1',
//         name: 'Charlie munger',
//         email: 'charlie.mnunger@email.com',
//         question: 'reverse a string',
//         description: 'reverse the given string, returning the chracters in reverse order',
//         status: 'failed',
//         complexity: 'hard',
//         time: 1797445395396,
//     },
// ]

export { mockCollaboratorData, mockUserData, mockChatData, mockQuestionData, mockTestCaseData, mockQuestionsData }
