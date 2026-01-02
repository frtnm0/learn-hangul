export const vowels_single = [
  { char: 'ㅏ', name: 'a', example: 'a — as in "father"' },
  { char: 'ㅑ', name: 'ya', example: 'ya — as in "yacht"' },
  { char: 'ㅓ', name: 'eo', example: 'eo — as in "up" (approx.)' },
  { char: 'ㅕ', name: 'yeo', example: 'yeo — as in "young" (approx.)' },
  { char: 'ㅗ', name: 'o', example: 'o — as in "go"' },
  { char: 'ㅛ', name: 'yo', example: 'yo — as in "yo-yo"' },
  { char: 'ㅜ', name: 'u', example: 'u — as in "food"' },
  { char: 'ㅠ', name: 'yu', example: 'yu — as in "you"' },
  { char: 'ㅡ', name: 'eu', example: 'eu — like the vowel in "put" (approx.)' },
  { char: 'ㅣ', name: 'i', example: 'i — as in "see"' }
]

export const vowels_double = [
  { char: 'ㅐ', name: 'ae', example: 'ae — as in "care" (approx.)' },
  { char: 'ㅒ', name: 'yae', example: 'yae — variant of "ae" with y' },
  { char: 'ㅔ', name: 'e', example: 'e — as in "bed" (approx.)' },
  { char: 'ㅖ', name: 'ye', example: 'ye — as in "yes" (approx.)' },
  { char: 'ㅘ', name: 'wa', example: 'wa — as in "want"' },
  { char: 'ㅙ', name: 'wae', example: 'wae — similar to "way"' },
  { char: 'ㅚ', name: 'oe', example: 'oe — as in "way" (approx.)' },
  { char: 'ㅝ', name: 'wo', example: 'wo — like "war" (approx.)' },
  { char: 'ㅞ', name: 'we', example: 'we — as in "wet" (approx.)' },
  { char: 'ㅟ', name: 'wi', example: 'wi — as in "we"' },
  { char: 'ㅢ', name: 'ui', example: 'ui — as in "we" or "oui" (approx.)' }
]

export const consonants_single = [
  { char: 'ㄱ', name: 'g/k', example: 'g — as in "go" / k — as in "kite"' },
  { char: 'ㄴ', name: 'n', example: 'n — as in "no"' },
  { char: 'ㄷ', name: 'd/t', example: 'd — as in "dog" / t — as in "stop" (aspirated)' },
  { char: 'ㄹ', name: 'r/l', example: 'r/l — between r and l, like "run"/"l"' },
  { char: 'ㅁ', name: 'm', example: 'm — as in "mom"' },
  { char: 'ㅂ', name: 'b/p', example: 'b — as in "bed" / p — as in "spin"' },
  { char: 'ㅅ', name: 's', example: 's — as in "see"' },
  { char: 'ㅇ', name: 'ng', example: 'ng — as in "song" (silent at syllable start)' },
  { char: 'ㅈ', name: 'j', example: 'j — as in "jam"' },
  { char: 'ㅊ', name: 'ch', example: 'ch — as in "chat"' },
  { char: 'ㅋ', name: 'k', example: 'k — as in "king" (aspirated)' },
  { char: 'ㅌ', name: 't', example: 't — as in "top" (aspirated)' },
  { char: 'ㅍ', name: 'p', example: 'p — as in "pan" (aspirated)' },
  { char: 'ㅎ', name: 'h', example: 'h — as in "hat"' }
]

export const consonants_double = [
  { char: 'ㄲ', name: 'kk', example: 'kk — tense k, like doubled k' },
  { char: 'ㄸ', name: 'tt', example: 'tt — tense t' },
  { char: 'ㅃ', name: 'pp', example: 'pp — tense p' },
  { char: 'ㅆ', name: 'ss', example: 'ss — tense s' },
  { char: 'ㅉ', name: 'jj', example: 'jj — tense j' }
]

// default combined exports for compatibility
export const vowels = [...vowels_single, ...vowels_double]
export const consonants = [...consonants_single, ...consonants_double]
