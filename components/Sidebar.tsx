import React, { useState } from 'react';
import { Rocket, Copy, BookOpen, ShoppingBag, X, Check } from 'lucide-react';

interface Props {
  onNewProject: () => void;
  onSavedProjects: () => void;
  currentView: 'create' | 'saved';
}

const Sidebar: React.FC<Props> = ({ onNewProject, onSavedProjects, currentView }) => {
  const [modal, setModal] = useState<'apiKey' | 'instruction' | null>(null);
  const [copied, setCopied] = useState(false);

  // The requested API key to be distributed
  const API_KEY_VALUE = "AIzaSyC5pDIrKK5PahhdD3-oy83M4iTBJPLBdts";

  const handleCopy = () => {
    navigator.clipboard.writeText(API_KEY_VALUE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-200 hidden md:flex flex-col z-30">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onNewProject}>
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white p-2 rounded-lg">
              <Rocket size={20} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 leading-none">
                ContentMachine
              </h1>
              <span className="text-[10px] text-gray-400 font-medium mt-1">
                &copy; c.v creation
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {/* Menu Items */}
          <div className="space-y-4">
             <div>
               <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">Menu</p>
               <button 
                onClick={onNewProject}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'create' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Create New
              </button>
              <button 
                onClick={onSavedProjects}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'saved' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Saved Projects
              </button>
             </div>

             <div>
               <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">Tools</p>
               <button 
                onClick={() => setModal('apiKey')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors text-left"
              >
                <Copy size={18} className="text-orange-500" />
                Copy API KEYS HERE!
              </button>
               <button 
                onClick={() => setModal('instruction')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors text-left"
              >
                <BookOpen size={18} className="text-green-500" />
                INSTRUCTION
              </button>
             </div>

             <div className="pt-4 mt-4 border-t border-gray-100">
               <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-xl shadow-md hover:shadow-lg transition-all text-left group">
                 <div className="flex items-center gap-2 mb-1">
                   <ShoppingBag size={18} />
                   <span className="font-bold text-sm">BUY THIS TOOL</span>
                 </div>
                 <p className="text-xs opacity-90 group-hover:opacity-100">
                   $200 One Time Fee.<br/>Use it forever.
                 </p>
               </button>
             </div>
          </div>
        </nav>
      </div>

      {/* Modal - API Key */}
      {modal === 'apiKey' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Get Your API Key</h3>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              Copy the key below and paste it into the "PASTE YOUR API KEY HERE" field in the form.
            </p>
            <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg border border-gray-200">
              <code className="text-gray-800 font-mono text-lg flex-1 overflow-hidden">
                AI****************ts
              </code>
              <button 
                onClick={handleCopy}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition-colors"
                title="Copy full key"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
            {copied && <p className="text-green-600 text-xs mt-2 text-center font-medium">Copied to clipboard!</p>}
            <button 
              onClick={() => setModal(null)}
              className="w-full mt-6 bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Modal - Instructions */}
      {modal === 'instruction' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">How to Use</h3>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-gray-800">Copy API Key</h4>
                  <p className="text-sm text-gray-600">Click "Copy API KEYS HERE!" in the sidebar and copy the code.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-gray-800">Paste & Fill Info</h4>
                  <p className="text-sm text-gray-600">Paste the key into the form. Enter your industry, audience, and tone.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-gray-800">Generate</h4>
                  <p className="text-sm text-gray-600">Click "Generate 30-Day Plan" and wait for the magic to happen.</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setModal(null)}
              className="w-full mt-6 bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;