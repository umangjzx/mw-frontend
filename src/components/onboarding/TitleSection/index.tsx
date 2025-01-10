type Props = {
    title: string;
    description: string;
    rootClassName?: string;
    titleStyle?: string;
    descriptionStyle?: string;
};

const TitleSection = ({ title, description, rootClassName, titleStyle, descriptionStyle }: Props) => {
    return (
        <section className={`w-full flex flex-col items-center justify-center pt-16 md:pt-16 ${rootClassName}`}>
            <div className='max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 text-center'>
                <h1 className={`text-2xl lg:text-5xl font-medium lg:font-semibold tracking-tight text-gray-900 mb-6 ${titleStyle}`}>
                    {title}
                </h1>
                <p className={`text-sm lg:text-xl text-black lg:text-gray-600 italic ${descriptionStyle}`}>{description}</p>
            </div>
        </section>
    );
};

export default TitleSection;
