import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, MapPin, Search, Loader, X, Check } from 'lucide-react';
import { getAllLocationsAdmin, createLocation, updateLocation, deleteLocation } from '../api/locationsApi';

const CATEGORIES = ['Academic','Administrative','Accommodation','Dining','Entrance','Events','Health Services','Parking','Recreation','Religious','Research','Student Services','Other'];
const empty = { name:'', category:'Academic', maps_url:'', description:'', is_active:true };

export default function AdminLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const { data } = await getAllLocationsAdmin();
    setLocations(data || []);
    setLoading(false);
  };

  const openAdd = () => { setEditing(null); setForm(empty); setFormError(''); setShowModal(true); };
  const openEdit = (l) => { setEditing(l); setForm({ name:l.name, category:l.category, maps_url:l.maps_url, description:l.description||'', is_active:l.is_active }); setFormError(''); setShowModal(true); };

  const save = async () => {
    if (!form.name.trim()) { setFormError('Name required.'); return; }
    if (!form.maps_url.trim()) { setFormError('Maps link required.'); return; }
    if (!form.maps_url.startsWith('http')) { setFormError('Enter a valid URL.'); return; }
    setSaving(true);
    const p = { name:form.name.trim(), category:form.category, maps_url:form.maps_url.trim(), description:form.description.trim(), is_active:form.is_active };
    const r = editing ? await updateLocation(editing.id, p) : await createLocation(p);
    if (r.error) { setFormError(r.error.message||r.error); setSaving(false); return; }
    setShowModal(false); load(); setSaving(false);
  };

  const remove = async (l) => {
    if (!confirm(`Delete "${l.name}"?`)) return;
    await deleteLocation(l.id); load();
  };

  const filtered = locations.filter(l => l.name.toLowerCase().includes(search.toLowerCase()) || l.category.toLowerCase().includes(search.toLowerCase()));
  const grouped = filtered.reduce((a, l) => { if (!a[l.category]) a[l.category]=[]; a[l.category].push(l); return a; }, {});

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader className="w-10 h-10 text-blue-600 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Campus Locations</h1>
          <p className="text-gray-500 text-sm mt-1">Paste a Google Maps share link for each location</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
          </div>
          <button onClick={openAdd} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700">
            <Plus className="w-4 h-4" />Add Location
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[['Total',locations.length,'text-blue-600'],['Active',locations.filter(l=>l.is_active).length,'text-green-600'],['Categories',Object.keys(grouped).length,'text-purple-600'],['Hidden',locations.filter(l=>!l.is_active).length,'text-gray-400']].map(([label,val,color])=>(
            <div key={label} className="bg-white rounded-xl shadow-sm p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{val}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {Object.keys(grouped).length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <MapPin className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{search ? 'No results' : 'No locations yet'}</h3>
            <p className="text-gray-500 text-sm mb-4">{search ? 'Try different keywords.' : 'Add your first campus location.'}</p>
            {!search && <button onClick={openAdd} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold">Add Location</button>}
          </div>
        ) : Object.entries(grouped).map(([cat, locs]) => (
          <div key={cat} className="mb-5">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{cat}</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden divide-y divide-gray-100">
              {locs.map(loc => (
                <div key={loc.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${loc.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{loc.name}</p>
                      {loc.description && <p className="text-xs text-gray-400">{loc.description}</p>}
                      <a href={loc.maps_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline truncate block max-w-xs">
                        {loc.maps_url.length > 50 ? loc.maps_url.substring(0,50)+'...' : loc.maps_url}
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <button onClick={()=>openEdit(loc)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={()=>remove(loc)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-bold">{editing ? 'Edit Location' : 'Add Location'}</h2>
              <button onClick={()=>setShowModal(false)} className="p-1.5 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location Name *</label>
                <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Department of Law" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                  {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Link *</label>
                <input type="url" value={form.maps_url} onChange={e=>setForm({...form,maps_url:e.target.value})} placeholder="https://maps.app.goo.gl/..." className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                <p className="text-xs text-gray-400 mt-1">Google Maps → find location → Share → Copy link</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <input value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="e.g. Ground floor, Block C" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div><p className="text-sm font-medium">Visible to users</p><p className="text-xs text-gray-500">Show in campus map dropdown</p></div>
                <button onClick={()=>setForm({...form,is_active:!form.is_active})} className={`relative w-11 h-6 rounded-full transition-colors ${form.is_active?'bg-blue-600':'bg-gray-300'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_active?'translate-x-6':'translate-x-1'}`} />
                </button>
              </div>
              {formError && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{formError}</div>}
            </div>
            <div className="flex gap-3 p-5 border-t">
              <button onClick={()=>setShowModal(false)} disabled={saving} className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold disabled:opacity-50">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Location'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
