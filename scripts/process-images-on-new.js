const front = require('hexo-front-matter')
const fs = require('hexo-fs')
const { createCanvas, loadImage } = require('canvas')

const headerImages = [
  'animal-g960fd0056_1920.jpg',
  'animal-ga1f81129b_1920.jpg',
  'animal-gf420a78b4_1920.jpg',
  'cat-g0aab3bc75_1920.jpg',
  'cat-g9efbf331d_1920.jpg',
  'cat-g660fc99de_1920.jpg',
  'cat-g5222451e1_1920.jpg',
  'cat-gba427c484_1920.jpg',
  'cat-gcd53e3f6a_1920.jpg',
  'cat-gcfc36104e_1920.jpg',
  'cat-gdbfdd6775_1920.jpg',
  'cat-ge2a65b4dc_1920.jpg',
  'cat-ge63b2b9ee_1920.jpg',
  'tabby-gd596eadda_1920.jpg',
]

const canvasWidth = 1200
const canvasHeight = 600
const canvasFont = 'PingFang serif'

// 隨機獲得 Header 圖片路徑的 function
function getRandomHeaderImage() {
  const index = Math.floor(Math.random() * headerImages.length);
  return hexo.source_dir + 'img/header/' + headerImages[index];
}

// 定義繪製文字的 function
function drawText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && i > 0) {
      ctx.fillText(line, x, y);
      line = words[i] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }

  ctx.fillText(line, x, y);
}

hexo.on('generateAfter', function () {
  const files = fs.listDirSync(hexo.source_dir + '_posts')
  files.forEach(file => {
    const imgDir = hexo.source_dir + 'img/posts/' + file.replace('.md', '')
    if (!fs.existsSync(imgDir)) {
      fs.mkdirsSync(imgDir)
    }

    const bannerPath = imgDir + '/banner.png'
    // if (fs.existsSync(bannerPath)) {
    //   fs.rmdirSync(bannerPath)
    // }

    const fileContent = fs.readFileSync(hexo.source_dir + '_posts/' + file)
    const fileFront = front.parse(fileContent)

    // 建立畫布
    const canvas = createCanvas(canvasWidth, canvasHeight)
    const ctx = canvas.getContext('2d')
    
    // 繪製圖形
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    
    // 載入圖片
    const imagePath = getRandomHeaderImage()
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
      
      // 設定圖片透明度
      ctx.globalAlpha = 0.5;

      // 繪製圖片
      ctx.drawImage(image, x, y, imageWidth, imageHeight)

      // 將透明度設回 1.0
      ctx.globalAlpha = 1.0;

      // 繪製文字
      ctx.fillStyle = 'white';
      ctx.font = 'bold 72px ' + canvasFont;
      ctx.lineHeight = 72;
      ctx.textAlign = 'left';
      drawText(ctx, fileFront.title, 72, 144, canvasWidth - 144, 96);

      // 將圖片存為 PNG 格式
      const buffer = canvas.toBuffer('image/png')
      
      // 儲存圖片到本地檔案
      fs.writeFileSync(bannerPath, buffer)
    }).catch((err) => {
      console.log(err)
    })
  })
})
