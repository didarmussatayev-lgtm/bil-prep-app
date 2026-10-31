import { EngTopic, mc, fill, fills, pick, joinBi } from "../kit";

const topic: EngTopic = {
  code: "1.5",
  title: { ru: "Местоимения, притяжательные прилагательные, this / that / these / those", kk: "Есімдіктер, тәуелдік сын есімдер, this / that / these / those" },
  explanation: joinBi(
    {
      ru: `Местоимения заменяют существительные, а притяжательные слова показывают, **кому принадлежит** предмет. Эти слова встречаются в каждом предложении, поэтому их надо знать наизусть.

### Таблица местоимений
:::figure {"kind":"table","caption":"Pronouns","rows":[["Подлежащее (кто?)","Дополнение (кого? кому?)","Притяжательное прилагательное (чей?)","Притяжательное местоимение (чей — без существительного)"],["I","me","my","mine"],["you","you","your","yours"],["he","him","his","his"],["she","her","her","hers"],["it","it","its","—"],["we","us","our","ours"],["they","them","their","theirs"]]}
:::

:::rule Как пользоваться
- **Подлежащее** стоит перед глаголом: **She** likes music.
- **Дополнение** стоит после глагола или предлога: I love **her**. Give it to **them**.
- **Притяжательное прилагательное** стоит перед существительным: **my** book, **their** house.
- **Притяжательное местоимение** стоит само, без существительного: This book is **mine**.
:::

:::warn Ловушка
**its** (чей-то, у вещи/животного) пишется без апострофа. **It's** = it is. Сравните: The dog wants **its** bone. **It's** hungry.
:::

### This / that / these / those
:::figure {"kind":"table","caption":"Demonstratives","rows":[["","Близко","Далеко"],["Один предмет","this (это, этот)","that (то, тот)"],["Много предметов","these (эти)","those (те)"]]}
:::

This is a banana. **These** are bananas. **That** is a banana (far). **Those** are bananas (far).

:::tip Лайфхак
**this / these** — «здесь, рядом» (th**i**s — близко), **that / those** — «там, далеко». Глагол: this/that + **is**, these/those + **are**.
:::`,
      kk: `Есімдіктер зат есімдердің орнына жүреді, ал тәуелдік сөздер заттың **кімге тиесілі** екенін көрсетеді. Бұл сөздер әр сөйлемде кездеседі, сондықтан жатқа білу керек.

### Есімдіктер кестесі
:::figure {"kind":"table","caption":"Pronouns","rows":[["Бастауыш (кім?)","Толықтауыш (кімді? кімге?)","Тәуелдік сын есім (кімнің?)","Тәуелдік есімдік (зат есімсіз)"],["I","me","my","mine"],["you","you","your","yours"],["he","him","his","his"],["she","her","her","hers"],["it","it","its","—"],["we","us","our","ours"],["they","them","their","theirs"]]}
:::

:::rule Қалай қолданылады
- **Бастауыш** етістіктің алдында тұрады: **She** likes music.
- **Толықтауыш** етістіктен немесе предлогтан кейін тұрады: I love **her**. Give it to **them**.
- **Тәуелдік сын есім** зат есімнің алдында тұрады: **my** book, **their** house.
- **Тәуелдік есімдік** зат есімсіз өзі тұрады: This book is **mine**.
:::

:::warn Қателік
**its** (затқа/жануарға тиесілі) апострофсыз жазылады. **It's** = it is. Салыстырыңыз: The dog wants **its** bone. **It's** hungry.
:::

### This / that / these / those
:::figure {"kind":"table","caption":"Demonstratives","rows":[["","Жақын","Алыс"],["Бір зат","this (бұл)","that (анау)"],["Көп зат","these (мыналар)","those (анау-лар)"]]}
:::

This is a banana. **These** are bananas. **That** is a banana (far). **Those** are bananas (far).

:::tip Кеңес
**this / these** — «мұнда, жақын», **that / those** — «анда, алыс». Етістік: this/that + **is**, these/those + **are**.
:::`,
    },
  ),
  practice: [
    fills("1", "Write the subject pronouns.\nMarat is my friend. ___ is tall. Aigul and I are classmates. ___ study together.", ["he", "we"], "Marat → he; Aigul and I → we.", "Marat → he; Aigul and I → we."),
    fills("2", "Write the object pronouns.\nI love my parents. I help ___ every day. Look at that girl. Do you know ___?", ["them", "her"], "Parents → them; girl → her.", "Parents → them; girl → her."),
    fills("3", "Write the possessive adjectives.\nThis is Ann. ___ eyes are green. We live in Almaty. ___ house is big.", ["her", "our"], "Ann → her; we → our.", "Ann → her; we → our."),
    fill("4", "Write the possessive pronoun.\nThis bag isn't yours. It's ______. (It belongs to me.)", "mine", "Мне принадлежит — mine.", "Маған тиесілі — mine."),
    fills("5", "Write this, that, these or those.\n___ is my pen (it is in my hand). ___ are my friends (they are far away).", ["this", "those"], "Близкий один предмет — this; далёкие люди — those.", "Жақын бір зат — this; алыстағы адамдар — those."),
    fill("6", "Write one word.\nThe dog wants ______ bone. (the bone of the dog)", "its", "Притяжательное прилагательное для it — its (без апострофа).", "It-тің тәуелдік сын есімі — its (апострофсыз)."),
    fills("7", "Write is or are.\nThis ___ a banana. Those ___ bananas.", ["is", "are"], "This + is; those + are.", "This + is; those + are."),
    pick("8", "Which sentences are CORRECT? Write the numbers.\n1. This is my book.\n2. Those is her bag.\n3. These are their houses.\n4. It's wagging it's tail.", [1, 3], "В 2 — Those are; в 4 — its tail (без апострофа).", "2-де Those are; 4-те its tail (апострофсыз)."),
  ],
  test: [
    mc("1", "Choose the correct word.\nDo you know that boy? — Yes, I know ___.", ["him", "he", "his", "her"], "После глагола — дополнение: him.", "Етістіктен кейін — толықтауыш: him."),
    mc("2", "Kate is my sister. ___ hair is long.", ["Her", "She", "Hers", "He"], "Перед существительным нужно притяжательное прилагательное: her.", "Зат есімнің алдында тәуелдік сын есім керек: her."),
    mc("3", "These books aren't yours. They are ___.", ["mine", "my", "me", "I"], "Притяжательное местоимение без существительного — mine.", "Зат есімсіз тәуелдік есімдік — mine."),
    mc("4", "___ are my new shoes. (They are near me.)", ["These", "This", "That", "It"], "Много предметов, рядом — these.", "Көп зат, жақын — these."),
    mc("5", "Look at the cat! ___ is eating ___ food.", ["It / its", "It / it's", "Its / it", "He / it's"], "It is eating its food. It's = it is, а здесь нужна принадлежность.", "It is eating its food. It's = it is, ал мұнда тиесілілік керек."),
    mc("6", "My friends and I like football. ___ play every Saturday.", ["We", "Us", "Our", "They"], "My friends and I = we.", "My friends and I = we."),
    mc("7", "Is this your umbrella? — No, it isn't ___. It's Sara's.", ["mine", "my", "me", "I"], "Mine — «моё».", "Mine — «менікі»."),
    mc("8", "Mr and Mrs Brown live in London. ___ children go to school there.", ["Their", "Them", "They", "Theirs"], "Притяжательное прилагательное перед существительным — their.", "Зат есімнің алдында тәуелдік сын есім — their."),
    mc("9", "___ is a pencil, but ___ are pens. (The pencil is near, the pens are far away.)", ["This / those", "These / that", "That / these", "Those / this"], "Pencil рядом — this; pens вдали — those.", "Pencil жақын — this; pens алыс — those."),
    mc("10", "Give the ball to ___.", ["her", "she", "hers", "he"], "После предлога to — дополнение: her.", "To предлогынан кейін — толықтауыш: her."),
  ],
};

export default topic;
