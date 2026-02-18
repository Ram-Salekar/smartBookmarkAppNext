"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    init();
  }, []);

  useEffect(() => {
    if (!user) return;

    fetchBookmarks();

    const channel = supabase
      .channel("bookmarks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        () => fetchBookmarks()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setBookmarks(data);
  };

  const addOrUpdateBookmark = async () => {
    if (!user) return;

    if (editingId) {
      await supabase
        .from("bookmarks")
        .update({ title, url })
        .eq("id", editingId);

      setEditingId(null);
    } else {
      await supabase.from("bookmarks").insert({
        title,
        url,
        user_id: user.id,
      });
    }

    setTitle("");
    setUrl("");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.replace("/");
  };

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
  };

  const startEdit = (bookmark: any) => {
    setTitle(bookmark.title);
    setUrl(bookmark.url);
    setEditingId(bookmark.id);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">My Bookmarks</h1>
          <button
            onClick={logout}
            className="text-sm text-gray-600 hover:text-black"
          >
            Logout
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">
            {editingId ? "Edit Bookmark" : "Add New Bookmark"}
          </h2>

          <input
            placeholder="Bookmark Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 
           placeholder-gray-600 text-gray-800
           focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 
           placeholder-gray-600 text-gray-800
           focus:outline-none focus:ring-2 focus:ring-black"
          />

          <button
            onClick={addOrUpdateBookmark}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
          >
            {editingId ? "Update Bookmark" : "Add Bookmark"}
          </button>
        </div>

        {/* Bookmark List */}
        <div className="space-y-4">
          {bookmarks.length === 0 ? (
            <div className="text-center text-gray-500">
              No bookmarks yet. Add your first one 🚀
            </div>
          ) : (
            bookmarks.map((b) => (
              <div
                key={b.id}
                className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition flex justify-between items-center"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-gray-800">{b.title}</p>
                  <a
                    href={b.url}
                    target="_blank"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {b.url}
                  </a>
                </div>

                <div className="flex space-x-4 text-sm">
                  <button
                    onClick={() => startEdit(b)}
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteBookmark(b.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
