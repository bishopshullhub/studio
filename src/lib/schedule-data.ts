export type Activity = {
  id: string;
  activityName: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  category: 'Fitness' | 'Wellness' | 'Youth' | 'Community' | 'Education';
  description: string;
  contactInfo: string;
  frequency: string;
};

export const WEEKLY_SCHEDULE: Activity[] = [
  {
    id: '1',
    activityName: 'Rich Parkers Fitness',
    dayOfWeek: 'Monday',
    startTime: '06:30',
    endTime: '07:30',
    category: 'Fitness',
    description: 'High-intensity interval training to kickstart your week.',
    contactInfo: 'rich@parkerfitness.co.uk',
    frequency: 'Weekly'
  },
  {
    id: '2',
    activityName: 'Tai Chi',
    dayOfWeek: 'Monday',
    startTime: '10:00',
    endTime: '11:30',
    category: 'Wellness',
    description: 'Slow, meditative movements for health and relaxation.',
    contactInfo: 'taichi@villagehall.org',
    frequency: 'Weekly'
  },
  {
    id: '3',
    activityName: 'Youth Club Trial',
    dayOfWeek: 'Saturday',
    startTime: '18:00',
    endTime: '21:00',
    category: 'Youth',
    description: 'A dedicated space for secondary school age children.',
    contactInfo: 'youth@bhhub.co.uk',
    frequency: 'Every 3rd Saturday'
  },
  {
    id: '4',
    activityName: 'Hub Cafe',
    dayOfWeek: 'Saturday',
    startTime: '10:00',
    endTime: '12:00',
    category: 'Community',
    description: 'Coffee, homemade cake, and community conversation.',
    contactInfo: 'info@bhhub.co.uk',
    frequency: 'Second Saturday of the month'
  },
  {
    id: '5',
    activityName: 'Zumba with Zoe',
    dayOfWeek: 'Wednesday',
    startTime: '19:00',
    endTime: '20:00',
    category: 'Fitness',
    description: 'Ditch the workout, join the party! High energy dance fitness.',
    contactInfo: 'zoezumba@gmail.com',
    frequency: 'Weekly'
  },
  {
    id: '6',
    activityName: 'Pilates',
    dayOfWeek: 'Tuesday',
    startTime: '14:00',
    endTime: '15:30',
    category: 'Wellness',
    description: 'Focus on core strength, flexibility, and posture.',
    contactInfo: 'pilates-jane@outlook.com',
    frequency: 'Weekly'
  },
  {
    id: '7',
    activityName: 'Tae Kwon Do',
    dayOfWeek: 'Thursday',
    startTime: '18:30',
    endTime: '20:00',
    category: 'Fitness',
    description: 'Traditional martial arts training for all ages and skill levels.',
    contactInfo: 'taekwondo-taunton@live.co.uk',
    frequency: 'Weekly'
  }
];

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const CATEGORIES = ['Fitness', 'Wellness', 'Youth', 'Community', 'Education'];