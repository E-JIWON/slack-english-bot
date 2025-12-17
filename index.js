import { WebClient } from '@slack/web-api';

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

// 학습할 단어 리스트 (매일 이 중에서 선택)
const wordList = [
  'serendipity',
  'resilient',
  'pragmatic',
  'articulate',
  'nuance',
  'ambiguous',
  'meticulous',
  'ephemeral',
  'ubiquitous',
  'profound',
  'advocate',
  'diligent',
  'candid',
  'concise',
  'versatile',
  'deteriorate',
  'incentive',
  'mitigate',
  'leverage',
  'adjacent',
  'coherent',
  'compelling',
  'viable',
  'ambivalent',
  'comprehensive',
  'eloquent',
  'inevitable',
  'legitimate',
  'meager',
  'obsolete',
  'persistent',
  'reluctant',
  'subtle',
  'trivial',
  'unprecedented',
  'vigorous',
  'arbitrary',
  'benevolent',
  'compatible',
  'deliberate',
  'elaborate',
  'feasible',
  'gratitude',
  'hostile',
  'imminent',
  'justify',
  'keen',
  'legitimate',
  'marginal',
  'negligible',
  'optimistic',
  'preliminary',
  'genuine',
  'rigorous',
  'sustainable',
  'tangible',
  'unanimous',
  'vulnerable',
  'adequate',
  'bias',
  'collaborate',
  'diverse',
  'enhance',
  'facilitate',
  'generate',
  'hierarchy',
  'inevitable',
  'jurisdiction',
  'manipulate',
  'neutral',
  'objective',
  'paradigm',
  'controversy',
  'rigid',
  'subsequent',
  'tangible',
  'undermine',
  'valid',
  'welfare',
  'abolish',
  'consensus',
  'dedicate',
  'emphasize',
  'finite',
  'guarantee',
  'hypothesis',
  'implement',
  'integrate',
  'maintain',
  'notion',
  'overcome',
  'perceive',
  'ratio',
  'significant',
  'transform',
];

async function fetchWordDefinition(word) {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    return data[0]; // 첫 번째 결과 사용
  } catch (error) {
    console.error(`⚠️ ${word} 검색 실패:`, error.message);
    return null;
  }
}

function formatWordMessage(wordData) {
  if (!wordData) return null;

  const word = wordData.word;
  const phonetic = wordData.phonetic || wordData.phonetics?.[0]?.text || 'N/A';

  // 첫 번째 의미 가져오기
  const firstMeaning = wordData.meanings?.[0];
  const partOfSpeech = firstMeaning?.partOfSpeech || '';
  const definition =
    firstMeaning?.definitions?.[0]?.definition || 'No definition available';
  const example = firstMeaning?.definitions?.[0]?.example || null;

  let message = `📖 *단어:* ${word}`;
  if (partOfSpeech) message += ` _(${partOfSpeech})_`;
  message += `\n🔊 *발음:* ${phonetic}`;
  message += `\n💡 *뜻:* ${definition}`;

  if (example) {
    message += `\n✍️ *예문:* _"${example}"_`;
  }

  // 추가 뜻들도 간단히 표시
  if (firstMeaning?.definitions?.length > 1) {
    const otherDefs = firstMeaning.definitions.slice(1, 3); // 최대 2개 더
    otherDefs.forEach((def, idx) => {
      message += `\n   ${idx + 2}. ${def.definition}`;
    });
  }

  return message;
}

async function sendDailyWord() {
  try {
    console.log('📚 오늘의 단어 선택 중...');

    // 날짜 기반으로 단어 선택 (매일 다른 단어)
    const today = new Date();
    const dayOfYear = Math.floor(
      (today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
    );
    const selectedWord = wordList[dayOfYear % wordList.length];

    console.log(`🔍 "${selectedWord}" 검색 중...`);

    // Dictionary API 호출
    const wordData = await fetchWordDefinition(selectedWord);

    if (!wordData) {
      throw new Error('단어 데이터를 가져올 수 없습니다');
    }

    console.log('✅ 단어 정보 받음');

    // 메시지 포맷팅
    const formattedMessage = formatWordMessage(wordData);

    if (!formattedMessage) {
      throw new Error('메시지 포맷팅 실패');
    }

    console.log('📤 Slack으로 전송 중...');

    // Slack으로 전송
    await slack.chat.postMessage({
      channel: process.env.SLACK_CHANNEL_ID,
      text: `🌟 *오늘의 영어 단어*\n\n${formattedMessage}\n\n_출처: Free Dictionary API_`,
    });

    console.log('✅ 전송 완료!');
  } catch (error) {
    console.error('❌ 에러 발생:', error.message);
    throw error;
  }
}

sendDailyWord();
