import { Professional, Job, JobStatus } from "./types";

export const MOCK_PROFESSIONAL: Professional = {
  id: "p1",
  name: "Rajesh Kumar",
  phone: "+91 98765 43210",
  rating: 4.8,
  completedJobs: 127,
  isOnline: true,
  earningsToday: 1850,
  walletBalance: 12450,
  tier: "GOLD",
};

export const MOCK_JOBS: Job[] = [
  {
    id: "job1",
    serviceName: "Deep Home Cleaning",
    customerName: "Priya Sharma",
    customerPhone: "+91 99887 66554",
    address: "Flat 402, Oberoi Springs",
    addressLine2: "Bandra West, Mumbai",
    amount: 1499,
    paymentMethod: "CASH",
    status: JobStatus.ACCEPTED,
    distance: "2.3 km",
    duration: "90 mins",
    scheduledTime: "10:00 AM",
    otpStart: "4829",
  },
  {
    id: "job2",
    serviceName: "Sofa Cleaning",
    customerName: "Amit Patel",
    customerPhone: "+91 88776 55443",
    address: "201, Sea View Apartments",
    addressLine2: "Worli, Mumbai",
    amount: 499,
    paymentMethod: "ONLINE",
    status: JobStatus.PENDING,
    distance: "3.5 km",
    duration: "45 mins",
    scheduledTime: "2:00 PM",
  },
  {
    id: "job3",
    serviceName: "Bathroom Polish",
    customerName: "Neha Gupta",
    customerPhone: "+91 77665 44332",
    address: "B-12, Raheja Complex",
    addressLine2: "Andheri East, Mumbai",
    amount: 399,
    paymentMethod: "CASH",
    status: JobStatus.PENDING,
    distance: "4.1 km",
    duration: "60 mins",
    scheduledTime: "4:30 PM",
  },
];

export const MOCK_EARNINGS_HISTORY = [
  { date: "Today", amount: 1850, jobs: 3 },
  { date: "Yesterday", amount: 2340, jobs: 4 },
  { date: "Feb 4", amount: 1760, jobs: 3 },
  { date: "Feb 3", amount: 2890, jobs: 5 },
  { date: "Feb 2", amount: 1450, jobs: 2 },
];
