const { chromium } = require('playwright');
const fs = require('fs');

// 텍스트 정리 및 콘텐츠 추출
async function extractPageContent(page) {
    return await page.evaluate(() => {
        const cleanText = (text) => text.replace(/\s+/g, ' ').trim();
        const mainContent = document.body.cloneNode(true);
        ['script', 'style', 'noscript'].forEach(tag => {
            mainContent.querySelectorAll(tag).forEach(el => el.remove());
        });

        const images = Array.from(document.images).map(img => ({
            src: img.src,
            alt: img.alt || '',
            title: img.title || '',
            width: img.width,
            height: img.height
        }));

        return {
            title: document.title,
            url: window.location.href,
            content: cleanText(mainContent.textContent || ''),
            images: images,
            meta: {
                description: document.querySelector('meta[name="description"]')?.content || '',
                keywords: document.querySelector('meta[name="keywords"]')?.content || ''
            }
        };
    });
}

async function getNavigationLinks(page) {
    return await page.evaluate(() => {
        const selectors = ['nav a', '.navigation a', '.nav a', '#navigation a', '.menu a', 'header a', '.navbar a'];
        const links = new Set();
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(link => {
                if (link.href && !link.href.includes('javascript:') && !link.href.includes('#')) {
                    links.add({
                        url: link.href,
                        text: link.textContent.trim(),
                        isActive: link.classList.contains('active') || link.getAttribute('aria-current') === 'page'
                    });
                }
            });
        });
        return Array.from(links);
    });
}

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// 연구실 상세 페이지로 가서 홈페이지 주소 추출
async function getHomepageFromDetail(page, detailUrl) {
    try {
        await page.goto(detailUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
        const homepage = await page.evaluate(() => {
            return document.querySelector('a.button.homepage')?.href || null;
        });
        return homepage;
    } catch (e) {
        console.error(`❌ 상세 페이지 에러: ${detailUrl}`, e.message);
        return null;
    }
}

// 연구실 목록 페이지에서 상세 페이지 주소 추출하고 homepage 추출
async function extractLabHomepages(page, listUrl) {
    await page.goto(listUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const detailPageUrls = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('li.laboratory-list-wrap a.banner-link'))
            .map(el => el.href);
    });

    const homepages = [];
    for (const detailUrl of detailPageUrls) {
        const absoluteDetailUrl = detailUrl.startsWith('http') ? detailUrl : `https://higrad.net${detailUrl}`;
        console.log(`🔍 상세 페이지 이동: ${absoluteDetailUrl}`);
        const homepage = await getHomepageFromDetail(page, absoluteDetailUrl);
        if (homepage) {
            console.log(`✅ 홈페이지 발견: ${homepage}`);
            homepages.push(homepage);
        } else {
            console.log(`⚠️ 홈페이지 없음: ${absoluteDetailUrl}`);
        }
    }

    return homepages;
}

// 각 홈페이지 크롤링
async function crawlSites(homepages) {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, ignoreHTTPSErrors: true });
    const page = await context.newPage();

    const visitedUrls = new Set();
    const results = [];
    const errors = [];

    for (const homepage of homepages) {
        if (!isValidUrl(homepage) || visitedUrls.has(homepage)) continue;

        try {
            console.log(`🏠 홈페이지 방문 중: ${homepage}`);
            await page.goto(homepage, { waitUntil: 'networkidle', timeout: 30000 });
            visitedUrls.add(homepage);

            const navLinks = await getNavigationLinks(page);
            const mainContent = await extractPageContent(page);
            results.push({ ...mainContent, parentUrl: homepage, menuPath: '메인' });

            for (const navLink of navLinks) {
                if (!isValidUrl(navLink.url) || visitedUrls.has(navLink.url)) continue;

                try {
                    console.log(`➡️ 메뉴 이동: ${navLink.text} (${navLink.url})`);
                    await page.goto(navLink.url, { waitUntil: 'networkidle', timeout: 30000 });
                    visitedUrls.add(navLink.url);

                    const content = await extractPageContent(page);
                    results.push({ ...content, parentUrl: homepage, menuPath: navLink.text });
                } catch (error) {
                    console.error(`❌ 메뉴 처리 오류 (${navLink.url}):`, error.message);
                    errors.push({ url: navLink.url, error: error.message });
                }
            }
        } catch (error) {
            console.error(`❌ 홈페이지 처리 오류 (${homepage}):`, error.message);
            errors.push({ url: homepage, error: error.message });
        }
    }

    await browser.close();
    return { results, errors };
}

// 결과 저장
function saveResults(results, errors) {
    const csvRows = results.map(result => {
        return [
            result.url,
            result.title,
            result.parentUrl,
            result.menuPath,
            result.meta.description,
            result.content.substring(0, 1000).replace(/"/g, '""'),
            result.images.length
        ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');
    });
    fs.writeFileSync('lab_pages_content.csv', 'URL,제목,부모URL,메뉴경로,설명,내용,이미지수\n' + csvRows.join('\n'));

    const imageRows = results.flatMap(result =>
        result.images.map(img => [
            result.url,
            result.menuPath,
            img.src,
            img.alt,
            img.title,
            img.width,
            img.height
        ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    );
    fs.writeFileSync('lab_images_info.csv', '페이지URL,메뉴경로,이미지URL,대체텍스트,이미지제목,너비,높이\n' + imageRows.join('\n'));

    if (errors.length > 0) {
        fs.writeFileSync('crawl_errors.json', JSON.stringify(errors, null, 2));
    }

    console.log('\n✅ 크롤링 완료');
    console.log(`- 페이지 수: ${results.length}`);
    console.log(`- 이미지 수: ${imageRows.length}`);
    console.log(`- 오류 수: ${errors.length}`);
}

// 실행 함수
async function main() {
    // const labListUrl = 'https://higrad.net/laboratory/organizations?page=1&pagingno=1&keyword=%23%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5&pagesize=10&sortType=FREQ&limit=25&displayType=QNA&siteid=3';
    // const labListUrl = 'https://higrad.net/laboratory/organizations?page=2&pagingno=1&keyword=%23%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5&pagesize=10&sortType=FREQ&limit=25&displayType=QNA&siteid=3';
    //const labListUrl = 'https://higrad.net/laboratory/organizations?page=3&pagingno=1&keyword=%23%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5&pagesize=10&sortType=FREQ&limit=25&displayType=QNA&siteid=3';
    // const labListUrl = 'https://higrad.net/laboratory/organizations?page=4&pagingno=1&keyword=%23%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5&pagesize=10&sortType=FREQ&limit=25&displayType=QNA&siteid=3';
    //const labListUrl = 'https://higrad.net/laboratory/organizations?page=5&pagingno=1&keyword=%23%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5&pagesize=10&sortType=FREQ&limit=25&displayType=QNA&siteid=3';
    const labListUrl = 'https://higrad.net/laboratory/organizations?page=6&pagingno=1&keyword=%23%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5&pagesize=10&sortType=FREQ&limit=25&displayType=QNA&siteid=3';

    
    
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    const homepages = await extractLabHomepages(page, labListUrl);
    await browser.close();

    const { results, errors } = await crawlSites(homepages);
    saveResults(results, errors);
}

main().catch(console.error);
