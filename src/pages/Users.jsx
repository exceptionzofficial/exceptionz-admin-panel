import React, { useState, useEffect } from 'react';
import {
    MagnifyingGlassIcon,
    ShieldExclamationIcon,
    ShieldCheckIcon,
    TrashIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import api from '../services/api';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            const filtered = users.filter(user =>
                user.name?.toLowerCase().includes(query) ||
                user.email?.toLowerCase().includes(query) ||
                user.phone?.includes(query)
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    }, [searchQuery, users]);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            if (res.data.success) {
                setUsers(res.data.users || []);
                setFilteredUsers(res.data.users || []);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBlockToggle = async (user) => {
        try {
            const newBlockedStatus = !user.blocked;
            await api.put(`/admin/users/${user.id}/block`, { blocked: newBlockedStatus });

            // Update local state
            const updatedUsers = users.map(u =>
                u.id === user.id ? { ...u, blocked: newBlockedStatus } : u
            );
            setUsers(updatedUsers);
        } catch (error) {
            console.error('Error blocking/unblocking user:', error);
            alert('Failed to update user status');
        }
    };

    const confirmDelete = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/admin/users/${selectedUser.id}`);
            setUsers(users.filter(u => u.id !== selectedUser.id));
            setShowDeleteModal(false);
            setSelectedUser(null);
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
    };

    const stats = [
        {
            label: 'Total Users',
            value: users.length,
            color: 'bg-blue-500'
        },
        {
            label: 'Active',
            value: users.filter(u => !u.blocked).length,
            color: 'bg-green-500'
        },
        {
            label: 'Blocked',
            value: users.filter(u => u.blocked).length,
            color: 'bg-red-500'
        },
        {
            label: 'New This Month',
            value: users.filter(u => {
                const userDate = new Date(u.createdAt);
                const now = new Date();
                return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
            }).length,
            color: 'bg-purple-500'
        },
    ];

    if (loading) return <div className="flex items-center justify-center h-screen dark:text-white">Loading...</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage client accounts and users</p>
                </div>
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
                        placeholder="Search users by name, email, or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-colors"
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-semibold">
                                                    {user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name || 'Unknown'}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-white">{user.phone || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${user.blocked
                                                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                }`}>
                                                {user.blocked ? 'Blocked' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleBlockToggle(user)}
                                                    className={`p-2 rounded-lg transition-colors ${user.blocked
                                                        ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                                                        : 'text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                                                        }`}
                                                    title={user.blocked ? 'Unblock user' : 'Block user'}
                                                >
                                                    {user.blocked ? (
                                                        <ShieldCheckIcon className="w-5 h-5" />
                                                    ) : (
                                                        <ShieldExclamationIcon className="w-5 h-5" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(user)}
                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Delete user"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-all">
                    <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Confirm Delete</h3>
                            <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800 mb-4">
                                <TrashIcon className="w-8 h-8 text-red-600 dark:text-red-400 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-red-900 dark:text-red-200">This action cannot be undone</p>
                                    <p className="text-sm text-red-700 dark:text-red-300">All user data will be permanently deleted</p>
                                </div>
                            </div>

                            <p className="text-gray-700 dark:text-gray-300">
                                Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">{selectedUser.name}</span>?
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Email: {selectedUser.email}</p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                            >
                                Delete User
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
