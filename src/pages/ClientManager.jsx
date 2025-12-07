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

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Client Manager</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* User List */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-[calc(100vh-150px)] overflow-y-auto">
                    <h3 className="font-bold mb-4">Select Client</h3>
                    <div className="space-y-2">
                        {users.map(user => (
                            <div
                                key={user.id}
                                onClick={() => setSelectedUser(user)}
                                className={`p-3 rounded-lg cursor-pointer border ${selectedUser?.id === user.id ? 'bg-indigo-50 border-indigo-500' : 'hover:bg-gray-50 border-gray-200'}`}
                            >
                                <p className="font-medium">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="md:col-span-2 space-y-6">
                    {selectedUser ? (
                        <>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="font-bold mb-4 text-lg">Manage: {selectedUser.name}</h3>

                                {/* Add/Update Project */}
                                <div className="mb-8">
                                    <h4 className="text-sm font-bold uppercase text-gray-500 mb-3">Update Project Progress</h4>
                                    <form onSubmit={handleUpdateProject} className="grid grid-cols-2 gap-4">
                                        <input
                                            placeholder="Project Name"
                                            className="border p-2 rounded"
                                            value={projectForm.name}
                                            onChange={e => setProjectForm({ ...projectForm, name: e.target.value })}
                                            required
                                        />
                                        <select
                                            className="border p-2 rounded"
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
                                            className="border p-2 rounded"
                                            value={projectForm.progress}
                                            onChange={e => setProjectForm({ ...projectForm, progress: e.target.value })}
                                            required
                                        />
                                        <input
                                            placeholder="Due Date (e.g. Dec 20, 2024)"
                                            className="border p-2 rounded"
                                            value={projectForm.dueDate}
                                            onChange={e => setProjectForm({ ...projectForm, dueDate: e.target.value })}
                                            required
                                        />
                                        <button type="submit" className="col-span-2 bg-indigo-600 text-white py-2 rounded">
                                            Update Project
                                        </button>
                                    </form>
                                </div>

                                {/* Upload Invoice */}
                                <div>
                                    <h4 className="text-sm font-bold uppercase text-gray-500 mb-3">Upload Invoice</h4>
                                    <form onSubmit={handleUploadInvoice} className="grid grid-cols-2 gap-4">
                                        <input
                                            placeholder="Amount (e.g. $5,000)"
                                            className="border p-2 rounded"
                                            value={invoiceData.amount}
                                            onChange={e => setInvoiceData({ ...invoiceData, amount: e.target.value })}
                                            required
                                        />
                                        <select
                                            className="border p-2 rounded"
                                            value={invoiceData.status}
                                            onChange={e => setInvoiceData({ ...invoiceData, status: e.target.value })}
                                        >
                                            <option>Pending</option>
                                            <option>Paid</option>
                                            <option>Overdue</option>
                                        </select>
                                        <input
                                            placeholder="Due Date"
                                            className="border p-2 rounded"
                                            value={invoiceData.dueDate}
                                            onChange={e => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
                                            required
                                        />
                                        <input
                                            placeholder="Project Name"
                                            className="border p-2 rounded"
                                            value={invoiceData.project}
                                            onChange={e => setInvoiceData({ ...invoiceData, project: e.target.value })}
                                            required
                                        />
                                        <div className="col-span-2">
                                            <input
                                                type="file"
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                                onChange={e => setInvoiceFile(e.target.files[0])}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="col-span-2 bg-green-600 text-white py-2 rounded">
                                            Upload Invoice
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            Select a client to manage
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientManager;
