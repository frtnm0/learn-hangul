/*
Generate two JSON word lists:
- src/data/words_common_1000.json : top 1000 Korean words from hermitdave 50k list
- src/data/words_short_1000.json : 1000 short words (≤2 syllables)
Includes fields: { word, romanization, translation }
Romanization: basic Revised Romanization approximation
Translations: fetched (best-effort) from Glosbe, MyMemory, and a public Google Translate endpoint (fallbacks)

Usage: node scripts/generate_wordlists.js
*/

const https = require('https');
const fs = require('fs');
const path = require('path');

const SOURCE_URL = 'https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2016/ko/ko_50k.txt';
const OUT_COMMON = path.join(__dirname, '..', 'src', 'data', 'words_common_1000.json');
const OUT_SHORT = path.join(__dirname, '..', 'src', 'data', 'words_short_1000.json');

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) return reject(new Error('Status ' + res.statusCode));
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function isHangul(s) {
  return /[\uAC00-\uD7A3]/.test(s);
}

// Basic RR mapping tables (approximate)
const CHO = ['g','kk','n','d','tt','r','m','b','pp','s','ss','','j','jj','ch','k','t','p','h'];
const JUNG = ['a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae','oe','yo','u','wo','we','wi','yu','eu','ui','i'];
const JONG = ['','k','k','ks','n','nj','nh','t','l','lg','lm','lb','ls','lt','lp','lh','m','p','ps','s','ss','ng','j','ch','k','t','p','h'];

function decomposeSyllable(ch) {
  const SBase = 0xAC00;
  const LCount = 19;
  const VCount = 21;
  const TCount = 28;
  const code = ch.charCodeAt(0) - SBase;
  if (code < 0 || code >= LCount * VCount * TCount) return null;
  const LIndex = Math.floor(code / (VCount * TCount));
  const VIndex = Math.floor((code % (VCount * TCount)) / TCount);
  const TIndex = code % TCount;
  return {LIndex, VIndex, TIndex};
}

function romanize(word) {
  // For each syllable, map components and join; we do not implement all assimilation rules.
  let out = '';
  for (const ch of [...word]) {
    if (!isHangul(ch)) {
      out += ch;
      continue;
    }
    const dec = decomposeSyllable(ch);
    if (!dec) { out += ch; continue; }
    const {LIndex, VIndex, TIndex} = dec;
    let part = '';
    part += CHO[LIndex] || '';
    part += JUNG[VIndex] || '';
    // final consonant handled in a simple way
    const final = (TIndex === 0) ? '' : JONG[TIndex] || '';
    part += final;
    out += part;
  }
  // minor cleanups to better match RR
  out = out.replace(/gyeo/g, 'gyeo');
  // collapse duplicate vowels generated in rare cases
  out = out.replace(/aa/g, 'a');
  return out;
}

function fetchTranslationGlosbe(word) {
  // Use Glosbe public API: best-effort
  const url = `https://glosbe.com/gapi/translate?from=kor&dest=eng&format=json&phrase=${encodeURIComponent(word)}&pretty=true`;
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json && Array.isArray(json.tuc) && json.tuc.length) {
            for (const t of json.tuc) {
              if (t.meanings && t.meanings.length) {
                const m = t.meanings[0].text;
                if (m) return resolve(m);
              }
            }
            // fallback: 'phrase' field sometimes has translation
            if (json.phrase) return resolve(json.phrase);
          }
        } catch (e) {
          // ignore parse errors
        }
        return resolve('');
      });
    }).on('error', () => resolve(''));
  });
}

