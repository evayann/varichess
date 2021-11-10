// Export from https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces

for (let j = 3; j < 14; j++) {
    for (let i = 2; i < 4; i++) {
        console.log(document.querySelector("#mw-content-text > div.mw-parser-output > div > div:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(" + j + ") > td:nth-child(" + i + ") > a").href)
    }
}

// To download image 
async function downloadImage(imageSrc) {
    const image = await fetch(imageSrc)
    const imageBlog = await image.blob()
    const imageURL = URL.createObjectURL(imageBlog)
  
    const link = document.createElement('a')
    link.href = imageURL
    link.download = 'image file name here'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }