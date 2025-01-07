import {
    CreateIcon,
    ShareIcon,
    MatchIcon,
    ScheduleIcon,
    LearnerMatchIcon,
    LearnerScheduleIcon,
    SubjectIcon,
    SignUpIcon,
} from "@/assets/icons";
import DummyImage from "@/assets/images/BackgroundImg.jpeg";
import DonateImg1 from "@/assets/images/DonateImg1.png";
import DonateImg2 from "@/assets/images/DonateImg2.png";
import DonateImg3 from "@/assets/images/DonateImg3.png";
import DonateImg4 from "@/assets/images/DonateImg4.png";
import { TestimonialData } from "@/components/landingpage/testimonials";
import TestimonialDummyImg from "@/assets/images/TestimonialDummyImg.png";

const handleInnerWidth = () => {
    if (typeof window !== "undefined") {
        return window.innerWidth;
    }
    return 0;
};

export const gradientInnerTextStyle = {
    color: "#ffa766",
    backgroundImage: "linear-gradient(90deg, #ffa766 30%, #66dbff 54%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
} as const;

export const gradientTextStyle = {
    color: "#ffa766",
    backgroundImage: "linear-gradient(90deg, #009BCC 30%, #FF6C00 60%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
} as const;

export const imapactData = [
    {
        title: "10+",
        subTitle: "Hours Volunteers",
    },
    {
        title: "3",
        subTitle: "Students Reached",
    },
    {
        title: "5",
        subTitle: "Volunteer Engaged",
    },
];

export const cardData = [
    {
        title: "Our Mission",
        description:
            "Everyone deserves the chance to pursue their passions and realize their potential. For individuals with diverse disabilities, finding the right extracurricular activities often involves a journey of discovery that can be expensive. Our mission is to harness the talents of compassionate community volunteers to offer free classes to them.",
    },
    {
        title: "Our Vision",
        description:
            "We aspire to empower individuals with developmental disabilities and special needs to explore and discover what resonates with them, free from limitations of ability or financial barriers. Through these opportunities, we aim to foster joy, boost confidence, encourage self-expression, and open doors to lifelong hobbies, skills and career paths.",
    },
];

export const volunteerData = [
    {
        icon: <SignUpIcon />,
        iconMobile: <SignUpIcon width={44} height={44} />,
        title: "Sign up and fill out your profile",
    },
    {
        icon: <SubjectIcon />,
        iconMobile: <SubjectIcon width={44} height={44} />,
        title: "Choose the subject or skill you’d like to teach",
    },
    {
        icon: <LearnerMatchIcon />,
        iconMobile: <LearnerMatchIcon width={44} height={44} />,
        title: "Get matched with a learner based on your preferences",
    },
    {
        icon: <LearnerScheduleIcon />,
        iconMobile: <LearnerScheduleIcon width={44} height={44} />,
        title: "Schedule lessons that fit your availability",
    },
];

export const learnerData = [
    {
        icon: <CreateIcon />,
        iconMobile: <CreateIcon width={44} height={44} />,
        title: "Create a profile for your learner",
    },
    {
        icon: <ShareIcon />,
        iconMobile: <ShareIcon width={44} height={44} />,
        title: "Share your learner’s learning needs and interests",
    },
    {
        icon: <MatchIcon />,
        iconMobile: <MatchIcon width={44} height={44} />,
        title: "Get matched with a suitable tutor",
    },
    {
        icon: <ScheduleIcon />,
        iconMobile: <ScheduleIcon width={44} height={44} />,
        title: "Schedule classes that fit your schedule",
    },
];

export const blogData = [
    {
        image: DummyImage,
        category: "Technology",
        title: "The Future of AI",
        description:
            "Discover heartwarming stories from our community that showcase the impact of sharing knowledge and time.",
        date: "Mar 10, 2024",
        href: "/blogs/1",
    },
    {
        image: DummyImage,
        category: "Technology",
        title: "The Future of AI",
        description:
            "Discover heartwarming stories from our community that showcase the impact of sharing knowledge and time.",
        date: "Mar 10, 2024",
        href: "/blogs/1",
    },
    {
        image: DummyImage,
        category: "Technology",
        title: "The Future of AI",
        description:
            "Discover heartwarming stories from our community that showcase the impact of sharing knowledge and time.",
        date: "Mar 10, 2024",
        href: "/blogs/1",
    },
    {
        image: DummyImage,
        category: "Technology",
        title: "The Future of AI",
        description:
            "Discover heartwarming stories from our community that showcase the impact of sharing knowledge and time.",
        date: "Mar 10, 2024",
        href: "/blogs/1",
    },
    {
        image: DummyImage,
        category: "Technology",
        title: "The Future of AI",
        description:
            "Discover heartwarming stories from our community that showcase the impact of sharing knowledge and time.",
        date: "Mar 10, 2024",
        href: "/blogs/1",
    },
    {
        image: DummyImage,
        category: "Technology",
        title: "The Future of AI",
        description:
            "Discover heartwarming stories from our community that showcase the impact of sharing knowledge and time.",
        date: "Mar 10, 2024",
        href: "/blogs/1",
    },
    {
        image: DummyImage,
        category: "Technology",
        title: "The Future of AI",
        description:
            "Discover heartwarming stories from our community that showcase the impact of sharing knowledge and time.",
        date: "Mar 10, 2024",
        href: "/blogs/1",
    },
    {
        image: DummyImage,
        category: "Technology",
        title: "The Future of AI",
        description:
            "Discover heartwarming stories from our community that showcase the impact of sharing knowledge and time.",
        date: "Mar 10, 2024",
        href: "/blogs/1",
    },
    {
        image: DummyImage,
        category: "Technology",
        title: "The Future of AI",
        description:
            "Discover heartwarming stories from our community that showcase the impact of sharing knowledge and time.",
        date: "Mar 10, 2024",
        href: "/blogs/1",
    },
    {
        image: DummyImage,
        category: "Technology",
        title: "The Future of AI",
        description:
            "Discover heartwarming stories from our community that showcase the impact of sharing knowledge and time.",
        date: "Mar 10, 2024",
        href: "/blogs/1",
    },
    {
        image: DummyImage,
        category: "Technology",
        title: "The Future of AI",
        description:
            "Discover heartwarming stories from our community that showcase the impact of sharing knowledge and time.",
        date: "Mar 10, 2024",
        href: "/blogs/1",
    },
    {
        image: DummyImage,
        category: "Technology",
        title: "The Future of AI",
        description:
            "Discover heartwarming stories from our community that showcase the impact of sharing knowledge and time.",
        date: "Mar 10, 2024",
        href: "/blogs/1",
    },
];

export const donateCardData = [
    {
        title: "Learning Resources",
        subtitle: "Provide tools and materials tailored to each child's unique needs.",
        image: DonateImg1,
    },
    {
        title: "Volunteer Support",
        subtitle: "Enable training and resources for our amazing volunteers.",
        image: DonateImg2,
    },
    {
        title: "Maintain Platform ",
        subtitle: "Ensure seamless connectivity and access for both volunteers and learners",
        image: DonateImg3,
    },
    {
        title: "Community Growth",
        subtitle: "Expand our efforts to reach more children and families worldwide.",
        image: DonateImg4,
    },
];

export const testimonialsLearners: TestimonialData[] = [
    {
        category: "Learners",
        quote: "Teaching here has been life-changing. Seeing my learner’s progress and confidence grow makes every moment worth it. Teaching here has been life-changing. Seeing my learner’s progress and confidence grow makes every moment worth it.",
        author: "John Doe",
        role: "Volunteer Teacher",
        image: TestimonialDummyImg,
    },
    {
        category: "Learners",
        quote: "Teaching here has been life-changing. Seeing my learner’s progress and confidence grow makes every moment worth it. Teaching here has been life-changing. Seeing my learner’s progress and confidence grow makes every moment worth it.",

        author: "Jane Smith",
        role: "Math Teacher",
        image: TestimonialDummyImg,
    },
    // Add more testimonials as needed
];

export const testimonialsVolunteers: TestimonialData[] = [
    {
        category: "Volunteers",
        quote: "Teaching here has been life-changing. Seeing my learner’s progress and confidence grow makes every moment worth it. Teaching here has been life-changing. Seeing my learner’s progress and confidence grow makes every moment worth it.",
        author: "John Doe",
        role: "Volunteer Teacher",
        image: TestimonialDummyImg,
    },
    {
        category: "Volunteers",
        quote: "Teaching here has been life-changing. Seeing my learner’s progress and confidence grow makes every moment worth it. Teaching here has been life-changing. Seeing my learner’s progress and confidence grow makes every moment worth it.",
        author: "John Doe",
        role: "Volunteer Teacher",
        image: TestimonialDummyImg,
    },
];
