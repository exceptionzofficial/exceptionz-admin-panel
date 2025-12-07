import React, { useState, useEffect } from 'react';
import {
    PlusIcon,
    EyeIcon,
    PencilIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import ClientAutocomplete from '../components/ClientAutocomplete';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        clientId: '',
        clientName: '',
        email: '',
        phone: '',
        projectName: '',
        projectValue: '',
        amountPaid: '',
        initialPaymentDate: '',
        secondDueDate: '',
        location: '',
        description: '',
        status: 'Planning',
        thumbnail: ''
    });
    const [modules, setModules] = useState([]);
    const [newModule, setNewModule] = useState({ name: '', description: '', status: 'Planning', progress: 0 });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await api.get('/admin/projects');
            setProjects(res.data.projects || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClientSelect = (client) => {
        setFormData({
            ...formData,
            clientId: client.id,
            clientName: client.name,
            email: client.email,
            phone: client.phone || ''
        });
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddModule = () => {
        if (newModule.name.trim()) {
            setModules([...modules, { ...newModule, id: Date.now().toString() }]);
            setNewModule({ name: '', description: '', status: 'Planning', progress: 0 });
        }
    };

    const handleRemoveModule = (id) => {
        setModules(modules.filter(m => m.id !== id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const projectData = {
                ...formData,
                modules: modules.map(m => ({ ...m, startDate: new Date().toISOString(), endDate: '' }))
            };
            await api.post('/admin/projects', projectData);
            setShowModal(false);
            resetForm();
            fetchProjects();
        } catch (error) {
            console.error('Error creating project:', error);
            alert('Failed to create project');
        }
    };

    const resetForm = () => {
        setFormData({
            clientId: '',
            clientName: '',
            email: '',
            phone: '',
            projectName: '',
            projectValue: '',
            amountPaid: '',
            initialPaymentDate: '',
            secondDueDate: '',
            location: '',
            description: '',
            status: 'Planning',
            thumbnail: ''
        });
        setModules([]);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-700';
            case 'In Progress': return 'bg-blue-100 text-blue-700';
            case 'On Hold': return 'bg-red-100 text-red-700';
            case 'Planning': return 'bg-purple-100 text-purple-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage all client projects</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2"
                >
                    <PlusIcon className="w-5 h-5" />
                    New Project
                </button>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
                        {project.thumbnail && (
                            <img src={project.thumbnail} alt={project.projectName} className="w-full h-48 object-cover" />
                        )}
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 mb-1">{project.projectName}</h3>
                                    <p className="text-sm text-gray-500">{project.clientName}</p>
                                    {project.location && <p className="text-xs text-gray-400">{project.location}</p>}
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(project.status)}`}>
                                    {project.status}
                                </span>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Progress</span>
                                    <span className="font-semibold text-gray-900">{project.progress || 0}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div
                                        className="bg-indigo-600 h-2 rounded-full transition-all"
                                        style={{ width: `${project.progress || 0}%` }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                <div>
                                    <p className="text-gray-500 mb-1">Budget</p>
                                    <p className="font-semibold text-gray-900">${project.projectValue?.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 mb-1">Due Date</p>
                                    <p className="font-semibold text-gray-900">{new Date(project.secondDueDate).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="text-sm text-gray-500">
                                    {project.modules?.length || 0} modules
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate(`/projects/${project.id}`)}
                                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                    >
                                        <EyeIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {projects.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No projects yet. Create your first project!</p>
                </div>
            )}

            {/* Add Project Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Create New Project</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Client Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <ClientAutocomplete onClientSelect={handleClientSelect} />

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Project Details */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
                                        <input
                                            type="text"
                                            name="projectName"
                                            value={formData.projectName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="Planning">Planning</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="On Hold">On Hold</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Financial Details */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Project Value *</label>
                                        <input
                                            type="number"
                                            name="projectValue"
                                            value={formData.projectValue}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid</label>
                                        <input
                                            type="number"
                                            name="amountPaid"
                                            value={formData.amountPaid}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Initial Payment Date *</label>
                                        <input
                                            type="date"
                                            name="initialPaymentDate"
                                            value={formData.initialPaymentDate}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">2nd Due Date *</label>
                                        <input
                                            type="date"
                                            name="secondDueDate"
                                            value={formData.secondDueDate}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Modules */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Modules</h3>
                                <div className="space-y-3 mb-4">
                                    {modules.map((module) => (
                                        <div key={module.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{module.name}</p>
                                                {module.description && <p className="text-sm text-gray-500">{module.description}</p>}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveModule(module.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <XMarkIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="border border-dashed border-gray-300 rounded-lg p-4">
                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                        <input
                                            type="text"
                                            placeholder="Module name"
                                            value={newModule.name}
                                            onChange={(e) => setNewModule({ ...newModule, name: e.target.value })}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Description (optional)"
                                            value={newModule.description}
                                            onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleAddModule}
                                        className="w-full px-3 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium"
                                    >
                                        + Add Module
                                    </button>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                                >
                                    Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Projects;
