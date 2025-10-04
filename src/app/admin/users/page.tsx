"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  _id: string;
  name: string;
  email: string;
  status: string;
  lastLogin?: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [selectAll, setSelectAll] = useState(false);
  const [sortAsc, setSortAsc] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/users?sort=${sortAsc ? "asc" : "desc"}`,
        { method: "GET", credentials: "include" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUsers(data.users || []);
      setSelected({});
      setSelectAll(false);
    } catch (err: any) {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [sortAsc]);

  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      setSelectAll(users.length > 0 && users.every((u) => next[u._id]));
      return next;
    });
  }

  function toggleAll() {
    const newVal = !selectAll;
    setSelectAll(newVal);
    const next: Record<string, boolean> = {};
    users.forEach((u) => (next[u._id] = newVal));
    setSelected(next);
  }

  function getSelectedIds() {
    return Object.keys(selected).filter((k) => selected[k]);
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white rounded shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Admin — Users</h2>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={sortAsc}
                onChange={() => setSortAsc((s) => !s)}
              />
              Sort by last login {sortAsc ? "↑" : "↓"}
            </label>
            <button
              onClick={() => load()}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={async () => {
              const ids = getSelectedIds();
              await Promise.all(
                ids.map((id) =>
                  fetch(`/api/admin/users/${id}/block`, { method: "PATCH" })
                )
              );
              load(); // re-fetch users after update
            }}
            disabled={getSelectedIds().length === 0}
            className="px-3 py-1 rounded bg-yellow-400 disabled:opacity-50"
          >
            Block
          </button>
          <button
            title="Unblock"
            onClick={async () => {
              const ids = getSelectedIds();
              await Promise.all(
                ids.map((id) =>
                  fetch(`/api/admin/users/${id}/unblock`, { method: "PATCH" })
                )
              );
              load(); // re-fetch users after update
            }}
            disabled={getSelectedIds().length === 0}
            className="px-2 py-1 rounded bg-green-400 disabled:opacity-50"
          >
            ⤴
          </button>
          <button
            title="Delete"
            onClick={async () => {
              const ids = getSelectedIds();
              await Promise.all(
                ids.map((id) =>
                  fetch(`/api/admin/users/${id}/delete`, { method: "DELETE" })
                )
              );
              load();
            }}
            disabled={getSelectedIds().length === 0}
            className="px-2 py-1 rounded bg-red-500 text-white disabled:opacity-50"
          >
            🗑
          </button>
          <button
            title="Delete unverified"
            onClick={async () => {
              const ids = getSelectedIds();
              await Promise.all(ids.map((id)=>fetch(`/api/admin/users/${id}/delete-unverified`, {
                method: "DELETE",
              })));
              load();
            }}
            className="px-2 py-1 rounded bg-red-300"
          >
            🧾✖
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleAll}
                  />
                </th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Last Login</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="border-t">
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={!!selected[u._id]}
                        onChange={() => toggleRow(u._id)}
                      />
                    </td>
                    <td className="px-4 py-2">{u.name}</td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2">
                      {u.lastLogin
                        ? new Date(u.lastLogin).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-4 py-2">{u.status}</td>
                  </tr>
                ))
              )}
              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center">
                    No users yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
