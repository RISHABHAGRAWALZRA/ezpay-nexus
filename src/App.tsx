import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Dashboard from "./pages/Dashboard";
import Friends from "./pages/Friends";
import FriendProfile from "./pages/FriendProfile";
import AddFriend from "./pages/AddFriend";
import CreateSplit from "./pages/CreateSplit";
import PaymentRequest from "./pages/PaymentRequest";
import { AppProvider } from "./context/AppContext";

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/friends/:friendId" element={<FriendProfile />} />
              <Route path="/add-friend" element={<AddFriend />} />
              <Route path="/create-split" element={<CreateSplit />} />
              <Route path="/payment/:requestId" element={<PaymentRequest />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
