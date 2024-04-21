# Kukori gondolatmegosztó

## Feladatkiírás

A vizsgafeladat egy **Twitter klón** alkalmazás elkészítése, ahol a felhasználók bejelentkezés után tweeteket írhatnak, törölhetnek, módosíthatnak.  
Az összes felhasználót egy listaoldalon megjelenítjük, ez alapján mindenkinek a tweetje megtekinthető belépés nélkül is.

## Megjegyzés a `LokiStore` osztályhoz

A [`connect-loki`](https://www.npmjs.com/package/connect-loki?activeTab=readme) npm package-et akartam használni, de nem tudtam működésre bírni importtal és typescripttel. Ennek a forráskódját, plusz némi keresgélést és VSCode kódkiegészítést használva készült el a `LokiStore` osztály.

## Futtatáshoz

A `.env` fájlban a következő értékeknek kell szerepelni:

```
COOKIE_SECRET=...
PASS_SECRET=...
```

```
npm install
npm run build
npm run start
```

## Fejlesztés

Futtatás:

```
npm run dev
```

CSS újragenerálás:

```
npm run buildCss
```

Fordítás és futtatás

```
npm run build
npm run start
```

### Ikonok

https://icons.getbootstrap.com/?q=account
