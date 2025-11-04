// src/App.jsx
import "./assets/css/styles.css";
import AppRouter from "./router/AppRouter";
import { AuthProvider } from "./utils/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
