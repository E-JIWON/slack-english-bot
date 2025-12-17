# Slack 영어 단어 봇

매일 오전 8시(한국시간)에 Slack 채널로 영어 단어를 추천해주는 봇

## 기능

- Gemini AI가 실용적인 영어 단어 추천
- 단어, 발음, 뜻, 예문, 활용 팁 제공
- GitHub Actions로 자동 실행

## 설정

### 1. GitHub Secrets 등록

Repository → Settings → Secrets and variables → Actions에서 추가:

| Secret 이름        | 설명                               |
| ------------------ | ---------------------------------- |
| `SLACK_BOT_TOKEN`  | Slack Bot OAuth Token (`xoxb-...`) |
| `SLACK_CHANNEL_ID` | 메시지 보낼 채널 ID                |
| `GEMINI_API_KEY`   | Google AI Studio API Key           |

### 2. Slack 앱 설정

1. [Slack API](https://api.slack.com/apps)에서 앱 생성
2. OAuth & Permissions에서 `chat:write` 권한 추가
3. 워크스페이스에 앱 설치
4. Bot Token 복사

### 3. Gemini API 키 발급

[Google AI Studio](https://aistudio.google.com/apikey)에서 API 키 생성

## 수동 실행

GitHub → Actions → Daily English Word → Run workflow
