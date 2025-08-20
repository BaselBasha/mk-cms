"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminHeader from "@/shared/AdminHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicCareers } from "@/redux/careersSlice";
import {
  selectPublicCareers,
  selectCareersLoading,
  selectCareersError,
} from "@/redux/careersSlice";
import { ENDPOINTS } from "@/shared/endpoints";
import {
  Briefcase,
  MapPin,
  Building,
  Users,
  FileText,
  Download,
  Eye,
  Calendar,
  ArrowLeft,
  Search,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/locales/translations";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// --- Particle Background Component ---
const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;

    let particlesArray = [];
    const numberOfParticles = 50;

    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
      update() {
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    function init() {
      particlesArray = [];
      for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 1.5 + 0.5;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let directionX = Math.random() * 0.2 - 0.1;
        let directionY = Math.random() * 0.2 - 0.1;
        let color = "rgba(101, 163, 13, 0.2)";
        particlesArray.push(
          new Particle(x, y, directionX, directionY, size, color)
        );
      }
    }

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
    }

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
      init();
    };

    init();
    animate();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        background:
          "linear-gradient(135deg, #0f1419 0%, #1a2d27 50%, #0f1419 100%)",
      }}
    />
  );
};

const AdminCandidatesPage = () => {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  
  const [selectedJob, setSelectedJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeDepartment, setActiveDepartment] = useState(t.admin.candidates.departments.all);
  const dispatch = useDispatch();

  // Redux selectors
  const careers = useSelector(selectPublicCareers);
  const loading = useSelector(selectCareersLoading);
  const error = useSelector(selectCareersError);

     // Load careers data
   useEffect(() => {
     dispatch(fetchPublicCareers());
   }, [dispatch]);

  // Fetch candidates for a specific job
  const fetchCandidates = async (jobId) => {
    setLoadingCandidates(true);
    try {
      console.log('Fetching candidates for jobId:', jobId);
      console.log('Using endpoint:', `${ENDPOINTS.candidates}?jobId=${jobId}`);
      
      const response = await fetch(`${ENDPOINTS.candidates}?jobId=${jobId}`);
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Candidates data received:', data);
        setCandidates(data.data || []);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch candidates:', response.status, errorText);
        setCandidates([]);
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setCandidates([]);
    } finally {
      setLoadingCandidates(false);
    }
  };

  const handleJobSelect = (job) => {
    console.log('Job selected:', job);
    console.log('Job ID:', job._id || job.id);
    setSelectedJob(job);
    fetchCandidates(job._id || job.id);
  };

  const handleBackToJobs = () => {
    setSelectedJob(null);
    setCandidates([]);
  };

  const handleStatusUpdate = (candidateId, newStatus) => {
    setCandidates(prevCandidates =>
      prevCandidates.map(candidate =>
        candidate._id === candidateId
          ? { ...candidate, status: newStatus }
          : candidate
      )
    );
  };

  const departments = [
    t.admin.candidates.departments.all,
    t.admin.candidates.departments.engineering,
    t.admin.candidates.departments.sales,
    t.admin.candidates.departments.marketing,
    t.admin.candidates.departments.operations,
    t.admin.candidates.departments.finance,
    t.admin.candidates.departments.hr,
    t.admin.candidates.departments.it,
    t.admin.candidates.departments.researchDevelopment,
    t.admin.candidates.departments.qualityAssurance,
    t.admin.candidates.departments.supplyChain,
  ];

  const filteredCareers = careers.filter((career) => {
    const matchesDepartment =
      activeDepartment === t.admin.candidates.departments.all || career.department === activeDepartment;
    const matchesSearch =
      career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      career.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      career.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDepartment && matchesSearch;
  });

  if (loading && careers.length === 0) {
    return (
      <div className="bg-transparent text-gray-200 font-sans min-h-screen">
        <ParticleBackground />
        <AdminHeader currentPage="Job Candidates" />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-[#65a30d] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">{t.admin.candidates.loadingCareers}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-transparent text-gray-200 font-sans min-h-screen"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <ParticleBackground />
      <AdminHeader currentPage={t.admin.candidates.pageTitle} />

      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-10">
        <LanguageSwitcher />
      </div>

      <div className="container mx-auto px-6 py-8 mt-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="flex items-center text-gray-400 hover:text-[#65a30d] transition-colors duration-300 mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.admin.candidates.backToDashboard}
            </Link>
            <h1 className="text-4xl font-bold text-white">{t.admin.candidates.pageTitle}</h1>
            <p className="text-xl text-gray-400 mt-2">
              {t.admin.candidates.subtitle}
            </p>
          </div>
          
        </div>

        {!selectedJob ? (
          // Jobs List View
          <div>
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={t.admin.candidates.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#65a30d] focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-400 text-sm">{t.admin.candidates.departmentLabel}</span>
                  <select
                    value={activeDepartment}
                    onChange={(e) => setActiveDepartment(e.target.value)}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#65a30d] focus:border-transparent transition-all duration-300"
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept} className="bg-gray-800">{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Jobs Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredCareers.map((job, index) => (
                <motion.div
                  key={job._id || job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <JobCard job={job} onSelect={handleJobSelect} />
                </motion.div>
              ))}
            </motion.div>

            {filteredCareers.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {t.admin.candidates.noJobsFound}
                </h3>
                <p className="text-gray-400">
                  {t.admin.candidates.noJobsSubtitle}
                </p>
              </motion.div>
            )}
          </div>
        ) : (
          // Job Details and Candidates View
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Job Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">{selectedJob.title}</h2>
                  <button
                    onClick={handleBackToJobs}
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Building className="w-4 h-4" />
                    <span>{selectedJob.department}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedJob.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Briefcase className="w-4 h-4" />
                    <span>{selectedJob.type}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{selectedJob.experience}</span>
                  </div>
                  {selectedJob.applicationDeadline && (
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{t.admin.candidates.deadline} {new Date(selectedJob.applicationDeadline).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-3">{t.admin.candidates.jobSummary}</h3>
                  <p className="text-gray-400 leading-relaxed">{selectedJob.summary}</p>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Candidates List */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                                 <div className="flex items-center justify-between mb-6">
                   <h3 className="text-xl font-bold text-white">{t.admin.candidates.candidates}</h3>
                   <div className="flex items-center space-x-2 text-gray-400">
                     <Users className="w-4 h-4" />
                     <span>{candidates.length} {t.admin.candidates.applications}</span>
                   </div>
                 </div>

                                 {loadingCandidates ? (
                   <div className="text-center py-8">
                     <div className="w-8 h-8 border-2 border-[#65a30d] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                     <p className="text-gray-400">{t.admin.candidates.loadingCandidates}</p>
                   </div>
                ) : candidates.length > 0 ? (
                  <div className="space-y-4">
                    {candidates.map((candidate, index) => (
                      <CandidateCard 
                        key={candidate._id || index} 
                        candidate={candidate} 
                        onStatusUpdate={handleStatusUpdate}
                      />
                    ))}
                  </div>
                                 ) : (
                   <div className="text-center py-8">
                     <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                     <p className="text-gray-400">{t.admin.candidates.noApplicationsYet}</p>
                     <p className="text-sm text-gray-500">{t.admin.candidates.noApplicationsSubtitle}</p>
                     <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                       <p className="text-yellow-300 text-sm">
                         <strong>{t.admin.candidates.debugInfo}</strong>
                       </p>
                       <ul className="text-yellow-400 text-xs mt-2 list-disc list-inside">
                         <li>{t.admin.candidates.debugNoCandidates}</li>
                         <li>{t.admin.candidates.debugBackendIssue}</li>
                         <li>{t.admin.candidates.debugDatabaseIssue}</li>
                       </ul>
                     </div>
                   </div>
                 )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

// Job Card Component
const JobCard = ({ job, onSelect }) => {
  const { language } = useLanguage();
  const t = translations[language];
  
  return (
  <div
    onClick={() => onSelect(job)}
    className="group relative bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-2xl hover:shadow-[#65a30d]/20 transition-all duration-500 cursor-pointer"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[#65a30d]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white group-hover:text-[#65a30d] transition-colors duration-300 mb-2">
            {job.title}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
            <Building className="w-4 h-4" />
            <span>{job.department}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="px-3 py-1 rounded-full text-xs font-medium bg-[#65a30d]/20 text-[#65a30d] border border-[#65a30d]/30">
            {job.type}
          </div>
        </div>
      </div>
      
      <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
        {job.summary}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <Users className="w-4 h-4" />
          <span>{job.experience}</span>
        </div>
                 <div className="flex items-center text-[#65a30d] font-medium text-sm">
           <span>{t.admin.candidates.viewApplications}</span>
           <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
           </svg>
         </div>
      </div>
    </div>
  </div>
  );
};

// Candidate Card Component
const CandidateCard = ({ candidate, onStatusUpdate }) => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const handleStatusUpdate = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      const response = await fetch(`${ENDPOINTS.candidates}/${candidate._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        onStatusUpdate(candidate._id, newStatus);
      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl border border-white/10 p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-white mb-1">{candidate.applicantName}</h4>
                     <p className="text-sm text-gray-400">
             {t.admin.candidates.applied} {new Date(candidate.appliedAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
               year: 'numeric',
               month: 'short',
               day: 'numeric'
             })}
           </p>
        </div>
        <div className="flex items-center space-x-2">
                     <select
             value={candidate.status}
             onChange={(e) => handleStatusUpdate(e.target.value)}
             disabled={updatingStatus}
             className={`px-2 py-1 rounded-full text-xs font-medium border transition-all duration-300 ${
               candidate.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
               candidate.status === 'reviewed' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
               candidate.status === 'shortlisted' ? 'bg-[#65a30d]/20 text-[#65a30d] border-[#65a30d]/30' :
               'bg-red-500/20 text-red-300 border-red-500/30'
             } ${updatingStatus ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}`}
           >
             <option value="pending" className="bg-gray-800">{t.admin.candidates.status.pending}</option>
             <option value="reviewed" className="bg-gray-800">{t.admin.candidates.status.reviewed}</option>
             <option value="shortlisted" className="bg-gray-800">{t.admin.candidates.status.shortlisted}</option>
             <option value="rejected" className="bg-gray-800">{t.admin.candidates.status.rejected}</option>
           </select>
        </div>
      </div>

             <div className="space-y-2">
         <div className="flex items-center justify-between text-sm">
           <span className="text-gray-400">{t.admin.candidates.cvFile}</span>
           <span className="text-white font-mono text-xs">{candidate.cvFile.name}</span>
         </div>
         <div className="flex items-center justify-between text-sm">
           <span className="text-gray-400">{t.admin.candidates.fileSize}</span>
           <span className="text-white">{(candidate.cvFile.size / 1024).toFixed(1)} KB</span>
         </div>
         <div className="flex items-center justify-between text-sm">
           <span className="text-gray-400">{t.admin.candidates.fileType}</span>
           <span className="text-white">{candidate.cvFile.mimeType}</span>
         </div>
       </div>

             <div className="flex items-center space-x-2 mt-4">
         <a
           href={candidate.cvFile.url}
           target="_blank"
           rel="noopener noreferrer"
           className="flex items-center space-x-2 px-3 py-2 bg-[#65a30d]/20 text-[#65a30d] rounded-lg hover:bg-[#65a30d]/30 transition-colors duration-300 text-sm"
         >
           <Eye className="w-4 h-4" />
           <span>{t.admin.candidates.viewCV}</span>
         </a>
         <a
           href={candidate.cvFile.url}
           download={candidate.cvFile.name}
           className="flex items-center space-x-2 px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors duration-300 text-sm"
         >
           <Download className="w-4 h-4" />
           <span>{t.admin.candidates.download}</span>
         </a>
       </div>
    </div>
  );
};

export default AdminCandidatesPage;