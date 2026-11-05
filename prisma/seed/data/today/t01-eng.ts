import type { EngTask } from "../eng/kit";

/** Тест 1 · Английский язык (20 вопросов по 7 текстам). Тексты и вопросы написаны заново «в стиле» книги; нумерация сквозная 141–160. */
const E = (n: number, q: string, options: string[], correct: "A" | "B" | "C" | "D", ru: string, kk: string): EngTask => ({ n: String(n), q, choice: { options, correct }, sol: { ru, kk } });

const A1 = `**Text 1**
Introducing "Marco's Burgers"!
Are you tired of dry, tasteless burgers?
Are you looking for the perfect lunch?
Look no further!
Marco's juicy burgers will blow you away with the very first bite!
Our meat is grilled over real fire, and our secret sauce is made of fresh herbs.
Our soft buns are baked every morning.
Do yourself a favour: come to Marco's with an empty stomach and a big smile.
We promise you will love us from the first bite!`;
const A2 = `**Text 2**
Dear Ms. Carter,
Thank you for sending us the details of your advertising offer.
We have decided not to place an advert in the autumn issue, but we may consider one in the spring issue in April.
We will contact you again. Thank you once more for your help.
Yours sincerely,
Daniel Brooks`;
const A3 = `**Text 3**
Dear Aigerim,
I would like to congratulate you on organizing such a useful and interesting seminar. I know many teachers learnt a lot from it. Could you please pass on my thanks to Professor Lee for his excellent talk on Classroom Motivation? We were very lucky that he found time for us. The feedback from the teachers was very positive. Let's hope we will soon see better results in our classes!
______, I can't find the list of the participants' phone numbers. I think I left it in your office. I haven't seen it since our meeting on Thursday.
Thanks again for a wonderful day,
Mira`;
const A4 = `**Text 4: Swimming Champions**
(1) Daniyar Sadykov and Anna Petrova completed a double for their country as they won the men's and women's races at the 2019 City Swimming Cup. Sadykov set a new cup record of 3 minutes 48 seconds, while Petrova won in 4:10, the third fastest women's time in the history of the cup.
(2) Sadykov told the local radio: "This is a dream come true. I only wanted to win the race, I wasn't thinking about the time. I'm very happy, because I came here three times before and was second twice. It's an unbelievable achievement for me."
(3) Last year's winner of the men's race, Arman Beketov, finished eighth.`;
const A5 = `**Text 5: Bees**
(1) Bees are not just small flying insects! They are among the most useful animals on the planet. Bees live on every continent except Antarctica. There are more than 20,000 known kinds of bees, and many of them live alone rather than in hives.
(2) Bees are unique because they collect nectar and turn it into honey. While looking for nectar, they carry pollen from flower to flower. Thanks to this, many fruits and vegetables can grow. Honey bees live in large families with one queen, while bumblebees live in smaller groups.
(3) Many people are afraid of bees. Most bees, ______, are quite calm and sting only when they feel danger. Some kinds, however, such as hornets, can be dangerous, and a sting from them may need a doctor's help. A bee sting is said to be as painful as a nettle sting.`;
const A6 = `**Text 6: The Inventor of the Bicycle Pedal**
Pierre Michaux is best known today as one of the people who put pedals on the bicycle, but he was first a locksmith. He was always interested in mechanical things, and he repaired carriages in his workshop in Paris. One day in 1861 a customer brought him a wooden "running machine" to repair. Pierre watched the rider push the ground with his feet and thought: why not turn the wheel with the feet instead? The idea seemed strange to everybody at first. He worked day and night ______, and soon he made the first bicycle with pedals. He gave up repairing carriages and spent the rest of his life improving his invention.`;
const A7 = `**Text 7: How People Told the Time**
(1) People have measured time for thousands of years. The first clock was probably the Sun: people noticed how the shadow of a stick moved during the day.
(2) The shadow clock was very useful, but it did not work at night or on cloudy days. In some countries people used water clocks. Water slowly dripped from one vessel to another, and the level showed the hour.
(3) Later, people began to use candles. A candle clock was a candle with equal marks on it. When the candle burned down to the next mark, one hour had passed. But the candle clock was not always accurate: if there was a wind, the candle burned too fast.
(4) Only many centuries later did people invent mechanical clocks with wheels and weights.`;

