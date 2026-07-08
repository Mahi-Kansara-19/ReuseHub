import { toPng } from "html-to-image";
import jsPDF from "jspdf";

export const downloadCertificate = async (ref) => {
  const img = await toPng(ref.current, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: "#ffffff",
  });

  const pdf = new jsPDF({
    orientation: "l",
    unit: "px",
    format: [1123, 794],
  });

  pdf.addImage(img, "PNG", 0, 0, 1123, 794);
  pdf.save("Certificate.pdf");
};