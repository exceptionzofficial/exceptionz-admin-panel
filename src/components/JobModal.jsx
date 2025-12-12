import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon, BriefcaseIcon, MapPinIcon, BuildingOfficeIcon, ClockIcon } from '@heroicons/react/24/outline';

const JobModal = ({ isOpen, onClose, onSave, job = null }) => {
    const [formData, setFormData] = useState({
        title: '',
        department: '',
        location: '',
        type: 'Full-time',
        status: 'Active',
        description: '',
        requirements: [''],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (job) {
            setFormData({
                title: job.title || '',
                department: job.department || '',
                location: job.location || '',
                type: job.type || 'Full-time',
                status: job.status || 'Active',
                description: job.description || '',
                requirements: job.requirements?.length ? job.requirements : [''],
            });
        } else {
            setFormData({
                title: '',
                department: '',
                location: '',
                type: 'Full-time',
                status: 'Active',
                description: '',
                requirements: [''],
            });
        }
    }, [job, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRequirementChange = (index, value) => {
        const newRequirements = [...formData.requirements];
        newRequirements[index] = value;
        setFormData(prev => ({ ...prev, requirements: newRequirements }));
    };

    const addRequirement = () => {
        setFormData(prev => ({ ...prev, requirements: [...prev.requirements, ''] }));
    };

    const removeRequirement = (index) => {
        if (formData.requirements.length > 1) {
            const newRequirements = formData.requirements.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, requirements: newRequirements }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Filter out empty requirements
            const cleanedData = {
                ...formData,
                requirements: formData.requirements.filter(r => r.trim() !== '')
            };
            await onSave(cleanedData);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700 border-green-200';
            case 'Draft': return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'Closed': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="flex min-h-full items-center justify-center p-4">
                {/* Modal Content */}
                <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200">
                    {/* Header with gradient */}
                    <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-6 py-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur">
                                    <BriefcaseIcon className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">
                                        {job ? 'Edit Job Opening' : 'Create New Job Opening'}
                                    </h3>
                                    <p className="text-sm text-indigo-100">
                                        {job ? 'Update job details below' : 'Fill in the details to post a new job'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-lg p-2 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Form Body */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {/* Job Title & Department Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <BriefcaseIcon className="h-4 w-4 text-indigo-500" />
                                    Job Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                                    placeholder="e.g. Senior React Developer"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <BuildingOfficeIcon className="h-4 w-4 text-indigo-500" />
                                    Department *
                                </label>
                                <input
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                                    placeholder="e.g. Engineering"
                                />
                            </div>
                        </div>

                        {/* Location, Type, Status Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <MapPinIcon className="h-4 w-4 text-indigo-500" />
                                    Location *
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                                    placeholder="Remote / New York"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <ClockIcon className="h-4 w-4 text-indigo-500" />
                                    Employment Type
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white transition-all appearance-none cursor-pointer"
                                >
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Internship">Internship</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none cursor-pointer font-medium ${getStatusBadgeColor(formData.status)}`}
                                >
                                    <option value="Active">🟢 Active</option>
                                    <option value="Draft">⚪ Draft</option>
                                    <option value="Closed">🔴 Closed</option>
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Job Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                required
                                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 transition-all resize-none"
                                placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                            />
                        </div>

                        {/* Requirements */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Requirements & Skills
                                </label>
                                <span className="text-xs text-gray-400">
                                    {formData.requirements.filter(r => r.trim()).length} added
                                </span>
                            </div>
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                {formData.requirements.map((req, index) => (
                                    <div key={index} className="flex gap-2 group">
                                        <div className="flex items-center justify-center w-6 h-10 text-xs text-gray-400 font-medium">
                                            {index + 1}.
                                        </div>
                                        <input
                                            type="text"
                                            value={req}
                                            onChange={(e) => handleRequirementChange(index, e.target.value)}
                                            className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                                            placeholder="e.g. 3+ years of React experience"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeRequirement(index)}
                                            className={`p-2.5 rounded-xl transition-all ${formData.requirements.length > 1
                                                    ? 'text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                                                    : 'text-gray-300 cursor-not-allowed'
                                                }`}
                                            disabled={formData.requirements.length <= 1}
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={addRequirement}
                                className="flex items-center gap-1.5 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium py-2 px-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                            >
                                <PlusIcon className="h-4 w-4" />
                                Add Another Requirement
                            </button>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        {job ? 'Update Job' : 'Create Job'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default JobModal;

