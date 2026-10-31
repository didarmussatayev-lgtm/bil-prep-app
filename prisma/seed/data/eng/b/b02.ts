import { EngTopic, mc, fill, count, pick, joinBi } from "../kit";

const topic: EngTopic = {
  code: "2.2",
  title: { ru: "What does it say? Знаки, объявления, сообщения", kk: "What does it say? Белгілер, хабарландырулар, хабарламалар" },
  explanation: joinBi(
    {
      ru: `Это самый короткий тип заданий экзамена: дан **знак, объявление или SMS**, и нужно выбрать, **что оно означает**. Обычно 3 варианта (A, B, C).

:::steps Как решать
1. Найдите **ключевое слово** (запрет, цена, время, действие).
2. Определите тип: **запрет** (Don't…, No…, … forbidden), **разрешение**, **предупреждение** (Warning, Danger, Caution), **информация** (Open, Sale, Free).
3. Выберите вариант с **тем же смыслом**, а не с теми же словами.
:::

:::figure {"kind":"table","caption":"Частые знаки и слова","rows":[["Текст знака","Смысл"],["No entry / Keep out","Входить нельзя"],["Wet floor / Slippery","Осторожно, мокрый пол"],["Out of order","Не работает (сломан)"],["Exit / Way out","Выход"],["Push / Pull","Толкать / тянуть (дверь)"],["Sale / Reduced prices","Скидки"],["Please queue here","Встаньте в очередь здесь"],["No smoking / No photos","Нельзя курить / фотографировать"],["Open 9–5 / Closed","Часы работы / закрыто"],["Fragile / Handle with care","Хрупкое, обращаться осторожно"]]}
:::

### Сообщения и записки
Часто даны короткая записка или электронное письмо, и надо понять, **что должен сделать читающий**:
*"Aida, Mum phoned. She'll be late. Please start cooking dinner."* → Aida должна начать готовить ужин.

:::warn Ловушка
Не путайте **mustn't** («нельзя») и **don't have to** («не обязательно»), **must** («обязательно») и **can** («можно»). Читайте точный смысл!
:::

:::tip Лайфхак
Если в тексте есть **please** — это просьба что-то сделать. Если **Don't / No / not allowed** — запрет. Если **free / discount / sale** — информация о цене.
:::`,
      kk: `Бұл — емтиханның ең қысқа тапсырма түрі: **белгі, хабарландыру немесе SMS** беріледі, оның **не білдіретінін** таңдау керек. Әдетте 3 нұсқа болады (A, B, C).

:::steps Қалай шешеміз
1. **Негізгі сөзді** табыңыз (тыйым, баға, уақыт, әрекет).
2. Түрін анықтаңыз: **тыйым** (Don't…, No…, … forbidden), **рұқсат**, **ескерту** (Warning, Danger, Caution), **ақпарат** (Open, Sale, Free).
3. Сөздері емес, **мағынасы бірдей** нұсқаны таңдаңыз.
:::

:::figure {"kind":"table","caption":"Жиі кездесетін белгілер мен сөздер","rows":[["Белгі мәтіні","Мағынасы"],["No entry / Keep out","Кіруге болмайды"],["Wet floor / Slippery","Абай болыңыз, едән дымқыл"],["Out of order","Жұмыс істемейді (бұзылған)"],["Exit / Way out","Шығу"],["Push / Pull","Итеру / тарту (есік)"],["Sale / Reduced prices","Жеңілдіктер"],["Please queue here","Осы жерде кезекке тұрыңыз"],["No smoking / No photos","Темекі шегуге / суретке түсіруге болмайды"],["Open 9–5 / Closed","Жұмыс уақыты / жабық"],["Fragile / Handle with care","Сынғыш, сақ болыңыз"]]}
:::

### Хабарламалар мен жазбалар
Көбіне қысқа жазба немесе электрондық хат беріліп, **оқушы не істеуі керек екенін** түсіну керек:
*"Aida, Mum phoned. She'll be late. Please start cooking dinner."* → Aida кешкі ас дайындай бастауы керек.

:::warn Қателік
**mustn't** («болмайды») мен **don't have to** («міндетті емес»), **must** («міндетті») мен **can** («болады») араластырмаңыз. Нақты мағынасын оқыңыз!
:::

:::tip Кеңес
Мәтінде **please** болса — бұл бір нәрсе істеуге өтініш. **Don't / No / not allowed** болса — тыйым. **free / discount / sale** болса — баға туралы ақпарат.
:::`,
    },
  ),
  practice: [
    count("1", "Read the sign and choose the meaning (write 1, 2 or 3):\n\"WET FLOOR\"\n1. Be careful, the floor is slippery.\n2. Please wash the floor.\n3. The floor is closed.", 1, "Wet floor — мокрый пол, будьте осторожны.", "Wet floor — едән дымқыл, абай болыңыз."),
    count("2", "Read the sign and choose the meaning (write 1, 2 or 3):\n\"NO ENTRY\"\n1. Come in, please.\n2. You can't go in.\n3. Enter and pay.", 2, "No entry — вход запрещён.", "No entry — кіруге тыйым."),
    count("3", "Read the message:\n\"Dina, I'm at the dentist. I'll be home at 5. Please feed the cat.\"\nWhat must Dina do? Choose 1, 2 or 3.\n1. Go to the dentist.\n2. Give food to the cat.\n3. Come home at 5.", 2, "Please feed the cat — накормить кота.", "Please feed the cat — мысыққа тамақ беру."),
    fill("4", "Read the sign: \"OUT OF ORDER\" on a lift.\nIs the lift working? Write yes or no.", "no", "Out of order — не работает.", "Out of order — жұмыс істемейді."),
    count("5", "\"SALE! Everything 50% off.\" The jacket costs 10,000 tenge. How much does it cost in the sale? Write the number.", 5000, "50 % от 10 000 = 5 000.", "10 000-ның 50 %-ы = 5 000."),
    pick("6", "Which signs mean you CAN'T do something? Write the numbers.\n1. No parking\n2. Open 24 hours\n3. Keep out\n4. Free Wi-Fi", [1, 3], "No parking и Keep out — запреты.", "No parking және Keep out — тыйымдар."),
    count("7", "\"The shop closes at 6 p.m. on weekdays and at 2 p.m. on Saturdays.\" How many hours earlier does it close on Saturdays? Write the number.", 4, "6 вечера − 2 дня = 4 часа.", "Кеш 6 − күндізгі 2 = 4 сағат."),
    count("8", "Read the sign: \"PLEASE DON'T FEED THE ANIMALS\". What does it mean? Choose 1 or 2.\n1. You mustn't give food to the animals.\n2. You should give food to the animals.", 1, "Don't feed — не кормить.", "Don't feed — азық бермеңіз."),
  ],
  test: [
    mc("1", "What does it say?\nVISITORS MUST REPORT TO RECEPTION", ["Guests need to go to the reception desk first.", "Visitors can enter freely.", "The reception is closed.", "Only staff can come in."], "Report to reception — сначала подойти на ресепшн.", "Report to reception — алдымен ресепшнге бару."),
    mc("2", "What does the message say?\nMaria – your sister phoned. She can't meet you tomorrow. Please call her back.", ["Maria should telephone her sister.", "Maria should visit her sister.", "Maria's sister will come tomorrow.", "Maria should write an email."], "Call her back — перезвонить.", "Call her back — қайта қоңырау шалу."),
    mc("3", "What does it say?\nKEEP OFF THE GRASS", ["Don't walk on the grass.", "Water the grass.", "Cut the grass.", "Sit on the grass."], "Keep off — не заходить.", "Keep off — шықпаңыз."),
    mc("4", "What does it say?\nCLOSED FOR REPAIRS UNTIL FRIDAY", ["You can't go in before Friday.", "It opens on Wednesday.", "It is open only on Friday.", "It's closed forever."], "Until Friday — до пятницы.", "Until Friday — жұмаға дейін."),
    mc("5", "What does it say?\nPASSENGERS MUST HOLD A VALID TICKET. ANY PASSENGER WITHOUT A TICKET WILL PAY A FINE OF £10.", ["Travelling without a ticket costs £10.", "A ticket costs £10.", "Tickets are free.", "You can't buy tickets here."], "Fine £10 — штраф 10 фунтов.", "Fine £10 — 10 фунт айыппұл."),
    mc("6", "Read the note: 'Marat, I've gone to the shop. Back in 20 minutes. Don't open the door to strangers.' What shouldn't Marat do?", ["Open the door to strangers", "Go to the shop", "Wait for 20 minutes", "Stay at home"], "Don't open the door to strangers.", "Don't open the door to strangers."),
    mc("7", "What does it say?\nSWIMMING ONLY WITH AN ADULT", ["Children must have an adult with them.", "Only adults can swim.", "Swimming is forbidden.", "The pool is free."], "Only with an adult — только со взрослым.", "Only with an adult — тек ересекпен бірге."),
    mc("8", "What does it say?\nTHIS DOOR MUST BE KEPT CLOSED", ["Don't leave this door open.", "Open this door.", "The door is broken.", "The door is closed for today."], "Must be kept closed — держите закрытой.", "Must be kept closed — жабық ұстаңыз."),
    mc("9", "What does it say?\nHANDLE WITH CARE", ["The parcel can break easily.", "The parcel is heavy.", "Open the parcel.", "Throw the parcel."], "Handle with care — хрупкое.", "Handle with care — сынғыш."),
    mc("10", "Read the email: 'Hi Sara, the party starts at 7, not at 6. Bring a game.' What should Sara do?", ["Come at 7 with a game", "Come at 6 with a game", "Stay at home", "Bring food"], "Start at 7; bring a game.", "Басталуы 7-де; ойын алып келу."),
  ],
};

export default topic;