function fetchTranslationMyMemory(word) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=ko|en`;
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json && json.responseData && json.responseData.translatedText) {
            const t = json.responseData.translatedText;
            if (t && t !== word) return resolve(t);
          }
        } catch (e) {
          // ignore
        }
        return resolve('');
      });
    }).on('error', () => resolve(''));
  });
}

function fetchTranslationGoogle(word) {
  // public, unofficial google translate endpoint (best-effort)
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ko&tl=en&dt=t&q=${encodeURIComponent(word)}`;
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (Array.isArray(json) && Array.isArray(json[0]) && json[0].length) {
            const t = json[0].map(s => s[0]).join('');
            if (t && t !== word) return resolve(t);
          }
        } catch (e) {
          // ignore
        }
        return resolve('');
      });
    }).on('error', () => resolve(''));
  });
}

async function fetchTranslationAny(word) {
  if (!word) return '';
  let t = await fetchTranslationGlosbe(word);
  if (t) return t;
  t = await fetchTranslationMyMemory(word);
  if (t) return t;
  t = await fetchTranslationGoogle(word);
  return t || '';
}

async function generate() { 
  console.log('Fetching source list...');
  const text = await fetchText(SOURCE_URL);
  const lines = text.split(/\r?\n/);
  const words = [];
  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    if (!parts[0]) continue;
    const token = parts[0];
    if (isHangul(token)) {
      if (!words.includes(token)) words.push(token);
    }
  }
  console.log('Total Hangul tokens found:', words.length);

  const common = words.slice(0, 1000);

  // collect short words (<=2 syllables) until 1000
  const short = [];
  for (const w of words) {
    const hangulLen = [...w].filter(ch => /[\uAC00-\uD7A3]/.test(ch)).length;
    if (hangulLen <= 2) {
      short.push(w);
      if (short.length >= 1000) break;
    }
  }
  // if not enough, include more by increasing threshold
  let thresh = 3;
  while (short.length < 1000 && thresh <= 5) {
    for (const w of words) {
      if (short.includes(w)) continue;
      const hangulLen = [...w].filter(ch => /[\uAC00-\uD7A3]/.test(ch)).length;
      if (hangulLen <= thresh) {
        short.push(w);
        if (short.length >= 1000) break;
      }
    }
    thresh++;
  }

  console.log('Common 1000 collected:', common.length);
  console.log('Short words collected:', short.length);

  // fetch meanings (best-effort) with limited concurrency
  const CONCURRENCY = 8;
  async function processList(list) {
    const out = [];
    let idx = 0;
    async function worker() {
      while (true) {
        const i = idx++;
        if (i >= list.length) return;
        const w = list[i];
        const roman = romanize(w);
        let translation = '';
        try {
          translation = await fetchTranslationAny(w);
        } catch (e) {
          translation = '';
        }
        out[i] = {word: w, romanization: roman, translation};
        if ((i + 1) % 50 === 0) console.log(`Processed ${i + 1}/${list.length}`);
      }
    }
    const tasks = [];
    for (let i = 0; i < CONCURRENCY; i++) tasks.push(worker());
    await Promise.all(tasks);
    return out;
  }

  console.log('Fetching meanings for common list (this may take a while)...');
  const commonOut = await processList(common);
  console.log('Fetching meanings for short list...');
  // reuse meanings from common if present
  const commonMap = new Map(commonOut.map(o => [o.word, o.translation]));
  const shortWithTranslations = [];
  for (let i = 0; i < short.length; i++) {
    const w = short[i];
    const roman = romanize(w);
    let translation = commonMap.get(w) || '';
    if (!translation) {
      translation = await fetchTranslationAny(w);
    }
    shortWithTranslations[i] = {word: w, romanization: roman, translation};
    if ((i + 1) % 100 === 0) console.log(`Short processed ${i + 1}/${short.length}`);
  }

  fs.mkdirSync(path.dirname(OUT_COMMON), {recursive: true});
  fs.writeFileSync(OUT_COMMON, JSON.stringify(commonOut, null, 2), 'utf8');
  fs.writeFileSync(OUT_SHORT, JSON.stringify(shortWithTranslations, null, 2), 'utf8');
  console.log('Files written:', OUT_COMMON, OUT_SHORT);
}

generate().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
