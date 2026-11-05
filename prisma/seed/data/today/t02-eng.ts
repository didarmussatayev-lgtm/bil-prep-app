import type { EngTask } from "../eng/kit";

/** Тест 2 · Английский язык (20 вопросов по 7 текстам). Тексты и вопросы написаны заново; нумерация 141–160. */
const E = (n: number, q: string, options: string[], correct: "A" | "B" | "C" | "D", ru: string, kk: string): EngTask => ({ n: String(n), q, choice: { options, correct }, sol: { ru, kk } });

const A1 = `**Text 1**
Welcome to "Blue Lake Camp"!
Are you looking for an unforgettable summer?
Join us for two weeks of swimming, hiking and campfire songs!
Our counsellors will teach you to sail, to find your way with a map and to cook on a fire.
You will make friends for life.
Places are limited, so book early!`;
const A2 = `**Text 2**
Dear Parents,
We are happy to invite you to the school concert on Friday, 12 May, at 6 p.m. in the main hall.
Please arrive 15 minutes early. Entry is free, but we will be collecting donations for the school library.
Yours sincerely,
Ms. Roberts, Head Teacher`;
const A3 = `**Text 3**
Hi Aruzhan,
Thanks for your invitation to your birthday party! I'd love to come. ______, I can't stay late because I have a piano lesson early on Sunday morning.
Can I bring something? Maybe a cake or some juice? Let me know.
See you on Saturday!
Dana`;
const A4 = `**Text 4: A Young Chess Champion**
(1) Eleven-year-old Timur Nurlanov won the national junior chess tournament last Sunday. He beat players who were three years older than him and finished the competition without a single loss.
(2) "I practise two hours every day," said Timur. "My dad taught me the rules when I was five, and my coach helps me to plan my moves. I was nervous before the last game, but I tried to stay calm."
(3) Last year's champion, Alisher Omarov, came fourth.`;
const A5 = `**Text 5: Penguins**
(1) Penguins are birds, but they cannot fly. They live in the Southern Hemisphere, and most of them live in Antarctica. There are about 18 species of penguins, and the largest one, the emperor penguin, is about 1.1 metres tall.
(2) Penguins are excellent swimmers. They use their wings like flippers and can reach a speed of 20 kilometres per hour under water. They eat fish, squid and krill.
(3) Many people think that all penguins live in the cold. ______, some species, such as the Galapagos penguin, live near the equator. Penguins stay warm thanks to a thick layer of fat and waterproof feathers.`;
const A6 = `**Text 6: The Story of the Light Bulb**
Thomas Edison is famous as the inventor of the practical light bulb, but he was not the first to try. Many scientists had made electric lamps before him, but their bulbs burned for only a few minutes. Edison and his team tested thousands of materials to make the thin wire inside the bulb. In 1879 they found that a carbonized cotton thread could burn for more than a day. They worked day and night ______, and their success changed the way people lived: streets and homes became bright after sunset.`;
const A7 = `**Text 7: Why Do We Need Sleep?**
(1) People spend about a third of their lives sleeping. Scientists say that sleep is as important for the body as food and water.
(2) While we sleep, the brain organizes information we learned during the day. Sleep also helps the body to grow and to repair itself.
(3) Children and teenagers need more sleep than adults: school-age children need nine to eleven hours every night. Without enough sleep, people find it hard to concentrate and often feel angry or sad.
(4) To sleep well, doctors advise going to bed at the same time every day and not using phones in the last hour before sleeping.`;

