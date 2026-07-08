import { useEffect, useRef, useState } from "react"; 
import { getCertificates, generateCertificate } from "../services/certificateService"; 
import { getMyWasteListings } from "../services/wasteService"; 
import { downloadCertificate } from "../utils/downloadCertificate"; 
import CertificateCard from "../components/CertificateCard"; 
import CertificatePreview from "../components/CertificatePreview";

const Certificate = () => {
  const [certificate, setCertificate] = useState(null);
  const [totalListedWaste, setTotalListedWaste] = useState(0);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");

  const certificateRef = useRef(null);

  const loadCertificate = async () => {
    try {
      // Fetch certificates
      const data = await getCertificates();
      if (data && data.length > 0) {
        setCertificate(data[0]);
      } else {
        setCertificate(null);
      }

      // Fetch own listings to compute total waste listed
      const ownListings = await getMyWasteListings();
      let total = 0;
      ownListings.forEach((listing) => {
        const qty = parseFloat(
          String(listing.quantity).replace(/[^\d.]/g, "")
        );
        if (!isNaN(qty)) {
          total += qty;
        }
      });
      setTotalListedWaste(total);
    } catch (err) {
      setMessage(err.response?.data?.message || err.message || "Failed to load certificate information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificate();
  }, []);

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      setMessage("");

      const res = await generateCertificate();
      setMessage(res.message || "Certificate generated successfully");

      await loadCertificate(); // refresh UI
    } catch (err) {
      setMessage(err.response?.data?.message || err.message || "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
    setGenerating(true);

    try {
      // wait for DOM render
      setTimeout(async () => {
        await downloadCertificate(certificateRef);
        setGenerating(false);
      }, 300);
    } catch (err) {
      setGenerating(false);
      setMessage("Download failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="h-10 w-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-3" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">

      {/* Heading */}

      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-800">
          Sustainability Certificate
        </h1>

        <p className="text-slate-500 mt-2">
          Generate your recycling achievement certificate.
        </p>
      </div>

      {/* Message */}

      {message && (
        <div className={`mb-6 rounded-xl p-4 ${message.includes("failed") || message.includes("Failed") || message.includes("only") || message.includes("required") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {message}
        </div>
      )}

      {/* Card */}

      <CertificateCard
        certificate={certificate}
        onGenerate={handleGenerate}
        generating={generating}
        totalListedWaste={totalListedWaste}
      />

      {/* Preview */}

      {certificate && (
        <div className="mt-10">
          <CertificatePreview certificate={certificate} />
        </div>
      )}
    </div>
  );
};

export default Certificate;