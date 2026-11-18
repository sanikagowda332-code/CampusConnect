import { useEffect, useMemo, useState } from 'react'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowDownRight, ArrowRight, Bell, BookOpen, BriefcaseBusiness, CalendarDays,
  Check, ChevronRight, CircleUserRound, Clock3, Code2, Compass, GraduationCap,
  LogOut, Mail, MapPin, Menu, Plus, Search, ShieldCheck, Sparkles,
  Trash2, Users, X,
} from 'lucide-react'
import './App.css'

const initialAnnouncements = [
  { id: 'a1', title: 'Welcome to the new semester', category: 'Campus', date: 'Nov 12, 2026', body: 'A new semester brings fresh ideas and opportunities. Check your department notice board for the academic calendar and class updates.' },
  { id: 'a2', title: 'Internship applications are open', category: 'Placements', date: 'Nov 10, 2026', body: 'The Training & Placement Cell invites eligible students to apply for current internship opportunities. Visit the placements desk for details.' },
  { id: 'a3', title: 'Library hours extended this week', category: 'Academics', date: 'Nov 08, 2026', body: 'The central library will remain open until 8:00 PM during the assessment preparation period.' },
]
const initialEvents = [
  { id: 'e1', title: 'CodeSprint 2026', category: 'Technology', date: 'Nov 28, 2026', time: '9:30 AM', location: 'CSE Innovation Lab', description: 'A day of creative problem solving, team challenges and building useful things.' },
  { id: 'e2', title: 'Campus Connect: Open Mic', category: 'Culture', date: 'Dec 03, 2026', time: '4:00 PM', location: 'Open Air Theatre', description: 'An evening for music, poetry and stories from our campus community.' },
  { id: 'e3', title: 'Design Thinking Workshop', category: 'Workshop', date: 'Dec 08, 2026', time: '10:00 AM', location: 'Seminar Hall 2', description: 'Learn to turn real-world problems into thoughtful, human-centred solutions.' },
]
const initialMaterials = [
  { id: 'm1', title: 'Data Structures — Study Guide', category: 'Computer Science', description: 'Core concepts, revision prompts and practice topics for the semester.' },
  { id: 'm2', title: 'Placement Preparation Toolkit', category: 'Career readiness', description: 'A curated starting point for aptitude, interview and resume preparation.' },
]
const initialClubs = [
  { name: 'GDG on Campus', category: 'Technology', icon: Code2, text: 'Learn, build and grow with a community exploring Google technologies.' },
  { name: 'RIT Creative Collective', category: 'Arts & culture', icon: Sparkles, text: 'A space for campus creatives to share ideas and make things together.' },
  { name: 'RIT Sports Circle', category: 'Sports', icon: Compass, text: 'Find teammates, discover activities and make time to play.' },
]
const storageKeys = {
  students: 'campusconnect_students',
  current: 'campusconnect_current_student',
  admin: 'campusconnect_admin_session',
  announcements: 'campusconnect_announcements',
  events: 'campusconnect_events',
  materials: 'campusconnect_materials',
  registrations: 'campusconnect_event_registrations',
}
const readStored = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch (error) {
    console.warn(`Could not read ${key} from localStorage.`, error)
    return fallback
  }
}

function useStoredState(key, fallback) {
  const [value, setValue] = useState(() => readStored(key, fallback))
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(`Could not save ${key} to localStorage.`, error)
    }
  }, [key, value])
  return [value, setValue]
}

function InstitutionalLogos() {
  return (
    <div className="institutional-logos" aria-label="Institutional logos">
      <div className="institutional-logo">
        <img src="/logos/rit-logo.jpeg" alt="Rajeev Institute of Technology logo" />
        <span>Rajeev Institute of Technology, Hassan</span>
      </div>
      <div className="institutional-logo">
        <img src="/logos/cse-logo.jpeg" alt="Computer Science and Engineering department logo" />
        <span>Department of Computer Science and Engineering</span>
      </div>
      <div className="institutional-logo">
        <img src="/logos/gdg-logo.jpeg" alt="GDG on Campus logo" />
        <span>GDG on Campus</span>
      </div>
    </div>
  )
}

