import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes";
import ToastContainer from "./components/UI/ToastContainer";
import ConfirmModal from "./components/UI/ConfirmModal";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <ToastContainer />
        <ConfirmModal />
      </AuthProvider>
    </Router>
  );
}

export default App;
