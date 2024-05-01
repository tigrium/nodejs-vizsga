# Zod tapasztalatok

https://zod.dev/

## Előzetes ismereteim

Eddig még nem haszáltam input ellenőrző könyvtárat, így összehasonlítani nem tudom semmivel.

## Input schema definíciók

Még a middleware-ek kódolása előtt elkészítetem a `src/service/models.ts` fájlt az adatbázis adatstruktúráival és a `src/service/inputSchemas.ts` fájlt a klienstől érkező adatoknak.

A dokumentáció "Basic usage" leírását nézegettem hozzá, de leginkább ebből a cikkből (vagy egy nagyon hasonlóból) értettem meg, mégis hogyan kell egy ilyet elképzelni: https://dev.to/thatmwcoder/getting-started-with-zod-1il1

## Input validálás

A `src/service/inputCheck.ts` fájlban definiáltam egy függvényt, ami megkapja paraméterben az ellenőrizni kívánt adatot (lehet, `object`, `string`, bármi) és egy `ZodType` típusú Zod schema definíciót. Ez annyit tesz, hogy megpróbálja parse-olni a kapott adatot a schema szerint. Ha eközben hibát dob, akkor a kapott hibák üzeneteit (ezeket a schema definícióknál én adtam meg) összegyűjti egy tömbben és visszaadja.

A dobott hibában sokkal több adat van, de én ezekkel nem foglalkoztam.

## Összegzés

A linkelt leírás alapján, sőt, csak a minta kódja alapján is elég jól el tudtam indulni a használatával.

Kerestem olyan megoldásokat, mint TypeScriptben az `Omit<T, Keys>` vagy a `Partial<T>`. Úgy rémlik, hogy nem találtam ilyet, de most rákeresve egyből meglett (https://zod.dev/?id=pickomit). Talán túl fáradt voltam, mikor először nekiláttam. Ha legközelebb Zod-ot használok, biztos használni fogom őket. A típusok kinyerése is érdekesnek tűnik. Most egyszerűbbnek tűnt külön definiálni őket, mivel nagyon változatosak voltak és talán egy sem egyezett meg pontosan (+id, 2x pass, stb.).