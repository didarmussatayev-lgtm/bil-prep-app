import { EngTopic, mc, fill, fills, pick, vocab, joinBi } from "../kit";

const topic: EngTopic = {
  code: "1.1",
  title: { ru: "Мой дом: комнаты, мебель, порядковые числительные", kk: "Менің үйім: бөлмелер, жиһаз, реттік сандар" },
  explanation: joinBi(
    {
      ru: `Тема открывает Unit 1 «My House». Сначала — слова о доме, затем порядковые числительные (first, second, third…), которые нужны и в тексте, и в заданиях.

### Комнаты и мебель
Выучите слова из таблиц. Запоминайте не «слово — перевод», а «слово — картинка в голове»: представьте свою кухню и мысленно назовите всё, что в ней есть.`,
      kk: `Бұл тақырып Unit 1 «My House» бөлімін ашады. Алдымен үй туралы сөздерді, содан кейін реттік сандарды (first, second, third…) үйренеміз. Олар мәтіндер мен тапсырмаларда жиі кездеседі.

### Бөлмелер мен жиһаз
Кестедегі сөздерді жаттаңыз. «Сөз — аударма» емес, «сөз — көз алдындағы сурет» түрінде есте сақтаңыз: өз ас үйіңізді елестетіп, ондағы заттарды ойша атаңыз.`,
    },
    vocab({ ru: "Комнаты и кухня", kk: "Бөлмелер және ас үй" }, [
      ["kitchen", "ас үй", "кухня"], ["living room", "қонақ бөлме", "гостиная"], ["dining room", "асхана бөлмесі", "столовая"],
      ["bedroom", "жатын бөлме", "спальня"], ["bathroom", "жуынатын бөлме", "ванная комната"], ["cupboard", "ыдыс шкафы", "кухонный шкаф"],
      ["fridge", "тоңазытқыш", "холодильник"], ["cooker", "плита", "плита"], ["microwave", "микротолқынды пеш", "микроволновка"],
      ["kettle", "шәйнек", "чайник"], ["frying pan", "таба", "сковорода"], ["sink", "раковина", "раковина"],
    ]),
    vocab({ ru: "Мебель и предметы", kk: "Жиһаз және заттар" }, [
      ["sofa", "диван", "диван"], ["armchair", "кресло", "кресло"], ["bookcase", "кітап сөресі", "книжный шкаф"],
      ["coffee table", "шағын үстел", "журнальный столик"], ["wardrobe", "киім шкафы", "платяной шкаф"], ["desk", "жазу үстелі", "письменный стол"],
      ["carpet", "кілем", "ковёр"], ["curtain", "перде", "штора"], ["mirror", "айна", "зеркало"],
      ["towel", "сүлгі", "полотенце"], ["shower", "душ", "душ"], ["bath", "ванна", "ванна"],
    ]),
    {
      ru: `### Порядковые числительные
Порядковые отвечают на вопрос «который по счёту?»: первый, второй, третий.

:::figure {"kind":"table","caption":"Ordinal numbers","rows":[["1st first","2nd second","3rd third","4th fourth","5th fifth"],["6th sixth","7th seventh","8th eighth","9th ninth","10th tenth"],["11th eleventh","12th twelfth","13th thirteenth","19th nineteenth","20th twentieth"],["21st twenty-first","30th thirtieth","40th fortieth","50th fiftieth","100th hundredth"]]}
:::

:::rule Как образуются
Почти всегда: число + **-th** (fourth, sixth, seventh, tenth, thirteenth).
Исключения, которые надо выучить: **first, second, third**; **fifth** (f вместо ve), **eighth** (пишется одна t), **ninth** (нет e), **twelfth** (f вместо ve). Десятки: twenty → **twentieth** (y меняется на ie + th).
:::

:::warn Ловушка
Пишут **ninth**, а не «nineth», и **twelfth**, а не «twelveth». В составных числах порядковым делают только последнее слово: twenty-**first**, thirty-**second**.
:::

:::remember Где используются
Даты и месяцы (the **first** of May), этажи (the **second** floor), места в списке и на картинке (Nancy is **third** from James).
:::`,
      kk: `### Реттік сандар
Реттік сандар «нешінші?» деген сұраққа жауап береді: бірінші, екінші, үшінші.

:::figure {"kind":"table","caption":"Ordinal numbers","rows":[["1st first","2nd second","3rd third","4th fourth","5th fifth"],["6th sixth","7th seventh","8th eighth","9th ninth","10th tenth"],["11th eleventh","12th twelfth","13th thirteenth","19th nineteenth","20th twentieth"],["21st twenty-first","30th thirtieth","40th fortieth","50th fiftieth","100th hundredth"]]}
:::

:::rule Қалай жасалады
Көбіне: сан + **-th** (fourth, sixth, seventh, tenth, thirteenth).
Жаттау керек ерекшеліктер: **first, second, third**; **fifth** (ve орнына f), **eighth** (бір ғана t), **ninth** (e жоқ), **twelfth** (ve орнына f). Ондықтар: twenty → **twentieth** (y орнына ie + th).
:::

:::warn Қателікке ұрынбаңыз
**ninth** деп жазылады, «nineth» емес; **twelfth** деп жазылады, «twelveth» емес. Күрделі сандарда тек соңғы сөз реттік болады: twenty-**first**, thirty-**second**.
:::

:::remember Қайда қолданылады
Күндер мен айлар (the **first** of May), қабаттар (the **second** floor), тізімдегі және суреттегі орын (Nancy is **third** from James).
:::`,
    },
  ),
  practice: [
    fill("1", "You cook food on it in the kitchen. It is a c______ (6 letters). Write the word.", "cooker", "Cooker — плита, на которой готовят еду.", "Cooker — тамақ дайындайтын плита."),
    fill("2", "You keep milk and cheese cold in it. It is a f_____ (6 letters). Write the word.", "fridge", "Fridge — холодильник.", "Fridge — тоңазытқыш."),
    fill("3", "You hang your clothes in a w________ (8 letters). Write the word.", "wardrobe", "Wardrobe — платяной шкаф.", "Wardrobe — киім шкафы."),
    fill("4", "Write the ordinal number in words: 12", "twelfth", "12 → twelfth (f вместо ve).", "12 → twelfth (ve орнына f)."),
    fill("5", "Write the ordinal number in words: 9", "ninth", "9 → ninth (без e).", "9 → ninth (e жоқ)."),
    fill("6", "Write the ordinal number in words: 20", "twentieth", "20 → twentieth (y → ie + th).", "20 → twentieth (y → ie + th)."),
    fills("7", "Complete with ordinal numbers. January is the ______ month of the year. March is the ______ month. (Write two words.)", ["first", "third"], "January — 1-й месяц, March — 3-й.", "January — 1-ші ай, March — 3-ші ай."),
    pick("8", "Which words are ROOMS? Write the numbers.\n1. kitchen  2. sofa  3. bathroom  4. carpet  5. bedroom", [1, 3, 5], "Kitchen, bathroom, bedroom — комнаты; sofa и carpet — предметы мебели.", "Kitchen, bathroom, bedroom — бөлмелер; sofa мен carpet — жиһаз."),
  ],
  test: [
    mc("1", "Choose the correct answer.\nThe shower is in the ___.", ["bathroom", "kitchen", "living room", "dining room"], "Душ находится в ванной: bathroom.", "Душ жуынатын бөлмеде: bathroom."),
    mc("2", "Which word does NOT belong to the group?", ["towel", "sofa", "armchair", "bookcase"], "Sofa, armchair, bookcase — мебель; towel — предмет для ванной.", "Sofa, armchair, bookcase — жиһаз; towel — жуынатын бөлмеге арналған зат."),
    mc("3", "Read the ordinal number.\n13th = ___", ["thirteenth", "thirty", "third", "thirtieth"], "13th — thirteenth.", "13th — thirteenth."),
    mc("4", "Today is the 20th of October. Choose the correct word.", ["twentieth", "twenty", "twelfth", "twenty-first"], "20-е число — the twentieth.", "20-шы күн — the twentieth."),
    mc("5", "There is a ___ in the kitchen. You can heat soup in it.", ["microwave", "wardrobe", "carpet", "mirror"], "Суп разогревают в микроволновке: microwave.", "Сорпаны микротолқынды пеште қыздырады: microwave."),
    mc("6", "A frying pan is used to ___.", ["fry food", "wash hands", "sleep", "dry clothes"], "Frying pan — сковорода, на ней жарят (fry) еду.", "Frying pan — таба, онда тамақты қуырады (fry)."),
    mc("7", "My bedroom is on the second floor. The word 'second' means ___.", ["number 2 in order", "two things", "one more minute", "half of something"], "Second как порядковое числительное — «второй».", "Second реттік сан ретінде «екінші» дегенді білдіреді."),
    mc("8", "I look at myself in the ___.", ["mirror", "curtain", "fridge", "cooker"], "Смотрятся в зеркало: mirror.", "Айнаға қарайды: mirror."),
    mc("9", "Which ordinal number is spelled correctly?", ["ninth", "nineth", "nynth", "ninetth"], "Правильно: ninth (без e).", "Дұрысы: ninth (e жоқ)."),
    mc("10", "Mother cooks dinner in the ___ and we eat it in the dining room.", ["kitchen", "bathroom", "bedroom", "garden"], "Готовят на кухне: kitchen.", "Тамақты ас үйде дайындайды: kitchen."),
  ],
};

export default topic;
