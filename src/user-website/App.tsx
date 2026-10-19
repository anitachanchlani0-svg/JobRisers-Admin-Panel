import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import JobDetailsPage from './pages/JobDetailsPage'
import JobsPage from './pages/JobsPage'
import AccountSettingsPage from './pages/AccountSettingsPage'
import CompaniesPage from './pages/CompaniesPage'
import InterviewsPage from './pages/InterviewsPage'
import MessagesPage from './pages/MessagesPage'
import CandidateDashboardPage from './pages/CandidateDashboardPage'
import SignInPage from './pages/SignInPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ForgotPasswordPage />} />
        <Route path="/dashboard" element={<CandidateDashboardPage />} />
        <Route path="/candidate-dashboard" element={<CandidateDashboardPage />} />
        <Route path="/candidate/dashboard" element={<CandidateDashboardPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/create-account" element={<SignUpPage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/jobs/product-designer" element={<JobDetailsPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/job/:id" element={<JobDetailsPage />} />
        <Route path="/job-details" element={<JobDetailsPage />} />
        <Route path="/settings" element={<AccountSettingsPage />} />
        <Route path="/account-settings" element={<AccountSettingsPage />} />
        <Route path="/interviews" element={<InterviewsPage />} />
        <Route path="/my-interviews" element={<InterviewsPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/chat" element={<MessagesPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}
