import { ex, img, withFig } from "../kit";
import type { EngPaper } from "../papers";

const T1 = `**Text 1**
Black Friday is the day after the American holiday of Thanksgiving, which is celebrated on the fourth Thursday of November. Because it is a holiday in the United States, it has long been a popular day for consumers to start shopping for Christmas. Over the last 20 years big retailers have started to offer discounts and bargains on this day, and it has become more and more popular. Last year, people in the USA spent an estimated $54.7 billion between Black Friday and Cyber Monday (the Monday after Thanksgiving, when people often buy more online). The idea of Black Friday has also spread around the world. For example, in 2017, people in the UK spent the equivalent of $10.3 billion, in Germany $7.6 billion and in France $6.2 billion.`;
const T2 = `**Text 2**
Many of us love to get a bargain, but some feel that events like Black Friday encourage people to buy things that they don't really need and can't afford. Many people seem to completely lose control of both their spending and their tempers. It is easy to find video online of customers physically fighting each other over bargains. It is also argued that Black Friday is bad for small shopkeepers, who cannot afford to offer the kinds of price cuts that the big companies can.`;
const T3 = `**Text 3**
Instead of taking the opportunity to buy as much as possible on Black Friday, you could do the opposite and buy absolutely nothing. Since 1997, Buy Nothing Day has been held on the same day as Black Friday. The rules are simple. Just don't buy anything at all for 24 hours. Many people are surprised how difficult this actually is. The aim is to make people think more about their spending and to make better decisions about what they buy and where they buy it from.`;
const T4 = `**Text 4: Musical bumps**
(a web page)
Musical Bumps – This is a fun game to play at a party!
1. The children dance to music.
2. The music stops.
3. The children sit down quickly.
4. The last child to sit down is 'out' (they stop playing).
5. The children stand up and dance again.
6. They play until there is only one child dancing. He or she is the winner!`;
const T5 = `**Text 5**
From: Nathalie
Subject: Hello Kate
Hi Kate
Hello from Paris!
I hope you are well. I am writing because I want to tell you about something that happened last week!
I went to a town called Menton in the south of France with my family. It is a very colorful place near the beach, and there are lots of boats there. It is winter now, but in Menton it was warm, not cold, and there was a bright blue sky.
We went to Menton because there is a big festival there every year. People use oranges and lemons to make big sculptures like this turtle! We arrived there at midday. First we went to have lunch in a restaurant. I did not eat much, because I was very excited.
Next, we went to see the sculptures. My favourite ones were the sculptures of buildings, because they are so big. I didn't like the small sculptures, because they were boring.
We were enjoying the festivals. But then something happened. My little Brother took one of the oranges from a sculpture, and it fell down! All oranges and lemons fell on the ground! I didn't know what to do!
People didn't look happy, and my parents had to say sorry a lot. But we helped to pick up all oranges and lemons, and other people helped too. After a few minutes, the sculptures looked OK again.
Finally we went to get ice-cream. Can you guess what flavour? Orange, of course!`;
const T6 = `**Text 6: Kate Mackintosh wins swimming competition!**
Last weekend was the school swimming competition. It happens every year, and lots of students join and try to win a race. So, on Saturday children and parents went to the swimming pool to enjoy the competition.
9. When we got to the pool, lots of children were getting ready, and their parents were watching from the side. It was a sunny day and everyone was feeling excited!
10. The most exciting race was the 4 x 100 m freestyle relay. A relay is a team race, where different people each do a different part of the race and work together. In the relay there were six teams.
11. When the last part of the relay race began, Ms Green's class were in last place. Nobody believed that they could win. But Kate Mackintosh started so fast that she was in front of two other teams after only a few seconds! Suddenly, she was in second place, with just 10 m to go!
12. Everyone was shouting for Kate to win, and right at the end of the race she kicked hard and finished first! She was the winner, and Ms Green's class were the relay winners!

To the questions 9–12 MATCH the numbers above with the correct headings:
A. From Last to Second  B. The Winner  C. A Different Kind of Race  D. Before the Races`;
const T7 = `**Text 7**
13. Or, how about staying at a hotel on the moon, or a moon hotel here? The hotel in Azerbaijan will be round like the moon and look like a Star Wars film set. It will have 35 floors and have 382 large rooms to choose from.
14. If you like the idea of an iPod, how about trying a hotel pod? The idea is that you could pack and take your bedroom with you in your suitcase and go to any place in the world with all the things you usually have from home.
15. People who don't like the London Eye aren't going to book into this 185 metre tall building in Abu Dhabi. But if you aren't afraid of being up high, you could sleep in a hotel in the shape of a diamond ring!
16. You could stay on a private island in Fiji, at a hotel with water all around it, and fish swimming over your room. And the first 1000 people to visit the hotel will have their names on two monuments forever!

Find the correct description to the pictures below (A–D):`;
const T8 = `**Text 8: The Empire State Building**
When exploring New York City, there are several different options for activities during a day trip. Some visitors come to see a show, visit art museums, or simply to shop in many of the city's high-end retailers. However, many tourists simply come to New York City for the sightseeing. One of the most visited landmarks in New York City is the Empire State Building.`;
const T9 = `**Text 9**
The Empire State Building, constructed in 1931, is a 102-story skyscraper, the ninth highest building in the world, and the fourth tallest structure in the United States, located in Midtown, Manhattan. This skyscraper is an iconic symbol of the city, having been featured in over 90 popular movies (as of 2018) throughout film history. Tourists come from all over the world to visit this building and view the city from its famous observation decks.
Matthew, an enthusiast of historic buildings, was excited for this trip to New York City because he has always appreciated architectural design. Matthew purchased a ticket that granted him access to beautiful 360-degree views of the city. The ticket included an elevator ride that stopped at two different vantage points, one at the 86th floor and the other at the rooftop observatory on the 102nd floor. From these observation decks, Matthew took incredible photographs of the entire New York City skyline. The rooftop views granted Matthew perfect aerial perspectives of Central Park, the Brooklyn Bridge, Times Square, the Statue of Liberty, and many other important city landmarks.`;
const TF = ["True", "False", "Not given"];

