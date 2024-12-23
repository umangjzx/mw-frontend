import Button from "@/components/common/Button";
import { Table as AntTable } from "antd";
import {} from "nuqs";

interface Volunteer {
    id: string;
    name: string;
    classesTaken: number;
    subject: string;
}

interface Props {
    data: Volunteer[];
    isLoading?: boolean;
    handleMessageVolunteer: (volunteerId: string) => void;
    handleUploadTestimonial: (volunteerId: string) => void;
}

interface VolunteersTableProps {
    data: TableVolunteer[];
    handleMessageVolunteer: (id: string) => void;
    handleUploadTestimonial: (id: string) => void;
    loading?: boolean;
    pagination?: any;
    onChange?: (pagination: any) => void;
}

const VolunteersTable: React.FC<VolunteersTableProps> = ({
    data,
    handleMessageVolunteer,
    handleUploadTestimonial,
    loading,
    pagination,
    onChange,
}) => {
    const columns = [
        {
            title: "Volunteer Name",
            dataIndex: "name",
            key: "name",
            sorter: true,
            className: "!pl-7 px-6 py-4 text-sm w-1/5 font-medium text-gray-900",
        },
        {
            title: "Classes Taken",
            dataIndex: "classesTaken",
            key: "classesTaken",
            sorter: true,
            className: "!pl-7 px-6 py-4 text-sm w-1/5 bg-gray-50 text-gray-900",
        },
        {
            title: "Subject",
            dataIndex: "subject",
            key: "subject",
            sorter: false,
            className: "!pl-7 px-6 py-4 w-1/5 text-sm text-gray-900",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Volunteer) => (
                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => handleMessageVolunteer(record.id)}
                        btnVariant="link"
                        title="Message Volunteer"
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

export default VolunteersTable;
