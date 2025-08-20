"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCompany } from "@/redux/companiesSlice";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/locales/translations";
import { Upload, Calendar as CalendarIcon } from "lucide-react";
import AdminHeader from "@/shared/AdminHeader";
import { ENDPOINTS } from "@/shared/endpoints";

export default function NewCompanyPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  const { loading } = useSelector((state) => state.companies);

  const [formLang, setFormLang] = useState(language || 'en');
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [established, setEstablished] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState({ type: null, message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name, summary, description, website, established, isActive };
    if (logo) payload.logo = logo;

    try {
      await dispatch(createCompany({ data: payload, lang: formLang })).unwrap();
      setBanner({ type: 'success', message: language === 'ar' ? 'تم إنشاء الشركة بنجاح! سيتم إعادة التوجيه...' : 'Company created successfully! Redirecting...' });
      setTimeout(() => router.push('/admin/companies'), 1500);
    } catch (err) {
      setBanner({ type: 'error', message: language === 'ar' ? 'فشل إنشاء الشركة. يرجى المحاولة مجددًا.' : 'Failed to create company. Please try again.' });
    }
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
        setLogo({ url: data.url, name: file.name, size: file.size, type: file.type });
      }
    } catch (_) {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900" dir={isRTL ? 'rtl' : 'ltr'}>
      <AdminHeader currentPage={t.admin.nav.companies} />
      <div style={{ height: '72px' }} />
      <div className="container mx-auto px-6 py-8">
        <div className="bg-black/30 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">{language === 'ar' ? 'إضافة شركة جديدة' : 'Add New Company'}</h1>
              <p className="text-gray-400">{language === 'ar' ? 'أدخل تفاصيل الشركة' : 'Enter company details'}</p>
            </div>
            <div className="flex items-center space-x-3">
              <label className="text-gray-300">{language === 'ar' ? 'لغة الحفظ' : 'Save Language'}:</label>
              <select value={formLang} onChange={(e) => setFormLang(e.target.value)} className="px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white">
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>
          </div>

          {banner.type && (
            <div className={`mb-4 p-3 rounded ${banner.type === 'success' ? 'bg-green-600/20 text-green-300' : 'bg-red-600/20 text-red-300'}`}>
              {banner.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">{language === 'ar' ? 'اسم الشركة' : 'Company Name'} <span className="text-red-400">*</span></label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white" required />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">{language === 'ar' ? 'الملخص' : 'Summary'} <span className="text-red-400">*</span></label>
              <textarea value={summary} onChange={(e) => setSummary(e.target.value)} className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white" rows={2} required />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">{language === 'ar' ? 'الوصف' : 'Description'} <span className="text-red-400">*</span></label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white" rows={6} required />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">{language === 'ar' ? 'الموقع الإلكتروني' : 'Website'}</label>
              <input value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white" />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">{language === 'ar' ? 'تاريخ التأسيس' : 'Established'}</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <CalendarIcon className="h-4 w-4" />
                </div>
                <input type="date" value={established} onChange={(e) => setEstablished(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white" />
              </div>
            </div>

            

            <div className="flex items-center space-x-2">
              <input id="active" type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
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
              {logo?.url && (
                <div className="mt-3 bg-black/40 border border-white/10 rounded-lg p-3">
                  <img src={logo.url} alt="logo" className="h-16 object-contain" />
                </div>
              )}
            </div>

            <div className="md:col-span-2 flex justify-end space-x-3">
              <button type="button" onClick={() => router.push('/admin/companies')} className="px-4 py-2 border border-white/10 text-white rounded-lg hover:bg-white/10">
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                {loading ? (language === 'ar' ? 'جاري الإنشاء...' : 'Creating...') : (language === 'ar' ? 'إنشاء' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


