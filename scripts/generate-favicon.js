// SVG 파비콘을 PNG로 변환하는 스크립트
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

// SVG 파일 경로
const faviconSvgPath = path.join(publicDir, 'favicon.svg');
const appleTouchIconSvgPath = path.join(publicDir, 'apple-touch-icon.svg');

// 결과 PNG 파일 경로
const appleTouchIconPath = path.join(publicDir, 'apple-touch-icon.png');
const favicon32Path = path.join(publicDir, 'favicon-32x32.png');
const favicon16Path = path.join(publicDir, 'favicon-16x16.png');

// Apple Touch Icon 생성 (180x180)
if (fs.existsSync(appleTouchIconSvgPath)) {
  sharp(appleTouchIconSvgPath)
    .resize(180, 180)
    .png()
    .toFile(appleTouchIconPath)
    .then(() => {
      console.log('Apple Touch Icon 생성 완료:', appleTouchIconPath);
    })
    .catch(err => {
      console.error('Apple Touch Icon 생성 실패:', err);
    });
}

// 32x32 파비콘 생성
if (fs.existsSync(faviconSvgPath)) {
  sharp(faviconSvgPath)
    .resize(32, 32)
    .png()
    .toFile(favicon32Path)
    .then(() => {
      console.log('32x32 파비콘 생성 완료:', favicon32Path);
    })
    .catch(err => {
      console.error('32x32 파비콘 생성 실패:', err);
    });
}

// 16x16 파비콘 생성
if (fs.existsSync(faviconSvgPath)) {
  sharp(faviconSvgPath)
    .resize(16, 16)
    .png()
    .toFile(favicon16Path)
    .then(() => {
      console.log('16x16 파비콘 생성 완료:', favicon16Path);
    })
    .catch(err => {
      console.error('16x16 파비콘 생성 실패:', err);
    });
} 