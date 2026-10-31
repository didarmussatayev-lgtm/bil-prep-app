import { EngTopic, mc, fill, fills, pick, vocab, joinBi } from "../kit";

const topic: EngTopic = {
  code: "1.10",
  title: { ru: "Профессии и места работы", kk: "Мамандықтар және жұмыс орындары" },
  explanation: joinBi(
    {
      ru: `Unit 4 «Professions». Учим названия профессий, места работы и учимся описывать, чем занимается человек.`,
      kk: `Unit 4 «Professions». Мамандық атауларын, жұмыс орындарын үйреніп, адамның немен айналысатынын сипаттауды үйренеміз.`,
    },
    vocab({ ru: "Профессии", kk: "Мамандықтар" }, [
      ["doctor", "дәрігер", "врач"], ["nurse", "мейірбике", "медсестра"], ["teacher", "мұғалім", "учитель"], ["pilot", "ұшқыш", "лётчик"],
      ["firefighter", "өрт сөндіруші", "пожарный"], ["police officer", "полиция қызметкері", "полицейский"], ["cook / chef", "аспаз", "повар"], ["waiter / waitress", "даяшы", "официант / официантка"],
      ["driver", "жүргізуші", "водитель"], ["mechanic", "механик", "механик"], ["plumber", "сантехник", "сантехник"], ["journalist", "журналист", "журналист"],
      ["vet", "малдәрігер", "ветеринар"], ["baker", "наубайшы", "пекарь"], ["cashier", "кассир", "кассир"], ["accountant", "бухгалтер", "бухгалтер"],
      ["hairdresser", "шаштараз", "парикмахер"], ["architect", "сәулетші", "архитектор"], ["flight attendant", "стюардесса, бортсеріктес", "бортпроводник"], ["farmer", "фермер", "фермер"],
    ]),
    vocab({ ru: "Места работы", kk: "Жұмыс орындары" }, [
      ["hospital", "аурухана", "больница"], ["school", "мектеп", "школа"], ["restaurant", "мейрамхана", "ресторан"], ["fire station", "өрт сөндіру бекеті", "пожарная часть"],
      ["airport", "әуежай", "аэропорт"], ["garage", "гараж, автожөндеу", "гараж, автосервис"], ["bakery", "наубайхана", "пекарня"], ["supermarket", "супермаркет", "супермаркет"],
      ["office", "кеңсе", "офис"], ["farm", "ферма", "ферма"], ["beauty salon", "сұлулық салоны", "салон красоты"],
    ]),
    {
      ru: `### Как рассказать о профессии
:::rule Шаблоны
- **He is a doctor.** Он врач. (**a** перед согласным звуком, **an** перед гласным: an architect, an accountant.)
- **She works in a hospital.** Она работает в больнице.
- **She helps sick people.** Она помогает больным. *(3-е лицо ед. числа: helps, works, cooks)*
- **What does he do?** Кем он работает? — He is a pilot.
- **Where does she work?** Где она работает? — She works at a school.
:::

:::warn Ловушка
Вопрос **What does he do?** значит «Кем он работает?», а не «Что он делает сейчас?». Для действия прямо сейчас спрашивают *What is he doing?*
:::

:::tip Лайфхак
Если профессия оканчивается на **-er / -or / -ist / -ian**, то это **тот, кто делает**: teach**er** (учит), act**or** (играет), journal**ist** (пишет), electric**ian** (электрик).
:::`,
      kk: `### Мамандық туралы қалай айтамыз
:::rule Үлгілер
- **He is a doctor.** Ол дәрігер. (**a** дауыссыз дыбыстың алдында, **an** дауыстының алдында: an architect, an accountant.)
- **She works in a hospital.** Ол ауруханада жұмыс істейді.
- **She helps sick people.** Ол науқастарға көмектеседі. *(3-жақ жекеше: helps, works, cooks)*
- **What does he do?** Ол кім болып жұмыс істейді? — He is a pilot.
- **Where does she work?** Ол қайда жұмыс істейді? — She works at a school.
:::

:::warn Қателік
**What does he do?** «Ол кім болып жұмыс істейді?» дегенді білдіреді, «Қазір не істеп жатыр?» емес. Қазіргі әрекетті *What is he doing?* деп сұрайды.
:::

:::tip Кеңес
Мамандық **-er / -or / -ist / -ian**-мен аяқталса, ол **істейтін адам**: teach**er** (оқытады), act**or** (ойнайды), journal**ist** (жазады), electric**ian** (электрик).
:::`,
    },
  ),
  practice: [
    fill("1", "A person who flies planes is a ______. (5 letters)", "pilot", "Самолёт ведёт pilot.", "Ұшақты pilot басқарады."),
    fill("2", "A person who puts out fires is a ______. (11 letters, one word)", "firefighter", "Firefighter — пожарный.", "Firefighter — өрт сөндіруші."),
    fill("3", "A person who cooks food in a restaurant is a ______. (4 letters)", "cook", "Cook — повар.", "Cook — аспаз."),
    fill("4", "A person who looks after sick animals is a ______. (3 letters)", "vet", "Vet — ветеринар.", "Vet — малдәрігер."),
    fill("5", "A person who cuts your hair is a ______. (11 letters)", "hairdresser", "Hairdresser — парикмахер.", "Hairdresser — шаштараз."),
    fills("6", "Write a or an.\nHe is ___ architect. She is ___ nurse.", ["an", "a"], "Architect — an (гласный); nurse — a.", "Architect — an (дауысты); nurse — a."),
    fill("7", "Complete the question: What does your father ______? (He is a driver.)", "do", "What does he do? — «Кем он работает?».", "What does he do? — «Ол кім болып жұмыс істейді?»."),
    pick("8", "Which people work in a HOSPITAL? Write the numbers.\n1. doctor  2. pilot  3. nurse  4. baker  5. surgeon", [1, 3, 5], "В больнице: doctor, nurse, surgeon.", "Ауруханада: doctor, nurse, surgeon."),
  ],
  test: [
    mc("1", "A ___ makes bread and cakes in a bakery.", ["baker", "farmer", "pilot", "vet"], "Baker работает в bakery.", "Baker bakery-де жұмыс істейді."),
    mc("2", "Where does a waiter work?", ["In a restaurant", "At an airport", "In a garage", "At a fire station"], "Официант работает в ресторане.", "Даяшы мейрамханада жұмыс істейді."),
    mc("3", "A person who repairs cars is a ___.", ["mechanic", "plumber", "journalist", "cashier"], "Mechanic чинит машины.", "Mechanic көліктерді жөндейді."),
    mc("4", "She is ___ accountant.", ["an", "a", "the", "some"], "Accountant начинается с гласного звука — an.", "Accountant дауысты дыбыстан басталады — an."),
    mc("5", "What does your mother do? — She ___ a teacher.", ["is", "does", "has", "are"], "She is a teacher.", "She is a teacher."),
    mc("6", "A ___ looks after people on a plane.", ["flight attendant", "cashier", "baker", "architect"], "Flight attendant — бортпроводник.", "Flight attendant — бортсеріктес."),
    mc("7", "Which job is done by a person who writes articles for newspapers?", ["journalist", "plumber", "cook", "farmer"], "Journalist пишет статьи.", "Journalist мақала жазады."),
    mc("8", "Odd one out.", ["school", "hospital", "teacher", "airport"], "School, hospital, airport — места; teacher — профессия.", "School, hospital, airport — орындар; teacher — мамандық."),
    mc("9", "A ___ takes money in a supermarket.", ["cashier", "pilot", "firefighter", "vet"], "Cashier — кассир.", "Cashier — кассир."),
    mc("10", "Where does she work? — She works ___ a bank.", ["in", "on", "to", "of"], "Работать в банке: work in/at a bank.", "Банкте жұмыс істеу: work in/at a bank."),
  ],
};

export default topic;
