import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/messages.css'

interface ConversationItem {
  id: string
  company: string
  role: string
  logoText: string
  logoBg: string
  logoColor?: string
  lastMessage: string
  time: string
  unreadCount?: number
  isGoogle?: boolean
}

interface ChatMessage {
  id: string
  senderName: string
  senderInitials: string
  senderAvatarBg: string
  senderAvatarColor: string
  time: string
  isCandidate: boolean
  paragraphs: string[]
  hasMeetCard?: boolean
  meetTitle?: string
  meetLink?: string
}

export default function MessagesPage() {
  const navigate = useNavigate()

  // Tabs
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'employers' | 'archived'>('all')

  // Search input
  const [searchQuery, setSearchQuery] = useState('')

  // Selected conversation
  const [selectedConversationId, setSelectedConversationId] = useState('google')

  // Notifications checkboxes
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)

  // Message input & state
  const [inputMessage, setInputMessage] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Conversation list data (exact match to reference screenshot)
  const conversations: ConversationItem[] = [
    {
      id: 'google',
      company: 'Google',
      role: 'Product Designer',
      logoText: 'G',
      logoBg: '#4285F4',
      lastMessage: "Hi Alex, we'd like to schedule a video i...",
      time: '10:34 AM',
      unreadCount: 1,
      isGoogle: true,
    },
    {
      id: 'microsoft',
      company: 'Microsoft',
      role: 'UX Designer',
      logoText: 'MS',
      logoBg: '#00A4EF',
      lastMessage: 'Thanks for your interest in the role. We ...',
      time: 'Yesterday',
      unreadCount: 1,
    },
    {
      id: 'adobe',
      company: 'Adobe',
      role: 'Product Designer',
      logoText: 'Ai',
      logoBg: '#FF0000',
      lastMessage: "Your application is under review. We'll ...",
      time: '12 Mar',
    },
    {
      id: 'amazon',
      company: 'Amazon',
      role: 'UX Researcher',
      logoText: 'a',
      logoBg: '#FF9900',
      logoColor: '#111827',
      lastMessage: 'Hi Alex, we wanted to follow up on yo...',
      time: '10 Mar',
    },
    {
      id: 'spotify',
      company: 'Spotify',
      role: 'Product Designer',
      logoText: 'S',
      logoBg: '#1DB954',
      lastMessage: 'Great! Looking forward to speaking w...',
      time: '8 Mar',
    },
    {
      id: 'atlassian',
      company: 'Atlassian',
      role: 'UI Designer',
      logoText: 'A',
      logoBg: '#0052CC',
      lastMessage: "We've moved your application to the ...",
      time: '5 Mar',
    },
    {
      id: 'design-intern',
      company: 'Design Intern',
      role: 'Design Intern',
      logoText: 'SS',
      logoBg: '#334155',
      lastMessage: "Thanks for applying! We'll be in touch ...",
      time: '1 Mar',
    },
  ]

  // Messages in current Google conversation (exact text from reference)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      senderName: 'Priya Sharma',
      senderInitials: 'PS',
      senderAvatarBg: '#e2e8f0',
      senderAvatarColor: '#475569',
      time: '10:34 AM',
      isCandidate: false,
      paragraphs: [
        'Hi Alex,',
        'Thanks for applying for the Product Designer role at Google. We were impressed with your profile and would like to schedule a video interview.',
        'Are you available for a 45-minute call this week? Please let us know your preferred time slots.',
      ],
    },
    {
      id: 'msg-2',
      senderName: 'Alex Johnson',
      senderInitials: 'AJ',
      senderAvatarBg: '#3b82f6',
      senderAvatarColor: '#ffffff',
      time: '10:38 AM',
      isCandidate: true,
      paragraphs: [
        'Hi Priya,',
        'Thank you for the opportunity!',
        "I'm available on Wednesday or Thursday this week between 10 AM – 2 PM (IST). Please let me know what works best for your team.",
        'Looking forward to it!',
        '– Alex',
      ],
    },
    {
      id: 'msg-3',
      senderName: 'Priya Sharma',
      senderInitials: 'PS',
      senderAvatarBg: '#e2e8f0',
      senderAvatarColor: '#475569',
      time: '10:39 AM',
      isCandidate: false,
      paragraphs: [
        "Great! We've scheduled the interview for Thursday, 21 Mar 2024 at 11:00 AM (IST). Here's the meeting link:",
      ],
      hasMeetCard: true,
      meetTitle: 'Google Meet',
      meetLink: 'https://meet.google.com/abc-defg-nij',
    },
  ])

  // Handle sending a new message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderName: 'Alex Johnson',
      senderInitials: 'AJ',
      senderAvatarBg: '#3b82f6',
      senderAvatarColor: '#ffffff',
      time: 'Just now',
      isCandidate: true,
      paragraphs: [inputMessage.trim()],
    }

    setMessages((prev) => [...prev, newMsg])
    setInputMessage('')
  }

  // Filtered conversations based on search and tab
  const filteredConversations = conversations.filter((c) => {
    if (activeTab === 'unread' && !c.unreadCount) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        c.company.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div className="messages-page-root">
      {/* ------------------------------------------------------------------
          1. Top Navigation Bar (Identical to reference screenshot)
          ------------------------------------------------------------------ */}
      <header className="messages-nav" id="messages-header-nav">
        <div className="messages-nav__container">
          {/* Left: JobRisers Brand Logo & Global Search */}
          <div className="messages-nav__left">
            <Link to="/" className="messages-nav__logo" id="messages-nav-logo">
              <span className="messages-nav__logo-badge">
                <span className="messages-nav__logo-badge-text">J</span>
                <span className="messages-nav__logo-badge-sub">JobRisers</span>
              </span>
              <span className="messages-nav__logo-text">
                <span className="messages-nav__logo-text--job">Job</span>
                <span className="messages-nav__logo-text--risers">Risers</span>
              </span>
            </Link>

            {/* Search Input Bar */}
            <div className="messages-nav__search">
              <svg
                className="messages-nav__search-icon"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search jobs, companies, or skills..."
                className="messages-nav__search-input"
                id="navbar-search-input"
              />
            </div>
          </div>

          {/* Right: Nav Links, Notification Bell, User Profile */}
          <div className="messages-nav__right">
            <nav className="messages-nav__links">
              <Link to="/jobs" className="messages-nav__link" id="nav-jobs">
                Jobs
              </Link>
              <Link to="/companies" className="messages-nav__link" id="nav-companies">
                Companies
              </Link>
              <Link to="/#career-advice" className="messages-nav__link" id="nav-career-advice">
                Career Advice
              </Link>
            </nav>

            <div className="messages-nav__user-wrap">
              {/* Notification Indicator Dot */}
              <div className="messages-nav__notif-wrap" title="Notifications">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span className="messages-nav__notif-dot" />
              </div>

              {/* Logged-in User Profile Link to /settings */}
              <Link
                to="/settings"
                className="messages-nav__user"
                id="messages-user-profile"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="messages-nav__avatar" aria-hidden="true">
                  AJ
                </div>
                <span className="messages-nav__username">Alex Johnson</span>
                <svg
                  className="messages-nav__user-chevron"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------
          2. Main Three-Column Layout Container
          ------------------------------------------------------------------ */}
      <div className="messages-body">
        <div className="messages-body__container">
          {/* ================================================================
              LEFT COLUMN — CANDIDATE SIDEBAR NAVIGATION
              ================================================================ */}
          <aside className="messages-sidebar-left" aria-label="Portal Navigation">
            <nav className="messages-menu">
              <button
                type="button"
                className="messages-menu__item"
                onClick={() => navigate('/#profile')}
                id="menu-profile"
              >
                <svg className="messages-menu__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Profile</span>
              </button>

              <button
                type="button"
                className="messages-menu__item"
                onClick={() => navigate('/jobs')}
                id="menu-find-jobs"
              >
                <svg className="messages-menu__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span>Find Jobs</span>
              </button>

              <button
                type="button"
                className="messages-menu__item"
                onClick={() => navigate('/#applications')}
                id="menu-applications"
              >
                <svg className="messages-menu__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <line x1="7" y1="8" x2="17" y2="8" />
                  <line x1="7" y1="12" x2="17" y2="12" />
                  <line x1="7" y1="16" x2="13" y2="16" />
                </svg>
                <span>Applications</span>
              </button>

              <button
                type="button"
                className="messages-menu__item"
                onClick={() => navigate('/#saved-jobs')}
                id="menu-saved-jobs"
              >
                <svg className="messages-menu__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  <line x1="12" y1="7" x2="12" y2="13" />
                  <line x1="9" y1="10" x2="15" y2="10" />
                </svg>
                <span>Saved Jobs</span>
              </button>

              <button
                type="button"
                className="messages-menu__item"
                onClick={() => navigate('/interviews')}
                id="menu-interviews"
              >
                <svg className="messages-menu__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="12" cy="12" r="2.5" />
                </svg>
                <span>Interviews</span>
              </button>

              {/* ACTIVE ITEM: Messages with red count badge 3 */}
              <button
                type="button"
                className="messages-menu__item messages-menu__item--active"
                onClick={() => setActiveTab('all')}
                id="menu-messages"
              >
                <div className="messages-menu__left-group">
                  <svg className="messages-menu__icon messages-menu__icon--active" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>Messages</span>
                </div>
                <span className="messages-menu__unread-badge">3</span>
              </button>

              <button
                type="button"
                className="messages-menu__item"
                onClick={() => navigate('/settings')}
                id="menu-settings"
              >
                <svg className="messages-menu__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                <span>Settings</span>
              </button>
            </nav>

            {/* Upgrade to Premium Card */}
            <div className="messages-upgrade-card" id="messages-upgrade-card">
              <div className="messages-upgrade-card__icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#3b82f6">
                  <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
                </svg>
              </div>
              <h4 className="messages-upgrade-card__title">Upgrade to Premium</h4>
              <p className="messages-upgrade-card__desc">
                Get early access to top jobs, career insights and more.
              </p>
              <button
                type="button"
                className="messages-upgrade-card__btn"
                id="upgrade-premium-btn"
                onClick={() => showToast('Premium subscription plans coming soon!')}
              >
                Upgrade
              </button>
            </div>
          </aside>

          {/* ================================================================
              CENTER COLUMN — MESSAGING DASHBOARD & CHAT PANE
              ================================================================ */}
          <main className="messages-main-content">
            {/* Header: Title, Subtitle & Filter Tabs */}
            <header className="messages-header">
              <h1 className="messages-header__title">Messages</h1>
              <p className="messages-header__subtitle">
                Connect with employers and manage your conversations.
              </p>

              {/* Filter Tabs */}
              <div className="messages-tabs" role="tablist">
                <button
                  type="button"
                  className={`messages-tab ${activeTab === 'all' ? 'messages-tab--active' : ''}`}
                  onClick={() => setActiveTab('all')}
                  id="tab-all"
                >
                  All (12)
                </button>
                <button
                  type="button"
                  className={`messages-tab ${activeTab === 'unread' ? 'messages-tab--active' : ''}`}
                  onClick={() => setActiveTab('unread')}
                  id="tab-unread"
                >
                  Unread (3)
                </button>
                <button
                  type="button"
                  className={`messages-tab ${activeTab === 'employers' ? 'messages-tab--active' : ''}`}
                  onClick={() => setActiveTab('employers')}
                  id="tab-employers"
                >
                  Employers (12)
                </button>
                <button
                  type="button"
                  className={`messages-tab ${activeTab === 'archived' ? 'messages-tab--active' : ''}`}
                  onClick={() => setActiveTab('archived')}
                  id="tab-archived"
                >
                  Archived
                </button>
              </div>
            </header>

            {/* Split View Messaging Workspace Card */}
            <div className="messages-workspace" id="messages-workspace">
              {/* ------------------------------------------------------------
                  Left Sub-column: Conversation List
                  ------------------------------------------------------------ */}
              <div className="messages-inbox-pane">
                {/* Search Bar + Filter Icon */}
                <div className="messages-inbox__search-bar">
                  <div className="messages-inbox__search-input-wrap">
                    <svg className="messages-inbox__search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search messages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="messages-inbox__search-input"
                    />
                  </div>
                  <button
                    type="button"
                    className="messages-inbox__filter-btn"
                    title="Filter conversations"
                    onClick={() => showToast('Conversation filters')}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="4" y1="21" x2="4" y2="14" />
                      <line x1="4" y1="10" x2="4" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12" y2="3" />
                      <line x1="20" y1="21" x2="20" y2="16" />
                      <line x1="20" y1="12" x2="20" y2="3" />
                      <line x1="1" y1="14" x2="7" y2="14" />
                      <line x1="9" y1="8" x2="15" y2="8" />
                      <line x1="17" y1="16" x2="23" y2="16" />
                    </svg>
                  </button>
                </div>

                {/* Conversation List */}
                <div className="messages-inbox__list">
                  {filteredConversations.map((item) => {
                    const isSelected = item.id === selectedConversationId
                    return (
                      <div
                        key={item.id}
                        className={`messages-inbox-item ${isSelected ? 'messages-inbox-item--selected' : ''}`}
                        onClick={() => setSelectedConversationId(item.id)}
                        id={`conversation-${item.id}`}
                      >
                        {/* Company Logo Square */}
                        <div
                          className="messages-inbox-item__logo"
                          style={{
                            backgroundColor: item.logoBg,
                            color: item.logoColor || '#ffffff',
                          }}
                        >
                          {item.logoText}
                        </div>

                        {/* Text info */}
                        <div className="messages-inbox-item__content">
                          <div className="messages-inbox-item__row">
                            <span className="messages-inbox-item__company">{item.company}</span>
                            <div className="messages-inbox-item__meta">
                              <span className="messages-inbox-item__time">{item.time}</span>
                              {item.unreadCount ? (
                                <span className="messages-inbox-item__unread-dot">
                                  {item.unreadCount}
                                </span>
                              ) : null}
                            </div>
                          </div>

                          <div className="messages-inbox-item__role">{item.role}</div>
                          <div className="messages-inbox-item__preview">{item.lastMessage}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* ------------------------------------------------------------
                  Right Sub-column: Active Chat Messages & Input
                  ------------------------------------------------------------ */}
              <div className="messages-chat-pane">
                {/* Chat Pane Header */}
                <div className="messages-chat__header">
                  <div className="messages-chat__header-info">
                    <div className="messages-chat__header-logo" style={{ backgroundColor: '#4285F4' }}>
                      G
                    </div>
                    <div>
                      <div className="messages-chat__header-title-wrap">
                        <span className="messages-chat__header-title">Google</span>
                        <svg className="messages-chat__verified-icon" width="14" height="14" viewBox="0 0 24 24" fill="#3b82f6">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      </div>
                      <div className="messages-chat__header-role">Product Designer</div>
                    </div>
                  </div>

                  {/* Header actions (More options three dots) */}
                  <button
                    type="button"
                    className="messages-chat__more-btn"
                    title="More options"
                    onClick={() => showToast('Conversation options')}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#64748b">
                      <circle cx="12" cy="12" r="1.8" />
                      <circle cx="19" cy="12" r="1.8" />
                      <circle cx="5" cy="12" r="1.8" />
                    </svg>
                  </button>
                </div>

                {/* Messages Body Scroll Area */}
                <div className="messages-chat__messages-list">
                  {/* Date pill */}
                  <div className="messages-chat__date-pill-wrap">
                    <span className="messages-chat__date-pill">Today</span>
                  </div>

                  {/* Render messages */}
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`messages-chat-row ${msg.isCandidate ? 'messages-chat-row--outgoing' : 'messages-chat-row--incoming'}`}
                    >
                      {/* Incoming Avatar on Left */}
                      {!msg.isCandidate && (
                        <div
                          className="messages-chat-row__avatar"
                          style={{
                            backgroundColor: msg.senderAvatarBg,
                            color: msg.senderAvatarColor,
                          }}
                        >
                          {msg.senderInitials}
                        </div>
                      )}

                      {/* Bubble & Sender Info */}
                      <div className="messages-chat-row__bubble-wrap">
                        <div className="messages-chat-row__header">
                          <span className="messages-chat-row__sender">{msg.senderName}</span>
                          <span className="messages-chat-row__time">{msg.time}</span>
                        </div>

                        <div className={`messages-chat-bubble ${msg.isCandidate ? 'messages-chat-bubble--outgoing' : 'messages-chat-bubble--incoming'}`}>
                          {msg.paragraphs.map((p, pIdx) => (
                            <p key={pIdx} className="messages-chat-bubble__para">
                              {p}
                            </p>
                          ))}

                          {/* Embedded Google Meet Card */}
                          {msg.hasMeetCard && (
                            <div className="messages-meet-card">
                              <div className="messages-meet-card__left">
                                <div className="messages-meet-card__icon" aria-hidden="true">
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <rect x="2" y="5" width="13" height="14" rx="2" fill="#00832d" />
                                    <polygon points="16,9 22,5 22,19 16,15" fill="#0066da" />
                                    <circle cx="8.5" cy="12" r="2.5" fill="#ffffff" />
                                  </svg>
                                </div>
                                <div className="messages-meet-card__info">
                                  <div className="messages-meet-card__title">{msg.meetTitle}</div>
                                  <a
                                    href={msg.meetLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="messages-meet-card__link"
                                  >
                                    {msg.meetLink}
                                  </a>
                                </div>
                              </div>
                              <a
                                href={msg.meetLink}
                                target="_blank"
                                rel="noreferrer"
                                className="messages-meet-card__external-link"
                                title="Open meeting link in new tab"
                              >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                  <polyline points="15 3 21 3 21 9" />
                                  <line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                              </a>
                            </div>
                          )}

                          {msg.hasMeetCard && (
                            <p className="messages-chat-bubble__para" style={{ marginTop: '10px' }}>
                              You'll also receive a calendar invite. Let us know if you need to reschedule.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Outgoing Avatar on Right */}
                      {msg.isCandidate && (
                        <div
                          className="messages-chat-row__avatar"
                          style={{
                            backgroundColor: msg.senderAvatarBg,
                            color: msg.senderAvatarColor,
                          }}
                        >
                          {msg.senderInitials}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Bottom Message Composer */}
                <form className="messages-chat__composer" onSubmit={handleSendMessage}>
                  {/* Paperclip attachment icon */}
                  <button
                    type="button"
                    className="messages-chat__action-btn"
                    title="Attach file"
                    onClick={() => showToast('Attach file clicked')}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                    </svg>
                  </button>

                  {/* Message Input */}
                  <input
                    type="text"
                    placeholder="Write a message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="messages-chat__input"
                    id="messages-input-field"
                  />

                  {/* Emoji Button */}
                  <button
                    type="button"
                    className="messages-chat__action-btn"
                    title="Add emoji"
                    onClick={() => setInputMessage((prev) => prev + ' 😊')}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                      <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" strokeLinecap="round" />
                      <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </button>

                  {/* Send Button */}
                  <button
                    type="submit"
                    className="messages-chat__send-btn"
                    title="Send message"
                    id="messages-send-btn"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </main>

          {/* ================================================================
              RIGHT COLUMN — COMPANY, CONVERSATION & ACTIONS PANEL
              ================================================================ */}
          <aside className="messages-sidebar-right" aria-label="Conversation Details">
            {/* Main Details Card */}
            <div className="messages-details-card">
              {/* Header: Company & View Job */}
              <div className="messages-details__header">
                <div className="messages-details__company-info">
                  <div className="messages-details__logo" style={{ backgroundColor: '#4285F4' }}>
                    G
                  </div>
                  <div>
                    <div className="messages-details__name-wrap">
                      <span className="messages-details__company-name">Google</span>
                      <svg className="messages-details__verified-icon" width="13" height="13" viewBox="0 0 24 24" fill="#3b82f6">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    </div>
                    <div className="messages-details__role">Product Designer</div>
                  </div>
                </div>

                <Link to="/jobs/product-designer" className="messages-details__view-job-btn">
                  View Job
                </Link>
              </div>

              {/* Job Metadata Items */}
              <div className="messages-details__job-meta">
                <div className="messages-details__meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>Bengaluru, India</span>
                </div>

                <div className="messages-details__meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  <span>Full-time</span>
                </div>

                <div className="messages-details__meta-item">
                  <span className="messages-details__rupee-icon">₹</span>
                  <span>18L – 28L per annum</span>
                </div>
              </div>

              {/* Conversation Details Section */}
              <div className="messages-details__section">
                <h4 className="messages-details__section-title">Conversation details</h4>
                <div className="messages-details__table">
                  <div className="messages-details__table-row">
                    <span className="messages-details__table-label">Started on</span>
                    <span className="messages-details__table-val">12 Mar 2024</span>
                  </div>
                  <div className="messages-details__table-row">
                    <span className="messages-details__table-label">Related to</span>
                    <span className="messages-details__table-val">Product Designer</span>
                  </div>
                  <div className="messages-details__table-row">
                    <span className="messages-details__table-label">Status</span>
                    <span className="messages-details__status-badge">Active</span>
                  </div>
                </div>
              </div>

              {/* Notifications Section */}
              <div className="messages-details__section">
                <h4 className="messages-details__section-title">Notifications</h4>

                <div className="messages-details__notif-row">
                  <div>
                    <div className="messages-details__notif-label">Email notifications</div>
                    <div className="messages-details__notif-sub">Get notified about new messages.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="messages-details__checkbox"
                    id="checkbox-email-notif"
                  />
                </div>

                <div className="messages-details__notif-row">
                  <div>
                    <div className="messages-details__notif-label">Push notifications</div>
                    <div className="messages-details__notif-sub">Receive alerts on your device.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={pushNotifications}
                    onChange={(e) => setPushNotifications(e.target.checked)}
                    className="messages-details__checkbox"
                    id="checkbox-push-notif"
                  />
                </div>
              </div>

              {/* Actions Section */}
              <div className="messages-details__actions-list">
                <button
                  type="button"
                  className="messages-details__action-btn"
                  onClick={() => showToast('Conversation marked as unread')}
                  id="btn-mark-unread"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span>Mark as unread</span>
                </button>

                <button
                  type="button"
                  className="messages-details__action-btn"
                  onClick={() => showToast('Conversation archived')}
                  id="btn-archive"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="21 8 21 21 3 21 3 8" />
                    <rect x="1" y="3" width="22" height="5" />
                    <line x1="10" y1="12" x2="14" y2="12" />
                  </svg>
                  <span>Archive conversation</span>
                </button>

                <button
                  type="button"
                  className="messages-details__action-btn messages-details__action-btn--danger"
                  onClick={() => showToast('Report submitted for review')}
                  id="btn-report"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <span>Report conversation</span>
                </button>
              </div>
            </div>

            {/* Bottom Tip Card: Stay professional */}
            <div className="messages-tip-card" id="messages-tip-card">
              <div className="messages-tip-card__icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#3b82f6">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                  <line x1="12" y1="8" x2="12.01" y2="8" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="messages-tip-card__text">
                <div className="messages-tip-card__title">Stay professional</div>
                <div className="messages-tip-card__body">
                  Keep your communication professional and avoid sharing sensitive personal information.
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="messages-toast" role="status">
          {toastMessage}
        </div>
      )}
    </div>
  )
}
