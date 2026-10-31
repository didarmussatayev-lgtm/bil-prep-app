import { EngTopic, mc, fill, fills, pick, joinBi } from "../kit";

const topic: EngTopic = {
  code: "1.11",
  title: { ru: "Have to / don't have to", kk: "Have to / don't have to" },
  explanation: joinBi(
    {
      ru: `**Have to** выражает **необходимость, обязанность**, которая идёт от правил, работы, обстоятельств: I **have to** get up early. A doctor **has to** work at night.

### Образование (Present Simple)
:::figure {"kind":"table","caption":"Have to","rows":[["","Утверждение","Отрицание","Вопрос"],["I / you / we / they","I have to go.","I don't have to go.","Do you have to go?"],["he / she / it","She has to go.","She doesn't have to go.","Does she have to go?"]]}
:::

:::rule Три важных момента
1. После **has / have to** — глагол **без to и без -s**: She has to **work** (не works).
2. **Don't / doesn't have to** значит «не обязательно, можно не делать», это **нет обязанности**.
3. В вопросах и отрицаниях используем **do / does**, как в обычном Present Simple.
:::

:::warn Ловушка: don't have to ≠ mustn't
**You don't have to wear a uniform.** — Можно не надевать (не обязательно).
**You mustn't smoke here.** — Нельзя (запрещено).
Эти два выражения означают разное!
:::

:::tip Примеры
Teachers **have to** prepare lessons. — Pilots **don't have to** work on Saturdays (у них свободные дни). — **Do** firefighters **have to** be brave? — Yes, they **do**.
:::`,
      kk: `**Have to** ереже, жұмыс, жағдайға байланысты туындайтын **қажеттілік, міндетті** білдіреді: I **have to** get up early. A doctor **has to** work at night.

### Жасалуы (Present Simple)
:::figure {"kind":"table","caption":"Have to","rows":[["","Болымды","Болымсыз","Сұраулы"],["I / you / we / they","I have to go.","I don't have to go.","Do you have to go?"],["he / she / it","She has to go.","She doesn't have to go.","Does she have to go?"]]}
:::

:::rule Үш маңызды нәрсе
1. **has / have to**-дан кейін — **to-сыз және -s-сіз** етістік: She has to **work** (works емес).
2. **Don't / doesn't have to** «міндетті емес, істемесе де болады» дегенді білдіреді, яғни **міндет жоқ**.
3. Сұрақ пен болымсыз сөйлемде әдеттегі Present Simple сияқты **do / does** қолданамыз.
:::

:::warn Қателік: don't have to ≠ mustn't
**You don't have to wear a uniform.** — Киюге болады, міндетті емес.
**You mustn't smoke here.** — Болмайды (тыйым).
Бұл екі тіркестің мағынасы басқа!
:::

:::tip Мысалдар
Teachers **have to** prepare lessons. — Pilots **don't have to** work on Saturdays (демалыс күндері бар). — **Do** firefighters **have to** be brave? — Yes, they **do**.
:::`,
    },
  ),
  practice: [
    fill("1", "Write one word: My father ______ to go to work at 7 a.m. (he)", "has", "He → has to.", "He → has to."),
    fill("2", "Write one word: We ______ to wear a uniform at school.", "have", "We → have to.", "We → have to."),
    fill("3", "Write the negative (two words): She ______ have to cook. (it isn't necessary)", "doesn't", "Отрицание для she — doesn't have to.", "She үшін болымсыз — doesn't have to."),
    fills("4", "Write do or does.\n___ you have to wake up early? — Yes, I ___.", ["do", "do"], "С you — do.", "You-мен — do."),
    fill("5", "Write the correct verb: A pilot has to ______ (fly) planes carefully.", "fly", "После have to — глагол без -s: fly.", "Have to-дан кейін етістік -s-сіз: fly."),
    pick("6", "Which sentences are correct? Write the numbers.\n1. She has to work on Sundays.\n2. He has to works at night.\n3. We don't have to wear a hat.\n4. Does he has to study?", [1, 3], "В 2 — has to work; в 4 — Does he have to study?", "2-де has to work; 4-те Does he have to study?"),
    pick("7", "You don't have to do it. In which sentences is it NOT necessary? Write the numbers.\n1. You don't have to pay.\n2. You mustn't run here.\n3. We don't have to come early.", [1, 3], "Don't have to — не обязательно. Mustn't — запрещено.", "Don't have to — міндетті емес. Mustn't — тыйым."),
    fills("8", "Complete with has to / don't have to / doesn't have to (write one word, h or d).\nAizhan is a student. She ___ to go to school. On Sunday she ___ have to go.", ["has", "doesn't"], "Школа — обязанность: has to; в воскресенье — doesn't have to.", "Мектеп — міндет: has to; жексенбіде — doesn't have to."),
  ],
  test: [
    mc("1", "Nurses ___ to help sick people.", ["have", "has", "having", "are"], "Nurses (they) → have to.", "Nurses (they) → have to."),
    mc("2", "My sister ___ to get up early because she works in a bakery.", ["has", "have", "is", "does"], "She → has to.", "She → has to."),
    mc("3", "He ___ have to wear a tie. It's a free day.", ["doesn't", "don't", "hasn't", "isn't"], "He → doesn't have to.", "He → doesn't have to."),
    mc("4", "Do you ___ to do homework every day?", ["have", "has", "having", "had"], "Do you have to…?", "Do you have to…?"),
    mc("5", "'You don't have to pay.' means ___.", ["It's not necessary to pay.", "You mustn't pay.", "You can't pay.", "You must pay."], "Don't have to — не обязательно.", "Don't have to — міндетті емес."),
    mc("6", "What does 'You mustn't run' mean?", ["It's forbidden to run.", "It's not necessary to run.", "You can run if you want.", "You have to run."], "Mustn't — запрет.", "Mustn't — тыйым."),
    mc("7", "Children ___ to go to school on Sundays.", ["don't have", "doesn't have", "haven't", "aren't"], "Children (they) → don't have to.", "Children (they) → don't have to."),
    mc("8", "Which sentence is correct?", ["She has to wear a helmet.", "She have to wear a helmet.", "She has to wears a helmet.", "She has wear a helmet."], "She has to + глагол без -s.", "She has to + -s-сіз етістік."),
    mc("9", "Does a firefighter ___ to be brave? — Yes, he does.", ["have", "has", "having", "had"], "Does + have to.", "Does + have to."),
    mc("10", "A teacher ___ prepare lessons. It is her job.", ["has to", "have to", "must to", "is to"], "She → has to.", "She → has to."),
  ],
};

export default topic;
