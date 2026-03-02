import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import ProjectsSidebar from "./components/ProjectsSidebar";
import './index.css'

export default function App() {
  return (
    <div className="h-screen flex bg-white overflow-hidden">
      <Sidebar />
      <MainContent />
      <ProjectsSidebar />
    </div>
  );
}
