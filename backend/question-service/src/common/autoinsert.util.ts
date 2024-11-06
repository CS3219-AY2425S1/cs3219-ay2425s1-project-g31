import { Category, Complexity } from '@repo/question-types'
import { Model, model } from 'mongoose'
import questionSchema from '../models/question.model'
import { CreateQuestionDto } from '../types/CreateQuestionDto'
import { IQuestion } from '../types/IQuestion'
import logger from './logger.util'

const QUESTION_1: CreateQuestionDto = new CreateQuestionDto(
    'Reverse a String',
    `Write a function that reverses a string. The input string is given as an array of characters. You must do this by modifying the input array in-place with O(1) extra memory.\nExample 1:\nInput: s = ["h","e","l","l","o"]\nOutput: ["o","l","l","e","h"]\nExample 2:\n Input: s = ["H","a","n","n","a","h"]\nOutput: ["h","a","n","n","a","H"]\nConstraints:\n1 <= s.length <= 105\ns[i] is a printable ascii character.`,
    [Category.STRINGS, Category.ALGORITHMS],
    Complexity.EASY,
    'https://leetcode.com/problems/reverse-string/',
    ['hello', 'Hannah'],
    ['olleh', 'hannaH']
)

const QUESTION_2: CreateQuestionDto = new CreateQuestionDto(
    'Linked List Cycle Detection',
    'Implement a function to detect if a linked list contains a cycle.',
    [Category.DATA_STRUCTURES, Category.ALGORITHMS],
    Complexity.EASY,
    'https://leetcode.com/problems/linked-list-cycle/',
    ['1->2->3->4->2', '1->2->3->4->5'],
    ['true', 'false']
)

const QUESTION_3: CreateQuestionDto = new CreateQuestionDto(
    'Roman to Integer',
    'Given a roman numeral, convert it to an integer.',
    [Category.ALGORITHMS],
    Complexity.EASY,
    'https://leetcode.com/problems/roman-to-integer/',
    ['III', 'IV', 'IX', 'LVIII', 'MCMXCIV'],
    ['3', '4', '9', '58', '1994']
)

const QUESTION_4: CreateQuestionDto = new CreateQuestionDto(
    'Add Binary',
    'Given two binary strings a and b, return their sum as a binary string.',
    [Category.BIT_MANIPULATION, Category.ALGORITHMS],
    Complexity.EASY,
    'https://leetcode.com/problems/add-binary/',
    ['11', '1010', '1010', '1'],
    ['1', '10101', '10101', '100']
)

const QUESTION_5: CreateQuestionDto = new CreateQuestionDto(
    'Fibonacci Number',
    `The Fibonacci numbers, commonly denoted F(n), form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. That is,\nF(0) = 0, F(1) = 1\nF(n) = F(n - 1) + F(n - 2), for n > 1.\nGiven n, calculate F(n).`,
    [Category.RECURSION, Category.ALGORITHMS],
    Complexity.EASY,
    'https://leetcode.com/problems/fibonacci-number/',
    ['2', '3', '4', '5', '6'],
    ['1', '2', '3', '5', '8']
)

const QUESTION_6: CreateQuestionDto = new CreateQuestionDto(
    'Implement Stack using Queues',
    'Implement a last-in-first-out (LIFO) stack using only two queues. The implemented stack should support all the functions of a normal stack (push, top, pop, and empty).',
    [Category.DATA_STRUCTURES],
    Complexity.EASY,
    'https://leetcode.com/problems/implement-stack-using-queues/',
    ['push', 'push', 'top', 'pop', 'empty'],
    ['1', '2', '2', '2', 'false']
)

const QUESTION_7: CreateQuestionDto = new CreateQuestionDto(
    'Combine Two Tables',
    `Given table Person with the following columns:\n1. personId (int)\n2. lastName (varchar)\n3. firstName (varchar)\npersonId is the primary key.\nAnd table Address with the following columns:\n1. addressId (int)\n2. personId (int)\n3. city (varchar)\n4. state (varchar)\naddressId is the primary key.\n\nWrite a solution to report the first name, last name, city, and state of each person in the Person table. If the address of a personId is not present in the Address table, report null instead. Return the result table in any order.`,
    [Category.DATABASES],
    Complexity.EASY,
    'https://leetcode.com/problems/combine-two-tables/',
    ['[1 3 4]', '[2 3 5]'],
    ['[Allen John NULL NULL]', '[Bob NULL NULL NULL]']
)

