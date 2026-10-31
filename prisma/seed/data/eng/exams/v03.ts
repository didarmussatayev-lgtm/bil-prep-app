import { ex } from "../kit";
import type { EngPaper } from "../papers";

const T1 = `**Text 1: The Frog and the Ox**
Many years ago there was a magnificent ox. One day, when he was taking an afternoon walk, a poorly dressed and unimportant looking frog saw him. The frog felt envy toward the beautiful, strong ox. But the frog yelled to his friends, "Look at this ox! But he is no better than I am, if I tried." The frog swelled up to twice his normal size. "Am I the size of this big ox now?" he asked his frog friends. "You will have to be much bigger to be his size," they said. The frog swelled up even bigger. "How about now?" he asked his friends. "No, but you better not swell up more or you will kill yourself," they warned.
But the frog wanted to be as big as the ox and puffed, and puffed. He never got as big as the ox because he burst first.`;
const T2 = `**Text 2**
Mrs Smith is going shopping with her son. They are looking for a present for Mr Smith's birthday. Mrs Smith wants to buy him a new camera and Tom wants to buy him a jumper.
They drive to the department store on the high street. Mrs Smith uses the escalator to go to the Electrical Department on the third floor and Tom takes the stairs up to the Men's Clothing Department on the first floor.
When she gets to the Electrical Department she finds that cameras are sold in the Photography Department on the ground floor. She takes the elevator down and asks the sales assistant there for some help. She doesn't know much about cameras and needs some advice. He recommends an automatic camera by Olympus, but it is too expensive. She asks him if he has anything a little cheaper and he tells her about a special offer on the Pentax range. It still seems expensive so she thanks the assistant and decides to shop around first.
Meanwhile, Tom is looking at the jumpers. He only has £10 to spend so he can't afford most of them. He sees his mother and they decide to go to the smaller shops round the corner.`;
const T3 = `**Text 3: London**
London is the capital of Great Britain. It is situated in the southeast of England on the River Thames and there are lots of bridges across the Thames. The most famous of these bridges is Tower Bridge. The machinery which draws up the bridge when a ship passes under it is hidden in the two towers. Near Tower Bridge, on the north bank of the Thames there is the Tower Of London. It is a big castle, its oldest part, White Tower, dates back to the times of William the Conqueror. Back in history The Tower served as a prison – now it is one of London's main tourist attractions. Tourists are guided by "Beefeaters" in historic uniforms. The Crown Jewels are on display there.
Another magnet for tourists is St. Paul's Cathedral. It is Sir Christopher Wren's masterpiece. Like many other churches it was built after the great fire had destroyed big parts of London in 1666. It is 110 metres high and 627 steps lead up to the Whispering Gallery in the dome. In 1981 the royal wedding between Prince Charles and Lady Diana was celebrated there.
The London home of the Queen is Buckingham Palace where you can see the "Changing of the Guards". The coronation of the Kings and Queens takes place in Westminster Abbey. Near this enormous church there are the Houses of Parliament, the seat of the British government. They consist of a group of buildings, among them St. Stephen's Tower, the famous clock tower housing Big Ben, one of the world's biggest bells.
Not far from the Houses of Parliament there is Trafalgar Square with Lord Nelson's Column, erected in the memory of Admiral Nelson, who won against the Spanish in the Battle of Trafalgar.
London is also famous for its parks. There is Hyde Park, there is St. James's Park, which is the oldest and there is Regent's Park, which houses the London Zoo. In former times all the parks were royal gardens.
Apart from sightseeing tourists also love shopping in London. You will find the big stores in Oxford Street and the smaller shops in the little side streets.
At night the West End offers all kinds of entertainment like music, theatre or cinema.`;
const T4 = `**Text 4**
A lion was very angry with a gnat that kept flying and buzzing around his head. The gnat would not quit bothering the lion. "Do you think that you, the great king of all the animals, can make me scared?" the gnat said to the poor lion. The lion just kept trying to hit the gnat with his big paw. All he did was scratch himself with his great claws. The gnat laughed and flew between the big paws and stung the lion on the nose. He then buzzed away laughing at how he had stung the great lion. However, he was so busy thinking of how he would boast that he did not see the spider web. He got stuck in the web of a little spider and that was the end of him.`;
const T5 = `**Text 5**
A young mouse returned to his mother after going out of their hole for the very first time. "Mother, I came across two most wonderful animals. One was beautiful and gentle with velvety fur and a fine wavy tail; the other was a frightening monster with pieces of red skin on its head and under its chin that moved with every step it took. Then it let out a terrible sound just as I was going to talk to the kind-looking one." "Oh, my son," said the mother mouse, "your monster was a harmless bird who was trying to warn you but the other was a blood thirsty cat who would have eaten you up in a minute."`;
const T6 = `**Text 6: The Rabbit and the Turtle**
One day a rabbit was boasting about how fast he could run. He was laughing at the turtle for being so slow. Much to the rabbit's surprise, the turtle challenged him to a race. The rabbit thought this was a good joke and accepted the challenge. The fox was to be the umpire of the race. As the race began, the rabbit raced way ahead of the turtle, just like everyone thought. The rabbit got to the halfway point and could not see the turtle anywhere. He was hot and tired and decided to stop and take a short nap. Even if the turtle passed him, he would be able to race to the finish line ahead of him. All this time the turtle kept walking step by step. He never quit no matter how hot or tired he got. He just kept going. However, the rabbit slept longer than he had thought and woke up. He could not see the turtle anywhere! He went at full-speed to the finish line but found the turtle there waiting for him.`;

