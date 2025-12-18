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
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `오늘의 실용적인 영어 표현 1개를 추천해줘.

형식:
📖 표현: [영어 단어 또는 숙어]
🔊 발음: [발음기호]
💡 뜻: [한국어 뜻]
🎭 대화 예문 (상황극):
   A: [영어 대화 1]
   B: [영어 대화 2]
   A: [영어 대화 3]
   B: [영어 대화 4]
   
   A: [한글 번역 1]
   B: [한글 번역 2]
   A: [한글 번역 3]
   B: [한글 번역 4]
🎯 활용: [어떤 상황에서 쓰면 좋은지]

조건:
- 초급~중급 수준의 일상 표현
- 일상생활이나 여행에서 실제로 쓸 수 있는 표현
- 두 사람이 대화하는 상황극 형태
- 상황 예시: 아침 준비, 외식, 쇼핑, 호텔 체크인, 길 찾기, 카페 주문, 집안일 등
- 자연스러운 구어체 대화로 작성
- 매번 다른 표현을 추천해줘

---
아래는 예문이야. 

🌟 오늘의 영어 표현 (일상회화)

📖 표현: turn off
🔊 발음: /tɜːrn ɒf/
💡 뜻: (전원/가스 등을) 끄다

🎭 대화 예문 (상황극):
   A: Did you turn off the gas?
   B: Oh no, I forgot! I'll go check.
   A: ...
   B: ...

   A: 가스불 껐어?
   B: 아 이런, 깜빡했다! 가서 확인할게.

🎯 활용: 집을 나서기 전 확인할 때, 전기/가스/수도 등을 끄는 상황에서 사용

`,
        },
      ],
    });

    const wordContent = completion.choices[0].message.content;

    console.log('✅ ChatGPT 응답 받음');
    console.log('📤 Slack으로 전송 중...');

    await slack.chat.postMessage({
      channel: process.env.SLACK_CHANNEL_ID,
      text: `🌟 *오늘의 영어 표현* (일상회화)\n\n${wordContent}`,
    });

    console.log('✅ 전송 완료!');
  } catch (error) {
    console.error('❌ 에러 발생:', error.message);

    if (error.response) {
      console.error('API 응답:', error.response.data);
    }

    throw error;
  }
}

sendDailyWord();
