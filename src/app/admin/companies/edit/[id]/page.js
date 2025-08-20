"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanyById, updateCompany } from "@/redux/companiesSlice";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { ENDPOINTS } from "@/shared/endpoints";
import { Upload, Calendar as CalendarIcon } from "lucide-react";
import AdminHeader from "@/shared/AdminHeader";

export default function EditCompanyPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { language, isRTL } = useLanguage();
  const { currentItem: company, loading } = useSelector((state) => state.companies);
  const [banner, setBanner] = useState({ type: null, message: "" });

  const [form, setForm] = useState({ name: "", summary: "", description: "", website: "", established: "", isActive: true, logo: null });
  const [removeLogo, setRemoveLogo] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchCompanyById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (company) {
      setForm({
        name: company.name || "",
        summary: company.summary || "",
        description: company.description || "",
        website: company.website || "",
        established: company.established || "",
        isActive: company.isActive ?? true,
        logo: company.logo || null,
      });
    }
  }, [company]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(ENDPOINTS.upload, { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data?.url) {
        setForm((prev) => ({ ...prev, logo: { url: data.url, name: file.name, size: file.size, type: file.type } }));
        setRemoveLogo(false);
      }
    } catch (_) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (removeLogo) payload.removeLogo = true;
      // order removed from update flow
      await dispatch(updateCompany({ id, data: payload })).unwrap();
      setBanner({ type: 'success', message: language === 'ar' ? 'تم تحديث الشركة بنجاح!' : 'Company updated successfully!' });
      setTimeout(() => router.push('/admin/companies'), 1200);
    } catch (_) {
      setBanner({ type: 'error', message: language === 'ar' ? 'فشل تحديث الشركة.' : 'Failed to update company.' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900" dir={isRTL ? 'rtl' : 'ltr'}>
      <AdminHeader currentPage={language === 'ar' ? 'تعديل الشركة' : 'Edit Company'} />
      <div style={{ height: '72px' }} />
      <div className="container mx-auto px-6 py-8">
        <div className="bg-black/30 border border-white/10 rounded-xl p-6">
          <h1 className="text-2xl font-bold text-white mb-4">{language === 'ar' ? 'تعديل الشركة' : 'Edit Company'}</h1>
          {banner.type && (
            <div className={`mb-4 p-3 rounded ${banner.type === 'success' ? 'bg-green-600/20 text-green-300' : 'bg-red-600/20 text-red-300'}`}>
              {banner.message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">{language === 'ar' ? 'اسم الشركة' : 'Company Name'}</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">{language === 'ar' ? 'الملخص' : 'Summary'}</label>
              <textarea name="summary" value={form.summary} onChange={handleChange} className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white" rows={2} required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">{language === 'ar' ? 'الوصف' : 'Description'}</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white" rows={6} required />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">{language === 'ar' ? 'الموقع الإلكتروني' : 'Website'}</label>
              <input name="website" value={form.website} onChange={handleChange} className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white" />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">{language === 'ar' ? 'تاريخ التأسيس' : 'Established'}</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <CalendarIcon className="h-4 w-4" />
                </div>
                <input type="date" name="established" value={(form.established || '').toString().slice(0,10)} onChange={handleChange} className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white" />
              </div>
            </div>
            <div>
              <label className="block text-gray-300 mb-2">{language === 'ar' ? 'الترتيب' : 'Order'}</label>
              <input type="number" name="order" value={form.order} onChange={handleChange} className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white" />
            </div>
            <div className="flex items-center space-x-2">
              <input id="active" type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
              <label htmlFor="active" className="text-gray-300">{language === 'ar' ? 'نشط' : 'Active'}</label>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">{language === 'ar' ? 'الشعار' : 'Logo'}</label>
              <div className="relative border-2 border-dashed rounded-xl p-6 text-center border-white/20 hover:border-white/40">
                <input type="file" accept="image/*" onChange={handleLogoChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-[#65a30d]/20 rounded-full flex items-center justify-center">
                    <Upload className="h-6 w-6 text-[#65a30d]" />
                  </div>
                  <p className="text-gray-300 font-medium">{language === 'ar' ? 'اسحب وأسقط الشعار أو انقر للاختيار' : 'Drag & drop logo or click to choose'}</p>
                  <p className="text-gray-400 text-sm">PNG, JPG, SVG</p>
                </div>
              </div>
              {(form.logo?.url) && (
                <div className="mt-3 bg-black/40 border border-white/10 rounded-lg p-3 flex items-center justify-between">
                  <img src={form.logo.url} alt="logo" className="h-16 object-contain" />
                  <div className="flex items-center space-x-2">
                    <input id="removeLogo" type="checkbox" checked={removeLogo} onChange={(e) => setRemoveLogo(e.target.checked)} />
                    <label htmlFor="removeLogo" className="text-gray-400 text-sm">{language === 'ar' ? 'حذف الشعار' : 'Remove logo'}</label>
                  </div>
                </div>
              )}
            </div>
            <div className="md:col-span-2 flex justify-end space-x-3">
              <button type="button" onClick={() => router.push('/admin/companies')} className="px-4 py-2 border border-white/10 text-white rounded-lg hover:bg-white/10">
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                {loading ? (language === 'ar' ? 'جاري التحديث...' : 'Updating...') : (language === 'ar' ? 'تحديث' : 'Update')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


