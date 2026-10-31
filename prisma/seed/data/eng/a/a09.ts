import { EngTopic, mc, fill, fills, pick, order, joinBi } from "../kit";

const topic: EngTopic = {
  code: "1.9",
  title: { ru: "Распорядок дня и время", kk: "Күн тәртібі және уақыт" },
  explanation: joinBi(
    {
      ru: `### Как сказать время
:::figure {"kind":"table","caption":"Telling the time","rows":[["Время","Как сказать"],["7:00","It's seven o'clock."],["7:15","It's a quarter past seven."],["7:30","It's half past seven."],["7:45","It's a quarter to eight."],["7:10","It's ten past seven."],["7:50","It's ten to eight."]]}
:::

:::rule Past и to
Первые 30 минут часа — **past** («после»): ten **past** seven. Вторые 30 минут — **to** («до»): ten **to** eight. Предлоги: **at** 7 o'clock, **in** the morning, **at** night, **on** Monday.
:::

### Распорядок дня (daily routine)
:::figure {"kind":"table","caption":"Daily routine","rows":[["get up","вставать"],["wash my face","умываться"],["have breakfast / lunch / dinner","завтракать / обедать / ужинать"],["go to school","идти в школу"],["do my homework","делать домашнее задание"],["go to bed","ложиться спать"],["brush my teeth","чистить зубы"],["come home","возвращаться домой"],["have a shower","принимать душ"],["watch TV","смотреть телевизор"]]}
:::

Порядок слов в рассказе: *I get up at 7. **Then** I have breakfast. **After that** I go to school. **In the evening** I do my homework. **Finally**, I go to bed at 10.*

:::tip Слова-связки
First, then, after that, next, in the afternoon, in the evening, finally — они помогают рассказать о дне последовательно.
:::`,
      kk: `### Уақытты қалай айтамыз
:::figure {"kind":"table","caption":"Telling the time","rows":[["Уақыт","Қалай айтамыз"],["7:00","It's seven o'clock."],["7:15","It's a quarter past seven."],["7:30","It's half past seven."],["7:45","It's a quarter to eight."],["7:10","It's ten past seven."],["7:50","It's ten to eight."]]}
:::

:::rule Past және to
Сағаттың алғашқы 30 минуты — **past** («өткен»): ten **past** seven. Соңғы 30 минут — **to** («дейін»): ten **to** eight. Предлогтар: **at** 7 o'clock, **in** the morning, **at** night, **on** Monday.
:::

### Күн тәртібі (daily routine)
:::figure {"kind":"table","caption":"Daily routine","rows":[["get up","тұру"],["wash my face","бетімді жуу"],["have breakfast / lunch / dinner","таңғы ас / түскі ас / кешкі ас ішу"],["go to school","мектепке бару"],["do my homework","үй тапсырмасын орындау"],["go to bed","төсекке жату"],["brush my teeth","тісті тазалау"],["come home","үйге келу"],["have a shower","душ қабылдау"],["watch TV","теледидар көру"]]}
:::

Әңгімедегі сөздер реті: *I get up at 7. **Then** I have breakfast. **After that** I go to school. **In the evening** I do my homework. **Finally**, I go to bed at 10.*

:::tip Байланыстырушы сөздер
First, then, after that, next, in the afternoon, in the evening, finally — олар күн туралы дәйекті түрде айтуға көмектеседі.
:::`,
    },
  ),
  practice: [
    fill("1", "Write the time in words: 3:30 → It's ______ past three.", "half", "30 минут — half past.", "30 минут — half past."),
    fill("2", "Write the time in words: 5:15 → It's a ______ past five.", "quarter", "15 минут — a quarter past.", "15 минут — a quarter past."),
    fill("3", "Write the missing word: 8:45 → It's a quarter ______ nine.", "to", "Вторая половина часа — to.", "Сағаттың екінші жартысы — to."),
    fills("4", "Write at, in or on.\nI get up ___ 7 o'clock. I do my homework ___ the evening. I go swimming ___ Saturday.", ["at", "in", "on"], "At + точное время; in + часть дня; on + день недели.", "At + нақты уақыт; in + тәулік бөлігі; on + апта күні."),
    fill("5", "Write the word: ______ breakfast, I go to school. (the next action)", "after", "After breakfast — после завтрака.", "After breakfast — таңғы астан кейін."),
    order("6", "Put the daily routine in order. Write the numbers.\n1. I go to school.  2. I get up.  3. I have breakfast.  4. I go to bed.", [2, 3, 1, 4], "Get up → breakfast → school → bed.", "Get up → breakfast → school → bed."),
    pick("7", "Which times are the SAME as 6:45? Write the numbers.\n1. a quarter to seven\n2. a quarter past six\n3. fifteen minutes to seven\n4. half past six", [1, 3], "6:45 — это без пятнадцати семь: a quarter to seven = fifteen minutes to seven.", "6:45 — жетіге он бес минут қалды: a quarter to seven = fifteen minutes to seven."),
    fill("8", "Complete: ______ I go to bed, I brush my teeth. (before the action)", "before", "Before — перед тем как.", "Before — алдында."),
  ],
  test: [
    mc("1", "7:30 — It's ___ seven.", ["half past", "a quarter to", "ten to", "o'clock"], "7:30 — half past seven.", "7:30 — half past seven."),
    mc("2", "What time is it? 8:45", ["It's a quarter to nine.", "It's a quarter past eight.", "It's half past eight.", "It's nine o'clock."], "8:45 — a quarter to nine.", "8:45 — a quarter to nine."),
    mc("3", "I usually wake up ___ 6:30 ___ the morning.", ["at / in", "in / at", "on / on", "at / at"], "At 6:30, in the morning.", "At 6:30, in the morning."),
    mc("4", "Which is the best order?", ["I get up. Then I have breakfast. After that I go to school.", "I go to school. Then I get up. After that I have breakfast.", "I have breakfast. Then I go to bed. After that I get up.", "After that I get up. Then I go to school."], "Логичный порядок: встаю → завтракаю → иду в школу.", "Логикалық реті: тұрамын → тамақтанамын → мектепке барамын."),
    mc("5", "The film starts ___ Saturday.", ["on", "at", "in", "to"], "On + день недели.", "On + апта күні."),
    mc("6", "We have lunch ___ 1 o'clock.", ["at", "in", "on", "by"], "At + точное время.", "At + нақты уақыт."),
    mc("7", "10:10 — It's ten ___ ten.", ["past", "to", "in", "at"], "Первая половина часа — past.", "Сағаттың бірінші жартысы — past."),
    mc("8", "He ___ his teeth before he goes to bed.", ["brushes", "brush", "is brush", "brushing"], "He → brushes.", "He → brushes."),
    mc("9", "Which word means 'after that'?", ["Then", "Before", "Always", "Never"], "Then — «затем, потом».", "Then — «содан кейін»."),
    mc("10", "I ___ my homework in the afternoon.", ["do", "make", "play", "go"], "Do homework — устойчивое сочетание.", "Do homework — тұрақты тіркес."),
  ],
};

export default topic;
