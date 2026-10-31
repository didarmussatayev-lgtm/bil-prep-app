import { EngTopic, mc, fill, fills, pick, vocab, joinBi } from "../kit";

const topic: EngTopic = {
  code: "1.7",
  title: { ru: "Семья и друзья. Характер. Притяжательный падеж ('s)", kk: "Отбасы және достар. Мінез. Тәуелдік септік ('s)" },
  explanation: joinBi(
    {
      ru: `Unit 3 «Family & Friends». Говорим о родственниках, описываем характер и показываем принадлежность с помощью **'s**.`,
      kk: `Unit 3 «Family & Friends». Туыстар туралы айтамыз, мінезді сипаттаймыз және **'s** арқылы тиесілілікті көрсетеміз.`,
    },
    vocab({ ru: "Семья", kk: "Отбасы" }, [
      ["parents", "ата-ана", "родители"], ["grandparents", "ата-әже", "бабушка и дедушка"], ["grandmother / grandfather", "әже / ата", "бабушка / дедушка"],
      ["uncle / aunt", "ағай, нағашы / апай, тәте", "дядя / тётя"], ["cousin", "немере аға-іні / апа-сіңлі", "двоюродный брат / сестра"], ["niece / nephew", "жиен қыз / жиен ұл", "племянница / племянник"],
      ["husband / wife", "күйеу / әйел", "муж / жена"], ["son / daughter", "ұл / қыз (бала)", "сын / дочь"], ["twins", "егіздер", "близнецы"],
      ["brother-in-law", "жезде / қайын аға", "зять / шурин"], ["only child", "жалғыз бала", "единственный ребёнок"],
    ]),
    vocab({ ru: "Характер", kk: "Мінез" }, [
      ["kind ↔ mean", "мейірімді ↔ сараң, қатыгез", "добрый ↔ злой, жадный"], ["polite ↔ rude", "сыпайы ↔ дөрекі", "вежливый ↔ грубый"], ["hard-working ↔ lazy", "еңбекқор ↔ жалқау", "трудолюбивый ↔ ленивый"],
      ["brave ↔ shy / scared", "батыл ↔ ұялшақ / қорқақ", "храбрый ↔ застенчивый / напуганный"], ["generous ↔ selfish", "жомарт ↔ өзімшіл", "щедрый ↔ эгоистичный"], ["honest ↔ dishonest", "адал ↔ жалған", "честный ↔ нечестный"],
      ["clever", "ақылды", "умный"], ["funny", "күлкілі, қызықты", "смешной"], ["friendly ↔ unfriendly", "ашық, мейірімді ↔ суық", "дружелюбный ↔ недружелюбный"], ["calm ↔ nervous", "сабырлы ↔ күйгелек", "спокойный ↔ нервный"],
    ]),
    {
      ru: `### Притяжательный падеж
Он отвечает на вопрос **«чей?»**.
:::figure {"kind":"table","caption":"Possessive case","rows":[["Правило","Пример"],["Одно существительное → + 's","Dana's book, the dog's tail"],["Множественное на -s → + ' (только апостроф)","the teachers' room, my parents' car"],["Множественное не на -s → + 's","children's toys, men's shoes"],["Несколько владельцев с общей вещью — 's у последнего","Ali and Aida's house"]]}
:::

:::warn Ловушка
**'s** может означать и is: Dana's tall (= Dana **is** tall) и Dana's book (книга **Даны**). Смотрите: после 's — прилагательное или глагол → is; существительное → принадлежность.
:::

:::tip Лайфхак
Если владелец — вещь, а не человек, чаще используют **of**: the door **of** the room, the end **of** the film.
:::`,
      kk: `### Тәуелдік септік
Ол **«кімдікі?»** деген сұраққа жауап береді.
:::figure {"kind":"table","caption":"Possessive case","rows":[["Ереже","Мысал"],["Бір зат есім → + 's","Dana's book, the dog's tail"],["-s-пен аяқталатын көпше → + ' (тек апостроф)","the teachers' room, my parents' car"],["-s-пен аяқталмайтын көпше → + 's","children's toys, men's shoes"],["Бірнеше иесі мен ортақ зат — 's соңғысында","Ali and Aida's house"]]}
:::

:::warn Қателік
**'s** is дегенді де білдіруі мүмкін: Dana's tall (= Dana **is** tall) және Dana's book (**Данаға** тиесілі кітап). 's-тен кейін сын есім немесе етістік тұрса — is; зат есім тұрса — тиесілілік.
:::

:::tip Кеңес
Иесі адам емес, зат болса, көбіне **of** қолданылады: the door **of** the room, the end **of** the film.
:::`,
    },
  ),
  practice: [
    fill("1", "Write the possessive: the book of Dana → ______ book", "dana's", "Одно имя → Dana's.", "Бір есім → Dana's."),
    fill("2", "Write the possessive: the room of the teachers → the ______ room", "teachers'", "Множественное на -s → teachers' (апостроф после s).", "-s-пен аяқталатын көпше → teachers' (s-тен кейін апостроф)."),
    fill("3", "Write the possessive: the toys of the children → the ______ toys", "children's", "Children не заканчивается на -s → children's.", "Children -s-пен аяқталмайды → children's."),
    fill("4", "Your father's brother is your ______. (5 letters)", "uncle", "Брат отца — дядя: uncle.", "Әкенің інісі/ағасы — uncle."),
    fill("5", "The opposite of 'polite' is ______. (4 letters)", "rude", "Polite ↔ rude.", "Polite ↔ rude."),
    fill("6", "The opposite of 'lazy' is hard-______.", "working", "Lazy ↔ hard-working.", "Lazy ↔ hard-working."),
    fills("7", "Write a word from the box: kind, shy, funny.\nHe never feels afraid of speaking to a new person. He is not ___. Everybody laughs at his jokes. He is ___.", ["shy", "funny"], "Not shy — «не застенчивый»; смешит людей — funny.", "Not shy — «ұялшақ емес»; адамдарды күлдіреді — funny."),
    pick("8", "Which sentences are CORRECT? Write the numbers.\n1. This is my parents' house.\n2. The cats' tail is long. (one cat)\n3. The children's room is on the left.\n4. Ali's is a good student. (Ali is…)", [1, 3], "Один кот → cat's tail; Ali's is — ошибка, нужно Ali is / Ali's.", "Бір мысық → cat's tail; Ali's is — қате."),
  ],
  test: [
    mc("1", "This is ___ car. (the car of my parents)", ["my parents'", "my parent's", "my parents's", "my parents"], "Множественное на -s → апостроф после s: parents'.", "-s-пен аяқталатын көпше → s-тен кейін апостроф: parents'."),
    mc("2", "My mother's sister is my ___.", ["aunt", "niece", "cousin", "grandmother"], "Сестра мамы — тётя: aunt.", "Шешенің қарындасы/әпкесі — aunt."),
    mc("3", "A person who always tells the truth is ___.", ["honest", "rude", "lazy", "selfish"], "Тот, кто говорит правду, — honest.", "Шындықты айтатын адам — honest."),
    mc("4", "The opposite of 'generous' is ___.", ["selfish", "kind", "polite", "brave"], "Generous ↔ selfish.", "Generous ↔ selfish."),
    mc("5", "Find the correct form.", ["women's clothes", "womens' clothes", "womans clothes", "woman's' clothes"], "Women не на -s → women's.", "Women -s-пен аяқталмайды → women's."),
    mc("6", "'Aigul's tall.' Here 's means ___.", ["is", "has", "was", "possession (of Aigul)"], "После 's идёт прилагательное tall → is.", "'s-тен кейін tall сын есімі → is."),
    mc("7", "My uncle's son is my ___.", ["cousin", "nephew", "brother", "grandfather"], "Сын дяди — двоюродный брат: cousin.", "Нағашының ұлы — cousin."),
    mc("8", "Sveta always helps other people and shares her things. She is very ___.", ["generous", "mean", "lazy", "rude"], "Делится вещами — generous.", "Заттарымен бөліседі — generous."),
    mc("9", "Two babies who were born on the same day to the same mother are ___.", ["twins", "cousins", "parents", "nieces"], "Близнецы — twins.", "Егіздер — twins."),
    mc("10", "Which sentence is correct?", ["Alan and Bota's house is big.", "Alan's and Bota's house are big (one house).", "Alans and Bota house is big.", "Alan and Botas' house are big."], "Общий дом — 's у последнего имени: Alan and Bota's house.", "Ортақ үй — соңғы есімге 's: Alan and Bota's house."),
  ],
};

export default topic;
