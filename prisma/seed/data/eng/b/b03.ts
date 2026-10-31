import { EngTopic, mc, fill, fills, pick, joinBi } from "../kit";

const topic: EngTopic = {
  code: "2.3",
  title: { ru: "Слова по значению: синонимы, антонимы, смысл слова в контексте", kk: "Сөздің мағынасы: синонимдер, антонимдер, контекстегі мағына" },
  explanation: joinBi(
    {
      ru: `На экзамене часто спрашивают: *«The best antonym for … is…»*, *«A word that means the same as … is…»*, *«If something is fancy, it is…»*. Для ответа нужно знать **слова парами**.

### Синонимы и антонимы
- **Синоним** — слово с близким значением: big = large, begin = start.
- **Антоним** — слово с противоположным значением: hot ≠ cold, push ≠ pull.

:::figure {"kind":"table","caption":"Synonyms (близкие по смыслу)","rows":[["big","large, huge"],["small","little, tiny"],["begin","start"],["end","finish"],["happy","glad, cheerful"],["sad","unhappy"],["quick","fast"],["difficult","hard"],["beautiful","pretty, lovely"],["buy","purchase"],["tired","exhausted"],["clever","smart, intelligent"]]}
:::

:::figure {"kind":"table","caption":"Antonyms (противоположные)","rows":[["hot","cold"],["push","pull"],["wild","tame, domestic"],["ancient","modern"],["strong","weak"],["clean","dirty"],["generous","selfish"],["increase","decrease"],["arrive","leave"],["expensive","cheap"],["safe","dangerous"],["full","empty"]]}
:::

### Значение слова из текста
:::steps Как угадать незнакомое слово
1. Прочтите **предложение целиком** — часто рядом есть пояснение (*"…the attic, the room above the main part of the house"*).
2. Ищите знаки: **or**, **that is**, **like**, **means**, запятые и тире.
3. Определите, **какая это часть речи** (существительное, глагол, прилагательное).
4. Подставьте свой вариант в предложение — подходит ли по смыслу?
:::

:::warn Ловушка
У слова бывает **несколько значений**: *kind* — «добрый» (прилагательное) и «вид, тип» (существительное): *What kind of music?* — «какой вид музыки?». Выбирайте значение по предложению.
:::

:::tip Приставки-антонимы
**un-** (happy → unhappy), **dis-** (agree → disagree), **in-/im-** (possible → impossible), **-less** (careful → careless). Они помогают быстро найти противоположное слово.
:::`,
      kk: `Емтиханда жиі мынадай сұрақ қойылады: *«The best antonym for … is…»*, *«A word that means the same as … is…»*, *«If something is fancy, it is…»*. Жауап беру үшін сөздерді **жұптап** білу керек.

### Синонимдер мен антонимдер
- **Синоним** — мағынасы жақын сөз: big = large, begin = start.
- **Антоним** — мағынасы қарама-қарсы сөз: hot ≠ cold, push ≠ pull.

:::figure {"kind":"table","caption":"Synonyms (мағынасы жақын)","rows":[["big","large, huge"],["small","little, tiny"],["begin","start"],["end","finish"],["happy","glad, cheerful"],["sad","unhappy"],["quick","fast"],["difficult","hard"],["beautiful","pretty, lovely"],["buy","purchase"],["tired","exhausted"],["clever","smart, intelligent"]]}
:::

:::figure {"kind":"table","caption":"Antonyms (қарама-қарсы)","rows":[["hot","cold"],["push","pull"],["wild","tame, domestic"],["ancient","modern"],["strong","weak"],["clean","dirty"],["generous","selfish"],["increase","decrease"],["arrive","leave"],["expensive","cheap"],["safe","dangerous"],["full","empty"]]}
:::

### Мәтіндегі сөздің мағынасы
:::steps Бейтаныс сөзді қалай болжаймыз
1. **Бүкіл сөйлемді** оқыңыз — жанында түсініктеме болуы мүмкін (*"…the attic, the room above the main part of the house"*).
2. Белгілерді іздеңіз: **or**, **that is**, **like**, **means**, үтір мен сызықша.
3. **Сөз табын** анықтаңыз (зат есім, етістік, сын есім).
4. Өз нұсқаңызды сөйлемге қойып көріңіз — мағынасына сай келе ме?
:::

:::warn Қателік
Сөздің **бірнеше мағынасы** болады: *kind* — «мейірімді» (сын есім) және «түр, сорт» (зат есім): *What kind of music?* — «қандай музыка түрі?». Мағынаны сөйлемге қарап таңдаңыз.
:::

:::tip Антоним жұрнақтары
**un-** (happy → unhappy), **dis-** (agree → disagree), **in-/im-** (possible → impossible), **-less** (careful → careless). Олар қарама-қарсы сөзді тез табуға көмектеседі.
:::`,
    },
  ),
  practice: [
    fill("1", "Write the antonym of 'push'.", "pull", "Push ≠ pull.", "Push ≠ pull."),
    fill("2", "Write the antonym of 'ancient'.", "modern", "Ancient ≠ modern.", "Ancient ≠ modern."),
    fill("3", "Write a synonym of 'begin' (5 letters).", "start", "Begin = start.", "Begin = start."),
    fill("4", "Write a synonym of 'difficult' (4 letters).", "hard", "Difficult = hard.", "Difficult = hard."),
    fill("5", "Write the antonym of 'expensive' (5 letters).", "cheap", "Expensive ≠ cheap.", "Expensive ≠ cheap."),
    fills("6", "Write the antonym with un- or dis-.\nhappy → ___   agree → ___", ["unhappy", "disagree"], "Приставки un- и dis- дают противоположное значение.", "un- және dis- қарама-қарсы мағына береді."),
    pick("7", "Which pairs are SYNONYMS? Write the numbers.\n1. big – large\n2. hot – cold\n3. quick – fast\n4. clean – dirty", [1, 3], "Big = large, quick = fast.", "Big = large, quick = fast."),
    fill("8", "The Cheetah is a very quick animal. A word that means the same as 'quick' is ______. (4 letters)", "fast", "Quick = fast.", "Quick = fast."),
  ],
  test: [
    mc("1", "The best antonym for 'pet' is ...", ["wild animal", "friendly animal", "large animal", "small animal"], "Pet — домашнее животное; антоним — wild animal (дикое).", "Pet — үй жануары; антоним — wild animal (жабайы)."),
    mc("2", "The opposite of 'pull' is ...", ["push", "carry", "receive", "help"], "Pull ↔ push.", "Pull ↔ push."),
    mc("3", "If something is 'fancy', it is ...", ["bright and decorative", "plain and simple", "old and tarnished", "ugly"], "Fancy — нарядный, декоративный.", "Fancy — әшекейлі, сәнді."),
    mc("4", "A word that means the same as 'kind' (nice, friendly) is ...", ["gentle", "angry", "tall", "heavy"], "Kind = gentle, nice.", "Kind = gentle, nice."),
    mc("5", "The antonym of 'generous' is ...", ["selfish", "kind", "brave", "clever"], "Generous ↔ selfish.", "Generous ↔ selfish."),
    mc("6", "The houses in this village are plain and simple. 'Plain' means ...", ["not decorated", "very big", "dangerous", "very old"], "Plain — простой, без украшений.", "Plain — қарапайым, әшекейсіз."),
    mc("7", "She is exhausted after the long walk. 'Exhausted' means ...", ["very tired", "very happy", "very hungry", "very angry"], "Exhausted — измотанный, очень уставший.", "Exhausted — қатты шаршаған."),
    mc("8", "The opposite of 'increase' is ...", ["decrease", "rise", "grow", "add"], "Increase ↔ decrease.", "Increase ↔ decrease."),
    mc("9", "What kind of music do you like? In this sentence 'kind' means ...", ["type", "friendly", "gentle", "generous"], "What kind of … — какой вид, тип.", "What kind of … — қандай түрі."),
    mc("10", "Which word is a synonym of 'tiny'?", ["very small", "very tall", "very old", "very fast"], "Tiny — крошечный: very small.", "Tiny — өте кішкентай: very small."),
  ],
};

export default topic;
