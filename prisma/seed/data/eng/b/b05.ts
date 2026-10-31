import { EngTopic, mc, fill, count, pick, joinBi } from "../kit";

const topic: EngTopic = {
  code: "2.5",
  title: { ru: "Чтение: главная мысль, заголовок, цель автора", kk: "Оқу: негізгі ой, тақырып, автордың мақсаты" },
  explanation: joinBi(
    {
      ru: `Вопросы на **главную мысль** проверяют, поняли ли вы **весь** текст, а не отдельные детали. Они звучат так:
- *What is the text mainly about?*
- *What is the writer's main aim in writing the text?*
- *What would be another good title for the article?*
- *The paragraph discusses… / The article is about…*

:::steps Как найти главную мысль
1. Прочитайте **первое и последнее предложения** абзаца — там обычно главная идея.
2. Спросите себя: **о ком или о чём** почти все предложения?
3. Правильный ответ **охватывает весь текст**, а не одну деталь (слишком узкий вариант — ошибка) и не говорит «обо всём на свете» (слишком широкий — тоже ошибка).
4. Хороший **заголовок** короткий и точно отражает тему.
:::

:::figure {"kind":"table","caption":"Цель автора (writer's aim)","rows":[["Слова в вариантах","Автор хочет…"],["to describe","описать (место, человека, предмет)"],["to explain / to inform","объяснить, сообщить факты"],["to persuade / to encourage","убедить, побудить что-то делать"],["to entertain","развлечь (смешная или интересная история)"],["to warn","предупредить об опасности"],["to advertise","рекламировать"]]}
:::

:::warn Ловушка
Вариант может быть **верным фактом из текста**, но это всего одна деталь, а не главная мысль. Выбирайте тот, что описывает **весь** текст.
:::

:::tip Пример
Текст: *«Exercise is good for you. It makes you feel better and look better. Find an exercise you enjoy.»* Цель автора — **to encourage people to exercise**. Заголовок — *Exercise can be fun!*
:::`,
      kk: `**Негізгі ой** туралы сұрақтар жеке деталь емес, **бүкіл** мәтінді түсінгеніңізді тексереді. Олар былай болады:
- *What is the text mainly about?*
- *What is the writer's main aim in writing the text?*
- *What would be another good title for the article?*
- *The paragraph discusses… / The article is about…*

:::steps Негізгі ойды қалай табамыз
1. Абзацтың **бірінші және соңғы сөйлемін** оқыңыз — негізгі идея әдетте сонда.
2. Өзіңізден сұраңыз: сөйлемдердің көбі **кім немесе не** туралы?
3. Дұрыс жауап **бүкіл мәтінді қамтиды**, тек бір деталь емес (тым тар нұсқа — қате) және «барлық нәрсе туралы» да емес (тым кең нұсқа — қате).
4. Жақсы **тақырып** қысқа және тақырыпты дәл көрсетеді.
:::

:::figure {"kind":"table","caption":"Автордың мақсаты (writer's aim)","rows":[["Нұсқалардағы сөздер","Автор … қалайды"],["to describe","сипаттау (орын, адам, зат)"],["to explain / to inform","түсіндіру, деректер хабарлау"],["to persuade / to encourage","иландыру, бір нәрсе істеуге шақыру"],["to entertain","көңіл көтеру (күлкілі немесе қызықты әңгіме)"],["to warn","қауіп туралы ескерту"],["to advertise","жарнамалау"]]}
:::

:::warn Қателік
Нұсқа мәтіндегі **дұрыс факт** болуы мүмкін, бірақ бұл тек бір деталь, негізгі ой емес. **Бүкіл** мәтінді сипаттайтын нұсқаны таңдаңыз.
:::

:::tip Мысал
Мәтін: *«Exercise is good for you. It makes you feel better and look better. Find an exercise you enjoy.»* Автордың мақсаты — **to encourage people to exercise**. Тақырыбы — *Exercise can be fun!*
:::`,
    },
  ),
  practice: [
    count("1", "Text: \"Cats sleep a lot, hunt mice and love warm places. Cats are good pets.\"\nWhat is the main idea? Choose 1, 2 or 3.\n1. Cats are good pets with typical habits.\n2. Mice are dangerous.\n3. Warm places are expensive.", 1, "Весь текст о кошках как питомцах.", "Бүкіл мәтін мысықтар туралы."),
    count("2", "Choose the best title (write 1, 2 or 3) for a text about recycling paper and plastic to save nature.\n1. Why Recycling Matters\n2. A Day at School\n3. My Favourite Food", 1, "Заголовок должен отражать тему — recycling.", "Тақырып тақырыпты көрсетуі керек — recycling."),
    count("3", "Text: \"Beware of the dog! It bites strangers. Please close the gate.\"\nWhat is the writer's aim? Choose 1 or 2.\n1. to warn people\n2. to entertain people", 1, "Автор предупреждает об опасности.", "Автор қауіп туралы ескертеді."),
    fill("4", "A text talks about sharks: how long they can be, what they eat, where they live. What is the text about? Write one word.", "sharks", "Главная тема — sharks.", "Негізгі тақырып — sharks."),
    count("5", "Text: \"Come to our school fair on Saturday! There will be games, music and cakes. Everyone is welcome!\"\nThe writer wants to ... Choose 1 or 2.\n1. invite people to an event\n2. complain about a problem", 1, "Приглашение на событие.", "Іс-шараға шақыру."),
    pick("6", "Which words can introduce the writer's AIM? Write the numbers.\n1. to persuade\n2. to describe\n3. yesterday\n4. to warn", [1, 2, 4], "Aim выражают to + глагол: to persuade, to describe, to warn.", "Мақсатты to + етістік білдіреді: to persuade, to describe, to warn."),
    count("7", "Text: \"Exercise is good for you. It makes you feel better and look better. Find an exercise you enjoy.\"\nWhat is the writer's main aim? Choose 1 or 2.\n1. to encourage people to exercise\n2. to describe a gym", 1, "Автор призывает заниматься спортом.", "Автор жаттығуға шақырады."),
    pick("8", "Which sentences are the MAIN IDEA of a text about the Moon? Write the numbers.\n1. The Moon moves round the Earth and changes shape in the sky.\n2. The Moon is white.\n3. Astronauts first landed there in 1969.", [1], "Только 1 охватывает общую тему Луны; остальные — отдельные детали.", "Тек 1-ші ғана Ай туралы жалпы тақырыпты қамтиды; қалғандары — жеке деталь."),
  ],
  test: [
    mc("1", "Text: 'Exercise has become a huge part of our world. There are gyms everywhere. Exercise is good for you. It makes you feel better and look better.' What is the writer's main aim?", ["To persuade people to exercise", "To describe different gyms", "To talk about a dance class", "To criticise people who don't exercise"], "Цель — убедить заниматься спортом.", "Мақсаты — жаттығуға иландыру."),
    mc("2", "Text: 'Dogs are helpers and friends to people. Dogs helped humans travel from Asia to North America by pulling sleds in the snow.' What would be a good title?", ["How Dogs Help People", "Wild Animals of Asia", "Winter Holidays", "My Pet Cat"], "Текст о том, как собаки помогают людям.", "Мәтін иттердің адамдарға қалай көмектесетіні туралы."),
    mc("3", "Text: 'Many people are building green houses. They use solar panels, collect rain water and grow plants on the roof.' The text is mainly about ...", ["houses that help the environment", "houses made of ice", "very old buildings", "how to paint a house"], "Green houses — экологичные дома.", "Green houses — экологиялық үйлер."),
    mc("4", "Text: 'Summer is hot and sunny. Children swim and play outside. Many families go on holiday.' What is the paragraph about?", ["Summer", "Winter", "School", "Cooking"], "Summer — главная тема.", "Summer — негізгі тақырып."),
    mc("5", "What is the main aim of an advertisement for a new phone?", ["To make people buy it", "To teach people to cook", "To tell a funny story", "To warn about weather"], "Реклама — to advertise / to persuade.", "Жарнама — to advertise / to persuade."),
    mc("6", "Text: 'Sharks are big fish. They can be up to 50 feet long. They eat other fish. Most sharks live in warm seas.' The best title is ...", ["Sharks: Facts", "Swimming Lessons", "My Holiday", "Colourful Birds"], "Текст о sharks.", "Мәтін sharks туралы."),
    mc("7", "Text: 'Buckingham Palace is the home of the British monarch. It has 775 rooms. Visitors can see some of them in summer.' The article is about ...", ["a famous palace", "a family dinner", "a school lesson", "a football match"], "Главная тема — дворец.", "Негізгі тақырып — сарай."),
    mc("8", "'Please, don't drop litter. Keep our park clean.' The writer wants to ...", ["ask people to keep the park clean", "describe the park", "sell something", "tell a joke"], "Просьба не мусорить.", "Қоқыс тастамауға өтініш."),
    mc("9", "Which is the BEST main idea for a paragraph with 6 sentences about the heart: where it is, what it does and how to keep it healthy?", ["The heart and how to keep it healthy", "Why people like red", "How to cook rice", "The history of football"], "Охватывает всё содержание.", "Бүкіл мазмұнды қамтиды."),
    mc("10", "Text: 'Last night I read a funny story about a clumsy robot. I laughed all the time!' The writer wants to ...", ["tell about something funny", "warn people", "advertise a book", "explain science"], "Рассказ о смешном — entertain.", "Күлкілі туралы әңгіме — entertain."),
  ],
};

export default topic;
