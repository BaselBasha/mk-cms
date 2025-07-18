"use client";
import React from "react";

export default function AwardDetailPage() {
  return (
    <main className="min-h-screen bg-[#f5e9da] py-12 px-4 flex justify-center items-start">
      <div className="max-w-2xl w-full bg-white/80 rounded-2xl shadow-lg border border-[#e0c097] p-8">
        <h1 className="text-3xl font-bold text-[#5c4327] mb-2">Best Sustainable Initiative 2023</h1>
        <p className="text-[#7a8450] text-lg mb-4">Recognizing excellence in sustainable agriculture</p>
        <div className="mb-4">
          <span className="font-semibold text-[#3e5c3a]">Summary:</span>
          <p className="text-[#5c4327]">Awarded for outstanding achievements in desert reclamation and eco-friendly farming.</p>
        </div>
        <div className="mb-4">
          <span className="font-semibold text-[#3e5c3a]">Description:</span>
          <p className="text-[#5c4327]">This award celebrates our innovative approach to transforming arid land into productive, sustainable farmland.</p>
        </div>
        <div className="mb-4">
          <span className="font-semibold text-[#3e5c3a]">Attachments:</span>
          <ul className="list-disc ml-6 text-[#5c4327]">
            <li><a href="#" className="underline text-[#b5c99a]">Award Certificate.pdf</a></li>
          </ul>
        </div>
        <div>
          <span className="font-semibold text-[#3e5c3a]">Priority:</span>
          <span className="inline-block ml-2 px-3 py-1 rounded-full bg-[#e0c097] text-[#5c4327] font-semibold">High</span>
        </div>
      </div>
    </main>
  );
} 