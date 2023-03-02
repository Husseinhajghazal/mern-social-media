import Router from "./router/Router";
import { useLogout } from "./hooks/logout-hook";

const App = () => {
  useLogout();

  return <Router />;
};

export default App;
