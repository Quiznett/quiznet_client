import React, { useRef, useEffect } from "react";
import html2pdf from "html2pdf.js";

export default function ResponseSheet({ attempt, onClose }) {
  const modalRef = useRef(null);
  const printRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose && onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const responses = attempt.responses;
  const fullName = attempt.full_name;

  const total = responses.length;
  const correct = responses.filter((r) => r.is_correct).length;
  const wrong = responses.filter((r) => r.selected_option && !r.is_correct).length;
  const left = responses.filter((r) => r.selected_option === null).length;

  // Score from API OR fallback to correct/total
  const scoreValue = attempt.score ?? `${correct}/${total}`;

  // PDF Generator
  const downloadPDF = () => {
    const input = printRef.current;

    const opt = {
      margin: 0.5,
      filename: `${fullName}-AnswerSheet.pdf`,
      html2canvas: { scale: 3, backgroundColor: "#ffffff" },
      jsPDF: { unit: "in", format: "a4" },
      pagebreak: { avoid: "div" }
    };

    const pdf = html2pdf().set(opt).from(input);

    // Page numbers
    pdf.toPdf().get("pdf").then((doc) => {
      const totalPages = doc.internal.getNumberOfPages();

      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(
          `Page ${i} of ${totalPages}`,
          doc.internal.pageSize.getWidth() - 40,
          doc.internal.pageSize.getHeight() - 10
        );
      }
    }).save();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 px-4">

      <div
        ref={modalRef}
        className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 shadow-xl"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {fullName}'s Answer Sheet
          </h1>

          {onClose && (
            <button onClick={onClose} className="text-red-600 text-2xl">✖</button>
          )}
        </div>

        {/* DOWNLOAD BUTTON */}
        <button
          onClick={downloadPDF}
          className="px-4 py-2 mt-4 mb-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Download PDF
        </button>

        {/* PDF CONTENT */}
        <div ref={printRef} className="bg-white text-black p-6 rounded-md">

          {/* QUIZNET LOGO (text version) */}
        {/* QUIZNET LOGO (image) */}

 {/* SUBMISSION TIME */}
          <p className="text-gray-700 mb-4">
            Submitted: {new Date(attempt.submitted_at).toLocaleString()}
          </p>

          {/* SCORE BOX */}
          <div className="p-4 mb-6 bg-blue-100 border border-blue-300 rounded-lg text-center">
            <h2 className="text-xl font-bold text-blue-900">Score</h2>
            <p className="text-3xl font-extrabold mt-1">{scoreValue}</p>
          </div>

        

          {/* SUMMARY */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-green-100 border rounded-lg">
              <p className="text-2xl font-bold">{correct}</p>
              <p>Correct</p>
            </div>
            <div className="p-4 bg-red-100 border rounded-lg">
              <p className="text-2xl font-bold">{wrong}</p>
              <p>Wrong</p>
            </div>
            <div className="p-4 bg-yellow-100 border rounded-lg">
              <p className="text-2xl font-bold">{left}</p>
              <p>Left</p>
            </div>
            <div className="p-4 bg-gray-100 border rounded-lg">
              <p className="text-2xl font-bold">{total}</p>
              <p>Total Questions</p>
            </div>
          </div>

          {/* QUESTIONS */}
          {responses.map((r, idx) => (
            <div
              key={r.question_id}
              className="p-4 bg-white border rounded-lg mb-6"
              style={{
                pageBreakInside: "avoid",
                breakInside: "avoid",
                pageBreakBefore: "auto",
              }}
            >
              <h2 className="text-lg font-semibold mb-3">
                Q{idx + 1}. {r.question_title}
              </h2>

              {[r.option1, r.option2, r.option3, r.option4].map((opt, i) => {
                const optionNum = i + 1;
                const isCorrect = optionNum === r.correct_option;
                const isSelected = optionNum === r.selected_option;

                let bg = "bg-white border border-gray-300";

                if (isSelected && isCorrect) bg = "bg-green-300 border border-green-600";
                else if (isSelected && !isCorrect) bg = "bg-red-200 border border-red-600";
                else if (isCorrect) bg = "bg-green-100 border border-green-400";

                return (
                  <div key={i} className={`p-3 rounded-md my-1 ${bg}`}>
                    {optionNum}. {opt}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
