export interface Reminder {
  id: string;
  medicineName: string;
  dosage: string;
  time: string; // e.g. "8:00 AM" or "Morning and Night"
  foodInstruction: 'Before food' | 'After food';
  duration: string; // e.g. "5 days"
  status: 'Pending' | 'Taken' | 'Missed';
  createdAt: number;
}

export interface Caretaker {
  patientName: string;
  caretakerName: string;
  caretakerContact: string; // email or phone
}

export interface CaretakerAlert {
  id: string;
  patientName: string;
  message: string;
  timestamp: number;
}

export interface DashboardStats {
  total: number;
  taken: number;
  missed: number;
  pending: number;
}
