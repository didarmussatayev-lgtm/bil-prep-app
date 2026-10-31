/**
 * Пробные варианты НИШ (английский): 20 вопросов, 40 минут, как на экзамене. Тексты и вопросы написаны с нуля «в стиле» книг.
 * Верный вариант в данных — ПЕРВЫЙ; при сборке варианты циклически переставляются (см. build() в index.ts).
 */
import { EngTask, mc } from "./kit";

export type EngPaper = {
  slug: string; number: number; title: { ru: string; kk: string }; timeMinutes: number; questions: EngTask[];
  /** training — свои тренировочные; past — реальные варианты НИШ («как в книге»). */
  group?: "training" | "past";
  /** true — порядок вариантов и буква ответа как в книге (не перемешивать). */
  fixed?: boolean;
};

const A = "Text A\n";
const B = "Text B\n";
const C = "Text C\n";

export const PAPERS_DATA: EngPaper[] = [
  {
    slug: "nis-english-training-01", number: 1, title: { ru: "Пробный вариант 1", kk: "1-сынақ нұсқасы" }, timeMinutes: 40,
    questions: [
      mc("1", "What does it say?\nNO PHOTOS PLEASE", ["You mustn't take pictures here.", "You can take photos here.", "Photos are for sale.", "The camera is broken."], "No photos — фотографировать нельзя.", "No photos — суретке түсіруге болмайды."),
      mc("2", "What does the message say?\nAida – Dad phoned. He's working late. Please heat up the soup for dinner.", ["Aida should warm the soup.", "Aida should buy soup.", "Dad will cook the soup.", "Aida should phone Dad."], "Heat up the soup — разогреть суп.", "Heat up the soup — сорпаны қыздыру."),
      mc("3", "What does it say?\nWET PAINT", ["Don't touch it.", "Paint here.", "Buy paint.", "Wash it."], "Wet paint — окрашено, не трогать.", "Wet paint — боялған, ұстамаңыз."),
      mc("4", "The best antonym for 'ancient' is ...", ["modern", "old", "huge", "quiet"], "Ancient ↔ modern.", "Ancient ↔ modern."),
      mc("5", "A word that means the same as 'tiny' is ...", ["very small", "very noisy", "very old", "very clean"], "Tiny = very small.", "Tiny = very small."),
      mc("6", "A person who has a lot of money is ...", ["wealthy", "frightened", "exhausted", "polite"], "Wealthy — богатый.", "Wealthy — бай."),
      mc("7", "The opposite of 'increase' is ...", ["decrease", "grow", "add", "start"], "Increase ↔ decrease.", "Increase ↔ decrease."),
      mc("8", "A ___ is an animal that hunts other animals.", ["predator", "pet", "farmer", "neighbour"], "Predator — хищник.", "Predator — жыртқыш."),
      mc("9", A + "Penguins live in the cold south. They can't fly, but they swim very well. They eat fish and small sea animals. Penguins stay in big groups to keep warm.\n\nPenguins can't ...", ["fly", "swim", "eat fish", "stay in groups"], "Они не умеют летать.", "Олар ұша алмайды."),
      mc("10", "(Text A) Why do penguins stay in groups?", ["To keep warm", "To catch birds", "To fly", "To sleep in water"], "To keep warm.", "To keep warm."),
      mc("11", "(Text A) The best title is ...", ["Penguins: Life in the Cold", "Birds that Fly", "A Summer Holiday", "Fish for Dinner"], "Текст о пингвинах.", "Мәтін пингвиндер туралы."),
      mc("12", B + "Aizhan is eleven. She goes to school by bus. After school she does her homework and plays the violin for an hour. At weekends she visits her grandmother, who lives near the park.\n\nHow does Aizhan go to school?", ["By bus", "On foot", "By car", "By bike"], "Goes to school by bus.", "Goes to school by bus."),
      mc("13", "(Text B) What does Aizhan do after her homework?", ["Plays the violin", "Plays football", "Watches TV", "Visits the park"], "Plays the violin for an hour.", "Plays the violin for an hour."),
      mc("14", "(Text B) Where does Aizhan's grandmother live?", ["Near the park", "Near the school", "In another city", "Next to the shop"], "Near the park.", "Near the park."),
      mc("15", C + "More and more people are cycling to work. Cycling is cheap and good for health. It also helps the environment because bikes don't make smoke. However, some roads are dangerous for cyclists, so cities need more bike lanes.\n\nThe writer's main aim is to ...", ["encourage cycling and ask for bike lanes", "describe a bicycle shop", "tell a funny story", "advertise a car"], "Автор призывает ездить на велосипеде и просит велодорожки.", "Автор велосипед тебуге шақырады, велосипед жолдарын сұрайды."),
      mc("16", "(Text C) Which statement is TRUE?", ["Bikes do not make smoke.", "Cycling is expensive.", "All roads are safe for cyclists.", "Cities have enough bike lanes."], "Bikes don't make smoke.", "Bikes don't make smoke."),
      mc("17", "(Text C) The word 'however' shows ...", ["a contrast", "a reason", "a time", "an example"], "However — «однако», противопоставление.", "However — «алайда», қарама-қайшылық."),
      mc("18", "My brother is ___ than me.", ["taller", "tallest", "the taller", "more tall"], "Сравнительная степень.", "Салыстырмалы дәреже."),
      mc("19", "She ___ to school every day by bus.", ["goes", "go", "going", "is go"], "She goes.", "She goes."),
      mc("20", "I ___ my homework yesterday evening.", ["did", "do", "does", "doing"], "Yesterday — Past Simple: did.", "Yesterday — Past Simple: did."),
    ],
  },
  {
    slug: "nis-english-training-02", number: 2, title: { ru: "Пробный вариант 2", kk: "2-сынақ нұсқасы" }, timeMinutes: 40,
    questions: [
      mc("1", "What does it say?\nKEEP OUT – DANGER", ["Don't go in. It is dangerous.", "Come in, please.", "The shop is open.", "Parking is free."], "Keep out — не входить.", "Keep out — кірмеңіз."),
      mc("2", "What does the message say?\nMarat, the football match is at 4, not at 3. Bring your boots.", ["Marat should come at 4 with his boots.", "Marat should come at 3.", "Marat should buy boots.", "The match is cancelled."], "Match at 4; bring boots.", "Match at 4; bring boots."),
      mc("3", "What does it say?\nOUT OF ORDER – USE STAIRS", ["The lift is broken.", "The stairs are closed.", "The lift is free.", "Use the lift."], "Out of order — не работает.", "Out of order — жұмыс істемейді."),
      mc("4", "A word that means the same as 'quick' is ...", ["fast", "slow", "heavy", "weak"], "Quick = fast.", "Quick = fast."),
      mc("5", "The opposite of 'generous' is ...", ["selfish", "kind", "brave", "tall"], "Generous ↔ selfish.", "Generous ↔ selfish."),
      mc("6", "If something is 'plain', it is ...", ["simple, not decorated", "bright and fancy", "dangerous", "very expensive"], "Plain — простой.", "Plain — қарапайым."),
      mc("7", "A person who feels frightened is ...", ["afraid", "proud", "hungry", "angry"], "Frightened — испуганный.", "Frightened — қорыққан."),
      mc("8", "The room above the main part of a house is the ...", ["attic", "basement", "garage", "kitchen"], "Attic — чердак.", "Attic — шатыр астындағы бөлме."),
      mc("9", A + "Nurlan has a small shop near the station. It opens at 8 a.m. and closes at 8 p.m. He sells bread, milk and fruit. In summer he also sells ice cream, and many children come after school.\n\nWhen does the shop close?", ["At 8 p.m.", "At 8 a.m.", "At 6 p.m.", "At midnight"], "Closes at 8 p.m.", "Closes at 8 p.m."),
      mc("10", "(Text A) When does Nurlan sell ice cream?", ["In summer", "In winter", "Every morning", "Never"], "In summer.", "In summer."),
      mc("11", "(Text A) Which statement is true?", ["Children visit the shop after school.", "The shop is far from the station.", "The shop sells only fruit.", "Nurlan sells shoes."], "Children come after school.", "Children come after school."),
      mc("12", B + "A koala spends most of its day sleeping. It sleeps up to 20 hours! It lives in trees and eats only leaves. Because leaves give little energy, the koala moves slowly.\n\nA koala sleeps ...", ["up to 20 hours a day", "for 2 hours", "only at night", "never"], "Up to 20 hours.", "Up to 20 hours."),
      mc("13", "(Text B) Why does the koala move slowly?", ["Leaves give little energy.", "It is very old.", "It is ill.", "It likes the cold."], "Leaves give little energy.", "Leaves give little energy."),
      mc("14", "(Text B) What does a koala eat?", ["Leaves", "Fish", "Meat", "Fruit"], "Eats only leaves.", "Eats only leaves."),
      mc("15", C + "Last Saturday our class went to the zoo. We saw lions, monkeys and a giant snake. The guide told us that zoos help to save rare animals. We took many photos and had a picnic. It was a perfect day!\n\nWhat is the text mainly about?", ["A school trip to the zoo", "A new pet", "A football match", "A birthday party"], "Школьная поездка в зоопарк.", "Мектептен зоопаркке саяхат."),
      mc("16", "(Text C) Which is NOT stated in the text?", ["They saw elephants.", "They saw monkeys.", "They had a picnic.", "They took photos."], "Слонов в тексте нет.", "Мәтінде пілдер жоқ."),
      mc("17", "(Text C) 'Rare animals' are animals that ...", ["there are not many of", "are very big", "are friendly", "live in water"], "Rare — редкий.", "Rare — сирек."),
      mc("18", "Dana is ___ girl in our class.", ["the tallest", "taller", "more tall", "tallest than"], "Превосходная степень.", "Күшейтпелі дәреже."),
      mc("19", "___ you got a brother? — No, I haven't.", ["Have", "Has", "Do", "Are"], "Have you got…?", "Have you got…?"),
      mc("20", "We ___ to the park last Sunday.", ["went", "go", "goes", "going"], "Last Sunday — went.", "Last Sunday — went."),
    ],
  },
  {
    slug: "nis-english-training-03", number: 3, title: { ru: "Пробный вариант 3", kk: "3-сынақ нұсқасы" }, timeMinutes: 40,
    questions: [
      mc("1", "What does it say?\nPUSH", ["Move the door away from you.", "Pull the door.", "The door is locked.", "Don't touch."], "Push — толкнуть.", "Push — итеру."),
      mc("2", "What does the message say?\nSara, I'm at the library. Please don't forget to bring my book back to school tomorrow.", ["Sara should bring the book to school.", "Sara should go to the library.", "Sara should buy a book.", "Sara should phone."], "Bring my book back.", "Bring my book back."),
      mc("3", "What does it say?\nSALE – EVERYTHING HALF PRICE", ["Things cost less now.", "The shop is closed.", "Things cost double.", "Everything is free."], "Half price — полцены.", "Half price — жарты баға."),
      mc("4", "The antonym of 'expensive' is ...", ["cheap", "huge", "ancient", "wealthy"], "Expensive ↔ cheap.", "Expensive ↔ cheap."),
      mc("5", "'Exhausted' means ...", ["very tired", "very hungry", "very funny", "very rich"], "Exhausted — измотанный.", "Exhausted — қатты шаршаған."),
      mc("6", "A synonym of 'begin' is ...", ["start", "finish", "stop", "close"], "Begin = start.", "Begin = start."),
      mc("7", "A person who is not polite is ...", ["rude", "brave", "honest", "kind"], "Not polite = rude.", "Not polite = rude."),
      mc("8", "The place where a plant or animal lives naturally is its ...", ["habitat", "injury", "ticket", "fine"], "Habitat.", "Habitat."),
      mc("9", A + "In Japan children clean their classrooms every day. They sweep the floor and wash the boards. They also serve lunch to each other. Teachers say this teaches children to respect their school.\n\nJapanese children clean ...", ["their classrooms", "the streets", "their houses only", "nothing"], "Они убирают классы.", "Олар сыныптарын жинайды."),
      mc("10", "(Text A) What do the children do at lunch?", ["Serve lunch to each other", "Cook lunch", "Sleep", "Play football"], "Serve lunch.", "Serve lunch."),
      mc("11", "(Text A) Why do teachers say this is good?", ["It teaches respect for the school.", "It saves money.", "It is easy.", "Children like games."], "Respect.", "Respect."),
      mc("12", B + "Our town has a new park. It has a lake, a playground and a cycle path. On Sundays there is a small market where people sell fresh vegetables and handmade toys. Many families spend the whole day there.\n\nWhat can you do in the park?", ["Ride a bike", "Ski", "Watch a film", "Fly a plane"], "Cycle path — велодорожка.", "Cycle path — велосипед жолы."),
      mc("13", "(Text B) What happens on Sundays?", ["There is a market.", "The park is closed.", "A concert starts.", "There is a race."], "A market.", "A market."),
      mc("14", "(Text B) The park is probably popular because ...", ["there are many activities for families", "it is very far", "it is expensive", "it is empty"], "Много занятий для семей.", "Отбасыларға арналған көп іс бар."),
      mc("15", C + "Never leave your phone in a hot car. The battery may get too hot and stop working. Keep your phone in a cool place and don't charge it all night. This will help it last longer.\n\nThe writer's aim is to ...", ["give advice about looking after a phone", "advertise a new phone", "tell a story", "describe a car"], "Совет по уходу за телефоном.", "Телефонды күту туралы кеңес."),
      mc("16", "(Text C) What may happen to a phone in a hot car?", ["The battery may stop working.", "The screen turns blue.", "It rings louder.", "It becomes lighter."], "Battery may stop.", "Battery may stop."),
      mc("17", "(Text C) Which advice is given?", ["Don't charge it all night.", "Charge it in the car.", "Keep it in the sun.", "Never use it."], "Don't charge all night.", "Don't charge all night."),
      mc("18", "This book is ___ than that one.", ["more interesting", "most interesting", "interestinger", "the more interesting"], "Длинное прилагательное + more … than.", "Ұзын сын есім + more … than."),
      mc("19", "He ___ to work by bus every day.", ["goes", "go", "going", "gone"], "He goes.", "He goes."),
      mc("20", "I didn't ___ the film last night.", ["watch", "watched", "watches", "watching"], "После didn't — начальная форма.", "Didn't-тен кейін — бастапқы форма."),
    ],
  },
];
