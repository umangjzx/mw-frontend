"use client";
import React from "react";
import { policyData } from "./policy";

const Policy = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2">{policyData.title}</h1>
                <p className="text-gray-600">Last Updated: {policyData.lastUpdated}</p>
            </div>

            {/* Introduction */}
            <div className="mb-8 space-y-4">
                <p className="text-gray-700">{policyData.introduction.text}</p>
                <p className="text-gray-700">{policyData.introduction.updateNote}</p>
            </div>

            {/* Special Protections Sections */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                {Object.entries(policyData.specialProtections).map(([key, section]) => (
                    <div key={key} className="bg-blue-50 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
                        <p className="text-gray-700 mb-4">{section.description}</p>
                        <ul className="list-disc pl-5 space-y-2">
                            {section.items.map((item, index) => (
                                <li key={index} className="text-gray-700">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Information Collection */}
            <div className="space-y-8 mb-8">
                <h2 className="text-2xl font-semibold">{policyData.informationCollection.title}</h2>
                {policyData.informationCollection.sections.map((section, index) => (
                    <section key={index} className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3">{section.subtitle}</h3>
                        <p className="text-gray-700 mb-4">{section.text}</p>
                        {section.items && (
                            <ul className="list-disc pl-5 space-y-2 mb-4">
                                {section.items.map((item, idx) => (
                                    <li key={idx} className="text-gray-700">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        )}
                        {section.additionalText && (
                            <p className="text-gray-700">{section.additionalText}</p>
                        )}
                    </section>
                ))}
            </div>

            {/* Sharing Information */}
            <div className="space-y-8 mb-8">
                <h2 className="text-2xl font-semibold">{policyData.sharingInformation.title}</h2>
                {policyData.sharingInformation.sections.map((section, index) => (
                    <section key={index} className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3">{section.subtitle}</h3>
                        <p className="text-gray-700">{section.text}</p>
                    </section>
                ))}
            </div>

            {/* Cookies and Tracking */}
            <div className="space-y-8 mb-8">
                <h2 className="text-2xl font-semibold">{policyData.cookiesAndTracking.title}</h2>
                {policyData.cookiesAndTracking.sections.map((section, index) => (
                    <section key={index} className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3">{section.subtitle}</h3>
                        <p className="text-gray-700">{section.text}</p>
                    </section>
                ))}
            </div>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{policyData.dataSecurity.title}</h2>
                <p className="text-gray-700">{policyData.dataSecurity.text}</p>
            </section>

            {/* Third Party Links */}
            <section className="mb-8 bg-gray-50 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">{policyData.thirdPartyLinks.title}</h2>
                <p className="text-gray-700">{policyData.thirdPartyLinks.text}</p>
            </section>

            {/* Policy Updates */}
            <section className="mb-8 bg-gray-50 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">{policyData.policyUpdates.title}</h2>
                <p className="text-gray-700">{policyData.policyUpdates.text}</p>
            </section>

            {/* Data Security */}

            {/* Contact */}
            <section className="bg-gray-50 p-6 rounded-lg mb-8">
                <h2 className="text-2xl font-semibold mb-4">{policyData.contact.title}</h2>
                <p className="text-gray-700">
                    {policyData.contact.text}
                    <br />
                    <a
                        href={`mailto:${policyData.contact.email}`}
                        className="text-blue-600 hover:underline"
                    >
                        {policyData.contact.email}
                    </a>
                </p>
            </section>

            {/* Commitment */}
            <section className="bg-blue-50 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">{policyData.commitment.title}</h2>
                <p className="text-gray-700">{policyData.commitment.text}</p>
            </section>
        </div>
    );
};

export default Policy;
