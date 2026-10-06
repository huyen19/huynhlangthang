export default function ChatBubble() {
  return (
    <button
      aria-label="Chat với chúng tôi"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-red text-2xl text-white shadow-lg shadow-blue-900/30 hover:scale-105 transition-transform"
    >
      💬
    </button>
  );
}
