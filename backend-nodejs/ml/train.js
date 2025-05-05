const tf = require('@tensorflow/tfjs-node');
const natural = require('natural');
const fs = require('fs');

const data = require('./data.json');

// Preprocess
const tokenizer = new natural.WordTokenizer();
const labels = ['Low', 'Medium', 'High'];
const texts = data.map(d => `${d.title} ${d.description} ${d.category}`);
const tokenized = texts.map(text => tokenizer.tokenize(text.toLowerCase()));
const allWords = Array.from(new Set(tokenized.flat()));

const wordToIndex = {};
allWords.forEach((word, i) => wordToIndex[word] = i);

const vectorize = tokens => {
  const vec = new Array(allWords.length).fill(0);
  tokens.forEach(token => {
    const index = wordToIndex[token];
    if (index !== undefined) vec[index] = 1;
  });
  return vec;
};

const xs = tf.tensor2d(tokenized.map(vectorize));
const ys = tf.tensor2d(data.map(d => {
  const y = [0, 0, 0];
  y[labels.indexOf(d.priority)] = 1;
  return y;
}));

// Model
const model = tf.sequential();
model.add(tf.layers.dense({ inputShape: [xs.shape[1]], units: 64, activation: 'relu' }));
model.add(tf.layers.dense({ units: 3, activation: 'softmax' }));

model.compile({ loss: 'categoricalCrossentropy', optimizer: 'adam', metrics: ['accuracy'] });

(async () => {
  await model.fit(xs, ys, { epochs: 20 });
  await model.save('file://ml/model');
  console.log('✅ Model trained and saved.');
})();
