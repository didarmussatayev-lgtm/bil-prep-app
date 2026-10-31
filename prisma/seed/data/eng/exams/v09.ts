import { ex } from "../kit";
import type { EngPaper } from "../papers";

const S = {
  A: "DANGER: SHALLOW WATER – NO DIVING", B: "FAST CURRENT – NO SWIMMING", C: "DOGS MUST BE ON A LEAD AT ALL TIMES", D: "PLEASE HAVE YOUR ID READY WHEN ORDERING",
  E: "DANGER! WALKING ON TRAIN TRACKS PROHIBITED", F: "BACK TO SCHOOL MATERIAL – HUGE DISCOUNTS", G: "PLEASE KEEP OFF THE GRASS", H: "CAUTION! THERE ARE SNAKES IN THIS AREA",
};
const T3 = `**Task 3. Read the article about two sisters.**
Something very strange happened to Tamara. She never knew she had a twin sister until she started university!
Tamara was born in Mexico. Her parents could not look after her so she went to live with a family in Manhattan, USA.
When Tamara was twenty years old, she started university in Long Island. She enjoyed her university life. But one day she was walking home from class, and a student smiled at her. "Hello Adriana!" said the student. "I'm not Adriana," said Tamara.
This happened to Tamara again and again. People Tamara didn't know kept calling her Adriana. It was very strange. One day, when a woman called her Adriana, Tamara asked "Why do you keep calling me Adriana?"
The woman replied, "You look like my friend Adriana. You have the same face and the same hair. Is Adriana your sister?" Tamara said that she did not have a sister called Adriana. But she was interested in this girl Adriana. Finally she asked someone for Adriana's email address.
When Tamara wrote to Adriana, she found out that they both had the same birthday, they looked the same and both of them were from Mexico. When Tamara went to live with the family in Manhattan, Adriana moved to Long Island to live with a family there. It had to be true! Adriana and Tamara were twin sisters!`;
const RW = ["Right", "Wrong", "Doesn't say"];

export const V09: EngPaper = {
  slug: "nis-english-variant-09", number: 9, group: "training", title: { ru: "Вариант НИШ 9", kk: "НЗМ 9-нұсқа" }, timeMinutes: 40, fixed: true,
  questions: [
    ex("1", "**Task 1. Choose the sign that matches the sentence.**\n**1. If you can't prove who you are, you could have a problem.**", [S.F, S.G, S.D, S.B, S.H], "C"),
    ex("2", "**2. It may look nice, but you can't walk on it.**", [S.E, S.G, S.B, S.F, S.H], "C"),
    ex("3", "**3. Don't let your puppy run free here.**", [S.C, S.B, S.D, S.A, S.F], "A"),
    ex("4", "**4. If you jump into the water head first, you may end up in hospital.**", [S.D, S.C, S.E, S.A, S.G], "D"),
    ex("5", "**5. This is not the place if you are scared of reptiles.**", [S.C, S.H, S.F, S.D, S.B], "B"),
    ex("6", "**6. Please, appreciate the environment.**", [S.B, S.C, S.H, S.F, S.G], "E"),
    ex("7", "**Task 2. Read the sentences about cleaning the house. Choose the best word for each space.**\n**7. Martina decided to ________ her house a spring clean.**", ["give", "have", "get"], "A"),
    ex("8", "**8. First Martina ________ all her clothes away in the cupboard.**", ["put", "cleaned", "took"], "A"),
    ex("9", "**9. She ________ all her old toys and games to a second hand shop.**", ["brought", "got", "took"], "C"),
    ex("10", "**10. She tidied ________ her books and papers.**", ["out", "up", "down"], "B"),
    ex("11", "**11. She ________ some fresh flowers on the shelf.**", ["bougt", "got", "put"], "C"),
    ex("12", "**12. She put new ________ on the bed.**", ["curtains", "carpets", "blankets"], "C"),
    ex("13", `${T3}\n\n**Are the sentences 'Right' or 'Wrong'? If there is not enough information to answer, choose 'Doesn't say'.**\n**13. Tamara and her sister were both born in Mexico.**`, RW, "A"),
    ex("14", "(Text) **14. Tamara's parents moved from Mexico to Manhattan.**", RW, "B"),
    ex("15", "(Text) **15. People called Tamara \"Adriana\" many times.**", RW, "A"),
    ex("16", "(Text) **16. Adriana wrote to Tamara first.**", RW, "B"),
    ex("17", "(Text) **17. Adriana always knew she had a twin sister.**", RW, "C"),
    ex("18", "(Text) **18. Adriana is Tamara's only sister.**", RW, "C"),
    ex("19", "(Text) **19. Adriana was a student at Long Island University.**", RW, "C"),
    ex("20", "(Text) **20. Adriana had only recently arrived in Long Island.**", RW, "B"),
  ],
};