const QUESTION_8: CreateQuestionDto = new CreateQuestionDto(
    'Repeated DNA Sequences',
    `The DNA sequence is composed of a series of nucleotides abbreviated as 'A', 'C', 'G', and 'T'.\nFor example, "ACGAATTCCG" is a DNA sequence.\nWhen studying DNA, it is useful to identify repeated sequences within the DNA.\nGiven a string s that represents a DNA sequence, return all the 10-letter-long sequences (substrings) that occur more than once in a DNA molecule.\nYou may return the answer in any order.`,
    [Category.ALGORITHMS, Category.BIT_MANIPULATION],
    Complexity.MEDIUM,
    'https://leetcode.com/problems/repeated-dna-sequences/',
    ['AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT', 'AAAAAAAAAAAAA'],
    ['AAAAACCCCC', 'AAAAAAAAAA']
)

const QUESTION_9: CreateQuestionDto = new CreateQuestionDto(
    'Course Schedule',
    `There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.\nFor example, the pair [0, 1] indicates that to take course 0, you have to first take course 1.\nReturn true if you can finish all courses.\nOtherwise, return false`,
    [Category.DATA_STRUCTURES, Category.ALGORITHMS],
    Complexity.MEDIUM,
    'https://leetcode.com/problems/course-schedule/',
    ['2', '2', '3'],
    ['[[1,0]]', '[[1,0],[0,1]]', '[[1,0],[2,1]]']
)

const QUESTION_10: CreateQuestionDto = new CreateQuestionDto(
    'LRU Cache Design',
    'Design and implement an LRU (Least Recently Used) cache.',
    [Category.DATA_STRUCTURES],
    Complexity.MEDIUM,
    'https://leetcode.com/problems/lru-cache/',
    ['2', '2', '3'],
    ['[[1,0]]', '[[1,0],[0,1]]', '[[1,0],[2,1]]']
)

const QUESTION_11: CreateQuestionDto = new CreateQuestionDto(
    'Longest Common Subsequence',
    `Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.\nA subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.\nFor example, "ace" is a subsequence of "abcde".\nA common subsequence of two strings is a subsequence that is common to both strings.`,
    [Category.STRINGS, Category.ALGORITHMS],
    Complexity.MEDIUM,
    'https://leetcode.com/problems/longest-common-subsequence/',
    ['abcde', 'abc', 'abc', 'abc'],
    ['ace', 'ac', 'bc', 'bc']
)

const QUESTION_12: CreateQuestionDto = new CreateQuestionDto(
    'Rotate Image',
    'You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).',
    [Category.ARRAYS, Category.ALGORITHMS],
    Complexity.MEDIUM,
    'https://leetcode.com/problems/rotate-image/',
    ['[[1,2,3],[4,5,6],[7,8,9]]', '[[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]'],
    ['[[7,4,1],[8,5,2],[9,6,3]]', '[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]']
)

const QUESTION_13: CreateQuestionDto = new CreateQuestionDto(
    'Airplane Seat Assignment Probability',
    `n passengers board an airplane with exactly n seats. The first passenger has lost the ticket and picks a seat randomly. After that, the rest of the passengers will:\n1. Take their own seat if it is still available, and\n2. Pick other seats randomly when they find their seat occupied.\nReturn the probability that the nth person gets his own seat.`,
    [Category.BRAINTEASER],
    Complexity.MEDIUM,
    'https://leetcode.com/problems/airplane-seat-assignment-probability/',
    ['1', '2', '3'],
    ['1', '0.5', '0.5']
)

const QUESTION_14: CreateQuestionDto = new CreateQuestionDto(
    'Validate Binary Search Tree',
    'Given the root of a binary tree, determine if it is a valid binary search tree (BST).',
    [Category.DATA_STRUCTURES, Category.ALGORITHMS],
    Complexity.MEDIUM,
    'https://leetcode.com/problems/validate-binary-search-tree/',
    ['[2,1,3]', '[5,1,4,null,null,3,6]'],
    ['true', 'false']
)

const QUESTION_15: CreateQuestionDto = new CreateQuestionDto(
    'Sliding Window Maximum',
    `You are given an array of integers nums. There is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position. Return the max sliding window.`,
    [Category.ARRAYS, Category.ALGORITHMS],
    Complexity.HARD,
    'https://leetcode.com/problems/sliding-window-maximum/',
    ['[1,3,-1,-3,5,3,6,7]', '[1]', '[1,-1]'],
    ['[3,3,5,5,6,7]', '[1]', '[1]']
)

