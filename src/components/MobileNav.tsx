import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, TrendingUp, Mic, Menu, X,
  Star, Settings, User, Shield, HelpCircle, Layers,
  Puzzle, Keyboard, Flame, LogOut, ClipboardList,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/App';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Bottom bar items (5 max) ───────────────────────────────────────────────── */
const BAR_ITEMS = [
  { to: '/',            label: 'Home',    icon: LayoutDashboard, exact: true,  prefix: '/'         },
  { to: '/words',       label: 'Words',   icon: BookOpen,        exact: false, prefix: '/words'    },
  { to: '/study/level', label: 'Journey', icon: TrendingUp,      exact: false, prefix: '/study'    },
  { to: '/roleplay',    label: 'Speak',   icon: Mic,             exact: false, prefix: '/roleplay' },
  { to: '__menu__',     label: 'More',    icon: Menu,            exact: false, prefix: '__menu__'  },
];

export function MobileNav() {
  const { currentUser, logout } = useAuth();
  const { vocabulary } = useApp();
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const profile = vocabulary.profile;

  return (
    <>
      {/* ── Bottom navigation bar ─────────────────────────────────────────── */}
      <nav className="sidebar-mobile fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 mobile-nav-safe">
        <div className="flex items-stretch justify-around px-1 pt-1 pb-[max(0.25rem,env(safe-area-inset-bottom))]">
          {BAR_ITEMS.map(item => {
            if (item.to === '__menu__') {
              return (
                <button
                  key="menu"
                  onClick={() => setDrawerOpen(true)}
                  className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[10px] font-medium transition-all
                    ${drawerOpen ? 'text-[#00B4D8] bg-white/5' : 'text-white/40 hover:text-white/70'}`}
                >
                  <Menu className={`h-5 w-5 ${drawerOpen ? 'text-[#00B4D8]' : ''}`} strokeWidth={drawerOpen ? 2 : 1.5} />
                  <span>More</span>
                </button>
              );
            }
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.prefix);
            return (
              <NavLink key={item.to} to={item.to} end={item.exact}
                className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[10px] font-medium transition-all
                  ${active ? 'text-[#00B4D8] bg-white/5' : 'text-white/40 hover:text-white/70'}`}
              >
                <item.icon className={`h-5 w-5 ${active ? 'text-[#00B4D8]' : ''}`} strokeWidth={active ? 2 : 1.5} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* ── Full-screen drawer for "More" ──────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
              onClick={() => setDrawerOpen(false)}
            />

            {/* Drawer panel slides up from bottom */}
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[70] bg-[#1A1A2E] rounded-t-2xl pb-[env(safe-area-inset-bottom)]"
              style={{ maxHeight: '85vh', overflowY: 'auto' }}
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="h-1 w-10 rounded-full bg-white/20" />
              </div>

              {/* User profile strip */}
              <div className="flex items-center gap-3 px-5 py-3 border-b border-white/10">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0
                  ${currentUser?.role === 'admin' ? 'bg-[#F5A623]' : 'bg-[#4A90E2]'}`}>
                  {profile.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{profile.username}</p>
                  <div className="flex items-center gap-1 text-[11px] text-white/40">
                    <Flame className="h-3 w-3 text-[#00B4D8]" />
                    <span>{profile.currentStreak}d streak</span>
                    {currentUser?.role === 'admin' && (
                      <span className="ml-2 px-1.5 py-0.5 rounded bg-[#F5A623]/20 text-[#00B4D8] text-[10px] font-bold">ADMIN</span>
                    )}
                  </div>
                </div>
                <button onClick={() => setDrawerOpen(false)}
                  className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                  <X className="h-4 w-4 text-white/60" />
                </button>
              </div>

              {/* Nav sections */}
              <div className="px-4 py-3 space-y-4">

                {/* Library */}
                <DrawerSection label="Library">
                  <DrawerLink to="/favorites"  icon={Star}          label="Favorites"     onNav={() => setDrawerOpen(false)} pathname={pathname} />
                  <DrawerLink to="/pretest"    icon={ClipboardList} label="Pre-Test"      onNav={() => setDrawerOpen(false)} pathname={pathname} />
                </DrawerSection>

                {/* Study modes */}
                <DrawerSection label="Study">
                  <DrawerLink to="/study/flashcards" icon={Layers}    label="Flashcards"  onNav={() => setDrawerOpen(false)} pathname={pathname} />
                  <DrawerLink to="/study/quiz"       icon={HelpCircle} label="Quiz"       onNav={() => setDrawerOpen(false)} pathname={pathname} />
                  <DrawerLink to="/study/matching"   icon={Puzzle}    label="Matching"    onNav={() => setDrawerOpen(false)} pathname={pathname} />
                  <DrawerLink to="/study/spelling"   icon={Keyboard}  label="Spelling"    onNav={() => setDrawerOpen(false)} pathname={pathname} />
                </DrawerSection>

                {/* Account */}
                <DrawerSection label="Account">
                  <DrawerLink to="/settings"   icon={Settings} label="Settings"    onNav={() => setDrawerOpen(false)} pathname={pathname} />
                  <DrawerLink to="/my-account" icon={User}     label="My Account"  onNav={() => setDrawerOpen(false)} pathname={pathname} />
                  {currentUser?.role === 'admin' && (
                    <DrawerLink to="/admin" icon={Shield} label="Admin Panel" onNav={() => setDrawerOpen(false)} pathname={pathname} accent />
                  )}
                </DrawerSection>

                {/* Sign out */}
                <div className="pt-2 pb-3">
                  <button
                    onClick={() => { setDrawerOpen(false); logout(); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm font-medium"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function DrawerSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 px-2 mb-1.5">{label}</p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function DrawerLink({ to, icon: Icon, label, onNav, pathname, accent }: {
  to: string; icon: React.ElementType; label: string;
  onNav: () => void; pathname: string; accent?: boolean;
}) {
  const active = pathname === to || pathname.startsWith(to + '/');
  return (
    <NavLink to={to} onClick={onNav}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors
        ${active ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
    >
      {active && <div className="absolute left-4 h-4 w-[3px] rounded-r-full bg-[#F5A623]" />}
      <Icon className={`h-5 w-5 flex-shrink-0 ${accent || active ? 'text-[#00B4D8]' : ''}`} strokeWidth={1.5} />
      <span className={accent ? 'text-[#00B4D8]' : ''}>{label}</span>
    </NavLink>
  );
}
