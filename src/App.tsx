import Users from "./pages/Users";
import { NotificationProvider } from "./context/NotificationContext";
import { NotificationCenter } from "./components/NotificationCenter";

function App() {
  return (
    <NotificationProvider>
      <NotificationCenter />
      <Users />
    </NotificationProvider>
  );
}

export default App;