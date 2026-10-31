import { EngTopic, mc, fill, fills, pick, joinBi } from "../kit";

const topic: EngTopic = {
  code: "1.8",
  title: { ru: "Present Simple и наречия частоты", kk: "Present Simple және жиілік үстеулері" },
  explanation: joinBi(
    {
      ru: `**Present Simple** — настоящее простое время. Оно нужно для **привычек, регулярных действий, фактов и расписаний**: I play football every Saturday. The Earth goes round the Sun.

### Образование
:::figure {"kind":"table","caption":"Present Simple","rows":[["","Утверждение","Отрицание","Вопрос"],["I / you / we / they","I play","I do not (don't) play","Do you play?"],["he / she / it","He plays","He does not (doesn't) play","Does he play?"]]}
:::

Краткие ответы: **Yes, I do. / No, I don't. Yes, he does. / No, he doesn't.**

:::rule Окончание -s у he / she / it
- Обычно добавляем **-s**: play → play**s**, read → read**s**.
- После **-s, -ss, -sh, -ch, -x, -o** добавляем **-es**: watch → watch**es**, go → go**es**, wash → wash**es**.
- Согласная + y → **-ies**: study → stud**ies**, fly → fl**ies**. Гласная + y → -s: play → plays.
- Особый глагол: have → **has**.
:::

:::warn Главная ошибка
В вопросе и отрицании **-s** переходит к вспомогательному глаголу, а основной глагол остаётся **без -s**: Does she **play**? (не plays). She doesn't **like** tea. (не likes).
:::

### Наречия частоты
Они отвечают на вопрос «как часто?»:
:::figure {"kind":"table","caption":"Adverbs of frequency","rows":[["always","100 %","I always brush my teeth."],["usually","≈ 90 %","She usually walks to school."],["often","≈ 70 %","We often play chess."],["sometimes","≈ 50 %","He sometimes watches TV."],["rarely / seldom","≈ 10 %","They rarely eat fish."],["never","0 %","I never drink coffee."]]}
:::

:::rule Где стоит наречие
- **Перед** основным глаголом: She **often** reads.
- **После** глагола to be: He is **always** late.
- Слова every day, once a week, on Mondays ставят в **конец** предложения.
:::`,
      kk: `**Present Simple** — осы шақтың жай түрі. Ол **әдеттер, үнемі қайталанатын әрекеттер, деректер және кесте** үшін керек: I play football every Saturday. The Earth goes round the Sun.

### Жасалуы
:::figure {"kind":"table","caption":"Present Simple","rows":[["","Болымды","Болымсыз","Сұраулы"],["I / you / we / they","I play","I do not (don't) play","Do you play?"],["he / she / it","He plays","He does not (doesn't) play","Does he play?"]]}
:::

Қысқа жауаптар: **Yes, I do. / No, I don't. Yes, he does. / No, he doesn't.**

:::rule he / she / it-тен кейінгі -s
- Әдетте **-s** қосамыз: play → play**s**, read → read**s**.
- **-s, -ss, -sh, -ch, -x, -o**-дан кейін **-es**: watch → watch**es**, go → go**es**, wash → wash**es**.
- Дауыссыз + y → **-ies**: study → stud**ies**, fly → fl**ies**. Дауысты + y → -s: play → plays.
- Ерекше етістік: have → **has**.
:::

:::warn Басты қате
Сұрақ пен болымсыз сөйлемде **-s** көмекші етістікке өтеді, ал негізгі етістік **-s-сіз** қалады: Does she **play**? (plays емес). She doesn't **like** tea. (likes емес).
:::

### Жиілік үстеулері
Олар «қаншалықты жиі?» деген сұраққа жауап береді:
:::figure {"kind":"table","caption":"Adverbs of frequency","rows":[["always","100 %","I always brush my teeth."],["usually","≈ 90 %","She usually walks to school."],["often","≈ 70 %","We often play chess."],["sometimes","≈ 50 %","He sometimes watches TV."],["rarely / seldom","≈ 10 %","They rarely eat fish."],["never","0 %","I never drink coffee."]]}
:::

:::rule Үстеу қай жерде тұрады
- Негізгі етістіктің **алдында**: She **often** reads.
- to be етістігінен **кейін**: He is **always** late.
- every day, once a week, on Mondays сөздері сөйлемнің **соңына** қойылады.
:::`,
    },
  ),
  practice: [
    fill("1", "Write the correct form: He ______ (watch) TV every evening.", "watches", "После -ch добавляем -es.", "-ch-тен кейін -es қосамыз."),
    fill("2", "Write the correct form: My sister ______ (study) English.", "studies", "Согласная + y → -ies.", "Дауыссыз + y → -ies."),
    fill("3", "Write the correct form: Our teacher ______ (have) a big car.", "has", "Have → has.", "Have → has."),
    fills("4", "Write do or does.\n___ you like pizza? — Yes, I ___.", ["do", "do"], "С you — do.", "You-мен — do."),
    fills("5", "Write does or doesn't.\nMarat ___ drink tea. He drinks coffee. ___ he play chess? — No, he doesn't.", ["doesn't", "does"], "Отрицание — doesn't; вопрос — Does.", "Болымсыз — doesn't; сұрақ — Does."),
    fill("6", "Put the adverb in the sentence. Write the word that is missing:\nShe ______ (100 %) gets up at seven.", "always", "100 % — always.", "100 % — always."),
    fill("7", "He is ______ late. (0 %) Write the adverb.", "never", "0 % — never.", "0 % — never."),
    pick("8", "Which sentences are CORRECT? Write the numbers.\n1. She plays tennis on Sundays.\n2. Does he plays chess?\n3. We don't like cold weather.\n4. He go to school by bus.", [1, 3], "В 2 — Does he play; в 4 — He goes.", "2-де Does he play; 4-те He goes."),
  ],
  test: [
    mc("1", "My brother ___ computer games after school.", ["plays", "play", "playing", "is play"], "He/brother → plays.", "He/brother → plays."),
    mc("2", "___ your father work in a bank?", ["Does", "Do", "Is", "Has"], "С he/father — Does.", "He/father-мен — Does."),
    mc("3", "They ___ like coffee. They prefer tea.", ["don't", "doesn't", "isn't", "aren't"], "С they — don't.", "They-мен — don't."),
    mc("4", "She ___ to the gym twice a week.", ["goes", "go", "gos", "going"], "Go → goes.", "Go → goes."),
    mc("5", "Choose the correct word order.", ["He is always late.", "He always is late.", "Always he is late.", "He is late always."], "Наречие частоты стоит после глагола to be.", "Жиілік үстеуі to be етістігінен кейін тұрады."),
    mc("6", "How often do you visit your grandparents? — ___.", ["Once a month", "At the moment", "Yesterday", "Next week"], "How often? — Once a month.", "How often? — Once a month."),
    mc("7", "Water ___ at 100 degrees.", ["boils", "boil", "boiling", "is boil"], "Факт, it → boils.", "Дерек, it → boils."),
    mc("8", "Which sentence is NOT correct?", ["She doesn't likes chocolate.", "She doesn't like chocolate.", "She likes chocolate.", "Does she like chocolate?"], "После doesn't глагол без -s: doesn't like.", "Doesn't-тен кейін етістік -s-сіз: doesn't like."),
    mc("9", "Marat ___ gets up at 6 a.m. (every day, 100 %)", ["always", "never", "sometimes", "rarely"], "Каждый день — always.", "Күнде — always."),
    mc("10", "The bus ___ at 8:15. It's in the timetable.", ["leaves", "leave", "leaving", "leavs"], "Расписание — Present Simple: it leaves.", "Кесте — Present Simple: it leaves."),
  ],
};

export default topic;
