type Props = {
    data: {
        [key: string]: string | number | boolean | null;
    };
};

const DetailsSection = ({ data }: Props) => {

    const totalWidth = Object.entries(data).length * 40;
    const className = `flex flex-col gap-2 w-full items-start justify-between ${totalWidth > 100 ? "w-[100%]" : ""}`;

    return <div className="flex w-full items-start justify-between">
        {Object.entries(data).map(([key, value]) => (
            <div key={key} className={className}>
                <p className="text-sm text-gray ">{key}</p>
                <p className="text-sm text-black font-medium">{value}</p>
            </div>
        ))}
    </div>;
};

export default DetailsSection;
