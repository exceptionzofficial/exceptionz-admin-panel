import React, { useEffect, useState } from 'react';
import api from '../services/api';

const ClientManager = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Forms state
    const [projectForm, setProjectForm] = useState({ name: '', status: 'In Progress', progress: 0, dueDate: '' });
    const [invoiceFile, setInvoiceFile] = useState(null);
    const [invoiceData, setInvoiceData] = useState({ amount: '', status: 'Pending', dueDate: '', project: '' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data.users);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProject = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/project', {
                userId: selectedUser.id,
                project: { ...projectForm, id: Date.now().toString() } // Simple ID generation
            });
            alert('Project updated!');
            setProjectForm({ name: '', status: 'In Progress', progress: 0, dueDate: '' });
        } catch (error) {
            alert('Error updating project');
        }
    };

    const handleUploadInvoice = async (e) => {
        e.preventDefault();
        if (!invoiceFile) return alert('Select a file');

        const formData = new FormData();
        formData.append('userId', selectedUser.id);
        formData.append('file', invoiceFile);
        formData.append('invoiceData', JSON.stringify({
            ...invoiceData,
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            id: 'INV-' + Date.now().toString().slice(-4)
        }));

        try {
            await api.post('/admin/invoice', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Invoice uploaded!');
            setInvoiceFile(null);
            setInvoiceData({ amount: '', status: 'Pending', dueDate: '', project: '' });
        } catch (error) {
            alert('Error uploading invoice');
            console.error(error);
        }
    };

    if (loading) return <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading...</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Client Manager</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* User List */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-[calc(100vh-150px)] overflow-y-auto transition-colors">
                    <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Select Client</h3>
                    <div className="space-y-2">
                        {users.map(user => (
                            <div
                                key={user.id}
                                onClick={() => setSelectedUser(user)}
                                className={`p-3 rounded-lg cursor-pointer border transition-colors ${selectedUser?.id === user.id
                                    ? 'bg-indigo-50 dark:bg-indigo-900/50 border-indigo-500 dark:border-indigo-500 text-indigo-700 dark:text-indigo-300'
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200'
                                    }`}
                            >
                                <p className="font-medium">{user.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="md:col-span-2 space-y-6">
                    {selectedUser ? (
                        <>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                                <h3 className="font-bold mb-4 text-lg text-gray-900 dark:text-white">Manage: {selectedUser.name}</h3>

                                {/* Add/Update Project */}
                                <div className="mb-8">
                                    <h4 className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400 mb-3">Update Project Progress</h4>
                                    <form onSubmit={handleUpdateProject} className="grid grid-cols-2 gap-4">
                                        <input
                                            placeholder="Project Name"
                                            className="border dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-colors"
                                            value={projectForm.name}
                                            onChange={e => setProjectForm({ ...projectForm, name: e.target.value })}
                                            required
                                        />
                                        <select
                                            className="border dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-colors"
                                            value={projectForm.status}
                                            onChange={e => setProjectForm({ ...projectForm, status: e.target.value })}
                                        >
                                            <option>In Progress</option>
                                            <option>Completed</option>
                                            <option>On Hold</option>
                                        </select>
                                        <input
                                            type="number"
                                            placeholder="Progress %"
                                            className="border dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-colors"
                                            value={projectForm.progress}
                                            onChange={e => setProjectForm({ ...projectForm, progress: e.target.value })}
                                            required
                                        />
                                        <input
                                            placeholder="Due Date (e.g. Dec 20, 2024)"
                                            className="border dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-colors"
                                            value={projectForm.dueDate}
                                            onChange={e => setProjectForm({ ...projectForm, dueDate: e.target.value })}
                                            required
                                        />
                                        <button type="submit" className="col-span-2 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors">
                                            Update Project
                                        </button>
                                    </form>
                                </div>

                                {/* Upload Invoice */}
                                <div>
                                    <h4 className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400 mb-3">Upload Invoice</h4>
                                    <form onSubmit={handleUploadInvoice} className="grid grid-cols-2 gap-4">
                                        <input
                                            placeholder="Amount (e.g. $5,000)"
                                            className="border dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-colors"
                                            value={invoiceData.amount}
                                            onChange={e => setInvoiceData({ ...invoiceData, amount: e.target.value })}
                                            required
                                        />
                                        <select
                                            className="border dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-colors"
                                            value={invoiceData.status}
                                            onChange={e => setInvoiceData({ ...invoiceData, status: e.target.value })}
                                        >
                                            <option>Pending</option>
                                            <option>Paid</option>
                                            <option>Overdue</option>
                                        </select>
                                        <input
                                            placeholder="Due Date"
                                            className="border dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-colors"
                                            value={invoiceData.dueDate}
                                            onChange={e => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
                                            required
                                        />
                                        <input
                                            placeholder="Project Name"
                                            className="border dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-colors"
                                            value={invoiceData.project}
                                            onChange={e => setInvoiceData({ ...invoiceData, project: e.target.value })}
                                            required
                                        />
                                        <div className="col-span-2">
                                            <input
                                                type="file"
                                                className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 dark:file:bg-indigo-900/50 file:text-indigo-700 dark:file:text-indigo-400 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/70 transition-colors"
                                                onChange={e => setInvoiceFile(e.target.files[0])}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors">
                                            Upload Invoice
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
                            Select a client to manage
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientManager;
