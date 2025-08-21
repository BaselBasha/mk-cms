"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicAwardById } from "@/redux/awardsSlice";
import { motion } from "framer-motion";
import {
  Award,
  Calendar,
  Building,
  ArrowLeft,
  MapPin,
  Star,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function AwardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    currentItem: award,
    loading,
    error,
  } = useSelector((state) => state.awards);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchPublicAwardById(params.id));
    }
  }, [dispatch, params.id]);

  // Get all images (main image + documents that are images)
  const getAllImages = () => {
    const images = [];
    if (award?.image?.url) {
      images.push({
        url: award.image.url,
        name: award.image.name || "Main Award Image",
        type: "main",
      });
    }

    if (award?.documents) {
      award.documents.forEach((doc) => {
        if (doc.type?.startsWith("image/")) {
          images.push({
            url: doc.url,
            name: doc.name || "Award Document",
            type: "document",
          });
        }
      });
    }

    return images;
  };

  const images = getAllImages();

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#65a30d]"></div>
      </div>
    );
  }

  if (error || !award) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Award Not Found
          </h2>
          <p className="text-gray-400 mb-6">
            The award you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/awards"
            className="inline-flex items-center space-x-2 bg-[#65a30d] text-white px-6 py-3 rounded-full hover:bg-[#84cc16] transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Awards</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center mb-8">
          <Link
            href="/awards"
            className="flex items-center space-x-2 text-[#65a30d] hover:text-[#84cc16] transition-colors mr-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Awards</span>
          </Link>
        </div>

        {/* Award Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Award Icon and Basic Info */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-[#65a30d] to-[#84cc16] rounded-full flex items-center justify-center mb-4">
                <Award className="w-10 h-10 text-white" />
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-[#65a30d]/20 text-[#65a30d] rounded-full text-sm font-medium">
                  {award.category}
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                  {award.level}
                </span>
              </div>
            </div>

            {/* Award Details */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-4">
                {award.title}
              </h1>
              <p className="text-xl text-gray-300 mb-6">{award.summary}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 text-gray-300">
                  <Building className="w-5 h-5 text-[#65a30d]" />
                  <span>{award.awardingBody}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Calendar className="w-5 h-5 text-[#65a30d]" />
                  <span>
                    {new Date(award.awardDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            {images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6">
                  Award Gallery
                </h2>

                <div className="relative">
                  <div className="aspect-video bg-gray-800 rounded-xl overflow-hidden mb-4">
                    <img
                      src={images[currentImageIndex].url}
                      alt={images[currentImageIndex].name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}

                  {/* Image Thumbnails */}
                  {images.length > 1 && (
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                      {images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                            index === currentImageIndex
                              ? "border-[#65a30d]"
                              : "border-white/20 hover:border-white/40"
                          }`}
                        >
                          <img
                            src={image.url}
                            alt={image.name}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                About This Award
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {award.description}
                </p>
              </div>
            </motion.div>

            {/* Features */}
            {award.features && award.features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-6"
              >
                <h2 className="text-2xl font-bold text-white mb-6">
                  Key Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {award.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Star className="w-5 h-5 text-[#65a30d] flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Award Details Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-6 sticky top-8"
            >
              <h3 className="text-xl font-bold text-white mb-4">
                Award Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">
                    Category
                  </label>
                  <p className="text-white font-medium">{award.category}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-400 block mb-1">
                    Level
                  </label>
                  <p className="text-white font-medium">{award.level}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-400 block mb-1">
                    Awarding Body
                  </label>
                  <p className="text-white font-medium">{award.awardingBody}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-400 block mb-1">
                    Date Awarded
                  </label>
                  <p className="text-white font-medium">
                    {new Date(award.awardDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Documents */}
            {award.documents && award.documents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  Related Documents
                </h3>

                <div className="space-y-3">
                  {award.documents.map((doc, index) => (
                    <a
                      key={index}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                    >
                      <Download className="w-5 h-5 text-[#65a30d] group-hover:text-[#84cc16] transition-colors" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate">
                          {doc.name}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {doc.type && doc.type !== "image/*"
                            ? doc.type
                            : "Document"}
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 