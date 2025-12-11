import React, { useState, useEffect } from 'react';
import {
    CurrencyRupeeIcon,
    CheckIcon,
    ArrowPathIcon,
} from '@heroicons/react/24/outline';
import api from '../services/api';

const QuotePricingSettings = () => {
    const [pricing, setPricing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPricing();
    }, []);

    const fetchPricing = async () => {
        try {
            const response = await api.get('/admin/quote-pricing');
            if (response.data.success) {
                setPricing(response.data.pricing);
            }
        } catch (error) {
            console.error('Error fetching pricing:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePriceChange = (category, key, value) => {
        setPricing(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: parseInt(value) || 0
            }
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await api.put('/admin/quote-pricing', { pricing });
            if (response.data.success) {
                alert('Pricing updated successfully!');
            }
        } catch (error) {
            console.error('Error saving pricing:', error);
            alert('Failed to save pricing');
        } finally {
            setSaving(false);
        }
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
                    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-600">Quote Pricing Settings</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Set prices for different project options</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchPricing}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-white transition-colors"
                    >
                        <ArrowPathIcon className="w-5 h-5" />
                        Refresh
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors disabled:opacity-50"
                    >
                        <CheckIcon className="w-5 h-5" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {pricing && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Base Prices */}
                    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm transition-colors">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <CurrencyRupeeIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            Base Prices (Project Type)
                        </h2>
                        <div className="space-y-4">
                            {Object.entries(pricing.basePrices || {}).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between gap-4">
                                    <label className="text-purple-700 dark:text-purple-200 font-medium flex-1">{key}</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600 dark:text-purple-400 font-bold">₹</span>
                                        <input
                                            type="number"
                                            value={value}
                                            onChange={(e) => handlePriceChange('basePrices', key, e.target.value)}
                                            className="bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg py-2 pl-8 pr-4 text-gray-900 dark:text-white w-40 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Platform Prices */}
                    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm transition-colors">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Platform Add-ons</h2>
                        <div className="space-y-4">
                            {Object.entries(pricing.platform || {}).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between gap-4">
                                    <label className="text-gray-700 dark:text-gray-300 flex-1">{key}</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">₹</span>
                                        <input
                                            type="number"
                                            value={value}
                                            onChange={(e) => handlePriceChange('platform', key, e.target.value)}
                                            className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2 pl-8 pr-4 text-gray-900 dark:text-white w-40 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Gateway */}
                    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm transition-colors">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Gateway</h2>
                        <div className="space-y-4">
                            {Object.entries(pricing.paymentGateway || {}).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between gap-4">
                                    <label className="text-gray-700 dark:text-gray-300 flex-1">{key}</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">₹</span>
                                        <input
                                            type="number"
                                            value={value}
                                            onChange={(e) => handlePriceChange('paymentGateway', key, e.target.value)}
                                            className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2 pl-8 pr-4 text-gray-900 dark:text-white w-40 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Web Type */}
                    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm transition-colors">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Website Type</h2>
                        <div className="space-y-4">
                            {Object.entries(pricing.webType || {}).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between gap-4">
                                    <label className="text-gray-700 dark:text-gray-300 flex-1">{key}</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">₹</span>
                                        <input
                                            type="number"
                                            value={value}
                                            onChange={(e) => handlePriceChange('webType', key, e.target.value)}
                                            className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2 pl-8 pr-4 text-gray-900 dark:text-white w-40 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SEO */}
                    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm transition-colors">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">SEO Add-on</h2>
                        <div className="space-y-4">
                            {Object.entries(pricing.seo || {}).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between gap-4">
                                    <label className="text-gray-700 dark:text-gray-300 flex-1">{key}</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">₹</span>
                                        <input
                                            type="number"
                                            value={value}
                                            onChange={(e) => handlePriceChange('seo', key, e.target.value)}
                                            className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2 pl-8 pr-4 text-gray-900 dark:text-white w-40 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Business Type */}
                    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm transition-colors">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Business App Types</h2>
                        <div className="space-y-4">
                            {Object.entries(pricing.businessType || {}).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between gap-4">
                                    <label className="text-gray-700 dark:text-gray-300 flex-1 text-sm">{key}</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">₹</span>
                                        <input
                                            type="number"
                                            value={value}
                                            onChange={(e) => handlePriceChange('businessType', key, e.target.value)}
                                            className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2 pl-8 pr-4 text-gray-900 dark:text-white w-40 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuotePricingSettings;
