# Word Transform Game

Transform one word into another by changing one letter at a time — each intermediate step must be a valid English word.

Built with **React Native + Expo**, playable on Web, Android, and iOS.

---

## 🎮 How to Play

- Select Word length (3–8 letters)
- You're given a start word and a target word of the same length.
- Enter new words by changing only one letter at a time.
- Each word must be valid (checked against a real dictionary).
- Use **Undo** to go back or **Restart** to get a new pair.
- Tap **Show Hint** if you're stuck — it suggests a valid next move!

---

## 🔧 Tech Stack

- React Native (via Expo)
- JavaScript
- Offline word validation (from dictionary.json)
- Expo web hosting

---

## 💻 Run Locally

```bash
git clone https://github.com/m36h4/word-transform-game.git
cd word-transform-game
npm install
npx expo start
