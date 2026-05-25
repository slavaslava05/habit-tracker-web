import { NavLink, Outlet } from 'react-router-dom';
import {
  faChartSimple,
  faGear,
  faListCheck,
  faSun,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { AppIcon } from '@/components/icons/AppIcon';
import { NotificationBanner } from '@/components/NotificationBanner';

const navItems: { to: string; label: string; icon: IconDefinition }[] = [
  { to: '/', label: 'Сегодня', icon: faSun },
  { to: '/habits', label: 'Привычки', icon: faListCheck },
  { to: '/stats', label: 'Статистика', icon: faChartSimple },
  { to: '/settings', label: 'Настройки', icon: faGear },
];

export function AppShell() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row max-w-app mx-auto w-full">
      <aside className="hidden lg:flex lg:flex-col lg:w-56 lg:shrink-0 border-r border-warm-200/80 dark:border-warm-800 p-4 gap-1">
        <div className="mb-6 px-2">
          <h1 className="font-display text-xl font-semibold text-sage-700 dark:text-sage-300">
            Habit Tracker
          </h1>
          <p className="text-xs text-warm-800/60 dark:text-warm-200/50 mt-0.5">Забота о себе</p>
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-card px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-sage-100 text-sage-800 dark:bg-sage-900/40 dark:text-sage-200'
                  : 'text-warm-800/80 hover:bg-warm-200/60 dark:text-warm-200/70 dark:hover:bg-warm-800'
              }`
            }
          >
            <AppIcon icon={item.icon} size="md" />
            {item.label}
          </NavLink>
        ))}
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <NotificationBanner />
        <main className="flex-1 px-4 py-4 pb-24 lg:pb-6 lg:max-w-3xl lg:mx-auto lg:w-full">
          <Outlet />
        </main>

        <nav
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-warm-200/80 dark:border-warm-800 bg-warm-50/95 dark:bg-warm-900/95 backdrop-blur safe-bottom"
          aria-label="Основная навигация"
        >
          <div className="flex h-14 max-w-app mx-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex flex-1 min-w-0 flex-col items-center justify-center gap-0.5 px-1 text-[10px] leading-tight transition-colors ${
                    isActive ? 'text-sage-600 dark:text-sage-400' : 'text-warm-800/60'
                  }`
                }
              >
                <AppIcon icon={item.icon} size="md" />
                <span className="truncate max-w-full">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
