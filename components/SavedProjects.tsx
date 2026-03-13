import React from 'react';
import { SavedProject } from '../types';
import { Trash2, FolderOpen } from 'lucide-react';

interface Props {
  projects: SavedProject[];
  onLoad: (project: SavedProject) => void;
  onDelete: (id: string) => void;
}

const SavedProjects: React.FC<Props> = ({ projects, onLoad, onDelete }) => {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
        <FolderOpen className="mx-auto text-gray-300 mb-3" size={48} />
        <h3 className="text-lg font-medium text-gray-900">No saved projects</h3>
        <p className="text-gray-500">Generate content and save it to see it here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <div key={project.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all group">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-bold text-gray-800 line-clamp-1">{project.name}</h3>
              <p className="text-xs text-gray-500">{new Date(project.createdAt).toLocaleDateString()}</p>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(project.id); }}
              className="text-gray-300 hover:text-red-500 transition-colors p-1"
            >
              <Trash2 size={16} />
            </button>
          </div>
          
          <div className="space-y-1 mb-4">
             <p className="text-xs bg-gray-50 px-2 py-1 rounded inline-block text-gray-600 mr-2">{project.inputs.niche}</p>
             <p className="text-xs bg-blue-50 px-2 py-1 rounded inline-block text-blue-600">{project.inputs.platform}</p>
          </div>

          <button
            onClick={() => onLoad(project)}
            className="w-full py-2 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 font-medium rounded-lg text-sm transition-colors"
          >
            Load Project
          </button>
        </div>
      ))}
    </div>
  );
};

export default SavedProjects;