export const V03: EngPaper = {
  slug: "nis-english-variant-03", number: 3, group: "training", title: { ru: "Вариант НИШ 3", kk: "НЗМ 3-нұсқа" }, timeMinutes: 40, fixed: true,
  questions: [
    ex("1", `${T1}\n\n**1. Magnificent means**`, ["great and good looking.", "poor.", "proud."], "A"),
    ex("2", "(Text 1) **2. The frog was**", ["poorly dressed.", "green.", "magnificent."], "A"),
    ex("3", "(Text 1) **3. What emotion did the frog feel toward the ox?**", ["pride", "envy", "fear"], "B"),
    ex("4", "(Text 1) **4. The frog made himself bigger by**", ["doing nothing.", "eating a lot.", "swelling up his body."], "C"),
    ex("5", "(Text 1) **5. The lesson from this story is**", ["try to be bigger than you are.", "be yourself - don't try to be like others.", "don't try to be better."], "B"),
    ex("6", `${T2}\n\n**6. Where do Mrs Smith and Tom go after the department store?**`, ["To the supermarket round the corner.", "To the shops round the corner.", "To the bakery round the corner."], "B"),
    ex("7", "(Text 2) **7. How does Mrs Smith get around the store?**", ["She takes the escalator up and the elevator down.", "She walks up and down the stairs.", "She walks up the stairs and takes the elevator down.", "She takes the elevator up and the escalator down."], "A"),
    ex("8", `${T3}\n\n**8. Where is London situated?**`, ["In the southwest of England.", "In the centre of England.", "In the north of England.", "In the southeast of England."], "D"),
    ex("9", "(Text 3) **9. Which church are the Kings and Queens crowned in?**", ["St. Paul's", "Westminster Abbey", "St. Peter's", "Westminster Cathedral"], "B"),
    ex("10", "(Text 3) **10. Where does the Queen live?**", ["in Whitehall", "in Buckingham Palace", "in the Houses of Parliament", "in the White Tower"], "B"),
    ex("11", "(Text 3) **11. What is Big Ben?**", ["a bell", "a clock", "a clock tower", "a church"], "A"),
    ex("12", "(Text 3) **12. Where can you see Lord Nelson's Column?**", ["in Hyde Park", "at Trafalgar Square", "at Picadilly Circus", "at Buckingham Palace"], "B"),
    ex("13", "(Text 3) **13. How many towers has Tower Bridge got?**", ["three", "four", "two", "one"], "C"),
    ex("14", `${T4}\n\n**14. The gnat did not see the**`, ["spider web.", "lion.", "lion's paw."], "A"),
    ex("15", "(Text 4) **15. The lesson is that even a little enemy should be**", ["feared.", "laughed at.", "small."], "A"),
    ex("16", `${T5}\n\n**16. The rooster crowed loudly when the young mouse tried to**`, ["laugh at him.", "eat some of its corn.", "talk to the kind-looking animal."], "C"),
    ex("17", "(Text 5) **17. The moral of this story is to**", ["don't talk to nice looking people.", "look at what people look like.", "look at what is on the inside of a person, not just at what they look like on the outside."], "C"),
    ex("18", `${T6}\n\n**18. What happened at the half-way point?**`, ["The turtle went past the rabbit.", "The turtle took a nap.", "The rabbit stopped to take a nap."], "C"),
    ex("19", "(Text 6) **19. Who won the race?**", ["the rabbit", "the turtle", "the fox"], "B"),
    ex("20", "(Text 6) **20. What lesson do we learn from this story?**", ["Turtles go faster than rabbits.", "A turtle should not challenge a rabbit to a race.", "To succeed, we must keep going and not quit."], "C"),
  ],
};
