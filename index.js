import { WebClient } from '@slack/web-api';
import OpenAI from 'openai';

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function sendDailyWord() {
  try {
    console.log('🤖 ChatGPT에게 단어 요청 중...');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // 가장 저렴하고 빠른 모델
      messages: [
        {
          role: 'user',
          content: `오늘의 실용적인 영어 단어 1개를 추천해줘.

형식:
📖 단어: [영어]
🔊 발음: [발음기호]
💡 뜻: [한국어 뜻]
✍️ 예문: [자연스러운 영어 예문]
       [예문 한글 번역]
🎯 활용: [어떤 상황에서 쓰면 좋은지]

실생활에서 자주 쓰이면서도 배울만한 가치가 있는 중급~고급 수준의 단어로 골라줘.
매번 다른 단어를 추천해줘. 비즈니스나 일상에서 쓸 수 있는 단어면 좋아.`,
        },
      ],
    });

    const wordContent = completion.choices[0].message.content;

    console.log('✅ ChatGPT 응답 받음');
    console.log('📤 Slack으로 전송 중...');

    await slack.chat.postMessage({
      channel: process.env.SLACK_CHANNEL_ID,
      text: `🌟 *오늘의 영어 단어* (by ChatGPT)\n\n${wordContent}`,
    });

    console.log('✅ 전송 완료!');
  } catch (error) {
    console.error('❌ 에러 발생:', error.message);
    throw error;
  }
}

sendDailyWord();
