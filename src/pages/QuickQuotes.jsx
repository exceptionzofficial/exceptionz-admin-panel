import React from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const QuickQuotes = () => {
    const quotes = [
        { id: 1, name: 'Alex Turner', email: 'alex@example.com', company: 'TechStart', projectType: 'Web Development', budget: '$10k - $25k', timeline: '3 months', description: 'Need a modern e-commerce platform', date: '2 hours ago', status: 'Pending' },
        { id: 2, name: 'Maria Garcia', email: 'maria@business.com', company: 'BusinessPro', projectType: 'Mobile App', budget: '$25k - $50k', timeline: '4 months', description: 'iOS and Android banking app', date: '5 hours ago', status: 'Reviewed' },
        { id: 3, name: 'James Wilson', email: 'james@corp.com', company: 'CorpTech', projectType: 'Cloud Solutions', budget: '$50k+', timeline: '6 months', description: 'Migration to AWS cloud infrastructure', date: '1 day ago', status: 'Pending' },
        { id: 4, name: 'Sophie Chen', email: 'sophie@ai.com', company: 'AI Innovations', projectType: 'AI/ML', budget: '$25k - $50k', timeline: '5 months', description: 'Machine learning dashboard', date: '2 days ago', status: 'Responded' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Reviewed': return 'bg-blue-100 text-blue-700';
            case 'Responded': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Quick Quotes</h1>
                <p className="text-sm text-gray-500 mt-1">Review and respond to quote requests</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 mb-2">Total Requests</p>
                    <p className="text-2xl font-bold text-gray-900">87</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 mb-2">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">24</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 mb-2">In Review</p>
                    <p className="text-2xl font-bold text-blue-600">18</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 mb-2">Converted</p>
                    <p className="text-2xl font-bold text-green-600">45</p>
                </div>
            </div>

            {/* Quotes List */}
            <div className="space-y-4">
                {quotes.map((quote) => (
                    <div key={quote.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-bold text-gray-900">{quote.name}</h3>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(quote.status)}`}>
                                        {quote.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">{quote.email} • {quote.company}</p>
                            </div>
                            <span className="text-xs text-gray-400">{quote.date}</span>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Project Type</p>
                                <p className="font-medium text-gray-900">{quote.projectType}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Budget</p>
                                <p className="font-medium text-gray-900">{quote.budget}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Timeline</p>
                                <p className="font-medium text-gray-900">{quote.timeline}</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-2">Description</p>
                            <p className="text-sm text-gray-700">{quote.description}</p>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-gray-100">
                            <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center justify-center gap-2">
                                <CheckIcon className="w-4 h-4" />
                                Send Quote
                            </button>
                            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                                View Details
                            </button>
                            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2">
                                <XMarkIcon className="w-4 h-4" />
                                Decline
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuickQuotes;
