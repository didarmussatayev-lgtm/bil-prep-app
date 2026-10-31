import { EngTopic, mc, fill, count, pick, order, joinBi } from "../kit";

const topic: EngTopic = {
  code: "2.1",
  title: { ru: "Формат экзамена НИШ и стратегия решения", kk: "НЗМ емтиханының форматы және шешу стратегиясы" },
  explanation: joinBi(
    {
      ru: `### Что проверяет экзамен по английскому
В тесте для поступления в 7 класс НИШ около **20 вопросов** с выбором ответа (A–D), на тест отводят примерно **40 минут**. Обычно встречаются такие задания:

:::figure {"kind":"table","caption":"Типы заданий","rows":[["Тип","Что нужно сделать","Раздел курса"],["What does it say?","Понять короткое объявление, знак, сообщение","2.2"],["Synonym / antonym / meaning","Выбрать слово по значению","2.3, 2.8"],["Reading: details","Найти факт в тексте (число, место, имя)","2.4"],["Reading: main idea / title","Понять, о чём весь текст","2.5"],["True / False / inference","Проверить утверждение, сделать вывод","2.6"],["Grammar in context","Выбрать верную форму в предложении","2.7"]]}
:::

:::steps Порядок работы с текстом
1. **Сначала прочитайте вопросы** (на 20–30 секунд): вы будете знать, что искать.
2. Прочитайте текст целиком, отмечая ключевые слова (числа, имена, даты, слова *but, however, because*).
3. Для каждого вопроса найдите в тексте **то же место** (иногда другими словами) и сравните с вариантами.
4. **Исключите** варианты, которые противоречат тексту или не упоминаются.
5. Не знаете слова — догадайтесь по контексту, а не пропускайте.
6. Оставьте 3–4 минуты на проверку; не оставляйте пустых ответов — штрафа за ошибку нет.
:::

:::warn Типичные ловушки
- Вариант **верен в жизни, но в тексте этого нет** — он неправильный. Отвечаем только по тексту!
- В варианте то же слово, что и в тексте, но смысл другой.
- Слова **not, never, only, all, always** меняют смысл утверждения.
:::

:::tip Лайфхак на время
Один вопрос — не более **2 минут**. Если застряли, поставьте «?» и вернитесь позже.
:::

:::remember Как учить слова
Перед каждым тестом выучите таблицу слов (в разделе 2.8 — ключевые слова экзамена). Повторяйте через день, потом через неделю.
:::`,
      kk: `### Емтихан ағылшын тілінен нені тексереді
НЗМ-ның 7-сыныбына түсу тестінде жауабын таңдайтын (A–D) шамамен **20 сұрақ** болады, тестке шамамен **40 минут** беріледі. Әдетте мынадай тапсырмалар кездеседі:

:::figure {"kind":"table","caption":"Тапсырма түрлері","rows":[["Түрі","Не істеу керек","Курс бөлімі"],["What does it say?","Қысқа хабарландыруды, белгіні, хабарламаны түсіну","2.2"],["Synonym / antonym / meaning","Мағынасына қарай сөз таңдау","2.3, 2.8"],["Reading: details","Мәтіннен факт табу (сан, орын, есім)","2.4"],["Reading: main idea / title","Мәтіннің неге арналғанын түсіну","2.5"],["True / False / inference","Тұжырымды тексеру, қорытынды жасау","2.6"],["Grammar in context","Сөйлемде дұрыс форманы таңдау","2.7"]]}
:::

:::steps Мәтінмен жұмыс реті
1. **Алдымен сұрақтарды оқыңыз** (20–30 секунд): нені іздеу керегін білесіз.
2. Мәтінді толық оқыңыз, негізгі сөздерді (сандар, есімдер, күндер, *but, however, because* сөздері) белгілеңіз.
3. Әр сұрақ үшін мәтіннен **сол жерді** (кейде басқа сөздермен) тауып, нұсқалармен салыстырыңыз.
4. Мәтінге қайшы немесе мәтінде жоқ нұсқаларды **сызып тастаңыз**.
5. Сөзді білмесеңіз, өткізіп жібермей, контекстен болжаңыз.
6. Тексеруге 3–4 минут қалдырыңыз; бос жауап қалдырмаңыз — қателік үшін айып жоқ.
:::

:::warn Жиі кездесетін тұзақтар
- Нұсқа **өмірде дұрыс, бірақ мәтінде жоқ** — ол қате. Тек мәтін бойынша жауап береміз!
- Нұсқада мәтіндегі сөз бар, бірақ мағынасы басқа.
- **not, never, only, all, always** сөздері тұжырымның мағынасын өзгертеді.
:::

:::tip Уақыт бойынша кеңес
Бір сұраққа **2 минуттан** артық жұмсамаңыз. Тұрып қалсаңыз, «?» қойып, кейін қайтыңыз.
:::

:::remember Сөздерді қалай жаттау керек
Әр тесттің алдында сөздер кестесін жаттаңыз (2.8 бөлімінде — емтиханның негізгі сөздері). Бір күннен кейін, содан соң бір аптадан кейін қайталаңыз.
:::`,
    },
  ),
  practice: [
    count("1", "Read and answer.\n\"The library is open from 9 a.m. to 5 p.m. on weekdays and from 10 a.m. to 2 p.m. on Saturday. It is closed on Sunday.\"\nHow many days a week is the library open? Write a number.", 6, "Пн–Пт (5 дней) + суббота = 6 дней; в воскресенье закрыта.", "Дс–Жм (5 күн) + сенбі = 6 күн; жексенбіде жабық."),
    fill("2", "\"Tom is taller than Kate, but Kate is taller than Sam.\"\nWho is the shortest? Write the name.", "sam", "Tom > Kate > Sam, самый низкий — Sam.", "Tom > Kate > Sam, ең аласасы — Sam."),
    pick("3", "Which words in a question help you find the answer in the text? Write the numbers.\n1. numbers and dates\n2. names of people and places\n3. the word 'the'\n4. the word 'and'", [1, 2], "Ключевые слова — числа, имена, даты, места; артикли и союзы почти ничего не дают.", "Негізгі сөздер — сандар, есімдер, күндер, орындар; артикль мен жалғаулықтар көмектеспейді."),
    fill("4", "\"Aigul didn't go to the park because it was raining.\"\nWhy didn't she go? Write one word from the text.", "raining", "Причина указана после because: it was raining.", "Себеп because-тен кейін: it was raining."),
    order("5", "Put the steps in the right order. Write the numbers.\n1. Look for the same information in the text.\n2. Read the questions first.\n3. Cross out wrong answers.\n4. Read the text.", [2, 4, 1, 3], "Вопросы → текст → поиск информации → исключение.", "Сұрақтар → мәтін → ақпаратты іздеу → артығын сызып тастау."),
    fill("6", "\"The test lasts 40 minutes and has 20 questions.\"\nHow many minutes can you spend on one question on average? Write a number.", "2", "40 : 20 = 2 минуты.", "40 : 20 = 2 минут."),
    pick("7", "Choose the CORRECT strategies. Write the numbers.\n1. Answer only with information from the text.\n2. Leave a hard question empty and never come back.\n3. Guess a new word from the context.\n4. Always choose the longest answer.", [1, 3], "Правильно: отвечать по тексту и угадывать слова по контексту.", "Дұрысы: мәтін бойынша жауап беру және сөзді контекстен болжау."),
    fill("8", "\"He always walks to work, but today he took a taxi.\"\nHow does he usually go to work? Write one word.", "walks", "Usually = always: he walks.", "Usually = always: he walks."),
  ],
  test: [
    mc("1", "A text says: 'The museum is closed on Mondays.' Which statement is true?", ["You can't visit it on Monday.", "It is open every day.", "It is closed on Tuesdays.", "It opens only on Mondays."], "По тексту в понедельник музей закрыт.", "Мәтін бойынша дүйсенбіде мұражай жабық."),
    mc("2", "Why should you read the questions BEFORE you read the text?", ["To know what information to look for", "To find the answers without reading", "To spend more time", "To choose answer A for every question"], "Так вы знаете, что искать в тексте.", "Сонда мәтіннен нені іздеу керегін білесіз."),
    mc("3", "\"Dana has two brothers and one sister.\" How many children are there in Dana's family?", ["Four", "Three", "Two", "Five"], "Dana + 2 брата + 1 сестра = 4 ребёнка.", "Dana + 2 аға-іні + 1 қарындас = 4 бала."),
    mc("4", "A sentence says: 'The shop opens at nine and closes at six.' When does the shop close?", ["At six", "At nine", "At three", "At noon"], "Closes at six.", "Closes at six."),
    mc("5", "In the exam you meet a word you don't know. What is the best thing to do?", ["Guess its meaning from the sentence", "Skip the whole text", "Choose any answer", "Stop the test"], "Контекст помогает понять значение.", "Контекст мағынасын түсінуге көмектеседі."),
    mc("6", "\"Only students can use this room.\" Who can use it?", ["Students", "Teachers", "Everybody", "Visitors"], "Only students — только ученики.", "Only students — тек оқушылар."),
    mc("7", "\"Almas never eats fish.\" Which sentence agrees with the text?", ["Almas doesn't eat fish.", "Almas often eats fish.", "Almas sometimes eats fish.", "Almas always eats fish."], "Never — никогда.", "Never — ешқашан."),
    mc("8", "How much time can you spend on one question if you have 40 minutes for 20 questions?", ["About 2 minutes", "About 10 minutes", "About 20 minutes", "About 30 seconds"], "40 : 20 = 2.", "40 : 20 = 2."),
    mc("9", "\"The train leaves at 7:15, but today it will be 10 minutes late.\" When will it leave today?", ["At 7:25", "At 7:05", "At 7:15", "At 7:10"], "7:15 + 10 минут = 7:25.", "7:15 + 10 минут = 7:25."),
    mc("10", "Which answer should you choose if it is true in real life but NOT in the text?", ["None of these — answer only by the text", "That one, because it is true", "The longest answer", "Any answer"], "Отвечаем только по тексту.", "Тек мәтін бойынша жауап береміз."),
  ],
};

export default topic;
