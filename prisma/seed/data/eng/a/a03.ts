import { EngTopic, mc, fill, fills, pick, order, joinBi } from "../kit";

const topic: EngTopic = {
  code: "1.3",
  title: { ru: "Предлоги места и движения · Повелительное наклонение", kk: "Орын мен қозғалыс предлогтары · Бұйрық рай" },
  explanation: joinBi(
    {
      ru: `### Предлоги места
Они показывают, **где** находится предмет. Представьте мяч и коробку:

:::figure {"kind":"table","caption":"Prepositions of place","rows":[["Предлог","Значение","Пример"],["in","внутри","The ball is in the box."],["on","на поверхности","The book is on the desk."],["under","под","The cat is under the table."],["next to / near","рядом с","The lamp is next to the bed."],["behind","позади","The bag is behind the door."],["in front of","перед","The car is in front of the house."],["between","между (двумя)","The shelf is between the window and the door."],["above / over","над","The picture is above the sofa."],["below","ниже, под (на стене)","The clock is below the picture."]]}
:::

### Предлоги движения
Они показывают, **куда или откуда** двигается предмет.
:::figure {"kind":"table","caption":"Prepositions of movement","rows":[["Предлог","Значение","Пример"],["into","внутрь","The ball goes into the box."],["out of","изнутри наружу","He comes out of the room."],["up / down","вверх / вниз","She runs up the stairs."],["along","вдоль","We walk along the road."],["across","через (поверхность)","The boy runs across the street."],["through","сквозь","The ball flies through the window."],["past","мимо","The bus goes past the school."],["around","вокруг","They run around the park."],["towards / from","к / от","He walks towards the door."]]}
:::

:::warn Ловушка: in и into
**in** — где предмет находится (The cat is **in** the room). **into** — куда он движется (The cat runs **into** the room).
:::

### Повелительное наклонение (Imperative)
Так мы даём команды, советы, просьбы. Форма — просто **глагол без to**.
:::rule Правило
- Утверждение: **глагол** → Open the window. Sit down.
- Отрицание: **Don't + глагол** → Don't run. Don't talk.
- Вежливо: добавляем **please** → Please, close the door.
:::

Знаки на улице тоже используют эту форму: **Don't park here. Turn left. Stop.**`,
      kk: `### Орын предлогтары
Олар заттың **қайда** тұрғанын көрсетеді. Доп пен қорапты елестетіңіз:

:::figure {"kind":"table","caption":"Prepositions of place","rows":[["Предлог","Мағынасы","Мысал"],["in","ішінде","The ball is in the box."],["on","үстінде (беткейде)","The book is on the desk."],["under","астында","The cat is under the table."],["next to / near","жанында","The lamp is next to the bed."],["behind","артында","The bag is behind the door."],["in front of","алдында","The car is in front of the house."],["between","екеуінің арасында","The shelf is between the window and the door."],["above / over","үстінде (жоғарыда)","The picture is above the sofa."],["below","төмен (қабырғада)","The clock is below the picture."]]}
:::

### Қозғалыс предлогтары
Олар заттың **қайда немесе қайдан** қозғалатынын көрсетеді.
:::figure {"kind":"table","caption":"Prepositions of movement","rows":[["Предлог","Мағынасы","Мысал"],["into","ішіне","The ball goes into the box."],["out of","ішінен сыртқа","He comes out of the room."],["up / down","жоғары / төмен","She runs up the stairs."],["along","бойымен","We walk along the road."],["across","арқылы (бетімен)","The boy runs across the street."],["through","ішінен өтіп","The ball flies through the window."],["past","жанынан өтіп","The bus goes past the school."],["around","айналасында","They run around the park."],["towards / from","қарай / -дан","He walks towards the door."]]}
:::

:::warn Қателік: in және into
**in** — зат қайда тұр (The cat is **in** the room). **into** — қайда қозғалады (The cat runs **into** the room).
:::

### Бұйрық рай (Imperative)
Бұйрық, кеңес, өтінішті осылай айтамыз. Форма — тек **to-сыз етістік**.
:::rule Ереже
- Болымды: **етістік** → Open the window. Sit down.
- Болымсыз: **Don't + етістік** → Don't run. Don't talk.
- Сыпайы түрі: **please** қосамыз → Please, close the door.
:::

Көшедегі белгілерде де осы форма қолданылады: **Don't park here. Turn left. Stop.**`,
    },
  ),
  practice: [
    fill("1", "The cat is sleeping ______ the table (under the table, not on it). Write one word.", "under", "Under — под.", "Under — астында."),
    fill("2", "The lamp is ______ the bed and the desk. (It is in the middle of two things.) Write one word.", "between", "Between — между двумя предметами.", "Between — екі заттың арасында."),
    fill("3", "The boy runs ______ the room. (He goes from outside to inside.) Write one word.", "into", "Движение внутрь — into.", "Ішке қозғалыс — into."),
    fill("4", "The bus goes ______ our school. (It passes the school and does not stop.) Write one word.", "past", "Past — мимо.", "Past — жанынан өтіп."),
    fills("5", "Write in or into.\nThe ball is ___ the box. The ball falls ___ the box.", ["in", "into"], "In — где находится; into — куда движется.", "In — қайда тұр; into — қайда қозғалады."),
    fill("6", "Make the sentence negative. Write the first two words.\nRun in the corridor! → ______ run in the corridor!", "don't", "Отрицательная команда: Don't + глагол.", "Болымсыз бұйрық: Don't + етістік."),
    pick("7", "Which sentences are imperatives (commands)? Write the numbers.\n1. Open your books.  2. She opens the door.  3. Don't touch the picture.  4. They are tidy.", [1, 3], "Команда — это глагол без подлежащего: Open… и Don't touch…", "Бұйрық — бастауышсыз етістік: Open… және Don't touch…"),
    order("8", "Put the words in the right order. Write the numbers.\n1. the  2. close  3. door  4. please", [4, 2, 1, 3], "Please close the door.", "Please close the door."),
  ],
  test: [
    mc("1", "The picture is ___ the sofa on the wall. (higher than the sofa)", ["above", "under", "between", "into"], "Above — над, выше.", "Above — үстінде, жоғарыда."),
    mc("2", "The ball is ___ the box. I can't see it.", ["in", "into", "along", "past"], "Мяч находится внутри — in (не движется).", "Доп қорапта тұр — in (қозғалмайды)."),
    mc("3", "The children walk ___ the park every morning.", ["through", "under", "between", "in front"], "Walk through the park — идти сквозь парк.", "Walk through the park — саябақ арқылы жүру."),
    mc("4", "___ talk during the test, please!", ["Don't", "Doesn't", "Not", "No"], "Отрицательная команда начинается с Don't.", "Болымсыз бұйрық Don't-пен басталады."),
    mc("5", "Which sentence is an imperative?", ["Close the window, please.", "She closes the window.", "The window is closed.", "I close the window."], "Imperative — глагол в начале предложения без подлежащего.", "Imperative — сөйлем басындағы бастауышсыз етістік."),
    mc("6", "The shop is ___ the bank and the post office.", ["between", "among", "on", "at"], "Между двумя зданиями — between.", "Екі ғимараттың арасында — between."),
    mc("7", "The dog jumped ___ the car and ran away.", ["out of", "in front", "next", "under"], "Out of — изнутри наружу.", "Out of — ішінен сыртқа."),
    mc("8", "The cat is hiding ___ the sofa. We can't see it.", ["behind", "above", "across", "up"], "Behind — позади.", "Behind — артында."),
    mc("9", "What does this sign mean? \"DON'T PARK HERE\"", ["You must not leave your car here.", "You can park here.", "You must turn left.", "You must stop."], "Don't park — «не парковаться».", "Don't park — «тұрақтамаңыз»."),
    mc("10", "Tom walks ___ the stairs to his bedroom.", ["up", "across", "past", "between"], "Walk up the stairs — подниматься по лестнице.", "Walk up the stairs — баспалдақпен көтерілу."),
  ],
};

export default topic;
