import { Comment, Post, SuccessStory } from "./types";

export const mockPosts: Post[] = [
  {
    id: "1",
    author: "Scarlet Ash",
    avatar: "/images/community-avatar.png",
    time: "02:22 AM",
    content:
      "Just got my UCAT results back... 2850! I'm so relieved. Does anyone know if this is competitive enough for KCL's dental program?",
    totalComments: 64,
    comments: [
      {
        id: "1-1",
        author: "Jasper Lane",
        avatar: "/images/community-avatar.png",
        time: "02:22 AM",
        content:
          "That's an incredible score, congratulations! With a 2850 you're in a very strong position for King's, just make sure your personal statement highlights your manual dexterity.",
      },
      {
        id: "1-2",
        author: "Mason Brooks",
        avatar: "/images/community-avatar.png",
        time: "02:22 AM",
        content:
          "I got an offer from KCL last year with a 2790. You should be absolutely fine! Focus on preparing for your actual interviews now.",
        isMentor: true,
        badge: "SL",
      },
      {
        id: "1-3",
        author: "Emma Wilson",
        avatar: "/images/community-avatar.png",
        time: "02:25 AM",
        content:
          "Thanks for sharing this! I've been struggling with similar challenges and this really helps put things into perspective.",
      },
      {
        id: "1-4",
        author: "Dr. Sarah Mitchell",
        avatar: "/images/community-avatar.png",
        time: "02:28 AM",
        content:
          "Great insights here! As someone who's been in the field for 10+ years, I can definitely relate to these experiences.",
        isMentor: true,
        badge: "DM",
      },
      {
        id: "1-5",
        author: "Alex Chen",
        avatar: "/images/community-avatar.png",
        time: "02:30 AM",
        content: "This is exactly what I needed to hear today. Thank you! 🙏",
      },
      {
        id: "1-6",
        author: "Jordan Smith",
        avatar: "/images/community-avatar.png",
        time: "02:35 AM",
        content:
          "I had a similar experience during my first year. It gets better with time and practice. Keep pushing forward!",
      },
      {
        id: "1-7",
        author: "Lisa Rodriguez",
        avatar: "/images/community-avatar.png",
        time: "02:40 AM",
        content:
          "Would love to connect and discuss this further. Mind if I send you a message?",
      },
      {
        id: "1-8",
        author: "Prof. Michael Johnson",
        avatar: "/images/community-avatar.png",
        time: "02:45 AM",
        content:
          "Excellent points raised here. This is why community support is so crucial in our field. Well articulated!",
        isMentor: true,
      },
    ],
  },
];

export const mockComments: Comment[] = [];

export const mockSuccessStories: SuccessStory[] = [
  {
    id: "1",
    title: "DentiSpark's free UCAT guide helped me score 2700!",
    author: "Neil Sims",
    location: "London, England",
    avatar: "/images/community-avatar.png",
    bgColor: "bg-secondary-50",
  },
  {
    id: "2",
    title: "DentiSpark's mock MMIs helped me secure 3 offers!",
    author: "Sarah Jenkins",
    location: "BDS Student, QMUL",
    avatar: "/images/community-avatar.png",
    bgColor: "bg-[#FDF0E6]",
  },
  {
    id: "3",
    title: "From 2400 to 2900 UCAT: My Journey",
    author: "David Chen",
    location: "First Year, King's College London",
    avatar: "/images/community-avatar.png",
    bgColor: "bg-[#E9F9EF]",
  },
];
