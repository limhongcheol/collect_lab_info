const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// 페이지 내용 추출 함수
async function extractPageContent(page) {
    return await page.evaluate(() => {
        // 텍스트 정리 함수
        const cleanText = (text) => {
            return text
                .replace(/\\s+/g, ' ')
                .trim();
        };

        // 메인 콘텐츠 추출
        const mainContent = document.body.cloneNode(true);
        ['script', 'style', 'noscript'].forEach(tag => {
            mainContent.querySelectorAll(tag).forEach(el => el.remove());
        });

        // 이미지 정보 수집
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

// 네비게이션 메뉴 링크 추출 함수
async function getNavigationLinks(page) {
    return await page.evaluate(() => {
        const navSelectors = [
            'nav a',
            '.navigation a',
            '.nav a',
            '#navigation a',
            '#nav a',
            '.menu a',
            '#menu a',
            'header a',
            '.navbar a',
            '#navbar a'
        ];

        const links = new Set();
        navSelectors.forEach(selector => {
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

// 하우스 이모지 링크 찾기 함수
async function findHomeLinks(page) {
    return await page.evaluate(() => {
        const links = new Set();
        document.querySelectorAll('a').forEach(link => {
            if (link.textContent?.includes('🏠') && link.href) {
                links.add({
                    url: link.href,
                    text: link.textContent.trim(),
                    context: link.closest('td, div, li')?.textContent.trim() || ''
                });
            }
        });
        return Array.from(links);
    });
}

// URL이 유효한지 확인하는 함수
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// 메인 크롤링 함수
async function crawlSite(startUrl) {
    const browser = await chromium.launch({
        headless: false,
        args: ['--disable-web-security']
    });

    const context = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        ignoreHTTPSErrors: true
    });

    const page = await context.newPage();
    const visitedUrls = new Set();
    const results = [];
    const errors = [];

    try {
        // 시작 페이지 방문
        console.log('시작 URL 방문:', startUrl);
        await page.goto(startUrl, { waitUntil: 'networkidle', timeout: 30000 });

        // 하우스 이모지 링크 찾기
        const homeLinks = await findHomeLinks(page);
        console.log(`발견된 하우스 이모지 링크: ${homeLinks.length}개`);

        // 각 하우스 이모지 링크 처리
        for (const link of homeLinks) {
            if (!isValidUrl(link.url) || visitedUrls.has(link.url)) continue;

            console.log(`\\n홈 링크 처리 중: ${link.url}`);
            try {
                await page.goto(link.url, { waitUntil: 'networkidle', timeout: 30000 });
                visitedUrls.add(link.url);

                // 네비게이션 메뉴 링크 찾기
                const navLinks = await getNavigationLinks(page);
                console.log(`발견된 네비게이션 링크: ${navLinks.length}개`);

                // 메인 페이지 콘텐츠 추출
                const mainContent = await extractPageContent(page);
                results.push({
                    ...mainContent,
                    parentUrl: startUrl,
                    menuPath: '메인'
                });

                // 각 네비게이션 링크 처리
                for (const navLink of navLinks) {
                    if (!isValidUrl(navLink.url) || visitedUrls.has(navLink.url)) continue;

                    console.log(`네비게이션 링크 처리 중: ${navLink.text} (${navLink.url})`);
                    try {
                        await page.goto(navLink.url, { waitUntil: 'networkidle', timeout: 30000 });
                        visitedUrls.add(navLink.url);

                        const content = await extractPageContent(page);
                        results.push({
                            ...content,
                            parentUrl: link.url,
                            menuPath: navLink.text
                        });

                    } catch (error) {
                        console.error(`네비게이션 페이지 처리 오류 (${navLink.url}):`, error.message);
                        errors.push({ url: navLink.url, error: error.message });
                    }
                }

            } catch (error) {
                console.error(`홈 페이지 처리 오류 (${link.url}):`, error.message);
                errors.push({ url: link.url, error: error.message });
            }
        }

        // 결과 저장
        // 1. 메인 CSV 파일 (페이지 정보)
        const csvRows = results.map(result => {
            return [
                result.url,
                result.title,
                result.parentUrl,
                result.menuPath,
                result.meta.description,
                result.content.replace(/"/g, '""'),
                result.images.length
            ].map(field => `"${String(field).replace(/"/g, '""')}"`)
            .join(',');
        });

        const csvHeader = 'URL,제목,부모URL,메뉴경로,설명,내용,이미지수\n';
        fs.writeFileSync('lab_pages_content.csv', csvHeader + csvRows.join('\\n'));

        // 2. 이미지 정보 CSV 파일
        const imageRows = results.flatMap(result =>
            result.images.map(img => [
                result.url,
                result.menuPath,
                img.src,
                img.alt,
                img.title,
                img.width,
                img.height
            ].map(field => `"${String(field).replace(/"/g, '""')}"`)
            .join(','))
        );

        const imageHeader = '페이지URL,메뉴경로,이미지URL,대체텍스트,이미지제목,너비,높이\n';
        fs.writeFileSync('lab_images_info.csv', imageHeader + imageRows.join('\\n'));

        // 3. 오류 로그
        if (errors.length > 0) {
            fs.writeFileSync('crawl_errors.json', JSON.stringify(errors, null, 2));
        }

        // 결과 요약 출력
        console.log('\\n크롤링 완료:');
        console.log(`- 총 ${results.length}개 페이지 수집`);
        console.log(`- 총 ${imageRows.length}개 이미지 발견`);
        console.log(`- 총 ${errors.length}개 오류 발생`);
        
        const menuPaths = new Set(results.map(r => r.menuPath));
        console.log('\\n발견된 메뉴:', Array.from(menuPaths).join(', '));

    } finally {
        await browser.close();
    }
}

// 크롤러 실행
const startUrl = 'https://home.sejong.ac.kr/~aidsdpt/12.html';
crawlSite(startUrl).catch(console.error);
