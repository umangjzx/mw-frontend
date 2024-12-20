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

export const gradientInnerTextStyle = {
    color: "#ffa766",
    backgroundImage: "linear-gradient(90deg, #ffa766 30%, #66dbff 54%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
} as const;

export const gradientTextStyle = {
    color: "#ffa766",
    backgroundImage: "linear-gradient(90deg,#009BCC 30%,  #FF6C00 60%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
} as const;

export const imapactData = [
    {
        title: "1000+",
        subTitle: "Hours Volunteers",
    },
    {
        title: "2500+",
        subTitle: "Students Reached",
    },
    {
        title: "500+",
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
        title: "Sign up and fill out your profile",
    },
    {
        icon: <SubjectIcon />,
        title: "Choose the subject or skill you’d like to teach",
    },
    {
        icon: <LearnerMatchIcon />,
        title: "Get matched with a learner based on your preferences",
    },
    {
        icon: <LearnerScheduleIcon />,
        title: "Schedule lessons that fit your availability",
    },
];

export const learnerData = [
    {
        icon: <CreateIcon />,
        title: "Create a profile for your learner",
    },
    {
        icon: <ShareIcon />,
        title: "Share your learner’s learning needs and interests",
    },
    {
        icon: <MatchIcon />,
        title: "Get matched with a suitable tutor",
    },
    {
        icon: <ScheduleIcon />,
        title: "Schedule classes that fit your schedule",
    },
];
