# RITPROGRAM

## Demo
https://iammille.github.io/Ritprogram/

Tillvägagångssätt
==================
Tekniken som använts för denna uppgiften är HTML5 och senaste Javascript ECMAScript 6.
Tanken är har varit att använda den senaste tekniken även om den inte fungerar i alla webbläsare. Anpassningen har därför blivit till Chrome. då den har bra stöd för de senaste funktionerna i båda HTML och Javscript.

Koden är tänkt att vara lättläst och därför har jag valt att dela upp Javascriptet i olika filer där jag döljer den “omständiga” koden ifrån själva applikationen som man kan följ i, näst in till, läsning som då blir enklare att tolka, följa och förstå.

Applikationen
====================
Applikationen ett väldigt enkelt ritprogram för geometriska figurer (enligt uppgift i skolan):
“Uppgiften handlar om att använda DOM-manipulation, Events och prototyper, samt rita på Canvas.”

Sidan består av ett stort canvas som täcker hela den synliga viewporten. Det finns en statusrad längst ner i sidfoten som hela tiden uppdateras beroende på vad man gör på sidan.

Det finns en knapp (enligt uppgiften) som visar menyn. Menyn innehåller olika knappar för att rita element. En färgväljare finns för att välja färg på det man ritar. Det finns knappar för att rita figurerna Cirkel, Triangel, Rectangle och Polygon. Man kan även importera och exportera det man ritat via JSON. Det finns också en knapp för att rensa canvasen.

HTML
===========
Fokus har varit att använda HTML5 och alla dess finesser. Vissa av dessa har ännu ej fullständigt stöd i alla webbläsare men har alltså ändå använts för denna uppgiften. Ett exempel på detta är taggen <dialog> och <input> av typen “color”, som är en färgväljare.
För att få HTML-koden så ren så möjlig har jag undvikit att sätta några id på HTML-taggarna även om det i andra, större, projekt vore att föredra.

CSS
=============
Ingen vikt har lagts designen.
Enkel flexbox används till sidfoten. Keyframes används för att rulla ner menyn.

JavaScript
===============
Javascripten består av tre filer. Koden har delats upp i olika filer för att separera applikationens funktion ifrån de bakomliggande, svårtolkade, faktiska handlingarna. Koden blir på så sätt mer lättläst. Filernas är uppdelade enligt följande:

- myApp.js - innehåller alla händelserna och mekaniken
- myAppClasses.js - innehåller de tre klasserna för Statusbar, Canvas och Mouse
- myAppShapes.js - innehåller objekten för de geometriska figurerna.

myApps.js
--------------
Två enkla globala funktioner har skrivits för att slippa använda det långa DOM-selector funktionerna, som “document.getElementByTagName()”, m.fl.

  function $(str)  { return document.querySelector(str);    }
  function $$(str) { return document.querySelectorAll(str); }

Notera alltså att ingen jQuery används i denna labben utan allt är native Javascript utan några hjälpbibliotek överhuvudtaget.

Tanken har för övrigt varit att minimera användandet av globala variabler i största möjliga  utsträckning.

myAppClasses.js
-----------------------
Här finns klasserna för Statusbar, Canvas och Mouse.

Dessa är skrivna med ECMAScript 6’s class deklaration. Dom är både enkla att förstå och koden blir mer lättläst. Dock har dessa ej stöd för MSIE 11 och Opera Mini.

Jag valde att dela upp dessa då de är egna “delar” i programmet som bör hålla koll på sina egna inställningar och sin inre status.

myAppShapes.js
-----------------------
Denna fil innehåller koden som används för att skapa de geometriska figurerna från Lab 2.
Tanken har varit att göra minimal inverkan på denna filen.

De ändringar som gjorts är på konstruktorerna. Istället för att ta emot flera parametrar med koordinater tar de nu emot en Array.

Vidare finns det nu en ny metod för alla figurerna, draw(), som används till att rita upp objektet på canvas.

DEMO
==================
[Klicka här för att se demo](https://iammille.github.io/Ritprogram/)
