import React, { useState, useEffect } from 'react';
import {
    MagnifyingGlassIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import api from '../services/api';

const SupportTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        fetchTickets();
    }, []);

    useEffect(() => {
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            const filtered = tickets.filter(ticket =>
                ticket.name?.toLowerCase().includes(query) ||
                ticket.email?.toLowerCase().includes(query) ||
                ticket.subject?.toLowerCase().includes(query)
            );
            setFilteredTickets(filtered);
        } else {
            setFilteredTickets(tickets);
        }
    }, [searchQuery, tickets]);

    const fetchTickets = async () => {
        try {
            const res = await api.get('/admin/tickets');
            if (res.data.success) {
                setTickets(res.data.tickets || []);
                setFilteredTickets(res.data.tickets || []);
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async () => {
        try {
            await api.put(`/admin/tickets/${selectedTicket.id}`, { status: newStatus });
            await fetchTickets();
            setShowStatusModal(false);
            setSelectedTicket(null);
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this ticket?')) return;

        try {
            await api.delete(`/admin/tickets/${id}`);
            setTickets(tickets.filter(t => t.id !== id));
        } catch (error) {
            console.error('Error deleting ticket:', error);
            alert('Failed to delete ticket');
        }
    };

    const openStatusModal = (ticket) => {
        setSelectedTicket(ticket);
        setNewStatus(ticket.status);
        setShowStatusModal(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-yellow-100 text-yellow-700';
            case 'In Progress': return 'bg-blue-100 text-blue-700';
            case 'Resolved': return 'bg-green-100 text-green-700';
            case 'Closed': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Urgent': return 'bg-red-100 text-red-700 border-red-200';
            case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Low': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const stats = [
        { label: 'Total Tickets', value: tickets.length, color: 'bg-blue-500' },
        { label: 'Active', value: tickets.filter(t => t.status === 'Active').length, color: 'bg-yellow-500' },
        { label: 'In Progress', value: tickets.filter(t => t.status === 'In Progress').length, color: 'bg-blue-500' },
        { label: 'Resolved', value: tickets.filter(t => t.status === 'Resolved').length, color: 'bg-green-500' },
    ];

    if (loading) return <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading...</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Support Tickets</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage customer support requests</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                            </div>
                            <div className={`w-12 h-12 rounded-full ${stat.color} opacity-10 dark:opacity-20`}></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                <div className="relative">
                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search tickets by name, email, or subject..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-colors"
                    />
                </div>
            </div>

            {/* Tickets List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700 transition-colors">
                {filteredTickets.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                        {searchQuery ? 'No tickets found' : 'No support tickets yet'}
                    </div>
                ) : (
                    filteredTickets.map((ticket) => (
                        <div key={ticket.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-bold text-gray-900 dark:text-white">{ticket.subject}</h3>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(ticket.status)} dark:bg-opacity-20`}>
                                            {ticket.status}
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded border font-medium ${getPriorityColor(ticket.priority)} dark:bg-opacity-10`}>
                                            {ticket.priority}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{ticket.description}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-medium">{ticket.name}</span>
                                        <span>{ticket.email}</span>
                                        {ticket.phone && <span>{ticket.phone}</span>}
                                    </div>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                        Created: {new Date(ticket.createdAt).toLocaleDateString()} at {new Date(ticket.createdAt).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => openStatusModal(ticket)}
                                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                                >
                                    Update Status
                                </button>
                                <button
                                    onClick={() => handleDelete(ticket.id)}
                                    className="px-3 py-1.5 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Status Update Modal */}
            {showStatusModal && selectedTicket && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-all">
                    <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Update Ticket Status</h3>
                            <button onClick={() => setShowStatusModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="mb-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ticket</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{selectedTicket.subject}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">From: {selectedTicket.name}</p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-colors"
                            >
                                <option value="Active">Active</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateStatus}
                                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupportTickets;
