# Habit Tracker — Web MVP

Трекер привычек для браузера: расписания, ежедневный чек-лист, стрики, аналитика за 7/30 дней, галерея обложек и локальные напоминания. Данные хранятся только на устройстве (IndexedDB + localStorage).

![Скриншот главного экрана](./docs/screenshots/today.png)
![Скриншот статистики](./docs/screenshots/stats.png)

## Стек

- **Vite** + **React 18** + **TypeScript**
- **Zustand** — состояние
- **idb** — IndexedDB
- **React Router** — SPA (history mode)
- **Tailwind CSS** — стили
- **date-fns** — даты
- **Vitest** — тесты расписаний и стриков
- **vite-plugin-pwa** — Service Worker (офлайн после первой загрузки)

## Локальный запуск

```bash
cd habit-tracker-web
npm install
npm run dev
```

Сборка:

```bash
npm run build
npm run preview
```

Тесты:

```bash
npm test
```

## Деплой на Netlify (подробно)

### Подготовка

1. Убедитесь, что проект собирается локально:

```bash
cd habit-tracker-web
npm install
npm run build
```

В папке `dist/` должны появиться `index.html`, `assets/`, `sw.js`.

2. Залейте код в **GitHub / GitLab / Bitbucket** (отдельный репозиторий или монорепо с корнем в `habit-tracker-web`).

---

### Вариант A — деплой из Git (рекомендуется)

1. Откройте [https://app.netlify.com](https://app.netlify.com) и войдите (GitHub-аккаунт удобнее всего).
2. **Add new site** → **Import an existing project**.
3. Выберите Git-провайдер и репозиторий с этим проектом.
4. Настройки сборки Netlify подхватит из `netlify.toml`, но проверьте вручную:

| Поле | Значение |
|------|----------|
| **Base directory** | `habit-tracker-web` *(если репозиторий — весь portfolio; иначе оставьте пустым)* |
| **Build command** | `npm run build` |
| **Publish directory** | `habit-tracker-web/dist` или `dist` *(с учётом base directory)* |
| **Node version** | 20 или 22 *(Site settings → Environment → `NODE_VERSION` = `22`)* |

5. **Deploy site** — первая сборка займёт 1–3 минуты.
6. После деплоя откройте URL вида `https://random-name-123.netlify.app`.
7. *(Опционально)* **Domain management** → привяжите свой домен или переименуйте поддомен Netlify.

**Автодеплой:** каждый push в выбранную ветку (обычно `main`) пересобирает сайт.

**SPA-маршруты:** файлы `netlify.toml` и `public/_redirects` перенаправляют все пути на `index.html`, чтобы работали `/habits`, `/settings` и т.д.

---

### Вариант B — ручная загрузка (без Git)

1. Локально: `npm run build`.
2. В Netlify: **Add new site** → **Deploy manually** (или [Netlify Drop](https://app.netlify.com/drop)).
3. Перетащите папку **`dist`** целиком в окно браузера.
4. Сайт опубликуется за несколько секунд. Для обновлений повторяйте шаги 1–3.

---

### Вариант C — Netlify CLI

```bash
npm install -g netlify-cli
cd habit-tracker-web
npm run build
netlify login
netlify init    # привязка к новому или существующему сайту
netlify deploy --prod
```

---

### Частые проблемы

| Симптом | Решение |
|---------|---------|
| 404 на `/habits` после обновления страницы | Проверьте `public/_redirects` и `[[redirects]]` в `netlify.toml` |
| Build failed: `npm: not found` | В Netlify: **Environment variables** → `NODE_VERSION` = `22` |
| Пустая страница | **Publish directory** должен указывать на `dist`, не на корень репо |
| Старый кэш PWA | DevTools → Application → Clear storage или жёсткое обновление |

---

### Проверка после деплоя

- [ ] Открывается главная «Сегодня»
- [ ] Создание привычки и перезагрузка страницы сохраняют данные
- [ ] Переход по прямой ссылке `/habits/new` не даёт 404
- [ ] В Settings экспорт JSON скачивает файл

## Функции MVP

| Область | Реализовано |
|--------|-------------|
| CRUD привычек | Название, описание, категории (системные + свои), расписания |
| Расписания | Ежедневно, по дням недели, каждые N дней, по числам месяца |
| Сегодня | Чек-лист с бинарной и количественной отметкой, прогресс дня |
| Аналитика | Стрики, % за 7/30 дней, bar chart, heatmap 30 дней |
| Галерея | 24 образа по категориям + загрузка своего (base64, ≤512 КБ) |
| Напоминания | Web Notifications API (пока вкладка активна) |
| Данные | Экспорт JSON/CSV, импорт JSON, сброс, демо-seed |
| Тема | Светлая / тёмная / системная |

## Ограничения web-версии

- **Нет backend** — нет синхронизации между устройствами, OAuth и push через FCM/APNs.
- **Уведомления** срабатывают по таймеру в открытой вкладке; в фоне без сервера браузер не гарантирует доставку.
- **Данные** привязаны к браузеру и origin; очистка сайта удалит IndexedDB.
- **Свои картинки** хранятся в IndexedDB (base64), не на сервере.

## Roadmap (будущие версии)

- [ ] Backend API + PostgreSQL, синхронизация между устройствами
- [ ] Регистрация (email, Google/Apple OAuth)
- [ ] Push-уведомления (FCM / APNs)
- [ ] Социальные комнаты привычек
- [ ] AI-ассистент с рекомендациями
- [ ] Интеграции Apple Health / Health Connect / календари
- [ ] Динамические стрики (skip tokens, freeze)
- [ ] Шаблоны привычек под цели

Архитектура store и типов `AppData` рассчитана на последующее подключение API без переписывания UI.

## Структура проекта

```
src/
  components/   # UI, layout, gallery, charts
  pages/        # Today, Habits, Form, Detail, Stats, Settings
  hooks/        # images, notifications
  store/        # Zustand + persistence
  lib/          # schedule, streak, export, dates
  types/
  assets/gallery/
```

## Скриншоты (placeholder)

Добавьте PNG в `docs/screenshots/`:

- `today.png` — экран «Сегодня»
- `stats.png` — статистика
- `habit-detail.png` — детали привычки

## Лицензия

MIT — портфолио-проект.
