import { WebClient } from '@slack/web-api';
import { GoogleGenerativeAI } from '@google/generative-ai';

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function sendDailyWord() {
  try {
    console.log('🤖 Gemini에게 단어 요청 중...');

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `오늘의 실용적인 영어 단어 1개를 추천해줘.

형식:
📖 단어: [영어]
🔊 발음: [발음기호]
💡 뜻: [한국어 뜻]
✍️ 예문: [자연스러운 영어 예문]
       [예문 한글 번역]
🎯 활용: [어떤 상황에서 쓰면 좋은지]

실생활에서 자주 쓰이면서도 배울만한 가치가 있는 중급~고급 수준의 단어로 골라줘.
매번 다른 단어를 추천해줘.`;

    const result = await model.generateContent(prompt);
    const wordContent = result.response.text();

    console.log('✅ Gemini 응답 받음');
    console.log('📤 Slack으로 전송 중...');

    await slack.chat.postMessage({
      channel: process.env.SLACK_CHANNEL_ID,
      text: `🌟 *오늘의 영어 단어* (by Gemini)\n\n${wordContent}`,
    });

    console.log('✅ 전송 완료!');
  } catch (error) {
    console.error('❌ 에러 발생:', error.message);
    throw error;
  }
}

sendDailyWord();
