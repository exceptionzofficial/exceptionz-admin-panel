import React, { useState } from 'react';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    PlusIcon,
    ArrowDownTrayIcon,
    EyeIcon
} from '@heroicons/react/24/outline';

const Invoices = () => {
    const [filter, setFilter] = useState('all');

    const stats = [
        { label: 'Total Revenue', value: '$248,350', color: 'text-green-600' },
        { label: 'Paid', value: '$185,420', color: 'text-blue-600' },
        { label: 'Pending', value: '$45,200', color: 'text-orange-600' },
        { label: 'Overdue', value: '$17,730', color: 'text-red-600' },
    ];

    const invoices = [
        { id: 'INV-001', client: 'TechCorp Inc.', project: 'E-Commerce Platform', amount: '$45,000', status: 'Paid', date: 'Oct 15, 2024', dueDate: 'Nov 15, 2024' },
        { id: 'INV-002', client: 'FinanceHub', project: 'Mobile Banking App', amount: '$25,000', status: 'Pending', date: 'Nov 01, 2024', dueDate: 'Dec 01, 2024' },
        { id: 'INV-003', client: 'SalesPro Ltd', project: 'CRM System', amount: '$18,500', status: 'Overdue', date: 'Sep 20, 2024', dueDate: 'Oct 20, 2024' },
        { id: 'INV-004', client: 'DataTech', project: 'AI Dashboard', amount: '$35,000', status: 'Paid', date: 'Oct 28, 2024', dueDate: 'Nov 28, 2024' },
        { id: 'INV-005', client: 'Enterprise Co', project: 'Cloud Migration', amount: '$95,000', status: 'Paid', date: 'Oct 10, 2024', dueDate: 'Nov 10, 2024' },
        { id: 'INV-006', client: 'StartupXYZ', project: 'Social Media App', amount: '$15,000', status: 'Pending', date: 'Nov 05, 2024', dueDate: 'Dec 05, 2024' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-700';
            case 'Pending': return 'bg-orange-100 text-orange-700';
            case 'Overdue': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const filteredInvoices = filter === 'all' ? invoices : invoices.filter(inv => inv.status === filter);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoices</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and track all invoices</p>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2 transition-colors">
                    <PlusIcon className="w-5 h-5" />
                    Create Invoice
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{stat.label}</p>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative flex-1 w-full">
                        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search invoices..."
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-colors"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <FunnelIcon className="w-5 h-5 text-gray-400" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-colors"
                        >
                            <option value="all">All Status</option>
                            <option value="Paid">Paid</option>
                            <option value="Pending">Pending</option>
                            <option value="Overdue">Overdue</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Invoice ID</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Issue Date</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Due Date</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {filteredInvoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">{invoice.id}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{invoice.client}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-600 dark:text-gray-400">{invoice.project}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{invoice.amount}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-600 dark:text-gray-400">{invoice.date}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-600 dark:text-gray-400">{invoice.dueDate}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)} dark:bg-opacity-20`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex gap-2">
                                            <button className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors">
                                                <EyeIcon className="w-4 h-4" />
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

export default Invoices;
