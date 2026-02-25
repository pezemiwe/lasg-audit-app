import React from "react";
import {
  X,
  FileText,
  Download,
  Calendar,
  User,
  FileCheck,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

interface DocumentPreviewModalProps {
  document: {
    name: string;
    type: string;
    uploadedBy: string;
    uploadedAt: string;
    size?: string;
    url?: string;
  } | null;
  onClose: () => void;
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  onClose,
}) => {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 leading-tight">
                {document.name}
              </h3>
              <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />{" "}
                  {new Date(document.uploadedAt).toLocaleDateString()}
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> {document.uploadedBy}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <Download className="w-4 h-4" /> Download
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-gray-100 p-8 overflow-y-auto flex justify-center">
          <div className="bg-white shadow-xl w-full max-w-3xl min-h-full rounded-sm border border-gray-300 flex flex-col">
            {document.url ? (
              <iframe
                src={document.url}
                className="w-full h-full min-h-[600px] border-none block"
                title="Preview"
              />
            ) : (
              <div className="p-12 space-y-8">
                {/* Header of the document */}
                <div className="text-center border-b-2 border-black pb-8 mb-8">
                  <img
                    src="/lasg-logo-placeholder.png"
                    alt="LASG Logo"
                    className="w-20 mx-auto mb-4 opacity-50 block bg-gray-200 rounded-full h-20"
                  />
                  <h1 className="text-2xl font-serif font-bold text-black uppercase tracking-wider mb-2">
                    Lagos State Government
                  </h1>
                  <h2 className="text-lg font-serif font-semibold text-gray-700">
                    {document.type.toUpperCase()} DOCUMENT
                  </h2>
                </div>

                {/* Body Content Placeholder */}
                <div className="space-y-6 font-serif text-gray-800 leading-relaxed">
                  <p className="text-justify">
                    This document serves as the official submission for the{" "}
                    <strong>{document.name}</strong> as requested by the Lagos
                    State Audit Commission. The contents herein are certified to
                    be true and accurate representations of the financial and
                    operational status of the Local Government Area.
                  </p>

                  <div className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-4 w-5/6 bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-4 w-4/6 bg-gray-100 rounded animate-pulse"></div>

                  <div className="py-8 grid grid-cols-2 gap-8">
                    <div className="border border-gray-200 p-4 rounded bg-gray-50">
                      <h4 className="font-bold text-sm text-gray-600 mb-2 uppercase">
                        Compliance Status
                      </h4>
                      <div className="flex items-center gap-2 text-green-700 font-medium">
                        <ShieldCheck className="w-5 h-5" /> Verified
                      </div>
                    </div>
                    <div className="border border-gray-200 p-4 rounded bg-gray-50">
                      <h4 className="font-bold text-sm text-gray-600 mb-2 uppercase">
                        Risk Level
                      </h4>
                      <div className="flex items-center gap-2 text-amber-600 font-medium">
                        <AlertCircle className="w-5 h-5" /> Moderate
                      </div>
                    </div>
                  </div>

                  <p className="text-justify">
                    Please review the attached schedules and appendices for
                    detailed breakdowns of expenditure and revenue generation
                    occurring within the reporting period. All discrepancies
                    have been noted in the primary audit file.
                  </p>
                </div>

                {/* Signature Area */}
                <div className="mt-12 pt-12 flex justify-between items-end">
                  <div className="text-center">
                    <div className="w-48 border-b border-black mb-2"></div>
                    <p className="font-serif text-sm">
                      Head of Local Government
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-48 border-b border-black mb-2"></div>
                    <p className="font-serif text-sm">Council Treasurer</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-white flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Close Preview
          </button>
          <button className="px-5 py-2.5 text-sm font-medium text-white bg-[#064e3b] hover:bg-[#065f46] rounded-lg shadow-sm transition-colors flex items-center gap-2">
            <FileCheck className="w-4 h-4" /> Approve Document
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;
