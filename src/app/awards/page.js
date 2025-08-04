"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicAwards } from "@/redux/awardsSlice";
import { motion } from "framer-motion";
import { Award, Calendar, Building, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AwardsPage() {
  const dispatch = useDispatch();
  const { publicItems: awards, loading } = useSelector((state) => state.awards);

  useEffect(() => {
    dispatch(fetchPublicAwards());
  }, [dispatch]);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#65a30d]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center mb-8">
          <Link
            href="/"
            className="flex items-center space-x-2 text-[#65a30d] hover:text-[#84cc16] transition-colors mr-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Our Awards & Recognition</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Celebrating excellence and innovation in sustainable agriculture
          </p>
        </div>

        {awards.length === 0 ? (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No awards available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {awards.map((award, index) => (
              <Link
                key={award._id || index}
                href={`/awards/${award._id}`}
                className="block"
              >
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-[#65a30d]/30 hover:bg-black/30 transition-all duration-300 cursor-pointer group"
                >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#65a30d] to-[#84cc16] rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-400">
                      {award.awardDate ? new Date(award.awardDate).getFullYear() : "N/A"}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{award.title}</h3>
                
                {award.summary && (
                  <p className="text-gray-300 mb-4 line-clamp-3">{award.summary}</p>
                )}

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Building className="w-4 h-4" />
                    <span>{award.awardingBody || "Unknown Organization"}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{award.awardDate ? new Date(award.awardDate).toLocaleDateString() : "Date not specified"}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {award.category && (
                    <span className="px-3 py-1 bg-[#65a30d]/20 text-[#65a30d] rounded-full text-xs">
                      {award.category}
                    </span>
                  )}
                  {award.level && (
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                      {award.level}
                    </span>
                  )}
                </div>
                
                {/* View Details Button */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-center space-x-2 text-[#65a30d] group-hover:text-[#84cc16] transition-colors">
                    <span className="text-sm font-medium">View Details</span>
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </div>
                </div>
              </motion.div>
            </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 