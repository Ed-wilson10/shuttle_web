import { useState, useEffect } from "react";
import DepartureBoard from "./components/landing/DepartureBoard";
import Navbar from "./components/Navbar";
import AuthPage from "./components/auth/AuthPage";
import LandingPage from "./components/landing/LandingPage";
import BookingPage from "./components/booking/BookingPage";
import PaymentPage from "./components/payment/PaymentPage";
import ConfirmationPage from "./components/confirmation/ConfirmationPage";
import MyTicketsPage from "./pages/MyTicketsPage";
import { supabase } from "./lib/supabase";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("auth");
  const [bookingData, setBookingData] = useState({});

  // Rehydrate session from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("shuttle_user");
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
        setCurrentPage("landing");
      } catch {
        localStorage.removeItem("shuttle_user");
      }
    }
  }, []);

  const updateBooking = (newFields) => {
    setBookingData((prev) => ({ ...prev, ...newFields }));
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem("shuttle_user", JSON.stringify(user));
    setCurrentPage("landing");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("shuttle_user");
    setCurrentPage("auth");
    setBookingData({});
  };

  const handleSelectRoute = (route) => {
    updateBooking(route);
    setCurrentPage("booking");
  };

  const handleBookingProceed = (data) => {
    updateBooking(data);
    setCurrentPage("payment");
  };

  const handlePaymentProceed = (data) => {
    updateBooking(data);
    setCurrentPage("confirm");
  };

  const handleBookAnother = () => {
    setBookingData({});
    setCurrentPage("landing");
  };

  return (
    <>
      {currentUser && (
        <Navbar
          user={currentUser}
          onLogout={handleLogout}
          onMyTickets={() => setCurrentPage("mytickets")}
        />
      )}

      {currentPage === "auth" && <AuthPage onLogin={handleLogin} />}

      {currentPage === "landing" && (
        <LandingPage
          onBook={() => setCurrentPage("booking")}
          onSelectRoute={handleSelectRoute}
          onSchedule={() => setCurrentPage("schedule")}
        />
      )}

      {currentPage === "schedule" && (
        <div id="page-schedule">
          <div className="page-header">
            <button className="back-btn" onClick={() => setCurrentPage("landing")}>
              ← Back
            </button>
            <h2>Shuttle Schedules</h2>
          </div>
          <div className="section">
            <DepartureBoard />
          </div>
        </div>
      )}

      {currentPage === "booking" && (
        <BookingPage
          user={currentUser}
          onProceed={handleBookingProceed}
          onBack={() => setCurrentPage("landing")}
        />
      )}

      {currentPage === "payment" && (
        <PaymentPage
          bookingData={bookingData}
          onProceed={handlePaymentProceed}
          onBack={() => setCurrentPage("booking")}
        />
      )}

      {currentPage === "confirm" && (
        <ConfirmationPage
          user={currentUser}
          bookingData={bookingData}
          onBookAnother={handleBookAnother}
        />
      )}

      {currentPage === "mytickets" && (
        <MyTicketsPage
          user={currentUser}
          onBack={() => setCurrentPage("landing")}
        />
      )}
    </>
  );
}

export default App;
