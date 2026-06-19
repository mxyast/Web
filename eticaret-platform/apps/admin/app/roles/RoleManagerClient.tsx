"use client";

import { useState } from "react";
import { Shield, PlusCircle, Trash2, Edit2, CheckSquare, Square, Save, X } from "lucide-react";
import { createRole, updateRole, deleteRole } from "./actions";

interface RoleDefinition {
  name: string;
  description: string | null;
  permissions: string[];
}

interface RoleManagerClientProps {
  initialRoles: RoleDefinition[];
}

const AVAILABLE_PERMISSIONS = [
  { key: "ACCESS_ADMIN", label: "Admin Paneline Giriş", desc: "Kullanıcının admin paneline erişimini sağlar." },
  { key: "MANAGE_PRODUCTS", label: "Ürün Yönetimi", desc: "Ürün, kategori, katalog ekleme ve düzenleme." },
  { key: "MANAGE_ORDERS", label: "Sipariş Yönetimi", desc: "Siparişleri görüntüleme ve durum güncelleme." },
  { key: "MANAGE_USERS", label: "Kullanıcı Yönetimi", desc: "Kullanıcı oluşturma, pasife alma, silme." },
  { key: "MANAGE_SETTINGS", label: "Sistem Ayarları", desc: "Genel site ve güvenlik yapılandırmaları." }
];

export function RoleManagerClient({ initialRoles }: RoleManagerClientProps) {
  const [roles, setRoles] = useState<RoleDefinition[]>(initialRoles);
  const [editingRole, setEditingRole] = useState<RoleDefinition | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const togglePermission = (permKey: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permKey) ? prev.filter(k => k !== permKey) : [...prev, permKey]
    );
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await createRole(name, description, selectedPermissions);
      alert("Rol başarıyla oluşturuldu.");
      setRoles(prev => [...prev, { name: name.trim().toUpperCase(), description, permissions: selectedPermissions }]);
      setName("");
      setDescription("");
      setSelectedPermissions([]);
    } catch (err: any) {
      alert(err.message || "Hata oluştu.");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRole) return;

    try {
      await updateRole(editingRole.name, editingRole.description || "", editingRole.permissions);
      alert("Rol başarıyla güncellendi.");
      setRoles(prev => prev.map(r => r.name === editingRole.name ? editingRole : r));
      setEditingRole(null);
    } catch (err: any) {
      alert(err.message || "Hata oluştu.");
    }
  };

  const handleDelete = async (roleName: string) => {
    if (["ADMIN", "CUSTOMER", "DEALER"].includes(roleName)) {
      alert("Sistem rollerini (ADMIN, CUSTOMER, DEALER) silemezsiniz.");
      return;
    }
    if (!confirm(`${roleName} rolünü silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      await deleteRole(roleName);
      setRoles(prev => prev.filter(r => r.name !== roleName));
    } catch (err: any) {
      alert(err.message || "Hata oluştu.");
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-in fade-in duration-300">
      
      {/* Dynamic Role Creation/Edit Panel */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-fit">
        {editingRole ? (
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-amber-600" />
                <h2 className="text-lg font-bold text-gray-800">Rolü Düzenle</h2>
              </div>
              <button onClick={() => setEditingRole(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-wider mb-2">Rol Adı</label>
                <input
                  type="text"
                  value={editingRole.name}
                  disabled
                  className="w-full bg-gray-100 border-none rounded-lg py-2.5 px-3.5 text-gray-500 font-bold text-sm outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-wider mb-2">Açıklama</label>
                <input
                  type="text"
                  value={editingRole.description || ""}
                  onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                  placeholder="örn: Destek Ekipleri Yetkileri"
                  className="w-full bg-slate-50 border border-gray-200 focus:border-blue-500 rounded-lg py-2.5 px-3.5 text-gray-800 text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="space-y-3 pt-2">
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-wider">Yetkiler</label>
                <div className="space-y-2">
                  {AVAILABLE_PERMISSIONS.map(perm => {
                    const isChecked = editingRole.permissions.includes(perm.key);
                    return (
                      <div
                        key={perm.key}
                        onClick={() => {
                          const newPerms = isChecked
                            ? editingRole.permissions.filter(k => k !== perm.key)
                            : [...editingRole.permissions, perm.key];
                          setEditingRole({ ...editingRole, permissions: newPerms });
                        }}
                        className="flex items-start gap-3 p-2.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                      >
                        {isChecked ? (
                          <CheckSquare className="w-5 h-5 text-blue-600 shrink-0" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-300 shrink-0" />
                        )}
                        <div>
                          <p className="text-xs font-bold text-gray-800">{perm.label}</p>
                          <p className="text-[10px] text-gray-500">{perm.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-black text-white font-bold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-slate-900/10"
              >
                <Save className="w-4 h-4" /> Değişiklikleri Kaydet
              </button>
            </form>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <PlusCircle className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-800">Yeni Rol Tanımla</h2>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-wider mb-2">Rol Adı</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="örn: SUPPORT, MANAGER"
                  required
                  className="w-full bg-slate-50 border border-gray-200 focus:border-blue-500 rounded-lg py-2.5 px-3.5 text-gray-800 placeholder-gray-400 text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all font-bold"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-wider mb-2">Açıklama</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="örn: Canlı destek ve müşteri ilişkileri ekibi"
                  className="w-full bg-slate-50 border border-gray-200 focus:border-blue-500 rounded-lg py-2.5 px-3.5 text-gray-800 placeholder-gray-400 text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="space-y-3 pt-2">
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-wider">Yetkiler</label>
                <div className="space-y-2 animate-in fade-in">
                  {AVAILABLE_PERMISSIONS.map(perm => {
                    const isChecked = selectedPermissions.includes(perm.key);
                    return (
                      <div
                        key={perm.key}
                        onClick={() => togglePermission(perm.key)}
                        className="flex items-start gap-3 p-2.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                      >
                        {isChecked ? (
                          <CheckSquare className="w-5 h-5 text-blue-600 shrink-0" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-300 shrink-0" />
                        )}
                        <div>
                          <p className="text-xs font-bold text-gray-800">{perm.label}</p>
                          <p className="text-[10px] text-gray-500">{perm.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/10"
              >
                Rol Oluştur
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Role List Table */}
      <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
          <Shield className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-bold text-gray-800">Tüm Tanımlı Roller ({roles.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Rol</th>
                <th className="px-4 py-3">Açıklama</th>
                <th className="px-4 py-3">Aktif Yetkiler</th>
                <th className="px-4 py-3 rounded-r-lg text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {roles.map((role) => (
                <tr key={role.name} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-4">
                    <span className="font-bold text-slate-900 tracking-wide text-xs">{role.name}</span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-xs text-gray-500">{role.description || "-"}</p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.length === 0 ? (
                        <span className="text-[10px] text-gray-400 italic">Yetki Yok</span>
                      ) : (
                        role.permissions.map(perm => (
                          <span key={perm} className="text-[9px] font-extrabold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
                            {perm}
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingRole(role)}
                        className="p-1.5 border border-gray-200 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
                        title="Düzenle"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(role.name)}
                        disabled={["ADMIN", "CUSTOMER", "DEALER"].includes(role.name)}
                        className={`p-1.5 border rounded-lg transition-all ${
                          ["ADMIN", "CUSTOMER", "DEALER"].includes(role.name)
                            ? "border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50"
                            : "border-red-200 text-red-600 bg-red-50 hover:bg-red-100 cursor-pointer"
                        }`}
                        title="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
  );
}
