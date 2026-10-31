import { EngTopic, mc, fill, fills, pick, vocab, joinBi } from "../kit";

const topic: EngTopic = {
  code: "2.8",
  title: { ru: "Словарь НИШ: ключевые слова экзамена", kk: "НЗМ сөздігі: емтиханның негізгі сөздері" },
  explanation: joinBi(
    {
      ru: `В тестах НИШ повторяются одни и те же слова. Выучите их — и вы поймёте большую часть текстов без угадывания. В таблицах слова сгруппированы по темам.

:::steps Как учить 20 слов за день
1. Прочитайте таблицу вслух, закройте колонку с переводом и вспоминайте.
2. Запишите слова, которые не запомнились, на карточки (слово — перевод) и повторите утром и вечером.
3. Придумайте с каждым трудным словом **своё предложение** — так слово запоминается лучше.
4. Повторите через день, через 3 дня и через неделю.
:::`,
      kk: `НЗМ тесттерінде бір сөздер қайталанады. Оларды жаттасаңыз, мәтіндердің көбін болжамай-ақ түсінесіз. Кестелерде сөздер тақырып бойынша топтастырылған.

:::steps Күніне 20 сөзді қалай жаттаймыз
1. Кестені дауыстап оқып, аударма бағанын жауып, есіңізге түсіріңіз.
2. Есте қалмаған сөздерді картаға (сөз — аударма) жазып, таңертең және кешке қайталаңыз.
3. Әр қиын сөзбен **өз сөйлеміңізді** құраңыз — сонда сөз жақсы есте қалады.
4. Бір күннен, 3 күннен және бір аптадан кейін қайталаңыз.
:::`,
    },
    vocab({ ru: "Nature and animals (природа и животные)", kk: "Nature and animals (табиғат және жануарлар)" }, [
      ["predator", "жыртқыш", "хищник"], ["prey", "олжа", "добыча"], ["habitat", "тіршілік ету ортасы, мекен", "среда обитания"], ["wild / domestic", "жабайы / үй жануары", "дикий / домашний"],
      ["pet", "үй жануары", "домашний питомец"], ["rare / extinct", "сирек / жойылып кеткен", "редкий / вымерший"], ["environment", "қоршаған орта", "окружающая среда"], ["pollution", "ластану", "загрязнение"],
      ["planet", "планета", "планета"], ["atmosphere", "атмосфера", "атмосфера"], ["temperature", "температура", "температура"], ["sled", "шана", "сани"],
    ]),
    vocab({ ru: "People and feelings (люди и чувства)", kk: "People and feelings (адамдар және сезімдер)" }, [
      ["frightened / scared", "қорыққан", "испуганный"], ["upset", "ренжіген, қапа болған", "расстроенный"], ["exhausted", "қатты шаршаған", "измотанный"], ["wealthy", "бай", "состоятельный, богатый"],
      ["generous", "жомарт", "щедрый"], ["selfish", "өзімшіл", "эгоистичный"], ["brave", "батыл", "храбрый"], ["polite / rude", "сыпайы / дөрекі", "вежливый / грубый"],
      ["injury", "жарақат", "травма"], ["accident", "оқыс оқиға", "несчастный случай"], ["to agree / to disagree", "келісу / келіспеу", "соглашаться / не соглашаться"], ["to persuade", "иландыру", "убеждать"],
    ]),
    vocab({ ru: "Everyday life (повседневная жизнь)", kk: "Everyday life (күнделікті өмір)" }, [
      ["expensive / cheap", "қымбат / арзан", "дорогой / дешёвый"], ["ring", "жүзік; қоңырау шалу", "кольцо; звонить"], ["fine", "айыппұл", "штраф"], ["ticket", "билет", "билет"],
      ["valid", "жарамды", "действительный"], ["reception", "ресепшн, қабылдау орны", "стойка регистрации"], ["message", "хабарлама", "сообщение"], ["advertisement", "жарнама", "реклама"],
      ["charging interest", "пайыз есептеу", "начисление процентов"], ["basement / attic", "жертөле / шатыр астындағы бөлме", "подвал / чердак"], ["fancy ↔ plain", "әшекейлі ↔ қарапайым", "нарядный ↔ простой"], ["schedule / timetable", "кесте", "расписание"],
    ]),
    vocab({ ru: "Useful verbs and adjectives (полезные глаголы и прилагательные)", kk: "Useful verbs and adjectives (пайдалы етістіктер мен сын есімдер)" }, [
      ["to pull ↔ to push", "тарту ↔ итеру", "тянуть ↔ толкать"], ["to carry", "көтеру, тасымалдау", "нести"], ["to improve", "жақсарту", "улучшать"], ["to prefer", "артық көру", "предпочитать"],
      ["to recommend", "ұсыну", "рекомендовать"], ["to arrive ↔ to leave", "келу ↔ кету", "прибывать ↔ уезжать"], ["to increase ↔ to decrease", "көбею ↔ азаю", "увеличиваться ↔ уменьшаться"], ["huge / tiny", "алып / кішкентай", "огромный / крошечный"],
      ["ancient ↔ modern", "ежелгі ↔ заманауи", "древний ↔ современный"], ["dangerous ↔ safe", "қауіпті ↔ қауіпсіз", "опасный ↔ безопасный"], ["common ↔ rare", "жиі кездесетін ↔ сирек", "обычный ↔ редкий"], ["healthy", "денсаулығы мықты, пайдалы", "здоровый, полезный"],
    ]),
    {
      ru: `:::tip Как проверить себя
Закройте колонку с переводом и скажите значение вслух; затем проверьте. Пройдите задания «Закрепить тему» и тест — они построены на этих словах.
:::`,
      kk: `:::tip Өзіңізді қалай тексересіз
Аударма бағанын жауып, мағынасын дауыстап айтыңыз; содан кейін тексеріңіз. «Тақырыпты бекіту» тапсырмалары мен тест осы сөздер негізінде жасалған.
:::`,
    },
  ),
  practice: [
    fill("1", "A big meat-eating animal that hunts other animals is a ______. (8 letters)", "predator", "Predator — хищник.", "Predator — жыртқыш."),
    fill("2", "The place where an animal lives is its ______. (7 letters)", "habitat", "Habitat — среда обитания.", "Habitat — мекен."),
    fill("3", "Very tired: ex______ (9 letters)", "exhausted", "Exhausted — измотанный.", "Exhausted — қатты шаршаған."),
    fill("4", "A person with a lot of money is w______. (7 letters)", "wealthy", "Wealthy — богатый.", "Wealthy — бай."),
    fill("5", "Money you pay when you break a rule is a ______. (4 letters)", "fine", "Fine — штраф.", "Fine — айыппұл."),
    fill("6", "An animal that is not wild and lives with people is ______. (8 letters, starts with d)", "domestic", "Domestic — домашний.", "Domestic — үй."),
    pick("7", "Which words describe feelings? Write the numbers.\n1. upset  2. attic  3. frightened  4. ticket  5. exhausted", [1, 3, 5], "Upset, frightened, exhausted — чувства/состояния.", "Upset, frightened, exhausted — сезімдер/күйлер."),
    pick("8", "Which pairs are OPPOSITES? Write the numbers.\n1. fancy – plain\n2. wealthy – rich\n3. ancient – modern\n4. huge – tiny", [1, 3, 4], "Wealthy = rich (синонимы).", "Wealthy = rich (синонимдер)."),
  ],
  test: [
    mc("1", "A ___ is an animal that hunts and eats other animals.", ["predator", "pet", "habitat", "injury"], "Predator — хищник.", "Predator — жыртқыш."),
    mc("2", "A ___ is the natural home of an animal or plant.", ["habitat", "ticket", "fine", "attic"], "Habitat — среда обитания.", "Habitat — табиғи мекен."),
    mc("3", "The opposite of 'wild' is ...", ["domestic", "ancient", "rare", "huge"], "Wild ↔ domestic.", "Wild ↔ domestic."),
    mc("4", "A person who is frightened feels ...", ["afraid", "angry", "hungry", "proud"], "Frightened — испуганный.", "Frightened — қорыққан."),
    mc("5", "What is an 'injury'?", ["Harm to someone's body", "A kind of food", "A type of music", "A room in the house"], "Injury — травма.", "Injury — жарақат."),
    mc("6", "'Wealthy' means ...", ["having a lot of money", "very tired", "very small", "very kind"], "Wealthy — богатый.", "Wealthy — бай."),
    mc("7", "A ticket is 'valid' if it ...", ["can be used", "is torn", "is expensive", "is old"], "Valid — действительный.", "Valid — жарамды."),
    mc("8", "The room under the house is the ...", ["basement", "attic", "balcony", "kitchen"], "Basement — подвал.", "Basement — жертөле."),
    mc("9", "Which is the best synonym for 'huge'?", ["very big", "very small", "very old", "very fast"], "Huge = very big.", "Huge = very big."),
    mc("10", "Which word does NOT belong to the group? upset, frightened, exhausted, ticket", ["ticket", "upset", "frightened", "exhausted"], "Ticket — предмет, остальные — состояния.", "Ticket — зат, қалғандары — күйлер."),
  ],
};

export default topic;