const QUESTION_16: CreateQuestionDto = new CreateQuestionDto(
    'N-Queen Problem',
    `The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other.\nGiven an integer n, return all distinct solutions to the n-queens puzzle. You may return the answer in any order. Each solution contains a distinct board configuration of the n-queens' placement, where 'Q' and '.' both indicate a queen and an empty space, respectively.`,
    [Category.ALGORITHMS],
    Complexity.HARD,
    'https://leetcode.com/problems/n-queens/',
    ['4', '1'],
    ['[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]', '[["Q"]]']
)

const QUESTION_17: CreateQuestionDto = new CreateQuestionDto(
    'Serialize and Deserialize a Binary Tree',
    `Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection to be reconstructed later in the same or another environment.\nDesign an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.`,
    [Category.DATA_STRUCTURES, Category.ALGORITHMS],
    Complexity.HARD,
    'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/',
    ['[1,2,3,null,null,4,5]', '[1]', '[1,2]'],
    ['[1,2,3,null,null,4,5]', '[1]', '[1,2]']
)

const QUESTION_18: CreateQuestionDto = new CreateQuestionDto(
    'Wildcard Matching',
    `Given an input string (s) and a pattern (p), implement wildcard pattern matching with support for '?' and '*' where:\n1. '?' Matches any single character.\n2. '*' Matches any sequence of characters (including the empty sequence).\nThe matching should cover the entire input string (not partial).`,
    [Category.STRINGS, Category.ALGORITHMS],
    Complexity.HARD,
    'https://leetcode.com/problems/wildcard-matching/',
    ['aa', 'aa', 'cb', 'adceb', 'acdcb'],
    ['a', 'a*', '?a', '*a*b', 'a*c?b']
)

const QUESTION_19: CreateQuestionDto = new CreateQuestionDto(
    'Chalkboard XOR Game',
    `You are given an array of integers nums representing the numbers written on a chalkboard.\nAlice and Bob take turns erasing exactly one number from the chalkboard, with Alice starting first. If erasing a number causes the bitwise XOR of all the elements of the chalkboard to become 0, then that player loses. The bitwise XOR of one element is that element itself, and the bitwise XOR of no elements is 0.\nAlso, if any player starts their turn with the bitwise XOR of all the elements of the chalkboard equal to 0, then that player wins.\nReturn true if and only if Alice wins the game, assuming both players play optimally.`,
    [Category.BRAINTEASER],
    Complexity.HARD,
    'https://leetcode.com/problems/chalkboard-xor-game/',
    ['[1,1,2]', '[0,1]'],
    ['false', 'true']
)

const QUESTION_20: CreateQuestionDto = new CreateQuestionDto(
    'Trips and Users',
    `You are given two tables: Trips and Users.\nThe **Trips** table has the following columns:\n1. id (int)\n2. client_id (int)\n3. driver_id (int)\n4. city_id (int)\n5. status (enum)\n6. request_at (date)\nid is the primary key. The table holds all taxi trips.\n\nThe **Users** table has the following columns:\n1. users_id (int)\n2. banned (enum)\n3. role (enum)\nusers_id is the primary key. The table holds all users.\n\nWrite a solution to find the cancellation rate of requests with unbanned users (both client and driver must not be banned) each day between "2013-10-01" and "2013-10-03". Round Cancellation Rate to two decimal points. Return the result table in any order.`,
    [Category.DATABASES],
    Complexity.HARD,
    'https://leetcode.com/problems/trips-and-users/',
    [],
    []
)

const QUESTION_BANK: CreateQuestionDto[] = [
    QUESTION_1,
    QUESTION_2,
    QUESTION_3,
    QUESTION_4,
    QUESTION_5,
    QUESTION_6,
    QUESTION_7,
    QUESTION_8,
    QUESTION_9,
    QUESTION_10,
    QUESTION_11,
    QUESTION_12,
    QUESTION_13,
    QUESTION_14,
    QUESTION_15,
    QUESTION_16,
    QUESTION_17,
    QUESTION_18,
    QUESTION_19,
    QUESTION_20,
]

/**
 * Auto inserts questions into the database, for development and testing purposes only
 */
export const autoInsertQuestions = async (): Promise<void> => {
    const questionModel: Model<IQuestion> = model('Question', questionSchema)
    const count = await questionModel.countDocuments()
    if (count > 0) {
        logger.info(
            `[Auto Insert] Skipping auto insert of questions as there are already ${count} questions in the database.`
        )
        return
    }

    try {
        await questionModel.insertMany(QUESTION_BANK)
        logger.info(`[Auto Insert] Questions inserted successfully.`)
    } catch (error) {
        logger.error(`[Auto Insert] Error inserting questions: ${error}`)
    }
}
