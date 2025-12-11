import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeftIcon,
    PencilIcon,
    CheckCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import api from '../services/api';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('timeline');
    const [editingModule, setEditingModule] = useState(null);
    const [moduleForm, setModuleForm] = useState({ status: '', progress: 0, description: '' });

    useEffect(() => {
        fetchProject();
    }, [id]);

    const fetchProject = async () => {
        try {
            const res = await api.get(`/admin/projects/${id}`);
            setProject(res.data.project);
        } catch (error) {
            console.error('Error fetching project:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditModule = (module) => {
        setEditingModule(module);
        setModuleForm({
            status: module.status,
            progress: module.progress || 0,
            description: module.description || ''
        });
    };

    const handleUpdateModule = async () => {
        try {
            await api.put(`/admin/projects/${id}/modules/${editingModule.id}`, moduleForm);
            setEditingModule(null);
            fetchProject();
        } catch (error) {
            console.error('Error updating module:', error);
            alert('Failed to update module');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-700 border-green-300';
            case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-300';
            case 'On Hold': return 'bg-red-100 text-red-700 border-red-300';
            case 'Planning': return 'bg-purple-100 text-purple-700 border-purple-300';
            default: return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };

    const getStatusIcon = (status) => {
        if (status === 'Completed') {
            return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
        }
        return <div className="w-6 h-6 rounded-full border-4 border-gray-300 bg-white" />;
    };

    if (loading) return <div className="flex items-center justify-center h-screen text-gray-500 dark:text-gray-400">Loading...</div>;
    if (!project) return <div className="flex items-center justify-center h-screen text-gray-500 dark:text-gray-400">Project not found</div>;

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <button
                onClick={() => navigate('/projects')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
                <ArrowLeftIcon className="w-5 h-5" />
                Back to Projects
            </button>

            {/* Project Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex gap-4">
                        {project.thumbnail && (
                            <img src={project.thumbnail} alt={project.projectName} className="w-32 h-24 object-cover rounded-lg" />
                        )}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{project.projectName}</h1>
                            <p className="text-gray-600 dark:text-gray-300">{project.location}</p>
                        </div>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors">
                        <PencilIcon className="w-4 h-4" />
                        Edit Project
                    </button>
                </div>

                <div className="grid grid-cols-4 gap-6">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">CLIENT</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{project.clientName}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">DEADLINE</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{new Date(project.secondDueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">BUDGET</p>
                        <p className="font-semibold text-gray-900 dark:text-white">${project.projectValue?.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">PROGRESS</p>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full ${project.progress >= 75 ? 'bg-green-500' : 'bg-indigo-600'}`}
                                    style={{ width: `${project.progress || 0}%` }}
                                />
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-white">{project.progress || 0}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <div className="flex gap-8 px-6">
                        {['Timeline', 'Overview', 'Financials'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab.toLowerCase())}
                                className={`py-4 border-b-2 font-medium transition-colors ${activeTab === tab.toLowerCase()
                                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    {activeTab === 'timeline' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Module Timeline</h3>

                            {project.modules && project.modules.length > 0 ? (
                                <div className="relative">
                                    {/* Vertical Line */}
                                    <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

                                    <div className="space-y-8">
                                        {project.modules.map((module, index) => (
                                            <div key={module.id} className="relative flex gap-6">
                                                {/* Timeline Dot */}
                                                <div className="relative z-10 flex-shrink-0">
                                                    {getStatusIcon(module.status)}
                                                </div>

                                                {/* Module Card */}
                                                <div className="flex-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600 transition-colors">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{module.name}</h4>
                                                            {module.description && (
                                                                <p className="text-sm text-gray-600 dark:text-gray-300">{module.description}</p>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-xs px-3 py-1 rounded-full font-medium border ${getStatusColor(module.status)} dark:bg-opacity-20`}>
                                                                {module.status}
                                                            </span>
                                                            <button
                                                                onClick={() => handleEditModule(module)}
                                                                className="p-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded transition-colors"
                                                            >
                                                                <PencilIcon className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-4 text-sm">
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="text-gray-500 dark:text-gray-400">Progress</span>
                                                                <span className="font-semibold text-gray-900 dark:text-white">{module.progress || 0}%</span>
                                                            </div>
                                                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                                                                <div
                                                                    className="bg-indigo-600 h-1.5 rounded-full"
                                                                    style={{ width: `${module.progress || 0}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                        {module.startDate && (
                                                            <span className="text-gray-400 dark:text-gray-500">
                                                                {new Date(module.startDate).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No modules added yet</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'overview' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Project Overview</h3>
                            <div className="prose max-w-none text-gray-600 dark:text-gray-300">
                                <p>{project.description || 'No description available'}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Client Email</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{project.email}</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Client Phone</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{project.phone}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'financials' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Financial Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Project Value</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">${project.projectValue?.toLocaleString()}</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Amount Paid</p>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">${project.amountPaid?.toLocaleString()}</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Initial Payment Date</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{new Date(project.initialPaymentDate).toLocaleDateString()}</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Next Due Date</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{new Date(project.secondDueDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Module Modal */}
            {editingModule && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-all">
                    <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Update Module Status</h3>
                            <button onClick={() => setEditingModule(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Module Name</label>
                                <p className="font-semibold text-gray-900 dark:text-white">{editingModule.name}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                                <select
                                    value={moduleForm.status}
                                    onChange={(e) => setModuleForm({ ...moduleForm, status: e.target.value })}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-colors"
                                >
                                    <option value="Planning">Planning</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                    <option value="On Hold">On Hold</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Progress: {moduleForm.progress}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={moduleForm.progress}
                                    onChange={(e) => setModuleForm({ ...moduleForm, progress: parseInt(e.target.value) })}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                                <textarea
                                    value={moduleForm.description}
                                    onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                                    rows="3"
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setEditingModule(null)}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateModule}
                                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                            >
                                Update Module
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetail;
