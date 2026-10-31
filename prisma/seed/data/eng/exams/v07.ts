import { ex } from "../kit";
import type { EngPaper } from "../papers";

const T1 = `**Text 1: English worldwide**
1. Did you know that a quarter of all the people on Earth speak English? That's 1.5 billion people!
2. This is Tara. She's from New Zealand and English is her first language. About 450 million people speak English as a first language in countries like Britain, the USA, Australia and New Zealand.
3. Sandro is from Puerto Rico but now he lives in New York. His first language is Spanish, but he speaks English too. Thirty-six million people in the USA come from Latin America. They learn English as a second language because they live in an English-speaking country. About 375 million people across the world use English as a second language. In India, for example, there are over 350 different languages, so people often use English to communicate with each other.
4. Mohammed is Egyptian. He's learning English at school. About 750 million people learn English as a foreign language. They use it in their job, when they travel abroad, or when they want to understand English films or songs.
5. English is the main language in international business, in science and technology, in sport and pop music. ____________, nearly 70% of the world's scientific texts in English. On the Internet, over 60% of home pages and about 85% of emails are in English.
6. Language is a key to the outside world. It helps you to connect with other people. At the moment, about a billion people are learning English, so you aren't alone!`;
const T2 = `**Text 2**
Between 800 and 1100, the Vikings sailed across the Atlantic from Scandinavia to Greenland and North America. In 1000, Leif Eriksson landed on the coast of North America - nearly 500 years before Columbus. In 1961, researchers found part of a Viking village on the east coast of Canada.
The Silk Road connects China to Europe. From 500BC people travelled along the Silk Road to buy and sell things. Camels carried silk and spices to Europe, and returned with gold and silver. The road was 7,000 kilometres long and it could often be dangerous. Marco Polo was the first person to travel the whole way along the road. His journey started in Venice in 1271 and he returned home 24 years later!
The continent of America took its name from the Italian explorer Amerigo Vespucci. Vespucci explored South America in the 15th century, after Columbus's famous journey there.
In 1519, an expedition by the Portuguese explorer Ferdinand Magellan made the first voyage around the world. It lasted three years. But Magellan never completed the journey. He died in a battle in the Spice Islands before his ship returned home.
In 1911 Roald Amundsen from Norway became the first person to reach the South Pole. A British team of explorers, with their leader Robert Scott, were trying to get there at the same time. The Norwegian team arrived at the Pole on 14th December, 33 days before Scott's team. Scott and his four men all died on their return journey there.`;
const T3 = `**Text 3**
1. The first British ships arrived in Botany Bay in 1788 - they were 'prison ships' and the first settlers were convicts. Australia's first police force was a group of twelve of the best-behaved convicts! Later, immigrants from other European countries started to arrive. Today, nearly 25% of Australians were born in another country. The main language of Australia is English but there are also a lot of Italian, Greek, Cantonese and Arabic speakers.
2. The first Australians were Aboriginals. They lived in Australia 50,000 years before the Europeans. When the Europeans arrived, they killed many Aboriginals and took their land. Today, only one per cent of the population are Aboriginals, and many of them live in the cities.
3. Australia is the sixth largest country in the world. Eighty-five per cent of people live in the big cities, so you can travel for thousands of kilometres and never see anyone. Outside the cities, the land in Australia is mainly hot desert. This is called the outback. In some parts of the outback, there aren't any schools. So children learn from the School of the Air - by radio, email and television. And when people in the outback are ill, their doctor visits them by plane - the 'Flying Doctor'.
4. Australia produces a lot of the world's wool - about 70%. It's important to protect the sheep from dingoes (wild dogs), so there is a fence called the 'dingo fence'. It's 1.8 metres high and 5,531 kilometres long - and it's the world's longest fence.`;
const NOTICES = [
  ["No fishing, March – August", "Where can you see this notice?", ["in a restaurant", "by a lake", "at a market"], "B"],
  ["Slow down. Children crossing", "Where can you see this notice?", ["in a church", "at a theatre", "outside a school"], "C"],
  ["To the trains →", "Where can you see this notice?", ["at a bus station", "on a motorway", "at an underground station"], "C"],
  ["Prices per night: £10 a tent, £5 a person", "Where can you see this notice?", ["at a cinema", "in a hotel", "on a camp-site"], "C"],
  ["Water weekly and put in a sunny place.", "Where can you see this notice?", ["in a café", "in a swimming pool", "on a plant"], "C"],
] as const;

export const V07: EngPaper = {
  slug: "nis-english-variant-07", number: 7, group: "training", title: { ru: "Вариант НИШ 7", kk: "НЗМ 7-нұсқа" }, timeMinutes: 40, fixed: true,
  questions: [
    ex("1", `${T1}\n\n**1. Why the text is titled 'English Worldwide'?**`, ["because it informs us about people who speak English", "because it describes the ways of learning English language", "because it tells about the popularity of English language around the world", "because it shows how some students learn English language"], "C"),
    ex("2", "(Text 1) **2. \"It helps you to connect with other people\". What does It refer to in this sentence? (paragraph 6)**", ["a key", "a world", "a language", "people"], "C"),
    ex("3", "(Text 1) **3. What word is missing in paragraph 5?**", ["For example", "However", "Nevertheless", "Finally"], "A"),
    ex("4", "(Text 1) **4. Which paragraph answers the question \"Where do people use English mostly?\"**", ["paragraph 2", "paragraph 3", "paragraph 4", "paragraph 5"], "D"),
    ex("5", "(Text 1) **5. Which statement is wrong according to the text?**", ["1/4 of all the people in the world speak English", "Tara learns English as a foreign language.", "Sandro lives in America", "Mohamed's first language isn't English"], "B"),
    ex("6", `${T2}\n\n**6. What is the period of time when the Vikings sailed across the Atlantic?**`, ["About 300 years", "About 500 years", "About 800 years"], "A"),
    ex("7", "(Text 2) **7. The first person who travelled the whole way along the Silk Road:**", ["Leif Eriksson", "Marco Polo", "Robert Scott"], "B"),
    ex("8", "(Text 2) **8. What word is opposite to \"Start\"?**", ["Begin", "Continue", "Finish"], "C"),
    ex("9", "(Text 2) **9. When did Marco Polo return home to Venice?**", ["1271", "1283", "1295"], "C"),
    ex("10", "(Text 2) **10. What is the possible title for this passage?**", ["Explorers of the past", "Famous people", "The History of America"], "A"),
    ex("11", `${T3}\n\n**11. This text is for people interested in …**`, ["languages", "climate", "Australia"], "C"),
    ex("12", "(Text 3) **12. According to the paragraph 3 the word \"outback\" means:**", ["where a lot of people live", "where several people live", "where people live and work"], "B"),
    ex("13", "(Text 3) **13. What is the right order of the paragraphs?**", ["1,2,3,4", "3,2,1,4", "2,1,3,4", "3,2,4,1"], "B"),
    ex("14", "(Text 3) **14. Based on information in the passage, which of the following statement is false?**", ["Australia produces a lot of the world's wool - about 70%.", "Australia is the sixth largest country in the world.", "Many Europeans were killed by the Aboriginals"], "C"),
    ex("15", "(Text 3) **15. This text is from …**", ["a magazine.", "a diary.", "a school geography book."], "C"),
    ...NOTICES.map(([sign, q, opts, key], i) => ex(String(16 + i), `**${16 + i}. ${q}**\n\n**${sign}**`, [...opts], key)),
  ],
};
