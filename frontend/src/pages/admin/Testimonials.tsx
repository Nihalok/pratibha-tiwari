import React, { useEffect, useState } from 'react';
import { Star, Plus, Trash2, Save, X, BookmarkCheck, Upload, Image as ImageIcon, Loader2, CheckCircle, AlertCircle, AlertTriangle, Quote, Edit, GripVertical } from 'lucide-react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'motion/react';

const TestimonialCardItem = ({ t, selectedIds, handleSelectToggle, toggleHome, startEdit, setConfirmDeleteId }: any) => {
  const controls = useDragControls();

  return (
    <Reorder.Item 
      key={t._id}
      value={t}
      dragListener={false}
      dragControls={controls}
      className="bg-white border border-gold/10 p-6 sm:p-8 lg:p-10 pt-12 sm:pt-14 rounded-3xl sm:rounded-[40px] shadow-sm hover:shadow-2xl transition-all duration-300 group flex flex-col justify-between relative overflow-hidden"
    >
      {/* Drag Handle & Checkbox Bar */}
      <div className="absolute top-3 left-4 flex items-center space-x-3 z-20">
        <div 
          onPointerDown={(e) => controls.start(e)}
          className="p-2 rounded text-mist hover:text-primary transition-colors cursor-grab active:cursor-grabbing touch-none select-none" 
          title="Drag to reorder"
        >
          <GripVertical size={20} />
        </div>
        <input
          type="checkbox"
          className="w-5 h-5 rounded border-gray-300 text-secondary focus:ring-secondary cursor-pointer accent-secondary"
          checked={selectedIds.includes(t._id)}
          onChange={() => handleSelectToggle(t._id)}
        />
      </div>

      {/* Action Buttons */}
      <div className="absolute top-3 right-4 flex space-x-1.5 z-20">
         <button 
          onClick={() => toggleHome(t._id, t.showOnHome)}
          className={`p-2 rounded-xl transition-all ${t.showOnHome ? 'bg-secondary/15 text-secondary' : 'bg-pearl text-mist hover:bg-gold/10 hover:text-secondary'}`}
          title={t.showOnHome ? 'Currently on Home' : 'Hidden from Home'}
        >
          <BookmarkCheck size={16} />
        </button>
         <button 
          onClick={() => startEdit(t)}
          className="p-2 bg-pearl text-mist hover:text-primary hover:bg-gold/10 rounded-xl transition-all"
          title="Edit Testimonial"
        >
          <Edit size={16} />
        </button>
        <button 
          onClick={() => setConfirmDeleteId(t._id)}
          className="p-2 bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all"
          title="Delete Testimonial"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="absolute -top-6 -right-6 p-8 opacity-[0.03] text-primary pointer-events-none group-hover:rotate-12 transition-transform duration-700">
         <Quote size={120} fill="currentColor" />
      </div>
      
      <div className="relative z-10 mb-6 sm:mb-8 mt-4">
        <div className="mb-4 flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star} 
              size={14} 
              className={star <= (t.rating || 5) ? 'text-gold fill-gold' : 'text-gray-200 fill-transparent'} 
            />
          ))}
        </div>
        <p className="text-primary text-base sm:text-lg font-serif italic leading-relaxed tracking-tight line-clamp-6">
          "{t.quote}"
        </p>
      </div>
      
      <div className="flex items-center space-x-4 relative z-10 pt-4 border-t border-pearl">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-gold/10 group-hover:border-secondary transition-all duration-500 shrink-0">
          <img 
            src={t.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name || 'Client')}&background=1A3A5C&color=B8974A&bold=true`} 
            alt={t.name}
            className="w-full h-full object-cover" 
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="overflow-hidden">
          <h4 className="font-serif font-bold text-primary text-base sm:text-lg leading-snug truncate">{t.name}</h4>
          <p className="text-xs text-mist font-normal truncate mt-0.5">{t.title}</p>
        </div>
      </div>
    </Reorder.Item>
  );
};

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingTestId, setEditingTestId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectToggle = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllToggle = () => {
    if (selectedIds.length === testimonials.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(testimonials.map(t => t._id));
    }
  };

  const [newTest, setNewTest] = useState({ 
    quote: '', 
    name: '', 
    title: '', 
    rating: 5, 
    showOnHome: true,
    image: '' 
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials');
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data.data || []);
      }
    } catch (_error) {
      showNotification('error', 'Failed to fetch testimonials.');
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const processImageFile = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      showNotification('error', 'Please upload a valid image (JPEG, PNG, WEBP, or GIF)');
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            if (width > height) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            } else {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error("Could not get canvas context");
          ctx.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          
          setNewTest(prev => ({ ...prev, image: compressedBase64 }));
          setUploading(false);
          showNotification('success', 'Portrait uploaded and optimized successfully!');
        };
        img.onerror = () => {
          setUploading(false);
          showNotification('error', 'Failed to process portrait image');
        };
      };
      reader.onerror = () => {
        setUploading(false);
        showNotification('error', 'Failed to read image file');
      };
      reader.readAsDataURL(file);
    } catch (_error) {
      showNotification('error', 'Processing failed');
      setUploading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file);
  };

  const startEdit = (test: any) => {
    setEditingTestId(test._id);
    setNewTest({
      quote: test.quote || '',
      name: test.name || '',
      title: test.title || '',
      rating: test.rating || 5,
      showOnHome: test.showOnHome !== undefined ? test.showOnHome : true,
      image: test.image || ''
    });
    setIsAdding(true);
  };

  const handleCloseEditor = () => {
    setIsAdding(false);
    setEditingTestId(null);
    setNewTest({ quote: '', name: '', title: '', rating: 5, showOnHome: true, image: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingTestId ? `/api/testimonials/${editingTestId}` : '/api/testimonials';
      const method = editingTestId ? 'PATCH' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTest)
      });

      if (response.ok) {
        setNewTest({ quote: '', name: '', title: '', rating: 5, showOnHome: true, image: '' });
        setIsAdding(false);
        setEditingTestId(null);
        showNotification('success', editingTestId ? 'Testimonial updated successfully' : 'Testimonial added successfully');
        fetchTestimonials();
      } else {
        showNotification('error', editingTestId ? 'Failed to update testimonial.' : 'Failed to add testimonial.');
      }
    } catch (_error) {
      showNotification('error', 'Failed to save testimonial.');
    } finally {
      setLoading(false);
    }
  };

  const toggleHome = async (id: string, current: boolean) => {
    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showOnHome: !current })
      });
      
      if (response.ok) {
        showNotification('success', current ? 'Hidden from homepage' : 'Shown on homepage');
        fetchTestimonials();
      } else {
        showNotification('error', 'Failed to update visibility.');
      }
    } catch (_error) {
      showNotification('error', 'Failed to update visibility.');
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/testimonials/${confirmDeleteId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSelectedIds(prev => prev.filter(item => item !== confirmDeleteId));
        setConfirmDeleteId(null);
        showNotification('success', 'Testimonial deleted');
        fetchTestimonials();
      } else {
        showNotification('error', 'Failed to delete.');
      }
    } catch (_error) {
      showNotification('error', 'Failed to delete.');
    } finally {
      setLoading(false);
    }
  };

  const deleteSelected = async () => {
    if (window.confirm(`Are you sure you want to delete the ${selectedIds.length} selected testimonials?`)) {
      setLoading(true);
      try {
        const response = await fetch('/api/testimonials/bulk', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: selectedIds })
        });
        if (response.ok) {
          setSelectedIds([]);
          showNotification('success', 'Selected testimonials deleted');
          fetchTestimonials();
        } else {
          showNotification('error', 'Failed to delete selected testimonials.');
        }
      } catch (_error) {
        showNotification('error', 'Failed to delete selected testimonials.');
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteAll = async () => {
    if (window.confirm('Are you sure you want to delete ALL testimonials? This cannot be undone.')) {
      setLoading(true);
      try {
        const response = await fetch('/api/testimonials/bulk', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ all: true })
        });
        if (response.ok) {
          setSelectedIds([]);
          showNotification('success', 'All testimonials deleted');
          fetchTestimonials();
        } else {
          showNotification('error', 'Failed to delete all testimonials.');
        }
      } catch (_error) {
        showNotification('error', 'Failed to delete all testimonials.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6 sm:space-y-10 relative">
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={`fixed top-20 sm:top-28 left-1/2 z-[9999] px-4 sm:px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 border max-w-[90vw] text-sm ${
              notification.type === 'success' ? 'bg-white border-green-100 text-green-700' : 'bg-white border-red-100 text-red-700'
            }`}
          >
            {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span className="font-medium truncate">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-serif text-primary tracking-tight">Evidence Hub</h1>
          <p className="text-xs sm:text-base text-mist mt-1 font-normal">Curate social proof & client success stories with drag & drop reordering.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full sm:w-auto bg-primary text-white px-6 py-3.5 sm:px-8 sm:py-4 rounded-2xl font-bold flex items-center justify-center shadow-xl hover:bg-secondary transition-all group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <Plus size={18} className="mr-2 relative z-10" /> 
          <span className="relative z-10 text-sm sm:text-base">Add Testimonial</span>
        </button>
      </div>

      {/* Editor Modal / Dropdown */}
      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-5 sm:p-8 lg:p-12 rounded-3xl sm:rounded-[40px] border border-gold/10 shadow-2xl space-y-6 sm:space-y-10"
        >
          <div className="flex justify-between items-center">
             <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-serif text-primary italic">{editingTestId ? 'Editing Success Story' : 'Documenting Success'}</h3>
                <p className="text-[10px] sm:text-xs text-mist font-mono uppercase tracking-widest">Client Feedback Editor</p>
             </div>
             <button onClick={handleCloseEditor} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-pearl flex items-center justify-center text-mist hover:text-red-500 transition-colors"><X size={18} /></button>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-6 sm:gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-2 sm:ml-4">The Testimony</label>
              <textarea required placeholder="What did the client say?" className="w-full p-4 sm:p-6 bg-pearl rounded-2xl sm:rounded-3xl border-none focus:ring-2 focus:ring-secondary/20 resize-none font-serif text-base sm:text-lg italic leading-relaxed" rows={4} value={newTest.quote} onChange={e => setNewTest({...newTest, quote: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-2 sm:ml-4">Client Name</label>
                <input required placeholder="Full Name" className="w-full p-4 sm:p-5 bg-pearl rounded-2xl border-none focus:ring-2 focus:ring-secondary/20 text-sm sm:text-base" value={newTest.name} onChange={e => setNewTest({...newTest, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-2 sm:ml-4">Title / Company</label>
                <input placeholder="e.g. CEO at TechFlow" className="w-full p-4 sm:p-5 bg-pearl rounded-2xl border-none focus:ring-2 focus:ring-secondary/20 text-sm sm:text-base" value={newTest.title} onChange={e => setNewTest({...newTest, title: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-2 sm:ml-4">Client Portrait (Drag & Drop File Support)</label>
                <div className="space-y-3">
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="hidden" 
                      id="test-image"
                    />
                    {newTest.image && (newTest.image.startsWith('http') || newTest.image.startsWith('data:')) ? (
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border border-gold/10 mx-auto">
                        <img 
                          src={newTest.image} 
                          alt="Preview" 
                          className="w-full h-full object-cover" 
                        />
                        <label 
                          htmlFor="test-image"
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white text-[10px] font-bold uppercase tracking-wider"
                        >
                          Change
                        </label>
                        <button 
                          type="button"
                          onClick={() => setNewTest(prev => ({ ...prev, image: '' }))}
                          className="absolute top-0 right-0 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-colors z-10"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <label 
                        htmlFor="test-image"
                        onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
                        onDragLeave={() => setIsDraggingFile(false)}
                        onDrop={handleFileDrop}
                        className={`w-full p-6 sm:p-8 bg-pearl rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                          isDraggingFile ? 'border-secondary bg-secondary/10 scale-[1.01]' : 'border-gold/20 hover:bg-gold/5 hover:border-gold/40'
                        } ${uploading ? 'pointer-events-none' : ''}`}
                      >
                        {uploading ? (
                          <div className="flex flex-col items-center space-y-2 text-secondary">
                            <Loader2 size={24} className="animate-spin" />
                            <span className="text-xs sm:text-sm font-medium">Processing portrait...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center space-y-2 text-center text-mist">
                            <Upload size={24} className="mb-1 text-primary" />
                            <span className="text-xs sm:text-sm font-bold text-primary">Drag & drop portrait or click to browse</span>
                            <span className="text-[10px] text-gray-400">JPEG, PNG, WEBP up to 800KB</span>
                          </div>
                        )}
                      </label>
                    )}
                  </div>
                  
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                      <ImageIcon size={18} />
                    </div>
                    <input 
                      placeholder="Or paste external image URL..." 
                      className="w-full pl-12 pr-4 py-3 bg-pearl/50 rounded-2xl border border-gold/5 focus:ring-2 focus:ring-secondary/20 transition-all text-xs sm:text-sm" 
                      value={newTest.image} 
                      onChange={e => setNewTest({...newTest, image: e.target.value})} 
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-2">Rating</label>
                    <div className="flex items-center space-x-2 bg-pearl p-3 rounded-2xl">
                       {[1,2,3,4,5].map(n => (
                         <button key={n} type="button" onClick={() => setNewTest({...newTest, rating: n})} className={`p-1 transition-all ${newTest.rating >= n ? 'text-secondary' : 'text-gray-300'}`}>
                           <Star size={20} fill={newTest.rating >= n ? "currentColor" : "none"} />
                         </button>
                       ))}
                    </div>
                 </div>
                 <label className="flex items-center space-x-3 cursor-pointer p-4 bg-pearl/50 rounded-2xl border border-gold/5">
                    <input type="checkbox" checked={newTest.showOnHome} onChange={e => setNewTest({...newTest, showOnHome: e.target.checked})} className="w-5 h-5 rounded border-gold/20 text-secondary focus:ring-secondary/20 accent-secondary" />
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">Show on Homepage</span>
                 </label>
              </div>
            </div>

            <button disabled={loading || uploading} className="w-full py-4 sm:py-6 bg-primary text-white rounded-2xl font-bold flex items-center justify-center hover:bg-secondary transition-all shadow-xl disabled:opacity-50 text-sm sm:text-base">
              {loading ? <Loader2 size={20} className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
              {editingTestId ? 'Update Testimonial' : 'Save Testimonial'}
            </button>
          </form>
        </motion.div>
      )}

      {/* Bulk Actions Header */}
      {testimonials.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-[24px] border border-gray-100 shadow-xs">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="selectAllTestimonials"
              className="w-5 h-5 rounded border-gray-300 text-secondary focus:ring-secondary cursor-pointer accent-secondary"
              checked={testimonials.length > 0 && selectedIds.length === testimonials.length}
              onChange={handleSelectAllToggle}
            />
            <label htmlFor="selectAllTestimonials" className="text-xs sm:text-sm font-semibold text-primary cursor-pointer select-none">
              {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Select All Testimonials'}
            </label>
          </div>
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            {selectedIds.length > 0 && (
              <button
                onClick={deleteSelected}
                disabled={loading}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                <Trash2 size={14} />
                <span>Delete Selected</span>
              </button>
            )}
            <button
              onClick={deleteAll}
              disabled={loading}
              className="flex items-center space-x-2 border border-red-500 text-red-500 hover:bg-red-50 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
            >
              <Trash2 size={14} />
              <span>Delete All</span>
            </button>
          </div>
        </div>
      )}

      {/* Reorderable Grid of Testimonials */}
      <Reorder.Group 
        axis="y"
        values={testimonials} 
        onReorder={setTestimonials}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8"
      >
        {(testimonials || []).map((t) => (
          <TestimonialCardItem
            key={t._id}
            t={t}
            selectedIds={selectedIds}
            handleSelectToggle={handleSelectToggle}
            toggleHome={toggleHome}
            startEdit={startEdit}
            setConfirmDeleteId={setConfirmDeleteId}
          />
        ))}
      </Reorder.Group>

      {(testimonials || []).length === 0 && (
        <div className="py-20 sm:py-32 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-pearl flex items-center justify-center text-gold">
            <Star size={36} />
          </div>
          <p className="text-mist font-serif italic text-base sm:text-lg">No client success stories documented yet.</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDeleteId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDeleteId(null)}
              className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl sm:rounded-[40px] p-6 sm:p-10 max-w-md w-full relative z-10 shadow-2xl border border-red-100 text-center space-y-6 sm:space-y-8"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-50 flex items-center justify-center text-red-500 mx-auto">
                <AlertTriangle size={36} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-serif text-primary italic">Remove this proof?</h3>
                <p className="text-xs sm:text-sm text-mist font-normal">This success story will be permanently removed from your archives.</p>
              </div>
              <div className="flex gap-3 sm:gap-4">
                <button onClick={() => setConfirmDeleteId(null)} className="flex-1 py-3.5 sm:py-4 bg-pearl text-primary rounded-2xl font-bold hover:bg-gold/10 transition-all text-xs sm:text-sm">Cancel</button>
                <button onClick={handleDelete} disabled={loading} className="flex-1 py-3.5 sm:py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all shadow-lg flex items-center justify-center text-xs sm:text-sm">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
