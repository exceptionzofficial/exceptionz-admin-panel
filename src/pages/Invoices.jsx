import React, { useState, useEffect } from 'react';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    PlusIcon,
    ArrowDownTrayIcon,
    EyeIcon
} from '@heroicons/react/24/outline';
import InvoiceUploadModal from '../components/InvoiceUploadModal';
import api from '../services/api';

const Invoices = () => {
    const [filter, setFilter] = useState('all');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch invoices on mount
    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/invoices');
            if (response.data.success) {
                setInvoices(response.data.invoices);
            }
        } catch (error) {
            console.error('Failed to fetch invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        { label: 'Total Invoices', value: invoices.length.toString(), color: 'text-green-600' },
        {
            label: 'This Month', value: invoices.filter(inv => {
                const invDate = new Date(inv.uploadedAt);
                const now = new Date();
                return invDate.getMonth() === now.getMonth() && invDate.getFullYear() === now.getFullYear();
            }).length.toString(), color: 'text-blue-600'
        },
        {
            label: 'This Week', value: invoices.filter(inv => {
                const invDate = new Date(inv.uploadedAt);
                const now = new Date();
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return invDate >= weekAgo;
            }).length.toString(), color: 'text-orange-600'
        },
        {
            label: 'Today', value: invoices.filter(inv => {
                const invDate = new Date(inv.uploadedAt);
                const now = new Date();
                return invDate.toDateString() === now.toDateString();
            }).length.toString(), color: 'text-indigo-600'
        },
    ];

    const handleSaveInvoice = async (invoiceData) => {
        try {
            const formData = new FormData();
            formData.append('file', invoiceData.file);
            formData.append('userId', invoiceData.clientId);
            formData.append('fileName', invoiceData.file.name);

            const response = await api.post('/admin/invoice-upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                setIsUploadModalOpen(false);
                alert('Invoice uploaded successfully to S3 and saved to database!');
                // Refresh invoice list
                await fetchInvoices();
            }
        } catch (error) {
            console.error('Invoice upload error:', error);
            alert('Failed to upload invoice: ' + (error.response?.data?.message || error.message));
        }
    };

    const filteredInvoices = invoices;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoices</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and track all invoices</p>
                </div>
                <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2 transition-colors"
                >
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

            {/* Invoices Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto"></div>
                            <p className="text-gray-500 dark:text-gray-400 mt-4">Loading invoices...</p>
                        </div>
                    ) : invoices.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-gray-500 dark:text-gray-400">No invoices found. Upload your first invoice to get started!</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Invoice ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sent To</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">File Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Uploaded</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {filteredInvoices.map((invoice, index) => (
                                    <tr key={invoice.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                                                {invoice.id?.substring(0, 8) || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {invoice.clientName || 'Unknown'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {invoice.fileName || 'invoice.pdf'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {invoice.clientEmail || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {invoice.clientPhone || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {new Date(invoice.uploadedAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                <a
                                                    href={invoice.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                                                    title="View Invoice"
                                                >
                                                    <EyeIcon className="w-4 h-4" />
                                                </a>
                                                <a
                                                    href={invoice.url}
                                                    download={invoice.fileName}
                                                    className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                                                    title="Download Invoice"
                                                >
                                                    <ArrowDownTrayIcon className="w-4 h-4" />
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Invoice Upload Modal */}
            <InvoiceUploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onSave={handleSaveInvoice}
            />
        </div>
    );
};

export default Invoices;
