import { Toaster } from "react-hot-toast";
import Router from "./routes/Router";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <Toaster position="top-center"/>
      <Router />
    </ErrorBoundary>
  );
}

export default App;
