import { EngTopic, mc, fill, fills, pick, joinBi } from "../kit";

const topic: EngTopic = {
  code: "1.12",
  title: { ru: "Вопросительные слова", kk: "Сұрау сөздері" },
  explanation: joinBi(
    {
      ru: `Вопросительные слова задают вопрос о конкретной информации. Они стоят **в начале** вопроса.

:::figure {"kind":"table","caption":"Question words","rows":[["Слово","О чём спрашиваем","Пример"],["Who","о человеке (кто?)","Who is that? — It's Mr Smith."],["What","о предмете, действии (что?)","What is this? — It's a book."],["Where","о месте (где? куда?)","Where do you live?"],["When","о времени (когда?)","When do you get up?"],["Why","о причине (почему?)","Why are you late?"],["How","о способе (как?)","How do you go to school?"],["How old","о возрасте","How old are you?"],["How many","о количестве (считаемое)","How many books have you got?"],["How much","о количестве (несчитаемое), о цене","How much milk is there?"],["Whose","о принадлежности (чей?)","Whose bag is this? — It's Ali's."],["What kind of","о виде, типе","What kind of music do you like?"],["Which","о выборе из нескольких","Which colour do you like?"]]}
:::

:::rule Порядок слов в вопросе
**Вопросительное слово + вспомогательный глагол (do/does/is/are/can…) + подлежащее + смысловой глагол?**
**Where** does she live? — **What** are you doing? — **When** can we start?
:::

:::warn Ловушка
**How many** — с считаемыми (apples, books), **how much** — с несчитаемыми (milk, water, money). Пример: *How many pens? How much water?*
:::

:::tip Лайфхак
Вопрос к подлежащему (Who/What) не нуждается в do/does: **Who** lives here? **What** happens next?
:::`,
      kk: `Сұрау сөздері нақты ақпарат сұрайды. Олар сұрақтың **басында** тұрады.

:::figure {"kind":"table","caption":"Question words","rows":[["Сөз","Нені сұрайды","Мысал"],["Who","адам туралы (кім?)","Who is that? — It's Mr Smith."],["What","зат, әрекет (не?)","What is this? — It's a book."],["Where","орын (қайда?)","Where do you live?"],["When","уақыт (қашан?)","When do you get up?"],["Why","себеп (неге?)","Why are you late?"],["How","тәсіл (қалай?)","How do you go to school?"],["How old","жас","How old are you?"],["How many","сан (санауға келетін)","How many books have you got?"],["How much","сан (санауға келмейтін), баға","How much milk is there?"],["Whose","тиесілілік (кімдікі?)","Whose bag is this? — It's Ali's."],["What kind of","түр, сорт","What kind of music do you like?"],["Which","бірнешеуінен таңдау","Which colour do you like?"]]}
:::

:::rule Сұрақтағы сөз реті
**Сұрау сөзі + көмекші етістік (do/does/is/are/can…) + бастауыш + мағыналы етістік?**
**Where** does she live? — **What** are you doing? — **When** can we start?
:::

:::warn Қателік
**How many** — санауға келетін заттармен (apples, books), **how much** — санауға келмейтінмен (milk, water, money). *How many pens? How much water?*
:::

:::tip Кеңес
Бастауышқа қойылған сұрақта (Who/What) do/does қажет емес: **Who** lives here? **What** happens next?
:::`,
    },
  ),
  practice: [
    fill("1", "Write the question word: ______ is your birthday? — It's on 5th May.", "when", "Ответ о дате → when.", "Жауап — күн → when."),
    fill("2", "Write the question word: ______ do you live? — In Astana.", "where", "Ответ о месте → where.", "Жауап — орын → where."),
    fill("3", "Write the question word: ______ is that man? — He is my uncle.", "who", "Ответ о человеке → who.", "Жауап — адам → who."),
    fill("4", "Write the question word: ______ old is your sister? — She is twelve.", "how", "How old are you? — вопрос о возрасте.", "How old are you? — жасты сұрау."),
    fills("5", "Write many or much.\nHow ___ students are there in your class? How ___ money have you got?", ["many", "much"], "Students считаются — many; money несчитаемое — much.", "Students санауға келеді — many; money келмейді — much."),
    fill("6", "Write the question word: ______ bag is this? — It's Aida's.", "whose", "Принадлежность → whose.", "Тиесілілік → whose."),
    fill("7", "Write the question word: ______ are you crying? — Because I lost my phone.", "why", "Ответ с because → why.", "Because-пен жауап → why."),
    pick("8", "Which questions have the correct word order? Write the numbers.\n1. Where does he live?\n2. When you get up?\n3. What are you doing?\n4. How she goes to school?", [1, 3], "В 2 нужно When do you get up?; в 4 — How does she go to school?", "2-де When do you get up?; 4-те How does she go to school?"),
  ],
  test: [
    mc("1", "___ is your name? — My name is Alibek.", ["What", "Where", "When", "Why"], "Вопрос о имени — what.", "Атты сұрау — what."),
    mc("2", "___ do you get up? — At seven o'clock.", ["When", "Where", "Who", "Whose"], "Время → when.", "Уақыт → when."),
    mc("3", "___ pencils have you got? — Three.", ["How many", "How much", "How old", "What"], "Pencils считаются — how many.", "Pencils санауға келеді — how many."),
    mc("4", "___ is this? — It's 1,000 tenge.", ["How much", "How many", "How old", "Who"], "Цена — how much.", "Баға — how much."),
    mc("5", "___ car is that? — It's my father's.", ["Whose", "Who", "What", "Which"], "Принадлежность — whose.", "Тиесілілік — whose."),
    mc("6", "Where ___ your grandmother live?", ["does", "do", "is", "has"], "Grandmother (she) → does.", "Grandmother (she) → does."),
    mc("7", "Why ___ you smiling?", ["are", "do", "does", "have"], "Present Continuous: Why are you smiling?", "Present Continuous: Why are you smiling?"),
    mc("8", "Which question is correct?", ["What time does the film start?", "What time the film starts?", "What time starts the film?", "What does the film starts time?"], "Порядок: What time + does + подлежащее + глагол.", "Реті: What time + does + бастауыш + етістік."),
    mc("9", "___ is your best friend? — Dana. She is in my class.", ["Who", "What", "Where", "How"], "Спрашиваем о человеке — who.", "Адамды сұраймыз — who."),
    mc("10", "___ kind of music do you like? — Pop and rock.", ["What", "Who", "How", "Whose"], "What kind of — какой вид?", "What kind of — қандай түрі?"),
  ],
};

export default topic;
