const tf = require('@tensorflow/tfjs-node');
const natural = require('natural');
const fs = require('fs');
const path = require('path');

const tokenizer = new natural.WordTokenizer();
const labels = ['Low', 'Medium', 'High'];
const wordToIndex = JSON.parse(fs.readFileSync(path.join(__dirname, 'word-to-index.json')));

const vectorize = text => {
  const tokens = tokenizer.tokenize(text.toLowerCase());
  const vec = new Array(Object.keys(wordToIndex).length).fill(0);
  tokens.forEach(token => {
    const index = wordToIndex[token];
    if (index !== undefined) vec[index] = 1;
  });
  return tf.tensor2d([vec]);
};

const assignTechnician = category => {
  const routingMap = {
    'Network': 'technician_network_id',
    'Software': 'technician_software_id',
    'Hardware': 'technician_hardware_id'
  };
  return routingMap[category] || 'default_tech_id';
};

const predict = async ({ title, description, category }) => {
  const model = await tf.loadLayersModel('file://ml/model/model.json');
  const inputText = `${title} ${description} ${category}`;
  const inputVec = vectorize(inputText);
  const prediction = model.predict(inputVec);
  const index = prediction.argMax(-1).dataSync()[0];
  return {
    priority: labels[index],
    assignedTo: assignTechnician(category)
  };
};

module.exports = { predict };
