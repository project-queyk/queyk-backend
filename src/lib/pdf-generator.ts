import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

export interface ReadingData {
  battery: number;
  createdAt: string;
  id: string;
  siAverage: number;
  siMaximum: number;
  siMinimum: number;
  signalStrength: string;
}

export interface ReportData {
  readings: ReadingData[];
  dateRange: string;
  peakMagnitude: { value: number; time: string };
  avgMagnitude: string;
  significantReadings: number;
  peakActivity: { value: string; siAverage?: number };
  batteryLevel: number;
  aiSummary: string;
}

export function generateSeismicReportBuffer(data: ReportData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new jsPDF();
      let yPosition = 20;

      const queykLogo =
        "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";
      const iccLogo = "";

      const colors = {
        primary: [25, 56, 103] as [number, number, number],
        primaryForeground: [255, 255, 255] as [number, number, number],
        accent: [53, 80, 122] as [number, number, number],
        text: [33, 37, 41] as [number, number, number],
        mutedText: [108, 117, 125] as [number, number, number],
        yellow: [255, 212, 59] as [number, number, number],
      };

      const pageWidth = doc.internal.pageSize.width;

      doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.rect(0, 0, pageWidth, 30, "F");

      doc.addImage(queykLogo, "PNG", 10, 5, 25, 8);

      if (iccLogo) {
        doc.addImage(iccLogo, "PNG", pageWidth - 18, 5, 8, 8);
      }

      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(colors.yellow[0], colors.yellow[1], colors.yellow[2]);
      doc.text("Seismic Activity Report", pageWidth / 2, 15, {
        align: "center",
      });

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(220, 220, 220);
      doc.text("Immaculada Concepcion College", pageWidth / 2, 22, {
        align: "center",
      });

      yPosition = 40;

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(
        colors.mutedText[0],
        colors.mutedText[1],
        colors.mutedText[2]
      );
      doc.text(`Report Period: ${data.dateRange}`, 20, yPosition);
      yPosition += 7;
      doc.text(
        `Generated: ${new Date().toLocaleString("en-US", {
          timeZone: "Asia/Manila",
        })}`,
        20,
        yPosition
      );
      yPosition += 15;

      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("Summary Statistics", 20, yPosition);
      yPosition += 12;

      if (data.aiSummary && data.aiSummary.trim()) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);

        const splitSummary = doc.splitTextToSize(data.aiSummary, 170);
        doc.text(splitSummary, 20, yPosition);

        const summaryHeight = splitSummary.length * 5;
        yPosition += summaryHeight + 8;
      }

      const summaryData = [
        [
          "Peak SI Maximum",
          `${data.peakMagnitude.value.toFixed(3)} @ ${data.peakMagnitude.time}`,
        ],
        ["Average SI Reading", data.avgMagnitude],
        [
          "Significant Activity Readings",
          `${data.significantReadings} readings`,
        ],
        [
          "Peak Activity Time",
          `${data.peakActivity.value}${
            data.peakActivity.siAverage
              ? ` (${data.peakActivity.siAverage.toFixed(3)} SI)`
              : ""
          }`,
        ],
      ];

      autoTable(doc, {
        startY: yPosition,
        head: [["Metric", "Value"]],
        body: summaryData,
        theme: "striped",
        styles: {
          fontSize: 10,
          cellPadding: 4,
        },
        headStyles: {
          fillColor: colors.primary,
          textColor: colors.primaryForeground,
          fontStyle: "bold",
        },
        margin: { left: 20, right: 20 },
      });

      const finalY = doc.lastAutoTable.finalY + 25;

      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("Detailed Readings", 20, finalY);

      const tableData = data.readings
        .slice()
        .reverse()
        .map((reading) => [
          new Date(reading.createdAt).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Manila",
          }),
          reading.siAverage.toFixed(3),
          reading.siMaximum.toFixed(3),
          reading.siMinimum.toFixed(3),
          `${reading.battery}%`,
          reading.signalStrength,
        ]);

      autoTable(doc, {
        startY: finalY + 5,
        head: [["Time", "SI Avg", "SI Max", "SI Min", "Battery", "Signal"]],
        body: tableData,
        theme: "striped",
        styles: {
          fontSize: 8,
          cellPadding: 3,
          lineColor: [240, 240, 240],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: colors.accent,
          textColor: colors.primaryForeground,
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: 35 },
          1: { halign: "center", cellWidth: 20 },
          2: { halign: "center", cellWidth: 20 },
          3: { halign: "center", cellWidth: 20 },
          4: { halign: "center", cellWidth: 18 },
          5: { halign: "center", cellWidth: 18 },
        },
        margin: { left: 20, right: 20 },
        tableLineColor: [240, 240, 240],
        tableLineWidth: 0.1,
        showFoot: false,
      });

      const pageCount = doc.internal.pages.length - 1;

      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;

        doc.setFontSize(8);
        doc.setTextColor(
          colors.mutedText[0],
          colors.mutedText[1],
          colors.mutedText[2]
        );
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, pageHeight - 12, {
          align: "right",
        });
      }

      doc.setPage(pageCount);
      const pageHeight = doc.internal.pageSize.height;

      doc.setFontSize(8);
      doc.setTextColor(
        colors.mutedText[0],
        colors.mutedText[1],
        colors.mutedText[2]
      );
      doc.text(
        "Generated by Queyk for Immaculada Concepcion College",
        20,
        pageHeight - 12
      );

      const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
      resolve(pdfBuffer);
    } catch (error) {
      reject(error);
    }
  });
}
