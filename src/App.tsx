import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ServerList from "./components/ServerList";
import ServerDetail from "./components/ServerDetail";

function App() {
  return (
    <Router>
      <div className="container mx-auto p-4">
        {/* <h1 className="text-3xl font-bold mb-4">Server Management</h1> */}
        <Routes>
          <Route path="/" element={<ServerList />} />
          <Route path="/server/:id" element={<ServerDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
