import React from "react";
import PrintIcon from "@mui/icons-material/Print";
import "./PrintButton.scss";
import { printContentToPdf } from "../../utils/PrintPdf";
import { Button } from "@mui/material";

interface Props {
	id: string;
}

const PrintButton: React.FC<Props> = ({ id }) => {
	return (
		<div className="print-button">
			<Button
				variant="contained"
				color="primary"
				startIcon={<PrintIcon />}
				onClick={() => printContentToPdf(id)}
			>
				Print
			</Button>
		</div>
	);
};

export default PrintButton;
