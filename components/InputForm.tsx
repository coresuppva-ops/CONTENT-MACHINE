import React, { useState } from 'react';
import { UserInputs } from '../types';
import { Sparkles, Loader2, Key } from 'lucide-react';

interface Props {
  onGenerate: (inputs: UserInputs, apiKey: string) => void;
  isLoading: boolean;
}

const InputForm: React.FC<Props> = ({ onGenerate, isLoading }) => {
  const [apiKey, setApiKey] = useState('');
  const [inputs, setInputs] = useState<UserInputs>({
    niche: '',
    audience: '',
    tone: 'Professional but friendly',
    cta: 'Follow for more tips',
    platform: 'Instagram'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(inputs, apiKey);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-3xl mx-auto border border-gray-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Sparkles className="text-blue-600" size={24} />
          Define Your Strategy
        </h2>
        <p className="text-gray-500">Tell us about your brand, and the AI will do the rest.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* API Key Section */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <Key size={16} className="text-gray-500" />
            PASTE YOUR API KEY HERE
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Paste the copied key here..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            required
          />
          <p className="text-xs text-gray-500 mt-2">
            Required to generate content. Use the sidebar menu to get a key if you don't have one.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Industry / Niche</label>
            <input
              type="text"
              name="niche"
              required
              placeholder="e.g. Digital Marketing, Pet Care, Fitness"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={inputs.niche}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
            <input
              type="text"
              name="audience"
              required
              placeholder="e.g. Small business owners, New moms"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={inputs.audience}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand Tone</label>
            <select
              name="tone"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={inputs.tone}
              onChange={handleChange}
            >
              <option value="Professional & Authoritative">Professional & Authoritative</option>
              <option value="Friendly & Casual">Friendly & Casual</option>
              <option value="Humorous & Witty">Humorous & Witty</option>
              <option value="Inspirational & Uplifting">Inspirational & Uplifting</option>
              <option value="Educational & Informative">Educational & Informative</option>
            </select>
          </div>

           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Platform</label>
            <select
              name="platform"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={inputs.platform}
              onChange={handleChange}
            >
              <option value="Instagram">Instagram</option>
              <option value="TikTok">TikTok</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Facebook">Facebook</option>
              <option value="YouTube Shorts">YouTube Shorts</option>
              <option value="Twitter">Twitter</option>
              <option value="X">X (Twitter)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Call to Action (CTA)</label>
          <input
            type="text"
            name="cta"
            required
            placeholder="e.g. Visit link in bio, Save this post"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            value={inputs.cta}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-lg text-white font-semibold text-lg shadow-md transition-all transform hover:-translate-y-1 ${
            isLoading 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" /> Generating Content...
            </span>
          ) : (
            'Generate 30-Day Plan'
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;