type Props = {
    title: string;
    description: string;
};

const TitleSection = ({ title, description }: Props) => {
    return (
        <section className='w-full flex flex-col items-center justify-center pt-16 md:pt-16'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
                <h1 className='text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 mb-6'>
                    {title}
                </h1>
                <p className='text-xl md:text-2xl text-gray-600 italic'>{description}</p>
            </div>
        </section>
    );
};

export default TitleSection;
