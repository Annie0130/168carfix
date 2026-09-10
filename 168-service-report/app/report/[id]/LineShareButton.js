"use client";

export default function LineShareButton({ url, text }) {
  const shareUrl = `https://line.me/R/msg/text/?${encodeURIComponent(text + "\n" + url)}`;

  return (
    <a
      href={shareUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 border border-line text-ink px-4 py-2 rounded-sm hover:bg-ink hover:text-paper transition-colors font-mono-data text-sm no-print"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 5.94 2 10.7c0 4.27 3.54 7.85 8.32 8.53.32.07.76.21.87.49.1.25.07.64.03.9l-.14.85c-.04.25-.2.98.86.53 1.05-.44 5.68-3.35 7.75-5.72C21.03 14.09 22 12.48 22 10.7 22 5.94 17.52 2 12 2z" />
      </svg>
      分享到 LINE
    </a>
  );
}
