import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Trash2, Play, Loader, X,
  Check, Video, AlertCircle, ChevronDown
} from 'lucide-react';
import {
  getAllEdgesAdmin,
  createEdge,
  deleteEdge,
  uploadVideoToCloudinary
} from '../api/navigationApi';
import { getAllLocations } from '../api/locationsApi';

export default function AdminVideos() {
  const [edges, setEdges] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [formError, setFormError] = useState('');
  const fileRef = useRef(null);

  const emptyForm = {
    from_location_id: '',
    to_location_id: '',
    instruction: '',
    landmark_hint: '',
    video_file: null,
    video_preview: null
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const [edgesRes, locsRes] = await Promise.all([
      getAllEdgesAdmin(),
      getAllLocations()
    ]);
    setEdges(edgesRes.data || []);
    setLocations(locsRes.data || []);
    setLoading(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      setFormError('Please select a video file.');
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      setFormError('Video must be under 100MB.');
      return;
    }
    const preview = URL.createObjectURL(file);
    setForm(f => ({ ...f, video_file: file, video_preview: preview }));
    setFormError('');
  };

  const save = async () => {
    if (!form.from_location_id) { setFormError('Select FROM location.'); return; }
    if (!form.to_location_id) { setFormError('Select TO location.'); return; }
    if (form.from_location_id === form.to_location_id) {
      setFormError('FROM and TO must be different.'); return;
    }
    if (!form.video_file) { setFormError('Please select a video.'); return; }
    if (!form.instruction.trim()) { setFormError('Add an instruction.'); return; }

    setSaving(true);
    setUploadProgress(0);

    try {
      const { url, publicId, duration } = await uploadVideoToCloudinary(
        form.video_file,
        setUploadProgress
      );

      const { error } = await createEdge({
        from_location_id: form.from_location_id,
        to_location_id: form.to_location_id,
        video_url: url,
        cloudinary_public_id: publicId,
        duration_seconds: duration,
        instruction: form.instruction.trim(),
        landmark_hint: form.landmark_hint.trim(),
        is_active: true
      });

      if (error) { setFormError(error.message); setSaving(false); return; }

      setShowModal(false);
      setForm(emptyForm);
      setUploadProgress(0);
      load();
    } catch (err) {
      setFormError(err.message);
    }
    setSaving(false);
  };

  const remove = async (edge) => {
    const name = `${edge.from_location?.name} → ${edge.to_location?.name}`;
    if (!confirm(`Delete clip "${name}"?`)) return;
    await deleteEdge(edge.id);
    load();
  };

  // Group edges by destination
  const grouped = edges.reduce((acc, edge) => {
    const dest = edge.to_location?.name || 'Unknown';
    if (!acc[dest]) acc[dest] = [];
    acc[dest].push(edge);
    return acc;
  }, {});

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader className="w-10 h-10 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-3xl mx-auto px-4">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Video Navigation
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Upload short video clips between campus locations
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            ['Total Clips', edges.length, 'text-blue-600'],
            ['Locations', new Set(edges.map(e => e.from_location_id)).size, 'text-green-600'],
            ['Destinations', Object.keys(grouped).length, 'text-purple-600']
          ].map(([label, val, color]) => (
            <div key={label} className="bg-white rounded-xl shadow-sm p-3 text-center">
              <p className={`text-xl md:text-2xl font-bold ${color}`}>{val}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Upload Button */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <button
            onClick={() => {
              setForm(emptyForm);
              setFormError('');
              setShowModal(true);
            }}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            Upload Video Clip
          </button>
        </div>

        {/* Clips List */}
        {Object.keys(grouped).length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center">
            <Video className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No clips yet
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Upload your first navigation video clip to get started.
            </p>
            <button
              onClick={() => {
                setForm(emptyForm);
                setFormError('');
                setShowModal(true);
              }}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold"
            >
              Upload First Clip
            </button>
          </div>
        ) : Object.entries(grouped).map(([destination, clips]) => (
          <div key={destination} className="mb-5">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
              → {destination} ({clips.length} clip{clips.length > 1 ? 's' : ''})
            </h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden divide-y divide-gray-100">
              {clips.map(clip => (
                <div
                  key={clip.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Video className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {clip.from_location?.name} → {clip.to_location?.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {clip.instruction}
                      </p>
                      {clip.landmark_hint && (
                        <p className="text-xs text-amber-600 truncate">
                          💡 {clip.landmark_hint}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        {clip.duration_seconds}s
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-2 flex-shrink-0">
                    <button
                      onClick={() => setPreviewVideo(clip.video_url)}
                      className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg active:scale-95 transition-all"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => remove(clip)}
                      className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg active:scale-95 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Upload Modal ───────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
          <div className="bg-white rounded-t-3xl md:rounded-2xl w-full md:max-w-lg shadow-2xl max-h-[92vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white rounded-t-3xl md:rounded-t-2xl z-10">
              <h2 className="text-lg font-bold">Upload Video Clip</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full active:scale-95"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-5 space-y-5">

              {/* FROM Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  FROM Location *
                </label>
                <div className="relative">
                  <select
                    value={form.from_location_id}
                    onChange={e => setForm(f => ({
                      ...f, from_location_id: e.target.value
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">-- Select starting point --</option>
                    {locations.map(loc => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} ({loc.category})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* TO Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  TO Location *
                </label>
                <div className="relative">
                  <select
                    value={form.to_location_id}
                    onChange={e => setForm(f => ({
                      ...f, to_location_id: e.target.value
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">-- Select destination --</option>
                    {locations.map(loc => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} ({loc.category})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Video Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Video Clip * (max 100MB)
                </label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 active:bg-blue-100 transition-colors"
                >
                  {form.video_preview ? (
                    <video
                      src={form.video_preview}
                      className="w-full max-h-48 rounded-lg"
                      controls
                      onClick={e => e.stopPropagation()}
                    />
                  ) : (
                    <>
                      <Video className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm font-medium text-gray-600">
                        Tap to select video
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        MP4, MOV, AVI — max 100MB
                      </p>
                    </>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {form.video_file && (
                  <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    {form.video_file.name}
                  </p>
                )}
              </div>

              {/* Instruction */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Instruction * <span className="text-gray-400 font-normal">(what student should do)</span>
                </label>
                <input
                  value={form.instruction}
                  onChange={e => setForm(f => ({
                    ...f, instruction: e.target.value
                  }))}
                  placeholder="e.g. Turn left at the fountain"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Landmark Hint */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Landmark Hint <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  value={form.landmark_hint}
                  onChange={e => setForm(f => ({
                    ...f, landmark_hint: e.target.value
                  }))}
                  placeholder="e.g. Look for the red building on your left"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Upload Progress */}
              {saving && uploadProgress > 0 && (
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1.5">
                    <span>Uploading to Cloudinary...</span>
                    <span className="font-semibold">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Error */}
              {formError && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {formError}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-5 border-t sticky bottom-0 bg-white">
              <button
                onClick={() => setShowModal(false)}
                disabled={saving}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold disabled:opacity-50 active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                {saving ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    {uploadProgress < 100
                      ? `Uploading ${uploadProgress}%`
                      : 'Saving...'}
                  </>
                ) : (
                  <><Check className="w-4 h-4" /> Save Clip</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Video Preview Modal ────────────────────────────────── */}
      {previewVideo && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white text-sm font-medium">Preview</p>
              <button
                onClick={() => setPreviewVideo(null)}
                className="p-2 hover:bg-white/10 rounded-full active:scale-95"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <video
              src={previewVideo}
              controls
              autoPlay
              playsInline
              className="w-full rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}