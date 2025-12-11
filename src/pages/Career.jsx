import React from 'react';
import {
    EyeIcon,
    CheckIcon,
    XMarkIcon,
    ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

const Career = () => {
    const applications = [
        { id: 1, name: 'Alice Johnson', position: 'Senior React Developer', email: 'alice@email.com', experience: '5 years', status: 'Under Review', applied: '2 days ago', resume: true },
        { id: 2, name: 'Bob Martinez', position: 'UI/UX Designer', email: 'bob@email.com', experience: '3 years', status: 'Interview', applied: '3 days ago', resume: true },
        { id: 3, name: 'Carol White', position: 'Backend Engineer', email: 'carol@email.com', experience: '7 years', status: 'New', applied: '5 hours ago', resume: true },
        { id: 4, name: 'David Lee', position: 'DevOps Engineer', email: 'david@email.com', experience: '4 years', status: 'Rejected', applied: '1 week ago', resume: true },
        { id: 5, name: 'Emma Davis', position: 'Product Manager', email: 'emma@email.com', experience: '6 years', status: 'Shortlisted', applied: '4 days ago', resume: true },
    ];

    const openPositions = [
        { position: 'Senior React Developer', applications: 12 },
        { position: 'UI/UX Designer', applications: 8 },
        { position: 'Backend Engineer', applications: 15 },
        { position: 'DevOps Engineer', applications: 6 },
        { position: 'Product Manager', applications: 10 },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'New': return 'bg-blue-100 text-blue-700';
            case 'Under Review': return 'bg-purple-100 text-purple-700';
            case 'Interview': return 'bg-yellow-100 text-yellow-700';
            case 'Shortlisted': return 'bg-green-100 text-green-700';
            case 'Rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Career Applications</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review job applications and manage hiring</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Total Applications</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">51</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">New</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">12</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">In Interview</p>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">8</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Open Positions</p>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">5</p>
                </div>
            </div>

            {/* Open Positions Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Open Positions</h3>
                <div className="grid md:grid-cols-5 gap-4">
                    {openPositions.map((pos, index) => (
                        <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors">
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{pos.position}</p>
                            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{pos.applications}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">applications</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Applications List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Candidate</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Position</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Experience</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Applied</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {applications.map((app) => (
                                <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-semibold transition-colors">
                                                {app.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{app.name}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{app.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 dark:text-white">{app.position}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-600 dark:text-gray-400">{app.experience}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-600 dark:text-gray-400">{app.applied}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(app.status)} dark:bg-opacity-20`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex gap-2">
                                            <button className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors">
                                                <EyeIcon className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors">
                                                <CheckIcon className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                                                <XMarkIcon className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors">
                                                <ArrowDownTrayIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Career;
