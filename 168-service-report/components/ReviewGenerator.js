"use client";

import { useState } from "react";

const TAGS = ["維修速度快", "技師講解清楚", "價格合理", "服務態度好", "環境整潔"];
const GOOGLE_REVIEW_URL =
  "https://search.google.com/local/writereview?placeid=0x346803ad2b2c58eb:0xf4f090a040c73c5b";

function buildReviewText(stars, selectedTags, comment) {
  const intros = ["在168汽車維修中心維修愛車,", "這次來168汽車維修中心保養,", "來168汽車維修中心處理車子,"];
  const intro = intros[Math.floor(Math.random() * intros.length)];

  const tagPhrases = {
    "維修速度快": "維修速度很快",
    "技師講解清楚": "技師講解得很清楚仔細",
    "價格合理": "價格也算合理透明",
    "服務態度好": "服務態度非常親切",
    "環境整潔": "環境整潔乾淨",
  };

  const parts = selectedTags.map((t) => tagPhrases[t]).filter(Boolean);
  const middle = parts.length > 0 ? parts.join("、") + "。" : "";

  const ending =
    stars >= 4
      ? "整體體驗很滿意,推薦給大家!"
      : "整體來說還算不錯,會再考慮回來。";

  const extra = comment.trim() ? comment.trim() + " " : "";

  return `${intro}${middle}${extra}${ending}`;
}

export default function ReviewGenerator() {
  const [stars, setStars] = useState(5);
  const [selectedTags, setSelectedTags] = useState([]);
  const [comment, setComment] = useState("");
  const [generated, setGenerated] = useState("");
  const [copied, setCopied] = useState(false);

  function toggleTag(tag) {
    setSelectedTags((list) =>
      list.includes(tag) ? list.filter((t) => t !== tag) : [...list, tag]
    );
  }

  function generate() {
    setGenerated(buildReviewText(stars, selectedTags, comment));
    setCopied(false);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(generated);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="border border-line bg-white rounded-sm p-5 no-print">
      <h3 className="font-display text-lg text-ink mb-1">這次服務還滿意嗎?</h3>
      <p className="text-xs text-ink/50 mb-4">花 10 秒幫我們留一則評論,對小店很有幫助 🙏</p>

      <div className="flex gap-1 mb-4 text-2xl">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setStars(n)}
            className={n <= stars ? "text-amber-400" : "text-line"}
          >
            ★
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
              selectedTags.includes(tag)
                ? "bg-steel text-white border-steel"
                : "border-line text-ink/60"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <textarea
        className="w-full border border-line rounded-sm px-3 py-2 text-sm outline-none focus:border-steel mb-3"
        rows={2}
        placeholder="想額外補充什麼嗎?(選填)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button
        type="button"
        onClick={generate}
        className="bg-ink text-paper px-4 py-2 rounded-sm text-sm hover:bg-steel transition-colors mb-3"
      >
        產生評論文字
      </button>

      {generated && (
        <div className="border border-line rounded-sm p-3 bg-paper/60 mb-3">
          <p className="text-sm text-ink/80 whitespace-pre-wrap leading-relaxed">{generated}</p>
        </div>
      )}

      {generated && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copy}
            className="border border-line px-4 py-2 rounded-sm text-sm hover:border-steel"
          >
            {copied ? "已複製 ✓" : "一鍵複製"}
          </button>
          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-steel text-white px-4 py-2 rounded-sm text-sm hover:bg-ink transition-colors"
          >
            前往 Google 評論
          </a>
        </div>
      )}
    </div>
  );
}
