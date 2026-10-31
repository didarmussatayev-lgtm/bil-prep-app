import { ex } from "../kit";
import type { EngPaper } from "../papers";

const T1 = `**Text 1**
Many people know about James Bond. He is the most famous secret agent in the world. But what about the author of his stories, Ian Fleming?
Ian Fleming was born in London, on May 28th, 1908. His family was rich, but Ian's father died when the boy was only 9 years old. His brothers enjoyed going to school but Ian hated it. After the army he got a job as journalist.
When the Second World War started Ian Fleming started working in the world of spies and went on secret missions in the USA and North Africa. After the war he wrote his first book about James Bond – "Casino Royale". Fleming wrote 14 books between 1953 and 1964. The writer died in 1964, just before the publication of his last novel "The man with the golden gun".`;
const T2 = `**Text 2**
Ireland is famous as a country without any snakes. Legend has it that Saint Patrick banished them all. But the real reason is that Ireland is an island, and snakes have not lived there at least since the Ice Age. Ireland is close to the larger island of Great Britain, in northwestern Europe. The smaller northern part of the island is called Northern Ireland and is part of the United Kingdom. Northern Ireland's capital is Belfast.
The larger part of the island is the Republic of Ireland and is usually simply called Ireland. Dublin is the capital of this independent country. Because of its location in the Atlantic Ocean, Ireland has a warm climate most of the year. It rains pretty often, with the hilly parts of the island getting nearly 255 cm of rain every year. The land is covered with fields and green mosses. Some people call Ireland the Emerald Isle because it is so magnificently green.`;
const T3S = `**Text 3 (Sushi)**
Sushi was first made over two thousand years ago in Southeast Asia. Back then, people used to put salt on the fish to keep it from going bad. They would put the salted fish in a container with rice. After a few month, the fish could be eaten but the rice was thrown away. This sushi became popular all over China and it was introduced into Japan. The Japanese preferred to eat rice together with fish, so they ate the rice and fish together while the fish was still raw.
Later, in the Edo period, Japanese people started making special rice for sushi. They combined rice with vinegar and vegetables. At the beginning of the 19th century food stalls started selling sushi in Tokyo. It was very popular. Then in the 20th century, chefs from Tokyo started moving to other parts of Japan. They helped to make sushi popular all over Japan. Recently sushi has become a popular food in many other countries. Sushi is now eaten every day by millions of people all over the world.`;
const T3J = `**Text 3 (Jeans)**
Jeans have become one of the most worn pieces of clothing in the world. Everybody wears them, from the rural farmer to the urban lawyer and from models to housewives. But why have jeans become so popular. You'll get many answers. For some people they look cool, for others jeans are simply comfortable.
Jeans were first designed as durable trousers for farm workers and miners in the states of the American west.
A Nevada tailor, Jacob Davis, had the idea of using copper bolts at the corner of the pockets to make them stronger. They became popular instantly and soon many people bought them.
Although Davis knew that he had a great product which many people wanted to buy, he didn't have the money to patent it. He asked Levi Strauss, who supplied him with cloth, to help him out. The two worked together and started making jeans out of denim, which was more comfortable and could be easily stretched. It also became softer as it got… They were dyed with indigo because it did not go through the cloth like other dyes do.
At first jeans were worn only by workers, especially in factories. In the eastern part of the US jeans were hardly worn at all. They were associated with rural people and the working class. But when rich easterners went on holidays to escape every day life they often put on jeans.
James Dean and Marlon Brando made them popular in movies and everyone wanted to wear them. Jeans became a symbol of the youth rebellion during the 1950s and 1960s. College students started to wear them as a protest against the Vietnam War and establishment. The new trousers were banned in American schools and sometimes in theatres and cinemas.`;
const T4 = `**Text 4**
1. A strange oasis of fantastic skyscrapers emerges from the desert floor. The city sprawls over the sand and creeps out to the sea, man-made islands dot the coast line. Tourism, business and construction keep the city busy, even at night. Dubai, once a Bedouin outpost displays capitalism at its peak.
2. The discovery of oil in 1966 turned the city from a quiet fishing and pearl-exporting town to a rich oil sheikdom. But because its oil supplies are slowly running out, the royal family has decided to make the emirate a financial centre and tourist destination. Since the 1980s they have been investing and pouring money into Dubai. The strategy has worked. Today the emirate gets only very little money from oil but its gross domestic product has exploded. Dubai is perhaps best known for its seven star hotel, the Burj Al Arab, a sail shaped luxury accommodation only has suites. In the 2008 construction of the Burj Dubai, the tallest building in the world, will be completed. It consists of a palm-shaped island of apartments and villas that extend out to the Persian Gulf and even can be seen from space.
3. Soon Dubai will boast the world's largest mall, longest indoor skiing slope and the biggest theme park. There are even plans to build a group of buildings that look like chess pieces on a chess board.
4. Sheik Mohammed wants Dubai to become the Middle East's number one financial centre, something like a mini New York or London – ready to store the vast wealth of the Persian Gulf.`;

