import { ex, img, withFig } from "../kit";
import type { EngPaper } from "../papers";

const JOBS = ["Support worker", "Trainee hairdresser", "Wowee Magazine writer", "Model", "Coffee Beans café worker"];
const T1 = `**Text 1**
Martin had a terrible day yesterday. It was the day of his vacation to Spain but it was a nightmare. He left the house at 10 o'clock in the morning and caught a taxi to the airport.
Martin went with the check-in with his luggage. When the man who worked for the airline asked for his passport, Martin became very upset. Where was his passport? Martin realized he didn't have his passport with him. What a disaster!
He jumped back into the taxi and told the driver to take him home. The driver drove quickly and Martin arrived back at his house in twenty minutes.
He ran into the house and went into his bedroom. He found his passport on the bedside table and left the house again. But the taxi wasn't there! Where was the taxi!
Martin jumped up and down angrily. "I don't believe it. The taxi left!" he shouted. He ran down the street and looked for another taxi.
After a few minutes, Martin found another taxi and told the driver to take him to the airport as quickly as possible. The traffic on the roads was very bad and, unfortunately, Martin's taxi arrived at the airport very late. His plane left for Spain at 11.30 and Martin missed it. He went to speak to the airline. They promised to get him a seat on an evening flight and Martin went home on another taxi to wait.`;
const T2 = `**Text 2: Crystal Cruises – Luxury Every Day**
Come and sail on a Crystal Cruise ship. We have three ships: The Crystal Queen, The Crystal Princess, and The Crystal Palace.
Come and sail in luxury on cruises around the Caribbean Sea for 7 or 14 days.
Our seven-day cruise costs $2000 and our two-week cruise is $3500.
A typical one-week cruise:
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
Our ships carry over 2000 passengers and we have nearly 600 crewmembers.
So come on board today for the holiday of a lifetime!
Call immediately: 020-4455832`;
const T3 = `**Text 3: The Story of the Aral Sea** (from "NATIONAL GEOGRAPHIC news")
April 2010
One Sunday afternoon in Kazakhstan last August, a group of fishermen met for a celebration. They were on the shore of the North Aral Sea. They brought food to eat, and they had races and throwing contests. Afterwards, they relaxed, telling stories and singing songs about the Aral Sea and fishing and how much they loved both of these things.
Once, the Aral Sea in Central Asia was the fourth largest lake in the world. However, it has almost disappeared because of irrigation and long period with no rain. In 2005, the Kazakh government and the World Bank built a wall (to stop water flowing or moving) that separated the northern and southern parts of the sea. The northern part of the Aral Sea has started to recover. There are fish in the water and for the past four years, fishermen have come to celebrate.
Philip Micklin is a scientist who has been studying the sea since the 1980s. 'Nature can come back,' he says.
October 2014
Satellite images from this week show that the eastern part of the Aral Sea is completely dried up in 600 years, said expert Philip Micklin. 'It is likely the first time it has completely dried up in 600 years,' said expert Philip Micklin.
The Aral Sea once had an area of 67,300 square kilometres. Two of Central Asia's biggest rivers, the Amu Darya and the Syr Darya, flowed into the Sea. This means that it was actually a freshwater lake, not a seawater lake. But it was so big it was called a sea. The Aral Sea used to be a busy place. Almost 20 percent of the Soviet Union's fish came from here and 40,000 people used to work near the lake. As the lake dried up, it separated into different parts. The eastern part nearly dried up in 2009 but it recovered in 2010 after some rain. Now, it's completely dry.
June 2015
Yusup Kamalov is a scientist from Uzbekistan. I am standing with him looking at a huge desert. Except that it's not like any other desert – fifty years ago the southern shore of the Aral Sea was right where we stand. Now it is 80 kilometres away to the northwest. We set off to drive to the water. On the way, we pass oil and natural gas rigs standing on the sand. According to Kamalov, each year there are a few more. 'Can you imagine,' he says, 'that 40 years ago the water was 30 metres deep right here.' We finally arrive at the edge of the lake, which is so salty that no fish can live in it.
'This is what the end of the world looks like,' says Kamalov.`;
const T4 = `**Text 4**
Along with jogging and swimming, cycling is one of the best all-round forms of exercise. It can help to increase your strength and energy, giving you more efficient muscles and a stronger heart. But increasing your strength is not the only advantage of cycling.
Because you're not carrying the weight of your body on your feet, it's a good form of exercise for people with painful feet or backs. However, with all forms of exercise it's important to start slowly and build up gently. Doing too much too quickly can damage muscles that aren't used to working. If you have any doubts about taking up cycling for health reasons, talk to your doctor and ask his/her advice.
Ideally you should be cycling at least two or three times a week. For the exercise to be doing you good, you should get a little out of breath. Don't worry that if you begin to lose your breath, it could be dangerous and there must be something wrong with your heart. This is simply not true; shortness of breath shows that the exercise is having the right effect. However, if you find you are in pain then you should stop and take a rest.`;
const TF = ["True", "False", "Doesn't say"];

