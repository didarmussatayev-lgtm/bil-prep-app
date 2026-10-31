import { EngTopic, mc, fill, fills, pick, joinBi } from "../kit";

const topic: EngTopic = {
  code: "1.2",
  title: { ru: "There is / There are · a, an, some, any", kk: "There is / There are · a, an, some, any" },
  explanation: joinBi(
    {
      ru: `Чтобы сказать, **что есть** в комнате, в городе, на картинке, используют оборот **there is / there are** («есть, имеется»).

### There is / There are
:::figure {"kind":"table","caption":"There is / There are","rows":[["","Утверждение","Отрицание","Вопрос"],["Один предмет (singular)","There is a sofa. (There's)","There is not (isn't) a sofa.","Is there a sofa?"],["Много предметов (plural)","There are two chairs.","There are not (aren't) any chairs.","Are there any chairs?"]]}
:::

:::rule Какую форму взять
Смотрим на **первый** предмет после оборота. Один предмет (или неисчисляемое слово: water, milk) — **is**. Несколько — **are**.
:::

Краткие ответы: **Yes, there is. / No, there isn't.** и **Yes, there are. / No, there aren't.**

### A / an / some / any
:::steps Как выбрать
1. Предмет один, слово начинается с **согласного звука** → **a** (a table, a window).
2. Предмет один, слово начинается с **гласного звука** → **an** (an armchair, an egg).
3. Предметов много или слово неисчисляемое (bread, water) → **some** в утверждении (There are **some** books).
4. В отрицании и вопросе → **any** (There aren't **any** books. Are there **any** books?).
:::

:::warn Важно: звук, а не буква
Выбирают по **звуку**: a **u**niversity (звук «ю» — согласный), an **h**our (h не читается — гласный звук).
:::

:::tip Лайфхак
**some** — в просьбах и предложениях: Would you like **some** tea? Can I have **some** water?
:::`,
      kk: `Бөлмеде, қалада, суретте **не бар екенін** айту үшін **there is / there are** («бар») тіркесі қолданылады.

### There is / There are
:::figure {"kind":"table","caption":"There is / There are","rows":[["","Болымды","Болымсыз","Сұраулы"],["Бір зат (singular)","There is a sofa. (There's)","There is not (isn't) a sofa.","Is there a sofa?"],["Көп зат (plural)","There are two chairs.","There are not (aren't) any chairs.","Are there any chairs?"]]}
:::

:::rule Қай формасын алу керек
Тіркестен кейінгі **бірінші** затқа қараймыз. Бір зат (немесе санауға келмейтін сөз: water, milk) болса — **is**. Бірнеше болса — **are**.
:::

Қысқа жауаптар: **Yes, there is. / No, there isn't.** және **Yes, there are. / No, there aren't.**

### A / an / some / any
:::steps Қалай таңдаймыз
1. Зат біреу, сөз **дауыссыз дыбыстан** басталады → **a** (a table, a window).
2. Зат біреу, сөз **дауысты дыбыстан** басталады → **an** (an armchair, an egg).
3. Заттар көп немесе сөз санауға келмейді (bread, water) → болымды сөйлемде **some** (There are **some** books).
4. Болымсыз және сұраулы сөйлемде → **any** (There aren't **any** books. Are there **any** books?).
:::

:::warn Маңызды: әріп емес, дыбыс
**Дыбысқа** қарап таңдайды: a **u**niversity (дыбысы «ю» — дауыссыз), an **h**our (h оқылмайды — дауысты дыбыс).
:::

:::tip Кеңес
**some** өтініш пен ұсыныста қолданылады: Would you like **some** tea? Can I have **some** water?
:::`,
    },
  ),
  practice: [
    fills("1", "Write is or are.\nThere ___ a TV in the living room. There ___ two lamps in the bedroom.", ["is", "are"], "Один предмет — is, два — are.", "Бір зат — is, екеу — are."),
    fills("2", "Write is or are.\nThere ___ some milk in the fridge. There ___ three apples on the table.", ["is", "are"], "Milk — неисчисляемое слово: is; three apples — множественное число: are.", "Milk — санауға келмейді: is; three apples — көпше: are."),
    fills("3", "Write a or an.\nThere is ___ armchair in the room. There is ___ window next to the door.", ["an", "a"], "Armchair начинается с гласного звука — an; window — с согласного — a.", "Armchair дауысты дыбыстан басталады — an; window дауыссыздан — a."),
    fills("4", "Write some or any.\nThere are ___ chairs in the kitchen. There aren't ___ chairs in the bathroom.", ["some", "any"], "В утверждении — some, в отрицании — any.", "Болымды сөйлемде — some, болымсызда — any."),
    fill("5", "Write one word.\n— Is there ___ juice in the fridge? — Yes, there is.", "any", "В вопросе используют any.", "Сұраулы сөйлемде any қолданылады."),
    fill("6", "Complete the short answer: Are there two beds in the room? — No, there ______.", "aren't", "Краткий отрицательный ответ для plural: No, there aren't.", "Көпше түрдің қысқа болымсыз жауабы: No, there aren't."),
    pick("7", "Which sentences are CORRECT? Write the numbers.\n1. There is some chairs in the room.\n2. There are two beds in the bedroom.\n3. There is a lamp on the desk.\n4. There are a cat under the table.", [2, 3], "В предложении 1 нужно «are», в 4 — «is».", "1-сөйлемде «are», 4-сөйлемде «is» болуы керек."),
    fills("8", "Write a, an, some or any.\nThere is ___ egg in the bowl. There isn't ___ bread. There is ___ butter.", ["an", "any", "some"], "Egg — an; в отрицании — any; butter неисчисляемое — some.", "Egg — an; болымсызда — any; butter санауға келмейді — some."),
  ],
  test: [
    mc("1", "There ___ a cinema next to the bank.", ["is", "are", "am", "were"], "Cinema — один предмет, значит is.", "Cinema — бір зат, сондықтан is."),
    mc("2", "There aren't ___ windows in this room.", ["any", "a", "an", "some"], "Отрицание + множественное число — any.", "Болымсыз сөйлем + көпше — any."),
    mc("3", "Would you like ___ coffee with your cake?", ["some", "a", "an", "any"], "В предложении-вопросе с угощением используют some.", "Ұсыныс айтылған сұрақта some қолданылады."),
    mc("4", "There is ___ umbrella in the hall.", ["an", "a", "some", "any"], "Umbrella начинается с гласного звука — an.", "Umbrella дауысты дыбыстан басталады — an."),
    mc("5", "___ there any chairs in the dining room? — Yes, there are.", ["Are", "Is", "Do", "Does"], "Chairs — множественное число: Are there any…?", "Chairs — көпше: Are there any…?"),
    mc("6", "There ___ any milk in the fridge.", ["isn't", "aren't", "don't", "haven't"], "Milk неисчисляемое: there isn't any milk.", "Milk санауға келмейді: there isn't any milk."),
    mc("7", "There is ___ hour left before the lesson.", ["an", "a", "some", "any"], "Hour начинается с гласного звука (h не читается): an hour.", "Hour дауысты дыбыстан басталады (h оқылмайды): an hour."),
    mc("8", "Choose the correct sentence.", ["There are three pillows on the bed.", "There is three pillows on the bed.", "There are a pillow on the bed.", "There is some pillows on the bed."], "Three pillows — множественное число, нужно «there are».", "Three pillows — көпше, «there are» керек."),
    mc("9", "Is there a sofa in the living room? Choose the correct short answer.", ["No, there isn't.", "No, there aren't.", "No, it isn't.", "No, there don't."], "Вопрос с Is there → ответ Yes, there is / No, there isn't.", "Is there деген сұраққа жауап: Yes, there is / No, there isn't."),
    mc("10", "There are ___ books on the shelf, but there isn't ___ lamp.", ["some / a", "any / a", "a / some", "an / any"], "В утверждении — some books; перед lamp (согласный звук) — a.", "Болымды сөйлемде — some books; lamp алдында (дауыссыз дыбыс) — a."),
  ],
};

export default topic;
