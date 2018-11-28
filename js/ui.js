'use strict';

let UI = class {
  constructor() {
    this.$inputForm = document.getElementById('input-form');
    this.$textareaData = this.$inputForm.querySelector('.recording-data');
    this.$btnProcess = this.$inputForm.querySelector('.btn-process');
    this.$btnClear = this.$inputForm.querySelector('.btn-clear');
    this.$error = this.$inputForm.querySelector('.error');

    this.$output = document.getElementById('output');
    this.$context = this.$output.querySelector('.context-length');
    this.$listWords = this.$output.querySelector('.list-words');
    this.$phrases = this.$output.querySelector('.phrases');
    this.$recording = this.$output.querySelector('.recording blockquote');

    this.attachEvents();
    this.speechSynthesis = new SpeechSynthesis();
  }

  attachEvents() {
    this.recordingData = eval((this.$textareaData.value).trim());

    ['change', 'keyup'].forEach((event) => {
      this.$textareaData.addEventListener(event, () => {
        this.recordingData = eval((this.$textareaData.value).trim());
        this.clearAll();
      });
    });

    this.$listWords.addEventListener('click', (evt) => {
      let $word = evt.target,
          word = $word.innerHTML,
          context = parseInt(this.$context.value, 10);

      this.removeWordSelections();
      $word.classList.add('selected');

      this.displayOutput(word, context);
      this.$phrases.parentNode.style.display = 'block';
    });

    this.$context.addEventListener('change', () => {
      this.removeWordSelections();
      this.empty(this.$phrases);
      this.$phrases.parentNode.style.display = 'none';
    });

    this.$btnProcess.addEventListener('click', () => {
      if (!this.validateInputData()) {
        this.$error.style.display = 'block';
        return;
      }

      this.speechSynthesis.buildWordsMapAndSentences(this.recordingData);
      this.displaySentences();
      this.displayWordsList();
      this.$output.style.display = 'block';
      this.$phrases.parentNode.style.display = 'none';
    });

    this.$btnClear.addEventListener('click', () => {
      this.$textareaData.value = '';
      this.recordingData = [];
      this.clearAll();
    });
  }

  displaySentences() {
    this.$recording.innerHTML = this.speechSynthesis.getSentences().join(' ');
  }

  displayWordsList() {
    let words = this.recordingData.map((w) => { return w[0] });

    words = Array.from(new Set(words));

    words.forEach((word, index) => {
      let $li = document.createElement('li');

      $li.innerHTML = word;
      this.$listWords.appendChild($li);
    });
  }

  displayOutput(word, context) {
    let phrases = this.speechSynthesis.findWordInRecording(this.recordingData, word, context);

    this.empty(this.$phrases);

    phrases.forEach((phrase) => {
      let $li = document.createElement('li');

      phrase = phrase.replace(new RegExp(`^${word} `), '<span class="hi-lite">' + word + '</span> ');
      phrase = phrase.replace(new RegExp(` ${word}$`), ' <span class="hi-lite">' + word + '</span>');
      phrase = phrase.replace(new RegExp(` ${word} `), ' <span class="hi-lite">' + word + '</span> ');

      $li.innerHTML = phrase;
      this.$phrases.appendChild($li);
    });
  }

  empty(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  removeWordSelections() {
    let children;

    children = Array.from(this.$listWords.childNodes);

    children.forEach(($el) => {
      $el.classList.remove('selected');
    });
  }

  clearAll() {
    this.$output.style.display = 'none';
    this.$error.style.display = 'none';
    this.$context.selectedIndex = 1;
    this.$recording.innerHTML = '';

    this.empty(this.$listWords);
    this.empty(this.$phrases);

    this.speechSynthesis = new SpeechSynthesis();
  }

  validateInputData() {
    if (Array.isArray(this.recordingData)) {
      if (Array.isArray(this.recordingData[0]) && this.recordingData[0].length === 3) {
        return true;
      }
    }

    console.log('Error: Input recording data is empty or is invalid');
    return false;
  }

}