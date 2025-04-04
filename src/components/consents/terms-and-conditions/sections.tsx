import { sectionsData } from "./data";

const TermsAndConditionsSections = () => {
    return (
        <div className="flex flex-col gap-5">
            {sectionsData.map((section: any, sectionIndex: number) => (
                <div key={sectionIndex} className="flex flex-col gap-3">
                    <h3 className="text-lg font-bold">
                        {sectionIndex + 1}. {section.title}
                    </h3>
                    <div className="flex flex-col gap-3 pl-5">
                        {Array.isArray(section?.content) &&
                            section?.content.map((subSection: any, subIndex: number) =>
                                section?.contextType === "parent" && typeof subSection === "object" ? (
                                    <div key={`${sectionIndex}-${subIndex}`} className="flex flex-col gap-3">
                                        {subSection?.title && <h4 className="text-base font-semibold">{subSection?.title}</h4>}

                                        {/* Handle numbered list */}
                                        {subSection?.contextType === "list" ? (
                                            <ol className="list-decimal pl-10 flex flex-col gap-1">
                                                {subSection?.content.map((item: any, itemIndex: number) => (
                                                    <li
                                                        key={`${sectionIndex}-${subIndex}-${itemIndex}`}
                                                        className="text-base text-justify text-gray-600"
                                                        dangerouslySetInnerHTML={{ __html: item }}
                                                    />
                                                ))}
                                            </ol>
                                        ) : (
                                            subSection?.content.map((item: any, itemIndex: number) => (
                                                <p
                                                    key={`${sectionIndex}-${subIndex}-${itemIndex}`}
                                                    className="text-base text-justify text-gray-500"
                                                    dangerouslySetInnerHTML={{ __html: item }}
                                                />
                                            ))
                                        )}
                                    </div>
                                ) : (
                                    <p
                                        key={`${sectionIndex}-${subIndex}`}
                                        className="text-base text-justify text-gray-500"
                                        dangerouslySetInnerHTML={{ __html: subSection }}
                                    />
                                )
                            )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TermsAndConditionsSections;
