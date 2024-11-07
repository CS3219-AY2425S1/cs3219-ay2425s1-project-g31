'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import Link from 'next/link'
import { MoveRight } from 'lucide-react'
import { IPartialSessions } from '@/types'

const cols: { key: keyof IPartialSessions; label: string }[] = [
    {
        key: 'collaboratorName',
        label: 'Collaborator',
    },
    {
        key: 'questionTitle',
        label: 'Question',
    },
    {
        key: 'category',
        label: 'Category',
    },
]

export const RecentSessions = ({ data }: { data: IPartialSessions[] }) => {
    return (
        <div className="border-solid border-2 border-gray-200 rounded flex flex-col w-dashboard p-6 min-h-[60vh] max-h-[90vh] overflow-auto justify-between">
            <div>
                <h5 className=" text-xl text-medium font-bold">Recent Sessions</h5>
                <br />
                <Table>
                    <TableHeader>
                        <TableRow>
                            {cols.map((col) => (
                                <TableHead key={col.key} className="font-bold">
                                    {col.label}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow key={index}>
                                {cols.map((col) => (
                                    <TableCell key={col.key}>
                                        <p>{row[col.key]}</p>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {!data.length && (
                    <p className="py-10 text-center text-sm text-gray-400 border-2 border-t-0 rounded-xl rounded-t-none border-gray-100">
                        No recent sessions
                    </p>
                )}
            </div>
            <Link className="flex flex-row justify-center underline text-purple-600" href={'/sessions'}>
                <p className="mr-1">View all sessions</p>
                <MoveRight />
            </Link>
        </div>
    )
}
