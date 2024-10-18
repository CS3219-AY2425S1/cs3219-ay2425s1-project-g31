'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import Link from 'next/link'
import { MoveRight } from 'lucide-react'

export const RecentSessions = () => {
    const data = [
        {
            collaborator: 'Olivia Martin',
            question: 'Reverse a String',
        },
        {
            collaborator: 'Olivia Martin',
            question: 'Reverse a String',
        },
        {
            collaborator: 'Olivia Martin',
            question: 'Reverse a String',
        },
        {
            collaborator: 'Olivia Martin',
            question: 'Reverse a String',
        },
        {
            collaborator: 'Olivia Martin',
            question: 'Reverse a String',
        },
    ]

    return (
        <div className="border-solid border-2 border-gray-200 rounded flex flex-col w-dashboard p-6 min-h-[60vh] max-h-[90vh] overflow-auto justify-between">
            <div>
                <h5 className=" text-xl text-medium font-bold">Recent Sessions</h5>
                <br />
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Collaborator</TableHead>
                            <TableHead className="text-right">Question</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map(({ collaborator, question }, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <p>{collaborator}</p>
                                </TableCell>
                                <TableCell className="text-right">
                                    <p>{question}</p>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <Link className="flex flex-row justify-center underline text-purple-600" href={'/sessions'}>
                <p className="mr-1">View all sessions</p>
                <MoveRight />
            </Link>
        </div>
    )
}
