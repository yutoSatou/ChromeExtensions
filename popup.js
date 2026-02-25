const convertBtn = document.getElementById("convertBtn");
const copyBtn = document.getElementById("copyBtn");
const jpInput = document.getElementById("jpInput");
const camelOutput = document.getElementById("camelOutput");
const statusEl = document.getElementById("status");

const FALLBACK_DICTIONARY = {
  今日: "today",
  明日: "tomorrow",
  天気: "weather",
  私: "i",
  猫: "cat",
  犬: "dog",
  車: "car",
  学校: "school",
  仕事: "work",
  日本: "japan",
  東京: "tokyo"
};

const toCamelCase = (text) => {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return "";

  return words
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join("");
};

const fallbackTranslate = (jpText) => {
  let converted = jpText;

  Object.entries(FALLBACK_DICTIONARY).forEach(([jp, en]) => {
    converted = converted.split(jp).join(` ${en} `);
  });

  return converted.trim() || jpText;
};

const translateToEnglish = async (jpText) => {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "ja");
  url.searchParams.set("tl", "en");
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", jpText);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Translation API error: ${response.status}`);
  }

  const data = await response.json();
  return data?.[0]?.map((chunk) => chunk?.[0] ?? "").join(" ") ?? "";
};

const convert = async () => {
  const text = jpInput.value.trim();

  if (!text) {
    statusEl.textContent = "日本語テキストを入力してください。";
    camelOutput.value = "";
    return;
  }

  statusEl.textContent = "変換中...";

  try {
    const english = await translateToEnglish(text);
    camelOutput.value = toCamelCase(english);
    statusEl.textContent = "翻訳APIで変換しました。";
  } catch (error) {
    const fallback = fallbackTranslate(text);
    camelOutput.value = toCamelCase(fallback);
    statusEl.textContent = "APIに接続できなかったため簡易辞書で変換しました。";
    console.warn(error);
  }
};

const copyResult = async () => {
  if (!camelOutput.value) {
    statusEl.textContent = "先に変換してからコピーしてください。";
    return;
  }

  try {
    await navigator.clipboard.writeText(camelOutput.value);
    statusEl.textContent = "コピーしました。";
  } catch (error) {
    statusEl.textContent = "コピーに失敗しました。手動でコピーしてください。";
    console.warn(error);
  }
};

convertBtn.addEventListener("click", convert);
copyBtn.addEventListener("click", copyResult);
jpInput.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    convert();
  }
});
