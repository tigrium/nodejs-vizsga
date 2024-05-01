# Kukori gondolatmegosztó

[Rövid írás a Zod tapasztalatról](README_zod.md)

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

## Tesztelés

Több teszt parancs is van, attól függően, hogy csak tesztet futtat, vagy lefedettséget is vizsgál, illetve generál-e html inputot. (Értelem szerűen minél több mindent csinál, annál több ideig tart.)

```
npm run test
npm run test-html
npm run test-coverage
npm run test-coverage-html
```

### Megjegyzés

A tesztelést csak elkezdtem. Nyolc middleware-hez írtam teszteket. Volt benne object repository előállítás és a MW-ben importált függvény mockolása is (pl. `createPassRequestMW.test.ts`), sokféle expect. Úgy gondolom, hogy a többit is meg tudnám írni, de akkor nagyon last minute adnám le.

Ennyi tesztnél is jól látszik, hogy az object repository mock előállítását és a teszt adatokat máshogy kell megcsinálni, mert így nehezen átlátható.

Most a legtöbb libraryt importálom helyben, csak a uuid-t tettem  az object repositoryba. Csak a tesztelés miatt legközelebb nem tenném oda, mert nem tűnik vészesnek a mockolás, az `ObjectRepository` típust naprakészen tartani viszont elég nehézkesnek tűnt.

Bár néhány alkalommal már írtam unit tesztet, azért sok újdonságot próbáltam most ki a tesztelés során.  
Most Jestet használtam, mert azzal már találkoztam. A Mocha + Chai kombinációt is kóstolgattam már. Ha jól emlékszem, az egyik live-on az hangzott el, hogy a Jest a modernebb. Legközelebb talán kipróbálom a node saját test runnerjét is.