export const V08: EngPaper = {
  slug: "nis-english-variant-08", number: 8, group: "training", title: { ru: "Вариант НИШ 8", kk: "НЗМ 8-нұсқа" }, timeMinutes: 40, fixed: true,
  questions: [
    ex("1", `${T1}\n\n**1. Black Friday first became popular as a shopping day because:**`, ["There have always been special offers on that day", "Many people in the United States don't work or go to school on this day", "It is the day before Thanksgiving, an important holiday", "It is the most important day for Americans"], "B", "A"),
    ex("2", `${T2}\n\n**2. Why do some people think Black Friday is out of control?**`, ["Small shopkeepers offer discounts too.", "Some people physically fight with the retailers.", "People spend more than they can really afford.", "They want to have more discounts on this day."], "C"),
    ex("3", `${T3}\n\n**3. To celebrate Buy Nothing Day, you shouldn't go near a shopping centre.**`, TF, "C"),
    ex("4", "(Text 3) **4. To celebrate «Buy Nothing Day», the rules are that you:**", ["Don't buy anything at all", "Only buy from small shopkeepers", "Think carefully about what you are buying", "To get many things cheaper than usu"], "A"),
    ex("5", `${T4}\n\n**5. You play musical bumps at a cinema.**`, TF, "B"),
    ex("6", "(Text 4) **6. The children sing to music.**", TF, "B"),
    ex("7", `${T5}\n\n**7. Where does Natalie live?**`, ["In Menton", "In the south of France", "Not given", "In Paris"], "D"),
    ex("8", "(Text 5) **8. Lots of people helped to put the sculpture back together.**", ["True", "False", "Doesn't say"], "A"),
    ex("9", `${T6}\n\n**9. Which heading matches paragraph 9?**`, ["From Last to Second", "The Winner", "A Different Kind of Race", "Before the Races"], "D"),
    ex("10", "(Text 6) **10. Which heading matches paragraph 10?**", ["From Last to Second", "The Winner", "A Different Kind of Race", "Before the Races"], "C"),
    ex("11", "(Text 6) **11. Which heading matches paragraph 11?**", ["From Last to Second", "The Winner", "A Different Kind of Race", "Before the Races"], "A"),
    ex("12", "(Text 6) **12. Which heading matches paragraph 12?**", ["From Last to Second", "The Winner", "A Different Kind of Race", "Before the Races"], "B"),
    withFig(ex("13", `${T7}\n\n**13. Which picture (A–D) matches paragraph 13?**`, ["A", "B", "C", "D"], "B"), img("v08-hotels", "Pictures A–D of unusual hotels", 640)),
    withFig(ex("14", "(Text 7) **14. Which picture (A–D) matches paragraph 14?**", ["A", "B", "C", "D"], "C"), img("v08-hotels", "Pictures A–D of unusual hotels", 640)),
    withFig(ex("15", "(Text 7) **15. Which picture (A–D) matches paragraph 15?**", ["A", "B", "C", "D"], "A"), img("v08-hotels", "Pictures A–D of unusual hotels", 640)),
    withFig(ex("16", "(Text 7) **16. Which picture (A–D) matches paragraph 16?**", ["A", "B", "C", "D"], "D"), img("v08-hotels", "Pictures A–D of unusual hotels", 640)),
    ex("17", `${T8}\n\n**17. Which is not a popular reason that tourists come to New York City?**`, ["Watching a performance", "Shopping", "Sightseeing", "Relaxing on its beaches"], "D"),
    ex("18", `${T9}\n\n**18. Why was Matthew excited for his trip to the Empire State Building?**`, ["He received a free ticket to the rooftop observatories", "He works as a photographer of city skylines", "He had never been to a city before", "He appreciates architecture and historical buildings"], "D"),
    ex("19", "(Text 9) **19. How did Matthew arrive to the top of the building?**", ["He rode a helicopter", "He walked up the stairs", "He took an elevator", "He climbed the building"], "C"),
    ex("20", "(Text 9) **20. Which is not a landmark that Matthew clearly viewed from the observatory?**", ["Times Square", "The Statue of Liberty", "JFK International Airport", "The Brooklyn Bridge"], "C"),
  ],
};
