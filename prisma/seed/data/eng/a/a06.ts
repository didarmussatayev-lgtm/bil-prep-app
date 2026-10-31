import { EngTopic, mc, fill, fills, pick, vocab, joinBi } from "../kit";

const topic: EngTopic = {
  code: "1.6",
  title: { ru: "Множественное число существительных. Страны и национальности", kk: "Зат есімнің көпше түрі. Елдер мен ұлттар" },
  explanation: joinBi(
    {
      ru: `### Как образуется множественное число
:::figure {"kind":"table","caption":"Plural nouns","rows":[["Правило","Единственное → множественное"],["Обычно добавляем -s","a table → tables, a computer → computers"],["Слова на -s, -ss, -sh, -ch, -x, -o добавляют -es","a bus → buses, a box → boxes, a watch → watches, a potato → potatoes"],["Согласная + y → меняем y на -ies","a baby → babies, a city → cities"],["Гласная + y → просто -s","a boy → boys, a day → days"],["Слова на -f, -fe → -ves","a knife → knives, a wolf → wolves, a leaf → leaves"],["Исключения","man → men, woman → women, child → children, person → people, foot → feet, tooth → teeth, mouse → mice"],["Не меняются","sheep, fish, deer"]]}
:::

:::warn Ловушка
**Man** и **woman** произносятся по-разному, а пишутся **men** и **women**. **People** уже множественное число: People **are** friendly, а не «People is».
:::

### Страны и национальности
Национальность — прилагательное, оно пишется **с большой буквы**: a **K**azakh boy, **E**nglish food.
:::figure {"kind":"table","caption":"Countries and nationalities","rows":[["Country","Nationality"],["Kazakhstan","Kazakh"],["Russia","Russian"],["the USA","American"],["the UK / England","British / English"],["France","French"],["Germany","German"],["China","Chinese"],["Japan","Japanese"],["Turkey","Turkish"],["Italy","Italian"],["Egypt","Egyptian"],["India","Indian"]]}
:::

:::tip Окончания национальностей
Частые окончания: **-ian** (Russian, Italian), **-an** (German, American), **-ish** (Turkish, English), **-ese** (Chinese, Japanese), **-i** (Pakistani). Слова на **-ese** и **-ish** не имеют -s: «two Chinese».
:::`,
      kk: `### Көпше түр қалай жасалады
:::figure {"kind":"table","caption":"Plural nouns","rows":[["Ереже","Жекеше → көпше"],["Көбіне -s жалғанады","a table → tables, a computer → computers"],["-s, -ss, -sh, -ch, -x, -o-мен аяқталса -es жалғанады","a bus → buses, a box → boxes, a watch → watches, a potato → potatoes"],["Дауыссыз + y → y орнына -ies","a baby → babies, a city → cities"],["Дауысты + y → жай -s","a boy → boys, a day → days"],["-f, -fe → -ves","a knife → knives, a wolf → wolves, a leaf → leaves"],["Ерекшеліктер","man → men, woman → women, child → children, person → people, foot → feet, tooth → teeth, mouse → mice"],["Өзгермейді","sheep, fish, deer"]]}
:::

:::warn Қателік
**Man** мен **woman** басқаша айтылады, ал жазылуы **men** және **women**. **People** — көпше түр: People **are** friendly, «People is» емес.
:::

### Елдер мен ұлттар
Ұлт — сын есім, ол **бас әріппен** жазылады: a **K**azakh boy, **E**nglish food.
:::figure {"kind":"table","caption":"Countries and nationalities","rows":[["Country","Nationality"],["Kazakhstan","Kazakh"],["Russia","Russian"],["the USA","American"],["the UK / England","British / English"],["France","French"],["Germany","German"],["China","Chinese"],["Japan","Japanese"],["Turkey","Turkish"],["Italy","Italian"],["Egypt","Egyptian"],["India","Indian"]]}
:::

:::tip Ұлт жұрнақтары
Жиі жұрнақтар: **-ian** (Russian, Italian), **-an** (German, American), **-ish** (Turkish, English), **-ese** (Chinese, Japanese), **-i** (Pakistani). **-ese** және **-ish**-пен аяқталатын сөздерге -s қосылмайды: «two Chinese».
:::`,
    },
  ),
  practice: [
    fill("1", "Write the plural: a box → ______", "boxes", "Слова на -x → -es.", "-x-пен аяқталатын сөз → -es."),
    fill("2", "Write the plural: a city → ______", "cities", "Согласная + y → -ies.", "Дауыссыз + y → -ies."),
    fill("3", "Write the plural: a knife → ______", "knives", "-fe → -ves.", "-fe → -ves."),
    fill("4", "Write the plural: a child → ______", "children", "Исключение: child → children.", "Ерекшелік: child → children."),
    fill("5", "Write the plural: a boy → ______", "boys", "Гласная + y → просто -s.", "Дауысты + y → жай -s."),
    fill("6", "Write the nationality: a man from Japan is ______.", "japanese", "Japan → Japanese.", "Japan → Japanese."),
    fill("7", "Write the nationality: a woman from Germany is ______.", "german", "Germany → German.", "Germany → German."),
    pick("8", "Which plurals are CORRECT? Write the numbers.\n1. mans  2. women  3. potatoes  4. sheeps  5. mice", [2, 3, 5], "Правильно: women, potatoes, mice. Не mans (men) и не sheeps (sheep).", "Дұрысы: women, potatoes, mice. mans емес (men), sheeps емес (sheep)."),
  ],
  test: [
    mc("1", "The plural of 'watch' is ___.", ["watches", "watchs", "watchies", "watchen"], "Слова на -ch → -es.", "-ch-мен аяқталатын сөздер → -es."),
    mc("2", "There are two ___ on the shelf.", ["leaves", "leafs", "leaf", "leafes"], "Leaf → leaves.", "Leaf → leaves."),
    mc("3", "Many ___ come to Kazakhstan every year.", ["people", "peoples", "person", "persons"], "People — множественное число слова person.", "People — person сөзінің көпше түрі."),
    mc("4", "The plural of 'baby' is ___.", ["babies", "babys", "babyes", "babyies"], "Согласная + y → -ies.", "Дауыссыз + y → -ies."),
    mc("5", "A person from France is ___.", ["French", "France", "Frenchish", "Franch"], "France → French.", "France → French."),
    mc("6", "My uncle has got three ___ on his farm.", ["sheep", "sheeps", "sheepes", "sheepies"], "Sheep не изменяется во множественном числе.", "Sheep көпше түрде өзгермейді."),
    mc("7", "Which sentence is correct?", ["The children are in the garden.", "The childs are in the garden.", "The childrens are in the garden.", "The child are in the garden."], "Children — уже множественное число; глагол — are.", "Children — көпше түр; етістік — are."),
    mc("8", "Which word is spelled correctly as a nationality?", ["Turkish", "turkish", "Turkeyish", "Turky"], "Национальность пишется с большой буквы: Turkish.", "Ұлт бас әріппен жазылады: Turkish."),
    mc("9", "The plural of 'tooth' is ___.", ["teeth", "tooths", "teeths", "toothes"], "Tooth → teeth.", "Tooth → teeth."),
    mc("10", "A man from Italy is ___.", ["Italian", "Italish", "Italese", "Italy"], "Italy → Italian.", "Italy → Italian."),
  ],
};

export default topic;
