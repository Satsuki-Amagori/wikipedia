async function fetchMetadata(url) {
    try {
        const response = await fetch(url);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        const keywordsMeta = doc.querySelector("meta[name='keywords']");
        const keywords = keywordsMeta ? keywordsMeta.content.split(",") : [];
        return { url, keywords };
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        return { url, keywords: [] };
    }
}

async function loadPages() {
    const response = await fetch("sitemap.json");
    const pages = await response.json();
    const pageData = await Promise.all(pages.map(fetchMetadata));
    return pageData;
}

async function search() {
    const query = document.getElementById("search-box").value.trim().toLowerCase();
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = "";

    if (query === "") return;

    const pages = await loadPages();
    const results = pages.filter(page =>
        page.keywords.some(keyword => keyword.toLowerCase().includes(query))
    );

    if (results.length === 0) {
        resultsContainer.innerHTML = "<p>該当するページが見つかりません。</p>";
    } else {
        results.forEach(page => {
            const fileName = page.url.split("/").pop().replace(".html", ""); // ファイル名のみ取得
            const link = document.createElement("a");
            link.href = page.url;
            link.textContent = fileName;
            resultsContainer.appendChild(link);
            resultsContainer.appendChild(document.createElement("br"));
        });
    }
}

document.addEventListener("DOMContentLoaded", loadPages);
