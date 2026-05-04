import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes";
import ToastContainer from "./components/UI/ToastContainer";
import ConfirmModal from "./components/UI/ConfirmModal";
import ErrorBoundary from "./components/UI/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <AppRoutes />
          <ToastContainer />
          <ConfirmModal />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
