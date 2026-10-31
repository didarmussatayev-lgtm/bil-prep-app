import { EngTopic, mc, fill, fills, pick, vocab, joinBi } from "../kit";

const topic: EngTopic = {
  code: "1.13",
  title: { ru: "Творчество: музыка и музыкальные инструменты", kk: "Шығармашылық: музыка және музыкалық аспаптар" },
  explanation: joinBi(
    {
      ru: `Unit 5 «Creativity». Здесь слова о музыке, искусстве и увлечениях. Музыкальные инструменты делят на четыре семьи — это частое задание на «odd one out».`,
      kk: `Unit 5 «Creativity». Мұнда музыка, өнер және хоббиге қатысты сөздер. Музыкалық аспаптар төрт топқа бөлінеді — бұл «odd one out» тапсырмасында жиі кездеседі.`,
    },
    {
      ru: `:::figure {"kind":"table","caption":"Families of instruments","rows":[["String (струнные)","Percussion (ударные)","Brass (медные духовые)","Woodwind (деревянные духовые)"],["guitar, violin, cello, double bass, banjo","drum, snare drum, xylophone, marimba, djembe","trumpet, trombone, French horn, tuba","flute, clarinet, oboe, saxophone, bassoon"]]}
:::

:::tip Клавишные
**piano** (фортепиано) — клавишный инструмент, его обычно относят к струнно-ударным; на экзамене чаще всего его называют просто keyboard instrument.
:::`,
      kk: `:::figure {"kind":"table","caption":"Families of instruments","rows":[["String (ішекті)","Percussion (соқпалы)","Brass (мыс үрмелі)","Woodwind (ағаш үрмелі)"],["guitar, violin, cello, double bass, banjo","drum, snare drum, xylophone, marimba, djembe","trumpet, trombone, French horn, tuba","flute, clarinet, oboe, saxophone, bassoon"]]}
:::

:::tip Пернетақталы
**piano** (фортепиано) — пернетақталы аспап, оны әдетте ішекті-соқпалыға жатқызады; емтиханда көбіне keyboard instrument деп атайды.
:::`,
    },
    vocab({ ru: "Музыка и творчество", kk: "Музыка және шығармашылық" }, [
      ["to sing / a singer", "ән айту / әнші", "петь / певец"], ["to play an instrument", "аспапта ойнау", "играть на инструменте"], ["a song / a concert", "ән / концерт", "песня / концерт"],
      ["a band / an orchestra", "топ / оркестр", "группа / оркестр"], ["to compose / a composer", "ән жазу / композитор", "сочинять / композитор"], ["to paint / a painter", "сурет салу / суретші", "рисовать красками / художник"],
      ["to draw / a drawing", "сызу / сурет", "рисовать / рисунок"], ["to dance / a dancer", "би билеу / биші", "танцевать / танцор"], ["to act / an actor", "рөл ойнау / актер", "играть роль / актёр"],
      ["talented", "дарынды", "талантливый"], ["famous", "әйгілі", "известный"], ["audience", "көрермендер", "публика, зрители"],
    ]),
    {
      ru: `:::remember Как говорить
Играть **на** инструменте — **play the** guitar (с артиклем the!). Играть в спорт — **play** football (без the). Заниматься искусством — **do** painting, **take** photographs.
:::

:::warn Ловушка
**play the piano**, а не «play piano»; **play football**, а не «play the football».
:::`,
      kk: `:::remember Қалай айтамыз
Аспапта ойнау — **play the** guitar (the артиклімен!). Спорт ойнау — **play** football (the-сіз). Өнермен айналысу — **do** painting, **take** photographs.
:::

:::warn Қателік
**play the piano** деп айтады, «play piano» емес; **play football**, «play the football» емес.
:::`,
    },
  ),
  practice: [
    fill("1", "A person who sings is a ______. (6 letters)", "singer", "Singer — певец.", "Singer — әнші."),
    fill("2", "A person who paints pictures is a ______. (7 letters)", "painter", "Painter — художник.", "Painter — суретші."),
    fill("3", "A person who writes music is a ______. (8 letters)", "composer", "Composer — композитор.", "Composer — композитор."),
    fill("4", "You play it with sticks. It is a ______. (4 letters)", "drum", "Drum — барабан.", "Drum — барабан."),
    fills("5", "Write the or X (write 'x' if no word is needed).\nI play ___ guitar. He plays ___ football.", ["the", "x"], "С инструментом — the; со спортом — без артикля.", "Аспаппен — the; спортпен — артикльсіз."),
    pick("6", "Which are STRING instruments? Write the numbers.\n1. violin  2. trumpet  3. cello  4. flute  5. guitar", [1, 3, 5], "Violin, cello, guitar — струнные; trumpet — медный духовой; flute — деревянный духовой.", "Violin, cello, guitar — ішекті; trumpet — мыс үрмелі; flute — ағаш үрмелі."),
    pick("7", "Which are WIND instruments (you blow into them)? Write the numbers.\n1. trumpet  2. drum  3. flute  4. violin  5. saxophone", [1, 3, 5], "Trumpet, flute, saxophone — духовые.", "Trumpet, flute, saxophone — үрмелі."),
    fill("8", "Write the word: The people who watch a concert are the ______.", "audience", "Audience — публика, зрители.", "Audience — көрермендер."),
  ],
  test: [
    mc("1", "Which instrument does NOT belong to the group?", ["drum", "violin", "cello", "guitar"], "Violin, cello, guitar — струнные; drum — ударный.", "Violin, cello, guitar — ішекті; drum — соқпалы."),
    mc("2", "She plays ___ violin very well.", ["the", "a", "an", "—"], "С музыкальным инструментом — the.", "Музыкалық аспаппен — the."),
    mc("3", "A ___ draws pictures with pencils and paints.", ["painter", "singer", "pilot", "baker"], "Painter — художник.", "Painter — суретші."),
    mc("4", "He plays ___ football every Sunday.", ["—", "the", "a", "an"], "Со спортом артикль не нужен.", "Спортпен артикль қажет емес."),
    mc("5", "A person who dances is a ___.", ["dancer", "dance", "dancing", "danced"], "Dancer — танцор.", "Dancer — биші."),
    mc("6", "Which is a woodwind instrument?", ["flute", "trumpet", "drum", "banjo"], "Flute — деревянный духовой.", "Flute — ағаш үрмелі."),
    mc("7", "The people in a theatre who watch the play are the ___.", ["audience", "actors", "orchestra", "dancers"], "Зрители — audience.", "Көрермендер — audience."),
    mc("8", "A talented person is ___.", ["very good at something", "always late", "afraid of music", "tired of work"], "Talented — одарённый.", "Talented — дарынды."),
    mc("9", "A group of musicians who play together is a ___.", ["band", "painter", "audience", "drawing"], "Band — музыкальная группа.", "Band — музыкалық топ."),
    mc("10", "I can sing but I can't ___ the piano.", ["play", "do", "make", "go"], "Play the piano.", "Play the piano."),
  ],
};

export default topic;
