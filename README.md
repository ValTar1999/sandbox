# SMART Hub — UI prototype

Интерактивный прототип фронтенда финтех-платформы SMART Hub: работа с кредиторской и
дебиторской задолженностью, справочник вендоров, платёжные предпочтения SMART Exchange
и администрирование пользователей.

Живая сборка: https://ValTar1999.github.io/sandbox

> **Это прототип интерфейса, а не приложение с бэкендом.** Сетевых запросов в проекте нет:
> все данные приходят из мок-файлов `data.ts` рядом со страницами, а загрузка имитируется
> таймаутом. Глобального стора тоже нет — состояние живёт в компонентах.

## Стек

- React 19 + TypeScript 5.7 (strict)
- Vite 6 — сборка и dev-сервер
- Tailwind CSS 4 через `@tailwindcss/vite`
- React Router 7 (`BrowserRouter` с `basename="/sandbox"`)
- Floating UI — позиционирование селектов, меню и тултипов
- Heroicons + SVG-спрайты, DOMPurify для санитизации HTML в описаниях

## Команды

```bash
npm install       # установка зависимостей
npm run dev       # dev-сервер с HMR
npm run build     # tsc -b + vite build, затем postbuild создаёт dist/404.html
npm run preview   # локальный просмотр production-сборки
npm run lint      # ESLint
npm run format    # Prettier: отформатировать файлы
npm run format:check  # Prettier: только проверить, ничего не менять
npm run deploy    # ручной деплой в ветку gh-pages
```

Проверка типов отдельной командой не нужна — `npm run build` запускает `tsc -b` перед сборкой.

## Структура `src`

| Каталог                    | Содержимое                                                                                                                                                                  |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pages/`                   | Страницы-роуты по доменам: `BillsPayables`, `InvoicesReceivables`, `Payment`, `Vendors`, `SmartExchange`, `UserManagment`, `Profile`. Рядом с каждой лежит её мок-`data.ts` |
| `modals/`                  | Модальные окна приложения, все на общей обёртке из `components/common/modal`                                                                                                |
| `components/common/base/`  | Примитивы дизайн-системы: `Button`, `Input`, `Select`, `Menu`, `Tooltip`, `Badge`, таблицы                                                                                  |
| `components/common/modal/` | Трёхуровневый стек модалок: `LayoutModal` → `WrapModal` / `Modal`                                                                                                           |
| `components/layout/`       | Каркас: `Sidebar`, `Header`, `Breadcrumb`, `Box`                                                                                                                            |
| `enums/`                   | Токены вариантов и размеров (`Button`, `Badge`, `Icon`, `Avatar`) в виде map'ов Tailwind-классов                                                                            |
| `config/`, `constants/`    | Общие классы фокуса и ссылок, стили таблиц, тайминги анимаций                                                                                                               |
| `hooks/`                   | `useDraftState` (черновик/сохранение), `useLoadingTransition`                                                                                                               |
| `context/`                 | `SmartExchangeSetupAlertContext` — состояние алертов настройки SMART Exchange                                                                                               |
| `layout/Layout.tsx`        | Общая обёртка роутов: сайдбар, хедер и `<Outlet />`                                                                                                                         |

Роуты объявлены в [src/App.tsx](src/App.tsx); страницы загружаются лениво через `lazy()`.

## Деплой

Основной путь — GitHub Actions (`.github/workflows/deploy.yml`) при пуше в `main`.
Подробности, ручной вариант и разбор типичных проблем — в [DEPLOY.md](DEPLOY.md).

Два момента, важных для GitHub Pages:

- `base: '/sandbox/'` в [vite.config.ts](vite.config.ts) должен совпадать с именем репозитория
  и с `basename` роутера в [src/main.tsx](src/main.tsx)
- скрипт `postbuild` копирует `index.html` в `dist/404.html` — без этого прямые ссылки
  вида `/sandbox/payables` отдавали бы 404, потому что Pages не умеет history fallback

## CI

`.github/workflows/ci.yml` на каждый push и pull request в `main` выполняет `npm ci`,
`npm run lint` и `npm run build` на Node 20.
