import { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import dictionary from './assets/dictionary.json';

const wordList = Object.keys(dictionary);

export default function App() {
  const [startWord, setStartWord] = useState('');
  const [targetWord, setTargetWord] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [wordLength, setWordLength] = useState(4);
  const [hint, setHint] = useState(null);

  const isValidWord = (word) => {
    return wordList.includes(word.toLowerCase());
  };

  const isOneLetterDiff = (word1, word2) => {
    if (word1.length !== word2.length) return false;
    let diff = 0;
    for (let i = 0; i < word1.length; i++) {
      if (word1[i] !== word2[i]) diff++;
    }
    return diff === 1;
  };

  const getRandomWordPair = () => {
    const filteredWords = wordList.filter(word => word.length === wordLength);
    if (filteredWords.length < 2) return ["cold", "warm"];
    let first = filteredWords[Math.floor(Math.random() * filteredWords.length)];
    let second;
    do {
      second = filteredWords[Math.floor(Math.random() * filteredWords.length)];
    } while (second === first);
    return [first, second];
  };

  const startGame = () => {
    const [start, target] = getRandomWordPair();
    setStartWord(start);
    setTargetWord(target);
    setCurrentWord(start);
    setHistory([start]);
    setGameStarted(true);
    setHint(null);
    setInput('');
  };

  const handleSubmit = () => {
    const word = input.toLowerCase();
    if (!isValidWord(word)) {
      Alert.alert('Invalid word', 'That word is not in the dictionary.');
    } else if (!isOneLetterDiff(currentWord, word)) {
      Alert.alert('Invalid transformation', 'Only one letter can be changed.');
    } else {
      setCurrentWord(word);
      setHistory([...history, word]);
      if (word === targetWord.toLowerCase()) {
        Alert.alert('Congratulations!', 'You reached the target word.');
        setGameStarted(false);
      }
    }
    setInput('');
    setHint(null);
  };

  const handleUndo = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      setCurrentWord(newHistory[newHistory.length - 1]);
      setHistory(newHistory);
    }
  };

  const handleRestart = () => {
    setGameStarted(false);
    setInput('');
    setHint(null);
    setHistory([]);
    setCurrentWord('');
    setStartWord('');
    setTargetWord('');
  };

  const showHint = () => {
    const visited = new Set();
    const queue = [[currentWord.toLowerCase()]];
    const filteredWords = new Set(wordList.filter(w => w.length === currentWord.length));

    while (queue.length > 0) {
      const path = queue.shift();
      const last = path[path.length - 1];
      if (last === targetWord.toLowerCase()) {
        setHint(path[1]);
        return;
      }
      for (const word of filteredWords) {
        if (!visited.has(word) && isOneLetterDiff(last, word)) {
          visited.add(word);
          queue.push([...path, word]);
        }
      }
    }
    setHint('No valid path');
  };

  return (
    <View style={{ padding: 20, marginTop: 50, flex: 1 }}>
      {!gameStarted ? (
        <>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Select Word Length:</Text>
          <Picker
            selectedValue={wordLength}
            onValueChange={(value) => setWordLength(value)}
            style={{ marginBottom: 20 }}
          >
            {[3, 4, 5, 6, 7, 8].map(len => (
              <Picker.Item key={len} label={`${len}-letter words`} value={len} />
            ))}
          </Picker>
          <Button title="Start Game" onPress={startGame} />
        </>
      ) : (
        <>
          <Text style={{ fontSize: 20, marginBottom: 10 }}>Transform {startWord} to {targetWord}</Text>
          <TextInput
            style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
            value={input}
            onChangeText={setInput}
            autoCapitalize="none"
            maxLength={startWord.length}
            placeholder="Enter next word"
          />
          <Button title="Submit" onPress={handleSubmit} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <Button title="Undo" onPress={handleUndo} disabled={history.length <= 1} />
            <Button title="Restart" onPress={handleRestart} />
            <Button title="Show Hint" onPress={showHint} />
          </View>
          {hint && (
            <Text style={{ marginTop: 10, fontSize: 16 }}>
              Hint: Try "{hint}"
            </Text>
          )}
          <FlatList
            style={{ marginTop: 20 }}
            data={history}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 18 }}>{item}</Text>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}
