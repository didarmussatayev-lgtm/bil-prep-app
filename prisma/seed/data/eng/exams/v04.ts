import { ex } from "../kit";
import type { EngPaper } from "../papers";

const T1 = `**Text 1**
On Sunday, Tom gets up at 10 o'clock. Then he reads his newspaper in the kitchen. He has breakfast at 11.30 and then he telephones his mother in Scotland. In the afternoon, at 1.00, Tom plays tennis with his sister and after that, they eat dinner in a restaurant. At 6.00, Tom swims for an hour and then he goes by bike to his brother's house. They talk and listen to music. Tom watches television in the evening and drinks a glass of warm milk. He goes to bed at 11.30.`;
const T2 = `**Text 2: Crystal Cruises – Luxury Every Day**
Come and sail on a Crystal Cruise ship. We have three ships: The Crystal Queen, The Crystal Princess, The Crystal Palace.
Come and sail in luxury on cruises around the Caribbean Sea for 7 or 14 days.
Our seven-day cruise costs $2000 and our two-week cruise is $3500.
A typical one week cruise:
- Day One – departure from Miami
- Day Two – free day in Nassau, in The Bahamas
- Day Three – near Haiti
- Day Four – visit Puerto Rico and Antigua
- Day Five – free day in Barbados
- Day Six – free day in Port of Spain, Trinidad
- Day Seven – travel to Caracas, Venezuela
- Day Eight – fly home.
All food and drink is included in the price of your cruise (except for alcoholic drinks). Our cruise ships all have a casino, a cinema, a five-star restaurant, a theatre, a library and a fully equipped gymnasium.
If you prefer to go on a cruise in another part of the world, we also organize cruises in the Baltic Sea and the Mediterranean.
Our ships carry over 2000 passengers and we have nearly 600 crew members.
So come on board today for the holiday of a lifetime!
Call immediately: 020-4455832`;
const T3 = `**Text 3: Learning English**
Today, millions of people want to learn or improve their English but it is difficult to find the best method. Is it better to study in Britain or America or to study in your own country?
The advantages of going to Britain seem obvious. Firstly, you will be able to listen to the language all the time. You will be surrounded completely by the language wherever you go. Another advantage is that you have to speak the language if you are with other people. In Italy, it is always possible, in the class, to speak Italian if you want to and the learning is slower.
On the other hand, there are also advantages to staying at home to study. You don't have to make big changes to your life. As well as this, it is also a lot cheaper than going to Britain but it is never possible to achieve the results of living in the UK. If you have a good teacher in Italy, I think you can learn in a more concentrated way than being in Britain without going to a school.
So, in conclusion, I think that if you have enough time and enough money, the best choice is to spend some time in the UK. This is simply not possible for most people, so being here in Italy is the only viable option. The most important thing to do in this situation is to maximise your opportunities: to speak only English in class and to try to use English whenever possible outside the class.`;
const T4 = `**Text 4: Changes in Town**
I have returned to my hometown of Wilson Creek after an absence of 10 years.
So many things have changed around here. When I left Wilson Creek, there was a small pond on the right as you left town. They have filled in this pond and they have built a large shopping mall there. A new post office has also been built just across from my old school.
There is a baseball stadium on the outskirts of Wilson Creek which has been changed completely. They have now added a new stand where probably a few thousand people could sit. It looks really great.
The biggest changes have taken place in the downtown area. They have pedestrianised the centre and you can't drive there anymore. A European-style fountain has been built and some benches have also been added along with a grassy area and a new street cafe.
My street looks just the same as it always has but a public library has been built in the next street along. There used to be a great park there but they have cut down all the trees which is a pity. The library now has a large green area in front of it but it's not the same as when the park was there.
Another improvement is the number of new restaurants that have opened in Wilson Creek. A Chinese and an Italian restaurant have opened in the town centre and a Mexican restaurant has opened near my home. Which is where I am going tonight!`;
const TF = ["True", "False", "Not given"];

export const V04: EngPaper = {
  slug: "nis-english-variant-04", number: 4, group: "training", title: { ru: "Вариант НИШ 4", kk: "НЗМ 4-нұсқа" }, timeMinutes: 40, fixed: true,
  questions: [
    ex("1", `${T1}\n\n**1. Who does he call in the morning?**`, ["His sister", "His brother", "His mother"], "C"),
    ex("2", "(Text 1) **2. How long does Tom swim for?**", ["One hour", "Two hours", "Six hours"], "A"),
    ex("3", `${T2}\n\n**3. Your cruise starts in The Bahamas.**`, TF, "B"),
    ex("4", "(Text 2) **4. You can go on a cruise for two weeks.**", TF, "A", "B"),
    ex("5", "(Text 2) **5. There are three different ships in the Crystal Cruises company.**", TF, "A"),
    ex("6", "(Text 2) **6. There is a cinema on board each ship.**", TF, "A"),
    ex("7", "(Text 2) **7. The cruise finishes in a different country.**", TF, "A"),
    ex("8", "(Text 2) **8. You can keep fit while you are on board the cruise ship.**", TF, "A"),
    ex("9", "(Text 2) **9. The company only does cruises in the Caribbean.**", TF, "B", "A"),
    ex("10", `${T3}\n\n**10. What is the article about?**`, ["How many people learn English.", "The best way to learn English.", "English schools in England and America."], "B"),
    ex("11", "(Text 3) **11. What is one of the advantages of going to the UK to learn English?**", ["There are no Italians in Britain.", "You will have to speak English and not your language.", "The language schools are better."], "B"),
    ex("12", "(Text 3) **12. What is one of the advantages of staying in your country to learn English?**", ["The teachers aren't very good in Britain.", "You have to work too hard in Britain.", "Your life can continue more or less as it was before."], "C", "B"),
    ex("13", "(Text 3) **13. People who don't have a lot of time and money should…**", ["Learn English in Britain.", "Try and speak English in class more often.", "Go to Italy to learn English."], "B"),
    ex("14", `${T4}\n\n**14. Jake's school doesn't exist anymore.**`, TF, "B"),
    ex("15", "(Text 4) **15. They have improved the baseball stadium.**", TF, "A"),
    ex("16", "(Text 4) **16. It's only possible to reach the downtown area on foot.**", TF, "A"),
    ex("17", "(Text 4) **17. The buildings in the centre of the town look European.**", TF, "A"),
    ex("18", "(Text 4) **18. Jake's street hasn't changed much.**", TF, "A"),
    ex("19", "(Text 4) **19. He is sad about the park being ruined.**", TF, "A"),
    ex("20", "(Text 4) **20. Jake is going to eat Italian food tonight.**", TF, "B"),
  ],
};
