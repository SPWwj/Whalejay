declare module 'html2pdf.js' {
    type Html2PdfOptions = {
        margin?: [number, number];
        filename?: string;
        image?: { type: string; quality: number };
        html2canvas?: { scale: number };
        jsPDF?: { unit: string; format: string; orientation: string };
    };

    interface Html2Pdf {
        set(options: Html2PdfOptions): Html2Pdf;
        from(element: HTMLElement): Html2Pdf;
        save(): void;
    }

    const html2pdf: () => Html2Pdf;

    export default html2pdf;
}