export const V02: EngPaper = {
  slug: "nis-english-variant-02", number: 2, group: "training", title: { ru: "Вариант НИШ 2", kk: "НЗМ 2-нұсқа" }, timeMinutes: 40, fixed: true,
  questions: [
    ex("1", `${T1}\n\n**1. Who is the author of the James Bond stories?**`, ["Jack London", "George Orwell", "Ian Fleming", "Oscar Wilde"], "C"),
    ex("2", "(Text 1) **2. After the army Ian Fleming got a job as …**", ["Oficer", "Journalist", "Soldier", "Secret agent"], "B"),
    ex("3", "(Text 1) **3. What influenced Ian Fleming to write the James Bond stories**", ["Army", "Secret agent stories", "School", "Working on a secret mission"], "D"),
    ex("4", `${T2}\n\n**4. Legend has it that Saint Patrick drove all the … from the island.**`, ["frogs", "flies", "snakes", "spiders"], "C"),
    ex("5", "(Text 2) **5. What is the climate of Ireland most of the year?**", ["warm", "cold", "hot", "dry"], "A"),
    ex("6", `${T3S}\n\n**6. What is the origin of sushi?**`, ["Northern Asia", "Southern Europe", "East Asia", "Southern Asia"], "D"),
    ex("7", "(Text 3, Sushi) **7. Why people used to put salt on the fish?**", ["to make it salty", "to dry fish", "to keep it from going bad", "to not stored for a long time"], "C"),
    ex("8", "(Text 3, Sushi) **8. In which period Japanese people started making special rice for sushi?**", ["stone period", "ice age", "Edo period", "Japanese period"], "C"),
    ex("9", "(Text 3, Sushi) **9. When chefs from Tokyo started moving to other parts of Japan?**", ["in 21th century", "in 20th century", "in 19th century", "at the end of the 19th century"], "B"),
    ex("10", "(Text 3, Sushi) **10. With what did they combine rice?**", ["with vinegar and vegetables", "with meat and eggs", "with vinegar and meat", "with vegetables and peas"], "A"),
    ex("11", `${T3J}\n\n**11. Why jeans are so popular?**\n1. They are comfortable\n2. They are light`, ["1", "2", "1 and 2", "neither"], "A"),
    ex("12", "(Text 3, Jeans) **12. What information is missing in the text?**", ["jeans", "jeans in another countries", "wearing jeans in institution", "why jeans popular"], "B"),
    ex("13", "(Text 3, Jeans) **13. Who was first made jeans for?**", ["for urban lawyers", "for housewives", "for farm workers", "for cowboys"], "C"),
    ex("14", "(Text 3, Jeans) **14. Why designers decided to use copper bolts?**", ["to make jeans stronger", "to make jeans hard", "to make jeans durable", "to make jeans heavy"], "A"),
    ex("15", "(Text 3, Jeans) **15. Why did Jacob Davis ask Levi Strauss help him?**", ["Because he didn't have enough time.", "He didn't want to work alone.", "He didn't have the money to patent it.", "He didn't ask Jacob Leviss."], "C"),
    ex("16", `${T4}\n\n**16. Sheik Mohammed wants Dubai to become the Middle East's number one financial centre, like ______ and ______?**`, ["Capital of England, New York", "New Castle, London", "Capital of the USA, Capital of London", "New Orleans, London"], "A"),
    ex("17", "(Text 4) **17. What kind of place was Dubai before finding oil?**", ["fishing town", "fishing and pearl village", "fishing and pearl-exporting town", "fish-exporting town"], "C"),
    ex("18", "(Text 4) **18. Which paragraph tells about XX century?**", ["5", "2", "3", "4"], "B"),
    ex("19", "(Text 4) **19. Which is true?**\n1. Burj Dubai completed in 2008\n2. Dubai is financial centre like London", ["1", "2", "1 and 2", "neither"], "A"),
    ex("20", "(Text 4) **20. Choose right order of information in the text?**\n1. Discovering oil\n2. Financial centre\n3. Tallest building\n4. Hotels", ["1,4,3,2", "1,3,4,2", "1,2,3,4", "1,4,2,3"], "A"),
  ],
};
