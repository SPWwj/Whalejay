import html2pdf from "html2pdf.js";



type Html2PdfOptions = {
    margin: [number, number];
    filename: string;
    image: { type: string; quality: number };
    html2canvas: { scale: number };
    jsPDF: { unit: string; format: string; orientation: string };
};


export const printContentToPdf = (id: string) => {
    const contentElement = document.getElementById(id);

    if (!contentElement) {
        console.error('Content element not found: ' + id);
        return;
    }

    const options: Html2PdfOptions = {
        margin: [0, 0],
        filename: 'content.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };

    html2pdf().set(options).from(contentElement).save();
};
