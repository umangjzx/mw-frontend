import Button from "@/components/common/Button";
import { Table as AntTable } from "antd";
import { } from 'nuqs';

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

const LearnersTable = ({ data, isLoading = false, handleMessageLearner, handleUploadTestimonial }: Props) => {

    const columns = [
        {
            title: "Learner Name",
            dataIndex: "name",
            key: "name",
            sorter: true,
            className: "px-6 py-4 text-sm w-1/5 font-medium text-gray-900",
        },
        {
            title: "Classes Taken",
            dataIndex: "classesTaken",
            key: "classesTaken",
            sorter: true,
            className: "px-6 py-4 text-sm w-1/5 bg-gray-50 text-gray-900",
        },
        {
            title: "Subject",
            dataIndex: "subject",
            key: "subject",
            sorter: false,
            className: "px-6 py-4 w-1/5 text-sm text-gray-900",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Learner) => (
                <div className='flex items-center gap-2'>
                    <Button
                        onClick={() => handleMessageLearner(record.id)}
                        btnVariant='link'
                        title='Message Learner'
                    />
                    <Button
                        onClick={() => handleUploadTestimonial(record.id)}
                        btnVariant='link'
                        title='Upload Testimonial'
                    />
                </div>
            ),
            className: "px-6 py-4",
        },
    ];

    return (
        <div className='w-full overflow-hidden h-full '>
            <AntTable
                dataSource={data}
                columns={columns}
                loading={isLoading}
                pagination={{
                    pageSize: 10,
                    className: "px-6 py-3 !bg-white flex w-full flex justify-center items-center",
                    showSizeChanger: false,
                }}
                rowKey='id'
                onChange={(pagination, filters, sorter) => {
                    // Handle sorting here if needed
                    console.log(sorter);
                }}
                showSorterTooltip={false}
                sticky
                scroll={{ x: "max-content" }}
            />
        </div>
    );
};

export default LearnersTable;
