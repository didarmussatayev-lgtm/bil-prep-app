import { EngTopic, mc, fill, count, pick, joinBi } from "../kit";

const topic: EngTopic = {
  code: "2.6",
  title: { ru: "Чтение: верно / неверно / не сказано, вывод", kk: "Оқу: дұрыс / қате / айтылмаған, қорытынды" },
  explanation: joinBi(
    {
      ru: `Здесь надо **проверить утверждение** по тексту или **сделать вывод** (inference) — понять то, что в тексте не сказано прямо, но следует из него.

### Три вердикта
:::figure {"kind":"table","caption":"True / False / Not stated","rows":[["Вердикт","Когда","Пример (текст: «Aidos has a cat.»)"],["TRUE","текст прямо подтверждает","Aidos has a pet. — TRUE"],["FALSE","текст прямо противоречит","Aidos has a dog. — FALSE"],["NOT STATED","в тексте об этом ничего нет","The cat is black. — NOT STATED"]]}
:::

:::steps Как проверять
1. Найдите в тексте **то место**, о котором говорит утверждение.
2. Сравните **каждое слово**: числа, время, *always / never / only / all*.
3. Если место нашли, но смысл другой — **FALSE**. Если места нет вообще — **NOT STATED**.
:::

### Вывод (inference)
Вопросы *«What can we understand from the text?», «Which statement is probably true?»*: автор не пишет прямо, но подсказывает.
*«Bota took an umbrella and a raincoat.»* → вероятно, **шёл дождь** или ожидался.

:::warn Ловушка
**Не додумывайте.** Если вывод нужен, он должен следовать из **слов текста**, а не из ваших знаний. Если вариант слишком категоричный (*always, nobody, everything*), он часто неверный.
:::

:::tip Лайфхак
Слова **mostly, probably, usually** в вариантах часто стоят у верных ответов, а **always, never, only** — у неверных.
:::`,
      kk: `Мұнда мәтін бойынша **тұжырымды тексеру** немесе **қорытынды жасау** (inference) керек — мәтінде тікелей айтылмаған, бірақ одан шығатын нәрсені түсіну.

### Үш үкім
:::figure {"kind":"table","caption":"True / False / Not stated","rows":[["Үкім","Қашан","Мысал (мәтін: «Aidos has a cat.»)"],["TRUE","мәтін тікелей растайды","Aidos has a pet. — TRUE"],["FALSE","мәтін тікелей қайшы келеді","Aidos has a dog. — FALSE"],["NOT STATED","мәтінде бұл туралы ештеңе жоқ","The cat is black. — NOT STATED"]]}
:::

:::steps Қалай тексереміз
1. Тұжырым айтатын **жерді** мәтіннен табыңыз.
2. **Әр сөзді** салыстырыңыз: сандар, уақыт, *always / never / only / all*.
3. Жерін таптыңыз, бірақ мағынасы басқа болса — **FALSE**. Жері мүлде жоқ болса — **NOT STATED**.
:::

### Қорытынды (inference)
*«What can we understand from the text?», «Which statement is probably true?»* сұрақтары: автор тікелей жазбайды, бірақ меңзейді.
*«Bota took an umbrella and a raincoat.»* → мүмкін, **жаңбыр жауып тұрды** немесе жауады деп күтілді.

:::warn Қателік
**Өзіңіз ойдан қоспаңыз.** Қорытынды керек болса, ол мәтін **сөздерінен** шығуы керек, сіздің білімдеріңізден емес. Нұсқа тым категориялы болса (*always, nobody, everything*), ол көбіне қате.
:::

:::tip Кеңес
Нұсқалардағы **mostly, probably, usually** сөздері көбіне дұрыс жауапта, ал **always, never, only** — қате жауапта тұрады.
:::`,
    },
  ),
  practice: [
    count("1", "Text: \"Aida has a brother and a sister. Her brother is older than her.\"\nStatement: Aida has two brothers. Write 1 for TRUE, 2 for FALSE, 3 for NOT STATED.", 2, "В тексте один брат, значит утверждение FALSE.", "Мәтінде бір аға бар, демек FALSE."),
    count("2", "Text: \"The museum is closed on Mondays.\"\nStatement: The museum is open on Tuesdays. Write 1 for TRUE, 2 for FALSE, 3 for NOT STATED.", 3, "О вторнике в тексте ничего не сказано — NOT STATED.", "Сейсенбі туралы айтылмаған — NOT STATED."),
    count("3", "Text: \"Tom plays tennis every Saturday.\"\nStatement: Tom plays tennis on Saturdays. Write 1 for TRUE, 2 for FALSE, 3 for NOT STATED.", 1, "Every Saturday = on Saturdays — TRUE.", "Every Saturday = on Saturdays — TRUE."),
    count("4", "Text: \"There are 20 students in the class. 12 are girls.\"\nStatement: There are 8 boys. Write 1 for TRUE, 2 for FALSE, 3 for NOT STATED.", 1, "20 − 12 = 8 — TRUE.", "20 − 12 = 8 — TRUE."),
    count("5", "Text: \"Nurlan took his coat and a scarf and put on warm boots.\"\nWhat is the weather probably like? Write 1 (cold), 2 (hot) or 3 (rainy).", 1, "Пальто, шарф и тёплые ботинки — вероятно, холодно.", "Пальто, шарф, жылы етік — ауа райы суық болуы мүмкін."),
    count("6", "Text: \"Dana sat in the dark room and looked at the clock. It was nearly midnight.\"\nWhat time of day is it? Write 1 (night), 2 (morning) or 3 (afternoon).", 1, "Midnight — полночь, значит ночь.", "Midnight — түн ортасы, демек түн."),
    pick("7", "Text: \"Marat likes football and basketball, but he doesn't like chess.\"\nWhich statements are TRUE? Write the numbers.\n1. Marat likes sport.\n2. Marat plays chess every day.\n3. Marat likes basketball.\n4. Marat likes swimming.", [1, 3], "1 и 3 подтверждаются; 2 — неверно; 4 — в тексте нет.", "1 және 3 расталады; 2 — қате; 4 — мәтінде жоқ."),
    count("8", "Text: \"Sveta lost her bag. She was very upset and cried.\"\nHow did Sveta feel? Write 1 (happy), 2 (sad) or 3 (bored).", 2, "Upset, cried — грустила.", "Upset, cried — қайғырды."),
  ],
  test: [
    mc("1", "Text: 'Dogs live 5 to 13 years. One dog lived to be 24.' Which statement is TRUE?", ["Some dogs live longer than 13 years.", "All dogs live 24 years.", "Dogs live 2 years.", "No dog lives more than 10 years."], "Some dogs live longer — подтверждается.", "Some dogs live longer — расталады."),
    mc("2", "Text: 'The Cycling Club promotes cycling safety lessons for all school children.' Which statement is NOT STATED in the text?", ["The club has 100 offices.", "The club promotes cycling.", "The club works with children.", "The club wants safety."], "Про 100 офисов в тексте не сказано.", "100 кеңсе туралы мәтінде айтылмаған."),
    mc("3", "Text: 'Aibek was late. He ran to school without breakfast.' What can we understand?", ["Aibek was in a hurry.", "Aibek was full.", "Aibek was on holiday.", "Aibek was asleep at school."], "Ran, without breakfast — спешил.", "Ran, without breakfast — асықты."),
    mc("4", "Text: 'Her eyes were red and she kept wiping them with a handkerchief.' How does she probably feel?", ["Sad", "Excited", "Angry", "Bored"], "Красные глаза и платок — грусть.", "Қызарған көз және орамал — мұң."),
    mc("5", "Text: 'The shop opens at nine and closes at six.' Which is probably true?", ["You can't buy anything there at 7 p.m.", "The shop is open at midnight.", "The shop is closed during the day.", "The shop opens at six."], "В 7 вечера магазин закрыт.", "Кешкі 7-де дүкен жабық."),
    mc("6", "Text: 'Maria never eats meat.' Which statement is TRUE?", ["Maria is probably a vegetarian.", "Maria eats meat every day.", "Maria is always hungry.", "Maria likes steak."], "Never eats meat — вегетарианка.", "Never eats meat — вегетариан."),
    mc("7", "Text: 'Only students with a card can enter the library.' Who can enter?", ["Students with a card", "Everybody", "Only teachers", "Nobody"], "Only students with a card.", "Only students with a card."),
    mc("8", "Text: 'It was raining, so we stayed at home and played board games.' Why did they stay at home?", ["Because of the rain", "Because they were ill", "Because they had a test", "Because of the snow"], "So — следствие; причина — rain.", "So — салдар; себебі — rain."),
    mc("9", "Text: 'He packed his suitcase, took his passport and called a taxi to the airport.' What is he going to do?", ["Travel by plane", "Go to school", "Cook dinner", "Play football"], "Чемодан, паспорт, аэропорт — полёт.", "Чемодан, төлқұжат, әуежай — ұшу."),
    mc("10", "Text: 'This year, our team won 5 matches and lost 2.' Which is NOT stated?", ["The team played 10 matches.", "The team won 5 matches.", "The team lost 2 matches.", "The team won more matches than it lost."], "Количество 10 не указано (известно 7 игр).", "10 ойын туралы айтылмаған (7 ойын белгілі)."),
  ],
};

export default topic;
