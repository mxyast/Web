"use client";

import { useState } from "react";
import { Users, UserPlus, Shield, Trash2, CheckCircle2, XCircle, AlertCircle, Check, X } from "lucide-react";
import { createUser, updateUserRole, toggleUserStatus, deleteUser, approveActionRequest, rejectActionRequest } from "./actions";

interface UserListClientProps {
  initialUsers: any[];
  initialRequests?: any[];
  roles?: any[];
}

export function UserListClient({ initialUsers, initialRequests = [], roles = [] }: UserListClientProps) {
  const [users, setUsers] = useState(initialUsers);
  const [requests, setRequests] = useState(initialRequests);

  const activeRoles = roles.length > 0 ? roles : [
    { name: "ADMIN", description: "Tam yetkili sistem yöneticisi" },
    { name: "DEALER", description: "B2B toptan alım bayisi" },
    { name: "CUSTOMER", description: "B2C perakende alışveriş müşterisi" }
  ];

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUserRole(userId, newRole);
      setUsers(prev =>
        prev.map(u => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      alert("Rol güncellenirken hata oluştu.");
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await toggleUserStatus(userId, currentStatus);
      setUsers(prev =>
        prev.map(u => (u.id === userId ? { ...u, isActive: !currentStatus } : u))
      );
    } catch (err) {
      alert("Durum güncellenirken hata oluştu.");
    }
  };

  const handleDelete = async (userId: string, name: string) => {
    if (!confirm(`${name} kullanıcısını silmek istediğinize emin misiniz?`)) {
      return;
    }
    try {
      await deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      alert("Kullanıcı silinirken hata oluştu.");
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      await approveActionRequest(requestId);
      alert("İşlem onaylandı ve kullanıcı hesabı aktifleştirildi!");
      setRequests(prev => prev.filter(r => r.id !== requestId));
      window.location.reload();
    } catch (err: any) {
      alert(err.message || "Onaylanırken hata oluştu.");
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await rejectActionRequest(requestId);
      alert("Talep reddedildi.");
      setRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (err: any) {
      alert(err.message || "Reddedilirken hata oluştu.");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Reactivation Request Queue Section */}
      {requests.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-amber-200/60">
            <AlertCircle className="w-5 h-5 text-amber-600 animate-pulse" />
            <h2 className="text-md font-bold text-amber-800">Pasif Kullanıcı Talep & Onay Havuzu ({requests.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead>
                <tr className="text-xs text-amber-800 font-bold uppercase tracking-wider">
                  <th className="pb-3">Kullanıcı</th>
                  <th className="pb-3">Platform/Eylem</th>
                  <th className="pb-3">Açıklama</th>
                  <th className="pb-3">Tarih</th>
                  <th className="pb-3 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-200/40">
                {requests.map((req) => (
                  <tr key={req.id} className="text-xs">
                    <td className="py-3 font-semibold text-gray-900">
                      {req.user.name} <span className="font-normal text-gray-500">({req.user.email})</span>
                    </td>
                    <td className="py-3 font-bold text-amber-700">{req.actionType}</td>
                    <td className="py-3 text-gray-600 max-w-xs truncate">{req.description}</td>
                    <td className="py-3 text-gray-500">{new Date(req.createdAt).toLocaleString("tr-TR")}</td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleApproveRequest(req.id)}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" /> Onayla ve Etkinleştir
                        </button>
                        <button
                          onClick={() => handleRejectRequest(req.id)}
                          className="bg-red-100 hover:bg-red-200 text-red-700 font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" /> Reddet
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* New User Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <UserPlus className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-800">Yeni Kullanıcı Ekle</h2>
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              try {
                await createUser(formData);
                alert("Kullanıcı başarıyla eklendi.");
                window.location.reload();
              } catch (err: any) {
                alert(err.message || "Kullanıcı oluşturulurken bir hata oluştu.");
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">
                Ad Soyad
              </label>
              <input
                name="name"
                type="text"
                required
                placeholder="Ahmet Yılmaz"
                className="w-full bg-slate-50 border border-gray-200 focus:border-blue-500 rounded-lg py-2.5 px-3.5 text-gray-800 placeholder-gray-400 text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">
                E-Posta Adresi
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="ahmet@sirket.com"
                className="w-full bg-slate-50 border border-gray-200 focus:border-blue-500 rounded-lg py-2.5 px-3.5 text-gray-800 placeholder-gray-400 text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">
                Şifre
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-gray-200 focus:border-blue-500 rounded-lg py-2.5 px-3.5 text-gray-800 placeholder-gray-400 text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">
                Kullanıcı Rolü
              </label>
              <select
                name="role"
                required
                className="w-full bg-slate-50 border border-gray-200 focus:border-blue-500 rounded-lg py-2.5 px-3.5 text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-sm font-semibold"
              >
                {activeRoles.map((r) => (
                  <option key={r.name} value={r.name}>
                    {r.name} {r.description ? `(${r.description})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
            >
              Kullanıcıyı Kaydet
            </button>
          </form>
        </div>

        {/* User List Table Card */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <Users className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-bold text-gray-800">Kullanıcı Listesi ({users.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Kullanıcı</th>
                  <th className="px-4 py-3">Rol</th>
                  <th className="px-4 py-3">Durum</th>
                  <th className="px-4 py-3 rounded-r-lg text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="bg-slate-50 border border-gray-200 text-xs font-semibold rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {activeRoles.map((r) => (
                          <option key={r.name} value={r.name}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                          user.isActive
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {user.isActive ? "Aktif" : "Pasif"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Toggle status action */}
                        <button
                          onClick={() => handleToggleStatus(user.id, user.isActive)}
                          title={user.isActive ? "Pasife Al" : "Aktife Al"}
                          className={`p-1.5 rounded-lg border transition-all hover:scale-105 cursor-pointer ${
                            user.isActive
                              ? "border-yellow-200 text-yellow-600 bg-yellow-50 hover:bg-yellow-100"
                              : "border-green-200 text-green-600 bg-green-50 hover:bg-green-100"
                          }`}
                        >
                          {user.isActive ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                        </button>

                        {/* Delete action */}
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          title="Sil"
                          className="p-1.5 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg hover:scale-105 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