export const V10: EngPaper = {
  slug: "nis-english-variant-10", number: 10, group: "training", title: { ru: "Вариант НИШ 10", kk: "НЗМ 10-нұсқа" }, timeMinutes: 40, fixed: true,
  questions: [
    withFig(ex("1", "**Complete the recommendations with a job (jobs A–E).**\n**1. Sabina is studying English and has her own blog. She is a very sociable person, and is interested in music and fashion.**", JOBS, "C"), img("v10-jobs", "Jobs noticeboard A–E", 720)),
    withFig(ex("2", "**2. Dias has just finished school and is looking for a full-time job. He is sociable, likes working with his hands and cares about his appearance.**", JOBS, "B"), img("v10-jobs", "Jobs noticeboard A–E", 720)),
    withFig(ex("3", "**3. Temirlan enjoys helping people. He wants to make a difference to other people's lives. He is looking for opportunities to learn new things that will help him in his career.**", JOBS, "A"), img("v10-jobs", "Jobs noticeboard A–E", 720)),
    withFig(ex("4", "**4. Anna is a student and she is looking for flexible, part-time work. She doesn't want to work in a restaurant or shop. She is tall, beautiful and has her own unique look.**", JOBS, "D"), img("v10-jobs", "Jobs noticeboard A–E", 720)),
    ex("5", `${T1}\n\n**5. Where was Martin going on vacation?**`, ["Brazil", "Spain", "Italy", "Russia"], "B"),
    ex("6", "(Text 1) **6. How long did it take to get back to his house in the taxi?**", ["30 minutes", "an hour", "20 minutes", "half an hour"], "C"),
    ex("7", "(Text 1) **7. Why did he arrive late at the airport?**", ["someone has stolen his wallet", "he has lost his luggage", "the traffic was bad", "he overslept"], "C"),
    ex("8", `${T2}\n\n**8. Your cruise starts in The Bahamas.**`, ["True", "False", "Doesn't say"], "B"),
    ex("9", "(Text 2) **9. You have free day in …**", ["Antigua", "Caracas", "Haiti", "Barbados"], "D"),
    ex("10", "(Text 2) **10. There is a cinema on board …**", ["Each ship", "The Crystal Princess", "The Crystal Queen", "The Crystal Palace"], "A"),
    ex("11", "(Text 2) **11. The company only does cruises in the Caribbean**", ["True", "False", "Doesn't say"], "B"),
    ex("12", "(Text 2) **12. The cruise finishes in a different country**", ["True", "False", "Doesn't say"], "A"),
    ex("13", `${T3}\n\n**13. What period do the three news stories cover?**`, ["Three months", "Three years", "Four years", "Five years"], "D"),
    ex("14", "(Text 3) **14. What happened to the Aral Sea over the period of the three news stories?**", ["It got bigger", "It stayed the same", "It got smaller", "Became the smallest river in Kazakhstan"], "C"),
    ex("15", "(Text 3) **15. Which statement is true, according to the second news story?**", ["In 2009 there was no water in the eastern Aral Sea", "In 2014 there was no water in the eastern Aral Sea", "In 2010 there was no water in the eastern Aral Sea", "In 2011 there was no water in the eastern Aral Sea"], "B"),
    ex("16", "(Text 3) **16. According to the second news story, ...**", ["the Aral Sea is really a lake", "the water in the Aral Sea was salty", "water from the Aral Sea goes into two rivers", "there's a lot of activity on the Aral Sea nowadays"], "A"),
    ex("17", "**17. What does this notice say?**\n\n**Professor Gilroy's class cancelled today**", ["Professor Gilroy is teaching all day.", "Professor Gilroy will be late.", "Professor Gilroy has a new class.", "Professor Gilroy is not teaching today."], "D"),
    ex("18", `${T4}\n\n**18. This piece of writing is for**`, ["children", "doctors", "anyone", "sportsmen and sportswomen"], "C"),
    ex("19", "(Text 4) **19. People with back problems might going cycling because**", ["it is a good general form of exercise.", "weight is taken off the feet.", "you can't damage muscles quickly.", "you get a little out of breath."], "B"),
    ex("20", "**20. What does this sign say?**\n\n**ALL PRICES REDUCED THIS WEEK**", ["Everything is cheaper this week.", "No extra charges this week.", "Usual prices this week.", "Cheaper prices next week."], "A"),
  ],
};
