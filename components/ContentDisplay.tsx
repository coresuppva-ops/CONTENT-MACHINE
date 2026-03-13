import React, { useState } from 'react';
import { SocialPost, VideoScript, UserInputs } from '../types';
import { Calendar, Video, Download, Save, Copy, Check, Music, Loader2, Send } from 'lucide-react';
import { downloadCSV, downloadTXT, exportProjectPDF } from '../utils/exporter';

interface Props {
  posts: SocialPost[];
  scripts: VideoScript[];
  inputs: UserInputs;
  loadingScripts?: boolean;
  onSave: () => void;
  onPostUpdate: (updatedPosts: SocialPost[]) => void;
}

const ContentDisplay: React.FC<Props> = ({ posts, scripts, inputs, loadingScripts = false, onSave, onPostUpdate }) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'scripts'>('posts');
  const [copiedId, setCopiedId] = useState<string | number | null>(null);

  const handleCopy = (text: string, id: string | number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePost = (post: SocialPost, index: number) => {
    // Construct share URL based on platform
    let url = '';
    const text = `${post.caption}\n\n${post.hashtags.map(t => '#' + t).join(' ')}`;
    const encodedText = encodeURIComponent(text);

    switch (inputs.platform) {
      case 'Twitter': // Fallback if they typed Twitter
      case 'X': // Fallback
        url = `https://twitter.com/intent/tweet?text=${encodedText}`;
        break;
      case 'LinkedIn':
        // LinkedIn only allows URL sharing easily via GET, but we can try opening the feed
        url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodedText}`; 
        break;
      case 'Facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://example.com')}&quote=${encodedText}`;
        break;
      default:
        // Default to Twitter for generic or other platforms as it's the most "text-post" friendly
        url = `https://twitter.com/intent/tweet?text=${encodedText}`;
    }

    // Open popup
    window.open(url, '_blank', 'width=600,height=600');

    // Update post status
    const updatedPosts = [...posts];
    updatedPosts[index] = { ...post, posted: true };
    onPostUpdate(updatedPosts);
  };

  const handleExportCSV = () => {
    const rows = [
      ["Day", "Time", "Caption", "Hashtags"],
      ...posts.map(p => [p.day.toString(), p.scheduleTime, p.caption, p.hashtags.join(" ")])
    ];
    downloadCSV("content_plan.csv", rows);
  };

  const handleExportTXT = () => {
    const text = activeTab === 'posts' 
      ? `SOCIAL MEDIA POSTS\n\n` + posts.map(p => `Day ${p.day}: ${p.caption}`).join('\n\n')
      : `VIDEO SCRIPTS\n\n` + scripts.map(s => `${s.title}\nMusic: ${s.music || 'N/A'}\n${s.body}`).join('\n\n');
    downloadTXT("content_plan.txt", text);
  };

  const handleExportPDF = () => {
    exportProjectPDF(inputs, posts, scripts);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 sticky top-4 z-10 gap-4">
        <div className="flex bg-gray-100 rounded-lg p-1 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-2 px-6 py-2 rounded-md transition-all ${
              activeTab === 'posts' ? 'bg-white shadow-sm text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Calendar size={18} /> 30-Day Posts
          </button>
          <button
            onClick={() => setActiveTab('scripts')}
            className={`flex items-center gap-2 px-6 py-2 rounded-md transition-all ${
              activeTab === 'scripts' ? 'bg-white shadow-sm text-purple-600 font-medium' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {loadingScripts ? <Loader2 size={18} className="animate-spin text-purple-600"/> : <Video size={18} />} 
            Video Scripts
          </button>
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <button onClick={onSave} className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition text-sm font-medium whitespace-nowrap">
            <Save size={16} /> Save Project
          </button>
          <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition text-sm font-medium whitespace-nowrap">
            <Download size={16} /> PDF
          </button>
          <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm font-medium whitespace-nowrap">
            <Download size={16} /> CSV
          </button>
           <button onClick={handleExportTXT} className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition text-sm font-medium whitespace-nowrap">
            <Download size={16} /> TXT
          </button>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'posts' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.day} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-blue-50 px-4 py-2 border-b border-blue-100 flex justify-between items-center">
                <span className="text-blue-800 font-bold text-sm">Day {post.day}</span>
                <span className="text-blue-600 text-xs font-medium">{post.scheduleTime}</span>
              </div>
              <div className="p-4 space-y-4">
                <p className="text-gray-700 text-sm whitespace-pre-wrap">{post.caption}</p>
                <div className="flex flex-wrap gap-2">
                  {post.hashtags.map((tag, i) => (
                    <span key={i} className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded-full">#{tag}</span>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={() => handleCopy(`${post.caption}\n\n${post.hashtags.map(t=>'#'+t).join(' ')}`, post.day)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-sm text-gray-500 hover:text-blue-600 border border-dashed border-gray-300 rounded hover:border-blue-300 transition-colors"
                  >
                    {copiedId === post.day ? <Check size={14} className="text-green-500"/> : <Copy size={14} />}
                    {copiedId === post.day ? 'Copied' : 'Copy'}
                  </button>
                  <button 
                    onClick={() => handlePost(post, posts.indexOf(post))}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm border rounded transition-colors ${
                      post.posted 
                        ? 'bg-green-50 text-green-600 border-green-200' 
                        : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {post.posted ? <Check size={14} /> : <Send size={14} />}
                    {post.posted ? 'Posted' : 'Post Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {loadingScripts ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm animate-pulse">
              <Loader2 className="animate-spin text-purple-600 mb-4" size={40} />
              <h3 className="text-lg font-medium text-gray-800">Writing your video scripts...</h3>
              <p className="text-gray-500 text-sm mt-1">AI is crafting hooks, shot lists, and music choices.</p>
            </div>
          ) : scripts.length === 0 ? (
             <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                <p className="text-gray-500">No scripts generated. Try generating again.</p>
             </div>
          ) : (
            scripts.map((script, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between mb-4 border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{script.title}</h3>
                    <div className="flex gap-2 mt-2">
                      <span className="inline-block text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">
                        Est. Duration: {script.duration}
                      </span>
                      {script.music && (
                         <span className="inline-flex items-center gap-1 text-xs font-semibold text-pink-600 bg-pink-50 px-2 py-1 rounded">
                          <Music size={12}/> {script.music}
                        </span>
                      )}
                    </div>
                  </div>
                  <button 
                     onClick={() => handleCopy(`Title: ${script.title}\nMusic: ${script.music}\nHook: ${script.hook}\nBody: ${script.body}\nVisuals: ${script.visuals}\nCTA: ${script.cta}`, script.id || idx)}
                     className="mt-4 md:mt-0 flex items-center gap-2 text-sm text-gray-500 hover:text-purple-600"
                  >
                     {copiedId === (script.id || idx) ? <Check size={16} className="text-green-500"/> : <Copy size={16} />}
                     Copy Script
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Hook</span>
                      <p className="text-gray-800 font-medium whitespace-pre-line">{script.hook}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Main Body</span>
                      <p className="text-gray-700 whitespace-pre-line">{script.body}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                     <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                      <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                        <Video size={12}/> Visuals & Shot List
                      </span>
                      <p className="text-purple-900 text-sm italic whitespace-pre-line">{script.visuals}</p>
                    </div>
                     <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Call to Action</span>
                      <p className="text-gray-800 font-bold">{script.cta}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ContentDisplay;