const request = require('request');
const cheerio = require('cheerio');

const baseUrl = 'https://mvnrepository.com/search?q=';

function run(query) {
    return new Promise((resolve, reject) => {
        request(baseUrl + query, (err, res, body) => {
            if (err) throw err;
            const $ = cheerio.load(body);
            // 첫번째 a href 가져오기
            const href = $($("#maincontent .im:nth-child(3) a:nth-child(2n)")[0]).attr('href');
            resolve(href);
        });
    })
}

function parse(href) {
    let dataList = [];
    const link = `https://mvnrepository.com/${href}`;

    return new Promise((resolve, reject) => {
        request(link, (err, res, body) => {
            if (err) throw err;
            const $ = cheerio.load(body);
            const trList = $(".gridcontainer tr");

            // 테이블 구조때문에 한번더 거르는 작업이 필요
            trList.each(function() {
                if (!isNaN(convertUsages($(this)))) {
                    dataList.push($(this));
                }
            });
            resolve({ list: sortAndCut(10, dataList), link });
        });
    })
}

// 목록 보여주기
function print({ list, link }) {
    return new Promise((resolve, reject) => {
        list.forEach((item, idx) => {
            const title = item.find(".vbtn").text();
            const usages = convertUsages(item);
            console.log(`[${idx + 1}] ${title} : ${usages}`);
        });
        resolve({ list, link });
    })
}

function getUrl(list, version, href) {
    return new Promise((resolve, reject) => {
        const title = list[version - 1].find(".vbtn").text();
        const link = `${href}/${title}`;
        resolve(link);
    })
}

function result(link, vars) {
    return new Promise((resolve, reject) => {
        request(link, (err, res, body) => {
            if (err) throw err;
            const $ = cheerio.load(body);
            vars.number === "1" ? printResult($, "#maven-a") : printResult($, "#gradle-a");
            resolve(true);
        })
    })
}

// 결과값 출력
function printResult($, selector) {
    console.log($(selector).text());
}

// 사용이 많이된 순으로 10개 정렬
function sortAndCut(count, list) {
    list.sort((a, b) => convertUsages(b) - convertUsages(a));
    return list.slice(0, count);
}

// Usages를 가져오고 , 를 없애기 위한 작업
function convertUsages(el) {
    return parseInt(el.find(`td:nth-child(${tdCount(el)}) a`).text().replace(/,/g, ""), 10);
}

// 테이블 구조때문에... td의 갯수에 따라서 가져와야되는 것이 다름 ..
function tdCount(el) {
    return el.find("td").length === 5 ? 4 : 3;
}

module.exports = { run, parse, getUrl, print, result };