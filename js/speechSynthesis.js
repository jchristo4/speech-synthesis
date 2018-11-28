/*
Given an input recording data, a word and length of context words on either side, this function will output the matching phrase or phrases (if multiple matches)

From the recording, a hash map of words and their indices in the recording (in correct order) is built once, and used for finding for matching phrases.

Complexity:
  1. 2n for building the hash map and sentences index (done once) where n is number of words in the recording
  2. 1 + c for matching phrases with given word where c is the context length

Extra credit:
  Handles duplicates words in the recording, and outputs matching phrases. Example: 'the', 'of' in the sample data below

Sample recording_data:
  [['backwaters',3,11],['end',22,13],['sun.',12,-1],['uncharted',8,0],['small',16,18],['arm',23,15],['Galaxy',17,10],['Far',-1,14],['the',9,3],['in',14,8],['lies',6,16],['of',0,17],['yellow',18,2],['of',1,19],['out',7,9],['of',5,20],['a',10,4],['the',11,22],['unregarded',4,12],['the',13,21],['the',15,6],['western',19,23],['unfashionable',17,1],['spiral',21,5]]

Words arranged in correct order for above data:
  Far out in the uncharted backwaters of the unfashionable end of the western spiral arm of the Galaxy lies a small unregarded yellow sun.

Usage:
  let speechSynthesis = new SpeechSynthesis();
  console.log(speechSynthesis.findWordInRecording(recording_data, 'the', 3));
  console.log(speechSynthesis.findWordInRecording(recording_data, 'Galaxy', 3));
*/

'use strict';

let SpeechSynthesis = class {

  // Finds phrase(s) matching given word and context length from recording data
  findWordInRecording(recordingData, word, context) {
    let [start, end] = [0, 0],
        phrases = [];

    this.buildWordsMapAndSentences(recordingData);

    if (!this.isValidInputParams(context, word)) return;

    this.mapWords[word].forEach((index) => {
      let start = Math.max(0, index - context);
      let end = Math.min(this.sentences.length, index + context + 1);
      phrases.push(this.sentences.slice(start, end).join(' '));
    });

    return phrases;
  }

  // Builds hash map from recording data and sentences with words in correct order
  buildWordsMapAndSentences(recordingData) {
    let index = 0, start;

    // skip if recording data is same as before
    if (JSON.stringify(recordingData) === JSON.stringify(this.recordingData)) return;

    this.mapWords = {};
    this.sentences = [];
    this.recordingData = recordingData;

    if (!this.isValidRecordingData()) return;

    start = this.getIndexOfFirstWord();

    while (start !== -1) {
      let word = recordingData[start][0];

      if (typeof this.mapWords[word] === 'undefined') {
        this.mapWords[word] = [];
      }

      this.mapWords[word].push(index);
      this.sentences.push(word);

      start = recordingData[start][2];
      index += 1;
    }
  }

  // Gets index of the first word of the sentence(s) from recording data
  getIndexOfFirstWord() {
    let indexFirstWord = -1;

    this.recordingData.forEach((word, index) => {
      if (word[1] == -1) {
        indexFirstWord = index;
        return;
      }
    });

    return indexFirstWord;
  }

  // (For UI)
  getSentences() {
    return this.sentences;
  }

  // Validates if given word is present in recording data, and if context length is greater than zero
  isValidInputParams(context, word) {
    if (context < 0) {
      console.log(`Error: Context value ${context} should be zero or greater`);
      return false;
    }

    if (typeof this.mapWords[word] === 'undefined') {
      console.log(`Error: Word "${word}" is not present in the recording`);
      return false;
    }

    return true;
  }


  // Validates if recording data follows specific format ([[<word>, <prev-index>, <next-index>], [<word> ...]])
  isValidRecordingData() {
    if (Array.isArray(this.recordingData)) {
      if (Array.isArray(this.recordingData[0]) && this.recordingData[0].length === 3) {
        return true;
      }
    }

    console.log(`Error: Input recording data is not in valid format`);
    return false;
  }
}