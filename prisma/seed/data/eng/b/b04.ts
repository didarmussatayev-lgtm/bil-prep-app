import { EngTopic, mc, fill, count, decnum, pick, joinBi } from "../kit";

const topic: EngTopic = {
  code: "2.4",
  title: { ru: "Чтение: найти факт в тексте", kk: "Оқу: мәтіннен факті табу" },
  explanation: joinBi(
    {
      ru: `Самый частый тип вопроса: **«Какой … ? Сколько …? Где …? Когда …?»**. Ответ есть в тексте **прямо**, нужно его найти — это называется **scanning** (быстрый поиск).

:::steps Как искать факт
1. Прочитайте вопрос и выделите **ключевое слово** (имя, число, место, существительное).
2. Быстро просмотрите текст глазами и **найдите это слово** (или его синоним).
3. Прочитайте **предложение до и после** найденного места.
4. Сравните с вариантами: подходит только тот, что совпадает по **смыслу**.
:::

:::figure {"kind":"table","caption":"Вопросительные слова и что искать","rows":[["How many / How much / How long / How old","число, количество, длительность, возраст"],["When / What time","дата, время, период"],["Where","место"],["Who","имя или должность"],["Why","причина — слова because, so, to…"],["What … do/does?","действие, глагол"]]}
:::

:::warn Ловушка
- В тексте может быть **несколько чисел**; берите то, которое относится **к вопросу**.
- Вариант может содержать **те же слова**, что и текст, но говорить о другом.
- Сравнения (*taller, the biggest*) и слова **only, all, never** меняют смысл.
:::

:::tip Лайфхак
Если в вопросе слово **mostly / usually / often**, ищите в тексте слово из той же «категории частоты».
:::`,
      kk: `Ең жиі сұрақ түрі: **«Қандай …? Қанша …? Қайда …? Қашан …?»**. Жауап мәтінде **тікелей** бар, оны табу керек — бұл **scanning** (жылдам іздеу) деп аталады.

:::steps Фактіні қалай іздейміз
1. Сұрақты оқып, **негізгі сөзді** (есім, сан, орын, зат есім) белгілеңіз.
2. Мәтінді көзбен тез шолып, **сол сөзді** (немесе синонимін) **табыңыз**.
3. Табылған жердің **алдындағы және кейінгі сөйлемді** оқыңыз.
4. Нұсқалармен салыстырыңыз: тек **мағынасы** сәйкес келетіні жарайды.
:::

:::figure {"kind":"table","caption":"Сұрау сөздері және нені іздейміз","rows":[["How many / How much / How long / How old","сан, мөлшер, ұзақтық, жас"],["When / What time","күн, уақыт, кезең"],["Where","орын"],["Who","есім немесе лауазым"],["Why","себеп — because, so, to… сөздері"],["What … do/does?","әрекет, етістік"]]}
:::

:::warn Қателік
- Мәтінде **бірнеше сан** болуы мүмкін; **сұраққа** қатысты санды алыңыз.
- Нұсқада мәтіндегі **сол сөздер** болуы мүмкін, бірақ басқа туралы айтылады.
- Салыстыру (*taller, the biggest*) және **only, all, never** сөздері мағынаны өзгертеді.
:::

:::tip Кеңес
Сұрақта **mostly / usually / often** сөзі болса, мәтіннен сол «жиілік» тобындағы сөзді іздеңіз.
:::`,
    },
  ),
  practice: [
    count("1", "Text: \"Dogs live 5 to 13 years, but some live much longer. One dog lived to be 24 years old.\"\nHow old was the oldest dog? Write the number.", 24, "Самая старая собака — 24 года.", "Ең ескі ит — 24 жас."),
    count("2", "Text: \"The planetarium is on the fourth floor of the museum.\"\nOn which floor is the planetarium? Write the number.", 4, "Fourth floor — 4-й этаж.", "Fourth floor — 4-қабат."),
    decnum("3", "Text: \"Tickets are $2.50 per person. Planetarium shows are free for members.\"\nHow much is a ticket for one person? Write the number (dollars) like 2.5.", 2.5, "2,50 доллара за человека.", "Адамға 2,50 доллар."),
    fill("4", "Text: \"Marat lives in Astana. His grandmother lives in a village near Shymkent.\"\nWhere does Marat's grandmother live? Write one word (a city).", "shymkent", "Near Shymkent — около Шымкента.", "Near Shymkent — Шымкент маңында."),
    count("5", "Text: \"A plane leaves at 9:30. It takes two hours to fly to Almaty.\"\nWhat time does it arrive? Write the hour only (for example 11).", 11, "9:30 + 2 часа = 11:30.", "9:30 + 2 сағат = 11:30."),
    fill("6", "Text: \"Aida was late for school because the bus was stuck in traffic.\"\nWhy was Aida late? Write one word from the text that gives the reason (traffic or bus).", "traffic", "Причина — пробка (traffic).", "Себебі — кептеліс (traffic)."),
    count("7", "Text: \"The library has 5,000 books. 2,000 are in English and the rest are in Kazakh.\"\nHow many books are in Kazakh? Write the number.", 3000, "5000 − 2000 = 3000.", "5000 − 2000 = 3000."),
    pick("8", "Text: \"The Cycling Club has over 15,000 members. It wants safer roads, more bike lanes and bike safety lessons for school children.\"\nWhich things does the club want? Write the numbers.\n1. safer roads  2. more car parks  3. more bike lanes  4. bike safety lessons", [1, 3, 4], "В тексте: safer roads, bike lanes, safety lessons; car parks не упоминаются.", "Мәтінде: safer roads, bike lanes, safety lessons; car parks жоқ."),
  ],
  test: [
    mc("1", "Text: 'Dogs have curly or straight fur. The smallest dogs are only 6–8 inches tall. Very big dogs are about 3 feet.' How tall are the smallest dogs?", ["6–8 inches", "3 feet", "3 inches", "13 inches"], "Smallest dogs — 6–8 inches.", "Smallest dogs — 6–8 inches."),
    mc("2", "Text: 'Some houses are made of rock. Others are made of wood or mud. In cold places, some houses are made of ice.' Why are houses in a forest often made of wood?", ["There are many trees.", "Wood is cold.", "Wood is bright.", "People don't like rock."], "In forests there are many trees, so people use wood.", "Орманда ағаш көп, сондықтан ағаштан салады."),
    mc("3", "Text: 'The museum is open from 10 a.m. to 6 p.m. Tickets for children cost $3. Adults pay $8.' How much do two adults pay?", ["$16", "$8", "$11", "$6"], "2 × 8 = 16.", "2 × 8 = 16."),
    mc("4", "Text: 'Our school trip is on Friday. We leave at 8:00 and come back at 4:00.' When do the students come back?", ["At 4:00", "At 8:00", "On Saturday", "At 6:00"], "Come back at 4:00.", "Come back at 4:00."),
    mc("5", "Text: 'Nurlan has a dog, two cats and four fish.' How many pets does he have?", ["Seven", "Six", "Four", "Three"], "1 + 2 + 4 = 7.", "1 + 2 + 4 = 7."),
    mc("6", "Text: 'It rains a lot in spring. Summer is hot and dry. In autumn it is windy.' Which season is hot and dry?", ["Summer", "Spring", "Autumn", "Winter"], "Summer is hot and dry.", "Summer is hot and dry."),
    mc("7", "Text: 'Aidar plays chess on Mondays and Wednesdays and football on Saturdays.' How often does he play chess?", ["Twice a week", "Once a week", "Every day", "Three times a week"], "Monday and Wednesday — two days a week.", "Дүйсенбі және сәрсенбі — аптасына екі рет."),
    mc("8", "Text: 'The bus to the zoo leaves every 20 minutes. The last bus is at 6 p.m.' Which statement is true?", ["Buses go to the zoo often.", "The first bus is at 6 p.m.", "Buses leave every hour.", "There are no buses."], "Every 20 minutes — часто.", "Every 20 minutes — жиі."),
    mc("9", "Text: 'Mount Everest is the highest mountain in the world. It is 8,849 m high.' How high is Everest?", ["8,849 m", "8,000 m", "9,000 m", "4,849 m"], "Everest — 8 849 м.", "Everest — 8 849 м."),
    mc("10", "Text: 'The Cycling Club wants more people on bikes because it is good for health and for the environment.' Why does the club want more cyclists?", ["Cycling is good for health and the environment.", "Bikes are cheap.", "People don't like cars.", "Roads are empty."], "Reason — health and environment.", "Себебі — денсаулық пен қоршаған орта."),
  ],
};

export default topic;
