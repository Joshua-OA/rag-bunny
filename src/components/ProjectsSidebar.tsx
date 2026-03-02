import { DotsThree } from "@phosphor-icons/react";

const projects = [
  { title: "Learning From 100 Years o...", desc: "For athletes, high altitude prod..." },
  { title: "Research officiants", desc: "Maxwell's equations—the foun..." },
  { title: "What does a senior lead de...", desc: "Physiological respiration involv..." },
  { title: "Write a sweet note to your...", desc: "In the eighteenth century the G..." },
  { title: "Meet with cake bakers", desc: "Physical space is often conceiv..." },
  { title: "Meet with cake bakers", desc: "Physical space is often conceiv..." },
];

export default function ProjectsSidebar() {
  return (
    <aside className="w-[280px] border-l border-border bg-white flex flex-col relative">
      {/* Header */}
      <div className="flex items-center justify-between p-5">
        <span className="text-xs font-semibold text-main">Projects (7)</span>
        <DotsThree size={20} className="text-tertiary cursor-pointer" />
      </div>

      {/* Project List */}
      <div className="flex-1 overflow-y-auto px-3">
        {/* New Project */}
        <div className="flex items-center justify-between p-3 border border-dashed border-border rounded-lg mb-3 cursor-pointer">
          <div className="text-[13px] font-semibold text-main">New Project</div>
          <div className="w-4 h-4 rounded-full border border-border bg-gray-50 flex items-center justify-center text-gray-300 text-xs">
            -
          </div>
        </div>

        {/* Projects */}
        {projects.map((project, i) => (
          <div key={i} className="p-3 border border-border rounded-lg mb-3 cursor-pointer relative">
            <div className="text-[13px] font-semibold text-main mb-1 truncate pr-6">
              {project.title}
            </div>
            <div className="text-xs text-tertiary truncate">{project.desc}</div>
            <div className="w-4 h-4 rounded-full border border-border bg-gray-50 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        ))}
      </div>

      {/* FAB */}
      <div className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 shadow-[0_4px_12px_rgba(59,130,246,0.3)] flex items-center justify-center cursor-pointer">
        <div className="w-4 h-4 bg-white rounded-full" />
      </div>
    </aside>
  );
}