export const T01_ENG: EngTask[] = [
  E(141, `${A1}\n\n**1. What is the main idea of this advertisement?**`, ["Some burgers are dry.", "Marco's serves the best burgers.", "Burgers are healthy food.", "Herbs make food tasty."], "B", "The ad invites readers to try Marco's burgers and promises they will love them — it says Marco's burgers are the best.", "Жарнама оқырманды Marco's бургерін татып көруге шақырады және оны ұнататынына уәде береді — Marco's бургерлері ең жақсы дейді."),
  E(142, `**2. Which expression means the same as "blow you away"?**`, ["Hurt you", "Amaze you", "Make you sleepy", "Make you angry"], "B", "\"Blow you away\" means to impress or amaze someone very much.", "\"Blow you away\" — адамды қатты таңғалдыру, әсерлендіру."),
  E(143, `${A2}\n\n**3. Why did Mr. Brooks write this letter?**`, ["To ask for a job", "To say he was not interested in placing an advert now", "To order a magazine", "To ask for a lower price"], "B", "He writes that they will not place an advert in the autumn issue, but may consider the spring issue.", "Ол күзгі нөмірге жарнама бермейтінін, көктемгі нөмірді қарастыруы мүмкін екенін жазады."),
  E(144, `${A3}\n\n**4. What is the main purpose of the message?**`, ["To inform", "To entertain", "To surprise", "To praise"], "D", "Mira congratulates Aigerim and thanks her for a wonderful day — the purpose is to praise.", "Мира Айгерімді құттықтап, тамаша күн үшін алғыс айтады — мақсаты мақтау."),
  E(145, `**5. What does the underlined word "it" in "I think I left it in your office" refer to?**`, ["Office", "Seminar", "List", "Meeting"], "C", "She lost the list of phone numbers, so \"it\" refers to the list.", "Ол телефон нөмірлерінің тізімін жоғалтты, сондықтан \"it\" — тізім."),
  E(146, `**6. What word is missing in the second paragraph?**`, ["In addition to", "Nevertheless", "By the way", "For instance"], "C", "\"By the way\" introduces an unrelated extra remark — the missing list.", "\"By the way\" — қосымша, байланыссыз ескертуді енгізеді: жоғалған тізім."),
  E(147, `${A4}\n\n**7. Which paragraph contains the athlete's opinion about the race?**`, ["Paragraph 1", "Paragraph 2", "Paragraph 3", "All of the above"], "B", "Paragraph 2 quotes Sadykov's own words about his feelings.", "2-абзацта Садықовтың өз сөздері, сезімі келтірілген."),
  E(148, `**8. Which of the following statements is true?**`, ["Sadykov set a new record for the cup.", "The woman finished before the man.", "Last year's winner finished in the top five.", "Petrova was disappointed."], "A", "Sadykov set a new cup record of 3:48. Petrova's time was slower (4:10) and the previous winner finished eighth.", "Садықов 3:48 уақытымен кубоктың жаңа рекордын орнатты. Петрованың уақыты баяу (4:10), ал өткен жылғы жеңімпаз сегізінші болды."),
  E(149, `**9. Where can you find this kind of text?**`, ["Online store", "News website", "Encyclopedia", "Kids' magazine"], "B", "It reports a recent sports event with quotes — a news website.", "Жақында өткен спорттық оқиға туралы дәйексөздермен хабарлайды — жаңалықтар сайты."),
  E(150, `${A5}\n\n**10. Which of the following sentences compares?**`, ["A bee sting is said to be as painful as a nettle sting.", "Bees carry pollen from flower to flower.", "Many people are afraid of bees.", "A sting from hornets may need a doctor's help."], "A", "\"As painful as\" compares two things.", "\"As painful as\" екі нәрсені салыстырады."),
  E(151, `**11. What information is not included in the text?**`, ["The number of kinds of bees", "How long bees live", "Where bees live", "What bees do with nectar"], "B", "The text does not say how long bees live.", "Мәтінде аралардың қанша өмір сүретіні айтылмаған."),
  E(152, `**12. What word is missing in the passage (third paragraph)?**`, ["Besides that", "Unlike humans", "however", "in comparison with wasps"], "C", "\"Most bees, however, are quite calm\" — contrast with the fear mentioned before.", "\"Most bees, however, are quite calm\" — алдыңғы қорқынышқа қарсы қою."),
  E(153, `${A6}\n\n**13. Pierre left repairing carriages and invented pedals because he…**`, ["was tired of his work", "was inspired by a rider's movements", "wanted to become rich", "was ordered by the government"], "B", "Pierre saw the rider push the ground with his feet and had the idea to use pedals.", "Пьер шабандоздың аяқпен жерді итергенін көріп, педаль идеясын ойлап тапты."),
  E(154, `**14. What phrase should be inserted into the blank space?**`, ["because he missed home", "in order to show his friends", "until he was satisfied", "as slowly as possible"], "C", "\"Day and night until he was satisfied\" fits the meaning of persistent work.", "\"Day and night until he was satisfied\" — табандылықпен жұмыс істеу мағынасына сәйкес келеді."),
  E(155, `${A7}\n\n**15. According to the text, why did people use water clocks?**`, ["To measure time at night and on cloudy days", "To water plants", "To cool rooms", "To make candles"], "A", "The shadow clock did not work at night or when it was cloudy, so water clocks were used.", "Көлеңке сағаты түнде және бұлтты күні жұмыс істемейтін, сондықтан су сағаттарын қолданған."),
  E(156, `**16. What does the underlined word "it" in the third paragraph ("it burned too fast") refer to?**`, ["Wind", "Mark", "Candle", "Hour"], "C", "\"If there was a wind, the candle burned too fast.\"", "\"If there was a wind, the candle burned too fast.\""),
  E(157, `**17. What would probably be the best title for the text?**`, ["Modern Clocks", "Ways of Telling the Time in History", "The Invention of the Candle", "Weather and Time"], "B", "The text lists several historical ways of telling time.", "Мәтінде уақытты анықтаудың бірнеше тарихи тәсілі аталады."),
  E(158, `**18. Which clock is mentioned as the first one?**`, ["Water clock", "Candle clock", "Shadow clock", "Mechanical clock"], "C", "\"The first clock was probably the Sun\" — the shadow clock.", "\"The first clock was probably the Sun\" — көлеңке сағаты."),
  E(159, `**19. What is the problem of the candle clock?**`, ["It is too expensive", "Wind can make it inaccurate", "It works only at night", "It has no marks"], "B", "The text says that wind makes the candle burn too fast, so the clock is not accurate.", "Мәтінде жел шамды тез жандырады, сондықтан сағат дәл емес деп айтылған."),
  E(160, `**20. When were mechanical clocks invented?**`, ["Before water clocks", "At the same time as candle clocks", "Many centuries after the candle clocks", "Never"], "C", "\"Only many centuries later did people invent mechanical clocks.\"", "\"Only many centuries later did people invent mechanical clocks.\""),
];
