import { ex } from "../kit";
import type { EngPaper } from "../papers";

const T1 = `**Text 1**
Today's grandparents are joining their grandchildren on social media, but the different generations' online habits couldn't be more different. The over-55s are joining Facebook in increasing numbers, meaning that they will soon be the site's second biggest user group, with 3.5 million users aged 55–64 and 2.9 million over-65s.
Sheila, aged 59, says, 'I joined to see what my grandchildren are doing, as my daughter posts videos and photos of them. It's a much better way to see what they're doing than waiting for letters and photos in the post. That's how we did it when I was a child, but I think I'm lucky I get to see so much more of their lives than my grandparents did.'
Ironically, Sheila's grandchildren are less likely to use Facebook themselves. Children under 17 are leaving the site – only 2.2 million users are under 17 – but they're not going far from their smartphones. Chloe, aged 15, even sleeps with her phone. 'It's my alarm clock so I have to,' she says. 'I look at it before I go to sleep and as soon as I wake up.'
Unlike her grandmother's generation, Chloe's age group is spending so much time on their phones at home that they are missing out on spending time with their friends in real life. Sheila, on the other hand, has made contact with old friends from school she hasn't heard from in forty years. 'We use Facebook to arrange to meet all over the country,' she says. 'It's changed my social life completely.'
Teenagers might have their parents to thank for their smartphone and social media addiction as their parents were the early adopters of the smartphone. Peter, 38 and father of two teenagers, reports that he used to be on his phone or laptop constantly. 'I was always connected and I felt like I was always working,' he says. 'How could I tell my kids to get off their phones if I was always in front of a screen myself?' So, in the evenings and at weekends, he takes his SIM card out of his smartphone and puts it into an old-style mobile phone that can only make calls and send text messages. 'I'm not completely cut off from the world in case of emergencies, but the important thing is I'm setting a better example to my kids and spending more quality time with them.'
Is it only a matter of time until the generation above and below Peter catches up with the new trend for a less digital life?`;
const T3 = `**Text 3**
Hello Caroline,

I want to thank you for the lessons. I work in France, teaching English to adults. Your lessons are fun and a great help for my students. I use them every time when a student has speaking and writing problems. I am looking forward to the future lessons. Thanks very much.

Christine`;
const T4 = `**Text 4: Modern Bath**
Read some interesting facts about the city of Bath in Great Britain.
Bath is a lovely city and it is popular among tourists all year round. There are so many things to see and do in Bath! There are museums and art galleries, and most tourist attractions (such as the Roman Baths) have their own museums. There are five theatres in Bath. One of them is called The Egg. It's styled as an egg and was specially built for the use of young people. The city holds lots of festivals such as an international music festival, a literature festival and even a beer festival.`;
const T5 = `**Text 5**
1. Do you play computer games on the Internet? Do you send e-mail messages to your friends? You can get all kinds of information there. People use the Internet to work at home. Scientists use the Internet to help them do research.
2. The Internet is a system that connects computer networks. It links millions of computers all over the world. It allows your computer to get information stored on other computers far away. Some networks have only a few computers. Some networks have thousands of computers. Computers connect to the Internet through telephone and cable systems.
3. Millions of people use the Internet every day. In 1981, only 213 computers were connected to the Internet. By 2003, more than 216 million computers were connected to the Internet. No one knows for sure how many people use the Internet. Computer experts thought that there were 61 million Internet users worldwide at the end of 1996. There may have been from 700 million to 900 million users by the end of 2013.`;
const T6 = `**Text 6**
Come and join our lunchtime yoga class with experienced yoga teacher Divya Bridge!
When? Every Tuesday at 1.30 p.m.
Where? Meeting Room 7
How much? £10 for four 30-minute classes.
What to bring? Comfortable clothes. Divya will provide the yoga mats.
How to join? Write to Sam at Sam.Holden@example.com
We can only take a maximum of 20 in the room, so book now!`;
const TF = ["True", "False", "Not given"];

/** В книге вопросы 7–12 открытые (образовать существительное от глагола: learn, suggest, communicate, mean, pronounce, motivate) — в тестовый формат не включены. */
export const V05: EngPaper = {
  slug: "nis-english-variant-05", number: 5, group: "training", title: { ru: "Вариант НИШ 5", kk: "НЗМ 5-нұсқа" }, timeMinutes: 40, fixed: true,
  questions: [
    ex("1", `${T1}\n\n**1. More people aged 55 or more use Facebook than people aged 65 or more.**`, TF, "A"),
    ex("2", "(Text 1) **2. Grandparents typically use Facebook less than their grandchildren.**", TF, "B"),
    ex("3", "(Text 1) **3. Sheila feels grateful for social media.**", TF, "A"),
    ex("4", "(Text 1) **4. Peter found his own smartphone use affected how he felt about how much his children used their phones.**", TF, "A"),
    ex("5", "(Text 1) **5. Peter has changed how much he uses his phone during the working day.**", TF, "B"),
    ex("6", "(Text 1) **6. Peter feels that the changes make him a better parent.**", TF, "A"),
    ex("13", `${T3}\n\n**13. Why does Christine write the letter?**`, ["Because she enjoys Caroline's work.", "Because she wants to improve her English.", "Because she likes listening to her pupils.", "Because she prefers to teach teenagers."], "A"),
    ex("14", `${T4}\n\n**14. Where can you find this kind of text?**`, ["In the advertisement for holidays", "In the booklet for tourists", "In the invitation card to a concert", "In the program of a TV show"], "B"),
    ex("15", `${T5}\n\n**15. "Do you play computer games on the Internet? Do you send e-mail messages to your friends?" (paragraph 1)\nWhy does the author ask these questions?**`, ["He wants readers to publish their answers on the site.", "He wants to draw our attention to read the text.", "He wants us to find answers to the questions in the text."], "B"),
    ex("16", "(Text 5) **16. What does the word \"It\" refer to in paragraph 2?**", ["a computer", "an online system", "the Internet"], "B"),
    ex("17", "(Text 5) **17. What is the main idea of paragraph 3?**", ["Scientists are still guessing the exact number of computers.", "The computers connected to the Internet have a rich history.", "The number of computer users is increasing"], "C"),
    ex("18", "(Text 5) **18. Which paragraph answers the question \"What is the Internet?\"?**", ["Paragraph 1", "Paragraph 2", "Paragraph 3"], "B"),
    ex("19", `${T6}\n\n**19. The yoga class is once a week.**`, TF, "A"),
    ex("20", "(Text 6) **20. You need to call Sam Holden if you want to join the class.**", TF, "B"),
  ],
};
