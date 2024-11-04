
import ReactDOM from "react-dom/client"; // Import from 'react-dom/client' instead of 'react-dom'
import App from "./App";
import { TransactionProvider } from "./context/TransactionContext"; // Import TransactionProvider

// Use createRoot instead of ReactDOM.render
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <TransactionProvider>
    <App />
  </TransactionProvider>
);
