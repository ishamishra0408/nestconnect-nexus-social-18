
import { User, Friend, Message } from "@/types";

export const users: User[] = [
  {
    id: "1",
    username: "johndoe",
    email: "john.doe@nestconnect.com",
    name: "John Doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    role: "Manager",
    about_me: "I love building products that make people's lives better!",
    department: "Product",
    joined: "2023-01-15"
  },
  {
    id: "2",
    username: "janedoe",
    email: "jane.doe@nestconnect.com",
    name: "Jane Doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    role: "Employee",
    about_me: "Creating beautiful and intuitive user experiences is my passion.",
    department: "Design",
    joined: "2023-02-03"
  },
  {
    id: "3",
    username: "mikebrown",
    email: "mike.brown@nestconnect.com",
    name: "Mike Brown",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    role: "Employee",
    about_me: "Fullstack developer with a love for clean code and coffee.",
    department: "Engineering",
    joined: "2023-01-20"
  },
  {
    id: "4",
    username: "sarahjohnson",
    email: "sarah.johnson@nestconnect.com",
    name: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    role: "Employee",
    about_me: "Passionate about telling compelling stories through marketing.",
    department: "Marketing",
    joined: "2023-03-05"
  },
  {
    id: "5",
    username: "davidwilson",
    email: "david.wilson@nestconnect.com",
    name: "David Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    role: "Manager",
    about_me: "Dedicated to creating a positive workplace culture for everyone.",
    department: "Human Resources",
    joined: "2023-02-15"
  }
];

export const friends: Friend[] = [
  {
    id: "1",
    status: "accepted",
    user_id: "1",
    friend_id: "2"
  },
  {
    id: "2",
    status: "accepted",
    user_id: "1",
    friend_id: "3"
  },
  {
    id: "3",
    status: "pending",
    user_id: "1",
    friend_id: "4"
  },
  {
    id: "4",
    status: "accepted",
    user_id: "2",
    friend_id: "3"
  },
  {
    id: "5",
    status: "pending",
    user_id: "5",
    friend_id: "1"
  }
];

export const messages: Message[] = [
  {
    id: "1",
    text: "Hey everyone! Welcome to NestConnect. I'm excited to have you all here!",
    sender_id: "1",
    created_at: "2023-04-01T09:00:00Z",
    is_private: false,
    is_read: true
  },
  {
    id: "2",
    text: "Thanks for the warm welcome, John! Looking forward to collaborating with all of you.",
    sender_id: "2",
    created_at: "2023-04-01T09:05:00Z",
    is_private: false,
    is_read: true
  },
  {
    id: "3",
    text: "Hi Jane, can you send me the design files for the new project?",
    sender_id: "1",
    recipient_id: "2",
    created_at: "2023-04-01T09:10:00Z",
    is_private: true,
    is_read: true
  },
  {
    id: "4",
    text: "Sure thing, John! I'll send them over right away.",
    sender_id: "2",
    recipient_id: "1",
    created_at: "2023-04-01T09:12:00Z",
    is_private: true,
    is_read: true
  },
  {
    id: "5",
    text: "Does anyone have experience with React hooks? I need some help.",
    sender_id: "3",
    created_at: "2023-04-01T10:00:00Z",
    is_private: false,
    is_read: true
  },
  {
    id: "6",
    text: "I can help you with that, Mike! Let's schedule a call.",
    sender_id: "1",
    created_at: "2023-04-01T10:05:00Z",
    is_private: false,
    is_read: true
  },
  {
    id: "7",
    text: "Hey Mike, I sent you an invite for a meeting tomorrow at 2pm.",
    sender_id: "1",
    recipient_id: "3",
    created_at: "2023-04-01T10:10:00Z",
    is_private: true,
    is_read: false
  }
];
