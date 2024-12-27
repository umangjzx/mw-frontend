import Button from "@/components/common/Button";
import { Table as AntTable } from "antd";
import {} from "nuqs";

interface Learner {
    id: string;
    name: string;
    classesTaken: number;
    subject: string;
}

interface Props {
    data: Learner[];
    isLoading?: boolean;
    handleMessageLearner: (learnerId: string) => void;
    handleUploadTestimonial: (learnerId: string) => void;
}

interface LearnersTableProps {
    data: TableLearner[];
    handleMessageLearner: (id: string) => void;
    handleUploadTestimonial: (id: string) => void;
    loading?: boolean;
    pagination?: any;
    onChange?: (pagination: any) => void;
}

const LearnersTable: React.FC<LearnersTableProps> = ({
    data,
    handleMessageLearner,
    handleUploadTestimonial,
    loading,
    pagination,
    onChange,
}) => {
    const columns = [
        {
            title: "Learner Name",
            dataIndex: "name",
            key: "name",
            sorter: (a: any, b: any) => a?.name?.localeCompare(b?.name),
            className: "!pl-7 px-6 py-4 text-sm w-1/3 font-medium text-gray-900",
        },
        {
            title: "Classes Taken",
            dataIndex: "classesTaken",
            key: "classesTaken",
            sorter: (a: any, b: any) => a?.classesTaken - b?.classesTaken,
            className: "!pl-7 px-6 py-4 text-sm w-1/4 bg-gray-50 text-gray-900",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Learner) => (
                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => handleMessageLearner(record.id)}
                        btnVariant="link"
                        title="Message Learner"
                    />
                    <Button
                        onClick={() => handleUploadTestimonial(record.id)}
                        btnVariant="link"
                        title="Upload Testimonial"
                    />
                </div>
            ),
            className: "px-6 py-4",
        },
    ];

    return (
        <div className="w-full overflow-hidden h-full ">
            <AntTable
                className="!capitalize"
                dataSource={data}
                columns={columns}
                loading={loading}
                pagination={pagination}
                onChange={onChange}
                rowKey="id"
                showSorterTooltip={false}
                sticky
                scroll={{ x: "max-content" }}
            />
        </div>
    );
};

export default LearnersTable;
