# 흑요석의 신부 — The Obsidian Bride

인터랙티브 비주얼 노블 홈페이지

## 배포 방법

1. 이 저장소를 GitHub에 push
2. Netlify에서 "New site from Git" → GitHub 연결 → 이 저장소 선택
3. 빌드 설정은 `netlify.toml`에 이미 포함되어 있으므로 그대로 Deploy

## 로컬 미리보기

```bash
npm install
npm run dev
```

## 이미지 에셋

`public/images/` 폴더에 이미지를 넣으세요:

```
public/
  images/
    chars/           ← 캐릭터 카드 이미지 (PNG, 투명배경)
      peridot.webp
      moissanite.webp
      ...
    chars/modal/     ← 캐릭터 누끼 이미지 (PNG, 투명배경)
      peridot.webp
      ...
    kingdoms/        ← 9왕국 이미지
      elpedium.webp
      salpador.webp
      ...
```
