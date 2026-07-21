import React, { useEffect, useState } from 'react';
import { FileText, Plus, Trash2, Save, X, Upload, Image as ImageIcon, Loader2, CheckCircle, AlertCircle, AlertTriangle, Star, Edit, GripVertical, Calendar, Tag } from 'lucide-react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'motion/react';

const PostCardItem = ({ post, selectedIds, handleSelectToggle, toggleStatus, startEdit, setConfirmDeleteId }: any) => {
  const controls = useDragControls();
  return (
    <Reorder.Item
      key={post._id}
      value={post}
      dragListener={false}
      dragControls={controls}
      className="bg-white p-5 rounded-3xl border border-gold/10 shadow-xs space-y-4 relative"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div 
            onPointerDown={(e) => controls.start(e)}
            className="p-2 rounded text-mist hover:text-primary cursor-grab active:cursor-grabbing touch-none select-none"
            title="Drag to reorder"
          >
            <GripVertical size={20} />
          </div>
          <input
            type="checkbox"
            className="w-5 h-5 rounded border-gray-300 text-secondary focus:ring-secondary cursor-pointer accent-secondary"
            checked={selectedIds.includes(post._id)}
            onChange={() => handleSelectToggle(post._id)}
          />
          {post.featuredImage && (
            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-gold/10">
              <img src={post.featuredImage} alt="" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => toggleStatus(post._id, post.status)}
            className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all ${
              post.status === 'published' 
                ? 'bg-green-50 text-green-600 border border-green-100' 
                : 'bg-amber-50 text-amber-600 border border-amber-100'
            }`}
          >
            {post.status}
          </button>
        </div>
      </div>

      <div>
        <h3 className="font-serif text-base font-bold text-primary italic leading-tight">{post.title}</h3>
        <div className="flex items-center space-x-4 mt-2 text-xs text-mist">
          <span className="flex items-center text-[10px] font-mono uppercase tracking-wider">
            <Tag size={12} className="mr-1 text-gold" /> {post.category || 'Uncategorized'}
          </span>
          <span className="flex items-center text-[10px]">
            <Calendar size={12} className="mr-1 text-mist" /> 
            {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Draft'}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
        <button 
          onClick={() => startEdit(post)} 
          className="px-3.5 py-2 rounded-xl bg-pearl text-primary text-xs font-semibold hover:bg-primary hover:text-white transition-all flex items-center space-x-1.5"
        >
          <Edit size={14} />
          <span>Edit</span>
        </button>
        <button 
          onClick={() => setConfirmDeleteId(post._id)} 
          className="px-3.5 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-semibold hover:bg-red-500 hover:text-white transition-all flex items-center space-x-1.5"
        >
          <Trash2 size={14} />
          <span>Delete</span>
        </button>
      </div>
    </Reorder.Item>
  );
};

const PostTableRow = ({ post, selectedIds, handleSelectToggle, toggleStatus, startEdit, setConfirmDeleteId }: any) => {
  const controls = useDragControls();
  return (
    <Reorder.Item
      as="tr"
      key={post._id}
      value={post}
      dragListener={false}
      dragControls={controls}
      className="hover:bg-pearl/10 transition-colors group"
    >
      <td className="px-6 py-6 text-center">
        <div 
          onPointerDown={(e) => controls.start(e)}
          className="p-2 rounded text-mist hover:text-primary transition-colors cursor-grab active:cursor-grabbing inline-block touch-none select-none"
          title="Drag to reorder"
        >
          <GripVertical size={18} />
        </div>
      </td>
      <td className="px-6 py-6 text-center">
        <input
          type="checkbox"
          className="w-5 h-5 rounded border-gray-300 text-secondary focus:ring-secondary cursor-pointer accent-secondary"
          checked={selectedIds.includes(post._id)}
          onChange={() => handleSelectToggle(post._id)}
        />
      </td>
      <td className="px-6 py-6">
        <div className="flex items-center space-x-4">
          {post.featuredImage && (
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-gold/10">
              <img src={post.featuredImage} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <div className="font-serif text-base lg:text-lg text-primary group-hover:text-secondary transition-colors italic leading-snug">{post.title}</div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-mist mt-1">{post.category}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-6">
         <button 
           onClick={() => toggleStatus(post._id, post.status)}
           className={`px-3.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${
             post.status === 'published' 
               ? 'bg-green-50 text-green-600 border border-green-100 hover:bg-green-100' 
               : 'bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-100'
           }`}
         >
           {post.status}
         </button>
      </td>
      <td className="px-6 py-6 text-xs text-mist font-normal">
        {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Pending...'}
      </td>
      <td className="px-6 py-6 text-right">
        <div className="flex items-center justify-end space-x-2">
          <button 
            onClick={() => startEdit(post)} 
            className="w-9 h-9 rounded-xl bg-pearl text-mist hover:bg-primary hover:text-white transition-all flex items-center justify-center"
            title="Edit Post"
          >
            <Edit size={15} />
          </button>
          <button 
            onClick={() => setConfirmDeleteId(post._id)} 
            className="w-9 h-9 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
            title="Delete Post"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </Reorder.Item>
  );
};

export default function Posts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [generatingExcerpt, setGeneratingExcerpt] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectToggle = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllToggle = () => {
    if (selectedIds.length === posts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(posts.map(p => p._id));
    }
  };

  const [newPost, setNewPost] = useState({ 
    title: '', 
    slug: '', 
    category: '', 
    excerpt: '', 
    body: '', 
    featuredImage: '', 
    status: 'draft' as const 
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts/admin');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.data || []);
      }
    } catch (_error) {
      showNotification('error', 'Failed to fetch posts.');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const startEdit = (post: any) => {
    setEditingPostId(post._id);
    setNewPost({
      title: post.title || '',
      slug: post.slug || '',
      category: post.category || '',
      excerpt: post.excerpt || '',
      body: post.body || '',
      featuredImage: post.featuredImage || '',
      status: post.status || 'draft'
    });
    setIsAdding(true);
  };

  const handleCloseEditor = () => {
    setIsAdding(false);
    setEditingPostId(null);
    setNewPost({ title: '', slug: '', category: '', excerpt: '', body: '', featuredImage: '', status: 'draft' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingPostId ? `/api/posts/${editingPostId}` : '/api/posts';
      const method = editingPostId ? 'PATCH' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });

      if (response.ok) {
        setNewPost({ title: '', slug: '', category: '', excerpt: '', body: '', featuredImage: '', status: 'draft' });
        setIsAdding(false);
        setEditingPostId(null);
        showNotification('success', editingPostId ? 'Post updated successfully' : 'Post created successfully');
        fetchPosts();
      } else {
        showNotification('error', editingPostId ? 'Failed to update post.' : 'Failed to create post.');
      }
    } catch (_error) {
      showNotification('error', 'Failed to save post.');
    } finally {
      setLoading(false);
    }
  };

  const generateExcerpt = async () => {
    if (!newPost.title && !newPost.body) {
      showNotification('error', 'Please enter a title and content first.');
      return;
    }
    if (!newPost.title) {
      showNotification('error', 'Please enter a title first.');
      return;
    }
    if (!newPost.body) {
      showNotification('error', 'Please enter post content first.');
      return;
    }
    setGeneratingExcerpt(true);
    try {
      const res = await fetch('/api/ai/generate-excerpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newPost.body, title: newPost.title }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setNewPost(prev => ({ ...prev, excerpt: data.excerpt }));
        showNotification('success', 'SEO meta description generated!');
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to generate');
      }
    } catch (error: any) {
      showNotification('error', error.message || 'Generation failed');
    } finally {
      setGeneratingExcerpt(false);
    }
  };

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

          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
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

          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
          
          setNewPost(prev => ({ ...prev, featuredImage: compressedBase64 }));
          setUploading(false);
          showNotification('success', 'Image uploaded and optimized successfully!');
        };
        img.onerror = () => {
          setUploading(false);
          showNotification('error', 'Failed to process image file');
        };
      };
      reader.onerror = () => {
        setUploading(false);
        showNotification('error', 'Failed to read image file');
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      showNotification('error', `Processing failed: ${error.message}`);
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

  const toggleStatus = async (id: string, current: string) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: current === 'published' ? 'draft' : 'published' })
      });

      if (response.ok) {
        showNotification('success', `Post marked as ${current === 'published' ? 'draft' : 'published'}`);
        fetchPosts();
      }
    } catch (_error) {
      showNotification('error', 'Failed to update status.');
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/posts/${confirmDeleteId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setSelectedIds(prev => prev.filter(item => item !== confirmDeleteId));
        setConfirmDeleteId(null);
        showNotification('success', 'Post deleted successfully');
        fetchPosts();
      }
    } catch (_error) {
      showNotification('error', "Failed to delete post.");
    } finally {
      setLoading(false);
    }
  };

  const deleteSelected = async () => {
    if (window.confirm(`Are you sure you want to delete the ${selectedIds.length} selected posts?`)) {
      setLoading(true);
      try {
        const response = await fetch('/api/posts/bulk', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: selectedIds })
        });
        if (response.ok) {
          setSelectedIds([]);
          showNotification('success', 'Selected posts deleted successfully');
          fetchPosts();
        } else {
          showNotification('error', 'Failed to delete selected posts.');
        }
      } catch (_error) {
        showNotification('error', 'Failed to delete selected posts.');
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteAll = async () => {
    if (window.confirm('Are you sure you want to delete ALL posts? This cannot be undone.')) {
      setLoading(true);
      try {
        const response = await fetch('/api/posts/bulk', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ all: true })
        });
        if (response.ok) {
          setSelectedIds([]);
          showNotification('success', 'All posts deleted successfully');
          fetchPosts();
        } else {
          showNotification('error', 'Failed to delete all posts.');
        }
      } catch (_error) {
        showNotification('error', 'Failed to delete all posts.');
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

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-serif text-primary tracking-tight">Blog Insights</h1>
          <p className="text-xs sm:text-base text-mist mt-1 font-normal">Curate and manage your high-performance content with drag & drop ordering.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full sm:w-auto bg-primary text-white px-6 py-3.5 sm:px-8 sm:py-4 rounded-2xl font-bold flex items-center justify-center shadow-xl hover:bg-secondary transition-all group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <Plus size={18} className="mr-2 relative z-10" /> 
          <span className="relative z-10 text-sm sm:text-base">New Insight</span>
        </button>
      </div>

      {/* Editor Modal / Container */}
      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-5 sm:p-8 lg:p-12 rounded-3xl sm:rounded-[40px] border border-gold/10 shadow-2xl space-y-6 sm:space-y-10"
        >
          <div className="flex justify-between items-center">
             <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-serif text-primary italic">{editingPostId ? 'Editing Insight' : 'Drafting New Insight'}</h3>
                <p className="text-[10px] sm:text-xs text-mist font-mono uppercase tracking-widest">Post Editor</p>
             </div>
             <button onClick={handleCloseEditor} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-pearl flex items-center justify-center text-mist hover:text-red-500 transition-colors"><X size={18} /></button>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-6 sm:gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-2 sm:ml-4">Title</label>
                <input required placeholder="Enter post title..." className="w-full p-4 sm:p-5 bg-pearl rounded-2xl border-none focus:ring-2 focus:ring-secondary/20 transition-all font-serif text-base sm:text-lg" value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-2 sm:ml-4">Slug</label>
                <input required placeholder="slug-will-generate" className="w-full p-4 sm:p-5 bg-pearl/50 rounded-2xl border-none focus:ring-0 text-mist font-mono text-xs sm:text-sm italic" value={newPost.slug} readOnly />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-2 sm:ml-4">Category</label>
                  <input required placeholder="e.g. Leadership, Parenting" className="w-full p-4 sm:p-5 bg-pearl rounded-2xl border-none focus:ring-2 focus:ring-secondary/20 text-sm sm:text-base" value={newPost.category} onChange={e => setNewPost({...newPost, category: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-2 sm:ml-4">Publishing State</label>
                  <div className="flex items-center space-x-2 bg-pearl p-1.5 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setNewPost({...newPost, status: 'draft'})}
                      className={`flex-1 py-3 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all ${newPost.status === 'draft' ? 'bg-white text-amber-600 shadow-sm border border-amber-100/50' : 'text-mist hover:text-primary'}`}
                    >
                      Draft
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewPost({...newPost, status: 'published'})}
                      className={`flex-1 py-3 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all ${newPost.status === 'published' ? 'bg-white text-green-600 shadow-sm border border-green-100/50' : 'text-mist hover:text-primary'}`}
                    >
                      Published
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-2 sm:ml-4">Featured Image (Drag & Drop File Support)</label>
                <div className="space-y-3">
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="hidden" 
                      id="image-upload"
                    />
                    {newPost.featuredImage && (newPost.featuredImage.startsWith('http') || newPost.featuredImage.startsWith('data:')) ? (
                      <div className="relative h-36 sm:h-40 w-full rounded-2xl overflow-hidden border border-gold/10">
                        <img 
                          src={newPost.featuredImage} 
                          alt="Preview" 
                          className="w-full h-full object-cover" 
                        />
                        <label 
                          htmlFor="image-upload"
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white font-medium text-xs sm:text-sm space-x-2"
                        >
                          <Upload size={16} />
                          <span>Change Cover</span>
                        </label>
                        <button 
                          type="button"
                          onClick={() => setNewPost(prev => ({ ...prev, featuredImage: '' }))}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-colors z-10"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <label 
                        htmlFor="image-upload"
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
                            <span className="text-xs sm:text-sm font-medium">Uploading to Storage...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center space-y-2 text-center text-mist">
                            <Upload size={24} className="mb-1 text-primary" />
                            <span className="text-xs sm:text-sm font-bold text-primary">Drag & drop cover image or click to browse</span>
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
                      value={newPost.featuredImage} 
                      onChange={e => setNewPost({...newPost, featuredImage: e.target.value})} 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap justify-between items-center px-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary">Short Excerpt (SEO Meta Description)</label>
                <button 
                  type="button"
                  onClick={generateExcerpt}
                  disabled={generatingExcerpt}
                  className="text-[9px] font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors flex items-center space-x-1 disabled:opacity-50"
                >
                  {generatingExcerpt ? <Loader2 size={10} className="animate-spin" /> : <Star size={10} />}
                  <span>Auto-Generate SEO</span>
                </button>
              </div>
              <textarea required placeholder="Brief summary for the preview card..." className="w-full p-4 sm:p-5 bg-pearl rounded-2xl border-none focus:ring-2 focus:ring-secondary/20 resize-none font-normal text-xs sm:text-sm" rows={2} value={newPost.excerpt} onChange={e => setNewPost({...newPost, excerpt: e.target.value})} />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-2 sm:ml-4">Full Content</label>
              <textarea required placeholder="Write your insight content here..." className="w-full p-5 sm:p-8 bg-pearl rounded-3xl border-none focus:ring-2 focus:ring-secondary/20 resize-none min-h-[250px] sm:min-h-[300px] leading-relaxed text-sm sm:text-base" value={newPost.body} onChange={e => setNewPost({...newPost, body: e.target.value})} />
            </div>

            <button 
              disabled={loading || uploading}
              className="w-full py-4 sm:py-6 bg-primary text-white rounded-2xl font-bold flex items-center justify-center hover:bg-secondary transition-all shadow-xl disabled:opacity-50 text-sm sm:text-base"
            >
              {loading ? <Loader2 size={20} className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
              {editingPostId ? 'Update Insight' : 'Save & Finalize Draft'}
            </button>
          </form>
        </motion.div>
      )}

      {/* Bulk Actions Header */}
      {posts.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-[24px] border border-gray-100 shadow-xs">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="selectAllPosts"
              className="w-5 h-5 rounded border-gray-300 text-secondary focus:ring-secondary cursor-pointer accent-secondary"
              checked={posts.length > 0 && selectedIds.length === posts.length}
              onChange={handleSelectAllToggle}
            />
            <label htmlFor="selectAllPosts" className="text-xs sm:text-sm font-semibold text-primary cursor-pointer select-none">
              {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Select All Posts'}
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

      {/* Reorderable Container for Mobile Cards & Desktop Table */}
      <Reorder.Group axis="y" values={posts} onReorder={setPosts} className="space-y-4">
        {/* Mobile View: Cards */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {(posts || []).map((post) => (
            <PostCardItem
              key={post._id}
              post={post}
              selectedIds={selectedIds}
              handleSelectToggle={handleSelectToggle}
              toggleStatus={toggleStatus}
              startEdit={startEdit}
              setConfirmDeleteId={setConfirmDeleteId}
            />
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="bg-white rounded-[40px] border border-gold/10 shadow-sm overflow-hidden hidden md:block">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-pearl/30 border-b border-gold/5 text-[10px] font-mono text-primary uppercase tracking-[0.3em]">
                <tr>
                  <th className="px-6 py-6 w-16 text-center">Reorder</th>
                  <th className="px-6 py-6 w-12 text-center">Select</th>
                  <th className="px-6 py-6">Topic & Insight</th>
                  <th className="px-6 py-6">State</th>
                  <th className="px-6 py-6">Timeline</th>
                  <th className="px-6 py-6 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pearl">
                {(posts || []).map((post) => (
                  <PostTableRow
                    key={post._id}
                    post={post}
                    selectedIds={selectedIds}
                    handleSelectToggle={handleSelectToggle}
                    toggleStatus={toggleStatus}
                    startEdit={startEdit}
                    setConfirmDeleteId={setConfirmDeleteId}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reorder.Group>

      {(posts || []).length === 0 && (
        <div className="py-20 sm:py-32 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-pearl flex items-center justify-center text-gold">
            <FileText size={36} />
          </div>
          <p className="text-mist font-serif italic text-base sm:text-lg">Your editorial archives are empty.</p>
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
                <h3 className="text-xl sm:text-2xl font-serif text-primary italic">Delete this insight?</h3>
                <p className="text-xs sm:text-sm text-mist font-normal">This action is permanent and will remove the post from your website immediately.</p>
              </div>
              <div className="flex gap-3 sm:gap-4">
                <button 
                  onClick={() => setConfirmDeleteId(null)}
                  className="flex-1 py-3.5 sm:py-4 bg-pearl text-primary rounded-2xl font-bold hover:bg-gold/10 transition-all text-xs sm:text-sm"
                >
                  Keep it
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 py-3.5 sm:py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all shadow-lg flex items-center justify-center text-xs sm:text-sm"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : "Delete Forever"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
