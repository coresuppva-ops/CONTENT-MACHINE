import React, { useState, useEffect } from 'react';
import { UserInputs, SocialPost, VideoScript, GeneratorState, SavedProject } from './types';
import { generatePosts, generateVideoScripts } from './services/gemini';
import InputForm from './components/InputForm';
import ContentDisplay from './components/ContentDisplay';
import SavedProjects from './components/SavedProjects';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import { Rocket, FolderHeart, PlusCircle, Menu } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState<'create' | 'saved'>('create');
  const [state, setState] = useState<GeneratorState>(GeneratorState.IDLE);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [scripts, setScripts] = useState<VideoScript[]>([]);
  const [loadingScripts, setLoadingScripts] = useState(false);
  const [currentInputs, setCurrentInputs] = useState<UserInputs | null>(null);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check auth on mount
  useEffect(() => {
    const auth = localStorage.getItem('ai_social_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('ai_social_auth', 'true');
  };

  // Load saved projects on mount
  useEffect(() => {
    const saved = localStorage.getItem('ai_social_projects');
    if (saved) {
      try {
        setSavedProjects(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved projects");
      }
    }
  }, []);

  const handleGenerate = async (inputs: UserInputs, apiKey: string) => {
    if (!apiKey || apiKey.trim() === '') {
      setErrorMsg("Please provide a valid Google Gemini API Key.");
      setState(GeneratorState.ERROR);
      return;
    }

    setState(GeneratorState.LOADING);
    setLoadingScripts(true);
    setErrorMsg(null);
    setCurrentInputs(inputs);
    setPosts([]);
    setScripts([]);
    
    // Trigger script generation in background
    generateVideoScripts(inputs, apiKey)
      .then(generatedScripts => {
        setScripts(generatedScripts);
      })
      .catch(err => {
        console.error("Script generation failed", err);
      })
      .finally(() => {
        setLoadingScripts(false);
      });

    try {
      // Await posts as the primary content
      const generatedPosts = await generatePosts(inputs, apiKey);
      setPosts(generatedPosts);
      setState(GeneratorState.SUCCESS);
    } catch (error: any) {
      console.error(error);
      setState(GeneratorState.ERROR);
      setErrorMsg("Failed to generate content. Please check your API key and try again.");
      setLoadingScripts(false);
    }
  };

  const handleSaveProject = () => {
    if (!currentInputs || posts.length === 0) return;

    const newProject: SavedProject = {
      id: crypto.randomUUID(),
      name: `${currentInputs.niche} - ${currentInputs.platform}`,
      createdAt: Date.now(),
      inputs: currentInputs,
      posts,
      scripts
    };

    const updated = [newProject, ...savedProjects];
    setSavedProjects(updated);
    localStorage.setItem('ai_social_projects', JSON.stringify(updated));
    alert('Project saved successfully!');
  };

  const handleLoadProject = (project: SavedProject) => {
    setCurrentInputs(project.inputs);
    setPosts(project.posts);
    setScripts(project.scripts);
    setState(GeneratorState.SUCCESS);
    setLoadingScripts(false);
    setView('create');
  };

  const handleDeleteProject = (id: string) => {
    const updated = savedProjects.filter(p => p.id !== id);
    setSavedProjects(updated);
    localStorage.setItem('ai_social_projects', JSON.stringify(updated));
  };

  const handleNewProject = () => {
    setState(GeneratorState.IDLE);
    setPosts([]);
    setScripts([]);
    setCurrentInputs(null);
    setView('create');
    setIsMobileMenuOpen(false);
  };

  const handleViewSaved = () => {
    setView('saved');
    setIsMobileMenuOpen(false);
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 flex">
      {/* Sidebar for Desktop */}
      <Sidebar 
        onNewProject={handleNewProject} 
        onSavedProjects={handleViewSaved}
        currentView={view} 
      />

      {/* Main Content */}
      <div className="flex-1 md:ml-64 transition-all">
        
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 px-4 text-sm font-bold shadow-sm">
          BUY THIS TOOL FOR $200 ONE TIME FEE USE IT FOREVER
        </div>

        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <div className="bg-blue-600 text-white p-1.5 rounded-md">
                  <Rocket size={18} />
                </div>
                <span className="font-bold text-gray-800">ContentMachine</span>
             </div>
             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600">
               <Menu size={24} />
             </button>
          </div>
          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="bg-white border-t border-gray-100 p-4 shadow-lg absolute w-full z-30">
               <button onClick={handleNewProject} className="block w-full text-left py-3 px-4 hover:bg-gray-50 rounded-lg">New Project</button>
               <button onClick={handleViewSaved} className="block w-full text-left py-3 px-4 hover:bg-gray-50 rounded-lg">Saved Projects</button>
               <div className="border-t border-gray-100 my-2 pt-2">
                  <p className="text-xs text-gray-400 px-4 mb-2">TOOLS</p>
                  <p className="text-sm text-gray-600 px-4 py-1">Use Desktop for full sidebar tools</p>
               </div>
            </div>
          )}
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {view === 'saved' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Saved Projects</h2>
              <SavedProjects 
                projects={savedProjects} 
                onLoad={handleLoadProject} 
                onDelete={handleDeleteProject} 
              />
            </div>
          )}

          {view === 'create' && (
            <>
              {state === GeneratorState.IDLE && (
                <div className="animate-fade-in">
                  <div className="text-center mb-10 max-w-2xl mx-auto pt-6">
                     <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                      30 Days of Social Content. <br/>
                      <span className="text-blue-600">Done in Seconds.</span>
                     </h2>
                     <p className="text-lg text-gray-600">
                       Stop staring at a blank screen. Enter your niche, and let AI generate a full month of captions, hashtags, and video scripts instantly.
                     </p>
                  </div>
                  <InputForm onGenerate={handleGenerate} isLoading={false} />
                </div>
              )}

              {state === GeneratorState.LOADING && (
                <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                   <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
                   <h3 className="text-xl font-semibold text-gray-800">Brewing your content strategy...</h3>
                   <p className="text-gray-500 mt-2">Generating 30 unique posts...</p>
                </div>
              )}

              {state === GeneratorState.ERROR && (
                 <div className="max-w-2xl mx-auto text-center py-12">
                    <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-100 mb-6">
                      <p className="font-semibold">{errorMsg || "Something went wrong."}</p>
                    </div>
                    <button 
                      onClick={() => setState(GeneratorState.IDLE)}
                      className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
                    >
                      Try Again
                    </button>
                 </div>
              )}

              {state === GeneratorState.SUCCESS && currentInputs && (
                <ContentDisplay 
                  posts={posts} 
                  scripts={scripts} 
                  inputs={currentInputs}
                  loadingScripts={loadingScripts}
                  onSave={handleSaveProject} 
                  onPostUpdate={setPosts}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;