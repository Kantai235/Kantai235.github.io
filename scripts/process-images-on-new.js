const front = require('hexo-front-matter')
const fs = require('hexo-fs')
const { createCanvas, loadImage, Image } = require('canvas')

/**
 * 背景圖片
 * 
 * @var {array}
 */
const backgroundImages = [
  '00008-3227999387.png',
  '00015-1118566033.png',
  '00010-988848951.png',
  '00009-3138094951.png',
  '00016-3501115819.png',
  '00018-3501115821.png',
  '00025-2386711996.png',
  '00029-2386712000.png',
  '00031-2386712002.png',
  '00032-2459415752.png',
  '00033-2459415753.png',
  '00037-2459415757.png',
  '00038-2459415758.png',
  '00042-2977946671.png',
  '00045-2977946674.png',
  '00050-2752246251.png',
  '00051-2752246252.png',
  '00054-2752246255.png',
  '00055-2752246256.png',
]

/**
 * Canvas 寬度
 * 
 * @var {int}
 */
const canvasWidth = 1200

/**
 * Canvas 高度
 * 
 * @var {int}
 */
const canvasHeight = 600

/**
 * Canvas 文字預設的字型
 * 
 * @var {string}
 */
const canvasFont = (process.platform === 'win32') ? 'AppleGothicSC' : 'PingFang serif'

/**
 * 標題所允許的最大長度
 * 畫布寬度(1200) - Padding Left(72) - Padding Right(72) = 1056
 * @var {int}
 */
const titleMaxWidth = 1056
/**
 * 標題所允許的最大行數
 * 
 * @var {int}
 */
const titleMaxLines = 3

/**
 * 標題超過部分的替代字元
 * 
 * @var {string}
 */
const titleEllipsis = '...'; // 超過部分的替代字元

/**
 * 隨機獲得 Header 圖片路徑
 * 
 * @returns {string}
 */
function getRandomBackgroundImage() {
  const index = Math.floor(Math.random() * backgroundImages.length);
  return hexo.source_dir + 'img/header/' + backgroundImages[index];
}

/**
 * 繪製標題
 * 
 * @param {Canvas}  ctx   畫布物件
 * @param {array}   lines 文字內容
 * @return {void}
 */
function drawTitle(ctx, lines) {
  const lineHeight = 96;
  const x = 72;
  const y = (500 - lineHeight * 2) / 2;

  for (let i = 0; i < lines.length; i++) {
    if (i < titleMaxLines) {
      ctx.fillText(lines[i], x, y + i * lineHeight, titleMaxWidth);
    } else {
      ctx.fillText('...', x + ctx.measureText(lines[i - 1]).width, y + (i - 1) * lineHeight);
      break;
    }
  }
}

/**
 * 繪製圓角長方形
 * 
 * @param {Canvas}  ctx     畫布物件
 * @param {int}     x       起始 X 座標
 * @param {int}     y       起始 Y 座標
 * @param {int}     width   寬度
 * @param {int}     height  高度
 * @param {int}     radius  圓角
 */
function fillRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

/**
 * 自動計算合適的標題長度
 * 
 * @param {Canvas}  ctx   畫布物件
 * @param {string}  text  文字內容
 * @return {array}
 */
function buildTitle(ctx, text) {
  ctx.fillStyle = 'black'
  ctx.font = 'bold 72px ' + canvasFont
  ctx.textAlign = 'left'

  const arr = text.split(/([】》？！，。-])(?!\w\W\s\S)/).reduce((prev, curr, i) => {
    if (i % 2 === 0) {
      prev.push(curr);
    } else {
      prev[prev.length - 1] += curr.trim() + ' ';
    }
    return prev;
  }, []);
  
  const lines = []
  let currentLine = ''
  for (let word of arr) {
    const testLine = currentLine + word + ' '
    const testWidth = ctx.measureText(testLine).width
    if (testWidth > titleMaxWidth && lines.length < titleMaxLines) {
      lines.push(currentLine)
      currentLine = word + ' '
    } else {
      currentLine = testLine
    }
  }
  lines.push(currentLine.trim())

  return lines
}

hexo.on('generateAfter', function () {
  const files = fs.listDirSync(hexo.source_dir + '_posts')
  files.forEach(file => {
    const imgDir = hexo.source_dir + 'img/posts/' + file.replace('.md', '')
    if (!fs.existsSync(imgDir)) {
      fs.mkdirsSync(imgDir)
    }

    const bannerPath = imgDir + '/banner.png'
    if (fs.existsSync(bannerPath)) {
      return
      // fs.rmdirSync(bannerPath)
    }

    const fileContent = fs.readFileSync(hexo.source_dir + '_posts/' + file)
    const fileFront = front.parse(fileContent)

    // 建立畫布
    const canvas = createCanvas(canvasWidth, canvasHeight)
    const ctx = canvas.getContext('2d')

    // 繪製圖形
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // 取得背景圖片
    const imagePath = getRandomBackgroundImage()
    loadImage(imagePath).then((image) => {
      // 計算縮放比例
      const widthRatio = image.width / canvasWidth
      const heightRatio = image.height / canvasHeight
      let imageWidth = canvasWidth
      let imageHeight = canvasHeight
      let x = 0
      let y = 0
      if (widthRatio > heightRatio) {
        imageWidth = image.width / heightRatio;
        imageHeight = image.height / heightRatio;
        y = (imageHeight - canvasHeight) / 2
      } else {
        imageWidth = image.width / widthRatio;
        imageHeight = image.height / widthRatio;
        x = (imageWidth - canvasWidth) / 2
      }

      // 設定背景圖片透明度
      ctx.globalAlpha = 0.3;

      // 繪製背景圖片
      ctx.drawImage(image, x, y, imageWidth, imageHeight)

      // 繪製白色圓角矩形
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.globalAlpha = 0.8;
      fillRoundedRect(ctx, 48, 48, canvasWidth - 96, canvasHeight - 96, 12);
      // 將透明度設回 1.0
      ctx.globalAlpha = 1.0;

      // 繪製標題
      const title = buildTitle(ctx, fileFront.title)
      drawTitle(ctx, title)

      loadImage(hexo.source_dir + 'img/avatar.jpg').then((image) => {
        const x = canvas.width - 256
        const y = canvas.height - 308

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x + 12, y);
        ctx.lineTo(x + 188, y);
        ctx.arc(x + 188, y + 12, 12, -Math.PI / 2, 0);
        ctx.lineTo(x + 200, y + 188);
        ctx.arc(x + 188, y + 188, 12, 0, Math.PI / 2);
        ctx.lineTo(x + 12, y + 200);
        ctx.arc(x + 12, y + 188, 12, Math.PI / 2, Math.PI);
        ctx.lineTo(x, y + 12);
        ctx.arc(x + 12, y + 12, 12, Math.PI, -Math.PI / 2);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(image, x, y, 200, 200);

        ctx.restore();
        
        ctx.font = '24px ' + canvasFont
        ctx.fillText('by', canvas.width - 286, canvas.height - 80);
        ctx.fillText('Kantai', canvas.width - 160, canvas.height - 80);
        ctx.fillText('Developer', canvas.width - 160, canvas.height - 56);
        ctx.font = '48px ' + canvasFont
        ctx.fillText('乾太', canvas.width - 260, canvas.height - 60);
        
        // 將圖片存為 PNG 格式
        const buffer = canvas.toBuffer('image/png')

        // 儲存圖片到本地檔案
        fs.writeFileSync(bannerPath, buffer)
      }).catch((err) => {
        console.log(err)
      })
    }).catch((err) => {
      console.log(err)
    })
  })
})