function Header({ currentUser, onLogout, isAdmin }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const publicLinks = [
    ['About RIT', '#about'], ['Departments', '#departments'], ['Campus Life', '#campus-life'],
    ['Events', '#events'], ['Announcements', '#announcements'], ['Gallery', '#gallery'], ['Contact', '#contact'],
  ]
  return (
    <header className="site-header">
      <div className="header-top">
        <Link className="brand" to="/" aria-label="CampusConnect home">
          <img className="brand-symbol brand-logo" src="/logos/gdg-logo.jpeg" alt="GDG on Campus logo" />
          <span>Campus<span className="brand-accent">Connect</span><small>STUDENT HUB</small></span>
        </Link>
        <button className="menu-toggle icon-button" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <div className="header-actions">
          {isAdmin ? <Link className="button button-outline small" to="/admin">Admin dashboard</Link>
            : currentUser ? <Link className="button button-outline small" to="/portal">My portal</Link>
              : <Link className="button button-primary small" to="/portal">Student portal <ArrowRight size={15} /></Link>}
          {(currentUser || isAdmin) && <button className="button button-quiet small" onClick={onLogout}><LogOut size={15} /> Sign out</button>}
        </div>
      </div>
      <nav className={`main-nav${menuOpen ? ' open' : ''}`} aria-label="Main navigation">
        {publicLinks.map(([label, target]) => <a key={target} href={location.pathname === '/' ? target : `/${target}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
        <Link className="nav-portal" to="/portal" onClick={() => setMenuOpen(false)}>Student Hub <ChevronRight size={14} /></Link>
      </nav>
    </header>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link className="brand brand-light" to="/">
            <span className="brand-symbol"><GraduationCap size={24} /></span>
            <span>Campus<span className="brand-accent">Connect</span><small>SMART STUDENT HUB</small></span>
          </Link>
          <p>One campus. Many possibilities.<br />A smarter way to stay connected at RIT.</p>
        </div>
        <div className="footer-links"><strong>Explore</strong><a href="/#about">About RIT</a><a href="/#events">Events</a><a href="/#announcements">Announcements</a><a href="/#contact">Contact</a></div>
        <div className="footer-contact"><strong>Find us</strong><p><MapPin size={16} /> Rajiv Institute of Technology<br />Hassan, Karnataka, India</p><p><Mail size={16} /> CampusConnect student hub</p></div>
        <div className="footer-identity"><strong>Institutional partners</strong><InstitutionalLogos /></div>
      </div>
      <div className="footer-bottom"><span>© 2026 CampusConnect · Student demo platform</span><span>Not an official RIT authentication or information service.</span></div>
    </footer>
  )
}

function SectionHeading({ eyebrow, title, text, action }) {
  return <div className="section-heading">
    <div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{text && <p className="section-intro">{text}</p>}</div>
    {action}
  </div>
}

function EventCard({ event, onRegister, registered }) {
  return <article className="event-card">
    <div className="event-date"><span>{event.date.split(' ')[0]}</span><strong>{event.date.split(' ')[1]?.replace(',', '')}</strong><small>{event.date.split(' ')[2]}</small></div>
    <div className="event-content"><span className="category-pill">{event.category}</span><h3>{event.title}</h3><p>{event.description}</p>
      <div className="event-meta"><span><Clock3 size={15} />{event.time}</span><span><MapPin size={15} />{event.location}</span></div>
      <button className={`text-action${registered ? ' registered' : ''}`} onClick={onRegister}>{registered ? <><Check size={16} /> Registered</> : <>Register for event <ArrowRight size={16} /></>}</button>
    </div>
  </article>
}

function ContactSection() {
  const [messages, setMessages] = useStoredState('campusconnect_contact_messages', [])
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const submit = (event) => {
    event.preventDefault()
    setMessages([{ ...form, id: `c${Date.now()}`, date: new Date().toISOString() }, ...messages])
    setForm({ name: '', email: '', message: '' })
    setSubmitted(true)
  }
  return <section className="contact-section page-section" id="contact"><div className="contact-inner">
    <div><p className="eyebrow eyebrow-light">LET'S CONNECT</p><h2>Your campus life<br />has a home here.</h2><p>Have a question or an idea for the student hub? Send a note to the demo inbox.</p></div>
    <form className="contact-form" onSubmit={submit}><div className="contact-form-row"><label>Your name<input value={form.name} onChange={event => { setForm({ ...form, name: event.target.value }); setSubmitted(false) }} required /></label><label>Email<input type="email" value={form.email} onChange={event => { setForm({ ...form, email: event.target.value }); setSubmitted(false) }} required /></label></div><label>Your message<textarea rows="3" value={form.message} onChange={event => { setForm({ ...form, message: event.target.value }); setSubmitted(false) }} required /></label><div className="contact-submit-row"><button className="button button-light" type="submit">Send message <ArrowRight size={16} /></button>{submitted && <span role="status">Saved to this browser’s demo inbox.</span>}</div><small>Demo only: messages are saved locally and are not sent to RIT.</small></form>
  </div></section>
}

function HomePage({ announcements, events, currentUser, registrations, onRegister }) {
  const navigate = useNavigate()
  const registerFromPublic = (eventId) => {
    if (!currentUser) {
      navigate('/portal', { state: { notice: 'Sign in or create a student account to register for events.' } })
      return
    }
    onRegister(eventId)
  }
  const departments = ['Computer Science & Engineering', 'Electronics & Communication', 'Mechanical Engineering', 'Civil Engineering', 'Electrical & Electronics Engineering']
  return (
    <main>
      <section className="hero-section" id="home">
        <div className="hero-copy">
          <div className="hero-kicker"><span className="live-dot" /> CAMPUSCONNECT · STUDENT HUB</div>
          <h1>GDG on Campus</h1>
          <p className="hero-affiliation">– Rajeev Institute of Technology (RIT), Hassan</p>
          <h2 className="hero-tagline">Your campus, closer than <span>ever.</span></h2>
          <p>From the next big campus event to the notes you need right now — find your student community, all in one place.</p>
          <div className="hero-buttons"><a className="button button-primary" href="#events">Explore campus <ArrowRight size={17} /></a><Link className="button button-outline" to="/portal">Open student hub <ArrowDownRight size={17} /></Link></div>
          <div className="hero-proof"><div className="proof-avatars"><span>R</span><span>C</span><span>+</span></div><p><strong>Made for RIT students</strong><br />A connected campus starts here</p></div>
        </div>
        <div className="hero-art" aria-label="CampusConnect student community illustration">
          <div className="art-glow" /><div className="art-card art-card-top"><span className="art-icon cyan"><CalendarDays size={20} /></span><span><b>Campus, in sync</b><small>Events · updates · community</small></span><span className="art-check"><Check size={15} /></span></div>
          <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
          <div className="art-monogram"><div className="monogram-cap"><GraduationCap size={67} strokeWidth={1.3} /></div><div className="monogram-lines"><span /><span /><span /></div></div>
          <div className="art-card art-card-bottom"><span className="art-icon navy"><Users size={20} /></span><span><b>Find your people</b><small>One student hub for RIT</small></span><ArrowRight size={17} /></div>
          <span className="art-spark spark-one">✳</span><span className="art-spark spark-two">✦</span>
          <div className="art-caption">CAMPUS LIFE, CONNECTED <span>01 — 06</span></div>
        </div>
        <div className="hero-bottom"><span>DISCOVER</span><span className="hero-bottom-line" /><span>YOUR NEXT CHAPTER STARTS HERE</span></div>
      </section>

      <section className="trust-strip"><span>YOUR CAMPUS, ONE PLACE</span><strong>Events</strong><i /> <strong>People</strong><i /> <strong>Opportunities</strong><i /> <strong>Updates</strong></section>

      <section className="section about-section page-section" id="about">
        <div className="about-visual"><div className="about-graphic"><span className="graphic-orbit" /><div className="graphic-center"><GraduationCap size={54} /><span>RIT<br /><small>HASSAN</small></span></div><div className="graphic-label label-top">LEARN TOGETHER</div><div className="graphic-label label-bottom">BUILD WHAT'S NEXT</div><div className="graphic-dot dot-a" /><div className="graphic-dot dot-b" /></div><div className="visual-note"><span>01</span><span>Rooted in learning.<br />Built for connection.</span></div></div>
        <div className="about-copy"><p className="eyebrow">ABOUT RIT</p><h2>A place to learn.<br />A community to <span>belong.</span></h2><p>Rajiv Institute of Technology is a centre for engineering education in Hassan, Karnataka. CampusConnect brings the student experience into focus — helping students discover what’s happening, find the resources they need and take part in campus life.</p><p className="muted-note">CampusConnect is an independent student demo project and is not an official RIT website.</p><a className="text-action" href="#departments">Explore RIT <ArrowRight size={16} /></a></div>
      </section>

      <section className="section departments-section page-section" id="departments">
        <SectionHeading eyebrow="LEARN & GROW" title="Departments at RIT" text="Explore the engineering disciplines that shape tomorrow's problem solvers." />
        <div className="department-grid">{departments.map((dept, index) => <article className="department-card" key={dept}><span className="dept-number">0{index + 1}</span><div className="dept-icon"><BookOpen size={22} /></div><h3>{dept}</h3><span className="dept-link">Discover your path <ArrowRight size={15} /></span></article>)}</div>
      </section>

      <section className="campus-section page-section" id="campus-life">
        <div className="campus-section-inner"><div className="campus-intro"><p className="eyebrow eyebrow-light">MORE THAN CLASSROOMS</p><h2>Make room for<br /><span>what moves you.</span></h2><p>Meet people who share your curiosity. Try something new. Make the most of every part of campus.</p><a className="button button-light" href="#clubs">Find your community <ArrowRight size={16} /></a></div>
          <div className="campus-points"><article><span>01</span><div><h3>Find your people</h3><p>Discover student clubs, shared interests and a community that feels like yours.</p></div><Users size={22} /></article><article><span>02</span><div><h3>Show up & take part</h3><p>Keep up with campus events, workshops, competitions and gatherings.</p></div><CalendarDays size={22} /></article><article><span>03</span><div><h3>Build your next step</h3><p>Explore learning resources, internships and opportunities to grow.</p></div><BriefcaseBusiness size={22} /></article></div>
        </div>
      </section>

      <section className="section events-section page-section" id="events">
        <SectionHeading eyebrow="WHAT'S HAPPENING" title="Mark your calendar" text="Good things happen when you show up. Find your next campus moment." action={<Link className="text-action" to="/portal">View all events <ArrowRight size={16} /></Link>} />
        <div className="events-grid">{events.slice(0, 3).map(event => <EventCard key={event.id} event={event} registered={registrations.includes(event.id)} onRegister={() => registerFromPublic(event.id)} />)}</div>
      </section>

      <section className="announcement-section page-section" id="announcements">
        <div className="section announcement-layout"><div className="announcement-title"><p className="eyebrow">THE LATEST</p><h2>On campus,<br /><span>right now.</span></h2><p>Stay in the loop with timely updates from your student community.</p><Link className="text-action" to="/portal">All announcements <ArrowRight size={16} /></Link></div>
          <div className="announcement-list">{announcements.slice(0, 3).map((item, index) => <article className="announcement-item" key={item.id}><span className="announcement-index">0{index + 1}</span><div><span className="category-pill">{item.category}</span><h3>{item.title}</h3><p>{item.body}</p><small>{item.date}</small></div><ArrowDownRight className="announcement-arrow" size={19} /></article>)}</div>
        </div>
      </section>

      <section className="section clubs-section page-section" id="clubs">
        <SectionHeading eyebrow="FIND YOUR PEOPLE" title="A campus with many passions" text="There’s more than one way to find your place. Start with what you love." action={<Link className="text-action" to="/portal">Explore student hub <ArrowRight size={16} /></Link>} />
        <div className="club-grid">{initialClubs.map(({ name, category, icon: Icon, text }, index) => <article className={`club-card club-card-${index + 1}`} key={name}><span className="club-card-icon"><Icon size={22} /></span><span className="club-category">{category}</span><h3>{name}</h3><p>{text}</p><Link to="/portal" aria-label={`Learn about ${name}`}><ArrowRight size={18} /></Link></article>)}</div>
      </section>

      <section className="section gallery-section page-section" id="gallery">
        <SectionHeading eyebrow="A FEEL FOR CAMPUS" title="The moments in between" text="The best campus memories are made together." />
        <div className="gallery-grid"><div className="gallery-tile gallery-tile-large"><div className="gallery-art gallery-art-one"><div className="gallery-sun" /><div className="gallery-building"><i /><i /><i /><i /><i /><i /></div><div className="gallery-ground" /></div><span>01 / CAMPUS DAYS</span></div><div className="gallery-tile"><div className="gallery-art gallery-art-two"><div className="gallery-circle" /><Sparkles size={42} /></div><span>02 / IDEAS IN MOTION</span></div><div className="gallery-tile"><div className="gallery-art gallery-art-three"><div className="gallery-book book-one" /><div className="gallery-book book-two" /><BookOpen size={39} /></div><span>03 / LEARN TOGETHER</span></div></div>
      </section>

      <ContactSection />
    </main>
  )
}

function AuthPage({ students, onRegister, onLogin, notice }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', studentId: '', department: '', year: '', password: '' })
  const [error, setError] = useState('')
  const [info, setInfo] = useState(notice || '')
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const submit = (event) => {
    event.preventDefault()
    setError('')
    if (mode === 'register') {
      if (form.name.trim().length < 2) return setError('Enter your full name (at least 2 characters).')
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Enter a valid email address.')
      if (!form.studentId.trim()) return setError('Enter your student ID.')
      if (!form.department) return setError('Choose your department.')
      if (!form.year) return setError('Choose your year of study.')
      if (form.password.length < 8) return setError('Your password must be at least 8 characters.')
      if (students.some(student => student.email.toLowerCase() === form.email.toLowerCase() || student.studentId.toLowerCase() === form.studentId.toLowerCase())) return setError('An account already exists with this email or student ID.')
      onRegister({ ...form, name: form.name.trim(), email: form.email.trim().toLowerCase(), studentId: form.studentId.trim() })
    } else {
      if (!form.email || !form.password) return setError('Enter your email and password.')
      const student = students.find(item => item.email.toLowerCase() === form.email.trim().toLowerCase() && item.password === form.password)
      if (!student) return setError('We couldn’t find a matching demo account. Check your details or register.')
      onLogin(student)
    }
  }
  return <main className="auth-page"><div className="auth-aside"><div className="auth-aside-content"><span className="auth-logo"><GraduationCap size={28} /></span><p className="eyebrow eyebrow-light">THE STUDENT HUB</p><h1>Your RIT<br />community,<br /><span>all connected.</span></h1><p>Sign in to find events, discover resources and keep up with campus life.</p><div className="auth-aside-note"><ShieldCheck size={18} /><span>Demo authentication<br /><small>Accounts stay in this browser only.</small></span></div></div><div className="auth-aside-orbit" /></div>
    <div className="auth-card-wrap"><div className="auth-card"><span className="auth-mobile-logo"><GraduationCap size={24} /> CampusConnect</span><p className="eyebrow">{mode === 'login' ? 'WELCOME BACK' : 'JOIN YOUR COMMUNITY'}</p><h2>{mode === 'login' ? 'Sign in to your hub' : 'Create your student account'}</h2><p className="auth-description">This is a demo student account, not official college authentication.</p>
      <div className="auth-tabs"><button className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError(''); setInfo('') }}>Sign in</button><button className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setError(''); setInfo('') }}>Create account</button></div>
      {info && <p className="form-message success-message"><Bell size={16} />{info}</p>}
      <form className="auth-form" onSubmit={submit} noValidate>
        {mode === 'register' && <>
          <label>Full name<input name="name" value={form.name} onChange={update} placeholder="e.g. Ananya Rao" autoComplete="name" /></label>
          <label>Student ID<input name="studentId" value={form.studentId} onChange={update} placeholder="Your college ID" /></label>
        </>}
        <label>College email<input name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" autoComplete="email" /></label>
        {mode === 'register' && <div className="form-row"><label>Department<select name="department" value={form.department} onChange={update}><option value="">Select department</option><option>Computer Science & Engineering</option><option>Electronics & Communication</option><option>Mechanical Engineering</option><option>Civil Engineering</option><option>Electrical & Electronics Engineering</option><option>Other</option></select></label><label>Year<select name="year" value={form.year} onChange={update}><option value="">Select year</option><option>1st year</option><option>2nd year</option><option>3rd year</option><option>4th year</option></select></label></div>}
        <label>Password<input name="password" type="password" value={form.password} onChange={update} placeholder={mode === 'register' ? 'At least 8 characters' : 'Enter your password'} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} /></label>
        {error && <p className="form-message error-message">{error}</p>}
        <button className="button button-primary auth-submit" type="submit">{mode === 'login' ? 'Sign in to student hub' : 'Create demo account'} <ArrowRight size={16} /></button>
      </form><p className="auth-privacy"><ShieldCheck size={15} /> Demo only. Credentials are stored locally in this browser.</p>
    </div></div>
  </main>
}

function StudentDashboard({ student, onLogout, announcements, events, materials, registrations, onRegister, onUpdateProfile }) {
  const [tab, setTab] = useState('Overview')
  const [search, setSearch] = useState('')
  const [profileSaved, setProfileSaved] = useState(false)
  const items = ['Overview', 'Events', 'Announcements', 'Study materials', 'Careers', 'Clubs', 'My profile']
  const filteredAnnouncements = announcements.filter(item => `${item.title} ${item.body} ${item.category}`.toLowerCase().includes(search.toLowerCase()))
  const registeredEvents = events.filter(event => registrations.includes(event.id))
  const changeTab = (next) => { setTab(next); setSearch('') }
  return <main className="dashboard-page"><div className="dashboard-top"><div><p className="eyebrow">STUDENT HUB · DEMO ACCOUNT</p><h1>Welcome back, {student.name.split(' ')[0]}<span>.</span></h1><p>Your campus, one step closer.</p></div><button className="button button-outline small" onClick={onLogout}><LogOut size={15} /> Sign out</button></div>
    <div className="dashboard-layout"><aside className="dashboard-sidebar"><div className="student-mini"><span className="student-avatar">{student.name.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase()}</span><div><strong>{student.name}</strong><small>{student.studentId} · {student.year}</small></div></div><nav className="dashboard-menu">{items.map((item, index) => { const Icon = [CircleUserRound, CalendarDays, Bell, BookOpen, BriefcaseBusiness, Users, CircleUserRound][index]; return <button key={item} className={tab === item ? 'active' : ''} onClick={() => changeTab(item)}><Icon size={17} />{item}{item === 'Events' && registrations.length > 0 && <span className="menu-count">{registrations.length}</span>}</button> })}</nav><div className="demo-notice"><ShieldCheck size={16} /><p><strong>Demo portal</strong><br />Data is saved in this browser only.</p></div></aside>
      <section className="dashboard-main">
        {tab === 'Overview' && <><div className="dashboard-welcome"><div><span className="eyebrow eyebrow-light">YOUR CAMPUS, CONNECTED</span><h2>Make today count.</h2><p>Catch up on campus and find your next opportunity.</p></div><div className="welcome-icon"><GraduationCap size={47} /></div></div>
          <div className="stat-grid"><button className="stat-card" onClick={() => changeTab('Events')}><span className="stat-icon cyan"><CalendarDays size={19} /></span><strong>{events.length}</strong><span>Upcoming events</span></button><button className="stat-card" onClick={() => changeTab('Events')}><span className="stat-icon violet"><Check size={19} /></span><strong>{registrations.length}</strong><span>My registrations</span></button><button className="stat-card" onClick={() => changeTab('Announcements')}><span className="stat-icon amber"><Bell size={19} /></span><strong>{announcements.length}</strong><span>Campus updates</span></button></div>
          <div className="dashboard-block"><div className="dash-block-heading"><div><p className="eyebrow">DON'T MISS</p><h3>Coming up at RIT</h3></div><button className="text-action" onClick={() => changeTab('Events')}>All events <ArrowRight size={15} /></button></div><div className="dashboard-events">{events.slice(0, 2).map(event => <EventCard key={event.id} event={event} registered={registrations.includes(event.id)} onRegister={() => onRegister(event.id)} />)}</div></div>
          <div className="dashboard-block announcement-preview"><div className="dash-block-heading"><div><p className="eyebrow">CAMPUS BULLETIN</p><h3>Latest announcements</h3></div><button className="text-action" onClick={() => changeTab('Announcements')}>See all <ArrowRight size={15} /></button></div>{announcements.slice(0, 2).map(item => <article className="compact-announcement" key={item.id}><span className="announcement-dot" /><div><strong>{item.title}</strong><p>{item.body}</p></div><small>{item.date}</small></article>)}</div>
        </>}
        {tab === 'Events' && <><div className="dash-page-heading"><div><p className="eyebrow">GET INVOLVED</p><h2>Events & experiences</h2><p>Discover what’s coming up and reserve your place.</p></div></div>{registeredEvents.length > 0 && <div className="registered-banner"><Check size={18} /> You’re registered for {registeredEvents.length} event{registeredEvents.length === 1 ? '' : 's'}.</div>}<div className="dashboard-events full">{events.map(event => <EventCard key={event.id} event={event} registered={registrations.includes(event.id)} onRegister={() => onRegister(event.id)} />)}</div></>}
        {tab === 'Announcements' && <><div className="dash-page-heading"><div><p className="eyebrow">CAMPUS BULLETIN</p><h2>Announcements</h2><p>Important updates for the RIT community.</p></div><label className="search-field"><Search size={16} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search updates" /></label></div><div className="portal-announcement-list">{filteredAnnouncements.map(item => <article className="portal-announcement" key={item.id}><div className="portal-announcement-top"><span className="category-pill">{item.category}</span><small>{item.date}</small></div><h3>{item.title}</h3><p>{item.body}</p></article>)}{filteredAnnouncements.length === 0 && <div className="empty-state">No announcements match your search.</div>}</div></>}
        {tab === 'Study materials' && <><div className="dash-page-heading"><div><p className="eyebrow">LEARN AT YOUR PACE</p><h2>Study materials</h2><p>Student-shared resources and revision starting points.</p></div></div><div className="resource-grid">{materials.map(item => <article className="resource-card" key={item.id}><span className="resource-icon"><BookOpen size={21} /></span><span className="category-pill">{item.category}</span><h3>{item.title}</h3><p>{item.description}</p><span className="resource-caption">DEMO RESOURCE · CHECK WITH YOUR DEPARTMENT FOR OFFICIAL MATERIALS</span></article>)}</div>{materials.length === 0 && <div className="empty-state">No materials have been added yet.</div>}</>}
        {tab === 'Careers' && <><div className="dash-page-heading"><div><p className="eyebrow">YOUR NEXT STEP</p><h2>Internships & placements</h2><p>Explore career preparation and keep track of opportunities.</p></div></div><div className="career-callout"><span className="career-icon"><BriefcaseBusiness size={25} /></span><div><span className="category-pill">CAREER READINESS</span><h3>Get ready for what’s next</h3><p>Start with your resume, practice explaining your projects and connect with your department’s placement coordinator for verified opportunities.</p><a href="/#contact" className="text-action">Ask a question <ArrowRight size={15} /></a></div></div><div className="career-steps"><article><span>01</span><h3>Prepare your profile</h3><p>Keep your skills, projects and experience up to date.</p></article><article><span>02</span><h3>Build your skills</h3><p>Use workshops and peer learning to practice consistently.</p></article><article><span>03</span><h3>Verify opportunities</h3><p>Confirm roles with official college placement coordinators.</p></article></div></>}
        {tab === 'Clubs' && <><div className="dash-page-heading"><div><p className="eyebrow">CAMPUS COMMUNITY</p><h2>Student clubs</h2><p>Find a community, explore a new interest and make something together.</p></div></div><div className="club-grid portal-clubs">{initialClubs.map(({ name, category, icon: Icon, text }) => <article className="club-card" key={name}><span className="club-card-icon"><Icon size={22} /></span><span className="club-category">{category}</span><h3>{name}</h3><p>{text}</p><a href="/#contact" className="text-action">Contact the hub team <ArrowRight size={15} /></a></article>)}</div></>}
        {tab === 'My profile' && <ProfileForm student={student} onSave={(details) => { onUpdateProfile(details); setProfileSaved(true); setTimeout(() => setProfileSaved(false), 2500) }} saved={profileSaved} />}
      </section>
    </div>
  </main>
}

function ProfileForm({ student, onSave, saved }) {
  const [profile, setProfile] = useState({ name: student.name, studentId: student.studentId, email: student.email, department: student.department, year: student.year })
  const update = (event) => setProfile({ ...profile, [event.target.name]: event.target.value })
  return <div className="profile-panel"><div className="dash-page-heading"><div><p className="eyebrow">YOUR DETAILS</p><h2>My profile</h2><p>Update your student hub profile.</p></div></div><form onSubmit={event => { event.preventDefault(); onSave(profile) }}><label>Full name<input name="name" value={profile.name} onChange={update} required minLength="2" /></label><label>Student ID<input name="studentId" value={profile.studentId} onChange={update} required /></label><label>Email<input value={profile.email} disabled /></label><label>Department<select name="department" value={profile.department} onChange={update}><option>Computer Science & Engineering</option><option>Electronics & Communication</option><option>Mechanical Engineering</option><option>Civil Engineering</option><option>Electrical & Electronics Engineering</option><option>Other</option></select></label><label>Year<select name="year" value={profile.year} onChange={update}><option>1st year</option><option>2nd year</option><option>3rd year</option><option>4th year</option></select></label><button className="button button-primary" type="submit">Save profile <Check size={16} /></button>{saved && <span className="profile-saved">Profile saved.</span>}</form></div>
}

function AdminPage({ admin, setAdmin, students, announcements, setAnnouncements, events, setEvents, materials, setMaterials, registrations }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [tab, setTab] = useState('Overview')
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [announcementForm, setAnnouncementForm] = useState({ title: '', category: '', body: '' })
  const [eventForm, setEventForm] = useState({ title: '', category: '', date: '', time: '', location: '', description: '' })
  const [materialForm, setMaterialForm] = useState({ title: '', category: '', description: '' })
  const [editingEvent, setEditingEvent] = useState(null)
  const nav = ['Overview', 'Announcements', 'Events', 'Study materials', 'Student registrations']
  const login = (event) => {
    event.preventDefault()
    if (credentials.email.trim().toLowerCase() !== 'admin@rit.edu' || credentials.password !== 'RIT2026') {
      setError('Demo sign-in failed. Use the demo credentials shown below.')
      return
    }
    setError('')
    setAdmin(true)
  }
  const saveAnnouncement = (event) => {
    event.preventDefault()
    if (editing) {
      setAnnouncements(announcements.map(item => item.id === editing ? { ...item, ...announcementForm } : item))
      setEditing(null)
    } else {
      setAnnouncements([{ ...announcementForm, id: `a${Date.now()}`, date: new Intl.DateTimeFormat('en', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date()) }, ...announcements])
    }
    setAnnouncementForm({ title: '', category: '', body: '' })
  }
  const saveEvent = (event) => {
    event.preventDefault()
    if (editingEvent) {
      setEvents(events.map(item => item.id === editingEvent ? { ...item, ...eventForm } : item))
      setEditingEvent(null)
    } else setEvents([{ ...eventForm, id: `e${Date.now()}` }, ...events])
    setEventForm({ title: '', category: '', date: '', time: '', location: '', description: '' })
  }
  const saveMaterial = (event) => {
    event.preventDefault()
    setMaterials([{ ...materialForm, id: `m${Date.now()}` }, ...materials])
    setMaterialForm({ title: '', category: '', description: '' })
  }
  if (!admin) return <main className="admin-login-page"><div className="admin-login-card"><span className="admin-lock"><ShieldCheck size={24} /></span><p className="eyebrow">CAMPUSCONNECT · DEMO ADMIN</p><h1>Admin sign in</h1><p>Use the demo account to manage student hub content on this device.</p><form onSubmit={login}><label>Admin email<input type="email" value={credentials.email} onChange={event => setCredentials({ ...credentials, email: event.target.value })} placeholder="admin@rit.edu" required /></label><label>Password<input type="password" value={credentials.password} onChange={event => setCredentials({ ...credentials, password: event.target.value })} placeholder="Demo password" required /></label>{error && <p className="form-message error-message">{error}</p>}<button className="button button-primary auth-submit" type="submit">Sign in to admin dashboard <ArrowRight size={16} /></button></form><div className="admin-demo-creds"><strong>Demo credentials</strong><span>admin@rit.edu</span><span>RIT2026</span></div><p className="admin-warning"><ShieldCheck size={14} /> Demo only. Not connected to RIT systems.</p></div></main>
  return <main className="dashboard-page admin-page"><div className="dashboard-top"><div><p className="eyebrow">CAMPUSCONNECT · ADMIN DEMO</p><h1>Admin dashboard<span>.</span></h1><p>Manage student hub content stored in this browser.</p></div><button className="button button-outline small" onClick={() => setAdmin(false)}><LogOut size={15} /> Sign out</button></div>
    <div className="dashboard-layout"><aside className="dashboard-sidebar"><div className="admin-profile"><span className="admin-profile-icon"><ShieldCheck size={19} /></span><div><strong>Hub administrator</strong><small>Local demo session</small></div></div><nav className="dashboard-menu">{nav.map((item, index) => { const Icon = [CircleUserRound, Bell, CalendarDays, BookOpen, Users][index]; return <button key={item} className={tab === item ? 'active' : ''} onClick={() => { setTab(item); setEditing(null); setEditingEvent(null) }}><Icon size={17} />{item}</button> })}</nav><div className="demo-notice"><ShieldCheck size={16} /><p><strong>Demo controls</strong><br />Changes are saved in this browser only.</p></div></aside>
      <section className="dashboard-main">
        {tab === 'Overview' && <><div className="dash-page-heading"><div><p className="eyebrow">OVERVIEW</p><h2>Content at a glance</h2><p>Quick view of CampusConnect activity in this browser.</p></div></div><div className="admin-stat-grid"><article><span><Users size={18} /></span><strong>{students.length}</strong><small>Student accounts</small></article><article><span><CalendarDays size={18} /></span><strong>{events.length}</strong><small>Upcoming events</small></article><article><span><Bell size={18} /></span><strong>{announcements.length}</strong><small>Announcements</small></article><article><span><Check size={18} /></span><strong>{registrations.length}</strong><small>Event registrations</small></article></div><div className="admin-quick-actions"><h3>Manage hub content</h3><p>Create and update the information students see in their portal.</p><div><button className="button button-primary" onClick={() => setTab('Announcements')}><Plus size={16} /> Add announcement</button><button className="button button-outline" onClick={() => setTab('Events')}><CalendarDays size={16} /> Manage events</button></div></div></>}
        {tab === 'Announcements' && <><div className="dash-page-heading"><div><p className="eyebrow">CONTENT MANAGEMENT</p><h2>Announcements</h2><p>Add, edit or remove campus updates.</p></div></div><form className="admin-form" onSubmit={saveAnnouncement}><h3>{editing ? 'Edit announcement' : 'Add an announcement'}</h3><label>Title<input value={announcementForm.title} onChange={event => setAnnouncementForm({ ...announcementForm, title: event.target.value })} placeholder="Announcement title" required /></label><label>Category<input value={announcementForm.category} onChange={event => setAnnouncementForm({ ...announcementForm, category: event.target.value })} placeholder="e.g. Campus, Academics" required /></label><label>Message<textarea rows="3" value={announcementForm.body} onChange={event => setAnnouncementForm({ ...announcementForm, body: event.target.value })} placeholder="Write the announcement..." required /></label><div className="form-actions"><button className="button button-primary" type="submit"><Plus size={16} />{editing ? 'Save changes' : 'Publish announcement'}</button>{editing && <button className="button button-outline" type="button" onClick={() => { setEditing(null); setAnnouncementForm({ title: '', category: '', body: '' }) }}>Cancel</button>}</div></form><div className="admin-content-list">{announcements.map(item => <article key={item.id}><div><span className="category-pill">{item.category}</span><h3>{item.title}</h3><p>{item.body}</p><small>{item.date}</small></div><div className="content-actions"><button className="icon-button" aria-label={`Edit ${item.title}`} onClick={() => { setEditing(item.id); setAnnouncementForm({ title: item.title, category: item.category, body: item.body }) }}><BookOpen size={16} /></button><button className="icon-button danger" aria-label={`Delete ${item.title}`} onClick={() => { setAnnouncements(announcements.filter(entry => entry.id !== item.id)); if (editing === item.id) setEditing(null) }}><Trash2 size={16} /></button></div></article>)}</div></>}
        {tab === 'Events' && <><div className="dash-page-heading"><div><p className="eyebrow">CONTENT MANAGEMENT</p><h2>Events</h2><p>Create and manage events visible to students.</p></div></div><form className="admin-form" onSubmit={saveEvent}><h3>{editingEvent ? 'Edit event' : 'Add an event'}</h3><div className="form-row"><label>Event title<input value={eventForm.title} onChange={event => setEventForm({ ...eventForm, title: event.target.value })} placeholder="Event title" required /></label><label>Category<input value={eventForm.category} onChange={event => setEventForm({ ...eventForm, category: event.target.value })} placeholder="e.g. Workshop" required /></label></div><div className="form-row"><label>Date<input value={eventForm.date} onChange={event => setEventForm({ ...eventForm, date: event.target.value })} placeholder="Nov 28, 2026" required /></label><label>Time<input value={eventForm.time} onChange={event => setEventForm({ ...eventForm, time: event.target.value })} placeholder="10:00 AM" required /></label><label>Location<input value={eventForm.location} onChange={event => setEventForm({ ...eventForm, location: event.target.value })} placeholder="Venue" required /></label></div><label>Description<textarea rows="2" value={eventForm.description} onChange={event => setEventForm({ ...eventForm, description: event.target.value })} placeholder="Describe the event" required /></label><div className="form-actions"><button className="button button-primary" type="submit"><Plus size={16} />{editingEvent ? 'Save event' : 'Add event'}</button>{editingEvent && <button className="button button-outline" type="button" onClick={() => { setEditingEvent(null); setEventForm({ title: '', category: '', date: '', time: '', location: '', description: '' }) }}>Cancel</button>}</div></form><div className="admin-content-list">{events.map(item => <article key={item.id}><div><span className="category-pill">{item.category}</span><h3>{item.title}</h3><p>{item.date} · {item.time} · {item.location}</p><p>{item.description}</p></div><div className="content-actions"><button className="icon-button" aria-label={`Edit ${item.title}`} onClick={() => { setEditingEvent(item.id); setEventForm({ title: item.title, category: item.category, date: item.date, time: item.time, location: item.location, description: item.description }) }}><BookOpen size={16} /></button><button className="icon-button danger" aria-label={`Delete ${item.title}`} onClick={() => setEvents(events.filter(entry => entry.id !== item.id))}><Trash2 size={16} /></button></div></article>)}</div></>}
        {tab === 'Study materials' && <><div className="dash-page-heading"><div><p className="eyebrow">CONTENT MANAGEMENT</p><h2>Study materials</h2><p>Add or remove student learning resources.</p></div></div><form className="admin-form" onSubmit={saveMaterial}><h3>Add a study material</h3><label>Title<input value={materialForm.title} onChange={event => setMaterialForm({ ...materialForm, title: event.target.value })} placeholder="Resource title" required /></label><label>Category<input value={materialForm.category} onChange={event => setMaterialForm({ ...materialForm, category: event.target.value })} placeholder="e.g. Computer Science" required /></label><label>Description<textarea rows="2" value={materialForm.description} onChange={event => setMaterialForm({ ...materialForm, description: event.target.value })} placeholder="Short description" required /></label><button className="button button-primary" type="submit"><Plus size={16} /> Add material</button></form><div className="admin-content-list">{materials.map(item => <article key={item.id}><div><span className="category-pill">{item.category}</span><h3>{item.title}</h3><p>{item.description}</p></div><button className="icon-button danger" aria-label={`Delete ${item.title}`} onClick={() => setMaterials(materials.filter(entry => entry.id !== item.id))}><Trash2 size={16} /></button></article>)}</div></>}
        {tab === 'Student registrations' && <><div className="dash-page-heading"><div><p className="eyebrow">STUDENT ACTIVITY</p><h2>Student registrations</h2><p>Student accounts and event registrations on this demo device.</p></div></div>{students.length === 0 ? <div className="empty-state">No students have registered in this browser yet.</div> : <div className="student-table-wrap"><table className="student-table"><thead><tr><th>Student</th><th>Student ID</th><th>Department</th><th>Year</th><th>Registered events</th></tr></thead><tbody>{students.map(student => { const count = student.eventIds?.length || 0; return <tr key={student.studentId}><td><strong>{student.name}</strong><small>{student.email}</small></td><td>{student.studentId}</td><td>{student.department}</td><td>{student.year}</td><td>{count}</td></tr> })}</tbody></table></div>}</>}
      </section>
    </div>
  </main>
}

function App() {
  const [students, setStudents] = useStoredState(storageKeys.students, [])
  const [currentUserId, setCurrentUserId] = useStoredState(storageKeys.current, '')
  const [admin, setAdmin] = useStoredState(storageKeys.admin, false)
  const [announcements, setAnnouncements] = useStoredState(storageKeys.announcements, initialAnnouncements)
  const [events, setEvents] = useStoredState(storageKeys.events, initialEvents)
  const [materials, setMaterials] = useStoredState(storageKeys.materials, initialMaterials)
  const [registrations, setRegistrations] = useStoredState(storageKeys.registrations, {})
  const currentUser = useMemo(() => students.find(student => student.studentId === currentUserId) || null, [students, currentUserId])
  const userRegistrations = currentUser ? registrations[currentUser.studentId] || [] : []
  const location = useLocation()
  const navigate = useNavigate()

  const registerStudent = (student) => {
    setStudents(previous => [...previous, { ...student, eventIds: [] }])
    setCurrentUserId(student.studentId)
    navigate('/portal')
  }
  const loginStudent = (student) => {
    setCurrentUserId(student.studentId)
    navigate('/portal')
  }
  const registerForEvent = (eventId) => {
    if (!currentUser) {
      navigate('/portal', { state: { notice: 'Sign in or create a student account to register for events.' } })
      return
    }
    setRegistrations(previous => ({ ...previous, [currentUser.studentId]: [...new Set([...(previous[currentUser.studentId] || []), eventId])] }))
    setStudents(previous => previous.map(student => student.studentId === currentUser.studentId ? { ...student, eventIds: [...new Set([...(student.eventIds || []), eventId])] } : student))
  }
  const logout = () => {
    setCurrentUserId('')
    setAdmin(false)
    navigate('/')
  }
  return <div className="app"><Header currentUser={currentUser} onLogout={logout} isAdmin={admin} />
    <Routes>
      <Route path="/" element={<HomePage announcements={announcements} events={events} currentUser={currentUser} registrations={userRegistrations} onRegister={registerForEvent} />} />
      <Route path="/portal" element={currentUser ? <StudentDashboard student={currentUser} onLogout={logout} announcements={announcements} events={events} materials={materials} registrations={userRegistrations} onRegister={registerForEvent} onUpdateProfile={details => setStudents(previous => previous.map(student => student.studentId === currentUser.studentId ? { ...student, ...details } : student))} /> : <AuthPage key={location.key} students={students} onRegister={registerStudent} onLogin={loginStudent} notice={location.state?.notice} />} />
      <Route path="/admin" element={<AdminPage admin={admin} setAdmin={setAdmin} students={students} announcements={announcements} setAnnouncements={setAnnouncements} events={events} setEvents={setEvents} materials={materials} setMaterials={setMaterials} registrations={registrations} />} />
      <Route path="*" element={<main className="not-found"><span>404</span><h1>That page isn’t here.</h1><Link className="button button-primary" to="/">Back to home <ArrowRight size={16} /></Link></main>} />
    </Routes>
    <Footer />
  </div>
}

export default App
