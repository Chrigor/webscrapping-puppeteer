const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch(); // abre navegador

  const page = await browser.newPage(); // abre nova pagina
  await page.goto("https://instagram.com/rocketseat_oficial"); // vá para pagina

  const imgList = await page.evaluate(() => {
    // vai ser executada no browser
    const nodeList = document.querySelectorAll("article img");
    const imgArray = [...nodeList];
    const imgList = imgArray.map(({ src }) => ({
      src,
    }));

    return imgList;
  });

  for (let index = 0; index < imgList.length; index++) {
    const { src } = imgList[index];

    let viewSource = await page.goto(src);
    fs.writeFile( `./tmp/${index}.jpg`, await viewSource.buffer(), function (err) {
      if (err) {
        return console.log(err);
      }

      console.log("The file was saved!");
    });
  }

  // escrever os dados em um arquivo local (json)
  fs.writeFile("instagram.json", JSON.stringify(imgList, null, 2), (err) => {
    if (err) {
      throw new Error("something went wrong");
    }

    console.log("Well done!");
  });

  // await page.screenshot({ path: "rocketseat.png" }); // tira uma screenshot

  await browser.close(); // fecha o browser
})();
