// PNG 파비콘을 직접 생성하는 스크립트
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// __dirname 구현 (ES 모듈에서는 __dirname이 기본적으로 없음)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '../public');

// 디렉토리 존재 확인
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 결과 PNG 파일 경로
const appleTouchIconPath = path.join(publicDir, 'apple-touch-icon.png');
const favicon32Path = path.join(publicDir, 'favicon-32x32.png');
const favicon16Path = path.join(publicDir, 'favicon-16x16.png');

// 기본 이미지 생성 함수 (간단한 원형 파비콘)
async function createCircleIcon(size, outputPath) {
  // 배경색이 있는 원형 이미지 생성
  const bgColor = '#010222'; // 짙은 파란색 배경
  const borderColor = '#93c5fd'; // 연한 파란색 테두리

  // 빈 이미지 생성
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 1}" fill="${bgColor}" stroke="${borderColor}" stroke-width="2" />
      
      <!-- 별 형태 추가 -->
      <circle cx="${size * 0.3}" cy="${size * 0.3}" r="${size * 0.02}" fill="white" />
      <circle cx="${size * 0.6}" cy="${size * 0.25}" r="${size * 0.03}" fill="white" />
      <circle cx="${size * 0.75}" cy="${size * 0.45}" r="${size * 0.025}" fill="white" />
      <circle cx="${size * 0.55}" cy="${size * 0.6}" r="${size * 0.02}" fill="white" />
      <circle cx="${size * 0.35}" cy="${size * 0.7}" r="${size * 0.025}" fill="white" />
      <circle cx="${size * 0.2}" cy="${size * 0.5}" r="${size * 0.02}" fill="white" />
      
      <!-- 별자리 연결선 -->
      <line x1="${size * 0.3}" y1="${size * 0.3}" x2="${size * 0.6}" y2="${size * 0.25}" stroke="${borderColor}" stroke-width="${size * 0.01}" />
      <line x1="${size * 0.6}" y1="${size * 0.25}" x2="${size * 0.75}" y2="${size * 0.45}" stroke="${borderColor}" stroke-width="${size * 0.01}" />
      <line x1="${size * 0.75}" y1="${size * 0.45}" x2="${size * 0.55}" y2="${size * 0.6}" stroke="${borderColor}" stroke-width="${size * 0.01}" />
      <line x1="${size * 0.55}" y1="${size * 0.6}" x2="${size * 0.35}" y2="${size * 0.7}" stroke="${borderColor}" stroke-width="${size * 0.01}" />
      <line x1="${size * 0.35}" y1="${size * 0.7}" x2="${size * 0.2}" y2="${size * 0.5}" stroke="${borderColor}" stroke-width="${size * 0.01}" />
      <line x1="${size * 0.2}" y1="${size * 0.5}" x2="${size * 0.3}" y2="${size * 0.3}" stroke="${borderColor}" stroke-width="${size * 0.01}" />
      
      <!-- 지구본 경선 느낌 -->
      <ellipse cx="${size/2}" cy="${size/2}" rx="${size * 0.35}" ry="${size * 0.15}" 
               fill="none" stroke="${borderColor}" stroke-width="${size * 0.01}" stroke-opacity="0.5" />
    </svg>
  `;

  // SVG를 PNG로 변환
  try {
    await sharp(Buffer.from(svg))
      .png()
      .toFile(outputPath);
    console.log(`파비콘 생성 완료: ${outputPath}`);
  } catch (err) {
    console.error(`파비콘 생성 실패: ${outputPath}`, err);
  }
}

// 여러 크기의 파비콘 생성
await createCircleIcon(180, appleTouchIconPath);
await createCircleIcon(32, favicon32Path);
await createCircleIcon(16, favicon16Path); 