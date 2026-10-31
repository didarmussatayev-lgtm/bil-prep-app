import { EngTopic, mc, fill, fills, pick, joinBi } from "../kit";

const topic: EngTopic = {
  code: "1.14",
  title: { ru: "Was / were, had, could", kk: "Was / were, had, could" },
  explanation: joinBi(
    {
      ru: `Эти слова нужны, чтобы рассказывать о **прошлом**: где человек был, что у него было, что он умел.

### Was / were — прошедшее время от to be
:::figure {"kind":"table","caption":"Was / were","rows":[["","Утверждение","Отрицание","Вопрос"],["I / he / she / it","I was late.","I was not (wasn't) late.","Was I late?"],["you / we / they","They were late.","They were not (weren't) late.","Were they late?"]]}
:::

Краткие ответы: **Yes, I was. / No, he wasn't. Yes, they were. / No, you weren't.**

### Had — прошедшее от have (got)
Имел, у него было: *He had a bike. She didn't have a car. Did you have a dog?* После **did / didn't** — глагол **have** без -s.

### Could — мог, умел (в прошлом)
:::figure {"kind":"table","caption":"Could","rows":[["Утверждение","I / you / he / she / we / they could swim."],["Отрицание","He couldn't (could not) read."],["Вопрос","Could you ride a bike? — Yes, I could. / No, I couldn't."]]}
:::

:::rule Запомните
**could** одинаков для всех лиц, не добавляется -s и после него идёт глагол **без to**: She could **speak** English at five.
:::

### Слова-подсказки прошлого
yesterday, last night, last week, two days ago, in 1998, when I was a child.

:::warn Ловушка
Не путайте **was/were** (to be) и **did** (для обычных глаголов). Правильно: *She was late. She didn't go to school.* Неправильно: *She didn't was late.*
:::`,
      kk: `Бұл сөздер **өткен шақты** айтуға керек: адам қайда болды, оның не болды, ол нені істей алды.

### Was / were — to be етістігінің өткен шағы
:::figure {"kind":"table","caption":"Was / were","rows":[["","Болымды","Болымсыз","Сұраулы"],["I / he / she / it","I was late.","I was not (wasn't) late.","Was I late?"],["you / we / they","They were late.","They were not (weren't) late.","Were they late?"]]}
:::

Қысқа жауаптар: **Yes, I was. / No, he wasn't. Yes, they were. / No, you weren't.**

### Had — have (got) етістігінің өткен шағы
Бар еді: *He had a bike. She didn't have a car. Did you have a dog?* **did / didn't**-тен кейін **have** етістігі -s-сіз тұрады.

### Could — алатын, істей алатын еді (өткенде)
:::figure {"kind":"table","caption":"Could","rows":[["Болымды","I / you / he / she / we / they could swim."],["Болымсыз","He couldn't (could not) read."],["Сұраулы","Could you ride a bike? — Yes, I could. / No, I couldn't."]]}
:::

:::rule Есте сақтаңыз
**could** барлық жақта бірдей, -s қосылмайды, одан кейін **to-сыз** етістік келеді: She could **speak** English at five.
:::

### Өткен шақтың белгілері
yesterday, last night, last week, two days ago, in 1998, when I was a child.

:::warn Қателік
**was/were** (to be) мен **did** (қарапайым етістіктер) араластырмаңыз. Дұрысы: *She was late. She didn't go to school.* Қате: *She didn't was late.*
:::`,
    },
  ),
  practice: [
    fills("1", "Write was or were.\nI ___ at home yesterday. My parents ___ at work.", ["was", "were"], "I → was; parents → were.", "I → was; parents → were."),
    fills("2", "Write was or were.\nThe film ___ boring. The shops ___ closed.", ["was", "were"], "Film — один предмет: was; shops — несколько: were.", "Film — бір зат: was; shops — бірнешеу: were."),
    fill("3", "Write the negative (one word): She ______ at school yesterday. (She was ill.)", "wasn't", "Отрицание: wasn't.", "Болымсыз: wasn't."),
    fill("4", "Write the short answer: Were you at the cinema last night? — No, I ______.", "wasn't", "На вопрос с you про себя отвечаем I wasn't.", "You-мен сұраққа өз атымыздан I wasn't деп жауап береміз."),
    fill("5", "Write one word: He ______ a bike when he was ten. (He had a bike.)", "had", "Прошедшее от have — had.", "Have-тың өткен шағы — had."),
    fill("6", "Write one word: She didn't ______ a car when she was young.", "have", "После didn't — have.", "Didn't-тен кейін — have."),
    fill("7", "Write one word: When I was five, I ______ read. (I could not read)", "couldn't", "Отрицание could — couldn't.", "Could-тың болымсызы — couldn't."),
    pick("8", "Which sentences are CORRECT? Write the numbers.\n1. She could swim at four.\n2. He didn't was at school.\n3. They were in Paris last week.\n4. I could to play the piano.", [1, 3], "В 2 — He wasn't; в 4 — could play (без to).", "2-де He wasn't; 4-те could play (to-сыз)."),
  ],
  test: [
    mc("1", "Yesterday I ___ very tired.", ["was", "were", "am", "have"], "I → was.", "I → was."),
    mc("2", "We ___ in the park last Sunday.", ["were", "was", "are", "did"], "We → were.", "We → were."),
    mc("3", "___ your brother at the party last night? — No, he wasn't.", ["Was", "Were", "Did", "Is"], "He → Was he…?", "He → Was he…?"),
    mc("4", "My grandfather ___ a horse when he was young.", ["had", "have", "has", "having"], "Прошедшее время — had.", "Өткен шақ — had."),
    mc("5", "I ___ ride a bike when I was four.", ["could", "can", "am", "do"], "Прошедшее время — could.", "Өткен шақ — could."),
    mc("6", "He ___ speak English at the age of five, but now he speaks it very well.", ["couldn't", "can't", "doesn't", "isn't"], "В прошлом не умел — couldn't.", "Өткенде білмеді — couldn't."),
    mc("7", "Did you ___ a dog when you were a child?", ["have", "had", "has", "having"], "После did — have.", "Did-тен кейін — have."),
    mc("8", "Which sentence is correct?", ["She wasn't at school yesterday.", "She didn't was at school yesterday.", "She not was at school yesterday.", "She wasn't to school yesterday."], "Отрицание с was — wasn't.", "Was-тың болымсызы — wasn't."),
    mc("9", "Which time expression is used with the Past Simple?", ["two days ago", "at the moment", "every day", "next week"], "Ago — признак прошедшего времени.", "Ago — өткен шақтың белгісі."),
    mc("10", "They ___ swim in the river last summer. It was dangerous.", ["couldn't", "can't", "aren't", "wasn't"], "Прошлое — couldn't.", "Өткен шақ — couldn't."),
  ],
};

export default topic;
