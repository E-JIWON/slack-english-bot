# 🌟 Slack 영어 표현 봇

매일 정해진 시간에 Slack 채널로 실용적인 영어 표현을 보내주는 봇입니다.

## ✨ 기능

- **ChatGPT(gpt-4o-mini)**가 매일 새로운 영어 표현 추천
- 다양한 정보 제공:
  - 📖 표현 & 발음기호
  - 💡 한국어 뜻
  - 🎭 4줄 대화 예문 (영어 + 자연스러운 한글 번역)
  - 🔄 비슷한 표현 3개
  - ❗ 관련 유용한 표현 3개
  - 🎯 실제 활용 상황
- GitHub Actions로 매일 자동 실행

## 📋 예시 메시지

```
🌟 오늘의 영어 표현 (일상회화)

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

🎯 활용: 친구와 간단한 식사를 하거나 외식을 제안할 때 사용
```

## ⚙️ 설정

### 1. GitHub Secrets 등록

Repository → Settings → Secrets and variables → Actions에서 추가:

| Secret 이름        | 설명                               |
| ------------------ | ---------------------------------- |
| `SLACK_BOT_TOKEN`  | Slack Bot OAuth Token (`xoxb-...`) |
| `SLACK_CHANNEL_ID` | 메시지 보낼 채널 ID                |
| `OPENAI_API_KEY`   | OpenAI API Key                     |

### 2. Slack 앱 설정

1. [Slack API](https://api.slack.com/apps)에서 앱 생성
2. **OAuth & Permissions**에서 `chat:write` 권한 추가
3. 워크스페이스에 앱 설치
4. Bot Token 복사 (`xoxb-`로 시작)

### 3. OpenAI API 키 발급

[OpenAI Platform](https://platform.openai.com/api-keys)에서 API 키 생성

### 4. GitHub Actions 워크플로우

`.github/workflows/daily.yml` 파일을 생성하고 스케줄 설정:

```yaml
name: Daily English Expression

on:
  schedule:
    - cron: '0 23 * * *' # UTC 기준 (한국시간 오전 8시)
  workflow_dispatch: # 수동 실행 가능

jobs:
  send:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install
      - run: npm start
        env:
          SLACK_BOT_TOKEN: ${{ secrets.SLACK_BOT_TOKEN }}
          SLACK_CHANNEL_ID: ${{ secrets.SLACK_CHANNEL_ID }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

## 🚀 실행

### 자동 실행

GitHub Actions 스케줄에 따라 매일 자동 실행

### 수동 실행

GitHub → Actions → Daily English Expression → **Run workflow**

### 로컬 실행

```bash
export SLACK_BOT_TOKEN="xoxb-..."
export SLACK_CHANNEL_ID="C..."
export OPENAI_API_KEY="sk-..."

npm install
npm start
```

## 🛠️ 기술 스택

- **Node.js** (ES Modules)
- **@slack/web-api** - Slack 메시지 전송
- **openai** - ChatGPT API (gpt-4o-mini)
- **GitHub Actions** - 스케줄링 & 자동화
