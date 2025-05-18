
import { User, Friend, Message } from "@/types";

export const users: User[] = [
  {
    id: "1",
    username: "johndoe",
    email: "john.doe@nestconnect.com",
    name: "John Doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    role: "Product Manager",
    aboutMe: "I love building products that make people's lives better!",
    department: "Product",
    joined: "2023-01-15"
  },
  {
    id: "2",
    username: "janedoe",
    email: "jane.doe@nestconnect.com",
    name: "Jane Doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    role: "UI/UX Designer",
    aboutMe: "Creating beautiful and intuitive user experiences is my passion.",
    department: "Design",
    joined: "2023-02-03"
  },
  {
    id: "3",
    username: "mikebrown",
    email: "mike.brown@nestconnect.com",
    name: "Mike Brown",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    role: "Software Engineer",
    aboutMe: "Fullstack developer with a love for clean code and coffee.",
    department: "Engineering",
    joined: "2023-01-20"
  },
  {
    id: "4",
    username: "sarahjohnson",
    email: "sarah.johnson@nestconnect.com",
    name: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    role: "Marketing Specialist",
    aboutMe: "Passionate about telling compelling stories through marketing.",
    department: "Marketing",
    joined: "2023-03-05"
  },
  {
    id: "5",
    username: "davidwilson",
    email: "david.wilson@nestconnect.com",
    name: "David Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    role: "HR Manager",
    aboutMe: "Dedicated to creating a positive workplace culture for everyone.",
    department: "Human Resources",
    joined: "2023-02-15"
  }
];

export const friends: Friend[] = [
  {
    id: "1",
    status: "accepted",
    userId: "1",
    friendId: "2"
  },
  {
    id: "2",
    status: "accepted",
    userId: "1",
    friendId: "3"
  },
  {
    id: "3",
    status: "pending",
    userId: "1",
    friendId: "4"
  },
  {
    id: "4",
    status: "accepted",
    userId: "2",
    friendId: "3"
  },
  {
    id: "5",
    status: "pending",
    userId: "5",
    friendId: "1"
  }
];

export const messages: Message[] = [
  {
    id: "1",
    text: "Hey everyone! Welcome to NestConnect. I'm excited to have you all here!",
    senderId: "1",
    timestamp: "2023-04-01T09:00:00Z",
    isPrivate: false,
    isRead: true
  },
  {
    id: "2",
    text: "Thanks for the warm welcome, John! Looking forward to collaborating with all of you.",
    senderId: "2",
    timestamp: "2023-04-01T09:05:00Z",
    isPrivate: false,
    isRead: true
  },
  {
    id: "3",
    text: "Hi Jane, can you send me the design files for the new project?",
    senderId: "1",
    recipientId: "2",
    timestamp: "2023-04-01T09:10:00Z",
    isPrivate: true,
    isRead: true
  },
  {
    id: "4",
    text: "Sure thing, John! I'll send them over right away.",
    senderId: "2",
    recipientId: "1",
    timestamp: "2023-04-01T09:12:00Z",
    isPrivate: true,
    isRead: true
  },
  {
    id: "5",
    text: "Does anyone have experience with React hooks? I need some help.",
    senderId: "3",
    timestamp: "2023-04-01T10:00:00Z",
    isPrivate: false,
    isRead: true
  },
  {
    id: "6",
    text: "I can help you with that, Mike! Let's schedule a call.",
    senderId: "1",
    timestamp: "2023-04-01T10:05:00Z",
    isPrivate: false,
    isRead: true
  },
  {
    id: "7",
    text: "Hey Mike, I sent you an invite for a meeting tomorrow at 2pm.",
    senderId: "1",
    recipientId: "3",
    timestamp: "2023-04-01T10:10:00Z",
    isPrivate: true,
    isRead: false
  }
];
