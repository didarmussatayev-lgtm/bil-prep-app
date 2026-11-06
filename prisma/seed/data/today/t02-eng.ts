import type { EngTask } from "../eng/kit";

/** Тест 2 · Английский язык — пересказ оригинала (стр. 84–92): тексты перефразированы, имена и числа изменены; вопросы и порядок как в книге, буквы — по ключу книги. Нумерация 141–160. */
const E = (n: number, q: string, options: string[], correct: "A" | "B" | "C" | "D", ru: string, kk: string): EngTask => ({ n: String(n), q, choice: { options, correct }, sol: { ru, kk } });

const A1 = `**Text 1**
Come to "Blue Wave Water Park"!
Slide, splash and relax with the whole family!
Meet our friendly dolphins at the daily show and enjoy 15 slides, a wave pool and a lazy river.
Open every day from 10 a.m. to 7 p.m. Don't miss the best summer fun in town!`;
const A2 = `**Text 2: Bird Ears**
Have you ever wondered how birds hear? Birds have ears just like people, but they are hard to see because feathers cover them. A bird's ears are small holes on the sides of its head, and the feathers protect them from wind and rain.`;
const A3 = `**Text 3: The Danube**
______ not the longest river in Europe, the Danube is one of the most important. Unlike many big rivers, it is used for shipping and passes through ten countries. What makes it special is also its location: for many kilometres it forms the border between several states. Since 1856, special commissions have helped to keep it safe for ships.`;
const A4 = `**Text 4**
You have just graduated from school. You need to find a place to study further. Which text contains the information you are looking for?
A) "Opportunities for teachers" — a job fair for experienced teachers.
B) "Think. Do. Make a difference." — a university advertisement about its courses and scholarships.
C) "World travel agency" — cheap tickets and holiday tours.
D) "Seaview Marine Hotel" — rooms by the sea and a restaurant.`;
const A5 = `**Text 5: Marie Tharp**
(1) By the time Marie was 12, she knew that she wanted to study the sea. This was an unusual dream for a girl in the 1940s. There were few women scientists then, and most women were not allowed to go on research ships, but Marie was determined.
(2) Marie's dream came true when she was 24. She moved to New York, where a famous scientist, Dr. Bruce Heezen, hired her as an assistant. Soon Marie began making maps of the ocean floor. Her work changed the way people understand the sea, and she became an important scientist.
(3) Marie loved nature from early childhood. When she was five, her father, a map-maker, took her on his trips, and she watched him draw maps of fields and rivers. Her favourite books were about explorers and islands.`;
const A6 = `**Text 6: Raisins**
Raisins are dried grapes that people have eaten for thousands of years. About 3,000 years ago the first raisins were discovered as grapes drying in the sun on a vine. In medieval Europe raisins were used as sweeteners, medicine and even as a form of money!
In America raisins were first made after a heat wave in 1873 destroyed the grape crop in California and left only dried, wrinkled but tasty grapes on the vines. Soon farmers began growing seedless, thin-skinned, sweet grapes, which they dried in the sun on purpose. A golden variety was made later by treating grapes with a special substance and drying them in a special way.
Today central California produces about 90 percent of the world's raisins: its sunny climate and hot summers are perfect for drying grapes.`;
const A7 = `**Text 7: Farm Machinery**
(1) Before farm machines were invented, an average farm was small. It produced only enough food for the family, perhaps with a little left to sell. Farmers did most work with hand tools such as a hoe, a spade and shears. Farmers are sometimes carpenters, too, so they use a hammer, pliers, a knife and an axe.
(2) Before tractors, farm machines were usually driven by animals. Tractors are much more efficient and powerful than animals. They do not require as much care as animals, and they can work all day without rest.
(3) The tractor is the most useful single piece of farm equipment: it can pull a plough, a cultivator and many other machines.`;
const A8 = `**Text 8**
(1) Madina says all her friends have a mobile phone, but her mum does not want to buy her one. Her mum does not want her to play video games, either. ______, the Internet scares her. "If Madina has a phone, how do we know whom she talks to? Video games are bad for you. The Internet is dangerous and uncontrolled, like having a knife on the table. We should ban her from the computer, and I won't buy a phone until she is sixteen. It is the only way to be sure she is safe."
(2) Madina's dad disagrees. He agrees that there are some dangers, but he likes the Internet and finds it useful. "We can't stop Madina from using it; that would put her at a disadvantage. What's more, I like video games: played in moderation, they are fun. Obviously, playing without self-control is not good. Finally, I think she needs a phone. We can't take these things away."`;
const A9 = `**Text 9: Puppy or Adult Dog?**
(1) Many people who want a pet dog get a puppy. Puppies are cute, friendly and playful. But there are good reasons to think about an adult dog instead.
(2) When you get a puppy, you must teach it everything: not to go to the toilet in the house, not to jump on guests or chew shoes, and to walk on a lead. This is a lot of work.
(3) On the other hand, many adult dogs already know all these things.
(4) Puppies also have lots of energy and want to play all the time. They do not always sleep through the night or let you relax in front of the TV.
(5) On the other hand, most adult dogs wait for you to play. What is more, they sleep when you sleep and happily watch TV next to you.
(6) One last reason: most people who visit a shelter choose a puppy, so many adult dogs stay there for a long time and some never find a home. Adult dogs are good pets that need good homes.`;

