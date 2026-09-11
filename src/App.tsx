import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CompareProvider } from './context/CompareContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { HotelDetailsPage } from './pages/HotelDetailsPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { BookingConfirmationPage } from './pages/BookingConfirmationPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { WishlistPage } from './pages/WishlistPage';
import { OwnerDashboardPage } from './pages/OwnerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { GlobalLoader } from './components/common/GlobalLoader';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CompareProvider>
          <div className="app-layout">
            <GlobalLoader />
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/hotel/:slug" element={<HotelDetailsPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/booking-confirmation/:reference" element={<BookingConfirmationPage />} />
                <Route path="/my-bookings" element={<MyBookingsPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/owner" element={<OwnerDashboardPage />} />
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CompareProvider>
      </WishlistProvider>
    </AuthProvider>
  );
};

export default App;
