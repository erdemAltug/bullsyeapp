# Bullsye Mobile

Expo Router + NativeWind + Zustand client for [bullsye.app](https://bullsye.app).

## Run

```bash
npm install
npx expo start
```

## API

Set `EXPO_PUBLIC_API_URL` (default `https://bullsye.app`). Polls `/api/market` every 10s.

## Store builds

```bash
npx eas build --platform all --profile production
```

Bundle ID / package: `com.bullsye.app`
