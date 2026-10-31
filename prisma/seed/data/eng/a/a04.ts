import { EngTopic, mc, fill, fills, pick, count, vocab, joinBi } from "../kit";

const topic: EngTopic = {
  code: "1.4",
  title: { ru: "Части тела. Внешность. Have got / has got", kk: "Дене мүшелері. Келбет. Have got / has got" },
  explanation: joinBi(
    {
      ru: `Unit 2 «Parts of the body». Здесь учим слова о теле и внешности и конструкцию **have got / has got** («у меня есть…»), с помощью которой описывают внешность и вещи.`,
      kk: `Unit 2 «Parts of the body». Мұнда дене мүшелері мен келбетке қатысты сөздерді және **have got / has got** («менде … бар») құрылымын үйренеміз. Ол келбетті және заттарды сипаттауға керек.`,
    },
    vocab({ ru: "Части тела", kk: "Дене мүшелері" }, [
      ["head", "бас", "голова"], ["hair", "шаш", "волосы"], ["face", "бет", "лицо"], ["forehead", "маңдай", "лоб"], ["eyebrow", "қас", "бровь"],
      ["eye", "көз", "глаз"], ["nose", "мұрын", "нос"], ["ear", "құлақ", "ухо"], ["mouth", "ауыз", "рот"], ["tooth (teeth)", "тіс (тістер)", "зуб (зубы)"],
      ["chin", "иек", "подбородок"], ["neck", "мойын", "шея"], ["shoulder", "иық", "плечо"], ["arm", "қол (білекпен)", "рука (от плеча)"], ["elbow", "шынтақ", "локоть"],
      ["wrist", "білезік тұсы", "запястье"], ["hand", "алақан, қол", "кисть руки"], ["finger", "саусақ", "палец руки"], ["chest", "кеуде", "грудь"], ["stomach", "асқазан, іш", "живот"],
      ["leg", "аяқ", "нога"], ["knee", "тізе", "колено"], ["ankle", "тобық", "лодыжка"], ["foot (feet)", "табан (табандар)", "ступня"], ["toe", "аяқ саусағы", "палец ноги"],
    ]),
    vocab({ ru: "Внешность", kk: "Келбет" }, [
      ["tall / short", "ұзын бойлы / аласа бойлы", "высокий / низкий"], ["slim / fat", "арық, ұзын-ұзын / толық", "стройный / полный"], ["young / old", "жас / қарт", "молодой / старый"],
      ["long / short hair", "ұзын / қысқа шаш", "длинные / короткие волосы"], ["straight / curly hair", "тік / бұйра шаш", "прямые / кудрявые волосы"], ["fair / dark hair", "ашық / қара шаш", "светлые / тёмные волосы"],
      ["blue / brown eyes", "көк / қоңыр көз", "голубые / карие глаза"], ["beard / moustache", "сақал / мұрт", "борода / усы"], ["freckles", "секпіл", "веснушки"],
    ]),
    {
      ru: `### Have got / has got
Мы говорим **I / you / we / they have got** и **he / she / it has got**.

:::figure {"kind":"table","caption":"Have got","rows":[["","Утверждение","Отрицание","Вопрос"],["I / you / we / they","I have got (I've got) a dog.","I have not got (haven't got) a dog.","Have you got a dog?"],["he / she / it","She has got (She's got) blue eyes.","She has not got (hasn't got) blue eyes.","Has she got blue eyes?"]]}
:::

Краткие ответы: **Yes, I have. / No, I haven't.** **Yes, she has. / No, she hasn't.**

:::warn Ловушка
После he / she / it — **has**, а не have: She **has** got long hair. В вопросах и отрицании не добавляют do/does: «Has she got…?», а не «Does she have got…?».
:::

:::tip Как описать человека
Порядок такой: рост и телосложение → возраст → лицо → волосы → глаза. Например: *He is tall and slim. He has got short dark hair and brown eyes.*
:::`,
      kk: `### Have got / has got
**I / you / we / they have got** және **he / she / it has got** деп айтамыз.

:::figure {"kind":"table","caption":"Have got","rows":[["","Болымды","Болымсыз","Сұраулы"],["I / you / we / they","I have got (I've got) a dog.","I have not got (haven't got) a dog.","Have you got a dog?"],["he / she / it","She has got (She's got) blue eyes.","She has not got (hasn't got) blue eyes.","Has she got blue eyes?"]]}
:::

Қысқа жауаптар: **Yes, I have. / No, I haven't.** **Yes, she has. / No, she hasn't.**

:::warn Қателік
he / she / it-тен кейін — **has**, have емес: She **has** got long hair. Сұрақ пен болымсыз сөйлемде do/does қоспайды: «Has she got…?», «Does she have got…?» емес.
:::

:::tip Адамды қалай сипаттау керек
Реті: бой және дене бітімі → жасы → бет → шаш → көз. Мысалы: *He is tall and slim. He has got short dark hair and brown eyes.*
:::`,
    },
  ),
  practice: [
    fill("1", "You see with your ______. (3 letters)", "eye", "Видят глазами: eye.", "Көзбен көреді: eye."),
    fill("2", "You wear a ring on your ______. (6 letters)", "finger", "Кольцо надевают на палец: finger.", "Жүзікті саусаққа тағады: finger."),
    fill("3", "The plural of foot is ______.", "feet", "Foot → feet (неправильное множественное число).", "Foot → feet (ерекше көпше түр)."),
    fills("4", "Write have or has.\nI ___ got a brother. My sister ___ got long hair.", ["have", "has"], "I → have; she → has.", "I → have; she → has."),
    fills("5", "Write has or have.\nThe boy ___ got blue eyes. My parents ___ got a big car.", ["has", "have"], "The boy = he → has; parents = they → have.", "The boy = he → has; parents = they → have."),
    fill("6", "Write the negative form (two words).\nShe has got a beard. → She ______ got a beard.", "hasn't", "Отрицание: has not = hasn't.", "Болымсыз: has not = hasn't."),
    count("7", "Count the parts of the body in this list.\nnose, table, elbow, window, chin, curtain, knee", 4, "Части тела: nose, elbow, chin, knee — всего 4.", "Дене мүшелері: nose, elbow, chin, knee — барлығы 4."),
    pick("8", "Which sentences are CORRECT? Write the numbers.\n1. He has got a bike.\n2. She have got a cat.\n3. They have got a house.\n4. Has he got a dog? Yes, he has.", [1, 3, 4], "В предложении 2 нужно has: She has got a cat.", "2-сөйлемде has болуы керек: She has got a cat."),
  ],
  test: [
    mc("1", "Choose the correct word.\nHe has got long, curly ___ and a moustache.", ["hair", "hand", "head", "heart"], "Hair — волосы; curly hair — кудрявые волосы.", "Hair — шаш; curly hair — бұйра шаш."),
    mc("2", "Odd one out.", ["table", "elbow", "ankle", "wrist"], "Elbow, ankle, wrist — части тела; table — мебель.", "Elbow, ankle, wrist — дене мүшелері; table — жиһаз."),
    mc("3", "Maria ___ got blue eyes and fair hair.", ["has", "have", "is", "does"], "She/Maria → has got.", "She/Maria → has got."),
    mc("4", "___ you got a brother? — No, I haven't.", ["Have", "Has", "Do", "Are"], "С you в вопросе — Have you got…?", "You-мен сұрақта — Have you got…?"),
    mc("5", "We have ten ___ on our hands.", ["fingers", "toes", "knees", "elbows"], "На руках десять пальцев: fingers.", "Қолда он саусақ бар: fingers."),
    mc("6", "A tall man with short dark hair and a beard. Which word describes his FACE?", ["beard", "tall", "short", "dark"], "Борода (beard) — часть лица; tall — рост.", "Сақал (beard) — беттің бөлігі; tall — бой."),
    mc("7", "The plural of tooth is ___.", ["teeth", "tooths", "toothes", "tooth"], "Tooth → teeth.", "Tooth → teeth."),
    mc("8", "She ___ got a bicycle, but she has got a scooter.", ["hasn't", "haven't", "doesn't", "isn't"], "She + has not = hasn't got.", "She + has not = hasn't got."),
    mc("9", "My grandfather is old. He has got grey hair and a long white ___.", ["beard", "knee", "elbow", "ankle"], "Борода — beard.", "Сақал — beard."),
    mc("10", "I use my ___ to listen to music.", ["ears", "eyes", "legs", "shoulders"], "Слушают ушами: ears.", "Құлақпен тыңдайды: ears."),
  ],
};

export default topic;
