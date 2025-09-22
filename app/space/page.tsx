import { User, StickyNote, Plus } from "lucide-react";

export default function Page() {
  return (
    <section className="relative max-w-md mx-auto">
      <ul className="divide-y bg-white">
        {/* My Space */}
        <li className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="text-gray-500" size={20} />
            </div>
            <div>
              <div className="font-medium">My Space</div>
              <p className="text-sm text-gray-500">Pesan terakhir di sini</p>
            </div>
          </div>
          <time className="text-xs text-gray-400">08:17 AM</time>
        </li>

        {/* Binder Feedback */}
        <li className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <StickyNote className="text-yellow-600" size={20} />
            </div>
            <div>
              <div className="font-medium">Binder Feedback</div>
              <p className="text-sm text-gray-500">
                Syamsu Rijal Efendi: Keren buatan anak bangsa
              </p>
            </div>
          </div>
          <time className="text-xs text-gray-400">16 Sep</time>
        </li>
      </ul>

      <button
        className="fixed right-4 bottom-20 bg-indigo-600 text-white rounded-full p-4 shadow-lg"
        aria-label="New"
      >
        <Plus size={24} />
      </button>
    </section>
  );
}
