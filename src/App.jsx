import { useRoute } from "./hooks/useRoute.js";
import Dashboard from "./pages/Dashboard.jsx";
import IRAPGuide from "./pages/IRAPGuide.jsx";

export default function App() {
  const { path, navigate } = useRoute();
  if (path.startsWith("/irap-guide")) return <IRAPGuide navigate={navigate} />;
  return <Dashboard navigate={navigate} />;
}
