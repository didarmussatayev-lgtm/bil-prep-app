import { EngTopic, mc, fill, fills, pick, joinBi } from "../kit";

const topic: EngTopic = {
  code: "1.15",
  title: { ru: "Past Simple: правильные и неправильные глаголы", kk: "Past Simple: тұрақты және ерекше етістіктер" },
  explanation: joinBi(
    {
      ru: `**Past Simple** — прошедшее простое время. Оно отвечает на вопрос «что **случилось**?» и описывает **законченное** действие в прошлом: I watched TV yesterday. She went to Paris in 2019.

### Правильные глаголы: + -ed
:::figure {"kind":"table","caption":"Regular verbs","rows":[["Правило","Пример"],["Обычно + -ed","walk → walked, play → played, watch → watched"],["Оканчивается на -e → + -d","live → lived, like → liked"],["Согласная + y → -ied","study → studied, try → tried"],["1 гласная + 1 согласная (ударение на слог) → удвоение","stop → stopped, plan → planned"]]}
:::

### Неправильные глаголы
Их формы надо **выучить наизусть**:
:::figure {"kind":"table","caption":"Irregular verbs","rows":[["go → went","see → saw","eat → ate","buy → bought","make → made"],["take → took","come → came","get → got","give → gave","write → wrote"],["have → had","be → was/were","do → did","say → said","know → knew"],["drink → drank","run → ran","sing → sang","swim → swam","read → read [red]"],["begin → began","become → became","bring → brought","leave → left","find → found"]]}
:::

### Вопрос и отрицание
:::figure {"kind":"table","caption":"Past Simple","rows":[["Утверждение","Отрицание","Вопрос","Краткий ответ"],["He watched TV.","He didn't watch TV.","Did he watch TV?","Yes, he did. / No, he didn't."],["I went home.","I didn't go home.","Did you go home?","Yes, I did. / No, I didn't."]]}
:::

:::warn Главное правило
После **did / didn't** глагол стоит в **начальной форме** (без -ed и без прошедшей формы): *Did she go?* (не went), *He didn't watch* (не watched).
:::

:::tip Слова-подсказки
yesterday, last week/month/year, two days ago, in 2010, when I was a child, then, after that.
:::`,
      kk: `**Past Simple** — өткен шақтың жай түрі. Ол «не **болды**?» деген сұраққа жауап беріп, өткендегі **аяқталған** әрекетті сипаттайды: I watched TV yesterday. She went to Paris in 2019.

### Тұрақты етістіктер: + -ed
:::figure {"kind":"table","caption":"Regular verbs","rows":[["Ереже","Мысал"],["Әдетте + -ed","walk → walked, play → played, watch → watched"],["-e-мен аяқталса → + -d","live → lived, like → liked"],["Дауыссыз + y → -ied","study → studied, try → tried"],["1 дауысты + 1 дауыссыз (екпінді буын) → дауыссызды қосарлау","stop → stopped, plan → planned"]]}
:::

### Ерекше етістіктер
Олардың формаларын **жаттау** керек:
:::figure {"kind":"table","caption":"Irregular verbs","rows":[["go → went","see → saw","eat → ate","buy → bought","make → made"],["take → took","come → came","get → got","give → gave","write → wrote"],["have → had","be → was/were","do → did","say → said","know → knew"],["drink → drank","run → ran","sing → sang","swim → swam","read → read [red]"],["begin → began","become → became","bring → brought","leave → left","find → found"]]}
:::

### Сұрақ және болымсыз түр
:::figure {"kind":"table","caption":"Past Simple","rows":[["Болымды","Болымсыз","Сұраулы","Қысқа жауап"],["He watched TV.","He didn't watch TV.","Did he watch TV?","Yes, he did. / No, he didn't."],["I went home.","I didn't go home.","Did you go home?","Yes, I did. / No, I didn't."]]}
:::

:::warn Басты ереже
**did / didn't**-тен кейін етістік **бастапқы формада** тұрады (-ed-сіз және өткен форма-сыз): *Did she go?* (went емес), *He didn't watch* (watched емес).
:::

:::tip Белгі сөздер
yesterday, last week/month/year, two days ago, in 2010, when I was a child, then, after that.
:::`,
    },
  ),
  practice: [
    fill("1", "Write the Past Simple: walk → ______", "walked", "Правильный глагол: + -ed.", "Тұрақты етістік: + -ed."),
    fill("2", "Write the Past Simple: study → ______", "studied", "Согласная + y → -ied.", "Дауыссыз + y → -ied."),
    fill("3", "Write the Past Simple: stop → ______", "stopped", "Удвоение согласной: stopped.", "Дауыссыз қосарланады: stopped."),
    fill("4", "Write the Past Simple: go → ______", "went", "Неправильный глагол: go → went.", "Ерекше етістік: go → went."),
    fill("5", "Write the Past Simple: buy → ______", "bought", "Buy → bought.", "Buy → bought."),
    fills("6", "Write the Past Simple of the verbs.\nI (see) ___ a film yesterday. She (eat) ___ an apple.", ["saw", "ate"], "See → saw; eat → ate.", "See → saw; eat → ate."),
    fill("7", "Write one word: Did you ______ (go) to the cinema last night?", "go", "После did — начальная форма: go.", "Did-тен кейін — бастапқы форма: go."),
    pick("8", "Which sentences are CORRECT? Write the numbers.\n1. She didn't went to school.\n2. They played football yesterday.\n3. Did he watched the film?\n4. We bought a new car last month.", [2, 4], "В 1 — didn't go; в 3 — Did he watch.", "1-де didn't go; 3-те Did he watch."),
  ],
  test: [
    mc("1", "We ___ to the museum yesterday.", ["went", "go", "goed", "gone"], "Go → went.", "Go → went."),
    mc("2", "He ___ TV last night.", ["watched", "watch", "watches", "watching"], "Last night — Past Simple.", "Last night — Past Simple."),
    mc("3", "She didn't ___ the homework.", ["do", "did", "does", "done"], "После didn't — начальная форма: do.", "Didn't-тен кейін — бастапқы форма: do."),
    mc("4", "___ you see the match on Sunday?", ["Did", "Do", "Were", "Have"], "Вопрос в Past Simple: Did you see…?", "Past Simple сұрағы: Did you see…?"),
    mc("5", "My grandfather ___ me a nice present last year.", ["gave", "give", "gived", "gives"], "Give → gave.", "Give → gave."),
    mc("6", "Which is the correct Past Simple of 'carry'?", ["carried", "carryed", "carred", "carrid"], "Согласная + y → -ied.", "Дауыссыз + y → -ied."),
    mc("7", "Which sentence is correct?", ["I didn't eat breakfast today.", "I didn't ate breakfast today.", "I not ate breakfast today.", "I don't ate breakfast today."], "Didn't + начальная форма.", "Didn't + бастапқы форма."),
    mc("8", "Match the past form: write → ___", ["wrote", "writed", "written", "writes"], "Write → wrote.", "Write → wrote."),
    mc("9", "Lionel ___ football at the age of five.", ["started", "start", "starts", "starting"], "At the age of five — прошлое.", "At the age of five — өткен шақ."),
    mc("10", "I ___ my keys, so I couldn't open the door.", ["lost", "lose", "loosed", "losted"], "Lose → lost.", "Lose → lost."),
  ],
};

export default topic;
