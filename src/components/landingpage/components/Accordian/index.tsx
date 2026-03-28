"use client";

import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";
import { useState } from "react";

export type FaqAccordionItem = {
    key: string;
    label: string;
    content: string;
};

type AccordianProps = {
    items: FaqAccordionItem;
    /** When true, this panel starts expanded (e.g. first FAQ). */
    defaultExpanded?: boolean;
};

export default function Accordian({ items, defaultExpanded = false }: AccordianProps) {
    const [expanded, setExpanded] = useState(defaultExpanded);
    const panelId = `faq-panel-${items.key}`;

    return (
        <Accordion
            expanded={expanded}
            onChange={(_, next) => setExpanded(next)}
            elevation={0}
            disableGutters
            className="bg-transparent !shadow-none border-0 font-poppins before:!hidden"
            sx={{
                fontFamily: "Poppins, sans-serif",
                "&:before": { display: "none" },
            }}
        >
            <AccordionSummary
                expandIcon={
                    <span className="flex md:h-9 md:w-9 h-6 w-6 shrink-0 items-center justify-center text-[#121212]">
                        {expanded ? (
                            <FaMinus className="text-[20px]" aria-hidden />
                        ) : (
                            <FaPlus className="text-[20px]" aria-hidden />
                        )}
                    </span>
                }
                aria-controls={`${panelId}-content`}
                id={`${panelId}-header`}
                className="min-h-0 px-0 py-4 hover:!bg-transparent [&_.MuiAccordionSummary-content]:my-0 [&_.MuiAccordionSummary-content]:items-center"
                sx={{
                    fontFamily: "Poppins, sans-serif",
                    "& .MuiAccordionSummary-expandIconWrapper": { marginRight: 0 },
                }}
            >
                <div className="w-full pr-2 text-left md:text-[20px] text-[16px] font-medium text-[#121212]">
                    {items.label}
                </div>
            </AccordionSummary>
            <AccordionDetails className="border-0 px-0 pb-4 pt-0 font-poppins">
                <p className="md:text-[20px] text-[12px] font-normal italic leading-relaxed text-[#4F4F4F] md:text-base">
                    {items.content}
                </p>
            </AccordionDetails>
        </Accordion>
    );
}
