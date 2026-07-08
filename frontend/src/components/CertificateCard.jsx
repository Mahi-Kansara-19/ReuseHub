const CertificateCard = ({
  certificate,
  onGenerate,
  generating,
  totalListedWaste = 0,
}) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8">

      {/* Title */}

      <div className="flex items-center gap-4 mb-6">
        <div className="text-5xl">🏆</div>

        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Sustainability Certificate
          </h2>

          <p className="text-slate-500">
            Earn a certificate after listing 5000 kg or more of waste.
          </p>
        </div>
      </div>

      {/* If certificate already exists */}

      {certificate ? (
        <>
          <div className="grid md:grid-cols-3 gap-6 mb-8">

            <div className="bg-slate-50 rounded-xl p-5">
              <p className="text-sm text-slate-500">
                Certificate No
              </p>

              <h3 className="font-bold mt-2 break-all">
                {certificate.certificateNumber}
              </h3>
            </div>

            <div className="bg-slate-50 rounded-xl p-5">
              <p className="text-sm text-slate-500">
                Total Waste
              </p>

              <h3 className="font-bold text-green-600 text-xl mt-2">
                {certificate.totalWaste} kg
              </h3>
            </div>

            <div className="bg-slate-50 rounded-xl p-5">
              <p className="text-sm text-slate-500">
                Status
              </p>

              <h3 className="font-bold text-blue-600 mt-2">
                ✅ Certificate Generated
              </h3>
            </div>

          </div>

          <div className="bg-green-100 border border-green-300 rounded-xl p-4 text-green-700 font-medium">
            Congratulations! You've earned your sustainability certificate.
          </div>
        </>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-50 rounded-xl p-5">
              <p className="text-sm text-slate-500">
                Total Waste Listed
              </p>

              <h3 className="font-bold text-slate-800 text-xl mt-2">
                {totalListedWaste} kg
              </h3>
            </div>

            <div className="bg-slate-50 rounded-xl p-5">
              <p className="text-sm text-slate-500">
                Eligibility Status
              </p>

              <h3 className={`font-bold mt-2 text-xl ${totalListedWaste >= 5000 ? "text-green-600" : "text-amber-600"}`}>
                {totalListedWaste >= 5000 ? "✅ Eligible" : "⚠️ Ineligible"}
              </h3>
            </div>
          </div>

          {totalListedWaste < 5000 ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
              <h3 className="font-semibold text-lg text-amber-800 mb-2">
                Minimum 5000 kg Waste Required
              </h3>

              <p className="text-slate-600">
                You have listed <strong>{totalListedWaste} kg</strong> of waste. You need to list at least <strong>{5000 - totalListedWaste} kg</strong> more waste to earn a sustainability certificate.
              </p>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-6">
              <h3 className="font-semibold text-lg text-emerald-800 mb-2">
                Eligible for Certificate!
              </h3>

              <p className="text-slate-600">
                You have successfully listed <strong>{totalListedWaste} kg</strong> of waste, meeting the 5000 kg threshold. Click below to generate your certificate.
              </p>
            </div>
          )}

          <button
            onClick={onGenerate}
            disabled={generating || totalListedWaste < 5000}
            className="bg-green-600 hover:bg-green-700 transition text-white px-8 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating
              ? "Generating..."
              : "Generate Certificate"}
          </button>
        </>
      )}
    </div>
  );
};

export default CertificateCard;