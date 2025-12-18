import { WebClient } from '@slack/web-api';
import OpenAI from 'openai';

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function sendDailyWord() {
  try {
    console.log('🤖 ChatGPT에게 표현 요청 중...');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `[지시사항]
오늘의 실용적인 영어 표현 1개를 추천해줘.
아래 형식을 정확히 따라서 작성해야 해.

[출력 형식]
📖 표현: [영어 단어 또는 숙어]
🔊 발음: [발음기호]
💡 뜻: [한국어 뜻]

🎭 대화 예문 (상황극):
   A: [영어 대화 1]
   B: [영어 대화 2]
   A: [영어 대화 3]
   B: [영어 대화 4]
   
   (번역)
   A: [한글 번역 1]
   B: [한글 번역 2]
   A: [한글 번역 3]
   B: [한글 번역 4]

🔄 비슷한 표현들:
   • [유사 표현 1]: [뜻]
   • [유사 표현 2]: [뜻]
   • [유사 표현 3]: [뜻]

❗ 같이 알아두면 좋은 점:
   • [관련 표현 1] → [뜻]
   • [관련 표현 2] → [뜻]
   • [관련 표현 3] → [뜻]

🎯 활용: [어떤 상황에서 쓰면 좋은지]

[예시 - 이렇게 작성해줘]
📖 표현: grab a bite
🔊 발음: /ɡræb ə baɪt/
💡 뜻: 간단히 먹다, 가볍게 식사하다

🎭 대화 예문 (상황극):
   A: Are you hungry?
   B: Yeah, do you want to grab a bite?
   A: Sure! Where should we go?
   B: How about that new cafe down the street?
   
   (번역)
   A: 배고프니?
   B: 응, 간단히 뭐 좀 먹을까?
   A: 좋아! 어디 갈까?
   B: 저 길 저쪽에 새로 생긴 카페 어때?

🔄 비슷한 표현들:
   • grab coffee: 커피 한 잔 하다
   • grab lunch: 점심 먹다
   • grab dinner: 저녁 먹다

❗ 같이 알아두면 좋은 점:
   • across the street → 길 건너
   • around the corner → 모퉁이 돌아서 바로
   • a couple blocks down → 몇 블록쯤 가서

🎯 활용: 친구와 간단한 식사를 하거나 외식을 제안할 때 사용. 격식 없이 가볍게 식사하자고 할 때 유용함.

[작성 규칙]
- 초급~중급 수준의 일상 표현
- 일상생활이나 여행에서 실제로 쓸 수 있는 표현
- 두 사람이 4줄 정도 주고받는 자연스러운 대화
- 상황 예시: 아침 준비, 외식, 쇼핑, 호텔 체크인, 길 찾기, 카페 주문, 집안일 등
- 자연스러운 구어체 대화로 작성
- **한글 번역은 완전히 자연스러운 한국어로 작성 (직역 절대 금지!)**
- **정확하지 않아도 되는 표현은 의역으로 자연스럽게**
- "🔄 비슷한 표현들" 3개는 오늘 표현의 응용/변형
- "❗ 같이 알아두면 좋은 점" 3개는 관련된 다른 유용한 표현
- 매번 다른 표현을 추천해줘
- 위 형식을 정확히 따라줘 (이모지, 들여쓰기, 섹션 구조 포함)`,
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
