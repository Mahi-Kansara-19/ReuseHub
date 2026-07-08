import { useEffect, useRef, useState } from "react";
import { downloadCertificate } from "../utils/downloadCertificate";

const CertificatePreview = ({ certificate }) => {
  const certificateRef = useRef();
  const containerRef = useRef();
  const [scale, setScale] = useState(1);

  // Prioritize real user details from the database populated inside the certificate object
  const user = (certificate?.user && typeof certificate.user === "object") 
    ? certificate.user 
    : JSON.parse(localStorage.getItem("user"));

  const issueDate = new Date(
    certificate.issuedDate
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const certWidth = 1123; // Landscape A4 Width
        if (containerWidth < certWidth) {
          setScale(containerWidth / certWidth);
        } else {
          setScale(1);
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Download Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => downloadCertificate(certificateRef)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-md cursor-pointer"
        >
          Download Certificate
        </button>
      </div>

      {/* Certificate Container with responsive scaling */}
      <div 
        ref={containerRef} 
        className="w-full flex justify-center overflow-hidden bg-slate-100 rounded-3xl p-4 sm:p-8"
        style={{ height: `${794 * scale + (scale < 1 ? 32 : 64)}px` }}
      >
        <div
          style={{
            width: "1123px",
            height: "794px",
            transform: `scale(${scale})`,
            transformOrigin: "top center",
          }}
          className="shrink-0 shadow-2xl rounded-xl overflow-hidden"
        >
          {/* Outer Border: Green Frame */}
          <div
            ref={certificateRef}
            className="w-full h-full p-4"
            style={{
              background: "#ffffff",
              border: "12px solid #15803d",
              boxSizing: "border-box",
            }}
          >
            {/* Inner Border: Gold/Amber Decorative Line */}
            <div
              className="w-full h-full p-12 flex flex-col justify-between"
              style={{
                border: "2px solid #b45309",
                boxSizing: "border-box",
              }}
            >
              {/* Header Section */}
              <div className="text-center">
                <div className="text-5xl mb-2">🏆</div>
                <h1 className="text-4xl font-extrabold tracking-widest text-emerald-800 uppercase">
                  Certificate of Sustainability
                </h1>
                <h2 className="text-xs tracking-wider text-slate-500 font-bold uppercase mt-1">
                  circular economy achievement award
                </h2>
                <div className="border-b-2 border-emerald-600 w-64 mx-auto mt-2 mb-3"></div>
              </div>

              {/* Recipient Section */}
              <div className="text-center my-1">
                <p className="text-base text-slate-400 italic">
                  This certificate is proudly presented to
                </p>
                <h2 className="text-3xl font-extrabold mt-1 text-slate-800 uppercase tracking-wide">
                  {user?.businessName}
                </h2>
                <p className="text-sm text-slate-500 font-semibold mt-1">
                  Owner: {user?.ownerName}
                </p>
              </div>

              {/* Achievement Details */}
              <div className="text-center my-1">
                <p className="text-base text-slate-600">
                  for outstanding contribution to circularity by recycling
                </p>
                <div className="flex justify-center items-baseline gap-2 my-1">
                  <span className="text-5xl font-black text-emerald-700 tracking-tight">
                    {certificate.totalWaste}
                  </span>
                  <span className="text-2xl font-bold text-slate-500">KG</span>
                </div>
                <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
                  of industrial waste materials through the <strong>ReuseHub Platform</strong>, contributing to carbon offset and eco-friendly manufacturing processes.
                </p>
              </div>

              {/* Footer and Signatures */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="grid grid-cols-2 items-end">
                  {/* Left Side: Metadata */}
                  <div className="flex gap-10">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                        Certificate ID
                      </p>
                      <h3 className="font-bold text-slate-700 text-xs mt-1">
                        {certificate.certificateNumber}
                      </h3>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                        Date Issued
                      </p>
                      <h3 className="font-bold text-slate-700 text-xs mt-1">
                        {issueDate}
                      </h3>
                    </div>
                  </div>

                  {/* Right Side: Authority Signature */}
                  <div className="text-right">
                    <div className="inline-block text-center">
                      <div className="border-t-2 border-slate-300 w-44 mx-auto mb-1"></div>
                      <h3 className="font-bold text-slate-800 text-xs">
                        ReuseHub Executive
                      </h3>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                        Authorized Signatory
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CertificatePreview;