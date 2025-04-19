import React from "react";
function ActiveProjects({ projects }) {
  return (
    <div className="bg-[#121218] rounded-lg border border-[#2d2d3a]">
    <div className="p-6 border-b border-[#2d2d3a]">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Active Projects</h2>
        <a
          href="/freelancer/projects"
          className="text-[#9333EA] hover:text-[#a855f7] text-sm flex items-center"
        >
          View All <ChevronRight size={16} />
        </a>
      </div>
    </div>

    {/* Project Cards */}
    <div className="p-4 grid gap-4">
      {activeProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}

      {activeProjects.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">You don't have any active projects.</p>
          <button className="mt-4 bg-[#9333EA] hover:bg-[#a855f7] text-white px-4 py-2 rounded-md transition-colors">
            Find New Projects
          </button>
        </div>
      )}
    </div>
  </div>
  );

}
export default ActiveProjects;