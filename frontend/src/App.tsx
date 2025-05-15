import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CreateProduct from "./pages/CreateProduct";
import AuthGuard from "./components/AuthGuard";

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route 
              path="/login" 
              element={
                <AuthGuard requireAuth={false}>
                  <Login />
                </AuthGuard>
              } 
            />
            <Route 
              path="/register" 
              element={
                <AuthGuard requireAuth={false}>
                  <Register />
                </AuthGuard>
              } 
            />
            <Route
              path="/"
              element={
                <AuthGuard requireAuth={true}>
                  <Home />
                </AuthGuard>
              }
            />
            <Route
              path="/create-product"
              element={
                <AuthGuard requireAuth={true}>
                  <CreateProduct />
                </AuthGuard>
              }
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