export const T02_ENG: EngTask[] = [
  E(141, `${A1}\n\n**1. What is the main idea of this announcement?**`, ["Summer is hot.", "Blue Lake Camp offers an exciting summer holiday.", "Camps are expensive.", "Sailing is dangerous."], "B", "The text invites children to a camp and describes activities.", "Мәтін балаларды лагерьге шақырып, іс-шараларды сипаттайды."),
  E(142, `**2. What does "Places are limited" mean?**`, ["There are few places for everyone", "The camp is small", "The camp is far away", "Places are expensive"], "A", "\"Limited\" means there is only a small number of places available.", "\"Limited\" — орын саны шектеулі дегенді білдіреді."),
  E(143, `${A2}\n\n**3. Why did Ms. Roberts write this letter?**`, ["To invite parents to a school concert", "To ask for a donation", "To complain about noise", "To announce a holiday"], "A", "The letter invites parents to the concert.", "Хат ата-аналарды концертке шақырады."),
  E(144, `${A3}\n\n**4. What is the main purpose of the message?**`, ["To refuse", "To accept an invitation", "To ask for money", "To complain"], "B", "Dana says she would love to come — she accepts.", "Дана келгісі келетінін айтады — шақыруды қабылдайды."),
  E(145, `**5. What does "it" refer to in "Maybe a cake or some juice?" ("Can I bring something?")**`, ["Something", "Party", "Lesson", "Morning"], "A", "The question is about what Dana can bring — \"something\".", "Сұрақ Дана не ала алатыны туралы — \"something\"."),
  E(146, `**6. What word is missing in the first paragraph?**`, ["Besides", "However", "Because", "Instead"], "B", "\"I'd love to come. However, I can't stay late\" — contrast.", "\"I'd love to come. However, I can't stay late\" — қарсы қою."),
  E(147, `${A4}\n\n**7. Which paragraph contains the champion's own words?**`, ["Paragraph 1", "Paragraph 2", "Paragraph 3", "All of the above"], "B", "Paragraph 2 quotes Timur.", "2-абзацта Тимурдың сөздері келтірілген."),
  E(148, `**8. Which of the following statements is true?**`, ["Timur lost one game.", "Timur is eleven years old.", "Last year's champion came first.", "Timur's mother taught him the rules."], "B", "The text says he is eleven; he lost no games; his dad taught him.", "Мәтінде ол он бір жаста; бірде-бір ойыннан жеңілмеген; ережені әкесі үйреткен."),
  E(149, `**9. Where can you find this kind of text?**`, ["News website", "Cookbook", "Dictionary", "Timetable"], "A", "It reports a recent event with quotes.", "Ол жақында болған оқиға туралы дәйексөздермен хабарлайды."),
  E(150, `${A5}\n\n**10. Which of the following sentences compares?**`, ["The emperor penguin is the largest species.", "Penguins eat fish.", "Penguins live in the Southern Hemisphere.", "They use their wings like flippers."], "A", "\"The largest\" is a superlative — it compares one species with all others.", "\"The largest\" — функциясы бойынша барлық түрлермен салыстырады."),
  E(151, `**11. What information is not included in the text?**`, ["How fast penguins swim", "How long penguins live", "What penguins eat", "Where penguins live"], "B", "Life span is not mentioned.", "Өмір ұзақтығы туралы айтылмаған."),
  E(152, `**12. What word is missing in the third paragraph?**`, ["Because", "However", "Besides", "Therefore"], "B", "\"Many people think… However, some species live near the equator\" — contrast.", "\"Many people think… However, some species live near the equator\" — қарсы қою."),
  E(153, `${A6}\n\n**13. Why was Edison's lamp more successful than earlier ones?**`, ["It was cheaper", "The filament could burn for a much longer time", "It was bigger", "It used gas"], "B", "A carbonized cotton thread burned for more than a day.", "Көміртектелген мақта жібі бір тәуліктен астам жанды."),
  E(154, `**14. What phrase should be inserted into the blank space?**`, ["for fun", "until they found a solution", "without any help", "only on Sundays"], "B", "\"Day and night until they found a solution\" fits the meaning.", "\"Day and night until they found a solution\" мағынаға сәйкес."),
  E(155, `${A7}\n\n**15. According to the text, what does the brain do during sleep?**`, ["Stops working", "Organizes information learned during the day", "Grows bigger", "Learns new languages"], "B", "Paragraph 2 says the brain organizes information.", "2-абзацта ми ақпаратты ретке келтіреді делінген."),
  E(156, `**16. What does "it" refer to in "the body to grow and to repair itself"?**`, ["Brain", "Body", "Sleep", "Day"], "B", "\"Itself\" refers to the body.", "\"Itself\" денеге қатысты."),
  E(157, `**17. What would probably be the best title for the text?**`, ["Sleep and Its Importance", "Modern Phones", "A Day at School", "Food and Water"], "A", "The whole text is about why sleep is important.", "Мәтін ұйқының неліктен маңызды екені туралы."),
  E(158, `**18. How much sleep do school-age children need?**`, ["Six to seven hours", "Nine to eleven hours", "Twelve to fourteen hours", "Five hours"], "B", "\"Nine to eleven hours every night.\"", "\"Nine to eleven hours every night.\""),
  E(159, `**19. What do doctors advise?**`, ["Using phones before bed", "Going to bed at the same time every day", "Sleeping during the day", "Eating late"], "B", "Doctors advise going to bed at the same time every day.", "Дәрігерлер күн сайын бір уақытта жатуды ұсынады."),
  E(160, `**20. What happens when people do not sleep enough?**`, ["They grow faster", "They find it hard to concentrate", "They become taller", "They learn more"], "B", "\"People find it hard to concentrate and often feel angry or sad.\"", "\"People find it hard to concentrate and often feel angry or sad.\""),
];
