const puppeteer = require('puppeteer');

(async () => {
    //打开浏览器
    const browser = await puppeteer.launch({
       //是否以无头模式运行浏览器
       headless:false
    });
    //打开标签页
    const page = await browser.newPage();
    //输入你要爬取的url地址
    await page.goto('https://movie.douban.com/coming', {waitUntil: 'load'});
    //等待页面加载完成开始爬取数据
    const result = await page.evaluate(() => {
     //定义一个容器
        let result = [];
      //开始爬取数据
        const $tds =$('.coming_list>tbody>tr').find('td:last')
        for (let i = 0; i < $tds.length; i++) {
            let $td =$($tds[i]);
            let num = +$td.text().split('人')[0];
            if (num >= 1000){
                const href = $td.parent().find('td:nth(1)>a').attr('href')
                result.push(href);
            }
        }
        //将数据返回出去
        return result;
    })
    console.log(result)
    await browser.close();
})();