# AQA Playwright

Минимальные шаги для запуска проекта автотестов

## Требования

- Node.js 18+ (рекомендуется LTS)
- npm (устанавливается вместе с Node.js)

## Настройка окружения

1. Скопируйте файл `.env.dist` в `.env`.
2. Заполните переменные в `.env`:
   - `ENV` — имя окружения (например, `local`, `prod` ).
   - `USER_NAME` — логин пользователя для входа.
   - `USER_PASSWORD` — пароль пользователя.
   - `SALES_PORTAL_URL` — URL фронта портала продаж.
   - `SALES_PORTAL_API_URL` — URL API портала продаж.

## Установка зависимостей

```bash
npm install
```

При необходимости установите браузеры Playwright:

```bash
npx playwright install
```

## Запуск тестов

```bash
npm run test
```
