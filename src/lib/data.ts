export type ResourceCategory =
    | "Course"
    | "Resource"
    | "Videos"
    | "Project Ideas";

export interface Resource {
    id: number;
    title: string;
    category: ResourceCategory;
    link: string;
    description: string;
}

export const LearningResources: Resource[] = [
    {
        id: 1,
        title: "Solana Official Courses",
        category: "Course",
        link: "https://solana.com/developers/courses",
        description:
            "Courses provided by Solana Foundation to learn about Solana and its ecosystem.",
    },
    {
        id: 2,
        title: "Solana Cookbook",
        category: "Resource",
        link: "https://solanacookbook.com/",
        description:
            "Courses provided by Solana Foundation to learn about Solana and its ecosystem.",
    },
    {
        id: 3,
        title: "Questbook x Superteam",
        category: "Resource",
        link: "https://startonsolana.com/",
        description: "Learn how to build on the world's fastest blockchain.",
    },
    {
        id: 4,
        title: "Full Solana and Rust Programming Course for Beginners",
        category: "Course",
        link:
            "https://careerbooster.io/courses/full-solana-and-rust-programming-course-for-beginners",
        description:
            "Learn how to build on Solana with the Solana Developer Hub.",
    },
    {
        id: 5,
        title: "Solana Crash Course",
        category: "Videos",
        link:
            "https://www.youtube.com/playlist?list=PLfEHHr3qexv_FEcsuEEmiwSTKfahbYzVX",
        description:
            "Watch this beginner course and learn the basics of Solana!",
    },
    {
        id: 6,
        title: "Solana Dev Course - Solandy",
        category: "Videos",
        link:
            "https://www.youtube.com/playlist?list=PLmAMfj0qP2wwfnuRJQge2ss4sJxnhIqyt",
        description: "Solana Dev Course by Solandy.",
    },
    {
        id: 7,
        title: "Rust Solana Tutorial - Coding & Crypto",
        category: "Videos",
        link:
            "https://www.youtube.com/playlist?list=PLUBKxx7QjtVnU3hkPc8GF1Jh4DE7cf4n1",
        description: "Solana & Rust tutorial by Coding & Crypto.",
    },
    {
        id: 8,
        title: "Solana Hackathon Project Ideas",
        category: "Project Ideas",
        link:
            "https://github.com/Lightprotocol/solana-zero-hackathon/blob/main/ideas.md",
        description: "Project ideas for Solana Hackathons.",
    },
    {
        id: 9,
        title: "Find inspiration for your next project",
        category: "Project Ideas",
        link: "https://build.superteam.fun/",
        description: "Solana/Web3 project ideas by Superteam.",
    },
];
