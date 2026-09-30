// // app/account/profile/page.js
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { 
//   User, Mail, Phone, MapPin, Shield, 
//   Calendar, Edit3, Key, Save, ArrowLeft,
//   Camera, Trash2, Heart,
//   ShoppingBag, Star, Gift
// } from 'lucide-react';

// export default function ProfilePage() {
//   const router = useRouter();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
  
//   // ===== FORCE IMAGE RE-RENDER KEY =====
//   const [imageKey, setImageKey] = useState(Date.now());

//   // ===== CLOUDINARY STATE =====
//   const [uploadingImage, setUploadingImage] = useState(false);
//   const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
//   const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

//   // ===== FORM STATE =====
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     country: '',
//     bio: '',
//     gender: '',
//     language: 'English',
//   });

//   // ===== LOAD USER DATA =====
//   const fetchUser = async () => {
//     console.log('📝 fetchUser called');
//     try {
//       const res = await fetch(`/api/auth/me`, {
//         credentials: 'include',
//       });
//       console.log('📥 fetchUser response status:', res.status);
      
//       if (res.ok) {
//         const data = await res.json();
//         console.log('✅ fetchUser data received:', data);
//         console.log('👤 User data:', data.user);
//         console.log('🖼️ Profile image:', data.user.profileImage);
        
//         setUser(data.user);
//         setFormData({
//           firstName: data.user.firstName || '',
//           lastName: data.user.lastName || '',
//           email: data.user.email || '',
//           phone: data.user.phone || '',
//           country: data.user.country || '',
//           bio: data.user.bio || 'Plant lover and nature enthusiast. 🌱',
//           gender: data.user.gender || 'Prefer not to say',
//           language: 'English',
//         });
//         console.log('✅ State updated with user data');
//       } else {
//         console.log('❌ fetchUser not authenticated');
//         router.push('/login');
//       }
//     } catch (e) {
//       console.error('❌ fetchUser error:', e);
//       router.push('/login');
//     } finally {
//       setLoading(false);
//       console.log('✅ fetchUser complete, loading set to false');
//     }
//   };

//   useEffect(() => {
//     fetchUser();
    
//     // Listen for auth changes
//     const handleAuthChange = () => fetchUser();
//     window.addEventListener('authChange', handleAuthChange);
    
//     return () => {
//       window.removeEventListener('authChange', handleAuthChange);
//     };
//   }, [router]);

//   // ===== HANDLE FORM CHANGES =====
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   // ===== TOGGLE EDIT MODE =====
//   const toggleEdit = () => {
//     if (isEditing) {
//       if (user) {
//         setFormData({
//           firstName: user.firstName || '',
//           lastName: user.lastName || '',
//           email: user.email || '',
//           phone: user.phone || '',
//           country: user.country || '',
//           bio: user.bio || 'Plant lover and nature enthusiast. 🌱',
//           gender: user.gender || 'Prefer not to say',
//           language: 'English',
//         });
//       }
//       setIsEditing(false);
//     } else {
//       setIsEditing(true);
//     }
//   };

//   // ===== CLOUDINARY UPLOAD =====
//   const openCloudinaryWidget = () => {
//     if (!cloudName || !uploadPreset) {
//       alert('Cloudinary configuration missing.');
//       return;
//     }

//     if (!document.querySelector('script[src*="upload-widget.cloudinary"]')) {
//       const script = document.createElement('script');
//       script.src = 'https://upload-widget.cloudinary.com/global/all.js';
//       script.async = true;
//       document.body.appendChild(script);
//       script.onload = () => openCloudinaryWidget();
//       return;
//     }

//     if (window.cloudinary) {
//       const widget = window.cloudinary.createUploadWidget(
//         {
//           cloudName: cloudName,
//           uploadPreset: uploadPreset,
//           sources: ['local', 'url'],
//           multiple: false,
//           cropping: true,
//           croppingAspectRatio: 1,
//           resourceType: 'image',
//           maxFileSize: 5000000,
//         },
//         async (error, result) => {
//           if (!error && result && result.event === 'success') {
//             if (result.info.resource_type === 'image') {
//               const secureUrl = result.info.secure_url;
//               setUploadingImage(false);
              
//               // Save to backend
//               await saveProfileImageToBackend(secureUrl);
//             } else {
//               alert('Upload failed: Please select an image file.');
//               setUploadingImage(false);
//             }
//           } else if (error) {
//             console.error('Cloudinary error:', error);
//             setUploadingImage(false);
//           }
//         }
//       );
//       setUploadingImage(true);
//       widget.open();
//     } else {
//       setTimeout(() => openCloudinaryWidget(), 500);
//     }
//   };

//   // ===== SAVE PROFILE IMAGE TO BACKEND =====
//   const saveProfileImageToBackend = async (imageUrl) => {
//     try {
//       console.log('📤 Sending profile image to backend...');
//       console.log('📸 Image URL:', imageUrl);
      
//       const res = await fetch(`/api/auth/update-profile`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({ profileImage: imageUrl }),
//       });
      
//       console.log('📥 Backend response status:', res.status);
      
//       if (res.ok) {
//         const data = await res.json();
//         console.log('✅ Backend response data:', data);
//         console.log('✅ User from backend:', data.user);
//         console.log('✅ Profile image from backend:', data.user?.profileImage);
        
//         // ✅ Check if profileImage exists in the response
//         if (data.user && data.user.profileImage) {
//           // Create a NEW user object with the updated data
//           const updatedUser = {
//             ...data.user,
//             profileImage: data.user.profileImage // Ensure profileImage is included
//           };
          
//           console.log('✅ Updated user object:', updatedUser);
          
//           // Update state with the new user object
//           setUser(updatedUser);
          
//           // Update localStorage
//           localStorage.setItem('authUser', JSON.stringify(updatedUser));
          
//           // Dispatch events to update Header and SidePanel
//           window.dispatchEvent(new Event('authChange'));
//           window.dispatchEvent(new Event('profileImageUpdated'));
          
//           // Force the image to reload by updating a key
//           setImageKey(Date.now());
          
//           alert('Profile picture updated successfully! 🎉');
//         } else {
//           console.error('❌ Backend returned user but profileImage is missing');
//           alert('Profile image saved but not returned from server. Please refresh the page.');
//           window.location.reload();
//         }
//       } else {
//         const errorData = await res.json();
//         console.error('❌ Backend error:', errorData);
//         alert(errorData.error || 'Failed to save profile image to server');
//       }
//     } catch (err) {
//       console.error('❌ Fetch error:', err);
//       alert('Error connecting to server');
//     }
//   };

//   // ===== REMOVE PROFILE IMAGE =====
//   const removeProfileImage = async () => {
//     try {
//       const res = await fetch(`/api/auth/update-profile`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({ profileImage: null }),
//       });
      
//       if (res.ok) {
//         const data = await res.json();
        
//         // Create a NEW object reference
//         const updatedUser = {
//           ...data.user,
//           profileImage: null
//         };
        
//         setUser(updatedUser);
//         setImageKey(Date.now());
//         localStorage.setItem('authUser', JSON.stringify(updatedUser));
//         window.dispatchEvent(new Event('authChange'));
//         window.dispatchEvent(new Event('profileImageUpdated'));
//         alert('Profile picture removed');
//       } else {
//         const errorData = await res.json();
//         alert(errorData.error || 'Failed to remove profile image');
//       }
//     } catch (err) {
//       console.error('Error removing profile image:', err);
//       alert('Error removing profile image');
//     }
//   };

//   // ===== SAVE PROFILE CHANGES =====
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSaving(true);

//     try {
//       const res = await fetch(`/api/auth/update-profile`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({
//           firstName: formData.firstName,
//           lastName: formData.lastName,
//           phone: formData.phone,
//           country: formData.country,
//           bio: formData.bio,
//           gender: formData.gender,
//         }),
//       });

//       if (res.ok) {
//         const data = await res.json();
        
//         // Create a NEW object reference
//         const updatedUser = {
//           ...data.user
//         };
        
//         setUser(updatedUser);
//         localStorage.setItem('authUser', JSON.stringify(updatedUser));
//         window.dispatchEvent(new Event('authChange'));
//         setIsEditing(false);
//         alert('Profile updated successfully! 🎉');
//       } else {
//         const errorData = await res.json();
//         alert(errorData.error || 'Failed to update profile');
//       }
//     } catch (err) {
//       console.error('Error updating profile:', err);
//       alert('Error connecting to server');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // ===== DATE FORMATTER =====
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-[70vh] flex items-center justify-center">
//         <div className="w-12 h-12 border-4 border-[#2B7A4B] border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   if (!user) return null;

//   return (
//     <div className="w-full h-full flex flex-col justify-start bg-gray-50">
//       <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
        
//         {/* ===== PAGE HEADER ===== */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
//           <div className="flex items-center gap-3">
//             <Link href="/account" className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
//               <ArrowLeft className="w-5 h-5 text-gray-600" />
//             </Link>
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
//               <p className="text-sm text-gray-500">Manage your account information and preferences.</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-3">
//             <button 
//               onClick={toggleEdit}
//               className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm ${
//                 isEditing 
//                   ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
//                   : 'bg-[#2B7A4B] text-white hover:bg-[#23663e]'
//               }`}
//             >
//               {isEditing ? 'Cancel' : <><Edit3 className="w-4 h-4" /> Edit Profile</>}
//             </button>
//             {isEditing && (
//               <button 
//                 onClick={handleSubmit}
//                 disabled={isSaving}
//                 className="flex items-center gap-2 px-4 py-2.5 bg-[#2B7A4B] text-white rounded-lg text-sm font-medium hover:bg-[#23663e] transition-colors shadow-sm disabled:opacity-70"
//               >
//                 {isSaving ? (
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 ) : (
//                   <>
//                     <Save className="w-4 h-4" />
//                     Save Changes
//                   </>
//                 )}
//               </button>
//             )}
//           </div>
//         </div>

//         {/* ===== MAIN CARD GRID ===== */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
//           {/* === LEFT COLUMN: PROFILE SUMMARY === */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
              
//               {/* ===== PROFILE PICTURE ===== */}
//               <div className="relative w-28 h-28 mx-auto mb-4">
//                 {user?.profileImage ? (
//                   <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-sm">
//                     <img 
//                       key={imageKey}
//                       src={`${user.profileImage}?t=${Date.now()}`} 
//                       alt="Profile" 
//                       className="w-full h-full object-cover"
//                       onError={(e) => {
//                         console.error('❌ Image failed to load:', e.target.src);
//                         e.target.style.display = 'none';
//                       }}
//                       onLoad={() => console.log('✅ Image loaded successfully:', user.profileImage)}
//                     />
//                   </div>
//                 ) : (
//                   <div className="w-full h-full rounded-full bg-gradient-to-br from-[#2B7A4B] to-[#4ADE80] flex items-center justify-center border-4 border-white shadow-sm">
//                     <span className="text-4xl font-bold text-white">
//                       {user.firstName?.[0]}{user.lastName?.[0]}
//                     </span>
//                   </div>
//                 )}
                
//                 <button 
//                   onClick={openCloudinaryWidget}
//                   disabled={uploadingImage}
//                   className="absolute bottom-1 right-1 bg-white rounded-full p-1.5 shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
//                   title="Upload profile picture"
//                 >
//                   {uploadingImage ? (
//                     <div className="w-4 h-4 border-2 border-[#2B7A4B] border-t-transparent rounded-full animate-spin"></div>
//                   ) : (
//                     <Camera className="w-4 h-4 text-[#2B7A4B]" />
//                   )}
//                 </button>

//                 {user?.profileImage && (
//                   <button 
//                     onClick={removeProfileImage}
//                     className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
//                     title="Remove profile picture"
//                   >
//                     <Trash2 className="w-3 h-3" />
//                   </button>
//                 )}
//               </div>

//               <h2 className="text-xl font-bold text-gray-900">
//                 {user.firstName} {user.lastName}
//               </h2>
//               <p className="text-sm text-gray-500 mb-2">{user.email}</p>
//               <p className="text-xs text-[#2B7A4B] bg-[#2B7A4B]/10 inline-block px-3 py-1 rounded-full font-medium">
//                 {user.role || 'Customer'}
//               </p>

//               {/* Quick Stats */}
//               <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-gray-100">
//                 <div className="bg-gray-50 rounded-lg p-3">
//                   <ShoppingBag className="w-4 h-4 text-gray-400 mx-auto mb-1" />
//                   <p className="text-lg font-bold text-gray-900">12</p>
//                   <p className="text-[10px] text-gray-500 uppercase">Orders</p>
//                 </div>
//                 <div className="bg-gray-50 rounded-lg p-3">
//                   <Star className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
//                   <p className="text-lg font-bold text-gray-900">4.8</p>
//                   <p className="text-[10px] text-gray-500 uppercase">Rating</p>
//                 </div>
//               </div>

//               {/* Links */}
//               <div className="space-y-3 mt-6 pt-4 border-t border-gray-100">
//                 <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
//                   <Calendar className="w-4 h-4 text-[#2B7A4B]" />
//                   <span>Joined: <span className="font-medium text-gray-900">{formatDate(user.createdAt)}</span></span>
//                 </div>
//                 <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
//                   <Gift className="w-4 h-4 text-[#2B7A4B]" />
//                   <span>Reward Points: <span className="font-medium text-gray-900">1,450</span></span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* === RIGHT COLUMN: PERSONAL DETAILS FORM === */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              
//               <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
//                 <User className="w-5 h-5 text-[#2B7A4B]" />
//                 <h3 className="text-lg font-bold text-gray-900">Personal Details</h3>
//               </div>

//               <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
//                 {/* First Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
//                   {isEditing ? (
//                     <div className="relative">
//                       <User className="absolute inset-y-0 left-0 pl-3 w-4 h-4 text-gray-400 pointer-events-none" />
//                       <input
//                         type="text"
//                         name="firstName"
//                         value={formData.firstName}
//                         onChange={handleChange}
//                         placeholder="Enter your first name"
//                         className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
//                         required
//                       />
//                     </div>
//                   ) : (
//                     <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 flex items-center gap-2">
//                       <User className="w-4 h-4 text-gray-400" />
//                       {user.firstName || <span className="text-gray-400 italic">Not provided</span>}
//                     </div>
//                   )}
//                 </div>

//                 {/* Last Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
//                   {isEditing ? (
//                     <div className="relative">
//                       <User className="absolute inset-y-0 left-0 pl-3 w-4 h-4 text-gray-400 pointer-events-none" />
//                       <input
//                         type="text"
//                         name="lastName"
//                         value={formData.lastName}
//                         onChange={handleChange}
//                         placeholder="Enter your last name"
//                         className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
//                         required
//                       />
//                     </div>
//                   ) : (
//                     <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 flex items-center gap-2">
//                       <User className="w-4 h-4 text-gray-400" />
//                       {user.lastName || <span className="text-gray-400 italic">Not provided</span>}
//                     </div>
//                   )}
//                 </div>

//                 {/* Email */}
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
//                   {isEditing ? (
//                     <div className="relative">
//                       <Mail className="absolute inset-y-0 left-0 pl-3 w-4 h-4 text-gray-400 pointer-events-none" />
//                       <input
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         placeholder="Enter your email"
//                         className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
//                         required
//                       />
//                     </div>
//                   ) : (
//                     <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 flex items-center gap-2">
//                       <Mail className="w-4 h-4 text-gray-400" />
//                       {user.email || <span className="text-gray-400 italic">Not provided</span>}
//                     </div>
//                   )}
//                 </div>

//                 {/* Phone Number */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
//                   {isEditing ? (
//                     <div className="relative">
//                       <Phone className="absolute inset-y-0 left-0 pl-3 w-4 h-4 text-gray-400 pointer-events-none" />
//                       <input
//                         type="tel"
//                         name="phone"
//                         value={formData.phone}
//                         onChange={handleChange}
//                         placeholder="e.g. +1 (555) 123-4567"
//                         className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
//                       />
//                     </div>
//                   ) : (
//                     <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 flex items-center gap-2">
//                       <Phone className="w-4 h-4 text-gray-400" />
//                       {user.phone || <span className="text-gray-400 italic">Not provided</span>}
//                     </div>
//                   )}
//                 </div>

//                 {/* Country */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1.5">Country / Region</label>
//                   {isEditing ? (
//                     <div className="relative">
//                       <MapPin className="absolute inset-y-0 left-0 pl-3 w-4 h-4 text-gray-400 pointer-events-none" />
//                       <input
//                         type="text"
//                         name="country"
//                         value={formData.country}
//                         onChange={handleChange}
//                         placeholder="e.g. United States"
//                         className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
//                       />
//                     </div>
//                   ) : (
//                     <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 flex items-center gap-2">
//                       <MapPin className="w-4 h-4 text-gray-400" />
//                       {user.country || <span className="text-gray-400 italic">Not provided</span>}
//                     </div>
//                   )}
//                 </div>

//                 {/* Bio / About Me */}
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-1.5">About Me</label>
//                   {isEditing ? (
//                     <textarea
//                       name="bio"
//                       value={formData.bio}
//                       onChange={handleChange}
//                       rows="3"
//                       placeholder="Tell us a little about yourself..."
//                       className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B] resize-none"
//                     />
//                   ) : (
//                     <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
//                       {user.bio || <span className="text-gray-400 italic">No bio yet. Click Edit to add one!</span>}
//                     </div>
//                   )}
//                 </div>

//                 {/* Gender */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
//                   {isEditing ? (
//                     <select
//                       name="gender"
//                       value={formData.gender}
//                       onChange={handleChange}
//                       className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
//                     >
//                       <option value="Prefer not to say">Prefer not to say</option>
//                       <option value="Male">Male</option>
//                       <option value="Female">Female</option>
//                       <option value="Non-binary">Non-binary</option>
//                     </select>
//                   ) : (
//                     <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
//                       {user.gender || <span className="text-gray-400 italic">Not specified</span>}
//                     </div>
//                   )}
//                 </div>

//                 {/* Language */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Language</label>
//                   {isEditing ? (
//                     <select
//                       name="language"
//                       value={formData.language}
//                       onChange={handleChange}
//                       className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
//                     >
//                       <option value="English">English</option>
//                       <option value="Spanish">Spanish</option>
//                       <option value="French">French</option>
//                       <option value="German">German</option>
//                     </select>
//                   ) : (
//                     <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
//                       {formData.language || <span className="text-gray-400 italic">Not selected</span>}
//                     </div>
//                   )}
//                 </div>

//                 {/* Change Password */}
//                 <div className="md:col-span-2 pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
//                   <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <Shield className="w-4 h-4 text-[#2B7A4B]" />
//                     <span>Secure your account with a strong password.</span>
//                   </div>
//                   <button className="text-[#2B7A4B] text-sm font-medium hover:underline flex items-center gap-1">
//                     <Key className="w-4 h-4" />
//                     Change Password
//                   </button>
//                 </div>

//               </form>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }




// app/account/profile/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  User, Mail, Phone, MapPin, Shield,
  Calendar, Edit3, Key, Save, ArrowLeft,
  Camera, Trash2,
  ShoppingBag, Star
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ===== FORCE IMAGE RE-RENDER KEY =====
  const [imageKey, setImageKey] = useState(Date.now());

  // ===== REAL STATS STATE =====
  const [stats, setStats] = useState({
    ordersCount: 0,
    avgRating: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // ===== CLOUDINARY STATE =====
  const [uploadingImage, setUploadingImage] = useState(false);
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  // ===== FORM STATE =====
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    bio: '',
    gender: '',
    language: 'English',
  });

  // ==========================================
  // ✅ LOAD USER DATA
  // ==========================================
  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        console.log('👤 /api/auth/me response:', data.user);
        console.log('📅 createdAt:', data.user?.createdAt);

        setUser(data.user);
        setFormData({
          firstName: data.user.firstName || '',
          lastName: data.user.lastName || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          country: data.user.country || '',
          bio: data.user.bio || 'Plant lover and nature enthusiast. 🌱',
          gender: data.user.gender || 'Prefer not to say',
          language: 'English',
        });
      } else {
        router.push('/login');
      }
    } catch (e) {
      console.error('❌ fetchUser error:', e);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ✅ FETCH REAL STATS (frontend-only)
  // ==========================================
  const fetchStats = async () => {
    try {
      setStatsLoading(true);

      // 1️⃣ Fetch user's orders
      let orders = [];

      // ⚠️ CHANGE THIS URL to match your actual orders endpoint!
     // ✅ CORRECT
const ordersUrl = `${API_BASE_URL}/api/orders/my-orders`;
      console.log('📦 Fetching orders from:', ordersUrl);

      try {
        const ordersRes = await fetch(ordersUrl, {
          credentials: 'include',
        });
        console.log('📦 Orders response status:', ordersRes.status);

        if (ordersRes.ok) {
          const data = await ordersRes.json();
          console.log('📦 Orders raw data:', data);
          orders = data.orders || data.data || data || [];
          if (!Array.isArray(orders)) orders = [];
        }
      } catch (e) {
        console.warn('Orders endpoint not available:', e.message);
      }

      // 2️⃣ Fetch user's reviews (optional)
      let reviews = [];
      try {
        const reviewsRes = await fetch(`${API_BASE_URL}/api/reviews/my`, {
          credentials: 'include',
        });
        if (reviewsRes.ok) {
          const data = await reviewsRes.json();
          reviews = data.reviews || data.data || data || [];
          if (!Array.isArray(reviews)) reviews = [];
        }
      } catch (e) {
        // Silent fail
      }

      // 3️⃣ Calculate average rating
      const avgRating =
        reviews.length > 0
          ? Number(
              (
                reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
                reviews.length
              ).toFixed(1)
            )
          : 0;

      setStats({
        ordersCount: orders.length,
        avgRating,
      });

      console.log('✅ Stats loaded:', {
        ordersCount: orders.length,
        avgRating,
      });
    } catch (err) {
      console.error('❌ Error fetching stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchStats();

    const handleAuthChange = () => {
      fetchUser();
      fetchStats();
    };
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, [router]);

  // ===== HANDLE FORM CHANGES =====
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ===== TOGGLE EDIT MODE =====
  const toggleEdit = () => {
    if (isEditing) {
      if (user) {
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phone || '',
          country: user.country || '',
          bio: user.bio || 'Plant lover and nature enthusiast. 🌱',
          gender: user.gender || 'Prefer not to say',
          language: 'English',
        });
      }
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  // ===== CLOUDINARY UPLOAD =====
  const openCloudinaryWidget = () => {
    if (!cloudName || !uploadPreset) {
      alert('Cloudinary configuration missing.');
      return;
    }

    if (!document.querySelector('script[src*="upload-widget.cloudinary"]')) {
      const script = document.createElement('script');
      script.src = 'https://upload-widget.cloudinary.com/global/all.js';
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => openCloudinaryWidget();
      return;
    }

    if (window.cloudinary) {
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: cloudName,
          uploadPreset: uploadPreset,
          sources: ['local', 'url'],
          multiple: false,
          cropping: true,
          croppingAspectRatio: 1,
          resourceType: 'image',
          maxFileSize: 5000000,
        },
        async (error, result) => {
          if (!error && result && result.event === 'success') {
            if (result.info.resource_type === 'image') {
              const secureUrl = result.info.secure_url;
              setUploadingImage(false);
              await saveProfileImageToBackend(secureUrl);
            } else {
              alert('Upload failed: Please select an image file.');
              setUploadingImage(false);
            }
          } else if (error) {
            console.error('Cloudinary error:', error);
            setUploadingImage(false);
          }
        }
      );
      setUploadingImage(true);
      widget.open();
    } else {
      setTimeout(() => openCloudinaryWidget(), 500);
    }
  };

  // ===== SAVE PROFILE IMAGE TO BACKEND =====
  const saveProfileImageToBackend = async (imageUrl) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/update-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ profileImage: imageUrl }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user && data.user.profileImage) {
          const updatedUser = {
            ...data.user,
            profileImage: data.user.profileImage,
          };
          setUser(updatedUser);
          localStorage.setItem('authUser', JSON.stringify(updatedUser));
          window.dispatchEvent(new Event('authChange'));
          window.dispatchEvent(new Event('profileImageUpdated'));
          setImageKey(Date.now());
          alert('Profile picture updated successfully! 🎉');
        } else {
          alert('Profile image saved but not returned from server.');
          window.location.reload();
        }
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to save profile image');
      }
    } catch (err) {
      console.error('❌ Fetch error:', err);
      alert('Error connecting to server');
    }
  };

  // ===== REMOVE PROFILE IMAGE =====
  const removeProfileImage = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/update-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ profileImage: null }),
      });

      if (res.ok) {
        const data = await res.json();
        const updatedUser = { ...data.user, profileImage: null };
        setUser(updatedUser);
        setImageKey(Date.now());
        localStorage.setItem('authUser', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('authChange'));
        window.dispatchEvent(new Event('profileImageUpdated'));
        alert('Profile picture removed');
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to remove profile image');
      }
    } catch (err) {
      console.error('Error removing profile image:', err);
      alert('Error removing profile image');
    }
  };

  // ===== SAVE PROFILE CHANGES =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/update-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          country: formData.country,
          bio: formData.bio,
          gender: formData.gender,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const updatedUser = { ...data.user };
        setUser(updatedUser);
        localStorage.setItem('authUser', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('authChange'));
        setIsEditing(false);
        alert('Profile updated successfully! 🎉');
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Error connecting to server');
    } finally {
      setIsSaving(false);
    }
  };

  // ===== DATE FORMATTER =====
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#2B7A4B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="w-full h-full flex flex-col justify-start bg-gray-50">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-10">

        {/* ===== PAGE HEADER ===== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/account"
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              <p className="text-sm text-gray-500">
                Manage your account information and preferences.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleEdit}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm ${
                isEditing
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-[#2B7A4B] text-white hover:bg-[#23663e]'
              }`}
            >
              {isEditing ? (
                'Cancel'
              ) : (
                <>
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </>
              )}
            </button>
            {isEditing && (
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#2B7A4B] text-white rounded-lg text-sm font-medium hover:bg-[#23663e] transition-colors shadow-sm disabled:opacity-70"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* ===== MAIN CARD GRID ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* === LEFT COLUMN: PROFILE SUMMARY === */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">

              {/* ===== PROFILE PICTURE ===== */}
              <div className="relative w-28 h-28 mx-auto mb-4">
                {user?.profileImage ? (
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-sm bg-[#2B7A4B] relative">
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-3xl">
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </div>
                    <Image
                      key={imageKey}
                      src={`${user.profileImage}?t=${Date.now()}`}
                      alt={user.firstName || 'Profile'}
                      fill
                      sizes="112px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#2B7A4B] to-[#4ADE80] flex items-center justify-center border-4 border-white shadow-sm">
                    <span className="text-4xl font-bold text-white">
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </span>
                  </div>
                )}

                <button
                  onClick={openCloudinaryWidget}
                  disabled={uploadingImage}
                  className="absolute bottom-1 right-1 bg-white rounded-full p-1.5 shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
                  title="Upload profile picture"
                >
                  {uploadingImage ? (
                    <div className="w-4 h-4 border-2 border-[#2B7A4B] border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Camera className="w-4 h-4 text-[#2B7A4B]" />
                  )}
                </button>

                {user?.profileImage && (
                  <button
                    onClick={removeProfileImage}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                    title="Remove profile picture"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              <h2 className="text-xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-sm text-gray-500 mb-2">{user.email}</p>
              <p className="text-xs text-[#2B7A4B] bg-[#2B7A4B]/10 inline-block px-3 py-1 rounded-full font-medium">
                {user.role || 'Customer'}
              </p>

              {/* ===== QUICK STATS — REAL DATA ===== */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-gray-100">
                <div className="bg-gray-50 rounded-lg p-3">
                  <ShoppingBag className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                  {statsLoading ? (
                    <div className="h-6 w-10 bg-gray-200 rounded mx-auto animate-pulse"></div>
                  ) : (
                    <p className="text-lg font-bold text-gray-900">
                      {stats.ordersCount}
                    </p>
                  )}
                  <p className="text-[10px] text-gray-500 uppercase">Orders</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <Star className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
                  {statsLoading ? (
                    <div className="h-6 w-10 bg-gray-200 rounded mx-auto animate-pulse"></div>
                  ) : (
                    <p className="text-lg font-bold text-gray-900">
                      {stats.avgRating > 0 ? stats.avgRating : '—'}
                    </p>
                  )}
                  <p className="text-[10px] text-gray-500 uppercase">Rating</p>
                </div>
              </div>

              {/* ===== JOINED DATE — REAL DATA ===== */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-[#2B7A4B]" />
                  <span>
                    Joined:{' '}
                    <span className="font-medium text-gray-900">
                      {user.createdAt ? formatDate(user.createdAt) : 'Recently'}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* === RIGHT COLUMN: PERSONAL DETAILS FORM === */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                <User className="w-5 h-5 text-[#2B7A4B]" />
                <h3 className="text-lg font-bold text-gray-900">
                  Personal Details
                </h3>
              </div>

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    First Name
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <User className="absolute inset-y-0 left-0 pl-3 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Enter your first name"
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                        required
                      />
                    </div>
                  ) : (
                    <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      {user.firstName || (
                        <span className="text-gray-400 italic">Not provided</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Last Name
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <User className="absolute inset-y-0 left-0 pl-3 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Enter your last name"
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                        required
                      />
                    </div>
                  ) : (
                    <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      {user.lastName || (
                        <span className="text-gray-400 italic">Not provided</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <Mail className="absolute inset-y-0 left-0 pl-3 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                        required
                      />
                    </div>
                  ) : (
                    <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {user.email || (
                        <span className="text-gray-400 italic">Not provided</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <Phone className="absolute inset-y-0 left-0 pl-3 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. +1 (555) 123-4567"
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                      />
                    </div>
                  ) : (
                    <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {user.phone || (
                        <span className="text-gray-400 italic">Not provided</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Country / Region
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <MapPin className="absolute inset-y-0 left-0 pl-3 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="e.g. United States"
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                      />
                    </div>
                  ) : (
                    <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {user.country || (
                        <span className="text-gray-400 italic">Not provided</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bio */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    About Me
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Tell us a little about yourself..."
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B] resize-none"
                    />
                  ) : (
                    <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                      {user.bio || (
                        <span className="text-gray-400 italic">
                          No bio yet. Click Edit to add one!
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Gender
                  </label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                    >
                      <option value="Prefer not to say">Prefer not to say</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                    </select>
                  ) : (
                    <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                      {user.gender || (
                        <span className="text-gray-400 italic">Not specified</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Preferred Language
                  </label>
                  {isEditing ? (
                    <select
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A4B]"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                    </select>
                  ) : (
                    <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                      {formData.language || (
                        <span className="text-gray-400 italic">Not selected</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Change Password */}
                <div className="md:col-span-2 pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-[#2B7A4B]" />
                    <span>Secure your account with a strong password.</span>
                  </div>
                  <button className="text-[#2B7A4B] text-sm font-medium hover:underline flex items-center gap-1">
                    <Key className="w-4 h-4" />
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}