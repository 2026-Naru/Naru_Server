# 🌏 Naru_Server

> 한국에 거주하는 외국인과 유학생을 위한 스마트 생활 지원 플랫폼  
> 음식 배달, 길찾기, 환전 기능을 하나의 서비스에서 제공합니다.

---

## 📌 프로젝트 소개

**Naru**는 한국 생활에 익숙하지 않은 외국인과 유학생을 위해 제작된 웹 서비스입니다.

사용자는 영어 기반 인터페이스를 통해 한국 음식 배달 서비스를 이용하고, 주변 맛집을 탐색하며, 실시간 환율을 확인해 손쉽게 환전할 수 있습니다.

또한 알레르기 정보를 기반으로 위험 메뉴를 안내하고, 주문 상태를 실시간처럼 보여주는 기능을 통해 보다 안전하고 편리한 서비스를 제공합니다.

> 본 프로젝트는 전시용 프로젝트로, 일부 기능은 더미 데이터와 시뮬레이션 방식으로 구현됩니다.

---

## 🎯 프로젝트 목표

- 외국인과 유학생의 한국 생활 편의성 향상
- 영어 기반 UI를 통한 언어 장벽 최소화
- 음식 알레르기 위험 사전 안내
- 위치 기반 맛집 추천 제공
- 실시간 환율 정보를 활용한 간편 환전 지원

---

## ✨ 주요 기능

### 🍱 음식 배달
- 음식 검색
- 카테고리별 메뉴 탐색
- 가게 상세 정보 조회
- 장바구니 및 결제
- 주문 완료 및 주문 내역 확인

### 🚚 주문 현황 추적
- 주문 상태 자동 변경
  - 조리중
  - 배달중
  - 배달 완료
- 15초 간격 게이지 바 업데이트
- 상태별 알림 표시
- 완료 후 알림 자동 삭제

### ⚠️ 알레르기 경고
- 회원가입 시 설정한 알레르기 정보 저장
- 알레르기 성분이 포함된 메뉴 선택 시 경고 메시지 표시

### 🗺️ 길찾기
- 음식 또는 목적지 검색
- 현재 위치 기반 주변 맛집 추천
- 대중교통 경로를 일러스트 형태로 표시

### 💱 환전
- 실시간 환율 API 연동
- 자국 화폐 ↔ 원화 환전
- 현재 잔액 확인
- 환전 내역 반영

### 👤 마이페이지
- 프로필 정보 조회
- 알레르기 정보 관리
- 주문 횟수 및 주문 내역 조회
- 환전 금액 확인
- 기본 결제 수단 설정

---

## 🖥️ 주요 페이지

1. 회원가입
2. 로그인
3. 메인 페이지
4. 카테고리별 메뉴 페이지
5. 가게 상세 페이지
6. 주문 결제 페이지
7. 주문 완료 페이지
8. 주문 현황 페이지
9. 길찾기 페이지
10. 환전 페이지
11. 마이페이지

---

## 🛠️ 기술 스택

### Frontend
- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Axios

### Backend
- NestJS
- Java
- JPA
- PostgreSQL18

### External API
- 실시간 환율 API
- Geolocation API

### Deployment
- Vercel
- Render

### Backend & Database Setup
- `npm install` to install dependencies
- Copy `.env.example` to `.env` and set the PostgreSQL connection values
- Create the database if needed, for example `createdb naru` or via your Postgres admin tool
- Run `npm run db:setup` to apply `db/schema.sql` and `db/seed.sql`
- Start the server locally with `npm run start:dev`

---

## 📊 핵심 기능 요약

| 기능 | 설명 |
|------|------|
| 음식 검색 | 검색바를 통해 음식 검색 |
| 카테고리 탐색 | 한식, 중식, 일식, 양식, 분식 |
| 알레르기 경고 | 위험 메뉴 선택 시 알림 |
| 주문 결제 | 장바구니 확인 후 결제 |
| 주문 추적 | 조리중 → 배달중 → 완료 자동 전환 |
| 길찾기 | 위치 기반 맛집 추천 및 경로 안내 |
| 환전 | 실시간 환율 기반 환전 |
| 마이페이지 | 프로필, 주문 내역, 환전 정보 확인 |

---

## 📁 프로젝트 구조

```bash
Naru
├── public
├── src
│   ├── assets
│   ├── components
│   ├── pages
│   ├── layouts
│   ├── hooks
│   ├── services
│   ├── store
│   ├── types
│   └── utils
└── README.md
