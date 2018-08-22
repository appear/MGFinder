const request = require('request');
const cheerio = require('cheerio');

const baseUrl = 'https://mvnrepository.com/search?q=';

function run(query) {
  return new Promise((resolve, reject) => {
    request(baseUrl + query, (err, res, body) => {
      if (err) throw err
      const $ = cheerio.load(body)
      // 첫번째 a href 가져오기
      const href = $($("#maincontent .im:nth-child(3) a:nth-child(2n)")[0]).attr('href')
      resolve(href)
    });
  })
}

function parse(href) {
  let dataList = []
  const link = `https://mvnrepository.com/${href}`

  return new Promise((resolve, reject) => {
    request(link, (err, res, body) => {
      if (err) throw err;
      const $ = cheerio.load(body)
      const trList = $(".gridcontainer tr")

      // 테이블 구조때문에 한번더 거르는 작업이 필요
      trList.each(function () {
        if (!isNaN(convertUsages($(this)))) {
          dataList.push($(this))
        }
      });
      const parseData = {list: sortAndCut(10, dataList), link}
      printList(parseData)
      resolve(parseData)
    });
  })
}

// 목록 보여주기
function printList({list, link}) {
  list.forEach((item, idx) => {
    const title = item.find(".vbtn").text()
    const usages = convertUsages(item)
    console.log(`(${idx + 1}) ${title} : ${usages} 🙂`)
  })
  return {list, link}
}

function getSelectedUrl(obj, version) {
  const title = obj.list[version - 1].find(".vbtn").text()
  return `${obj.link}/${title}`
}

function result(link, type) {
  return new Promise((resolve, reject) => {
    request(link, (err, res, body) => {
      if (err) throw err;
      const $ = cheerio.load(body)
      type === "1"
        ? console.log($("#maven-a").text())
        : console.log($("#gradle-a").text())
    })
  })
}

// 사용이 많이된 순으로 10개 정렬 차후 count 갯수 조절 가능하도록 변경
function sortAndCut(count, list) {
  return list.sort((a, b) =>
    convertUsages(b) - convertUsages(a)
  ).slice(0, count)
}

// Usages를 가져오고 , 를 없애기 위한 작업
function convertUsages(el) {
  return parseInt(el.find(`td:nth-child(${tdType(el)}) a`).text().replace(/,/g, ""), 10);
}

// 테이블 구조때문에... td의 갯수에 따라서 가져와야되는 것이 다름 ..
function tdType(el) {
  return el.find("td").length === 5 ? 4 : 3;
}

module.exports = {run, parse, getSelectedUrl, result};