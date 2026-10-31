import { EngTopic, mc, fill, fills, pick, joinBi } from "../kit";

const topic: EngTopic = {
  code: "2.7",
  title: { ru: "Грамматика в контексте: сравнение, артикли, предлоги, модальные", kk: "Контекстегі грамматика: салыстыру, артикль, предлогтар, модальдық етістіктер" },
  explanation: joinBi(
    {
      ru: `На экзамене встречаются предложения с пропуском, где нужно выбрать правильную грамматическую форму. Ниже — минимум, который нужно знать.

### Степени сравнения прилагательных
:::figure {"kind":"table","caption":"Comparatives and superlatives","rows":[["Тип","Сравнительная (…er / more)","Превосходная (the …est / the most)"],["Короткие (1 слог)","tall → taller than","tall → the tallest"],["На -e","large → larger","large → the largest"],["На -y","happy → happier","happy → the happiest"],["Короткие CVC","big → bigger","big → the biggest"],["Длинные (2+ слога)","beautiful → more beautiful","beautiful → the most beautiful"],["Исключения","good → better","good → the best"],["Исключения","bad → worse","bad → the worst"]]}
:::

### Артикли a / an / the
- **a / an** — один из многих, впервые: I have **a** dog.
- **the** — известный, уникальный: **the** sun, **the** teacher we met yesterday; with superlatives: **the** best.
- Без артикля: имена, большинство стран и городов, виды спорта, языки (*play football, speak Kazakh*).

### Предлоги времени
**at** + точное время (at 5 o'clock, at night) · **on** + день, дата (on Monday, on 5th May) · **in** + месяц, год, сезон, часть дня (in May, in 2020, in winter, in the morning).

### Модальные глаголы
:::figure {"kind":"table","caption":"Modal verbs","rows":[["can / can't","умение, возможность","She can swim."],["must / mustn't","долг, запрет","You must wear a seatbelt."],["should / shouldn't","совет","You should drink water."],["may / could","разрешение, просьба","May I come in?"],["have to","обязанность (не от говорящего)","I have to get up early."]]}
:::

:::warn Ловушка
После модальных глаголов — глагол **без to и без -s**: *She can **play**.* (не *can plays*, не *can to play*). Исключение — **have to / ought to**.
:::

:::tip Лайфхак
**than** — всегда после сравнительной степени: *taller **than** me*. **the** — всегда перед превосходной: *the **oldest** student*.
:::`,
      kk: `Емтиханда бос орын қалдырылған сөйлемдер болады, онда дұрыс грамматикалық форманы таңдау керек. Төменде міндетті минимум берілген.

### Сын есімнің салыстыру дәрежелері
:::figure {"kind":"table","caption":"Comparatives and superlatives","rows":[["Түрі","Салыстырмалы (…er / more)","Күшейтпелі (the …est / the most)"],["Қысқа (1 буынды)","tall → taller than","tall → the tallest"],["-e-мен аяқталса","large → larger","large → the largest"],["-y-мен аяқталса","happy → happier","happy → the happiest"],["Қысқа CVC","big → bigger","big → the biggest"],["Ұзын (2+ буынды)","beautiful → more beautiful","beautiful → the most beautiful"],["Ерекшеліктер","good → better","good → the best"],["Ерекшеліктер","bad → worse","bad → the worst"]]}
:::

### Артикльдер a / an / the
- **a / an** — көптің бірі, алғаш рет: I have **a** dog.
- **the** — белгілі, бірегей: **the** sun, **the** teacher we met yesterday; күшейтпелі дәрежемен: **the** best.
- Артикльсіз: есімдер, көп ел мен қала, спорт түрлері, тілдер (*play football, speak Kazakh*).

### Уақыт предлогтары
**at** + нақты уақыт (at 5 o'clock, at night) · **on** + күн, дата (on Monday, on 5th May) · **in** + ай, жыл, маусым, тәулік бөлігі (in May, in 2020, in winter, in the morning).

### Модальдық етістіктер
:::figure {"kind":"table","caption":"Modal verbs","rows":[["can / can't","қабілет, мүмкіндік","She can swim."],["must / mustn't","парыз, тыйым","You must wear a seatbelt."],["should / shouldn't","кеңес","You should drink water."],["may / could","рұқсат, өтініш","May I come in?"],["have to","міндет (сөйлеушіден емес)","I have to get up early."]]}
:::

:::warn Қателік
Модальдық етістіктерден кейін — **to-сыз және -s-сіз** етістік: *She can **play**.* (*can plays* емес, *can to play* емес). Ерекшелік — **have to / ought to**.
:::

:::tip Кеңес
**than** — әрқашан салыстырмалы дәрежеден кейін: *taller **than** me*. **the** — әрқашан күшейтпелі дәреже алдында: *the **oldest** student*.
:::`,
    },
  ),
  practice: [
    fill("1", "Write the comparative: tall → ______ than", "taller", "Короткое прилагательное + -er.", "Қысқа сын есім + -er."),
    fill("2", "Write the superlative: big → the ______", "biggest", "Big → bigger → the biggest (удвоение g).", "Big → bigger → the biggest (g екі еселенеді)."),
    fill("3", "Write the comparative: good → ______", "better", "Исключение: good → better.", "Ерекшелік: good → better."),
    fill("4", "Write the superlative: beautiful → the ______ beautiful (two words: most + beautiful). Write the missing word.", "most", "Длинное прилагательное: the most beautiful.", "Ұзын сын есім: the most beautiful."),
    fills("5", "Write at, on or in.\nThe lesson starts ___ 9 o'clock. My birthday is ___ 5th May. I like swimming ___ summer.", ["at", "on", "in"], "At + точное время; on + дата; in + сезон.", "At + нақты уақыт; on + дата; in + маусым."),
    fills("6", "Write a, an, the or x (no article).\nI have ___ apple. ___ sun is hot. I play ___ football.", ["an", "the", "x"], "Apple — an; sun — the (уникальное); football — без артикля.", "Apple — an; sun — the (бірегей); football — артикльсіз."),
    fill("7", "Write one word: You ______ wear a helmet when you ride a bike. (it is a rule)", "must", "Must — обязательное правило.", "Must — міндетті ереже."),
    pick("8", "Which sentences are CORRECT? Write the numbers.\n1. She can swims.\n2. He is taller than his brother.\n3. This is the most interesting book.\n4. I can to play chess.", [2, 3], "В 1 — can swim; в 4 — can play.", "1-де can swim; 4-те can play."),
  ],
  test: [
    mc("1", "Everest is ___ mountain in the world.", ["the highest", "higher", "highest", "more high"], "Превосходная степень: the highest.", "Күшейтпелі дәреже: the highest."),
    mc("2", "My brother is ___ than me.", ["taller", "tallest", "more tall", "the taller"], "Сравнение двух: taller than.", "Екеуін салыстыру: taller than."),
    mc("3", "She is ___ at maths than me. I am bad, she is good.", ["better", "gooder", "best", "more good"], "Good → better.", "Good → better."),
    mc("4", "We go to school ___ the morning.", ["in", "at", "on", "by"], "In the morning.", "In the morning."),
    mc("5", "The film starts ___ Friday.", ["on", "in", "at", "to"], "On + день недели.", "On + апта күні."),
    mc("6", "You ___ drink more water. It's good for you. (advice)", ["should", "must to", "can to", "mustn't"], "Should — совет.", "Should — кеңес."),
    mc("7", "She can ___ the piano very well.", ["play", "plays", "to play", "playing"], "После can — глагол без to и -s.", "Can-нан кейін — to-сыз етістік."),
    mc("8", "I like ___ sun because it gives light.", ["the", "a", "an", "—"], "Sun — единственное, уникальное: the.", "Sun — жалғыз, бірегей: the."),
    mc("9", "This is the ___ expensive hotel in the city.", ["most", "more", "much", "mostly"], "Длинное прилагательное: the most expensive.", "Ұзын сын есім: the most expensive."),
    mc("10", "My mother ___ to work on Saturdays because she is a doctor.", ["has", "have", "must", "can"], "Mother (she) → has to work.", "Mother (she) → has to work."),
  ],
};

export default topic;