export const T02_ENG: EngTask[] = [
  E(141, `${A1}\n\n**1. What is the purpose of this advertisement?**`, ["To entertain readers.", "To explain how to train a dolphin.", "To persuade readers to visit this water park.", "To express feelings about saving dolphins."], "C", "The ad invites people to visit the water park.", "Жарнама адамдарды су паркіне келуге шақырады."),
  E(142, `${A2}\n\n**2. Based on the information in the passage, which statement is true?**`, ["Birds have ears that are difficult to detect.", "Birds have feathers instead of ears.", "Birds have ears on the backs of their heads.", "Many people wonder about how birds hear."], "A", "The passage says bird ears are hard to see because of feathers.", "Мәтінде құс құлағы қауырсынның астында, көру қиын делінген."),
  E(143, `${A3}\n\n**3. According to the passage, why is the Danube so important?**`, ["It is the drinking-water source for most of Europe.", "It is used for shipping and forms a border between states.", "It is the longest river in Europe.", "It is known by two different names."], "B", "The Danube is used for shipping and forms borders.", "Дунай кеме қатынасы үшін қолданылады және мемлекеттер арасындағы шекара болады."),
  E(144, `**4. What word is missing in the first sentence of the passage?**`, ["However", "Actually", "Although", "But so far"], "C", "\"Although (it is) not the longest river...\" introduces a concession.", "\"Although\" — ымыраластық мағынасын береді."),
  E(145, `${A4}\n\n**5. Which text contains the information you are looking for?**`, ["Opportunities for teachers.", "Think. Do. Make a difference.", "World travel agency.", "Seaview Marine Hotel."], "B", "Only the university advertisement gives information about further study.", "Тек университет жарнамасы оқуды жалғастыру туралы ақпарат береді."),
  E(146, `${A5}\n\n**6. What is the right order of paragraphs in the passage?**`, ["1-3-2.", "3-2-1.", "1-2-3.", "3-1-2."], "D", "The text begins with childhood (3), then the dream (1), then it comes true (2).", "Мәтін балалықтан (3), одан арман (1), содан соң орындалуы (2) басталады."),
  E(147, `**7. What is the main idea of the passage?**`, ["Becoming a scientist was difficult for women in the 1940s.", "As a girl and later as a famous scientist, Marie Tharp enjoyed studying the sea.", "Marie Tharp worked with Dr. Heezen even though women were not usually scientists.", "Marie enjoyed drawing maps with her father."], "B", "The text follows her from childhood to scientific work.", "Мәтін оны балалықтан ғылыми жұмысқа дейін сипаттайды."),
  E(148, `**8. How did Dr. Heezen help Marie reach her dream?**`, ["Marie visited his farm and watched hens.", "He travelled with her to the sea.", "He gave her a job as his assistant, and she could begin research.", "She met him in Africa as a girl."], "C", "He hired her as an assistant.", "Ол оны көмекші етіп жұмысқа алды."),
  E(149, `${A6}\n\n**9. What would be the best title for this passage?**`, ["A History of Raisins.", "Healthy Snacks.", "The Discovery of the Golden Raisin.", "The Many Different Kinds of Raisins."], "A", "The passage tells the history of raisins.", "Мәтін мейіздің тарихын баяндайды."),
  E(150, `**10. What is NOT true about raisins?**`, ["They are dried in the sun.", "There are dark and golden versions of raisins.", "They are grown in California.", "They are made from grapes with seeds."], "D", "The farmers developed seedless grapes for raisins.", "Мейіз үшін тұқымсыз жүзім өсірілген."),
  E(151, `**11. Which of the following questions is NOT answered in the passage?**`, ["When did farmers start growing raisins in America?", "Why are raisins healthy for you?", "Why did American farmers start producing raisins?", "How are golden raisins produced?"], "B", "The health benefits of raisins are not mentioned.", "Мейіздің денсаулыққа пайдасы туралы айтылмаған."),
  E(152, `${A7}\n\n**12. What are the advantages of using a farm tractor? All of the following are mentioned, EXCEPT…**`, ["It is more efficient and powerful.", "It can work the whole day.", "The price is cheaper than animals.", "It does not need as much care as animals."], "C", "The price is never mentioned.", "Бағасы туралы айтылмаған."),
  E(153, `**13. "They do not require as much care as animals" (paragraph 2). The word "they" refers to…**`, ["farmers.", "animals.", "machines.", "farm tractors."], "D", "\"They\" refers to the farm tractors in the previous sentence.", "\"They\" — алдыңғы сөйлемдегі тракторларға қатысты."),
  E(154, `${A8}\n\n**14. Which best describes the similarity between Madina's mum and dad?**`, ["Mum and dad both like technology.", "Mum and dad both think video games are bad.", "Mum and dad both think the Internet is completely dangerous.", "Mum and dad both care about Madina's wellbeing."], "D", "Both want her to be safe.", "Екеуі де қыздың амандығына алаңдайды."),
  E(155, `**15. In paragraph 1, Madina's mum says, "It's like having a knife on the table." She says this in order to…**`, ["support the idea that the Internet is dangerous.", "reject the claim that knives can be safe.", "encourage Dad to buy a knife.", "explain why the Internet is uncontrolled."], "A", "The comparison supports her view that the Internet is dangerous.", "Салыстыру интернеттің қауіпті екенін растайды."),
  E(156, `**16. What word/phrase is missing in the first paragraph?**`, ["What's more.", "But.", "In comparison.", "Again and again."], "A", "\"What's more\" adds one more argument.", "\"What's more\" тағы бір дәлел қосады."),
  E(157, `${A9}\n\n**17. The main purpose of paragraph 2 is to explain that puppies…**`, ["are very immature.", "do not make good pets.", "are little work."], "A", "Puppies have to be taught everything — they are immature.", "Күшіктерге бәрін үйрету керек — олар әлі жетілмеген."),
  E(158, `**18. According to the passage, why are adult dogs easier to take care of than puppies?**\nI. Puppies need to learn how to walk nicely on a lead.\nII. It is harder for adult dogs to find a home than for puppies.`, ["I only.", "II only.", "I and II."], "C", "By the book's key: both statements are used in the passage.", "Кітап кілті бойынша: екі тұжырым да мәтінде қолданылған."),
  E(159, `**19. Based on the passage, which statement is false?**`, ["Puppies have a lot of energy.", "Puppies need a lot of attention.", "Adult dogs do not like to play.", "Adult dogs do not need to eat very much."], "C", "The text says most adult dogs wait for you to play.", "Мәтінде ересек иттер ойынға шақыруды күтеді делінген."),
  E(160, `**20. The author begins paragraphs 3 and 5 with "on the other hand". This phrase is used to…**`, ["highlight an example.", "contrast previous information.", "support the upcoming paragraph."], "B", "\"On the other hand\" contrasts with the previous paragraph.", "\"On the other hand\" алдыңғы ақпаратқа қарсы қояды."),
];
