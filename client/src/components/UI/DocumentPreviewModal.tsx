import React, { useEffect, useState } from "react";
import {
  X,
  FileText,
  Calendar,
  User,
  FileCheck,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { getFile } from "../../utils/fileStorage";
import * as xlsx from "xlsx";
import mammoth from "mammoth";

interface DocumentPreviewModalProps {
  document: {
    id?: string;
    name: string;
    fileName?: string;
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
  const [fileUrl, setFileUrl] = useState<string | null>(document?.url || null);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [isExcel, setIsExcel] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!document?.id) return;

    let objectUrl: string | null = null;

    const loadDocument = async () => {
      setLoading(true);
      const file = await getFile(document.id!);
      if (file && (file instanceof File || file instanceof Blob)) {
        const name = (
          document.fileName ||
          (file instanceof File ? file.name : "") ||
          ""
        ).toLowerCase();

        if (
          name.endsWith(".xls") ||
          name.endsWith(".xlsx") ||
          name.endsWith(".csv") ||
          document.type.includes("Excel")
        ) {
          setIsExcel(true);
          try {
            const buffer = await file.arrayBuffer();
            const workbook = xlsx.read(buffer, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const html = xlsx.utils.sheet_to_html(workbook.Sheets[sheetName], {
              header: "",
              footer: "",
            });
            setHtmlContent(html);
          } catch (e) {
            console.error("Error parsing Excel:", e);
          }
        } else if (
          name.endsWith(".doc") ||
          name.endsWith(".docx") ||
          document.type.includes("Word")
        ) {
          try {
            const buffer = await file.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
            setHtmlContent(result.value);
          } catch (e) {
            console.error("Error parsing Word:", e);
          }
        } else {
          // Fallback to native preview (PDFs, Images, etc)
          objectUrl = URL.createObjectURL(file);
          setFileUrl(objectUrl);
        }
      }
      setLoading(false);
    };

    loadDocument();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [document]);

  // const handleDownload = async () => {
  //   if (fileUrl) {
  //     const a = window.document.createElement("a");
  //     a.href = fileUrl;
  //     a.download = document?.fileName || document?.name || "download";
  //     a.click();
  //   } else if (document?.id) {
  //     const file = await getFile(document.id);
  //     if (file && (file instanceof File || file instanceof Blob)) {
  //       const url = URL.createObjectURL(file);
  //       const a = window.document.createElement("a");
  //       a.href = url;
  //       a.download = document?.fileName || document?.name || "download";
  //       a.click();
  //       URL.revokeObjectURL(url);
  //     }
  //   }
  // };

  if (!document) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "2rem 1rem",
        overflowY: "auto",
      }}
      className="backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "1100px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          overflow: "hidden",
          marginBottom: "2rem",
          display: "flex",
          flexDirection: "column",
          minHeight: "90vh",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)",
            padding: "1.5rem 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white/10 rounded-lg text-white backdrop-blur-sm">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white leading-tight">
                {document.name}
              </h3>
              <div className="flex items-center gap-3 text-sm text-emerald-100 mt-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />{" "}
                  {new Date(document.uploadedAt).toLocaleDateString()}
                </span>
                <span className="w-1 h-1 rounded-full bg-emerald-300/50"></span>
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> {document.uploadedBy}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "none",
                borderRadius: "8px",
                color: "white",
                cursor: "pointer",
                padding: "0.5rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-gray-100 p-8 overflow-y-auto flex justify-center">
          <div
            className={`bg-white shadow-xl w-full ${
              isExcel ? "max-w-full" : "max-w-4xl"
            } min-h-full rounded-sm border border-gray-300 flex flex-col`}
          >
            {loading ? (
              <div className="flex items-center justify-center p-12 h-full text-gray-500">
                <span className="animate-spin mr-3 inline-block h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full"></span>
                <span>Loading preview...</span>
              </div>
            ) : fileUrl ? (
              <iframe
                src={fileUrl}
                className="w-full h-full min-h-[600px] border-none block"
                title="Preview"
              />
            ) : htmlContent ? (
              <div
                className={`w-full overflow-x-auto ${
                  isExcel
                    ? "p-4 sm:p-8 [&_table]:w-[calc(100%-2rem)] sm:[&_table]:w-[calc(100%-4rem)] [&_table]:m-4 sm:[&_table]:m-8 [&_table]:min-w-max [&_table]:border-collapse [&_th]:border [&_th]:border-gray-300 [&_th]:bg-gray-100 [&_th]:p-3 [&_th]:text-left [&_th]:font-semibold [&_th]:text-gray-700 [&_td]:border [&_td]:border-gray-200 [&_td]:p-3 [&_td]:text-gray-600 [&_tr:hover]:bg-gray-50"
                    : "p-8 prose prose-slate max-w-none"
                }`}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
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
        <div
          style={{
            padding: "1rem 2rem",
            borderTop: "1px solid #e2e8f0",
            background: "white",
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "0.65rem 1.25rem",
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.875rem",
              color: "var(--text)",
              fontWeight: 500,
            }}
          >
            Close Preview
          </button>
          <button
            style={{
              padding: "0.65rem 1.25rem",
              background: "var(--primary)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.875rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <FileCheck className="w-4 h-4" /> Approve Document
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;
