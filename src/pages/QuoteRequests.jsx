import React, { useState, useEffect } from 'react';
import {
    DocumentTextIcon,
    UserIcon,
    PhoneIcon,
    EnvelopeIcon,
    CurrencyRupeeIcon,
    EyeIcon,
    TrashIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import api from '../services/api';

const QuoteRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await api.get('/admin/quote-requests');
            if (response.data.success) {
                setRequests(response.data.requests);
            }
        } catch (error) {
            console.error('Error fetching quote requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.put(`/admin/quote-requests/${id}`, { status });
            fetchRequests();
            if (selectedRequest?.id === id) {
                setSelectedRequest(prev => ({ ...prev, status }));
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this quote request?')) return;
        try {
            await api.delete(`/admin/quote-requests/${id}`);
            fetchRequests();
            setShowModal(false);
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-500/20 text-yellow-400';
            case 'Reviewed': return 'bg-blue-500/20 text-blue-400';
            case 'Accepted': return 'bg-green-500/20 text-green-400';
            case 'Rejected': return 'bg-red-500/20 text-red-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const filteredRequests = requests.filter(req =>
        req.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.clientEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.projectType?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Quote Requests</h1>
                    <p className="text-gray-400 mt-1">View and manage client quote requests</p>
                </div>
                <div className="relative">
                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search requests..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white w-64 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4">
                    <p className="text-gray-400 text-sm">Total Requests</p>
                    <p className="text-2xl font-bold text-white">{requests.length}</p>
                </div>
                <div className="bg-yellow-500/10 backdrop-blur-sm rounded-xl border border-yellow-500/30 p-4">
                    <p className="text-yellow-400 text-sm">Pending</p>
                    <p className="text-2xl font-bold text-yellow-400">
                        {requests.filter(r => r.status === 'Pending').length}
                    </p>
                </div>
                <div className="bg-green-500/10 backdrop-blur-sm rounded-xl border border-green-500/30 p-4">
                    <p className="text-green-400 text-sm">Accepted</p>
                    <p className="text-2xl font-bold text-green-400">
                        {requests.filter(r => r.status === 'Accepted').length}
                    </p>
                </div>
                <div className="bg-purple-500/10 backdrop-blur-sm rounded-xl border border-purple-500/30 p-4">
                    <p className="text-purple-400 text-sm">Total Value</p>
                    <p className="text-2xl font-bold text-purple-400">
                        {formatPrice(requests.reduce((sum, r) => sum + (r.calculatedQuote?.totalPrice || 0), 0))}
                    </p>
                </div>
            </div>

            {/* Requests Table */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-800/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Client</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Project Type</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Options</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Quote</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Date</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {filteredRequests.map((request) => (
                            <tr key={request.id} className="hover:bg-gray-700/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="text-white font-medium">{request.clientName}</p>
                                        <p className="text-gray-400 text-sm">{request.clientEmail}</p>
                                        {request.clientPhone && (
                                            <p className="text-gray-500 text-xs">{request.clientPhone}</p>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                                        {request.projectType}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-300 space-y-1">
                                        {request.platform && <p>Platform: {request.platform}</p>}
                                        {request.webType && <p>Type: {request.webType}</p>}
                                        {request.paymentGateway && <p>Payment: {request.paymentGateway}</p>}
                                        {request.seo && <p>SEO: {request.seo}</p>}
                                        {request.businessType && <p>{request.businessType}</p>}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-green-400 font-bold">
                                        {formatPrice(request.calculatedQuote?.totalPrice || 0)}
                                    </p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(request.status)}`}>
                                        {request.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-400 text-sm">
                                    {new Date(request.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setSelectedRequest(request); setShowModal(true); }}
                                            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 transition-colors"
                                        >
                                            <EyeIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(request.id)}
                                            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredRequests.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        No quote requests found
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {showModal && selectedRequest && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-xl font-bold text-white">Quote Request Details</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {/* Client Info */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-purple-400">Client Information</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <UserIcon className="w-4 h-4 text-gray-500" />
                                        {selectedRequest.clientName}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <EnvelopeIcon className="w-4 h-4 text-gray-500" />
                                        {selectedRequest.clientEmail}
                                    </div>
                                    {selectedRequest.clientPhone && (
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <PhoneIcon className="w-4 h-4 text-gray-500" />
                                            {selectedRequest.clientPhone}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Project Info */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-purple-400">Project Details</h3>
                                <div className="space-y-2 text-gray-300">
                                    <p><strong>Type:</strong> {selectedRequest.projectType}</p>
                                    {selectedRequest.platform && <p><strong>Platform:</strong> {selectedRequest.platform}</p>}
                                    {selectedRequest.webType && <p><strong>Website:</strong> {selectedRequest.webType}</p>}
                                    {selectedRequest.paymentGateway && <p><strong>Payment Gateway:</strong> {selectedRequest.paymentGateway}</p>}
                                    {selectedRequest.seo && <p><strong>SEO:</strong> {selectedRequest.seo}</p>}
                                    {selectedRequest.businessType && <p><strong>Business Type:</strong> {selectedRequest.businessType}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        {selectedRequest.description && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-purple-400 mb-2">Project Description</h3>
                                <p className="text-gray-300 bg-gray-700/50 rounded-lg p-4">
                                    {selectedRequest.description}
                                </p>
                            </div>
                        )}

                        {/* Quote Breakdown */}
                        {selectedRequest.calculatedQuote && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-purple-400 mb-2">Quote Breakdown</h3>
                                <div className="bg-gray-700/50 rounded-lg p-4 space-y-2">
                                    {selectedRequest.calculatedQuote.breakdown?.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-gray-300">
                                            <span>{item.item}</span>
                                            <span>{formatPrice(item.price)}</span>
                                        </div>
                                    ))}
                                    <div className="border-t border-gray-600 pt-2 mt-2 flex justify-between font-bold text-white">
                                        <span>Total</span>
                                        <span className="text-green-400">{formatPrice(selectedRequest.calculatedQuote.totalPrice)}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Status Update */}
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-purple-400 mb-2">Update Status</h3>
                            <div className="flex gap-2">
                                {['Pending', 'Reviewed', 'Accepted', 'Rejected'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusUpdate(selectedRequest.id, status)}
                                        className={`px-4 py-2 rounded-lg transition-colors ${selectedRequest.status === status
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuoteRequests;
