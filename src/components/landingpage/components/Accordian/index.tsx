"use client";
import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";
import { useState } from "react";

export default function Accordian({ items }: { items: any }) {
    const [expanded, setExpanded] = useState<string | false>(false);
    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <div className="font-poppins -ml-4">
            <Accordion
                sx={{
                    fontFamily: "Poppins !important",
                }}
                expanded={expanded === "panel1"}
                onChange={handleChange("panel1")}
                className="bg-background-input border-0 !shadow-none font-poppins"
            >
                <AccordionSummary
                    expandIcon={expanded === "panel1" ? <FaMinus /> : <FaPlus />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    sx={{
                        fontFamily: "Poppins !important",
                    }}
                    className="bg-background-input !border-0 !shadow-none !font-poppins"
                >
                    <div className="bg-background-input text-black text-xl font-medium !font-poppins -mb-3">
                        {items.label}
                    </div>
                </AccordionSummary>
                <AccordionDetails className="border-b font-poppins">
                    <div className="text-xl text-gray-light !font-normal italic !font-poppins">
                        {items.content}
                    </div>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}
